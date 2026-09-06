import type { Metadata } from "next";
import { Trophy } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { CompetitionCard } from "@/components/shared/competition-card";
import { EmptyState } from "@/components/shared/empty-state";
import { listCompetitions } from "@/lib/data/competitions";
import { isFuture } from "@/lib/utils/date";

export const metadata: Metadata = {
  title: "Competitions | Bridgeland Science Olympiad",
  description: "Upcoming and past Science Olympiad tournaments for Bridgeland.",
};

export const revalidate = 60;

export default async function CompetitionsPage() {
  const competitions = await listCompetitions();
  const upcoming = competitions.filter((c) => isFuture(c.competition_date)).reverse();
  const past = competitions.filter((c) => !isFuture(c.competition_date));

  return (
    <>
      <PageHeader
        eyebrow="Tournament Season"
        title="Competitions"
        description="Every invitational, regional, state, and scrimmage on the schedule — with logistics, rosters, and results for each."
      />
      <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-brand-orange-dark uppercase">
            Upcoming
          </h2>
          {upcoming.length === 0 ? (
            <EmptyState icon={Trophy} title="No upcoming competitions scheduled" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((c) => (
                <CompetitionCard key={c.id} competition={c} />
              ))}
            </div>
          )}
        </section>
        <section>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Past Competitions
          </h2>
          {past.length === 0 ? (
            <EmptyState title="No past competitions on record" />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((c) => (
                <CompetitionCard key={c.id} competition={c} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
