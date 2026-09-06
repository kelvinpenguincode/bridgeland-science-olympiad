"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/session";
import { slugify } from "@/lib/utils/slugify";
import type { ActionResult } from "@/components/admin/crud-dialog";
import type { CompetitionType } from "@/types/database";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertCompetitionAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireStaff();

  const id = str(formData, "id");
  const name = str(formData, "name");
  const type = str(formData, "type") as CompetitionType;
  const competitionDate = str(formData, "competition_date");
  const location = str(formData, "location");
  const address = str(formData, "address");
  const departureTime = str(formData, "departure_time");
  const returnEstimate = str(formData, "return_estimate");
  const description = str(formData, "description");
  const registrationDeadline = str(formData, "registration_deadline");
  const formsUrl = str(formData, "forms_url");
  const whatToBring = str(formData, "what_to_bring");

  if (name.length < 2) return { success: false, error: "Competition name is required." };
  if (!competitionDate) return { success: false, error: "Competition date is required." };
  if (location.length < 1) return { success: false, error: "Location is required." };

  const supabase = await createClient();
  const payload = {
    name,
    slug: slugify(name) + "-" + competitionDate.replaceAll("-", ""),
    type,
    competition_date: competitionDate,
    location,
    address: address || null,
    departure_time: departureTime || null,
    return_estimate: returnEstimate || null,
    description: description || null,
    registration_deadline: registrationDeadline || null,
    forms_url: formsUrl || null,
    what_to_bring: whatToBring || null,
  };

  if (id) {
    const { error } = await supabase.from("competitions").update(payload).eq("id", id);
    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("competitions").insert(payload);
    if (error) return { success: false, error: error.message };
  }

  revalidatePath("/admin/competitions");
  revalidatePath("/competitions");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCompetitionAction(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("competitions").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/competitions");
  revalidatePath("/competitions");
  return { success: true };
}

export async function setCompetitionTeamsAction(competitionId: string, teamIds: string[]): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createClient();

  const { error: deleteError } = await supabase.from("competition_teams").delete().eq("competition_id", competitionId);
  if (deleteError) return { success: false, error: deleteError.message };

  if (teamIds.length > 0) {
    const { error: insertError } = await supabase
      .from("competition_teams")
      .insert(teamIds.map((teamId) => ({ competition_id: competitionId, team_id: teamId })));
    if (insertError) return { success: false, error: insertError.message };
  }

  revalidatePath("/admin/competitions");
  revalidatePath("/competitions");
  return { success: true };
}

export async function toggleResultsReleaseAction(competitionId: string, released: boolean): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase
    .from("competitions")
    .update({ results_status: released ? "released" : "pending" })
    .eq("id", competitionId);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/competitions");
  revalidatePath("/admin/results");
  revalidatePath("/results");
  return { success: true };
}
