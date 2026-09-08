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

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

/** Parses a `YYYY-MM-DD` date or ISO timestamp as a local Date (no TZ shift). */
export function parseDateOnly(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

function formatOrFallback(date: Date, opts: Intl.DateTimeFormatOptions, fallback: string): string {
  if (!isValidDate(date)) return fallback;
  try {
    return new Intl.DateTimeFormat("en-US", opts).format(date);
  } catch {
    return fallback;
  }
}

export function formatDate(value: string | Date, opts: Intl.DateTimeFormatOptions = DATE_FMT): string {
  const date = typeof value === "string" ? parseDateOnly(value) : value;
  return formatOrFallback(date, opts, typeof value === "string" ? value : "");
}

export function formatDateShort(value: string | Date): string {
  return formatDate(value, DATE_SHORT_FMT);
}

export function formatDateWithWeekday(value: string | Date): string {
  return formatDate(value, DATE_WEEKDAY_FMT);
}

/** Parses Postgres `time`, `timestamptz`, ISO strings, and values like `7:00 PM`. */
export function parseTimeValue(value: string): Date | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.includes("T") || /^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const parsed = new Date(trimmed);
    return isValidDate(parsed) ? parsed : null;
  }

  const twelveHour = trimmed.match(/^(\d{1,2})(?::(\d{2}))?(?::\d{2})?\s*(am|pm)$/i);
  if (twelveHour) {
    let hours = Number(twelveHour[1]);
    const minutes = Number(twelveHour[2] ?? 0);
    const meridiem = twelveHour[3].toLowerCase();
    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return isValidDate(date) ? date : null;
  }

  const parts = trimmed.split(":");
  if (parts.length >= 2) {
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    if (
      Number.isFinite(hours) &&
      Number.isFinite(minutes) &&
      hours >= 0 &&
      hours < 24 &&
      minutes >= 0 &&
      minutes < 60
    ) {
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return isValidDate(date) ? date : null;
    }
  }

  return null;
}

export function formatTime(value: string | null | undefined): string {
  if (!value) return "";
  const parsed = parseTimeValue(value);
  if (!parsed) return value.trim();
  return formatOrFallback(parsed, { hour: "numeric", minute: "2-digit" }, value.trim());
}

export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return formatOrFallback(
    date,
    { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" },
    typeof value === "string" ? value : ""
  );
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
