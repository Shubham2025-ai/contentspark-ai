-- ============================================================
-- ContentSpark AI — Supabase Schema
-- Run this entire file in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES table (extends Supabase auth.users)
-- ============================================================
create table if not exists public.profiles (
  id           uuid references auth.users(id) on delete cascade primary key,
  email        text,
  full_name    text,
  avatar_url   text,
  groq_key     text,                        -- encrypted at rest by Supabase
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- GENERATIONS table (history of every AI generation)
-- ============================================================
create table if not exists public.generations (
  id            uuid default uuid_generate_v4() primary key,
  user_id       uuid references auth.users(id) on delete cascade not null,
  product_name  text not null,
  description   text not null,
  platform      text not null,
  content_type  text not null,
  tone          text not null,
  cta           text,
  emoji_pref    text default 'On',
  variants      jsonb not null default '[]',   -- array of 3 variant strings
  quality_scores jsonb default '[]',           -- array of 3 scores
  avg_score     integer default 0,
  created_at    timestamptz default now()
);

alter table public.generations enable row level security;

create policy "Users can view own generations"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "Users can insert own generations"
  on public.generations for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own generations"
  on public.generations for delete
  using (auth.uid() = user_id);

-- Index for fast user lookups
create index if not exists generations_user_id_idx on public.generations(user_id);
create index if not exists generations_created_at_idx on public.generations(created_at desc);

-- ============================================================
-- DRAFTS table (saved/starred content variants)
-- ============================================================
create table if not exists public.drafts (
  id             uuid default uuid_generate_v4() primary key,
  user_id        uuid references auth.users(id) on delete cascade not null,
  generation_id  uuid references public.generations(id) on delete set null,
  product_name   text not null,
  platform       text not null,
  content_type   text not null,
  tone           text not null,
  content        text not null,              -- the actual copy text
  quality_score  integer default 0,
  tags           text[] default '{}',        -- user-defined tags
  is_published   boolean default false,
  note           text,                       -- user's private note
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

alter table public.drafts enable row level security;

create policy "Users can view own drafts"
  on public.drafts for select
  using (auth.uid() = user_id);

create policy "Users can insert own drafts"
  on public.drafts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own drafts"
  on public.drafts for update
  using (auth.uid() = user_id);

create policy "Users can delete own drafts"
  on public.drafts for delete
  using (auth.uid() = user_id);

create index if not exists drafts_user_id_idx on public.drafts(user_id);
create index if not exists drafts_created_at_idx on public.drafts(created_at desc);
create index if not exists drafts_platform_idx on public.drafts(platform);

-- ============================================================
-- Helper: updated_at auto-trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_drafts_updated_at
  before update on public.drafts
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- Done! Tables created:
--   public.profiles      — user profiles (auto-created on signup)
--   public.generations   — every AI generation with variants + scores
--   public.drafts        — saved/starred content pieces
-- ============================================================
