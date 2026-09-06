import type { Metadata } from "next";
import { Award, Medal, TrendingUp, Trophy } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ResultsExplorer, type ResultRow } from "@/components/results/results-explorer";
import { BestEventsChart, MedalBreakdownChart } from "@/components/results/results-charts";
import { getResultStats, listResults } from "@/lib/data/results";

export const metadata: Metadata = {
  title: "Results | Bridgeland Science Olympiad",
  description: "Competition results, medal history, and team statistics for Bridgeland Science Olympiad.",
};

export const revalidate = 60;

export default async function ResultsPage() {
  const [results, stats] = await Promise.all([listResults(), getResultStats()]);

  return (
    <>
      <PageHeader
        eyebrow="Team History"
        title="Results & Achievements"
        description="Every medal, placement, and podium finish across our competition history — filterable by year, tournament, event, and team."
      />
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Medals" value={stats.totalMedals} icon={Medal} accent="orange" />
          <StatCard label="Podium Finishes" value={stats.podiumFinishes} icon={Trophy} accent="navy" />
          <StatCard
            label="Avg. Team Placement"
            value={stats.avgTeamPlacement ? stats.avgTeamPlacement.toFixed(1) : "—"}
            icon={TrendingUp}
            accent="neutral"
          />
          <StatCard
            label="Gold / Silver / Bronze"
            value={`${stats.goldCount} / ${stats.silverCount} / ${stats.bronzeCount}`}
            icon={Award}
            accent="orange"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <MedalBreakdownChart gold={stats.goldCount} silver={stats.silverCount} bronze={stats.bronzeCount} />
          <BestEventsChart data={stats.bestEvents} />
        </div>

        <ResultsExplorer results={results as ResultRow[]} />
      </div>
    </>
  );
}
