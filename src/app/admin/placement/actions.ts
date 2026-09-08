"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";
import type { ActionResult } from "@/components/admin/crud-dialog";
import type { PlacementStatus } from "@/types/database";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertPlacementTestAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const staff = await requireAdmin();

  const id = str(formData, "id");
  const eventId = str(formData, "event_id");
  const testDate = str(formData, "test_date");
  const location = str(formData, "location");
  const maxScore = Number(str(formData, "max_score") || 100);
  const notes = str(formData, "notes");

  if (!eventId) return { success: false, error: "Event is required." };
  if (!testDate) return { success: false, error: "Test date is required." };

  const supabase = await createClient();
  const payload = {
    event_id: eventId,
    test_date: testDate,
    location: location || null,
    max_score: maxScore,
    notes: notes || null,
  };

  const { error } = id
    ? await supabase.from("placement_tests").update(payload).eq("id", id)
    : await supabase.from("placement_tests").insert({ ...payload, created_by: staff.id });

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/placement");
  revalidatePath("/placement");
  return { success: true };
}

export async function deletePlacementTestAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("placement_tests").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/placement");
  revalidatePath("/placement");
  return { success: true };
}

export async function toggleTestReleaseAction(testId: string, released: boolean): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase
    .from("placement_tests")
    .update({ results_released: released, released_at: released ? new Date().toISOString() : null })
    .eq("id", testId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/placement");
  revalidatePath("/dashboard/results");
  return { success: true };
}

export async function upsertPlacementResultAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const id = str(formData, "id");
  const placementTestId = str(formData, "placement_test_id");
  const profileId = str(formData, "profile_id");
  const rawScore = Number(str(formData, "raw_score") || 0);
  const rank = str(formData, "rank");
  const status = str(formData, "status") as PlacementStatus;
  const recommendedAssignment = str(formData, "recommended_assignment");
  const hideRawScore = str(formData, "hide_raw_score") === "true";
  const notes = str(formData, "notes");

  if (!placementTestId) return { success: false, error: "Missing placement test." };
  if (!profileId) return { success: false, error: "Student is required." };

  const supabase = await createClient();
  const payload = {
    placement_test_id: placementTestId,
    profile_id: profileId,
    raw_score: rawScore,
    rank: rank ? Number(rank) : null,
    status,
    recommended_assignment: recommendedAssignment || null,
    hide_raw_score: hideRawScore,
    notes: notes || null,
  };

  const { error } = id
    ? await supabase.from("placement_results").update(payload).eq("id", id)
    : await supabase.from("placement_results").insert(payload);

  if (error) {
    if (error.code === "23505") return { success: false, error: "This student already has a result for this test." };
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/placement");
  revalidatePath("/dashboard/results");
  return { success: true };
}

export async function deletePlacementResultAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("placement_results").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/placement");
  return { success: true };
}

export async function recalculateRanksAction(testId: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.rpc("recompute_placement_ranks", { p_test_id: testId });
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/placement");
  revalidatePath("/dashboard/results");
  return { success: true };
}

export interface CsvImportRow {
  email: string;
  rawScore: number;
}

export async function bulkImportScoresAction(testId: string, rows: CsvImportRow[]): Promise<ActionResult> {
  await requireAdmin();
  if (rows.length === 0) return { success: false, error: "No rows to import." };

  const supabase = await createClient();
  const emails = rows.map((r) => r.email.toLowerCase());
  const { data: profiles, error: profileError } = await supabase.from("profiles").select("id, email").in("email", emails);
  if (profileError) return { success: false, error: profileError.message };

  const emailToId = new Map((profiles ?? []).map((p) => [p.email.toLowerCase(), p.id]));
  const unmatched = rows.filter((r) => !emailToId.has(r.email.toLowerCase()));
  const matched = rows.filter((r) => emailToId.has(r.email.toLowerCase()));

  if (matched.length === 0) {
    return { success: false, error: "None of the emails matched an existing member." };
  }

  const { error } = await supabase.from("placement_results").upsert(
    matched.map((r) => ({
      placement_test_id: testId,
      profile_id: emailToId.get(r.email.toLowerCase())!,
      raw_score: r.rawScore,
    })),
    { onConflict: "placement_test_id,profile_id" }
  );

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/placement");
  if (unmatched.length > 0) {
    return {
      success: true,
      error: `Imported ${matched.length} of ${rows.length}. No match for: ${unmatched.map((r) => r.email).join(", ")}`,
    };
  }
  return { success: true };
}
