-- "Emergencies": help requests made from the emergency screen.
-- Run in the Supabase SQL Editor BEFORE deploying the front-end that writes to it.
--
-- The app records the request (where, message, which services) and then offers
-- buttons to call 190/192/193. Nothing here notifies the services: there is no
-- public API for that, the phone call is the real "send".


-- ============================================================
-- 1. Table
-- ============================================================
begin;

create table if not exists public."Emergencies" (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  "User_id" uuid not null default auth.uid() references auth.users (id) on delete cascade,
  "Address" text,
  "Latitude" double precision,
  "Longitude" double precision,
  "Message" text,
  "Recipients" text[] not null check (cardinality("Recipients") > 0)
);

create index if not exists emergencies_user_id_idx on public."Emergencies" ("User_id");


-- ============================================================
-- 2. RLS: same rule as "Reports", each user only sees/creates their own rows
-- ============================================================
alter table public."Emergencies" enable row level security;

create policy "emergencies_select_own" on public."Emergencies"
  for select to authenticated
  using ((select auth.uid()) = "User_id");

create policy "emergencies_insert_own" on public."Emergencies"
  for insert to authenticated
  with check ((select auth.uid()) = "User_id");

commit;


-- ============================================================
-- 3. Check
-- ============================================================
-- select id, created_at, "Address", "Recipients" from public."Emergencies" order by id desc limit 5;
