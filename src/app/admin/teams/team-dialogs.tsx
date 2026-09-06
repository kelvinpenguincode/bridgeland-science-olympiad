"use client";

import { useState, useTransition } from "react";
import { Pencil, Plus, Users2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CrudDialog, type FieldConfig } from "@/components/admin/crud-dialog";
import { upsertTeamAction, setTeamRosterAction } from "./actions";
import type { ProfileRow, TeamRow } from "@/types/database";

function buildFields(defaults?: TeamRow): FieldConfig[] {
  return [
    { name: "name", label: "Team Name", type: "text", required: true, defaultValue: defaults?.name, placeholder: "e.g. Varsity A" },
    { name: "season", label: "Season", type: "text", required: true, defaultValue: defaults?.season ?? "2026-2027" },
    { name: "description", label: "Description", type: "textarea", defaultValue: defaults?.description ?? "", fullWidth: true },
  ];
}

export function NewTeamButton() {
  return (
    <CrudDialog
      trigger={
        <Button>
          <Plus className="size-4" data-icon="inline-start" />
          Create Team
        </Button>
      }
      title="New Team"
      fields={buildFields()}
      action={upsertTeamAction}
      submitLabel="Create"
      onSuccessMessage="Team created."
    />
  );
}

export function EditTeamButton({ team }: { team: TeamRow }) {
  return (
    <CrudDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit team">
          <Pencil className="size-3.5" />
        </Button>
      }
      title="Edit Team"
      fields={buildFields(team)}
      hiddenValues={{ id: team.id }}
      action={upsertTeamAction}
      onSuccessMessage="Team updated."
    />
  );
}

export function ManageRosterButton({
  teamId,
  allMembers,
  rosterProfileIds,
}: {
  teamId: string;
  allMembers: ProfileRow[];
  rosterProfileIds: string[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(rosterProfileIds);
  const [pending, startTransition] = useTransition();

  function toggle(profileId: string) {
    setSelected((prev) => (prev.includes(profileId) ? prev.filter((id) => id !== profileId) : [...prev, profileId]));
  }

  function save() {
    startTransition(async () => {
      const result = await setTeamRosterAction(teamId, selected);
      if (result.success) {
        toast.success("Roster updated.");
        setOpen(false);
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Manage roster">
            <Users2 className="size-3.5" />
          </Button>
        }
      />
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Team Roster</DialogTitle>
          <p className="text-sm text-muted-foreground">Choose which members belong to this team.</p>
        </DialogHeader>
        <div className="space-y-2">
          {allMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <Checkbox id={`member-${member.id}`} checked={selected.includes(member.id)} onCheckedChange={() => toggle(member.id)} />
              <Label htmlFor={`member-${member.id}`} className="cursor-pointer font-normal">
                {member.full_name} {member.grade && <span className="text-muted-foreground">(Grade {member.grade})</span>}
              </Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={save} disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
