import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/database";

export async function listAllMembersForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("profiles").select("*").order("full_name", { ascending: true });
  if (error) return [];
  return data as ProfileRow[];
}
