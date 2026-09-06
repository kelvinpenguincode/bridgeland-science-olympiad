import "server-only";
import { createClient } from "@/lib/supabase/server";

/** Public placement page: dates/status only — never raw scores. */
export async function listPublicPlacementTests() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("placement_tests")
    .select("*, event:scioly_events(name, slug, icon)")
    .order("test_date", { ascending: true });
  if (error) return [];
  return data ?? [];
}

/** Admin: all placement tests, newest first. */
export async function listAllPlacementTestsForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("placement_tests")
    .select("*, event:scioly_events(id, name, slug)")
    .order("test_date", { ascending: false });
  if (error) return [];
  return data ?? [];
}

/** Admin: every result row for a given test, with student names. */
export async function getPlacementResultsForTest(testId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("placement_results")
    .select("*, profile:profiles!placement_results_profile_id_fkey(id, full_name, email, grade)")
    .eq("placement_test_id", testId)
    .order("rank", { ascending: true, nullsFirst: false });
  if (error) return [];
  return data ?? [];
}

/** A member's own placement results (RLS enforces "own row, after release"). */
export async function getMyPlacementResults() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from("placement_results")
    .select("*, placement_test:placement_tests(event_id, test_date, max_score, results_released, event:scioly_events(name, slug))")
    .eq("profile_id", userData.user.id)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}
