"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/session";
import type { ActionResult } from "@/components/admin/crud-dialog";
import type { CalendarCategory } from "@/types/database";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertCalendarEventAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireStaff();

  const id = str(formData, "id");
  const title = str(formData, "title");
  const description = str(formData, "description");
  const category = str(formData, "category") as CalendarCategory;
  const location = str(formData, "location");
  const startAt = str(formData, "start_at");
  const endAt = str(formData, "end_at");
  const allDay = str(formData, "all_day") === "true";

  if (title.length < 2) return { success: false, error: "Title is required." };
  if (!startAt) return { success: false, error: "Start date/time is required." };

  const supabase = await createClient();
  const payload = {
    title,
    description: description || null,
    category,
    location: location || null,
    start_at: new Date(startAt).toISOString(),
    end_at: new Date(endAt || startAt).toISOString(),
    all_day: allDay,
  };

  const { error } = id
    ? await supabase.from("calendar_events").update(payload).eq("id", id)
    : await supabase.from("calendar_events").insert(payload);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/calendar");
  revalidatePath("/calendar");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCalendarEventAction(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("calendar_events").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/calendar");
  revalidatePath("/calendar");
  return { success: true };
}
