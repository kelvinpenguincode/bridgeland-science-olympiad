-- ============================================================================
-- Bridgeland Science Olympiad — Core Schema
-- Extensions, enums, tables, indexes.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type app_role as enum ('sponsor', 'admin', 'officer', 'event_captain', 'member');

create type officer_category as enum ('officer', 'event_captain', 'coach');

create type event_category as enum (
  'life_personal_social',
  'earth_space',
  'physical_chemistry',
  'tech_engineering',
  'inquiry_nature'
);

create type event_member_role as enum ('captain', 'member');

create type announcement_priority as enum ('normal', 'important', 'urgent');

create type announcement_audience as enum ('everyone', 'members', 'officers', 'team', 'event');

create type attendance_status as enum ('present', 'late', 'excused', 'absent');

create type calendar_category as enum (
  'general_meeting',
  'event_practice',
  'officer_meeting',
  'placement_test',
  'practice_test',
  'competition',
  'deadline',
  'build_test_session',
  'other'
);

create type competition_type as enum ('invitational', 'regional', 'state', 'national', 'scrimmage');

create type medal_type as enum ('gold', 'silver', 'bronze', 'none');

create type resource_type as enum (
  'study_guide',
  'notes',
  'practice_test',
  'answer_key',
  'video',
  'website',
  'reference_sheet',
  'presentation',
  'other'
);

create type resource_visibility as enum ('public', 'members', 'officers');

create type resource_difficulty as enum ('intro', 'intermediate', 'advanced');

create type placement_status as enum ('selected', 'alternate', 'pending', 'not_assigned');

-- ----------------------------------------------------------------------------
-- profiles — one row per authenticated user, created via trigger on signup
-- ----------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null,
  preferred_name text,
  grade smallint check (grade between 9 and 12),
  phone text,
  avatar_url text,
  bio text,
  role app_role not null default 'member',
  is_active boolean not null default true,
  joined_at date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_role on profiles (role);

-- ----------------------------------------------------------------------------
-- officers — public-facing leadership directory (independent of auth profile)
-- ----------------------------------------------------------------------------
create table officers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles (id) on delete set null,
  full_name text not null,
  role_title text not null,
  category officer_category not null default 'officer',
  grade text,
  bio text,
  fun_fact text,
  photo_url text,
  email_public text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_officers_category on officers (category, display_order);

-- ----------------------------------------------------------------------------
-- scioly_events — Division C event catalog
-- ----------------------------------------------------------------------------
create table scioly_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category event_category not null,
  description text not null default '',
  icon text not null default 'FlaskConical',
  official_rules_url text,
  official_resources_url text,
  season integer not null default 2027,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_scioly_events_category on scioly_events (category);
create index idx_scioly_events_slug on scioly_events (slug);

-- ----------------------------------------------------------------------------
-- teams
-- ----------------------------------------------------------------------------
create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  season text not null default '2026-2027',
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name, season)
);

create table team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (team_id, profile_id)
);

create index idx_team_members_profile on team_members (profile_id);

