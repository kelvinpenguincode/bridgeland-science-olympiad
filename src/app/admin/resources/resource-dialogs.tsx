"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudDialog, type FieldConfig } from "@/components/admin/crud-dialog";
import { RESOURCE_DIFFICULTY_LABELS, RESOURCE_TYPE_LABELS, RESOURCE_VISIBILITY_LABELS } from "@/types/domain";
import { upsertResourceAction } from "./actions";
import type { ResourceRow } from "@/types/database";

type EventOption = { id: string; name: string };

function buildFields(events: EventOption[], defaults?: ResourceRow): FieldConfig[] {
  return [
    { name: "title", label: "Title", type: "text", required: true, defaultValue: defaults?.title, fullWidth: true },
    {
      name: "event_id",
      label: "Event",
      type: "select",
      defaultValue: defaults?.event_id ?? "",
      options: events.map((e) => ({ value: e.id, label: e.name })),
    },
    { name: "year", label: "Year", type: "number", defaultValue: defaults?.year ?? new Date().getFullYear() },
    {
      name: "type",
      label: "Resource Type",
      type: "select",
      required: true,
      defaultValue: defaults?.type ?? "study_guide",
      options: Object.entries(RESOURCE_TYPE_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      name: "difficulty",
      label: "Difficulty",
      type: "select",
      defaultValue: defaults?.difficulty ?? "",
      options: Object.entries(RESOURCE_DIFFICULTY_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      name: "visibility",
      label: "Visibility",
      type: "select",
      required: true,
      defaultValue: defaults?.visibility ?? "members",
      options: Object.entries(RESOURCE_VISIBILITY_LABELS).map(([value, label]) => ({ value, label })),
    },
    { name: "url", label: "URL", type: "url", required: true, defaultValue: defaults?.url ?? "", fullWidth: true },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      defaultValue: defaults?.description ?? "",
      fullWidth: true,
      helpText: "Do not upload or link copyrighted official rules manuals directly — link to the official source instead.",
    },
  ];
}

export function NewResourceButton({ events }: { events: EventOption[] }) {
  return (
    <CrudDialog
      trigger={
        <Button>
          <Plus className="size-4" data-icon="inline-start" />
          Add Resource
        </Button>
      }
      title="Add Resource"
      fields={buildFields(events)}
      action={upsertResourceAction}
      submitLabel="Add"
      onSuccessMessage="Resource added."
    />
  );
}

export function EditResourceButton({ resource, events }: { resource: ResourceRow; events: EventOption[] }) {
  return (
    <CrudDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit resource">
          <Pencil className="size-3.5" />
        </Button>
      }
      title="Edit Resource"
      fields={buildFields(events, resource)}
      hiddenValues={{ id: resource.id }}
      action={upsertResourceAction}
      onSuccessMessage="Resource updated."
    />
  );
}
