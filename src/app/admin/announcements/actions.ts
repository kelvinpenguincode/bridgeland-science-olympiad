"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/session";
import { slugify } from "@/lib/utils/slugify";
import type { ActionResult } from "@/components/admin/crud-dialog";
import type { AnnouncementAudience, AnnouncementPriority } from "@/types/database";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertAnnouncementAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const profile = await requireStaff();

  const id = str(formData, "id");
  const title = str(formData, "title");
  const summary = str(formData, "summary");
  const content = str(formData, "content");
  const priority = str(formData, "priority") as AnnouncementPriority;
  const audience = str(formData, "audience") as AnnouncementAudience;
  const audienceTeamId = str(formData, "audience_team_id") || null;
  const audienceEventId = str(formData, "audience_event_id") || null;
  const publishAt = str(formData, "publish_at");
  const expiresAt = str(formData, "expires_at");
  const isPinned = str(formData, "is_pinned") === "true";

  if (title.length < 3) return { success: false, error: "Title must be at least 3 characters." };
  if (summary.length < 5) return { success: false, error: "Summary is required." };
  if (content.length < 5) return { success: false, error: "Content is required." };

  const supabase = await createClient();
  const payload = {
    title,
    slug: slugify(title),
    summary,
    content,
    priority,
    audience,
    audience_team_id: audience === "team" ? audienceTeamId : null,
    audience_event_id: audience === "event" ? audienceEventId : null,
    publish_at: publishAt ? new Date(publishAt).toISOString() : new Date().toISOString(),
    expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    is_pinned: isPinned,
  };

  const { error } = id
    ? await supabase.from("announcements").update(payload).eq("id", id)
    : await supabase.from("announcements").insert({ ...payload, author_id: profile.id });

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/announcements");
  revalidatePath("/");
  return { success: true };
}

export async function deleteAnnouncementAction(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/announcements");
  return { success: true };
}
