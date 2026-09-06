import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/shared/event-badge";
import { DynamicIcon } from "@/components/shared/dynamic-icon";
import type { SciolyEventRow } from "@/types/database";

export function EventCard({ event }: { event: SciolyEventRow }) {
  return (
    <Card className="group h-full transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-orange-light text-brand-orange-dark transition-colors group-hover:bg-brand-orange group-hover:text-white">
            <DynamicIcon name={event.icon} className="size-5" aria-hidden="true" />
          </span>
        </div>
        <CardTitle className="mt-2 text-base">{event.name}</CardTitle>
        <CategoryBadge category={event.category} className="mt-1 w-fit" />
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="line-clamp-3 flex-1 text-sm text-slate-600">{event.description}</p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-fit self-end text-brand-orange-dark hover:bg-brand-orange-light hover:text-brand-orange-dark"
          render={<Link href={`/events/${event.slug}`} />}
        >
          View Event
          <ArrowRight className="size-3.5" data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  );
}
