import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  AnnouncementPriority,
  AppRole,
  AttendanceStatus,
  CalendarCategory,
  EventCategory,
  MedalType,
  PlacementStatus,
} from "@/types/database";
import {
  ANNOUNCEMENT_PRIORITY_STYLES,
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_STYLES,
  CALENDAR_CATEGORY_LABELS,
  CALENDAR_CATEGORY_STYLES,
  EVENT_CATEGORY_LABELS,
  MEDAL_LABELS,
  MEDAL_STYLES,
  PLACEMENT_STATUS_LABELS,
  PLACEMENT_STATUS_STYLES,
  ROLE_LABELS,
} from "@/types/domain";

const ROLE_STYLES: Record<AppRole, string> = {
  sponsor: "bg-brand-navy text-white border-brand-navy",
  admin: "bg-brand-orange-light text-brand-orange-dark border-orange-200",
  officer: "bg-sky-50 text-sky-700 border-sky-200",
  event_captain: "bg-indigo-50 text-indigo-700 border-indigo-200",
  member: "bg-muted text-muted-foreground border-border",
};

export function RoleBadge({ role, className }: { role: AppRole; className?: string }) {
  return (
    <Badge variant="outline" className={cn(ROLE_STYLES[role], className)}>
      {ROLE_LABELS[role]}
    </Badge>
  );
}

const EVENT_CATEGORY_STYLES: Record<EventCategory, string> = {
  life_personal_social: "bg-emerald-50 text-emerald-700 border-emerald-200",
  earth_space: "bg-indigo-50 text-indigo-700 border-indigo-200",
  physical_chemistry: "bg-brand-orange-light text-brand-orange-dark border-orange-200",
  tech_engineering: "bg-sky-50 text-sky-700 border-sky-200",
  inquiry_nature: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
};

export function CategoryBadge({ category, className }: { category: EventCategory; className?: string }) {
  return (
    <Badge variant="outline" className={cn(EVENT_CATEGORY_STYLES[category], className)}>
      {EVENT_CATEGORY_LABELS[category]}
    </Badge>
  );
}

export function CalendarCategoryBadge({
  category,
  className,
}: {
  category: CalendarCategory;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn(CALENDAR_CATEGORY_STYLES[category], className)}>
      {CALENDAR_CATEGORY_LABELS[category]}
    </Badge>
  );
}

export function AttendanceBadge({ status, className }: { status: AttendanceStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn(ATTENDANCE_STATUS_STYLES[status], className)}>
      {ATTENDANCE_STATUS_LABELS[status]}
    </Badge>
  );
}

export function ResultBadge({ medal, className }: { medal: MedalType; className?: string }) {
  if (medal === "none") return null;
  return (
    <Badge variant="outline" className={cn("font-semibold", MEDAL_STYLES[medal], className)}>
      🏅 {MEDAL_LABELS[medal]}
    </Badge>
  );
}

export function PlacementStatusBadge({ status, className }: { status: PlacementStatus; className?: string }) {
  return (
    <Badge variant="outline" className={cn(PLACEMENT_STATUS_STYLES[status], className)}>
      {PLACEMENT_STATUS_LABELS[status]}
    </Badge>
  );
}

export function PriorityBadge({ priority, className }: { priority: AnnouncementPriority; className?: string }) {
  if (priority === "normal") return null;
  return (
    <Badge variant="outline" className={cn("font-semibold uppercase", ANNOUNCEMENT_PRIORITY_STYLES[priority], className)}>
      {priority}
    </Badge>
  );
}
