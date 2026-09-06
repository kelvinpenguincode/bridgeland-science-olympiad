import {
  CalendarCheck2,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Megaphone,
  Trophy,
  UserCog,
  Users,
  UsersRound,
  FlaskConical,
  Medal,
} from "lucide-react";
import type { SidebarNavSection } from "@/components/shared/dashboard-shell";

export const ADMIN_SIDEBAR_SECTIONS: SidebarNavSection[] = [
  {
    items: [{ href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
      { href: "/admin/calendar", label: "Calendar", icon: CalendarDays },
      { href: "/admin/meetings", label: "Meetings", icon: ClipboardList },
      { href: "/admin/events", label: "Events", icon: FlaskConical },
      { href: "/admin/resources", label: "Resources", icon: FileText },
    ],
  },
  {
    label: "Roster",
    items: [
      { href: "/admin/members", label: "Members", icon: Users },
      { href: "/admin/officers", label: "Officers", icon: UserCog },
      { href: "/admin/teams", label: "Teams", icon: UsersRound },
    ],
  },
  {
    label: "Competition",
    items: [
      { href: "/admin/competitions", label: "Competitions", icon: Trophy },
      { href: "/admin/results", label: "Results", icon: Medal },
      { href: "/admin/placement", label: "Placement", icon: ClipboardList },
      { href: "/admin/attendance", label: "Attendance", icon: CalendarCheck2 },
    ],
  },
];
