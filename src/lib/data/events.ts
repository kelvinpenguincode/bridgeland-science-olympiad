import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { EventCategory, SciolyEventRow } from "@/types/database";

export async function listEvents(opts: { category?: EventCategory; search?: string } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("scioly_events")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (opts.category) {
    query = query.eq("category", opts.category);
  }
  if (opts.search) {
    query = query.or(`name.ilike.%${opts.search}%,description.ilike.%${opts.search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to load events: ${error.message}`);
  return data as SciolyEventRow[];
}

export async function listAllEventsForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scioly_events")
    .select("*")
    .order("category", { ascending: true })
    .order("display_order", { ascending: true });
  if (error) return [];
  return data as SciolyEventRow[];
}

export async function getEventBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("scioly_events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load event: ${error.message}`);
  return data as SciolyEventRow | null;
}

export async function getEventRoster(eventId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_members")
    .select("*, profile:profiles!event_members_profile_id_fkey(id, full_name, preferred_name, grade, avatar_url)")
    .eq("event_id", eventId)
    .order("role", { ascending: true });
  if (error) return []; // RLS blocks anonymous users — treat as empty, not fatal
  return data ?? [];
}

/** Officers table uses the convention "Event Captain — <Event Name>" in role_title. */
export async function getEventCaptainOfficer(eventName: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("officers")
    .select("*")
    .eq("category", "event_captain")
    .eq("is_active", true)
    .ilike("role_title", `%${eventName}%`)
    .limit(1)
    .maybeSingle();
  return data ?? null;
}

export async function listEventResources(eventId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getEventNextPractice(eventName: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("calendar_events")
    .select("*")
    .in("category", ["event_practice", "practice_test"])
    .gte("start_at", new Date().toISOString())
    .order("start_at", { ascending: true })
    .limit(20);
  const nameLower = eventName.toLowerCase();
  return (data ?? []).find((c) => c.title.toLowerCase().includes(nameLower)) ?? null;
}

export async function getEventCompetitionHistory(eventId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competition_results")
    .select("*, competition:competitions(name, slug, competition_date)")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}
