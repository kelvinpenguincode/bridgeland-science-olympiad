/**
 * Hand-authored mirror of the Supabase schema defined in
 * `supabase/migrations/`. Keep this file in sync with the SQL.
 *
 * If you provision a live Supabase project you can regenerate an
 * equivalent file with the Supabase CLI:
 *
 *   supabase gen types typescript --project-id <ref> > src/types/database.ts
 *
 * (You'll want to re-apply the ergonomic Enum export names below.)
 *
 * NOTE: Row/Insert/Update shapes below are declared with `type` (not
 * `interface`) on purpose — TypeScript only grants object *type aliases*
 * the implicit index signature needed to structurally satisfy
 * `@supabase/postgrest-js`'s `Record<string, unknown>`-based
 * `GenericTable` constraint. Plain `interface`s do NOT get this implicit
 * index signature, which silently collapses every query's inferred row
 * type to `never`. Keep these as `type`.
 */

export type AppRole = "sponsor" | "admin" | "officer" | "event_captain" | "member";
export type OfficerCategory = "officer" | "event_captain" | "coach";
export type EventCategory =
  | "life_personal_social"
  | "earth_space"
  | "physical_chemistry"
  | "tech_engineering"
  | "inquiry_nature";
export type EventMemberRole = "captain" | "member";
export type AnnouncementPriority = "normal" | "important" | "urgent";
export type AnnouncementAudience = "everyone" | "members" | "officers" | "team" | "event";
export type AttendanceStatus = "present" | "late" | "excused" | "absent";
export type CalendarCategory =
  | "general_meeting"
  | "event_practice"
  | "officer_meeting"
  | "placement_test"
  | "practice_test"
  | "competition"
  | "deadline"
  | "build_test_session"
  | "other";
export type CompetitionType = "invitational" | "regional" | "state" | "national" | "scrimmage";
export type MedalType = "gold" | "silver" | "bronze" | "none";
export type ResourceType =
  | "study_guide"
  | "notes"
  | "practice_test"
  | "answer_key"
  | "video"
  | "website"
  | "reference_sheet"
  | "presentation"
  | "other";
export type ResourceVisibility = "public" | "members" | "officers";
export type ResourceDifficulty = "intro" | "intermediate" | "advanced";
export type PlacementStatus = "selected" | "alternate" | "pending" | "not_assigned";
export type CompetitionResultsStatus = "pending" | "released";
export type AssignmentSource = "manual" | "placement";

type Timestamps = {
  created_at: string;
  updated_at: string;
};

export type ProfileRow = Timestamps & {
  id: string;
  email: string;
  full_name: string;
  preferred_name: string | null;
  grade: number | null;
  phone: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: AppRole;
  is_active: boolean;
  joined_at: string;
};

export type OfficerRow = Timestamps & {
  id: string;
  profile_id: string | null;
  full_name: string;
  role_title: string;
  category: OfficerCategory;
  grade: string | null;
  bio: string | null;
  fun_fact: string | null;
  photo_url: string | null;
  email_public: string | null;
  display_order: number;
  is_active: boolean;
};

export type SciolyEventRow = Timestamps & {
  id: string;
  name: string;
  slug: string;
  category: EventCategory;
  description: string;
  icon: string;
  official_rules_url: string | null;
  official_resources_url: string | null;
  season: number;
  is_active: boolean;
  display_order: number;
};

export type TeamRow = Timestamps & {
  id: string;
  name: string;
  season: string;
  description: string | null;
};

export type TeamMemberRow = {
  id: string;
  team_id: string;
  profile_id: string;
  created_at: string;
};

export type EventMemberRow = {
  id: string;
  event_id: string;
  profile_id: string;
  role: EventMemberRole;
  partner_profile_id: string | null;
  notes: string | null;
  created_at: string;
};

export type EventAssignmentRow = Timestamps & {
  id: string;
  event_id: string;
  profile_id: string;
  team_id: string | null;
  partner_profile_id: string | null;
  season: string;
  source: AssignmentSource;
  notes: string | null;
};

export type AnnouncementRow = Timestamps & {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author_id: string | null;
  publish_at: string;
  expires_at: string | null;
  priority: AnnouncementPriority;
  audience: AnnouncementAudience;
  audience_team_id: string | null;
  audience_event_id: string | null;
  is_pinned: boolean;
};

export type MeetingRow = Timestamps & {
  id: string;
  title: string;
  meeting_date: string;
  start_time: string;
  end_time: string | null;
  location: string;
  description: string | null;
  agenda: string | null;
  required_materials: string | null;
  attendance_required: boolean;
  notes: string | null;
  slide_url: string | null;
};

export type MeetingEventRow = {
  meeting_id: string;
  event_id: string;
};

export type MeetingAttachmentRow = {
  id: string;
  meeting_id: string;
  name: string;
  url: string;
  created_at: string;
};

