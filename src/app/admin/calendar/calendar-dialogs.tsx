"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudDialog, type FieldConfig } from "@/components/admin/crud-dialog";
import { CALENDAR_CATEGORY_LABELS } from "@/types/domain";
import { upsertCalendarEventAction } from "./actions";
import type { CalendarEventRow } from "@/types/database";

function toDatetimeLocal(iso: string | null | undefined) {
  if (!iso) return "";
  return iso.slice(0, 16);
}

function buildFields(defaults?: CalendarEventRow): FieldConfig[] {
  return [
    { name: "title", label: "Title", type: "text", required: true, defaultValue: defaults?.title, fullWidth: true },
    { name: "description", label: "Description", type: "textarea", defaultValue: defaults?.description ?? "", fullWidth: true },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      defaultValue: defaults?.category ?? "general_meeting",
      options: Object.entries(CALENDAR_CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
    },
    { name: "location", label: "Location", type: "text", defaultValue: defaults?.location ?? "" },
    { name: "start_at", label: "Start", type: "datetime-local", required: true, defaultValue: toDatetimeLocal(defaults?.start_at) },
    { name: "end_at", label: "End", type: "datetime-local", defaultValue: toDatetimeLocal(defaults?.end_at) },
    { name: "all_day", label: "All-day event", type: "checkbox", defaultValue: defaults?.all_day ?? false },
  ];
}

export function NewCalendarEventButton() {
  return (
    <CrudDialog
      trigger={
        <Button>
          <Plus className="size-4" data-icon="inline-start" />
          Add Calendar Event
        </Button>
      }
      title="New Calendar Event"
      fields={buildFields()}
      action={upsertCalendarEventAction}
      submitLabel="Create"
      onSuccessMessage="Calendar event created."
    />
  );
}

export function EditCalendarEventButton({ event }: { event: CalendarEventRow }) {
  return (
    <CrudDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit event">
          <Pencil className="size-3.5" />
        </Button>
      }
      title="Edit Calendar Event"
      fields={buildFields(event)}
      hiddenValues={{ id: event.id }}
      action={upsertCalendarEventAction}
      onSuccessMessage="Calendar event updated."
    />
  );
}
