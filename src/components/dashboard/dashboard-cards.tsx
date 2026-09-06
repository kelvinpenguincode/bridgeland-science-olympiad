import Link from "next/link";
import type { ReactNode } from "react";
import { AlarmClock, CalendarCheck2, ListChecks, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/utils/date";
import type { CalendarEventRow } from "@/types/database";

function CardShell({
  icon: Icon,
  label,
  href,
  children,
}: {
  icon: typeof Users;
  label: string;
  href?: string;
  children: ReactNode;
}) {
  const inner = (
    <Card className={href ? "h-full transition-all hover:-translate-y-0.5 hover:shadow-md" : "h-full"}>
      <CardContent className="flex h-full flex-col gap-2">
        <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-brand-orange-dark uppercase">
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </span>
        {children}
      </CardContent>
    </Card>
  );
  return href ? (
    <Link
      href={href}
      className="block h-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
    >
      {inner}
    </Link>
  ) : (
    inner
  );
}

export function MyTeamCard({ teams }: { teams: { id: string; name: string; season: string }[] }) {
  return (
    <CardShell icon={Users} label="My Team">
      {teams.length === 0 ? (
        <p className="text-sm text-slate-500">Not yet assigned to a team.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {teams.map((t) => (
            <Badge key={t.id} variant="outline" className="border-brand-navy/20 bg-brand-navy/5 text-brand-navy">
              {t.name}
            </Badge>
          ))}
        </div>
      )}
      <p className="mt-auto text-xs text-muted-foreground">Season {teams[0]?.season ?? "—"}</p>
    </CardShell>
  );
}

export function MyEventsCard({ count }: { count: number }) {
  return (
    <CardShell icon={ListChecks} label="My Events" href="/dashboard/events">
      <p className="font-heading text-2xl font-bold text-brand-navy">{count}</p>
      <p className="text-sm text-slate-600">{count === 1 ? "event assigned" : "events assigned"}</p>
    </CardShell>
  );
}

export function DeadlinesCard({ deadlines }: { deadlines: CalendarEventRow[] }) {
  return (
    <CardShell icon={AlarmClock} label="Upcoming Deadlines" href="/calendar">
      {deadlines.length === 0 ? (
        <p className="text-sm text-slate-500">No deadlines coming up.</p>
      ) : (
        <ul className="space-y-1">
          {deadlines.slice(0, 3).map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-2 text-sm text-slate-600">
              <span className="truncate">{d.title}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{formatDateShort(d.start_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </CardShell>
  );
}

export function AttendanceSummaryCard({ percentage, total }: { percentage: number; total: number }) {
  return (
    <CardShell icon={CalendarCheck2} label="Attendance" href="/dashboard/attendance">
      <p className="font-heading text-2xl font-bold text-brand-navy">{total > 0 ? `${percentage}%` : "—"}</p>
      <p className="text-sm text-slate-600">
        {total > 0 ? `Across ${total} recorded meeting${total === 1 ? "" : "s"}` : "No attendance recorded yet"}
      </p>
    </CardShell>
  );
}
