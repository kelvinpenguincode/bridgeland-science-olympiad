"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudDialog, type FieldConfig } from "@/components/admin/crud-dialog";
import { MEDAL_LABELS } from "@/types/domain";
import { upsertResultAction } from "./actions";
import type { CompetitionResultRow } from "@/types/database";

type Option = { id: string; name: string };

function buildFields(teams: Option[], events: Option[], defaults?: CompetitionResultRow): FieldConfig[] {
  return [
    {
      name: "team_id",
      label: "Team",
      type: "select",
      required: true,
      defaultValue: defaults?.team_id,
      options: teams.map((t) => ({ value: t.id, label: t.name })),
    },
    {
      name: "event_id",
      label: "Event (leave blank for overall team result)",
      type: "select",
      defaultValue: defaults?.event_id ?? "",
      options: events.map((e) => ({ value: e.id, label: e.name })),
      fullWidth: true,
    },
    { name: "placement", label: "Placement", type: "number", min: 1, defaultValue: defaults?.placement ?? "" },
    {
      name: "medal",
      label: "Medal",
      type: "select",
      defaultValue: defaults?.medal ?? "none",
      options: Object.entries(MEDAL_LABELS).map(([value, label]) => ({ value, label: label === "—" ? "None" : label })),
    },
    { name: "score", label: "Score (optional)", type: "number", step: "0.01", defaultValue: defaults?.score ?? "" },
    { name: "notes", label: "Notes", type: "textarea", defaultValue: defaults?.notes ?? "", fullWidth: true },
  ];
}

export function NewResultButton({ competitionId, teams, events }: { competitionId: string; teams: Option[]; events: Option[] }) {
  return (
    <CrudDialog
      trigger={
        <Button>
          <Plus className="size-4" data-icon="inline-start" />
          Add Result
        </Button>
      }
      title="Add Result"
      fields={buildFields(teams, events)}
      hiddenValues={{ competition_id: competitionId }}
      action={upsertResultAction}
      submitLabel="Add"
      onSuccessMessage="Result added."
    />
  );
}

export function EditResultButton({
  result,
  competitionId,
  teams,
  events,
}: {
  result: CompetitionResultRow;
  competitionId: string;
  teams: Option[];
  events: Option[];
}) {
  return (
    <CrudDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit result">
          <Pencil className="size-3.5" />
        </Button>
      }
      title="Edit Result"
      fields={buildFields(teams, events, result)}
      hiddenValues={{ id: result.id, competition_id: competitionId }}
      action={upsertResultAction}
      onSuccessMessage="Result updated."
    />
  );
}
