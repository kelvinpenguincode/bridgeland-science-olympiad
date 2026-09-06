import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ProfileRow } from "@/types/database";
import { canAccessAdmin, isStaffRole } from "./permissions";

/**
 * Fetches the current session's profile row. Cached per-request via
 * React `cache()` so multiple Server Components calling this in the same
 * render tree only hit Supabase once.
 */
export const getCurrentProfile = cache(async (): Promise<ProfileRow | null> => {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single();

  return profile ?? null;
});

/** Redirects to /login (preserving destination) if not authenticated. */
export async function requireUser(nextPath?: string): Promise<ProfileRow> {
  const profile = await getCurrentProfile();
  if (!profile) {
    const search = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${search}`);
  }
  return profile;
}

/** Redirects to /unauthorized if the current user lacks admin-panel access. */
export async function requireStaffOrCaptain(nextPath?: string): Promise<ProfileRow> {
  const profile = await requireUser(nextPath);
  if (!canAccessAdmin(profile.role)) {
    redirect("/unauthorized");
  }
  return profile;
}

/** Redirects to /unauthorized if the current user isn't officer+ staff. */
export async function requireStaff(nextPath?: string): Promise<ProfileRow> {
  const profile = await requireUser(nextPath);
  if (!isStaffRole(profile.role)) {
    redirect("/unauthorized");
  }
  return profile;
}

/** Redirects to /unauthorized if the current user isn't admin/sponsor. */
export async function requireAdmin(nextPath?: string): Promise<ProfileRow> {
  const profile = await requireUser(nextPath);
  if (profile.role !== "admin" && profile.role !== "sponsor") {
    redirect("/unauthorized");
  }
  return profile;
}
