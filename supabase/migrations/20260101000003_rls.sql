-- ============================================================================
-- Bridgeland Science Olympiad — Row Level Security
--
-- Principles enforced here (see README "Security Model"):
--  * Anonymous visitors: public marketing content only. No scores, no
--    attendance, no private roster fields, no contact info.
--  * Members (authenticated, role = member): can read general team info,
--    their OWN placement results (only once released) and OWN attendance.
--  * Officers / Event Captains: elevated write access scoped to their remit.
--  * Admin / Sponsor: full access.
-- ============================================================================

alter table profiles enable row level security;
alter table officers enable row level security;
alter table scioly_events enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;
alter table event_members enable row level security;
alter table event_assignments enable row level security;
alter table announcements enable row level security;
alter table meetings enable row level security;
alter table meeting_events enable row level security;
alter table meeting_attachments enable row level security;
alter table meeting_attendance enable row level security;
alter table calendar_events enable row level security;
alter table competitions enable row level security;
alter table competition_teams enable row level security;
alter table competition_schedule enable row level security;
alter table competition_assignments enable row level security;
alter table competition_results enable row level security;
alter table resources enable row level security;
alter table placement_tests enable row level security;
alter table placement_results enable row level security;

-- ----------------------------------------------------------------------------
-- profiles — private. Own row, or staff can read/write.
-- ----------------------------------------------------------------------------
create policy profiles_select_own_or_staff on profiles
  for select using (id = auth.uid() or is_staff());

create policy profiles_insert_own on profiles
  for insert with check (id = auth.uid());

create policy profiles_update_own_or_admin on profiles
  for update using (id = auth.uid() or is_admin());

create policy profiles_delete_admin on profiles
  for delete using (is_admin());

-- ----------------------------------------------------------------------------
-- officers — public directory (published rows only), staff manage all.
-- ----------------------------------------------------------------------------
create policy officers_select_public on officers
  for select using (is_active = true or is_staff());

create policy officers_write_staff on officers
  for all using (is_staff()) with check (is_staff());

-- ----------------------------------------------------------------------------
-- scioly_events — public catalog, staff manage.
-- ----------------------------------------------------------------------------
create policy scioly_events_select_public on scioly_events
  for select using (is_active = true or is_staff());

create policy scioly_events_write_staff on scioly_events
  for all using (is_staff()) with check (is_staff());

-- ----------------------------------------------------------------------------
-- teams — visible to signed-in members, managed by staff.
-- ----------------------------------------------------------------------------
create policy teams_select_authenticated on teams
  for select using (auth.uid() is not null);

create policy teams_write_staff on teams
  for all using (is_staff()) with check (is_staff());

create policy team_members_select_authenticated on team_members
  for select using (auth.uid() is not null);

create policy team_members_write_staff on team_members
  for all using (is_staff()) with check (is_staff());

-- ----------------------------------------------------------------------------
-- event_members — roster is member-only (not public / not anonymous).
-- ----------------------------------------------------------------------------
create policy event_members_select_authenticated on event_members
  for select using (auth.uid() is not null);

create policy event_members_write_staff_or_captain on event_members
  for all using (is_staff() or is_event_captain_for(event_id))
  with check (is_staff() or is_event_captain_for(event_id));

-- ----------------------------------------------------------------------------
-- event_assignments — the team-assignment matrix. Staff sees all; a member
-- may see only rows about themselves (for their dashboard).
-- ----------------------------------------------------------------------------
create policy event_assignments_select_self_or_staff on event_assignments
  for select using (profile_id = auth.uid() or is_staff());

create policy event_assignments_write_staff on event_assignments
  for all using (is_staff()) with check (is_staff());

-- ----------------------------------------------------------------------------
-- announcements — audience-aware public read, staff/captain write.
-- ----------------------------------------------------------------------------
create policy announcements_select_by_audience on announcements
  for select using (
    is_staff()
    or (
      publish_at <= now()
      and (expires_at is null or expires_at > now())
      and (
        audience = 'everyone'
        or (audience = 'members' and auth.uid() is not null)
        or (audience = 'officers' and is_staff())
        or (audience = 'team' and auth.uid() is not null and exists (
          select 1 from team_members tm
          where tm.team_id = announcements.audience_team_id and tm.profile_id = auth.uid()
        ))
        or (audience = 'event' and auth.uid() is not null and exists (
          select 1 from event_members em
          where em.event_id = announcements.audience_event_id and em.profile_id = auth.uid()
        ))
      )
    )
  );

