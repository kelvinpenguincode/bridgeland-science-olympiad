"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";
import type { ActionResult } from "@/components/admin/crud-dialog";
import type { MedalType } from "@/types/database";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertResultAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const id = str(formData, "id");
  const competitionId = str(formData, "competition_id");
  const teamId = str(formData, "team_id");
  const eventId = str(formData, "event_id");
  const placement = str(formData, "placement");
  const medal = str(formData, "medal") as MedalType;
  const score = str(formData, "score");
  const notes = str(formData, "notes");

  if (!competitionId) return { success: false, error: "Missing competition." };
  if (!teamId) return { success: false, error: "Team is required." };

  const supabase = await createClient();
  const payload = {
    competition_id: competitionId,
    team_id: teamId,
    event_id: eventId || null,
    placement: placement ? Number(placement) : null,
    medal: medal || "none",
    score: score ? Number(score) : null,
    notes: notes || null,
  };

  const { error } = id
    ? await supabase.from("competition_results").update(payload).eq("id", id)
    : await supabase.from("competition_results").insert(payload);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/results");
  revalidatePath("/results");
  revalidatePath("/competitions");
  return { success: true };
}

export async function deleteResultAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("competition_results").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/results");
  revalidatePath("/results");
  return { success: true };
}
