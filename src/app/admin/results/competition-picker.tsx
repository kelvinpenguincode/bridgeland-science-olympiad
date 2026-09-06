"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils/date";
import type { CompetitionRow } from "@/types/database";

export function CompetitionPicker({ competitions, selectedId }: { competitions: CompetitionRow[]; selectedId?: string }) {
  const router = useRouter();

  return (
    <Select value={selectedId} onValueChange={(value) => value && router.push(`/admin/results?competition=${value}`)}>
      <SelectTrigger className="w-full bg-white sm:w-80" aria-label="Select competition">
        <SelectValue placeholder="Select a competition…" />
      </SelectTrigger>
      <SelectContent>
        {competitions.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name} — {formatDate(c.competition_date)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
