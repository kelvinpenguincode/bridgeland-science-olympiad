"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { claimFirstAdminAction } from "./claim-admin-action";

export function ClaimFirstAdminBanner() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-brand-orange/30 bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
          <ShieldCheck className="size-4 text-brand-orange" />
          No admin yet
        </p>
        <p className="mt-1 text-sm text-slate-600">
          This site has no admin. Claim admin access for this account so you can manage members,
          roles, and the public team page.
        </p>
      </div>
      <Button
        className="shrink-0 bg-brand-orange text-white hover:bg-brand-orange-dark"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await claimFirstAdminAction();
            if (result.success) {
              toast.success("You are now an admin.");
              router.refresh();
            } else {
              toast.error(result.error ?? "Could not claim admin.");
            }
          })
        }
      >
        {pending ? "Claiming…" : "Become the first admin"}
      </Button>
    </div>
  );
}
