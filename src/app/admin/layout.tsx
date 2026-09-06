import type { ReactNode } from "react";
import { requireStaffOrCaptain } from "@/lib/auth/session";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { ADMIN_SIDEBAR_SECTIONS } from "@/components/admin/admin-sidebar-config";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await requireStaffOrCaptain("/admin");

  return (
    <DashboardShell
      sections={ADMIN_SIDEBAR_SECTIONS}
      title="Admin Panel"
      profile={{
        fullName: profile.full_name,
        preferredName: profile.preferred_name,
        avatarUrl: profile.avatar_url,
        role: profile.role,
      }}
    >
      {children}
    </DashboardShell>
  );
}
