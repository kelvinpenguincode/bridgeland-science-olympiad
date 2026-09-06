import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { DeleteButton } from "@/components/admin/delete-button";
import { COMPETITION_TYPE_LABELS } from "@/types/domain";
import { formatDate } from "@/lib/utils/date";
import { listCompetitions, getCompetitionTeams } from "@/lib/data/competitions";
import { listTeams } from "@/lib/data/teams";
import { EditCompetitionButton, ManageTeamsButton, NewCompetitionButton } from "./competition-dialogs";
import { deleteCompetitionAction } from "./actions";

export const metadata: Metadata = { title: "Manage Competitions | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function AdminCompetitionsPage() {
  const [competitions, teams] = await Promise.all([listCompetitions(), listTeams()]);
  const registeredByCompetition = await Promise.all(
    competitions.map(async (c) => ({ id: c.id, teamIds: (await getCompetitionTeams(c.id)).map((t) => t!.id) }))
  );
  const registeredMap = new Map(registeredByCompetition.map((r) => [r.id, r.teamIds]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-brand-navy">Competitions</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage tournament logistics, registered teams, and results release.</p>
        </div>
        <NewCompetitionButton />
      </div>

      <DataTable
        columns={[
          { key: "name", header: "Competition", render: (c) => <span className="font-medium text-brand-navy">{c.name}</span> },
          { key: "type", header: "Type", render: (c) => <Badge variant="outline">{COMPETITION_TYPE_LABELS[c.type]}</Badge> },
          { key: "date", header: "Date", render: (c) => formatDate(c.competition_date) },
          { key: "location", header: "Location", render: (c) => c.location },
          {
            key: "results",
            header: "Results",
            render: (c) =>
              c.results_status === "released" ? (
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  Released
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  Pending
                </Badge>
              ),
          },
          {
            key: "actions",
            header: "",
            className: "text-right",
            render: (c) => (
              <div className="flex justify-end gap-1">
                <ManageTeamsButton competitionId={c.id} allTeams={teams} registeredTeamIds={registeredMap.get(c.id) ?? []} />
                <EditCompetitionButton competition={c} />
                <DeleteButton action={() => deleteCompetitionAction(c.id)} description={`"${c.name}" and its schedule/results will be permanently removed.`} />
              </div>
            ),
          },
        ]}
        data={competitions}
        getRowKey={(c) => c.id}
        emptyTitle="No competitions yet"
      />
    </div>
  );
}
