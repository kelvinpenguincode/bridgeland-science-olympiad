"use client";

import { ListFilter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterConfig {
  key: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export const ALL_VALUE = "all";

export function FilterBar({
  filters,
  onReset,
  className,
}: {
  filters: FilterConfig[];
  onReset?: () => void;
  className?: string;
}) {
  const hasActiveFilters = filters.some((f) => f.value !== ALL_VALUE);
  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground sm:flex">
          <ListFilter className="size-4" />
          Filter:
        </span>
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={filter.value}
            onValueChange={(value) => filter.onChange(value ?? ALL_VALUE)}
          >
            <SelectTrigger aria-label={filter.label} className="bg-white">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All {filter.label}</SelectItem>
              {filter.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        {hasActiveFilters && onReset && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-muted-foreground">
            <X className="size-3.5" data-icon="inline-start" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
