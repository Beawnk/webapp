-- Creates the "Users" profile row when an auth user signs up.
-- Run in the Supabase SQL Editor BEFORE deploying the front-end that relies on it
-- (UserStore.register no longer inserts into "Users").
--
-- Why: the front-end used to insert the profile right after auth.signUp. That only
-- passes RLS ("to authenticated") when signUp returns a session, i.e. with email
-- confirmation turned off. With confirmation on, the insert ran as anon, failed,
-- and left an auth user without a profile (login then broke on .single()).
-- A trigger runs inside the signUp transaction, so both rows exist or neither does.


-- ============================================================
-- 1. Function + trigger
-- ============================================================
begin;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer          -- runs as the owner, so RLS on "Users" doesn't block it
set search_path = ''      -- recommended for security definer: no schema hijacking
as $$
declare
  -- jsonb_populate_record converts each field to the column's real type
  -- (e.g. "Birthdate" as date or text), so this doesn't depend on the schema details
  profile public."Users" := jsonb_populate_record(
    null::public."Users",
    coalesce(new.raw_user_meta_data, '{}'::jsonb)
  );
begin
  -- Only these columns come from user_metadata, which the user controls.
  -- id and Email always come from auth.users itself.
  insert into public."Users" (
    id, "Email", "Name", "Birthdate", "Phone",
    "Zip_code", "Street", "Number", "District", "City", "State"
  )
  values (
    new.id, new.email, profile."Name", profile."Birthdate", profile."Phone",
    profile."Zip_code", profile."Street", profile."Number", profile."District",
    profile."City", profile."State"
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

commit;


-- ============================================================
-- 2. (Optional) remove the client insert policy
-- ============================================================
-- The front-end no longer inserts into "Users", and the trigger bypasses RLS.
-- Dropping the policy means a logged-in user can't create profile rows by hand.
-- Only run this after the new front-end is deployed.

-- drop policy "users_insert_own" on public."Users";


-- ============================================================
-- 3. Check
-- ============================================================
-- Sign up a test user in the app, then:
-- select id, "Email", "Name", "City" from public."Users" order by id desc limit 5;
