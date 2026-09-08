import { Megaphone, Pin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PriorityBadge } from "@/components/shared/event-badge";
import { formatDate } from "@/lib/utils/date";
import { announcementByline } from "@/lib/content/announcer";
import type { AnnouncementWithAuthor } from "@/lib/data/announcements";
import { cn } from "@/lib/utils";

export function AnnouncementCard({
  announcement,
  className,
}: {
  announcement: AnnouncementWithAuthor;
  className?: string;
}) {
  return (
    <Card className={cn("gap-3", className)}>
      <CardContent className="flex gap-3">
        <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-white">
          <Megaphone className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            {announcement.is_pinned && (
              <Pin className="size-3.5 text-brand-orange" aria-label="Pinned announcement" />
            )}
            <h3 className="font-heading text-sm font-semibold text-brand-navy">{announcement.title}</h3>
            <PriorityBadge priority={announcement.priority} />
          </div>
          <p className="line-clamp-2 text-sm text-slate-600">{announcement.summary}</p>
          <p className="text-xs text-muted-foreground">
            {announcement.posted_as || announcementByline(announcement.author)} · {formatDate(announcement.publish_at)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
