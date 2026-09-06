"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils/date";

type TestOption = { id: string; label: string; date: string };

export function TestPicker({ tests, selectedId }: { tests: TestOption[]; selectedId?: string }) {
  const router = useRouter();

  return (
    <Select value={selectedId} onValueChange={(value) => value && router.push(`/admin/placement?test=${value}`)}>
      <SelectTrigger className="w-full bg-white sm:w-96" aria-label="Select placement test">
        <SelectValue placeholder="Select a placement test…" />
      </SelectTrigger>
      <SelectContent>
        {tests.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.label} — {formatDate(t.date)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
