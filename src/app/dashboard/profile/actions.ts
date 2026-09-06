"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth/session";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function updateProfileAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const profile = await requireUser();

  const fullName = String(formData.get("fullName") ?? "").trim();
  const preferredName = String(formData.get("preferredName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();

  if (fullName.length < 2) {
    return { success: false, error: "Full name must be at least 2 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      preferred_name: preferredName || null,
      phone: phone || null,
      bio: bio || null,
    })
    .eq("id", profile.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { success: true };
}
