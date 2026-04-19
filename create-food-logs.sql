-- ============================================================
-- FitAI — Create food_logs table from scratch
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================
-- This script is idempotent (safe to run multiple times).
-- It creates the food_logs table exactly matching the app's
-- FoodLog / InsertFoodLog types in lib/types.ts.
-- ============================================================

-- 1. Create the food_logs table (matches FoodLog in lib/types.ts)
create table if not exists public.food_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  food_name   text not null,
  food_name_th text,
  meal_type   text not null,           -- e.g. 'breakfast' | 'lunch' | 'dinner' | 'snack'
  calories    numeric(8, 2) not null,
  protein_g   numeric(8, 2) not null,
  carbs_g     numeric(8, 2) not null,
  fat_g       numeric(8, 2) not null,
  amount_g    numeric(8, 2),           -- nullable
  image_uri   text,                    -- nullable
  logged_at   timestamptz not null default now()
);

-- 2. Indexes for fast per-user queries
create index if not exists idx_food_logs_user_id  on public.food_logs (user_id);
create index if not exists idx_food_logs_logged_at on public.food_logs (logged_at desc);

-- 3. Enable RLS (keeps the table secure by default)
alter table public.food_logs enable row level security;

-- 4. RLS policies — users can only access their own rows
--    (drop first so re-running doesn't error on duplicate policy names)
drop policy if exists "FoodLogs select own" on public.food_logs;
drop policy if exists "FoodLogs insert own" on public.food_logs;
drop policy if exists "FoodLogs update own" on public.food_logs;
drop policy if exists "FoodLogs delete own" on public.food_logs;

create policy "FoodLogs select own"
  on public.food_logs for select
  using (auth.uid() = user_id);

create policy "FoodLogs insert own"
  on public.food_logs for insert
  with check (auth.uid() = user_id);

create policy "FoodLogs update own"
  on public.food_logs for update
  using (auth.uid() = user_id);

create policy "FoodLogs delete own"
  on public.food_logs for delete
  using (auth.uid() = user_id);

-- ============================================================
-- DEVELOPMENT ONLY — disable RLS to bypass auth during testing
-- Comment this out (or revert) before going to production.
-- ============================================================
alter table public.food_logs disable row level security;
