"use client";

import { useMemo, useState } from "react";
import { Trophy } from "lucide-react";
import { FilterBar, ALL_VALUE, type FilterConfig } from "@/components/shared/filter-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { ResultBadge } from "@/components/shared/event-badge";
import { formatDate } from "@/lib/utils/date";
import { academicYearOf } from "@/lib/utils/date";
import type { CompetitionResultRow } from "@/types/database";

export interface ResultRow extends CompetitionResultRow {
  competition: { name: string; slug: string; competition_date: string; type: string } | null;
  event: { name: string; slug: string } | null;
  team: { name: string } | null;
}

export function ResultsExplorer({ results }: { results: ResultRow[] }) {
  const [year, setYear] = useState(ALL_VALUE);
  const [competition, setCompetition] = useState(ALL_VALUE);
  const [event, setEvent] = useState(ALL_VALUE);
  const [team, setTeam] = useState(ALL_VALUE);

  const years = useMemo(
    () => Array.from(new Set(results.map((r) => academicYearOf(r.competition?.competition_date)).filter(Boolean))).sort().reverse(),
    [results]
  );
  const competitions = useMemo(
    () => Array.from(new Map(results.map((r) => [r.competition?.slug, r.competition?.name])).entries()).filter(([slug]) => slug),
    [results]
  );
  const events = useMemo(
    () => Array.from(new Map(results.filter((r) => r.event).map((r) => [r.event!.slug, r.event!.name])).entries()),
    [results]
  );
  const teams = useMemo(() => Array.from(new Set(results.map((r) => r.team?.name).filter(Boolean))) as string[], [results]);

  const filtered = results.filter((r) => {
    if (year !== ALL_VALUE && academicYearOf(r.competition?.competition_date) !== year) return false;
    if (competition !== ALL_VALUE && r.competition?.slug !== competition) return false;
    if (event !== ALL_VALUE && r.event?.slug !== event) return false;
    if (team !== ALL_VALUE && r.team?.name !== team) return false;
    return true;
  });

  const filters: FilterConfig[] = [
    { key: "year", label: "Year", value: year, onChange: setYear, options: years.map((y) => ({ value: y, label: y })) },
    {
      key: "competition",
      label: "Tournament",
      value: competition,
      onChange: setCompetition,
      options: competitions.map(([slug, name]) => ({ value: slug!, label: name! })),
    },
    {
      key: "event",
      label: "Event",
      value: event,
      onChange: setEvent,
      options: events.map(([slug, name]) => ({ value: slug, label: name })),
    },
    { key: "team", label: "Team", value: team, onChange: setTeam, options: teams.map((t) => ({ value: t, label: t })) },
  ];

  return (
    <div className="space-y-6">
      <FilterBar
        filters={filters}
        onReset={() => {
          setYear(ALL_VALUE);
          setCompetition(ALL_VALUE);
          setEvent(ALL_VALUE);
          setTeam(ALL_VALUE);
        }}
      />
      {filtered.length === 0 ? (
        <EmptyState icon={Trophy} title="No results match your filters" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs font-semibold text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-2.5">Tournament</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Event</th>
                <th className="px-4 py-2.5">Team</th>
                <th className="px-4 py-2.5">Placement</th>
                <th className="px-4 py-2.5">Medal</th>
                <th className="px-4 py-2.5">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3 font-medium text-brand-navy">{r.competition?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {r.competition ? formatDate(r.competition.competition_date) : "—"}
                  </td>
                  <td className="px-4 py-3">{r.event?.name ?? <span className="text-muted-foreground">Overall</span>}</td>
                  <td className="px-4 py-3">{r.team?.name ?? "—"}</td>
                  <td className="px-4 py-3">{r.placement ? `#${r.placement}` : "—"}</td>
                  <td className="px-4 py-3">
                    <ResultBadge medal={r.medal} />
                  </td>
                  <td className="px-4 py-3">{r.score ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
