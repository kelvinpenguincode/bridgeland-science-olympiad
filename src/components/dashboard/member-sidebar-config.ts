import { CalendarCheck2, FileText, LayoutDashboard, ListChecks, Trophy, User } from "lucide-react";
import type { SidebarNavSection } from "@/components/shared/dashboard-shell";

export const MEMBER_SIDEBAR_SECTIONS: SidebarNavSection[] = [
  {
    items: [{ href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "My Team",
    items: [
      { href: "/dashboard/events", label: "My Events", icon: ListChecks },
      { href: "/dashboard/results", label: "Placement Results", icon: Trophy },
      { href: "/dashboard/resources", label: "Resources", icon: FileText },
      { href: "/dashboard/attendance", label: "Attendance", icon: CalendarCheck2 },
    ],
  },
  {
    label: "Account",
    items: [{ href: "/dashboard/profile", label: "Profile & Settings", icon: User }],
  },
];
