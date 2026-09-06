import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Team(s) the given profile belongs to. */
export async function getMyTeams(profileId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("team:teams(id, name, season, description)")
    .eq("profile_id", profileId);
  if (error) return [];
  return (data ?? [])
    .map((r) => r.team)
    .filter((t): t is { id: string; name: string; season: string; description: string | null } => !!t);
}

/** Events the given profile is rostered on, with partner + event details. */
export async function getMyEventMemberships(profileId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_members")
    .select(
      "*, event:scioly_events(id, name, slug, icon, category), partner:profiles!event_members_partner_profile_id_fkey(id, full_name, preferred_name)"
    )
    .eq("profile_id", profileId)
    .order("created_at", { ascending: true });
  if (error) return [];
  return data ?? [];
}

/** Officers whose role_title is an "Event Captain" match for the given event name. */
export async function getEventCaptainName(eventName: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("officers")
    .select("full_name")
    .eq("category", "event_captain")
    .eq("is_active", true)
    .ilike("role_title", `%${eventName}%`)
    .limit(1)
    .maybeSingle();
  return data?.full_name ?? null;
}
