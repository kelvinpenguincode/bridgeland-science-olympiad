"use client";

import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { SearchBar } from "@/components/shared/search-bar";
import { FilterBar, ALL_VALUE, type FilterConfig } from "@/components/shared/filter-bar";
import { ResourceCard, type ResourceCardData } from "@/components/shared/resource-card";
import { EmptyState } from "@/components/shared/empty-state";
import { RESOURCE_DIFFICULTY_LABELS, RESOURCE_TYPE_LABELS } from "@/types/domain";
import type { ResourceDifficulty, ResourceType } from "@/types/database";

export function ResourcesExplorer({
  resources,
  events,
  years,
}: {
  resources: ResourceCardData[];
  events: { id: string; name: string; slug: string }[];
  years: number[];
}) {
  const [search, setSearch] = useState("");
  const [eventSlug, setEventSlug] = useState(ALL_VALUE);
  const [year, setYear] = useState(ALL_VALUE);
  const [type, setType] = useState(ALL_VALUE);
  const [difficulty, setDifficulty] = useState(ALL_VALUE);

  const filtered = useMemo(() => {
    return resources.filter((r) => {
      if (eventSlug !== ALL_VALUE && r.event?.slug !== eventSlug) return false;
      if (year !== ALL_VALUE && String(r.year) !== year) return false;
      if (type !== ALL_VALUE && r.type !== type) return false;
      if (difficulty !== ALL_VALUE && r.difficulty !== difficulty) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!r.title.toLowerCase().includes(q) && !(r.description ?? "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [resources, search, eventSlug, year, type, difficulty]);

  const filters: FilterConfig[] = [
    {
      key: "event",
      label: "Event",
      value: eventSlug,
      onChange: setEventSlug,
      options: events.map((e) => ({ value: e.slug, label: e.name })),
    },
    {
      key: "year",
      label: "Year",
      value: year,
      onChange: setYear,
      options: years.map((y) => ({ value: String(y), label: String(y) })),
    },
    {
      key: "type",
      label: "Type",
      value: type,
      onChange: setType,
      options: (Object.keys(RESOURCE_TYPE_LABELS) as ResourceType[]).map((t) => ({
        value: t,
        label: RESOURCE_TYPE_LABELS[t],
      })),
    },
    {
      key: "difficulty",
      label: "Difficulty",
      value: difficulty,
      onChange: setDifficulty,
      options: (Object.keys(RESOURCE_DIFFICULTY_LABELS) as ResourceDifficulty[]).map((d) => ({
        value: d,
        label: RESOURCE_DIFFICULTY_LABELS[d],
      })),
    },
  ];

  const hasActiveFilters =
    eventSlug !== ALL_VALUE || year !== ALL_VALUE || type !== ALL_VALUE || difficulty !== ALL_VALUE;

  return (
    <div className="space-y-6">
      <SearchBar value={search} onChange={setSearch} placeholder="Search resources…" ariaLabel="Search resources" className="max-w-sm" />
      <FilterBar
        filters={filters}
        onReset={
          hasActiveFilters
            ? () => {
                setEventSlug(ALL_VALUE);
                setYear(ALL_VALUE);
                setType(ALL_VALUE);
                setDifficulty(ALL_VALUE);
              }
            : undefined
        }
      />
      <p className="text-sm text-muted-foreground">
        {filtered.length} of {resources.length} resources
      </p>
      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title="No resources match your filters" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} />
          ))}
        </div>
      )}
    </div>
  );
}
