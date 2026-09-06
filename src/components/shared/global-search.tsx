"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, FileText, FlaskConical, Megaphone, Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { SearchResult } from "@/app/api/search/route";

const ICONS: Record<SearchResult["type"], typeof FlaskConical> = {
  event: FlaskConical,
  resource: FileText,
  competition: Calendar,
  announcement: Megaphone,
};

export function GlobalSearch({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onKeydown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    }
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => setResults(data.results ?? []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 250);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  function handleSelect(href: string) {
    onOpenChange(false);
    setQuery("");
    router.push(href);
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Bridgeland Science Olympiad"
      description="Search events, resources, competitions, and announcements"
    >
      <CommandInput
        placeholder="Search events, resources, competitions…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {query.trim().length < 2 ? (
          <CommandEmpty className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
            <Search className="size-5" />
            Type at least 2 characters to search.
          </CommandEmpty>
        ) : loading ? (
          <CommandEmpty>Searching…</CommandEmpty>
        ) : results.length === 0 ? (
          <CommandEmpty>No results found for &ldquo;{query}&rdquo;.</CommandEmpty>
        ) : (
          <CommandGroup heading="Results">
            {results.map((r) => {
              const Icon = ICONS[r.type];
              return (
                <CommandItem key={`${r.type}-${r.id}`} onSelect={() => handleSelect(r.href)}>
                  <Icon className="text-brand-orange" />
                  <span>{r.title}</span>
                  {r.subtitle && (
                    <span className="ml-auto text-xs text-muted-foreground">{r.subtitle}</span>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
