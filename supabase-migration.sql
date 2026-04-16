-- ============================================================
-- FitAI Supabase Migration — patches for existing tables
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================
-- Your tables already exist: users, user_profiles, food_logs,
-- workouts, weight_logs, ai_chats, daily_summaries, workout_plans.
--
-- This script adds MISSING user_id columns so that food_logs
-- and weight_logs can be tied to a specific user, and sets up
-- Row Level Security so mobile users can only read/write their
-- own rows while the service-role key (dashboard) bypasses RLS.
-- ============================================================

-- 1. Add user_id to food_logs if it does not exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'food_logs'
      and column_name = 'user_id'
  ) then
    alter table public.food_logs
      add column user_id uuid references public.users(id) on delete cascade;
  end if;
end$$;

-- 2. Add user_id to weight_logs if it does not exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'weight_logs'
      and column_name = 'user_id'
  ) then
    alter table public.weight_logs
      add column user_id uuid references public.users(id) on delete cascade;
  end if;
end$$;

-- 3. Add user_id to daily_summaries if it does not exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'daily_summaries'
      and column_name = 'user_id'
  ) then
    alter table public.daily_summaries
      add column user_id uuid references public.users(id) on delete cascade;
  end if;
end$$;

-- 4. Add user_id to workout_plans if it does not exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'workout_plans'
      and column_name = 'user_id'
  ) then
    alter table public.workout_plans
      add column user_id uuid references public.users(id) on delete cascade;
  end if;
end$$;

-- ============================================================
-- Indexes (idempotent)
-- ============================================================
create index if not exists idx_food_logs_user on public.food_logs(user_id);
create index if not exists idx_food_logs_logged on public.food_logs(logged_at desc);
create index if not exists idx_workouts_user on public.workouts(user_id);
create index if not exists idx_workouts_created on public.workouts(created_at desc);
create index if not exists idx_weight_logs_user on public.weight_logs(user_id);
create index if not exists idx_weight_logs_logged on public.weight_logs(logged_at desc);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Enable RLS on all public tables
alter table public.users enable row level security;
alter table public.user_profiles enable row level security;
alter table public.food_logs enable row level security;
alter table public.workouts enable row level security;
alter table public.weight_logs enable row level security;
alter table public.ai_chats enable row level security;
alter table public.daily_summaries enable row level security;
alter table public.workout_plans enable row level security;

-- Helper: drop policy if exists (Supabase ignores "if not exists" on policies)
-- We use CREATE OR REPLACE where supported, otherwise wrap in a DO block.

-- users
create policy "Users can view own row"        on public.users for select using (auth.uid() = id);
create policy "Users can insert own row"       on public.users for insert with check (auth.uid() = id);
create policy "Users can update own row"       on public.users for update using (auth.uid() = id);

-- user_profiles
create policy "UserProfiles select"            on public.user_profiles for select using (auth.uid() = id);
create policy "UserProfiles insert"            on public.user_profiles for insert with check (auth.uid() = id);
create policy "UserProfiles update"            on public.user_profiles for update using (auth.uid() = id);

-- food_logs
create policy "FoodLogs select own"            on public.food_logs for select using (auth.uid() = user_id);
create policy "FoodLogs insert own"            on public.food_logs for insert with check (auth.uid() = user_id);
create policy "FoodLogs update own"            on public.food_logs for update using (auth.uid() = user_id);
create policy "FoodLogs delete own"            on public.food_logs for delete using (auth.uid() = user_id);

-- workouts
create policy "Workouts select own"            on public.workouts for select using (auth.uid() = user_id);
create policy "Workouts insert own"            on public.workouts for insert with check (auth.uid() = user_id);
create policy "Workouts update own"            on public.workouts for update using (auth.uid() = user_id);
create policy "Workouts delete own"            on public.workouts for delete using (auth.uid() = user_id);

-- weight_logs
create policy "WeightLogs select own"          on public.weight_logs for select using (auth.uid() = user_id);
create policy "WeightLogs insert own"          on public.weight_logs for insert with check (auth.uid() = user_id);
create policy "WeightLogs update own"          on public.weight_logs for update using (auth.uid() = user_id);
create policy "WeightLogs delete own"          on public.weight_logs for delete using (auth.uid() = user_id);

-- ai_chats
create policy "AiChats select own"             on public.ai_chats for select using (auth.uid() = user_id);
create policy "AiChats insert own"             on public.ai_chats for insert with check (auth.uid() = user_id);

-- daily_summaries
create policy "DailySummaries select own"      on public.daily_summaries for select using (auth.uid() = user_id);
create policy "DailySummaries insert own"      on public.daily_summaries for insert with check (auth.uid() = user_id);

-- workout_plans
create policy "WorkoutPlans select own"        on public.workout_plans for select using (auth.uid() = user_id);
create policy "WorkoutPlans insert own"        on public.workout_plans for insert with check (auth.uid() = user_id);
