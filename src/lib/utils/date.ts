const DATE_FMT: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
const DATE_SHORT_FMT: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
const DATE_WEEKDAY_FMT: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
};

/** Converts a date into a "2025-2026" academic-year label (Aug–Jul cutover). */
export function academicYearOf(dateStr?: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const year = d.getMonth() >= 7 ? d.getFullYear() : d.getFullYear() - 1;
  return `${year}-${year + 1}`;
}

/** Parses a `YYYY-MM-DD` date or ISO timestamp as a local Date (no TZ shift). */
export function parseDateOnly(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

export function formatDate(value: string | Date, opts: Intl.DateTimeFormatOptions = DATE_FMT): string {
  const date = typeof value === "string" ? parseDateOnly(value) : value;
  return new Intl.DateTimeFormat("en-US", opts).format(date);
}

export function formatDateShort(value: string | Date): string {
  return formatDate(value, DATE_SHORT_FMT);
}

export function formatDateWithWeekday(value: string | Date): string {
  return formatDate(value, DATE_WEEKDAY_FMT);
}

export function formatTime(value: string | null | undefined): string {
  if (!value) return "";
  const [h, m] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(date);
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function isFuture(value: string | Date): boolean {
  const date = typeof value === "string" ? parseDateOnly(value) : value;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date.getTime() >= now.getTime();
}

export function daysUntil(value: string | Date): number {
  const date = typeof value === "string" ? parseDateOnly(value) : value;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - now.getTime()) / 86_400_000);
}

export function relativeDayLabel(value: string | Date): string {
  const days = daysUntil(value);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  if (days > 0) return `In ${days} days`;
  return `${Math.abs(days)} days ago`;
}

/** Builds a Google Calendar "add event" link for a UTC-ish start/end pair. */
export function googleCalendarUrl(opts: {
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
}): string {
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates: `${fmt(opts.start)}/${fmt(opts.end)}`,
    details: opts.description ?? "",
    location: opts.location ?? "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
