import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-b border-white/10 bg-black/40", className)}>
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 sm:py-12 lg:flex-row lg:items-end lg:justify-between lg:px-8">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold tracking-[0.22em] text-brand-orange uppercase">
              {eyebrow}
            </p>
          )}
          <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          {description && <p className="mt-3 text-base leading-relaxed text-white/65">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
