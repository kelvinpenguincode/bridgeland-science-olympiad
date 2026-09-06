"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/session";
import type { ActionResult } from "@/components/admin/crud-dialog";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertTeamAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireStaff();

  const id = str(formData, "id");
  const name = str(formData, "name");
  const season = str(formData, "season");
  const description = str(formData, "description");

  if (name.length < 2) return { success: false, error: "Team name is required." };
  if (!season) return { success: false, error: "Season is required." };

  const supabase = await createClient();
  const payload = { name, season, description: description || null };

  const { error } = id
    ? await supabase.from("teams").update(payload).eq("id", id)
    : await supabase.from("teams").insert(payload);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/teams");
  return { success: true };
}

export async function deleteTeamAction(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("teams").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/teams");
  return { success: true };
}

export async function setTeamRosterAction(teamId: string, profileIds: string[]): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createClient();

  const { error: deleteError } = await supabase.from("team_members").delete().eq("team_id", teamId);
  if (deleteError) return { success: false, error: deleteError.message };

  if (profileIds.length > 0) {
    const { error: insertError } = await supabase
      .from("team_members")
      .insert(profileIds.map((profileId) => ({ team_id: teamId, profile_id: profileId })));
    if (insertError) return { success: false, error: insertError.message };
  }

  revalidatePath("/admin/teams");
  return { success: true };
}

export async function upsertAssignmentAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireStaff();

  const id = str(formData, "id");
  const eventId = str(formData, "event_id");
  const profileId = str(formData, "profile_id");
  const teamId = str(formData, "team_id");
  const partnerProfileId = str(formData, "partner_profile_id");
  const season = str(formData, "season") || "2026-2027";
  const notes = str(formData, "notes");

  if (!eventId) return { success: false, error: "Event is required." };
  if (!profileId) return { success: false, error: "Student is required." };

  const supabase = await createClient();
  const payload = {
    event_id: eventId,
    profile_id: profileId,
    team_id: teamId || null,
    partner_profile_id: partnerProfileId || null,
    season,
    notes: notes || null,
  };

  const { error } = id
    ? await supabase.from("event_assignments").update(payload).eq("id", id)
    : await supabase.from("event_assignments").insert(payload);

  if (error) {
    if (error.code === "23505") return { success: false, error: "This student is already assigned to this event this season." };
    return { success: false, error: error.message };
  }
  revalidatePath("/admin/teams");
  return { success: true };
}

export async function deleteAssignmentAction(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("event_assignments").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/teams");
  return { success: true };
}
