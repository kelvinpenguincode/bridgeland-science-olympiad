import Link from "next/link";
import { CalendarCheck, ClipboardCheck, Megaphone, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Countdown } from "@/components/shared/countdown";
import { PriorityBadge } from "@/components/shared/event-badge";
import { formatDate, formatTime } from "@/lib/utils/date";
import type { AnnouncementRow, CompetitionRow, MeetingRow } from "@/types/database";

function InfoCardShell({
  icon: Icon,
  label,
  href,
  children,
}: {
  icon: typeof CalendarCheck;
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2">
      <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
        <CardContent className="flex h-full flex-col gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-brand-orange-dark uppercase">
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </span>
          {children}
        </CardContent>
      </Card>
    </Link>
  );
}

export function NextMeetingCard({ meeting }: { meeting: MeetingRow | null }) {
  return (
    <InfoCardShell icon={CalendarCheck} label="Next Meeting" href="/meetings">
      {meeting ? (
        <>
          <p className="font-heading text-lg font-bold text-brand-navy">{formatDate(meeting.meeting_date)}</p>
          <p className="text-sm text-slate-600">
            {formatTime(meeting.start_time)} &middot; {meeting.location}
          </p>
        </>
      ) : (
        <p className="text-sm text-slate-500">No upcoming meeting scheduled.</p>
      )}
    </InfoCardShell>
  );
}

export function NextCompetitionCard({ competition }: { competition: CompetitionRow | null }) {
  return (
    <InfoCardShell icon={Trophy} label="Next Competition" href="/competitions">
      {competition ? (
        <>
          <p className="font-heading text-lg font-bold text-brand-navy">{competition.name}</p>
          <p className="text-sm text-slate-600">{formatDate(competition.competition_date)}</p>
          <Countdown target={competition.competition_date} className="mt-1" />
        </>
      ) : (
        <p className="text-sm text-slate-500">No upcoming competition scheduled.</p>
      )}
    </InfoCardShell>
  );
}

export function LatestAnnouncementCard({ announcement }: { announcement: AnnouncementRow | null }) {
  return (
    <InfoCardShell icon={Megaphone} label="Latest Announcement" href="/#announcements">
      {announcement ? (
        <>
          <p className="font-heading line-clamp-2 text-base font-bold text-brand-navy">{announcement.title}</p>
          <p className="line-clamp-2 text-sm text-slate-600">{announcement.summary}</p>
          <PriorityBadge priority={announcement.priority} className="mt-1 w-fit" />
        </>
      ) : (
        <p className="text-sm text-slate-500">No announcements yet.</p>
      )}
    </InfoCardShell>
  );
}

export function PlacementStatusCard({
  releasedCount,
  totalCount,
}: {
  releasedCount: number;
  totalCount: number;
}) {
  return (
    <InfoCardShell icon={ClipboardCheck} label="Placement Testing" href="/placement">
      <p className="font-heading text-lg font-bold text-brand-navy">
        {totalCount === 0 ? "No tests scheduled" : `${releasedCount} of ${totalCount} released`}
      </p>
      <p className="text-sm text-slate-600">Check dates, policies, and your results status.</p>
      <Badge variant="outline" className="w-fit bg-muted text-xs">
        View placement info
      </Badge>
    </InfoCardShell>
  );
}
