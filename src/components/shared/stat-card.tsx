import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent = "orange",
  className,
}: {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  hint?: ReactNode;
  accent?: "orange" | "navy" | "neutral" | "warning";
  className?: string;
}) {
  return (
    <Card className={cn("gap-3", className)}>
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
          <p className="mt-1.5 font-heading text-2xl font-bold text-brand-navy">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        {Icon && (
          <span
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              accent === "orange" && "bg-brand-orange-light text-brand-orange-dark",
              accent === "navy" && "bg-brand-navy text-white",
              accent === "neutral" && "bg-muted text-muted-foreground",
              accent === "warning" && "bg-amber-50 text-amber-600"
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </span>
        )}
      </CardContent>
    </Card>
  );
}