-- ----------------------------------------------------------------------------
-- event_members — curated public roster shown on the event detail page
-- ----------------------------------------------------------------------------
create table event_members (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references scioly_events (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  role event_member_role not null default 'member',
  partner_profile_id uuid references profiles (id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  unique (event_id, profile_id)
);

create index idx_event_members_event on event_members (event_id);
create index idx_event_members_profile on event_members (profile_id);

-- ----------------------------------------------------------------------------
-- event_assignments — season team-assignment matrix (student x event x team)
-- ----------------------------------------------------------------------------
create table event_assignments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references scioly_events (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  team_id uuid references teams (id) on delete set null,
  partner_profile_id uuid references profiles (id) on delete set null,
  season text not null default '2026-2027',
  source text not null default 'manual' check (source in ('manual', 'placement')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_id, profile_id, season)
);

create index idx_event_assignments_profile on event_assignments (profile_id);
create index idx_event_assignments_team on event_assignments (team_id);
create index idx_event_assignments_event on event_assignments (event_id);

-- ----------------------------------------------------------------------------
-- announcements
-- ----------------------------------------------------------------------------
create table announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  content text not null default '',
  author_id uuid references profiles (id) on delete set null,
  publish_at timestamptz not null default now(),
  expires_at timestamptz,
  priority announcement_priority not null default 'normal',
  audience announcement_audience not null default 'everyone',
  audience_team_id uuid references teams (id) on delete set null,
  audience_event_id uuid references scioly_events (id) on delete set null,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_announcements_publish on announcements (publish_at desc);
create index idx_announcements_audience on announcements (audience);

-- ----------------------------------------------------------------------------
-- meetings
-- ----------------------------------------------------------------------------
create table meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  meeting_date date not null,
  start_time time not null,
  end_time time,
  location text not null default 'Bridgeland HS',
  description text,
  agenda text,
  required_materials text,
  attendance_required boolean not null default true,
  notes text,
  slide_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_meetings_date on meetings (meeting_date desc);

create table meeting_events (
  meeting_id uuid not null references meetings (id) on delete cascade,
  event_id uuid not null references scioly_events (id) on delete cascade,
  primary key (meeting_id, event_id)
);

create table meeting_attachments (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references meetings (id) on delete cascade,
  name text not null,
  url text not null,
  created_at timestamptz not null default now()
);

create index idx_meeting_attachments_meeting on meeting_attachments (meeting_id);

-- ----------------------------------------------------------------------------
-- meeting_attendance
-- ----------------------------------------------------------------------------
create table meeting_attendance (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references meetings (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  status attendance_status not null default 'absent',
  marked_by uuid references profiles (id) on delete set null,
  marked_at timestamptz not null default now(),
  notes text,
  unique (meeting_id, profile_id)
);

create index idx_meeting_attendance_profile on meeting_attendance (profile_id);
create index idx_meeting_attendance_meeting on meeting_attendance (meeting_id);

-- ----------------------------------------------------------------------------
-- calendar_events
-- ----------------------------------------------------------------------------
create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category calendar_category not null default 'other',
  location text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  all_day boolean not null default false,
  related_meeting_id uuid references meetings (id) on delete set null,
  related_competition_id uuid,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_calendar_events_start on calendar_events (start_at);
create index idx_calendar_events_category on calendar_events (category);

-- ----------------------------------------------------------------------------
-- competitions
-- ----------------------------------------------------------------------------
create table competitions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type competition_type not null default 'invitational',
  competition_date date not null,
  location text not null,
  address text,
  departure_time time,
  return_estimate text,
  description text,
  registration_deadline date,
  forms_url text,
  what_to_bring text,
  results_status text not null default 'pending' check (results_status in ('pending', 'released')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_competitions_date on competitions (competition_date desc);

alter table calendar_events
  add constraint fk_calendar_events_competition
  foreign key (related_competition_id) references competitions (id) on delete set null;

create table competition_teams (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions (id) on delete cascade,
  team_id uuid not null references teams (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (competition_id, team_id)
);

create table competition_schedule (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions (id) on delete cascade,
  event_id uuid references scioly_events (id) on delete set null,
  title text not null,
  start_time timestamptz,
  end_time timestamptz,
  location text,
  created_at timestamptz not null default now()
);

create index idx_competition_schedule_competition on competition_schedule (competition_id);

create table competition_assignments (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions (id) on delete cascade,
  event_id uuid not null references scioly_events (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  team_id uuid references teams (id) on delete set null,
  room text,
  created_at timestamptz not null default now(),
  unique (competition_id, event_id, profile_id)
);

create index idx_competition_assignments_competition on competition_assignments (competition_id);
create index idx_competition_assignments_profile on competition_assignments (profile_id);

create table competition_results (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references competitions (id) on delete cascade,
  event_id uuid references scioly_events (id) on delete set null,
  team_id uuid not null references teams (id) on delete cascade,
  placement integer,
  medal medal_type not null default 'none',
  score numeric,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_competition_results_competition on competition_results (competition_id);
create index idx_competition_results_team on competition_results (team_id);
create index idx_competition_results_event on competition_results (event_id);

-- ----------------------------------------------------------------------------
-- resources
-- ----------------------------------------------------------------------------
create table resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_id uuid references scioly_events (id) on delete set null,
  year integer not null default 2027,
  type resource_type not null default 'other',
  url text,
  storage_path text,
  author_id uuid references profiles (id) on delete set null,
  visibility resource_visibility not null default 'members',
  difficulty resource_difficulty,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_resources_event on resources (event_id);
create index idx_resources_visibility on resources (visibility);
create index idx_resources_type on resources (type);

-- ----------------------------------------------------------------------------
-- placement_tests & placement_results
-- ----------------------------------------------------------------------------
create table placement_tests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references scioly_events (id) on delete cascade,
  test_date date not null,
  location text default 'Bridgeland HS',
  max_score numeric not null default 100,
  notes text,
  results_released boolean not null default false,
  released_at timestamptz,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_placement_tests_event on placement_tests (event_id);
create index idx_placement_tests_date on placement_tests (test_date desc);

create table placement_results (
  id uuid primary key default gen_random_uuid(),
  placement_test_id uuid not null references placement_tests (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  raw_score numeric not null default 0,
  rank integer,
  notes text,
  recommended_assignment text,
  status placement_status not null default 'pending',
  hide_raw_score boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (placement_test_id, profile_id)
);

create index idx_placement_results_test on placement_results (placement_test_id);
create index idx_placement_results_profile on placement_results (profile_id);
