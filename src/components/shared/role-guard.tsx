import type { ReactNode } from "react";
import type { AppRole } from "@/types/database";

/**
 * UI-only convenience guard — hides `children` unless the given role
 * satisfies `allow`. This is NOT a security boundary; every protected
 * action must also be enforced server-side and via RLS.
 */
export function RoleGuard({
  role,
  allow,
  children,
  fallback = null,
}: {
  role: AppRole | null | undefined;
  allow: AppRole[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  if (!role || !allow.includes(role)) return <>{fallback}</>;
  return <>{children}</>;
}
