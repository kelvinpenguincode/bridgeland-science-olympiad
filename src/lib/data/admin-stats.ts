import "server-only";
import { createClient } from "@/lib/supabase/server";

export interface AdminStats {
  totalMembers: number;
  activeEvents: number;
  upcomingMeetings: number;
  upcomingCompetitions: number;
  unassignedEvents: number;
  totalResources: number;
  attendanceRate: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    { count: totalMembers },
    { count: activeEvents },
    { count: upcomingMeetings },
    { count: upcomingCompetitions },
    { count: totalResources },
    { data: activeEventRows },
    { data: rostered },
    { data: attendanceRows },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("scioly_events").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("meetings").select("*", { count: "exact", head: true }).gte("meeting_date", today),
    supabase.from("competitions").select("*", { count: "exact", head: true }).gte("competition_date", today),
    supabase.from("resources").select("*", { count: "exact", head: true }),
    supabase.from("scioly_events").select("id").eq("is_active", true),
    supabase.from("event_members").select("event_id"),
    supabase.from("meeting_attendance").select("status"),
  ]);

  const rosteredEventIds = new Set((rostered ?? []).map((r) => r.event_id));
  const unassignedEvents = (activeEventRows ?? []).filter((e) => !rosteredEventIds.has(e.id)).length;

  const attendanceTotal = attendanceRows?.length ?? 0;
  const attended = (attendanceRows ?? []).filter((r) => r.status === "present" || r.status === "late").length;
  const attendanceRate = attendanceTotal > 0 ? Math.round((attended / attendanceTotal) * 100) : 0;

  return {
    totalMembers: totalMembers ?? 0,
    activeEvents: activeEvents ?? 0,
    upcomingMeetings: upcomingMeetings ?? 0,
    upcomingCompetitions: upcomingCompetitions ?? 0,
    unassignedEvents,
    totalResources: totalResources ?? 0,
    attendanceRate,
  };
}

export async function getRecentActivity(limit = 8) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("id, title, publish_at, posted_as, author:profiles(full_name, role)")
    .order("publish_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