create policy announcements_write_staff_or_captain on announcements
  for all using (
    is_staff() or (audience = 'event' and is_event_captain_for(audience_event_id))
  )
  with check (
    is_staff() or (audience = 'event' and is_event_captain_for(audience_event_id))
  );

-- ----------------------------------------------------------------------------
-- meetings — public page; no sensitive data stored in these tables.
-- ----------------------------------------------------------------------------
create policy meetings_select_public on meetings for select using (true);
create policy meetings_write_staff on meetings for all using (is_staff()) with check (is_staff());

create policy meeting_events_select_public on meeting_events for select using (true);
create policy meeting_events_write_staff on meeting_events for all using (is_staff()) with check (is_staff());

create policy meeting_attachments_select_public on meeting_attachments for select using (true);
create policy meeting_attachments_write_staff on meeting_attachments for all using (is_staff()) with check (is_staff());

-- ----------------------------------------------------------------------------
-- meeting_attendance — private. Own record or staff.
-- ----------------------------------------------------------------------------
create policy meeting_attendance_select_self_or_staff on meeting_attendance
  for select using (profile_id = auth.uid() or is_staff());

create policy meeting_attendance_write_staff on meeting_attendance
  for all using (is_staff()) with check (is_staff());

-- ----------------------------------------------------------------------------
-- calendar_events — public team calendar.
-- ----------------------------------------------------------------------------
create policy calendar_events_select_public on calendar_events for select using (true);
create policy calendar_events_write_staff on calendar_events for all using (is_staff()) with check (is_staff());

-- ----------------------------------------------------------------------------
-- competitions — public listing/detail; roster/assignment stay member-only.
-- ----------------------------------------------------------------------------
create policy competitions_select_public on competitions for select using (true);
create policy competitions_write_staff on competitions for all using (is_staff()) with check (is_staff());

create policy competition_teams_select_public on competition_teams for select using (true);
create policy competition_teams_write_staff on competition_teams for all using (is_staff()) with check (is_staff());

create policy competition_schedule_select_public on competition_schedule for select using (true);
create policy competition_schedule_write_staff on competition_schedule for all using (is_staff()) with check (is_staff());

create policy competition_assignments_select_authenticated on competition_assignments
  for select using (auth.uid() is not null);
create policy competition_assignments_write_staff on competition_assignments
  for all using (is_staff()) with check (is_staff());

create policy competition_results_select_public on competition_results for select using (true);
create policy competition_results_write_staff on competition_results for all using (is_staff()) with check (is_staff());

-- ----------------------------------------------------------------------------
-- resources — visibility-tiered.
-- ----------------------------------------------------------------------------
create policy resources_select_by_visibility on resources
  for select using (
    visibility = 'public'
    or (visibility = 'members' and auth.uid() is not null)
    or (visibility = 'officers' and is_staff())
    or is_staff()
  );

create policy resources_write_staff_or_captain on resources
  for all using (
    is_staff() or (event_id is not null and is_event_captain_for(event_id))
  )
  with check (
    is_staff() or (event_id is not null and is_event_captain_for(event_id))
  );

-- ----------------------------------------------------------------------------
-- placement_tests — metadata only (no scores) is safe to publish.
-- ----------------------------------------------------------------------------
create policy placement_tests_select_public on placement_tests for select using (true);
create policy placement_tests_write_staff on placement_tests for all using (is_staff()) with check (is_staff());

-- ----------------------------------------------------------------------------
-- placement_results — CRITICAL. Members read ONLY their own row, and only
-- after the parent test has been released. Anonymous users: no access.
-- ----------------------------------------------------------------------------
create policy placement_results_select_self_after_release on placement_results
  for select using (
    is_staff()
    or (
      profile_id = auth.uid()
      and exists (
        select 1 from placement_tests pt
        where pt.id = placement_results.placement_test_id
          and pt.results_released = true
      )
    )
  );

create policy placement_results_write_staff on placement_results
  for all using (is_staff()) with check (is_staff());
