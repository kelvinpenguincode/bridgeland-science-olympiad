import type { SidebarNavSection } from "@/components/shared/dashboard-shell";
import type { AppRole } from "@/types/database";
import { isAdminRole } from "@/lib/auth/permissions";

const SHARED_SECTIONS: SidebarNavSection[] = [
  {
    items: [{ href: "/admin", label: "Overview", icon: "LayoutDashboard", exact: true }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/announcements", label: "Announcements", icon: "Megaphone" },
      { href: "/admin/calendar", label: "Calendar", icon: "CalendarDays" },
      { href: "/admin/meetings", label: "Meetings", icon: "ClipboardList" },
      { href: "/admin/events", label: "Events", icon: "FlaskConical" },
      { href: "/admin/resources", label: "Resources", icon: "FileText" },
    ],
  },
  {
    label: "Team ops",
    items: [
      { href: "/admin/teams", label: "Teams", icon: "UsersRound" },
      { href: "/admin/attendance", label: "Attendance", icon: "CalendarCheck2" },
      { href: "/admin/competitions", label: "Competitions", icon: "Trophy" },
    ],
  },
];

const ADMIN_ONLY_SECTIONS: SidebarNavSection[] = [
  {
    label: "Administration",
    items: [
      { href: "/admin/members", label: "Members & roles", icon: "Users" },
      { href: "/admin/officers", label: "Public team page", icon: "UserCog" },
      { href: "/admin/results", label: "Results", icon: "Medal" },
      { href: "/admin/placement", label: "Placement", icon: "ClipboardList" },
    ],
  },
];

export function getAdminSidebarSections(role: AppRole): SidebarNavSection[] {
  return isAdminRole(role) ? [...SHARED_SECTIONS, ...ADMIN_ONLY_SECTIONS] : SHARED_SECTIONS;
}
