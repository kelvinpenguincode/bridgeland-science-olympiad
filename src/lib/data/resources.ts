import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ResourceDifficulty, ResourceType } from "@/types/database";

export interface ResourceFilters {
  eventId?: string;
  year?: number;
  type?: ResourceType;
  difficulty?: ResourceDifficulty;
  search?: string;
}

export async function listResources(filters: ResourceFilters = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("resources")
    .select("*, event:scioly_events(name, slug), author:profiles(full_name)")
    .order("created_at", { ascending: false });

  if (filters.eventId) query = query.eq("event_id", filters.eventId);
  if (filters.year) query = query.eq("year", filters.year);
  if (filters.type) query = query.eq("type", filters.type);
  if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function listResourceYears() {
  const supabase = await createClient();
  const { data } = await supabase.from("resources").select("year").order("year", { ascending: false });
  return Array.from(new Set((data ?? []).map((r) => r.year)));
}
