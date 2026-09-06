"use client";

import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudDialog, type FieldConfig } from "@/components/admin/crud-dialog";
import { ANNOUNCEMENT_AUDIENCE_LABELS, ANNOUNCEMENT_PRIORITY_LABELS } from "@/types/domain";
import { upsertAnnouncementAction } from "./actions";
import type { AnnouncementRow } from "@/types/database";

function toDatetimeLocal(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 16);
}

function buildFields(
  teams: { id: string; name: string }[],
  events: { id: string; name: string }[],
  defaults?: AnnouncementRow
): FieldConfig[] {
  return [
    { name: "title", label: "Title", type: "text", required: true, defaultValue: defaults?.title, fullWidth: true },
    {
      name: "summary",
      label: "Summary",
      type: "textarea",
      required: true,
      defaultValue: defaults?.summary,
      fullWidth: true,
      helpText: "A one-to-two sentence teaser shown in lists.",
    },
    { name: "content", label: "Full Content", type: "textarea", required: true, defaultValue: defaults?.content, fullWidth: true },
    {
      name: "priority",
      label: "Priority",
      type: "select",
      required: true,
      defaultValue: defaults?.priority ?? "normal",
      options: Object.entries(ANNOUNCEMENT_PRIORITY_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      name: "audience",
      label: "Audience",
      type: "select",
      required: true,
      defaultValue: defaults?.audience ?? "everyone",
      options: Object.entries(ANNOUNCEMENT_AUDIENCE_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      name: "audience_team_id",
      label: "Team (if audience = Specific Team)",
      type: "select",
      defaultValue: defaults?.audience_team_id ?? "",
      options: teams.map((t) => ({ value: t.id, label: t.name })),
    },
    {
      name: "audience_event_id",
      label: "Event (if audience = Specific Event)",
      type: "select",
      defaultValue: defaults?.audience_event_id ?? "",
      options: events.map((e) => ({ value: e.id, label: e.name })),
    },
    {
      name: "publish_at",
      label: "Publish At",
      type: "datetime-local",
      defaultValue: defaults ? toDatetimeLocal(defaults.publish_at) : toDatetimeLocal(new Date().toISOString()),
    },
    { name: "expires_at", label: "Expires At (optional)", type: "datetime-local", defaultValue: toDatetimeLocal(defaults?.expires_at ?? null) },
    { name: "is_pinned", label: "Pin to top", type: "checkbox", defaultValue: defaults?.is_pinned ?? false },
  ];
}

export function NewAnnouncementButton({
  teams,
  events,
}: {
  teams: { id: string; name: string }[];
  events: { id: string; name: string }[];
}) {
  return (
    <CrudDialog
      trigger={
        <Button>
          <Plus className="size-4" data-icon="inline-start" />
          New Announcement
        </Button>
      }
      title="New Announcement"
      fields={buildFields(teams, events)}
      action={upsertAnnouncementAction}
      submitLabel="Publish"
      onSuccessMessage="Announcement created."
    />
  );
}

export function EditAnnouncementButton({
  announcement,
  teams,
  events,
}: {
  announcement: AnnouncementRow;
  teams: { id: string; name: string }[];
  events: { id: string; name: string }[];
}) {
  return (
    <CrudDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit announcement">
          <Pencil className="size-3.5" />
        </Button>
      }
      title="Edit Announcement"
      fields={buildFields(teams, events, announcement)}
      hiddenValues={{ id: announcement.id }}
      action={upsertAnnouncementAction}
      onSuccessMessage="Announcement updated."
    />
  );
}
