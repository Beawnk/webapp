-- RLS policies for "Users" and "Reports".
-- Run in the Supabase SQL Editor, one step at a time.
--
-- Rule: each logged-in user only sees and changes their own rows.
-- The anon key (which ships in the front-end bundle) sees nothing.


-- ============================================================
-- 1. Inspect what exists today (run this first and read it)
-- ============================================================
-- Policies are combined with OR: if any existing policy allows
-- "select for public/anon using (true)", the new ones below change
-- nothing. Anything permissive listed here has to be dropped in step 2.

select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public' and tablename in ('Users', 'Reports');

select relname, relrowsecurity
from pg_class
where relname in ('Users', 'Reports') and relnamespace = 'public'::regnamespace;


-- ============================================================
-- 2. Drop the old policies
-- ============================================================
-- All for role public (anon included) and almost all with using/check (true):
-- anyone with the anon key could read every user, read/delete every report,
-- and insert reports/users in someone else's name.
begin;

drop policy "Add Report"    on public."Reports";  -- INSERT check (true)
drop policy "Select report" on public."Reports";  -- SELECT using (true)
drop policy "delete report" on public."Reports";  -- DELETE using (true)

drop policy "public can read users" on public."Users";  -- SELECT using (true)
drop policy "update_user"           on public."Users";  -- INSERT check (true), despite the name
drop policy "Allow authenticated users access to their own data" on public."Users";
  -- ALL using (auth.uid() = id): correct rule, but replaced by the
  -- per-operation policies below so there's a single source of truth

commit;


-- ============================================================
-- 3. Enable RLS and create the new policies
-- ============================================================
begin;

alter table public."Users"   enable row level security;
alter table public."Reports" enable row level security;

-- Users: profile row with id = auth user id
-- (UserStore: select on login, insert on signup, update on profile edit)
create policy "users_select_own" on public."Users"
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "users_insert_own" on public."Users"
  for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "users_update_own" on public."Users"
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Reports: owner is "User_id"
-- (ReportsView/ReportView: select; NewReportView: insert; ReportView: delete)
create policy "reports_select_own" on public."Reports"
  for select to authenticated
  using ((select auth.uid()) = "User_id");

create policy "reports_insert_own" on public."Reports"
  for insert to authenticated
  with check ((select auth.uid()) = "User_id");

create policy "reports_delete_own" on public."Reports"
  for delete to authenticated
  using ((select auth.uid()) = "User_id");

commit;
