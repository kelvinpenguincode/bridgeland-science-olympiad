"use client";

import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CrudDialog, type FieldConfig } from "@/components/admin/crud-dialog";
import { PLACEMENT_STATUS_LABELS } from "@/types/domain";
import { upsertPlacementResultAction } from "./actions";
import type { PlacementResultRow } from "@/types/database";

type MemberOption = { id: string; name: string };

function buildFields(members: MemberOption[], defaults?: PlacementResultRow): FieldConfig[] {
  return [
    {
      name: "profile_id",
      label: "Student",
      type: "select",
      required: true,
      defaultValue: defaults?.profile_id,
      options: members.map((m) => ({ value: m.id, label: m.name })),
      fullWidth: true,
    },
    { name: "raw_score", label: "Raw Score", type: "number", step: "0.01", required: true, defaultValue: defaults?.raw_score ?? "" },
    { name: "rank", label: "Rank (optional override)", type: "number", min: 1, defaultValue: defaults?.rank ?? "" },
    {
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      defaultValue: defaults?.status ?? "pending",
      options: Object.entries(PLACEMENT_STATUS_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      name: "recommended_assignment",
      label: "Recommended Assignment",
      type: "text",
      defaultValue: defaults?.recommended_assignment ?? "",
      placeholder: "e.g. Varsity A",
    },
    { name: "notes", label: "Notes", type: "textarea", defaultValue: defaults?.notes ?? "", fullWidth: true },
    { name: "hide_raw_score", label: "Hide raw score from student (show rank/status only)", type: "checkbox", defaultValue: defaults?.hide_raw_score ?? false },
  ];
}

export function NewResultButton({ testId, members }: { testId: string; members: MemberOption[] }) {
  return (
    <CrudDialog
      trigger={
        <Button variant="outline">
          <Plus className="size-4" data-icon="inline-start" />
          Add Score
        </Button>
      }
      title="Add Placement Score"
      fields={buildFields(members)}
      hiddenValues={{ placement_test_id: testId }}
      action={upsertPlacementResultAction}
      submitLabel="Add"
      onSuccessMessage="Score added."
    />
  );
}

export function EditResultButton({ result, testId, members }: { result: PlacementResultRow; testId: string; members: MemberOption[] }) {
  return (
    <CrudDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit score">
          <Pencil className="size-3.5" />
        </Button>
      }
      title="Edit Placement Score"
      fields={buildFields(members, result)}
      hiddenValues={{ id: result.id, placement_test_id: testId }}
      action={upsertPlacementResultAction}
      onSuccessMessage="Score updated."
    />
  );
}
