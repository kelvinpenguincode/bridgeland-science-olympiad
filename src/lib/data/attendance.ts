import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AttendanceStatus } from "@/types/database";

export interface AttendanceStats {
  totalMeetings: number;
  present: number;
  late: number;
  excused: number;
  absent: number;
  attendancePercentage: number;
}

/** A member's own attendance history (RLS restricts to their own rows). */
export async function getMyAttendanceRecords(profileId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meeting_attendance")
    .select("*, meeting:meetings(id, title, meeting_date)")
    .eq("profile_id", profileId)
    .order("marked_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getMyAttendanceStats(profileId: string): Promise<AttendanceStats> {
  const records = await getMyAttendanceRecords(profileId);
  const counts: Record<AttendanceStatus, number> = { present: 0, late: 0, excused: 0, absent: 0 };
  for (const r of records) counts[r.status] += 1;
  const total = records.length;
  const attended = counts.present + counts.late;
  return {
    totalMeetings: total,
    present: counts.present,
    late: counts.late,
    excused: counts.excused,
    absent: counts.absent,
    attendancePercentage: total > 0 ? Math.round((attended / total) * 100) : 0,
  };
}

/** All attendance sessions (distinct meetings) available for officers to manage. */
export async function listAttendanceMeetings(limit = 30) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .order("meeting_date", { ascending: false })
    .limit(limit);
  if (error) return [];
  return data ?? [];
}

/** Full roster attendance for a given meeting (staff-only via RLS). */
export async function getMeetingAttendanceRoster(meetingId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meeting_attendance")
    .select("*, profile:profiles!meeting_attendance_profile_id_fkey(id, full_name, preferred_name, grade)")
    .eq("meeting_id", meetingId);
  if (error) return [];
  return data ?? [];
}
