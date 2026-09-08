import type { ReactNode } from "react";
import { requireStaff } from "@/lib/auth/session";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { getAdminSidebarSections } from "@/components/admin/admin-sidebar-config";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const profile = await requireStaff("/admin");

  return (
    <DashboardShell
      sections={getAdminSidebarSections(profile.role)}
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
