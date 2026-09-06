import type { Metadata } from "next";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTable } from "@/components/shared/data-table";
import { ResultBadge } from "@/components/shared/event-badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { listCompetitions, getCompetitionResults } from "@/lib/data/competitions";
import { listTeams } from "@/lib/data/teams";
import { listAllEventsForAdmin } from "@/lib/data/events";
import { CompetitionPicker } from "./competition-picker";
import { ReleaseResultsButton } from "./release-button";
import { NewResultButton, EditResultButton } from "./result-dialogs";
import { deleteResultAction } from "./actions";

export const metadata: Metadata = { title: "Manage Results | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function AdminResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ competition?: string }>;
}) {
  const { competition: competitionId } = await searchParams;
  const [competitions, teams, events] = await Promise.all([listCompetitions(), listTeams(), listAllEventsForAdmin()]);

  const selected = competitionId ? competitions.find((c) => c.id === competitionId) : competitions[0];
  const results = selected ? await getCompetitionResults(selected.id) : [];

  const teamOptions = teams.map((t) => ({ id: t.id, name: t.name }));
  const eventOptions = events.map((e) => ({ id: e.id, name: e.name }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-brand-navy">Results</h2>
        <p className="mt-1 text-sm text-muted-foreground">Enter tournament results and control when they become public.</p>
      </div>

      <CompetitionPicker competitions={competitions} selectedId={selected?.id} />

      {!selected ? (
        <EmptyState title="No competitions yet" description="Create a competition first under Admin → Competitions." />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4">
            <div>
              <p className="font-heading font-semibold text-brand-navy">{selected.name}</p>
              <p className="text-sm text-muted-foreground">
                {selected.results_status === "released" ? "Results are visible to the public." : "Results are hidden from the public results page."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ReleaseResultsButton competitionId={selected.id} released={selected.results_status === "released"} />
              <NewResultButton competitionId={selected.id} teams={teamOptions} events={eventOptions} />
            </div>
          </div>

          <DataTable
            columns={[
              { key: "team", header: "Team", render: (r) => r.team?.name ?? "—" },
              { key: "event", header: "Event", render: (r) => r.event?.name ?? "Overall" },
              { key: "placement", header: "Placement", render: (r) => (r.placement ? `#${r.placement}` : "—") },
              { key: "medal", header: "Medal", render: (r) => <ResultBadge medal={r.medal} /> },
              { key: "score", header: "Score", render: (r) => r.score ?? "—" },
              {
                key: "actions",
                header: "",
                className: "text-right",
                render: (r) => (
                  <div className="flex justify-end gap-1">
                    <EditResultButton result={r} competitionId={selected.id} teams={teamOptions} events={eventOptions} />
                    <DeleteButton action={() => deleteResultAction(r.id)} description="This result will be permanently removed." />
                  </div>
                ),
              },
            ]}
            data={results}
            getRowKey={(r) => r.id}
            emptyTitle="No results entered yet"
            emptyDescription="Add a result above to get started."
          />
        </div>
      )}
    </div>
  );
}
