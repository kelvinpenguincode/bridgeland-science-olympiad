"use client";

import { useMemo, useState } from "react";
import { FlaskConical } from "lucide-react";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar, ALL_VALUE, type FilterConfig } from "@/components/shared/filter-bar";
import { EventCard } from "@/components/shared/event-card";
import { EmptyState } from "@/components/shared/empty-state";
import { EVENT_CATEGORY_LABELS, EVENT_CATEGORY_ORDER } from "@/types/domain";
import type { EventCategory, SciolyEventRow } from "@/types/database";

export function EventsExplorer({ events }: { events: SciolyEventRow[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>(ALL_VALUE);

  const filtered = useMemo(() => {
    return events.filter((event) => {
      if (category !== ALL_VALUE && event.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!event.name.toLowerCase().includes(q) && !(event.description ?? "").toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [events, search, category]);

  const filters: FilterConfig[] = [
    {
      key: "category",
      label: "Category",
      value: category,
      onChange: setCategory,
      options: EVENT_CATEGORY_ORDER.map((c: EventCategory) => ({ value: c, label: EVENT_CATEGORY_LABELS[c] })),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search events…"
          ariaLabel="Search events"
          className="sm:max-w-xs"
        />
        <FilterBar filters={filters} onReset={() => setCategory(ALL_VALUE)} />
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} of {events.length} events
      </p>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          title="No events match your filters"
          description="Try a different search term or category."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
