import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { PlacementStatusBadge } from "@/components/shared/event-badge";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import { formatDate } from "@/lib/utils/date";
import { getMyPlacementResults } from "@/lib/data/placement";
import type { PlacementStatus } from "@/types/database";

export const metadata: Metadata = { title: "Placement Results | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

interface PlacementResultWithTest {
  id: string;
  raw_score: number;
  rank: number | null;
  status: PlacementStatus;
  notes: string | null;
  recommended_assignment: string | null;
  hide_raw_score: boolean;
  placement_test: {
    event_id: string;
    test_date: string;
    max_score: number;
    results_released: boolean;
    event: { name: string; slug: string } | null;
  } | null;
}

export default async function DashboardResultsPage() {
  const results = (await getMyPlacementResults()) as unknown as PlacementResultWithTest[];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-brand-navy">Placement Results</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your placement test results across all events. Only you (and staff) can see this page.
        </p>
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No placement results yet"
          description="Results appear here once an officer releases them for a test session you took."
        />
      ) : (
        <div className="space-y-3">
          {results.map((r) => {
            const released = r.placement_test?.results_released ?? false;
            const percentage = r.placement_test
              ? Math.round((r.raw_score / r.placement_test.max_score) * 100)
              : null;
            return (
              <div key={r.id} className="rounded-xl border border-border bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange-dark">
                      <DynamicIcon name="FlaskConical" className="size-5" />
                    </span>
                    <div>
                      <p className="font-heading font-semibold text-brand-navy">
                        {r.placement_test?.event?.name ?? "Placement Test"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.placement_test ? formatDate(r.placement_test.test_date) : ""}
                      </p>
                    </div>
                  </div>
                  {released ? (
                    <PlacementStatusBadge status={r.status} />
                  ) : (
                    <PlacementStatusBadge status="pending" />
                  )}
                </div>

                {released ? (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Score</p>
                      <p className="text-sm font-semibold text-brand-navy">
                        {r.hide_raw_score ? "Hidden" : `${r.raw_score} / ${r.placement_test?.max_score}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Percentage</p>
                      <p className="text-sm font-semibold text-brand-navy">
                        {r.hide_raw_score ? "—" : percentage !== null ? `${percentage}%` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Rank</p>
                      <p className="text-sm font-semibold text-brand-navy">{r.rank ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase">Recommended</p>
                      <p className="text-sm font-semibold text-brand-navy">{r.recommended_assignment ?? "—"}</p>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Results haven&apos;t been released yet — check back after officers finish scoring.
                  </p>
                )}
                {released && r.notes && <p className="mt-3 text-sm text-slate-600">{r.notes}</p>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
