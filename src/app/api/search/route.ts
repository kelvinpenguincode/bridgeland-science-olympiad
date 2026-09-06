import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface SearchResult {
  id: string;
  type: "event" | "resource" | "competition" | "announcement";
  title: string;
  subtitle?: string;
  href: string;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ results: [] satisfies SearchResult[] });
  }

  const supabase = await createClient();
  const like = `%${q}%`;

  const [events, resources, competitions, announcements] = await Promise.all([
    supabase
      .from("scioly_events")
      .select("id, name, slug, category")
      .eq("is_active", true)
      .ilike("name", like)
      .limit(5),
    supabase
      .from("resources")
      .select("id, title, type")
      .ilike("title", like)
      .limit(5),
    supabase
      .from("competitions")
      .select("id, name, slug, competition_date")
      .ilike("name", like)
      .limit(5),
    supabase
      .from("announcements")
      .select("id, title, slug")
      .ilike("title", like)
      .limit(5),
  ]);

  const results: SearchResult[] = [
    ...(events.data ?? []).map((e) => ({
      id: e.id,
      type: "event" as const,
      title: e.name,
      subtitle: "Event",
      href: `/events/${e.slug}`,
    })),
    ...(resources.data ?? []).map((r) => ({
      id: r.id,
      type: "resource" as const,
      title: r.title,
      subtitle: "Resource",
      href: `/resources?q=${encodeURIComponent(r.title)}`,
    })),
    ...(competitions.data ?? []).map((c) => ({
      id: c.id,
      type: "competition" as const,
      title: c.name,
      subtitle: "Competition",
      href: `/competitions/${c.slug}`,
    })),
    ...(announcements.data ?? []).map((a) => ({
      id: a.id,
      type: "announcement" as const,
      title: a.title,
      subtitle: "Announcement",
      href: `/#announcements`,
    })),
  ];

  return NextResponse.json({ results });
}
