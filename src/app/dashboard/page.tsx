import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck, Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Countdown } from "@/components/shared/countdown";
import { AnnouncementCard } from "@/components/shared/announcement-card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  AttendanceSummaryCard,
  DeadlinesCard,
  MyEventsCard,
  MyTeamCard,
} from "@/components/dashboard/dashboard-cards";
import { formatDate, formatTime } from "@/lib/utils/date";
import { ClaimFirstAdminBanner } from "./claim-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentProfile } from "@/lib/auth/session";
import { getMyEventMemberships, getMyTeams } from "@/lib/data/member";
import { getMyAttendanceStats } from "@/lib/data/attendance";
import { getMyPlacementResults } from "@/lib/data/placement";
import { getNextMeeting } from "@/lib/data/meetings";
import { getNextCompetition } from "@/lib/data/competitions";
import { getLatestAnnouncement } from "@/lib/data/announcements";
import { listCalendarEvents } from "@/lib/data/calendar";
import { PLACEMENT_STATUS_LABELS } from "@/types/domain";

export const metadata: Metadata = { title: "Dashboard | Bridgeland Science Olympiad" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null; // guarded by layout

  const [teams, eventMemberships, attendanceStats, placementResults, nextMeeting, nextCompetition, announcement, deadlines] =
    await Promise.all([
      getMyTeams(profile.id),
      getMyEventMemberships(profile.id),
      getMyAttendanceStats(profile.id),
      getMyPlacementResults(),
      getNextMeeting(),
      getNextCompetition(),
      getLatestAnnouncement(),
      listCalendarEvents({ from: new Date(), categories: ["deadline"] }),
    ]);

  let showFirstAdminClaim = false;
  try {
    const admin = createAdminClient();
    const { count } = await admin
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .in("role", ["admin", "sponsor"]);
    showFirstAdminClaim = (count ?? 0) === 0;
  } catch {
    showFirstAdminClaim = false;
  }

  const firstName = (profile.preferred_name || profile.full_name).split(" ")[0];
  const latestPlacement = placementResults[0] as
    | { status: string; placement_test: { results_released: boolean; event: { name: string } | null } | null }
    | undefined;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl font-bold text-brand-navy">Welcome back, {firstName}!</h2>
        <p className="mt-1 text-sm text-muted-foreground">Here&apos;s what&apos;s happening with the team.</p>
      </div>

      {showFirstAdminClaim && <ClaimFirstAdminBanner />}

      {teams.length === 0 && (
        <p className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          You&apos;re not on a competition team yet. Officers and admins assign rosters — including from a
          spreadsheet — under Admin → Teams. Once you&apos;re placed, your team and events will show up here.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MyTeamCard teams={teams} />
        <MyEventsCard count={eventMemberships.length} />

        <Link
          href="/meetings"
          className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
        >
          <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="flex h-full flex-col gap-2">
              <span className="text-xs font-semibold tracking-wide text-brand-orange-dark uppercase">Next Meeting</span>
              {nextMeeting ? (
                <>
                  <p className="font-heading text-lg font-bold text-brand-navy">{formatDate(nextMeeting.meeting_date)}</p>
                  <p className="text-sm text-slate-600">
                    {formatTime(nextMeeting.start_time)} &middot; {nextMeeting.location}
                  </p>
                </>
              ) : (
                <p className="text-sm text-slate-500">No upcoming meeting.</p>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link
          href="/competitions"
          className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
        >
          <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="flex h-full flex-col gap-2">
              <span className="text-xs font-semibold tracking-wide text-brand-orange-dark uppercase">Next Competition</span>
              {nextCompetition ? (
                <>
                  <p className="font-heading text-lg font-bold text-brand-navy">{nextCompetition.name}</p>
                  <Countdown target={nextCompetition.competition_date} className="mt-1" />
                </>
              ) : (
                <p className="text-sm text-slate-500">No upcoming competition.</p>
              )}
            </CardContent>
          </Card>
        </Link>

        <DeadlinesCard deadlines={deadlines} />
        <AttendanceSummaryCard percentage={attendanceStats.attendancePercentage} total={attendanceStats.totalMeetings} />

        <Link
          href="/dashboard/results"
          className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
        >
          <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-md">
            <CardContent className="flex h-full flex-col gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-brand-orange-dark uppercase">
                <ClipboardCheck className="size-4" /> Placement Results
              </span>
              {latestPlacement ? (
                <>
                  <p className="font-heading text-lg font-bold text-brand-navy">
                    {latestPlacement.placement_test?.event?.name ?? "Placement Test"}
                  </p>
                  <Badge variant="outline" className="w-fit bg-muted text-xs">
                    {latestPlacement.placement_test?.results_released
                      ? PLACEMENT_STATUS_LABELS[latestPlacement.status as keyof typeof PLACEMENT_STATUS_LABELS]
                      : "Pending release"}
                  </Badge>
                </>
              ) : (
                <p className="text-sm text-slate-500">No placement results yet.</p>
              )}
            </CardContent>
          </Card>
        </Link>

        <div className="sm:col-span-2 lg:col-span-4">
          <Link
            href="/#announcements"
            className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
          >
            <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white">
                  <Megaphone className="size-4" aria-hidden="true" />
                </span>
                {announcement ? (
                  <div>
                    <p className="font-heading text-sm font-semibold text-brand-navy">{announcement.title}</p>
                    <p className="mt-0.5 line-clamp-2 text-sm text-slate-600">{announcement.summary}</p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No announcements yet.</p>
                )}
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      <section>
        <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">My Events</h3>
        {eventMemberships.length === 0 ? (
          <EmptyState title="No events assigned yet" description="Once officers assign you to events, they'll show up here." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {eventMemberships.slice(0, 3).map((m) => {
              const event = m.event as { id: string; name: string; slug: string } | null;
              const partner = m.partner as { full_name: string; preferred_name: string | null } | null;
              if (!event) return null;
              return (
                <Link
                  key={m.id}
                  href={`/events/${event.slug}`}
                  className="rounded-xl border border-border bg-white p-4 transition-shadow hover:shadow-md"
                >
                  <p className="font-medium text-brand-navy">{event.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {partner ? `Partner: ${partner.preferred_name || partner.full_name}` : "No partner assigned"}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {announcement && (
        <section>
          <h3 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">Latest Announcement</h3>
          <AnnouncementCard announcement={announcement} />
        </section>
      )}
    </div>
  );
}
