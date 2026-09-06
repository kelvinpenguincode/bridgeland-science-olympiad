import type { AppRole } from "@/types/database";

/**
 * Client- and server-safe role helpers. These power UI conditionals only
 * (show/hide a button, highlight a nav item). They are NOT the security
 * boundary — every mutation is re-checked server-side and, most
 * importantly, by Postgres Row Level Security policies in
 * `supabase/migrations/20260101000003_rls.sql`.
 */

export function isAdminRole(role: AppRole | null | undefined): boolean {
  return role === "admin" || role === "sponsor";
}

export function isStaffRole(role: AppRole | null | undefined): boolean {
  return role === "admin" || role === "sponsor" || role === "officer";
}

export function isEventCaptainRole(role: AppRole | null | undefined): boolean {
  return role === "event_captain";
}

export function canManageTeamContent(role: AppRole | null | undefined): boolean {
  // Announcements, calendar, meetings, resources, attendance, competitions, teams
  return isStaffRole(role);
}

export function canAccessAdmin(role: AppRole | null | undefined): boolean {
  return isStaffRole(role) || isEventCaptainRole(role);
}

export function canManageRoster(role: AppRole | null | undefined): boolean {
  return isAdminRole(role);
}

export const ROLE_RANK: Record<AppRole, number> = {
  sponsor: 5,
  admin: 4,
  officer: 3,
  event_captain: 2,
  member: 1,
};
