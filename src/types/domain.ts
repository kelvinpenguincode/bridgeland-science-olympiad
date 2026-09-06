import type {
  AnnouncementAudience,
  AnnouncementPriority,
  AppRole,
  AttendanceStatus,
  CalendarCategory,
  CompetitionType,
  EventCategory,
  MedalType,
  PlacementStatus,
  ResourceDifficulty,
  ResourceType,
  ResourceVisibility,
} from "./database";

/** Friendly display labels + Tailwind color tokens used across badges/cards. */

export const ROLE_LABELS: Record<AppRole, string> = {
  sponsor: "Sponsor",
  admin: "Admin",
  officer: "Officer",
  event_captain: "Event Captain",
  member: "Member",
};

export const EVENT_CATEGORY_LABELS: Record<EventCategory, string> = {
  life_personal_social: "Life, Personal & Social Science",
  earth_space: "Earth and Space Science",
  physical_chemistry: "Physical Science & Chemistry",
  tech_engineering: "Technology & Engineering",
  inquiry_nature: "Inquiry & Nature of Science",
};

export const EVENT_CATEGORY_ORDER: EventCategory[] = [
  "life_personal_social",
  "earth_space",
  "physical_chemistry",
  "tech_engineering",
  "inquiry_nature",
];

export const ANNOUNCEMENT_PRIORITY_LABELS: Record<AnnouncementPriority, string> = {
  normal: "Normal",
  important: "Important",
  urgent: "Urgent",
};

export const ANNOUNCEMENT_PRIORITY_STYLES: Record<AnnouncementPriority, string> = {
  normal: "bg-muted text-muted-foreground border-border",
  important: "bg-brand-orange-light text-brand-orange-dark border-brand-orange/30",
  urgent: "bg-red-50 text-red-700 border-red-200",
};

export const ANNOUNCEMENT_AUDIENCE_LABELS: Record<AnnouncementAudience, string> = {
  everyone: "Everyone",
  members: "Members",
  officers: "Officers",
  team: "Specific Team",
  event: "Specific Event",
};

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Present",
  late: "Late",
  excused: "Excused",
  absent: "Absent",
};

export const ATTENDANCE_STATUS_STYLES: Record<AttendanceStatus, string> = {
  present: "bg-emerald-50 text-emerald-700 border-emerald-200",
  late: "bg-amber-50 text-amber-700 border-amber-200",
  excused: "bg-sky-50 text-sky-700 border-sky-200",
  absent: "bg-red-50 text-red-700 border-red-200",
};

export const CALENDAR_CATEGORY_LABELS: Record<CalendarCategory, string> = {
  general_meeting: "General Meeting",
  event_practice: "Event Practice",
  officer_meeting: "Officer Meeting",
  placement_test: "Placement Test",
  practice_test: "Practice Test",
  competition: "Competition",
  deadline: "Deadline",
  build_test_session: "Build/Test Session",
  other: "Other",
};

export const CALENDAR_CATEGORY_STYLES: Record<CalendarCategory, string> = {
  general_meeting: "bg-sky-100 text-sky-800 border-sky-300",
  event_practice: "bg-emerald-100 text-emerald-800 border-emerald-300",
  officer_meeting: "bg-violet-100 text-violet-800 border-violet-300",
  placement_test: "bg-amber-100 text-amber-800 border-amber-300",
  practice_test: "bg-yellow-100 text-yellow-800 border-yellow-300",
  competition: "bg-orange-100 text-brand-orange-dark border-orange-300",
  deadline: "bg-red-100 text-red-800 border-red-300",
  build_test_session: "bg-cyan-100 text-cyan-800 border-cyan-300",
  other: "bg-slate-100 text-slate-800 border-slate-300",
};

export const CALENDAR_CATEGORY_DOT: Record<CalendarCategory, string> = {
  general_meeting: "bg-sky-500",
  event_practice: "bg-emerald-500",
  officer_meeting: "bg-violet-500",
  placement_test: "bg-amber-500",
  practice_test: "bg-yellow-500",
  competition: "bg-brand-orange",
  deadline: "bg-red-500",
  build_test_session: "bg-cyan-500",
  other: "bg-slate-400",
};

export const COMPETITION_TYPE_LABELS: Record<CompetitionType, string> = {
  invitational: "Invitational",
  regional: "Regional",
  state: "State",
  national: "National",
  scrimmage: "Scrimmage",
};

export const MEDAL_LABELS: Record<MedalType, string> = {
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
  none: "—",
};

export const MEDAL_STYLES: Record<MedalType, string> = {
  gold: "bg-yellow-100 text-yellow-800 border-yellow-300",
  silver: "bg-slate-200 text-slate-700 border-slate-300",
  bronze: "bg-orange-100 text-orange-800 border-orange-300",
  none: "bg-muted text-muted-foreground border-border",
};

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  study_guide: "Study Guide",
  notes: "Notes",
  practice_test: "Practice Test",
  answer_key: "Answer Key",
  video: "Video",
  website: "Website",
  reference_sheet: "Reference Sheet",
  presentation: "Presentation",
  other: "Other",
};

export const RESOURCE_VISIBILITY_LABELS: Record<ResourceVisibility, string> = {
  public: "Public",
  members: "Members Only",
  officers: "Officers Only",
};

export const RESOURCE_DIFFICULTY_LABELS: Record<ResourceDifficulty, string> = {
  intro: "Intro",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const PLACEMENT_STATUS_LABELS: Record<PlacementStatus, string> = {
  selected: "Selected",
  alternate: "Alternate",
  pending: "Pending",
  not_assigned: "Not Assigned",
};

export const PLACEMENT_STATUS_STYLES: Record<PlacementStatus, string> = {
  selected: "bg-emerald-50 text-emerald-700 border-emerald-200",
  alternate: "bg-amber-50 text-amber-700 border-amber-200",
  pending: "bg-slate-100 text-slate-600 border-slate-200",
  not_assigned: "bg-red-50 text-red-700 border-red-200",
};
