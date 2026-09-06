import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { OfficerCategory, OfficerRow } from "@/types/database";

export async function listOfficers(category?: OfficerCategory) {
  const supabase = await createClient();
  let query = supabase
    .from("officers")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to load officers: ${error.message}`);
  return data as OfficerRow[];
}

export async function listAllOfficersForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("officers")
    .select("*")
    .order("category", { ascending: true })
    .order("display_order", { ascending: true });
  if (error) return [];
  return data as OfficerRow[];
}

export async function listOfficersGrouped() {
  const officers = await listOfficers();
  return {
    officers: officers.filter((o) => o.category === "officer"),
    captains: officers.filter((o) => o.category === "event_captain"),
    coaches: officers.filter((o) => o.category === "coach"),
  };
}
