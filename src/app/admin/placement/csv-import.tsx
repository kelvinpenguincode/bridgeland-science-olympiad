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
import { bulkImportScoresAction } from "./actions";

function parseCsv(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.toLowerCase().startsWith("email"))
    .map((line) => {
      const [email, score] = line.split(",").map((p) => p.trim());
      return { email, rawScore: Number(score) };
    })
    .filter((row) => row.email && !Number.isNaN(row.rawScore));
}

export function CsvImportButton({ testId }: { testId: string }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [pending, startTransition] = useTransition();

  const rows = parseCsv(text);

  function handleImport() {
    if (rows.length === 0) {
      toast.error("No valid rows found. Use one \"email,score\" pair per line.");
      return;
    }
    startTransition(async () => {
      const result = await bulkImportScoresAction(testId, rows);
      if (result.success && !result.error) {
        toast.success(`Imported ${rows.length} scores.`);
        setText("");
        setOpen(false);
      } else if (result.success) {
        toast.warning(result.error);
        setText("");
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
            Import CSV
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Scores from CSV</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Paste rows as <code>email,score</code> — one student per line. Matches students by their account email.
          </p>
        </DialogHeader>
        <Textarea
          rows={8}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={"jane.doe@bridgeland.example,87\nsam.lee@bridgeland.example,92"}
        />
        <p className="text-xs text-muted-foreground">{rows.length} valid row{rows.length === 1 ? "" : "s"} detected.</p>
        <DialogFooter>
          <Button onClick={handleImport} disabled={pending || rows.length === 0}>
            {pending ? "Importing…" : `Import ${rows.length || ""}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
