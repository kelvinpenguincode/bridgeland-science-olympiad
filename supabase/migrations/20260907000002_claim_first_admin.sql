-- Fix first-admin claiming (the old trigger silently discarded role changes)
-- and treat kelvin.peng11@icloud.com as the default admin on signup.

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
    case
      when lower(new.email) = 'kelvin.peng11@icloud.com' then 'admin'::app_role
      else 'member'::app_role
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace function prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if is_admin()
     or auth.role() = 'service_role'
     or current_user in ('postgres', 'supabase_admin')
  then
    return new;
  end if;

  if new.role is distinct from old.role
     and new.role in ('admin', 'sponsor')
     and not exists (
       select 1 from public.profiles
       where role in ('admin', 'sponsor')
         and id is distinct from old.id
     )
  then
    return new;
  end if;

  new.role := old.role;
  new.is_active := old.is_active;
  return new;
end;
$$;

create or replace function claim_first_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  if exists (select 1 from public.profiles where role in ('admin', 'sponsor')) then
    return false;
  end if;

  update public.profiles
  set role = 'admin'
  where id = uid
    and role is distinct from 'admin';

  return true;
end;
$$;

grant execute on function claim_first_admin() to authenticated;
