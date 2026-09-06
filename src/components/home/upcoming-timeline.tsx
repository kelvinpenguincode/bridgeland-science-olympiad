import { CalendarCategoryBadge } from "@/components/shared/event-badge";
import { formatDateWithWeekday } from "@/lib/utils/date";
import type { CalendarEventRow } from "@/types/database";
import { EmptyState } from "@/components/shared/empty-state";
import { CalendarClock } from "lucide-react";

export function UpcomingTimeline({ items }: { items: CalendarEventRow[] }) {
  if (items.length === 0) {
    return <EmptyState icon={CalendarClock} title="Nothing on the calendar yet" />;
  }

  return (
    <ol className="relative space-y-6 border-l border-border pl-6">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute top-1.5 -left-[29px] flex size-3.5 items-center justify-center rounded-full border-2 border-white bg-brand-orange" />
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            {formatDateWithWeekday(item.start_at)}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h3 className="font-heading text-base font-semibold text-brand-navy">{item.title}</h3>
            <CalendarCategoryBadge category={item.category} />
          </div>
          {item.location && <p className="mt-0.5 text-sm text-slate-600">{item.location}</p>}
        </li>
      ))}
    </ol>
  );
}
