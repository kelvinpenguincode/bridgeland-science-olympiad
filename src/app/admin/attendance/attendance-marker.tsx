"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ATTENDANCE_STATUS_LABELS, ATTENDANCE_STATUS_STYLES } from "@/types/domain";
import { saveAttendanceAction } from "./actions";
import type { AttendanceStatus, ProfileRow } from "@/types/database";

const STATUSES: AttendanceStatus[] = ["present", "late", "excused", "absent"];

export function AttendanceMarker({
  meetingId,
  members,
  initialStatuses,
}: {
  meetingId: string;
  members: ProfileRow[];
  initialStatuses: Record<string, AttendanceStatus | undefined>;
}) {
  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus | undefined>>(initialStatuses);
  const [pending, startTransition] = useTransition();

  function setStatus(profileId: string, status: AttendanceStatus) {
    setStatuses((prev) => ({ ...prev, [profileId]: status }));
  }

  function markAll(status: AttendanceStatus) {
    setStatuses(Object.fromEntries(members.map((m) => [m.id, status])));
  }

  function save() {
    const entries = members
      .map((m) => ({ profileId: m.id, status: statuses[m.id] }))
      .filter((e): e is { profileId: string; status: AttendanceStatus } => !!e.status);

    startTransition(async () => {
      const result = await saveAttendanceAction(meetingId, entries);
      if (result.success) {
        toast.success("Attendance saved.");
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  }

  const markedCount = Object.values(statuses).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-white p-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-muted-foreground">Quick actions:</span>
          {STATUSES.map((s) => (
            <Button key={s} type="button" variant="outline" size="sm" onClick={() => markAll(s)}>
              Mark all {ATTENDANCE_STATUS_LABELS[s].toLowerCase()}
            </Button>
          ))}
        </div>
        <Button onClick={save} disabled={pending}>
          <Save className="size-4" data-icon="inline-start" />
          {pending ? "Saving…" : `Save (${markedCount}/${members.length})`}
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <ul className="divide-y divide-border">
          {members.map((member) => (
            <li key={member.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-brand-navy">{member.full_name}</p>
                {member.grade && <p className="text-xs text-muted-foreground">Grade {member.grade}</p>}
              </div>
              <div className="flex gap-1.5" role="group" aria-label={`Attendance status for ${member.full_name}`}>
                {STATUSES.map((s) => {
                  const active = statuses[member.id] === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(member.id, s)}
                      aria-pressed={active}
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                        active ? ATTENDANCE_STATUS_STYLES[s] : "border-border bg-white text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {ATTENDANCE_STATUS_LABELS[s]}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
