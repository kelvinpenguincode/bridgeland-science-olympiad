"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/session";
import type { ActionResult } from "@/components/admin/crud-dialog";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertMeetingAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireStaff();

  const id = str(formData, "id");
  const title = str(formData, "title");
  const meetingDate = str(formData, "meeting_date");
  const startTime = str(formData, "start_time");
  const endTime = str(formData, "end_time");
  const location = str(formData, "location");
  const description = str(formData, "description");
  const agenda = str(formData, "agenda");
  const requiredMaterials = str(formData, "required_materials");
  const attendanceRequired = str(formData, "attendance_required") === "true";
  const notes = str(formData, "notes");
  const slideUrl = str(formData, "slide_url");

  if (title.length < 2) return { success: false, error: "Title is required." };
  if (!meetingDate) return { success: false, error: "Meeting date is required." };
  if (!startTime) return { success: false, error: "Start time is required." };
  if (location.length < 1) return { success: false, error: "Location is required." };

  const supabase = await createClient();
  const payload = {
    title,
    meeting_date: meetingDate,
    start_time: startTime,
    end_time: endTime || null,
    location,
    description: description || null,
    agenda: agenda || null,
    required_materials: requiredMaterials || null,
    attendance_required: attendanceRequired,
    notes: notes || null,
    slide_url: slideUrl || null,
  };

  const { error } = id
    ? await supabase.from("meetings").update(payload).eq("id", id)
    : await supabase.from("meetings").insert(payload);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/meetings");
  revalidatePath("/meetings");
  revalidatePath("/");
  return { success: true };
}

export async function deleteMeetingAction(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("meetings").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/meetings");
  revalidatePath("/meetings");
  return { success: true };
}
