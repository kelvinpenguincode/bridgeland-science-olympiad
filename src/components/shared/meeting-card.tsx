import { Calendar, Clock, MapPin, FileText, Link as LinkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDateWithWeekday, formatTime } from "@/lib/utils/date";
import type { MeetingRow } from "@/types/database";
import { cn } from "@/lib/utils";

export function MeetingCard({
  meeting,
  events = [],
  attachments = [],
  className,
  highlight = false,
}: {
  meeting: MeetingRow;
  events?: { id: string; name: string }[];
  attachments?: { id: string; name: string; url: string }[];
  className?: string;
  highlight?: boolean;
}) {
  return (
    <Card
      className={cn(
        highlight && "border-brand-orange/40 ring-1 ring-brand-orange/20",
        className
      )}
    >
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-lg font-semibold text-brand-navy">{meeting.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600">
              <Calendar className="size-4 text-brand-orange" aria-hidden="true" />
              {formatDateWithWeekday(meeting.meeting_date)}
            </p>
          </div>
          {meeting.attendance_required && (
            <Badge variant="outline" className="border-brand-orange/30 bg-brand-orange-light text-brand-orange-dark">
              Attendance Required
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <Clock className="size-4 text-muted-foreground" aria-hidden="true" />
            {formatTime(meeting.start_time)}
            {meeting.end_time ? ` – ${formatTime(meeting.end_time)}` : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4 text-muted-foreground" aria-hidden="true" />
            {meeting.location}
          </span>
        </div>

        {meeting.description && <p className="text-sm text-slate-600">{meeting.description}</p>}

        {meeting.agenda && (
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Agenda</p>
            <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{meeting.agenda}</p>
          </div>
        )}

        {meeting.required_materials && (
          <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              What to Bring
            </p>
            <p className="mt-1 text-sm text-slate-600">{meeting.required_materials}</p>
          </div>
        )}

        {events.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {events.map((e) => (
              <Badge key={e.id} variant="outline" className="bg-muted">
                {e.name}
              </Badge>
            ))}
          </div>
        )}

        {meeting.notes && (
          <div className="rounded-lg bg-muted/60 p-3">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Notes</p>
            <p className="mt-1 whitespace-pre-line text-sm text-slate-600">{meeting.notes}</p>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-border pt-3">
            {attachments.map((a) => (
              <a
                key={a.id}
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-brand-navy hover:bg-muted"
              >
                <FileText className="size-3.5" />
                {a.name}
                <LinkIcon className="size-3" />
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
