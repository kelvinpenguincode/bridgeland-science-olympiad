"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, requireStaff } from "@/lib/auth/session";
import type { ActionResult } from "@/components/admin/crud-dialog";
import type { AppRole } from "@/types/database";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

/** Admin-only: update a member's role, grade, and active status. */
export async function updateMemberAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const id = str(formData, "id");
  const fullName = str(formData, "full_name");
  const role = str(formData, "role") as AppRole;
  const grade = str(formData, "grade");
  const preferredName = str(formData, "preferred_name");
  const phone = str(formData, "phone");
  const isActive = str(formData, "is_active") === "true";

  if (!id) return { success: false, error: "Missing member id." };
  if (fullName.length < 2) return { success: false, error: "Full name is required." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      role,
      grade: grade ? Number(grade) : null,
      preferred_name: preferredName || null,
      phone: phone || null,
      is_active: isActive,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/members");
  return { success: true };
}

/** Staff (officer+) can deactivate a member as a softer alternative to deletion. */
export async function setMemberActiveAction(id: string, isActive: boolean): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ is_active: isActive }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/members");
  return { success: true };
}
