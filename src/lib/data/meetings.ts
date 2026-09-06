import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { MeetingRow } from "@/types/database";

export async function getNextMeeting() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .gte("meeting_date", today)
    .order("meeting_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data as MeetingRow | null;
}

export async function listPastMeetings(limit = 20) {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .lt("meeting_date", today)
    .order("meeting_date", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as MeetingRow[];
}

export async function listUpcomingMeetings(limit = 5) {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .gte("meeting_date", today)
    .order("meeting_date", { ascending: true })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as MeetingRow[];
}

export async function listAllMeetingsForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .order("meeting_date", { ascending: false });
  if (error) return [];
  return (data ?? []) as MeetingRow[];
}

export async function getMeetingEvents(meetingId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("meeting_events")
    .select("event:scioly_events(id, name, slug, icon)")
    .eq("meeting_id", meetingId);
  return (data ?? []).map((r) => r.event).filter(Boolean);
}

export async function getMeetingAttachments(meetingId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("meeting_attachments")
    .select("*")
    .eq("meeting_id", meetingId)
    .order("created_at", { ascending: true });
  return data ?? [];
}
