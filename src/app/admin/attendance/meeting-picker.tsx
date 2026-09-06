"use client";

import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate } from "@/lib/utils/date";
import type { MeetingRow } from "@/types/database";

export function MeetingPicker({ meetings, selectedId }: { meetings: MeetingRow[]; selectedId?: string }) {
  const router = useRouter();

  return (
    <Select value={selectedId} onValueChange={(value) => value && router.push(`/admin/attendance?meeting=${value}`)}>
      <SelectTrigger className="w-full bg-white sm:w-96" aria-label="Select meeting">
        <SelectValue placeholder="Select a meeting…" />
      </SelectTrigger>
      <SelectContent>
        {meetings.map((m) => (
          <SelectItem key={m.id} value={m.id}>
            {m.title} — {formatDate(m.meeting_date)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
