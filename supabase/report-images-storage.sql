-- Private Storage bucket for report images.
-- Run in the Supabase SQL Editor BEFORE deploying the front-end that uploads to it.
--
-- Before: images were base64 data URLs inside the "Reports" row (several MB per
-- row, downloaded with every select). Now each file goes to Storage at
-- report-images/<user id>/<uuid>.<ext> and "Reports"."Images" keeps only the paths.
-- Old rows with data URLs still display (ReportView handles both).
--
-- Private bucket: report photos can show homes, people, plates. The app reads them
-- through short-lived signed URLs, which only the owner can create (policies below).


-- ============================================================
-- 1. Bucket
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('report-images', 'report-images', false, 5242880, array['image/png', 'image/jpeg'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;


-- ============================================================
-- 2. Policies: each user only touches files under their own folder
-- ============================================================
-- (storage.foldername(name))[1] is the first path segment, i.e. the user id.
begin;

create policy "report_images_select_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'report-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "report_images_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'report-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "report_images_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'report-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

commit;


-- ============================================================
-- 3. Check
-- ============================================================
-- select id, public, file_size_limit, allowed_mime_types from storage.buckets where id = 'report-images';
-- select policyname, cmd from pg_policies where schemaname = 'storage' and policyname like 'report_images_%';
