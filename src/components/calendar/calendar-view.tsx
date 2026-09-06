"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, MapPin, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CalendarCategoryBadge } from "@/components/shared/event-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";
import { formatDate, formatDateWithWeekday, formatTime, googleCalendarUrl } from "@/lib/utils/date";
import { CALENDAR_CATEGORY_DOT, CALENDAR_CATEGORY_LABELS } from "@/types/domain";
import type { CalendarCategory, CalendarEventRow } from "@/types/database";

type View = "month" | "week" | "agenda";

const ALL_CATEGORIES = Object.keys(CALENDAR_CATEGORY_LABELS) as CalendarCategory[];

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function startOfGrid(d: Date) {
  const first = startOfMonth(d);
  const day = first.getDay();
  const grid = new Date(first);
  grid.setDate(first.getDate() - day);
  return grid;
}
function startOfWeek(d: Date) {
  const s = new Date(d);
  s.setDate(d.getDate() - d.getDay());
  s.setHours(0, 0, 0, 0);
  return s;
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function CalendarView({ events }: { events: CalendarEventRow[] }) {
  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState(() => new Date());
  const [nowMs] = useState(() => Date.now());
  const [activeCategories, setActiveCategories] = useState<CalendarCategory[]>(ALL_CATEGORIES);
  const [selected, setSelected] = useState<CalendarEventRow | null>(null);

  const filtered = useMemo(
    () => events.filter((e) => activeCategories.includes(e.category)),
    [events, activeCategories]
  );

  const upcoming = useMemo(
    () =>
      filtered
        .filter((e) => new Date(e.start_at).getTime() >= nowMs)
        .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
        .slice(0, 6),
    [filtered, nowMs]
  );

  function toggleCategory(cat: CalendarCategory) {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function navigate(dir: -1 | 1) {
    setCursor((prev) => {
      if (view === "month") return new Date(prev.getFullYear(), prev.getMonth() + dir, 1);
      if (view === "week") return addDays(prev, dir * 7);
      return addDays(prev, dir * 30);
    });
  }

  const label =
    view === "week"
      ? `Week of ${formatDate(startOfWeek(cursor), { month: "long", day: "numeric", year: "numeric" })}`
      : new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(cursor);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-white p-1">
            {(["month", "week", "agenda"] as View[]).map((v) => (
              <Button
                key={v}
                type="button"
                size="sm"
                variant={view === v ? "default" : "ghost"}
                onClick={() => setView(v)}
                className="capitalize"
              >
                {v}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" onClick={() => navigate(-1)} aria-label="Previous">
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-[10rem] text-center text-sm font-semibold text-brand-navy">{label}</span>
            <Button variant="outline" size="icon-sm" onClick={() => navigate(1)} aria-label="Next">
              <ChevronRight className="size-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>
              Today
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {ALL_CATEGORIES.map((cat) => {
            const active = activeCategories.includes(cat);
            return (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                  active
                    ? "border-brand-navy/20 bg-white text-brand-navy"
                    : "border-border bg-muted/50 text-muted-foreground opacity-60"
                )}
              >
                <span className={cn("size-2 rounded-full", CALENDAR_CATEGORY_DOT[cat])} />
                {CALENDAR_CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>

        {view === "month" && (
          <MonthGrid cursor={cursor} events={filtered} onSelect={setSelected} />
        )}
        {view === "week" && <WeekGrid cursor={cursor} events={filtered} onSelect={setSelected} />}
        {view === "agenda" && <AgendaList events={filtered} onSelect={setSelected} />}
      </div>

      <aside className="space-y-3">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          <CalendarDays className="size-4" /> Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <EmptyState title="Nothing upcoming" className="py-8" />
        ) : (
          <div className="space-y-2">
            {upcoming.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e)}
                className="block w-full rounded-lg border border-border bg-white p-3 text-left transition-colors hover:border-brand-orange/40"
              >
                <div className="flex items-center gap-1.5">
                  <span className={cn("size-2 shrink-0 rounded-full", CALENDAR_CATEGORY_DOT[e.category])} />
                  <p className="truncate text-sm font-medium text-brand-navy">{e.title}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{formatDateWithWeekday(e.start_at)}</p>
              </button>
            ))}
          </div>
        )}
      </aside>

      <EventDialog event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function MonthGrid({
  cursor,
  events,
  onSelect,
}: {
  cursor: Date;
  events: CalendarEventRow[];
  onSelect: (e: CalendarEventRow) => void;
}) {
  const gridStart = startOfGrid(cursor);
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  const month = cursor.getMonth();

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white">
      <div className="grid grid-cols-7 border-b border-border bg-muted/50 text-center text-xs font-semibold text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const dayEvents = events.filter((e) => sameDay(new Date(e.start_at), day));
          const isCurrentMonth = day.getMonth() === month;
          const isToday = sameDay(day, new Date());
          return (
            <div
              key={i}
              className={cn(
                "min-h-[100px] border-b border-r border-border p-1.5 last:border-r-0",
                !isCurrentMonth && "bg-muted/30"
              )}
            >
              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center rounded-full text-xs font-medium",
                  isToday && "bg-brand-orange text-white",
                  !isCurrentMonth && "text-muted-foreground"
                )}
              >
                {day.getDate()}
              </span>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 3).map((e) => (
                  <button
                    key={e.id}
                    onClick={() => onSelect(e)}
                    className={cn(
                      "block w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium text-white",
                      CALENDAR_CATEGORY_DOT[e.category]
                    )}
                    title={e.title}
                  >
                    {e.title}
                  </button>
                ))}
                {dayEvents.length > 3 && (
                  <p className="px-1.5 text-[11px] text-muted-foreground">+{dayEvents.length - 3} more</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekGrid({
  cursor,
  events,
  onSelect,
}: {
  cursor: Date;
  events: CalendarEventRow[];
  onSelect: (e: CalendarEventRow) => void;
}) {
  const start = startOfWeek(cursor);
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
      {days.map((day) => {
        const dayEvents = events
          .filter((e) => sameDay(new Date(e.start_at), day))
          .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
        const isToday = sameDay(day, new Date());
        return (
          <div key={day.toISOString()} className="rounded-xl border border-border bg-white p-3">
            <p className={cn("text-xs font-semibold uppercase", isToday ? "text-brand-orange" : "text-muted-foreground")}>
              {new Intl.DateTimeFormat("en-US", { weekday: "short", day: "numeric" }).format(day)}
            </p>
            <div className="mt-2 space-y-1.5">
              {dayEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground">No events</p>
              ) : (
                dayEvents.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => onSelect(e)}
                    className="block w-full rounded-lg border border-border p-2 text-left text-xs hover:border-brand-orange/40"
                  >
                    <span className="flex items-center gap-1 font-medium text-brand-navy">
                      <span className={cn("size-1.5 rounded-full", CALENDAR_CATEGORY_DOT[e.category])} />
                      {e.title}
                    </span>
                    {!e.all_day && <span className="text-muted-foreground">{formatTime(toTimeStr(e.start_at))}</span>}
                  </button>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function toTimeStr(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function AgendaList({
  events,
  onSelect,
}: {
  events: CalendarEventRow[];
  onSelect: (e: CalendarEventRow) => void;
}) {
  const sorted = [...events].sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
  if (sorted.length === 0) {
    return <EmptyState title="No events match your filters" />;
  }

  const groups = new Map<string, CalendarEventRow[]>();
  for (const e of sorted) {
    const key = formatDateWithWeekday(e.start_at);
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }

  return (
    <div className="space-y-5">
      {Array.from(groups.entries()).map(([date, items]) => (
        <div key={date}>
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{date}</p>
          <div className="space-y-2">
            {items.map((e) => (
              <button
                key={e.id}
                onClick={() => onSelect(e)}
                className="flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-white p-4 text-left hover:border-brand-orange/40"
              >
                <div className="flex items-center gap-2">
                  <span className={cn("size-2 rounded-full", CALENDAR_CATEGORY_DOT[e.category])} />
                  <span className="text-sm font-medium text-brand-navy">{e.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {!e.all_day && <span>{formatTime(toTimeStr(e.start_at))}</span>}
                  {e.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" /> {e.location}
                    </span>
                  )}
                  <CalendarCategoryBadge category={e.category} />
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function EventDialog({ event, onClose }: { event: CalendarEventRow | null; onClose: () => void }) {
  return (
    <Dialog open={!!event} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {event && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className={cn("size-2.5 rounded-full", CALENDAR_CATEGORY_DOT[event.category])} />
                <DialogTitle>{event.title}</DialogTitle>
              </div>
              <div className="space-y-2 pt-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <Clock className="size-3.5" /> {formatDateWithWeekday(event.start_at)}
                  {!event.all_day && ` · ${formatTime(toTimeStr(event.start_at))}`}
                </p>
                {event.location && (
                  <p className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" /> {event.location}
                  </p>
                )}
                <CalendarCategoryBadge category={event.category} className="w-fit" />
                {event.description && <p className="pt-1 text-foreground">{event.description}</p>}
              </div>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                render={
                  <a
                    href={googleCalendarUrl({
                      title: event.title,
                      description: event.description ?? undefined,
                      location: event.location ?? undefined,
                      start: new Date(event.start_at),
                      end: new Date(event.end_at),
                    })}
                    target="_blank"
                    rel="noreferrer"
                  />
                }
              >
                Add to Google Calendar
                <ExternalLink className="size-3.5" data-icon="inline-end" />
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
