"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaffOrCaptain } from "@/lib/auth/session";
import type { ActionResult } from "@/components/admin/crud-dialog";
import type { ResourceDifficulty, ResourceType, ResourceVisibility } from "@/types/database";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertResourceAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const profile = await requireStaffOrCaptain();

  const id = str(formData, "id");
  const title = str(formData, "title");
  const description = str(formData, "description");
  const eventId = str(formData, "event_id");
  const year = Number(str(formData, "year") || new Date().getFullYear());
  const type = str(formData, "type") as ResourceType;
  const url = str(formData, "url");
  const visibility = str(formData, "visibility") as ResourceVisibility;
  const difficulty = str(formData, "difficulty") as ResourceDifficulty | "";

  if (title.length < 2) return { success: false, error: "Title is required." };
  if (!url) return { success: false, error: "A URL is required (link to the file or resource)." };

  const supabase = await createClient();
  const payload = {
    title,
    description: description || null,
    event_id: eventId || null,
    year,
    type,
    url,
    visibility,
    difficulty: difficulty || null,
    author_id: profile?.id ?? null,
  };

  const { error } = id
    ? await supabase.from("resources").update(payload).eq("id", id)
    : await supabase.from("resources").insert(payload);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  revalidatePath("/dashboard/resources");
  return { success: true };
}

export async function deleteResourceAction(id: string): Promise<ActionResult> {
  await requireStaffOrCaptain();
  const supabase = await createClient();
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true };
}
