"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudDialog, type FieldConfig } from "@/components/admin/crud-dialog";
import { upsertOfficerAction } from "./actions";
import type { OfficerRow } from "@/types/database";

const CATEGORY_OPTIONS = [
  { value: "officer", label: "Officer" },
  { value: "event_captain", label: "Event Captain" },
  { value: "coach", label: "Coach / Sponsor" },
];

function buildFields(defaults?: OfficerRow): FieldConfig[] {
  return [
    { name: "full_name", label: "Full Name", type: "text", required: true, defaultValue: defaults?.full_name },
    { name: "role_title", label: "Role Title", type: "text", required: true, defaultValue: defaults?.role_title, placeholder: "e.g. Team Captain" },
    {
      name: "category",
      label: "Category",
      type: "select",
      required: true,
      defaultValue: defaults?.category ?? "officer",
      options: CATEGORY_OPTIONS,
    },
    { name: "grade", label: "Grade", type: "text", defaultValue: defaults?.grade ?? "", placeholder: "e.g. 12 or Sponsor" },
    { name: "photo_url", label: "Photo URL", type: "url", defaultValue: defaults?.photo_url ?? "", fullWidth: true },
    { name: "bio", label: "Short Bio", type: "textarea", defaultValue: defaults?.bio ?? "", fullWidth: true },
    { name: "fun_fact", label: "Fun Fact", type: "textarea", defaultValue: defaults?.fun_fact ?? "", fullWidth: true },
    { name: "email_public", label: "Public Contact Email (optional)", type: "email", defaultValue: defaults?.email_public ?? "" },
    { name: "display_order", label: "Display Order", type: "number", defaultValue: defaults?.display_order ?? 0 },
    { name: "is_active", label: "Show on public team page", type: "checkbox", defaultValue: defaults?.is_active ?? true },
  ];
}

export function NewOfficerButton() {
  return (
    <CrudDialog
      trigger={
        <Button>
          <Plus className="size-4" data-icon="inline-start" />
          Add Profile
        </Button>
      }
      title="New Officer / Coach Profile"
      fields={buildFields()}
      action={upsertOfficerAction}
      submitLabel="Create"
      onSuccessMessage="Profile created."
    />
  );
}

export function EditOfficerButton({ officer }: { officer: OfficerRow }) {
  return (
    <CrudDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit profile">
          <Pencil className="size-3.5" />
        </Button>
      }
      title="Edit Profile"
      fields={buildFields(officer)}
      hiddenValues={{ id: officer.id }}
      action={upsertOfficerAction}
      onSuccessMessage="Profile updated."
    />
  );
}
