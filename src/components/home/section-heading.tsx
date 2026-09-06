import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  viewAllHref,
  viewAllLabel = "View all",
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  viewAllHref?: string;
  viewAllLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-1.5 text-xs font-semibold tracking-[0.18em] text-brand-orange uppercase">{eyebrow}</p>
        )}
        <h2 className="font-heading text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">{title}</h2>
        {description && <p className="mt-2 text-sm text-slate-600 sm:text-base">{description}</p>}
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1 text-sm font-semibold text-brand-orange-dark hover:underline"
        >
          {viewAllLabel}
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
