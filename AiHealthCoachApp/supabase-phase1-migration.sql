-- ============================================================
-- FitAI — Phase 1 Migration (paste into Supabase SQL Editor)
-- Idempotent: safe to re-run.
-- ============================================================

-- 1. Add app-owned columns used by onboarding + profile screens
alter table public.user_profiles
  add column if not exists name                 text     not null default '',
  add column if not exists goal                 text     not null default '',
  add column if not exists weight               numeric  not null default 0,
  add column if not exists plan                 text     not null default 'free',
  add column if not exists onboarding_completed boolean  not null default false;

-- 2. Ensure auto-create trigger exists so future auth.users get a profile row
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, full_name, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Backfill profiles for the 3 existing auth users (and any orphans)
insert into public.user_profiles (id, full_name, name)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'full_name', ''),
  coalesce(u.raw_user_meta_data->>'full_name', '')
from auth.users u
left join public.user_profiles p on p.id = u.id
where p.id is null;

-- 4. Verification — rows returned should match expectations
select
  (select count(*) from auth.users)           as auth_users,
  (select count(*) from public.user_profiles) as profiles,
  (select count(*) from pg_trigger
     where tgname = 'on_auth_user_created')   as trigger_present;