export type MeetingAttendanceRow = {
  id: string;
  meeting_id: string;
  profile_id: string;
  status: AttendanceStatus;
  marked_by: string | null;
  marked_at: string;
  notes: string | null;
};

export type CalendarEventRow = Timestamps & {
  id: string;
  title: string;
  description: string | null;
  category: CalendarCategory;
  location: string | null;
  start_at: string;
  end_at: string;
  all_day: boolean;
  related_meeting_id: string | null;
  related_competition_id: string | null;
  created_by: string | null;
};

export type CompetitionRow = Timestamps & {
  id: string;
  name: string;
  slug: string;
  type: CompetitionType;
  competition_date: string;
  location: string;
  address: string | null;
  departure_time: string | null;
  return_estimate: string | null;
  description: string | null;
  registration_deadline: string | null;
  forms_url: string | null;
  what_to_bring: string | null;
  results_status: CompetitionResultsStatus;
};

export type CompetitionTeamRow = {
  id: string;
  competition_id: string;
  team_id: string;
  created_at: string;
};

export type CompetitionScheduleRow = {
  id: string;
  competition_id: string;
  event_id: string | null;
  title: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  created_at: string;
};

export type CompetitionAssignmentRow = {
  id: string;
  competition_id: string;
  event_id: string;
  profile_id: string;
  team_id: string | null;
  room: string | null;
  created_at: string;
};

export type CompetitionResultRow = Timestamps & {
  id: string;
  competition_id: string;
  event_id: string | null;
  team_id: string;
  placement: number | null;
  medal: MedalType;
  score: number | null;
  notes: string | null;
};

export type ResourceRow = Timestamps & {
  id: string;
  title: string;
  description: string | null;
  event_id: string | null;
  year: number;
  type: ResourceType;
  url: string | null;
  storage_path: string | null;
  author_id: string | null;
  visibility: ResourceVisibility;
  difficulty: ResourceDifficulty | null;
};

export type PlacementTestRow = Timestamps & {
  id: string;
  event_id: string;
  test_date: string;
  location: string | null;
  max_score: number;
  notes: string | null;
  results_released: boolean;
  released_at: string | null;
  created_by: string | null;
};

export type PlacementResultRow = Timestamps & {
  id: string;
  placement_test_id: string;
  profile_id: string;
  raw_score: number;
  rank: number | null;
  notes: string | null;
  recommended_assignment: string | null;
  status: PlacementStatus;
  hide_raw_score: boolean;
};

type Rel<
  FKName extends string,
  Columns extends readonly string[],
  Ref extends string,
  RefColumns extends readonly string[],
> = {
  foreignKeyName: FKName;
  columns: Columns;
  isOneToOne: false;
  referencedRelation: Ref;
  referencedColumns: RefColumns;
};

