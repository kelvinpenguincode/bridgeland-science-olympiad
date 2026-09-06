"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireStaff } from "@/lib/auth/session";
import { slugify } from "@/lib/utils/slugify";
import type { ActionResult } from "@/components/admin/crud-dialog";
import type { EventCategory } from "@/types/database";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function upsertEventAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  await requireStaff();

  const id = str(formData, "id");
  const name = str(formData, "name");
  const category = str(formData, "category") as EventCategory;
  const description = str(formData, "description");
  const icon = str(formData, "icon") || "FlaskConical";
  const officialRulesUrl = str(formData, "official_rules_url");
  const officialResourcesUrl = str(formData, "official_resources_url");
  const season = Number(str(formData, "season") || new Date().getFullYear());
  const displayOrder = Number(str(formData, "display_order") || 0);
  const isActive = str(formData, "is_active") === "true";

  if (name.length < 2) return { success: false, error: "Event name is required." };
  if (!description) return { success: false, error: "Description is required." };

  const supabase = await createClient();
  const payload = {
    name,
    slug: slugify(name),
    category,
    description,
    icon,
    official_rules_url: officialRulesUrl || null,
    official_resources_url: officialResourcesUrl || null,
    season,
    display_order: displayOrder,
    is_active: isActive,
  };

  const { error } = id
    ? await supabase.from("scioly_events").update(payload).eq("id", id)
    : await supabase.from("scioly_events").insert(payload);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

export async function deleteEventAction(id: string): Promise<ActionResult> {
  await requireStaff();
  const supabase = await createClient();
  const { error } = await supabase.from("scioly_events").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/events");
  revalidatePath("/events");
  return { success: true };
}
