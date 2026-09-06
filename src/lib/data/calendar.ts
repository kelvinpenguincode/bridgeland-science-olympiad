import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { CalendarCategory, CalendarEventRow } from "@/types/database";

export async function listCalendarEvents(opts: {
  from?: Date;
  to?: Date;
  categories?: CalendarCategory[];
} = {}) {
  const supabase = await createClient();
  let query = supabase.from("calendar_events").select("*").order("start_at", { ascending: true });
  if (opts.from) query = query.gte("start_at", opts.from.toISOString());
  if (opts.to) query = query.lte("start_at", opts.to.toISOString());
  if (opts.categories && opts.categories.length > 0) query = query.in("category", opts.categories);

  const { data, error } = await query;
  if (error) return [] as CalendarEventRow[];
  return data as CalendarEventRow[];
}

export async function listUpcomingCalendarEvents(limit = 6) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .gte("start_at", new Date().toISOString())
    .order("start_at", { ascending: true })
    .limit(limit);
  if (error) return [] as CalendarEventRow[];
  return data as CalendarEventRow[];
}

export async function getCalendarEventById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("calendar_events").select("*").eq("id", id).maybeSingle();
  return data as CalendarEventRow | null;
}
