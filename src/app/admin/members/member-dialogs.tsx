"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudDialog, type FieldConfig } from "@/components/admin/crud-dialog";
import { ROLE_LABELS } from "@/types/domain";
import { updateMemberAction } from "./actions";
import type { ProfileRow } from "@/types/database";

export function EditMemberButton({ member }: { member: ProfileRow }) {
  const fields: FieldConfig[] = [
    { name: "full_name", label: "Full Name", type: "text", defaultValue: member.full_name, required: true, placeholder: member.full_name },
    { name: "preferred_name", label: "Preferred Name", type: "text", defaultValue: member.preferred_name ?? "" },
    { name: "grade", label: "Grade", type: "number", min: 9, defaultValue: member.grade ?? "" },
    { name: "phone", label: "Phone", type: "text", defaultValue: member.phone ?? "" },
    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      defaultValue: member.role,
      options: Object.entries(ROLE_LABELS).map(([value, label]) => ({ value, label })),
      helpText: "Changing a member's role updates their permissions across the entire site.",
      fullWidth: true,
    },
    { name: "is_active", label: "Active team member", type: "checkbox", defaultValue: member.is_active },
  ];

  return (
    <CrudDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label={`Edit ${member.full_name}`}>
          <Pencil className="size-3.5" />
        </Button>
      }
      title={`Edit ${member.full_name}`}
      description={member.email}
      fields={fields}
      hiddenValues={{ id: member.id }}
      action={updateMemberAction}
      onSuccessMessage="Member updated."
    />
  );
}
