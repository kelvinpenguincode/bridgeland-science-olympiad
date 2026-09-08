"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle className="size-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-heading text-2xl font-bold text-brand-navy">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm text-slate-600">
        An unexpected error occurred while loading this page. You can try again, or head back to the homepage.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={() => reset()}>Try again</Button>
        <Button variant="outline" render={<Link href="/" />}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
