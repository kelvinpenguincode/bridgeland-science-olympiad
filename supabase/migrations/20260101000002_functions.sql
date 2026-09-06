-- ============================================================================
-- Bridgeland Science Olympiad — Functions & Triggers
-- ============================================================================

-- ----------------------------------------------------------------------------
-- updated_at maintenance
-- ----------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  for t in select unnest(array[
    'profiles', 'officers', 'scioly_events', 'teams', 'event_assignments',
    'announcements', 'meetings', 'calendar_events', 'competitions',
    'competition_results', 'resources', 'placement_tests', 'placement_results'
  ])
  loop
    execute format(
      'create trigger trg_%s_updated_at before update on %I for each row execute function set_updated_at();',
      t, t
    );
  end loop;
end;
$$;

-- ----------------------------------------------------------------------------
-- New auth.users -> profiles bridge
-- ----------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    'member'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ----------------------------------------------------------------------------
-- Role helpers (SECURITY DEFINER so RLS on `profiles` never recurses)
-- ----------------------------------------------------------------------------
create or replace function current_app_role()
returns app_role
language sql
security definer
stable
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

grant execute on function current_app_role() to authenticated, anon;

create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(current_app_role() in ('admin', 'sponsor'), false);
$$;

grant execute on function is_admin() to authenticated, anon;

create or replace function is_staff()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(current_app_role() in ('admin', 'sponsor', 'officer'), false);
$$;

grant execute on function is_staff() to authenticated, anon;

create or replace function is_event_captain_for(p_event_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.event_members
    where event_id = p_event_id
      and profile_id = auth.uid()
      and role = 'captain'
  );
$$;

grant execute on function is_event_captain_for(uuid) to authenticated, anon;

-- Prevent members from self-escalating their own role or active flag.
create or replace function prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    new.role := old.role;
    new.is_active := old.is_active;
  end if;
  return new;
end;
$$;

create trigger trg_profiles_prevent_escalation
  before update on profiles
  for each row execute function prevent_role_self_escalation();

-- ----------------------------------------------------------------------------
-- Placement ranking recomputation — ranks by raw_score desc within a test
-- ----------------------------------------------------------------------------
create or replace function recompute_placement_ranks(p_test_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  with ranked as (
    select id, rank() over (order by raw_score desc) as new_rank
    from placement_results
    where placement_test_id = p_test_id
  )
  update placement_results pr
  set rank = ranked.new_rank
  from ranked
  where pr.id = ranked.id;
end;
$$;

grant execute on function recompute_placement_ranks(uuid) to authenticated;

create or replace function trg_placement_results_rerank()
returns trigger
language plpgsql
as $$
begin
  perform recompute_placement_ranks(coalesce(new.placement_test_id, old.placement_test_id));
  return null;
end;
$$;

create trigger trg_placement_results_after_write
  after insert or update of raw_score or delete on placement_results
  for each row execute function trg_placement_results_rerank();
