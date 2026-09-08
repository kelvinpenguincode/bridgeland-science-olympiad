"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/components/admin/crud-dialog";

export async function claimFirstAdminAction(): Promise<ActionResult> {
  const profile = await requireUser("/dashboard");
  const supabase = await createClient();

  const { data: claimed, error: rpcError } = await supabase.rpc("claim_first_admin");
  if (!rpcError && claimed) {
    revalidatePath("/", "layout");
    return { success: true };
  }

  if (rpcError && !/could not find the function/i.test(rpcError.message)) {
    return { success: false, error: rpcError.message };
  }

  try {
    const admin = createAdminClient();
    const { count } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .in("role", ["admin", "sponsor"]);

    if ((count ?? 0) > 0) {
      return { success: false, error: "An admin already exists." };
    }

    const { data: updated, error } = await admin
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", profile.id)
      .select("role")
      .maybeSingle();

    if (error) return { success: false, error: error.message };
    if (updated?.role !== "admin") {
      return {
        success: false,
        error: "The database blocked the role change. Run supabase/migrations/20260907000002_claim_first_admin.sql in the SQL Editor, then try again.",
      };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Admin bootstrap is unavailable.",
    };
  }
}
