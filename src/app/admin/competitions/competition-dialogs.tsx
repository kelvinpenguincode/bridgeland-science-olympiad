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
import { COMPETITION_TYPE_LABELS } from "@/types/domain";
import { upsertCompetitionAction, setCompetitionTeamsAction } from "./actions";
import type { CompetitionRow, TeamRow } from "@/types/database";

function buildFields(defaults?: CompetitionRow): FieldConfig[] {
  return [
    { name: "name", label: "Competition Name", type: "text", required: true, defaultValue: defaults?.name, fullWidth: true },
    {
      name: "type",
      label: "Type",
      type: "select",
      required: true,
      defaultValue: defaults?.type ?? "invitational",
      options: Object.entries(COMPETITION_TYPE_LABELS).map(([value, label]) => ({ value, label })),
    },
    { name: "competition_date", label: "Date", type: "date", required: true, defaultValue: defaults?.competition_date },
    { name: "registration_deadline", label: "Registration Deadline", type: "date", defaultValue: defaults?.registration_deadline ?? "" },
    { name: "location", label: "Location / School", type: "text", required: true, defaultValue: defaults?.location },
    { name: "address", label: "Address", type: "text", defaultValue: defaults?.address ?? "" },
    { name: "departure_time", label: "Bus Departure Time", type: "time", defaultValue: defaults?.departure_time?.slice(0, 5) ?? "" },
    { name: "return_estimate", label: "Estimated Return", type: "text", defaultValue: defaults?.return_estimate ?? "", placeholder: "e.g. 7:00 PM" },
    { name: "forms_url", label: "Registration / Forms URL", type: "url", defaultValue: defaults?.forms_url ?? "" },
    { name: "description", label: "Description", type: "textarea", defaultValue: defaults?.description ?? "", fullWidth: true },
    { name: "what_to_bring", label: "What to Bring", type: "textarea", defaultValue: defaults?.what_to_bring ?? "", fullWidth: true },
  ];
}

export function NewCompetitionButton() {
  return (
    <CrudDialog
      trigger={
        <Button>
          <Plus className="size-4" data-icon="inline-start" />
          Add Competition
        </Button>
      }
      title="New Competition"
      fields={buildFields()}
      action={upsertCompetitionAction}
      submitLabel="Create"
      onSuccessMessage="Competition created."
    />
  );
}

export function EditCompetitionButton({ competition }: { competition: CompetitionRow }) {
  return (
    <CrudDialog
      trigger={
        <Button variant="ghost" size="icon-sm" aria-label="Edit competition">
          <Pencil className="size-3.5" />
        </Button>
      }
      title="Edit Competition"
      fields={buildFields(competition)}
      hiddenValues={{ id: competition.id }}
      action={upsertCompetitionAction}
      onSuccessMessage="Competition updated."
    />
  );
}

export function ManageTeamsButton({
  competitionId,
  allTeams,
  registeredTeamIds,
}: {
  competitionId: string;
  allTeams: TeamRow[];
  registeredTeamIds: string[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(registeredTeamIds);
  const [pending, startTransition] = useTransition();

  function toggle(teamId: string) {
    setSelected((prev) => (prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]));
  }

  function save() {
    startTransition(async () => {
      const result = await setCompetitionTeamsAction(competitionId, selected);
      if (result.success) {
        toast.success("Registered teams updated.");
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
          <Button variant="ghost" size="icon-sm" aria-label="Manage registered teams">
            <Users2 className="size-3.5" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Registered Teams</DialogTitle>
          <p className="text-sm text-muted-foreground">Choose which teams are attending this competition.</p>
        </DialogHeader>
        <div className="space-y-2">
          {allTeams.length === 0 && <p className="text-sm text-muted-foreground">Create a team first under Admin → Teams.</p>}
          {allTeams.map((team) => (
            <div key={team.id} className="flex items-center gap-2">
              <Checkbox id={`team-${team.id}`} checked={selected.includes(team.id)} onCheckedChange={() => toggle(team.id)} />
              <Label htmlFor={`team-${team.id}`} className="cursor-pointer font-normal">
                {team.name} <span className="text-muted-foreground">({team.season})</span>
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
