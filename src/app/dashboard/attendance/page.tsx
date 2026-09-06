import type { Metadata } from "next";
import { CalendarCheck2 } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { AttendanceBadge } from "@/components/shared/event-badge";
import { formatDate } from "@/lib/utils/date";
import { getCurrentProfile } from "@/lib/auth/session";
import { getMyAttendanceRecords, getMyAttendanceStats } from "@/lib/data/attendance";

export const metadata: Metadata = { title: "My Attendance | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function DashboardAttendancePage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const [stats, records] = await Promise.all([
    getMyAttendanceStats(profile.id),
    getMyAttendanceRecords(profile.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl font-bold text-brand-navy">My Attendance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Only you and team staff can see this record — attendance is never shared with other members.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Attendance Rate" value={`${stats.attendancePercentage}%`} accent="orange" />
        <StatCard label="Meetings Present" value={stats.present} accent="navy" />
        <StatCard label="Late Arrivals" value={stats.late} accent="neutral" />
        <StatCard label="Absences" value={stats.absent} accent="neutral" />
      </div>

      {records.length === 0 ? (
        <EmptyState icon={CalendarCheck2} title="No attendance recorded yet" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs font-semibold text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-2.5">Meeting</th>
                <th className="px-4 py-2.5">Date</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.map((r) => {
                const meeting = r.meeting as { title: string; meeting_date: string } | null;
                return (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-medium text-brand-navy">{meeting?.title ?? "Meeting"}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {meeting ? formatDate(meeting.meeting_date) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <AttendanceBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.notes ?? "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
