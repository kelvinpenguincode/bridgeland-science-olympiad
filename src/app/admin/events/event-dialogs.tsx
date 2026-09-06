"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudDialog, type FieldConfig } from "@/components/admin/crud-dialog";
import { EVENT_CATEGORY_LABELS } from "@/types/domain";
import { upsertEventAction } from "./actions";
import type { SciolyEventRow } from "@/types/database";

function buildFields(defaults?: SciolyEventRow): FieldConfig[] {
  return [
    { name: "name", label: "Event Name", type: "text", required: true, defaultValue: defaults?.name, fullWidth: true },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      defaultValue: defaults?.category ?? "life_personal_social",
      options: Object.entries(EVENT_CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
    },
    { name: "season", label: "Season Year", type: "number", defaultValue: defaults?.season ?? new Date().getFullYear() },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
      defaultValue: defaults?.description,
      fullWidth: true,
    },
    {
      name: "icon",
      label: "Lucide Icon Name",
      type: "text",
      defaultValue: defaults?.icon ?? "FlaskConical",
      helpText: "Must match a lucide-react icon component name, e.g. Microscope, Rocket, Zap.",
      fullWidth: true,
    },
    { name: "official_rules_url", label: "Official Rules URL", type: "url", defaultValue: defaults?.official_rules_url ?? "" },
    {
      name: "official_resources_url",
      label: "Official Resources URL",
      type: "url",
      defaultValue: defaults?.official_resources_url ?? "",
    },
    { name: "display_order", label: "Display Order", type: "number", defaultValue: defaults?.display_order ?? 0 },
    { name: "is_active", label: "Active this season", type: "checkbox", defaultValue: defaults?.is_active ?? true },
  ];
}

export function NewEventButton() {
  return (
    <CrudDialog
      trigger={
        <Button>
          <Plus className="size-4" data-icon="inline-start" />
          New Event
        </Button>
      }
      title="New Science Olympiad Event"
      fields={buildFields()}
      action={upsertEventAction}
      submitLabel="Create"
      onSuccessMessage="Event created."
    />
  );
}

export function EditEventButton({ event }: { event: SciolyEventRow }) {
  return (
    <CrudDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit event">
          <Pencil className="size-3.5" />
        </Button>
      }
      title="Edit Event"
      fields={buildFields(event)}
      hiddenValues={{ id: event.id }}
      action={upsertEventAction}
      onSuccessMessage="Event updated."
    />
  );
}
