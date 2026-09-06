"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Lock, LockOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleResultsReleaseAction } from "@/app/admin/competitions/actions";

export function ReleaseResultsButton({ competitionId, released }: { competitionId: string; released: boolean }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await toggleResultsReleaseAction(competitionId, !released);
      if (result.success) {
        toast.success(released ? "Results hidden from the public page." : "Results released to the public!");
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <Button variant={released ? "outline" : "default"} onClick={handleClick} disabled={pending}>
      {released ? <Lock className="size-4" data-icon="inline-start" /> : <LockOpen className="size-4" data-icon="inline-start" />}
      {pending ? "Updating…" : released ? "Unrelease Results" : "Release Results"}
    </Button>
  );
}
