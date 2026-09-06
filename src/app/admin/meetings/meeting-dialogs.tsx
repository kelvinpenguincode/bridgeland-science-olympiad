"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudDialog, type FieldConfig } from "@/components/admin/crud-dialog";
import { upsertMeetingAction } from "./actions";
import type { MeetingRow } from "@/types/database";

function buildFields(defaults?: MeetingRow): FieldConfig[] {
  return [
    { name: "title", label: "Title", type: "text", required: true, defaultValue: defaults?.title, fullWidth: true },
    { name: "meeting_date", label: "Date", type: "date", required: true, defaultValue: defaults?.meeting_date },
    { name: "location", label: "Location", type: "text", required: true, defaultValue: defaults?.location },
    { name: "start_time", label: "Start Time", type: "time", required: true, defaultValue: defaults?.start_time?.slice(0, 5) },
    { name: "end_time", label: "End Time", type: "time", defaultValue: defaults?.end_time?.slice(0, 5) ?? "" },
    { name: "description", label: "Description", type: "textarea", defaultValue: defaults?.description ?? "", fullWidth: true },
    { name: "agenda", label: "Agenda", type: "textarea", defaultValue: defaults?.agenda ?? "", fullWidth: true },
    {
      name: "required_materials",
      label: "Required Materials",
      type: "textarea",
      defaultValue: defaults?.required_materials ?? "",
      fullWidth: true,
    },
    { name: "notes", label: "Notes (for past meetings)", type: "textarea", defaultValue: defaults?.notes ?? "", fullWidth: true },
    { name: "slide_url", label: "Slide URL", type: "url", defaultValue: defaults?.slide_url ?? "" },
    { name: "attendance_required", label: "Attendance required", type: "checkbox", defaultValue: defaults?.attendance_required ?? true },
  ];
}

export function NewMeetingButton() {
  return (
    <CrudDialog
      trigger={
        <Button>
          <Plus className="size-4" data-icon="inline-start" />
          Create Meeting
        </Button>
      }
      title="New Meeting"
      fields={buildFields()}
      action={upsertMeetingAction}
      submitLabel="Create"
      onSuccessMessage="Meeting created."
    />
  );
}

export function EditMeetingButton({ meeting }: { meeting: MeetingRow }) {
  return (
    <CrudDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit meeting">
          <Pencil className="size-3.5" />
        </Button>
      }
      title="Edit Meeting"
      fields={buildFields(meeting)}
      hiddenValues={{ id: meeting.id }}
      action={upsertMeetingAction}
      onSuccessMessage="Meeting updated."
    />
  );
}
