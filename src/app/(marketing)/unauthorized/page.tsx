import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Unauthorized | Bridgeland Science Olympiad",
};

export default function UnauthorizedPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600">
        <ShieldAlert className="size-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-heading text-2xl font-bold text-brand-navy">You don&apos;t have access to this page</h1>
      <p className="mt-3 text-sm text-slate-600">
        Your account role doesn&apos;t have permission to view this section. If you think this is a mistake,
        contact a team officer or coach.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button render={<Link href="/dashboard" />}>Go to my dashboard</Button>
        <Button variant="outline" render={<Link href="/" />}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
