import type { Metadata } from "next";
import { EmptyState } from "@/components/shared/empty-state";
import { listAllMeetingsForAdmin } from "@/lib/data/meetings";
import { getMeetingAttendanceRoster } from "@/lib/data/attendance";
import { listAllMembersForAdmin } from "@/lib/data/members";
import { MeetingPicker } from "./meeting-picker";
import { AttendanceMarker } from "./attendance-marker";
import type { AttendanceStatus } from "@/types/database";

export const metadata: Metadata = { title: "Manage Attendance | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function AdminAttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ meeting?: string }>;
}) {
  const { meeting: meetingId } = await searchParams;
  const [meetings, members] = await Promise.all([listAllMeetingsForAdmin(), listAllMembersForAdmin()]);

  const activeMembers = members.filter((m) => m.is_active && m.role !== "sponsor");
  const selected = meetingId ? meetings.find((m) => m.id === meetingId) : meetings[0];
  const existingRoster = selected ? await getMeetingAttendanceRoster(selected.id) : [];

  const initialStatuses: Record<string, AttendanceStatus | undefined> = {};
  for (const r of existingRoster) {
    initialStatuses[r.profile_id] = r.status;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-brand-navy">Attendance</h2>
        <p className="mt-1 text-sm text-muted-foreground">Select a meeting and mark attendance for the active roster. Only staff can view or edit these records.</p>
      </div>

      <MeetingPicker meetings={meetings} selectedId={selected?.id} />

      {!selected ? (
        <EmptyState title="No meetings yet" description="Create a meeting first under Admin → Meetings." />
      ) : activeMembers.length === 0 ? (
        <EmptyState title="No active members" description="Add members to the roster first." />
      ) : (
        <AttendanceMarker meetingId={selected.id} members={activeMembers} initialStatuses={initialStatuses} />
      )}
    </div>
  );
}
