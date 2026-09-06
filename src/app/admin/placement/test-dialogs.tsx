"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudDialog, type FieldConfig } from "@/components/admin/crud-dialog";
import { upsertPlacementTestAction } from "./actions";
import type { PlacementTestRow } from "@/types/database";

type EventOption = { id: string; name: string };

function buildFields(events: EventOption[], defaults?: PlacementTestRow): FieldConfig[] {
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
    { name: "test_date", label: "Test Date", type: "date", required: true, defaultValue: defaults?.test_date },
    { name: "max_score", label: "Max Score", type: "number", defaultValue: defaults?.max_score ?? 100 },
    { name: "location", label: "Location", type: "text", defaultValue: defaults?.location ?? "", fullWidth: true },
    { name: "notes", label: "Notes", type: "textarea", defaultValue: defaults?.notes ?? "", fullWidth: true },
  ];
}

export function NewTestButton({ events }: { events: EventOption[] }) {
  return (
    <CrudDialog
      trigger={
        <Button>
          <Plus className="size-4" data-icon="inline-start" />
          New Placement Test
        </Button>
      }
      title="New Placement Test"
      fields={buildFields(events)}
      action={upsertPlacementTestAction}
      submitLabel="Create"
      onSuccessMessage="Placement test created."
    />
  );
}

export function EditTestButton({ test, events }: { test: PlacementTestRow; events: EventOption[] }) {
  return (
    <CrudDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit test">
          <Pencil className="size-3.5" />
        </Button>
      }
      title="Edit Placement Test"
      fields={buildFields(events, test)}
      hiddenValues={{ id: test.id }}
      action={upsertPlacementTestAction}
      onSuccessMessage="Placement test updated."
    />
  );
}
