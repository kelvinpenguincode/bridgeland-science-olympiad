import type { ReactNode } from "react";
import { requireUser } from "@/lib/auth/session";
import { DashboardShell } from "@/components/shared/dashboard-shell";
import { MEMBER_SIDEBAR_SECTIONS } from "@/components/dashboard/member-sidebar-config";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const profile = await requireUser("/dashboard");

  return (
    <DashboardShell
      sections={MEMBER_SIDEBAR_SECTIONS}
      title="Member Dashboard"
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
