import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { CompetitionRow } from "@/types/database";

export async function listCompetitions() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .order("competition_date", { ascending: false });
  if (error) throw new Error(`Failed to load competitions: ${error.message}`);
  return data as CompetitionRow[];
}

export async function getNextCompetition() {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .gte("competition_date", today)
    .order("competition_date", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) return null;
  return data as CompetitionRow | null;
}

export async function getCompetitionBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competitions")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load competition: ${error.message}`);
  return data as CompetitionRow | null;
}

export async function getCompetitionTeams(competitionId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("competition_teams")
    .select("team:teams(id, name, season)")
    .eq("competition_id", competitionId);
  return (data ?? []).map((r) => r.team).filter(Boolean);
}

export async function getCompetitionSchedule(competitionId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("competition_schedule")
    .select("*, event:scioly_events(name, slug)")
    .eq("competition_id", competitionId)
    .order("start_time", { ascending: true });
  return data ?? [];
}

export async function getCompetitionAssignments(competitionId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("competition_assignments")
    .select("*, event:scioly_events(name, slug), profile:profiles(id, full_name, grade), team:teams(name)")
    .eq("competition_id", competitionId)
    .order("event_id");
  return data ?? [];
}

export async function getCompetitionResults(competitionId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("competition_results")
    .select("*, event:scioly_events(name, slug), team:teams(name)")
    .eq("competition_id", competitionId)
    .order("placement", { ascending: true, nullsFirst: false });
  return data ?? [];
}
