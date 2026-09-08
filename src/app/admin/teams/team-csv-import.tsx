"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { importRosterCsvAction } from "./actions";

function parseCsv(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.toLowerCase().startsWith("email"))
    .map((line) => {
      const [email, team, event] = line.split(",").map((p) => p.trim());
      return { email, team, event: event || undefined };
    })
    .filter((row) => row.email && row.team);
}

export function TeamCsvImportButton() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();
  const rows = parseCsv(text);

  function handleImport() {
    if (rows.length === 0) {
      toast.error("No valid rows. Use email,team or email,team,event.");
      return;
    }
    startTransition(async () => {
      const result = await importRosterCsvAction(rows);
      if (result.success && !result.error) {
        toast.success(`Assigned ${rows.length} row(s).`);
        setText("");
        setOpen(false);
      } else if (result.success) {
        toast.warning(result.error);
        setOpen(false);
      } else {
        toast.error(result.error ?? "Import failed.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Upload className="size-4" data-icon="inline-start" />
            Import spreadsheet
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign teams from a spreadsheet</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Paste CSV rows as <code>email,team</code> or <code>email,team,event</code>. Team names
            and event names must already exist. Students must already have accounts.
          </p>
        </DialogHeader>
        <Textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"olivia@school.org,Varsity A,Anatomy and Physiology\nliam@school.org,JV A"}
        />
        <p className="text-xs text-muted-foreground">{rows.length} valid row{rows.length === 1 ? "" : "s"} ready.</p>
        <DialogFooter>
          <Button onClick={handleImport} disabled={pending}>
            {pending ? "Importing…" : "Assign rows"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
