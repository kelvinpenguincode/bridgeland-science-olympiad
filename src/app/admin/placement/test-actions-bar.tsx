"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Calculator, Lock, LockOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recalculateRanksAction, toggleTestReleaseAction } from "./actions";

export function RecalculateRanksButton({ testId }: { testId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await recalculateRanksAction(testId);
          if (result.success) toast.success("Rankings recalculated.");
          else toast.error(result.error ?? "Something went wrong.");
        })
      }
    >
      <Calculator className="size-4" data-icon="inline-start" />
      {pending ? "Calculating…" : "Recalculate Ranks"}
    </Button>
  );
}

export function ReleaseTestButton({ testId, released }: { testId: string; released: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant={released ? "outline" : "default"}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const result = await toggleTestReleaseAction(testId, !released);
          if (result.success) toast.success(released ? "Results hidden from students." : "Results released to students!");
          else toast.error(result.error ?? "Something went wrong.");
        })
      }
    >
      {released ? <Lock className="size-4" data-icon="inline-start" /> : <LockOpen className="size-4" data-icon="inline-start" />}
      {pending ? "Updating…" : released ? "Unrelease Results" : "Release Results"}
    </Button>
  );
}
