"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/session";
import type { ActionResult } from "@/components/admin/crud-dialog";
import type { OfficerCategory } from "@/types/database";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertOfficerAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireStaff();

  const id = str(formData, "id");
  const fullName = str(formData, "full_name");
  const roleTitle = str(formData, "role_title");
  const category = str(formData, "category") as OfficerCategory;
  const grade = str(formData, "grade");
  const bio = str(formData, "bio");
  const funFact = str(formData, "fun_fact");
  const photoUrl = str(formData, "photo_url");
  const emailPublic = str(formData, "email_public");
  const displayOrder = Number(str(formData, "display_order") || 0);
  const isActive = str(formData, "is_active") === "true";

  if (fullName.length < 2) return { success: false, error: "Full name is required." };
  if (roleTitle.length < 2) return { success: false, error: "Role title is required." };

  const supabase = await createClient();
  const payload = {
    full_name: fullName,
    role_title: roleTitle,
    category,
    grade: grade || null,
    bio: bio || null,
    fun_fact: funFact || null,
    photo_url: photoUrl || null,
    email_public: emailPublic || null,
    display_order: displayOrder,
    is_active: isActive,
  };

  const { error } = id
    ? await supabase.from("officers").update(payload).eq("id", id)
    : await supabase.from("officers").insert(payload);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/officers");
  revalidatePath("/team");
  return { success: true };
}

export async function deleteOfficerAction(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("officers").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/officers");
  revalidatePath("/team");
  return { success: true };
}
