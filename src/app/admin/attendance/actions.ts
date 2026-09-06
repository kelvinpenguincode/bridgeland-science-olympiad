"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/session";
import type { ActionResult } from "@/components/admin/crud-dialog";
import type { AttendanceStatus } from "@/types/database";

export interface AttendanceEntry {
  profileId: string;
  status: AttendanceStatus;
}

export async function saveAttendanceAction(meetingId: string, entries: AttendanceEntry[]): Promise<ActionResult> {
  const staff = await requireStaff();
  if (!meetingId) return { success: false, error: "Missing meeting." };
  if (entries.length === 0) return { success: true };

  const supabase = await createClient();
  const { error } = await supabase.from("meeting_attendance").upsert(
    entries.map((e) => ({
      meeting_id: meetingId,
      profile_id: e.profileId,
      status: e.status,
      marked_by: staff.id,
      marked_at: new Date().toISOString(),
    })),
    { onConflict: "meeting_id,profile_id" }
  );

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/attendance");
  revalidatePath("/dashboard/attendance");
  return { success: true };
}
