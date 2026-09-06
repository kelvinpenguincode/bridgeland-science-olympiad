import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarCheck2,
  CalendarPlus,
  ClipboardEdit,
  FileUp,
  Megaphone,
  Plus,
  Trophy,
  UsersRound,
} from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils/date";
import { getAdminStats, getRecentActivity } from "@/lib/data/admin-stats";

export const metadata: Metadata = { title: "Admin Overview | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

const QUICK_ACTIONS = [
  { href: "/admin/announcements", label: "New Announcement", icon: Megaphone },
  { href: "/admin/meetings", label: "Create Meeting", icon: ClipboardEdit },
  { href: "/admin/calendar", label: "Add Calendar Event", icon: CalendarPlus },
  { href: "/admin/resources", label: "Upload Resource", icon: FileUp },
  { href: "/admin/placement", label: "Enter Placement Results", icon: ClipboardEdit },
  { href: "/admin/teams", label: "Manage Teams", icon: UsersRound },
  { href: "/admin/competitions", label: "Add Competition", icon: Trophy },
];

export default async function AdminOverviewPage() {
  const [stats, activity] = await Promise.all([getAdminStats(), getRecentActivity()]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold text-brand-navy">Admin Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">A snapshot of the whole team, right now.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Members" value={stats.totalMembers} accent="navy" />
        <StatCard label="Active Events" value={stats.activeEvents} accent="orange" />
        <StatCard label="Upcoming Meetings" value={stats.upcomingMeetings} accent="neutral" />
        <StatCard label="Upcoming Competitions" value={stats.upcomingCompetitions} accent="orange" />
        <StatCard
          label="Unassigned Events"
          value={stats.unassignedEvents}
          accent={stats.unassignedEvents > 0 ? "orange" : "neutral"}
          hint={stats.unassignedEvents > 0 ? "Needs rostering" : "All events staffed"}
        />
        <StatCard label="Resources" value={stats.totalResources} accent="neutral" />
        <StatCard label="Attendance Rate" value={`${stats.attendanceRate}%`} accent="navy" />
      </div>

      <section>
        <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_ACTIONS.map((action) => (
            <Button
              key={action.href}
              variant="outline"
              className="h-auto justify-start gap-2.5 py-3"
              render={<Link href={action.href} />}
            >
              <action.icon className="size-4 text-brand-orange" />
              {action.label}
              <Plus className="ml-auto size-3.5 text-muted-foreground" data-icon="inline-end" />
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">Recent Activity</h3>
        {activity.length === 0 ? (
          <EmptyState icon={CalendarCheck2} title="No recent activity" />
        ) : (
          <div className="space-y-2">
            {activity.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white">
                    <Megaphone className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-brand-navy">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      by {(a.author as { full_name: string } | null)?.full_name ?? "Team"}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{formatDateTime(a.publish_at)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
