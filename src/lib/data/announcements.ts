import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AnnouncementRow } from "@/types/database";

/** Public/audience-aware announcement feed. RLS enforces audience visibility. */
export async function listAnnouncements(limit = 20) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .lte("publish_at", new Date().toISOString())
    .order("is_pinned", { ascending: false })
    .order("publish_at", { ascending: false })
    .limit(limit);
  if (error) return [] as AnnouncementRow[];
  return (data ?? []).filter((a) => !a.expires_at || new Date(a.expires_at) > new Date()) as AnnouncementRow[];
}

export async function getLatestAnnouncement() {
  const items = await listAnnouncements(1);
  return items[0] ?? null;
}

/** Full unfiltered list for admin management (RLS still restricts to staff). */
export async function listAllAnnouncementsForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("publish_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getAnnouncementBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("announcements").select("*").eq("slug", slug).maybeSingle();
  return data as AnnouncementRow | null;
}
