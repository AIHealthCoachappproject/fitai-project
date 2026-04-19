-- Run this once in the Supabase SQL Editor before deploying the app update.
-- Adds app-owned profile fields to user_profiles so the app never needs to
-- write to the auth-managed `users` table.
alter table public.user_profiles
  add column if not exists name                 text     not null default '',
  add column if not exists goal                 text     not null default '',
  add column if not exists weight               numeric  not null default 0,
  add column if not exists plan                 text     not null default 'free',
  add column if not exists onboarding_completed boolean  not null default false;
