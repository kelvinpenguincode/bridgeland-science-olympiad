import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { PlacementStatusBadge } from "@/components/shared/event-badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatDate } from "@/lib/utils/date";
import { listAllPlacementTestsForAdmin, getPlacementResultsForTest } from "@/lib/data/placement";
import { listAllMembersForAdmin } from "@/lib/data/members";
import { listAllEventsForAdmin } from "@/lib/data/events";
import { NewTestButton, EditTestButton } from "./test-dialogs";
import { NewResultButton, EditResultButton } from "./result-dialogs";
import { TestPicker } from "./test-picker";
import { RecalculateRanksButton, ReleaseTestButton } from "./test-actions-bar";
import { CsvImportButton } from "./csv-import";
import { requireAdmin } from "@/lib/auth/session";
import { deletePlacementTestAction, deletePlacementResultAction } from "./actions";

export const metadata: Metadata = { title: "Manage Placement Testing | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function AdminPlacementPage({
  searchParams,
}: {
  searchParams: Promise<{ test?: string }>;
}) {
  await requireAdmin("/admin/placement");
  const { test: testId } = await searchParams;
  const [tests, members, events] = await Promise.all([
    listAllPlacementTestsForAdmin(),
    listAllMembersForAdmin(),
    listAllEventsForAdmin(),
  ]);

  const selected = testId ? tests.find((t) => t.id === testId) : tests[0];
  const results = selected ? await getPlacementResultsForTest(selected.id) : [];

  const eventOptions = events.map((e) => ({ id: e.id, name: e.name }));
  const memberOptions = members.filter((m) => m.role !== "sponsor").map((m) => ({ id: m.id, name: m.full_name }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy">Placement Testing</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create placement sessions, enter scores, and control when results become visible to students.</p>
        </div>
        <NewTestButton events={eventOptions} />
      </div>

      {tests.length === 0 ? (
        <EmptyState title="No placement tests yet" description="Create your first placement test to get started." />
      ) : (
        <>
          <TestPicker
            tests={tests.map((t) => ({ id: t.id, label: t.event?.name ?? "Placement Test", date: t.test_date }))}
            selectedId={selected?.id}
          />

          {selected && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4">
                <div>
                  <p className="font-heading font-semibold text-brand-navy">
                    {selected.event?.name} — {formatDate(selected.test_date)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Max score {selected.max_score} ·{" "}
                    {selected.results_released ? "Visible to students" : "Hidden from students"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <EditTestButton test={selected} events={eventOptions} />
                  <DeleteButton
                    action={() => deletePlacementTestAction(selected.id)}
                    description="This will delete the test and all its scores."
                    label="Delete Test"
                  />
                  <RecalculateRanksButton testId={selected.id} />
                  <ReleaseTestButton testId={selected.id} released={selected.results_released} />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">{results.length} score{results.length === 1 ? "" : "s"} recorded</p>
                <div className="flex gap-2">
                  <CsvImportButton testId={selected.id} />
                  <NewResultButton testId={selected.id} members={memberOptions} />
                </div>
              </div>

              <DataTable
                columns={[
                  { key: "rank", header: "Rank", render: (r) => (r.rank ? `#${r.rank}` : "—") },
                  { key: "student", header: "Student", render: (r) => r.profile?.full_name ?? "—" },
                  {
                    key: "score",
                    header: "Raw Score",
                    render: (r) => (
                      <span>
                        {r.raw_score} / {selected.max_score}
                        {r.hide_raw_score && (
                          <Badge variant="outline" className="ml-2 bg-muted text-xs text-muted-foreground">
                            Hidden from student
                          </Badge>
                        )}
                      </span>
                    ),
                  },
                  { key: "status", header: "Status", render: (r) => <PlacementStatusBadge status={r.status} /> },
                  { key: "assignment", header: "Recommended", render: (r) => r.recommended_assignment ?? "—" },
                  {
                    key: "actions",
                    header: "",
                    className: "text-right",
                    render: (r) => (
                      <div className="flex justify-end gap-1">
                        <EditResultButton result={r} testId={selected.id} members={memberOptions} />
                        <DeleteButton action={() => deletePlacementResultAction(r.id)} description="This score will be permanently removed." />
                      </div>
                    ),
                  },
                ]}
                data={results}
                getRowKey={(r) => r.id}
                emptyTitle="No scores entered yet"
                emptyDescription="Add a score manually or import a CSV of email,score pairs."
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
