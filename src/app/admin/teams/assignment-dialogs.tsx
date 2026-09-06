"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudDialog, type FieldConfig } from "@/components/admin/crud-dialog";
import { upsertAssignmentAction } from "./actions";
import type { EventAssignmentRow } from "@/types/database";

type Option = { id: string; name: string };

function buildFields(events: Option[], members: Option[], teams: Option[], defaults?: EventAssignmentRow): FieldConfig[] {
  return [
    {
      name: "event_id",
      label: "Event",
      type: "select",
      required: true,
      defaultValue: defaults?.event_id,
      options: events.map((e) => ({ value: e.id, label: e.name })),
      fullWidth: true,
    },
    {
      name: "profile_id",
      label: "Student",
      type: "select",
      required: true,
      defaultValue: defaults?.profile_id,
      options: members.map((m) => ({ value: m.id, label: m.name })),
    },
    {
      name: "partner_profile_id",
      label: "Partner (optional)",
      type: "select",
      defaultValue: defaults?.partner_profile_id ?? "",
      options: members.map((m) => ({ value: m.id, label: m.name })),
    },
    {
      name: "team_id",
      label: "Team",
      type: "select",
      defaultValue: defaults?.team_id ?? "",
      options: teams.map((t) => ({ value: t.id, label: t.name })),
    },
    { name: "season", label: "Season", type: "text", defaultValue: defaults?.season ?? "2026-2027" },
    { name: "notes", label: "Notes", type: "textarea", defaultValue: defaults?.notes ?? "", fullWidth: true },
  ];
}

export function NewAssignmentButton({ events, members, teams }: { events: Option[]; members: Option[]; teams: Option[] }) {
  return (
    <CrudDialog
      trigger={
        <Button>
          <Plus className="size-4" data-icon="inline-start" />
          Add Assignment
        </Button>
      }
      title="New Event Assignment"
      fields={buildFields(events, members, teams)}
      action={upsertAssignmentAction}
      submitLabel="Assign"
      onSuccessMessage="Assignment created."
    />
  );
}

export function EditAssignmentButton({
  assignment,
  events,
  members,
  teams,
}: {
  assignment: EventAssignmentRow;
  events: Option[];
  members: Option[];
  teams: Option[];
}) {
  return (
    <CrudDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit assignment">
          <Pencil className="size-3.5" />
        </Button>
      }
      title="Edit Assignment"
      fields={buildFields(events, members, teams, assignment)}
      hiddenValues={{ id: assignment.id }}
      action={upsertAssignmentAction}
      onSuccessMessage="Assignment updated."
    />
  );
}
