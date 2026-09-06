import { Card, CardContent } from "@/components/ui/card";
import { ResultBadge } from "@/components/shared/event-badge";
import { formatDate } from "@/lib/utils/date";
import { EmptyState } from "@/components/shared/empty-state";
import { Trophy } from "lucide-react";

interface ResultItem {
  id: string;
  medal: "gold" | "silver" | "bronze" | "none";
  placement: number | null;
  competition: { name: string; competition_date: string } | null;
  event: { name: string } | null;
  team: { name: string } | null;
}

export function RecentResults({ results }: { results: ResultItem[] }) {
  const medalResults = results.filter((r) => r.medal !== "none").slice(0, 6);

  if (medalResults.length === 0) {
    return <EmptyState icon={Trophy} title="No results recorded yet" />;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {medalResults.map((r) => (
        <Card key={r.id}>
          <CardContent className="flex items-start justify-between gap-2">
            <div>
              <p className="font-heading text-sm font-semibold text-brand-navy">
                {r.event?.name ?? "Overall Team"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">{r.competition?.name}</p>
              <p className="text-xs text-muted-foreground">
                {r.competition?.competition_date ? formatDate(r.competition.competition_date) : ""} &middot;{" "}
                {r.team?.name}
              </p>
            </div>
            <ResultBadge medal={r.medal} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
