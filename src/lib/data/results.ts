import "server-only";
import { createClient } from "@/lib/supabase/server";
import { academicYearOf } from "@/lib/utils/date";

export interface ResultFilters {
  year?: string;
  competitionId?: string;
  eventId?: string;
  teamId?: string;
}

export async function listResults(filters: ResultFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("competition_results")
    .select(
      "*, competition:competitions(name, slug, competition_date, type), event:scioly_events(name, slug), team:teams(name)"
    )
    .order("created_at", { ascending: false });

  if (filters.competitionId) query = query.eq("competition_id", filters.competitionId);
  if (filters.eventId) query = query.eq("event_id", filters.eventId);
  if (filters.teamId) query = query.eq("team_id", filters.teamId);

  const { data, error } = await query;
  if (error) return [];
  let rows = data ?? [];
  if (filters.year) {
    rows = rows.filter((r) => {
      const comp = r.competition as unknown as { competition_date: string } | null;
      return comp?.competition_date?.startsWith(filters.year!.slice(0, 4)) || academicYearOf(comp?.competition_date) === filters.year;
    });
  }
  return rows;
}

export interface ResultStats {
  totalMedals: number;
  goldCount: number;
  silverCount: number;
  bronzeCount: number;
  podiumFinishes: number;
  avgTeamPlacement: number | null;
  bestEvents: { event: string; count: number }[];
}

export async function getResultStats(): Promise<ResultStats> {
  const empty: ResultStats = {
    totalMedals: 0,
    goldCount: 0,
    silverCount: 0,
    bronzeCount: 0,
    podiumFinishes: 0,
    avgTeamPlacement: null,
    bestEvents: [],
  };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competition_results")
    .select("*, competition:competitions(name, competition_date), event:scioly_events(name)");
  if (error || !data) return empty;

  const medals = data.filter((r) => r.medal !== "none");
  const overallPlacements = data.filter((r) => !r.event_id && r.placement != null);
  const avgTeamPlacement = overallPlacements.length
    ? overallPlacements.reduce((sum, r) => sum + (r.placement ?? 0), 0) / overallPlacements.length
    : null;

  const eventMedalCounts = new Map<string, number>();
  for (const r of data) {
    const eventName = (r.event as { name: string } | null)?.name;
    if (eventName && r.medal !== "none") {
      eventMedalCounts.set(eventName, (eventMedalCounts.get(eventName) ?? 0) + 1);
    }
  }
  const bestEvents = Array.from(eventMedalCounts.entries())
    .map(([event, count]) => ({ event, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalMedals: medals.length,
    goldCount: data.filter((r) => r.medal === "gold").length,
    silverCount: data.filter((r) => r.medal === "silver").length,
    bronzeCount: data.filter((r) => r.medal === "bronze").length,
    podiumFinishes: data.filter((r) => r.placement != null && r.placement <= 3).length,
    avgTeamPlacement,
    bestEvents,
  };
}
