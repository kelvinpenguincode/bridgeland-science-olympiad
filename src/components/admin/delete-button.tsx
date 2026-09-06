"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ActionResult } from "@/components/admin/crud-dialog";

export function DeleteButton({
  action,
  title = "Delete this item?",
  description = "This action cannot be undone.",
  label,
}: {
  action: () => Promise<ActionResult>;
  title?: string;
  description?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    const result = await action();
    setPending(false);
    if (result.success) {
      toast.success("Deleted.");
      setOpen(false);
    } else {
      toast.error(result.error ?? "Something went wrong.");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="ghost"
        size={label ? "sm" : "icon-sm"}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        onClick={() => setOpen(true)}
        aria-label={label ?? "Delete"}
      >
        <Trash2 className="size-3.5" data-icon={label ? "inline-start" : undefined} />
        {label}
      </Button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={handleConfirm} disabled={pending}>
            {pending && <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />}
            {pending ? "Deleting…" : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
