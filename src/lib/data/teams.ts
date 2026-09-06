import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { TeamRow } from "@/types/database";

export async function listTeams() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("teams").select("*").order("name", { ascending: true });
  if (error) return [];
  return (data ?? []) as TeamRow[];
}

export async function getTeamRoster(teamId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("team_members")
    .select("*, profile:profiles!team_members_profile_id_fkey(id, full_name, preferred_name, grade)")
    .eq("team_id", teamId);
  if (error) return [];
  return data ?? [];
}

export async function listAllTeamMemberships() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("team_members").select("team_id, profile_id");
  if (error) return [];
  return data ?? [];
}

export async function listAllEventAssignments() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_assignments")
    .select(
      "*, event:scioly_events(id, name, category), profile:profiles!event_assignments_profile_id_fkey(id, full_name, preferred_name, grade), partner:profiles!event_assignments_partner_profile_id_fkey(id, full_name, preferred_name), team:teams(id, name)"
    )
    .order("event_id");
  if (error) return [];
  return data ?? [];
}