type TableDef<Row, InsertOverrides extends object = object, Rels extends readonly unknown[] = []> = {
  Row: Row;
  Insert: Partial<Row> & InsertOverrides;
  Update: Partial<Row>;
  Relationships: Rels;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<ProfileRow, { id: string; email: string; full_name: string }>;
      officers: TableDef<
        OfficerRow,
        { full_name: string; role_title: string },
        [Rel<"officers_profile_id_fkey", ["profile_id"], "profiles", ["id"]>]
      >;
      scioly_events: TableDef<SciolyEventRow, { name: string; slug: string; category: EventCategory }>;
      teams: TableDef<TeamRow, { name: string }>;
      team_members: TableDef<
        TeamMemberRow,
        { team_id: string; profile_id: string },
        [
          Rel<"team_members_team_id_fkey", ["team_id"], "teams", ["id"]>,
          Rel<"team_members_profile_id_fkey", ["profile_id"], "profiles", ["id"]>,
        ]
      >;
      event_members: TableDef<
        EventMemberRow,
        { event_id: string; profile_id: string },
        [
          Rel<"event_members_profile_id_fkey", ["profile_id"], "profiles", ["id"]>,
          Rel<"event_members_partner_profile_id_fkey", ["partner_profile_id"], "profiles", ["id"]>,
          Rel<"event_members_event_id_fkey", ["event_id"], "scioly_events", ["id"]>,
        ]
      >;
      event_assignments: TableDef<
        EventAssignmentRow,
        { event_id: string; profile_id: string },
        [
          Rel<"event_assignments_event_id_fkey", ["event_id"], "scioly_events", ["id"]>,
          Rel<"event_assignments_profile_id_fkey", ["profile_id"], "profiles", ["id"]>,
          Rel<"event_assignments_partner_profile_id_fkey", ["partner_profile_id"], "profiles", ["id"]>,
          Rel<"event_assignments_team_id_fkey", ["team_id"], "teams", ["id"]>,
        ]
      >;
      announcements: TableDef<
        AnnouncementRow,
        { title: string; slug: string },
        [
          Rel<"announcements_author_id_fkey", ["author_id"], "profiles", ["id"]>,
          Rel<"announcements_audience_team_id_fkey", ["audience_team_id"], "teams", ["id"]>,
          Rel<"announcements_audience_event_id_fkey", ["audience_event_id"], "scioly_events", ["id"]>,
        ]
      >;
      meetings: TableDef<MeetingRow, { title: string; meeting_date: string; start_time: string }>;
      meeting_events: TableDef<
        MeetingEventRow,
        { meeting_id: string; event_id: string },
        [Rel<"meeting_events_event_id_fkey", ["event_id"], "scioly_events", ["id"]>]
      >;
      meeting_attachments: TableDef<MeetingAttachmentRow, { meeting_id: string; name: string; url: string }>;
      meeting_attendance: TableDef<
        MeetingAttendanceRow,
        { meeting_id: string; profile_id: string },
        [
          Rel<"meeting_attendance_meeting_id_fkey", ["meeting_id"], "meetings", ["id"]>,
          Rel<"meeting_attendance_profile_id_fkey", ["profile_id"], "profiles", ["id"]>,
        ]
      >;
      calendar_events: TableDef<
        CalendarEventRow,
        { title: string; start_at: string; end_at: string },
        [
          Rel<"calendar_events_related_meeting_id_fkey", ["related_meeting_id"], "meetings", ["id"]>,
          Rel<"calendar_events_related_competition_id_fkey", ["related_competition_id"], "competitions", ["id"]>,
          Rel<"calendar_events_created_by_fkey", ["created_by"], "profiles", ["id"]>,
        ]
      >;
      competitions: TableDef<CompetitionRow, { name: string; slug: string; competition_date: string; location: string }>;
      competition_teams: TableDef<
        CompetitionTeamRow,
        { competition_id: string; team_id: string },
        [Rel<"competition_teams_team_id_fkey", ["team_id"], "teams", ["id"]>]
      >;
      competition_schedule: TableDef<
        CompetitionScheduleRow,
        { competition_id: string; title: string },
        [Rel<"competition_schedule_event_id_fkey", ["event_id"], "scioly_events", ["id"]>]
      >;
      competition_assignments: TableDef<
        CompetitionAssignmentRow,
        { competition_id: string; event_id: string; profile_id: string },
        [
          Rel<"competition_assignments_event_id_fkey", ["event_id"], "scioly_events", ["id"]>,
          Rel<"competition_assignments_profile_id_fkey", ["profile_id"], "profiles", ["id"]>,
          Rel<"competition_assignments_team_id_fkey", ["team_id"], "teams", ["id"]>,
        ]
      >;
      competition_results: TableDef<
        CompetitionResultRow,
        { competition_id: string; team_id: string },
        [
          Rel<"competition_results_competition_id_fkey", ["competition_id"], "competitions", ["id"]>,
          Rel<"competition_results_event_id_fkey", ["event_id"], "scioly_events", ["id"]>,
          Rel<"competition_results_team_id_fkey", ["team_id"], "teams", ["id"]>,
        ]
      >;
      resources: TableDef<
        ResourceRow,
        { title: string },
        [
          Rel<"resources_event_id_fkey", ["event_id"], "scioly_events", ["id"]>,
          Rel<"resources_author_id_fkey", ["author_id"], "profiles", ["id"]>,
        ]
      >;
      placement_tests: TableDef<
        PlacementTestRow,
        { event_id: string; test_date: string },
        [Rel<"placement_tests_event_id_fkey", ["event_id"], "scioly_events", ["id"]>]
      >;
      placement_results: TableDef<
        PlacementResultRow,
        { placement_test_id: string; profile_id: string; raw_score: number },
        [
          Rel<"placement_results_placement_test_id_fkey", ["placement_test_id"], "placement_tests", ["id"]>,
          Rel<"placement_results_profile_id_fkey", ["profile_id"], "profiles", ["id"]>,
        ]
      >;
    };
    Views: Record<string, never>;
    Functions: {
      recompute_placement_ranks: {
        Args: { p_test_id: string };
        Returns: void;
      };
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_staff: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      app_role: AppRole;
      officer_category: OfficerCategory;
      event_category: EventCategory;
      event_member_role: EventMemberRole;
      announcement_priority: AnnouncementPriority;
      announcement_audience: AnnouncementAudience;
      attendance_status: AttendanceStatus;
      calendar_category: CalendarCategory;
      competition_type: CompetitionType;
      medal_type: MedalType;
      resource_type: ResourceType;
      resource_visibility: ResourceVisibility;
      resource_difficulty: ResourceDifficulty;
      placement_status: PlacementStatus;
    };
  };
};
