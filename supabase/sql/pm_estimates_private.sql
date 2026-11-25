-- PM documents trust the administrator role assigned by the operator.
-- Keep normal profile edits and signup, but reserve role assignments for the server.
revoke insert, update on table public.profiles from public, anon, authenticated;
revoke insert (role), update (role) on table public.profiles from public, anon, authenticated;
grant insert (id, email), update (email) on table public.profiles to anon, authenticated;

insert into storage.buckets (id, name, public)
values ('pm-estimates-private', 'pm-estimates-private', false)
on conflict (id) do nothing;
do $$
begin
  if not exists (select 1 from storage.buckets where id = 'pm-estimates-private' and public = false) then
    raise exception 'PM storage must be private';
  end if;
end $$;

drop policy if exists pm_workspace_admin_read on storage.objects;
create policy pm_workspace_admin_read on storage.objects for select to authenticated
using (bucket_id = 'pm-estimates-private' and exists (
  select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'
));

-- Preserve the boundary if another bucket later adds broader permissive policies.
drop policy if exists pm_workspace_read_boundary on storage.objects;
create policy pm_workspace_read_boundary on storage.objects as restrictive for select to anon, authenticated
using (bucket_id <> 'pm-estimates-private' or exists (
  select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'
));
drop policy if exists pm_workspace_insert_boundary on storage.objects;
create policy pm_workspace_insert_boundary on storage.objects as restrictive for insert to anon, authenticated
with check (bucket_id <> 'pm-estimates-private');
drop policy if exists pm_workspace_update_boundary on storage.objects;
create policy pm_workspace_update_boundary on storage.objects as restrictive for update to anon, authenticated
using (bucket_id <> 'pm-estimates-private') with check (bucket_id <> 'pm-estimates-private');
drop policy if exists pm_workspace_delete_boundary on storage.objects;
create policy pm_workspace_delete_boundary on storage.objects as restrictive for delete to anon, authenticated
using (bucket_id <> 'pm-estimates-private');
