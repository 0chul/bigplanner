-- Apply as the trusted project database administrator, in one transaction.
-- Public website clients may INSERT only the applicant-supplied columns.
-- A separate allowlist protects applicant data from self-editable profiles.role.
-- Allowlist membership is initialized ONCE from the current confirmed admins.
-- Subsequent access changes must be performed by a trusted project administrator:
--   insert into public.fire_safety_demo_admins (user_id) values ('AUTH_USER_UUID');
--   delete from public.fire_safety_demo_admins where user_id = 'AUTH_USER_UUID';

do $bootstrap$
begin
  if to_regclass('public.fire_safety_demo_admins') is null then
    create table public.fire_safety_demo_admins (
      user_id uuid primary key references auth.users (id) on delete cascade
    );

    insert into public.fire_safety_demo_admins (user_id)
    select p.id
    from public.profiles p
    join auth.users u on u.id = p.id
    where p.role = 'admin'
      and u.email_confirmed_at is not null
      and (u.banned_until is null or u.banned_until < now());
  end if;
end;
$bootstrap$;

create table if not exists public.fire_safety_demo_requests (
  id uuid primary key default gen_random_uuid(),
  company_name text not null
    check (company_name = btrim(company_name) and char_length(company_name) between 1 and 120),
  contact_name text not null
    check (contact_name = btrim(contact_name) and char_length(contact_name) between 1 and 80),
  email text not null
    check (email = btrim(email) and char_length(email) between 3 and 254
      and email ~ '^[^[:space:]@]+@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$'),
  role text not null check (role in ('head-office', 'site', 'other')),
  building_count integer check (building_count between 1 and 100000),
  interests text not null default '' check (char_length(interests) <= 1000),
  consent_granted boolean not null check (consent_granted is true),
  consent_version text not null check (consent_version = 'fire-safety-demo-v1-2026-11-17'),
  source_path text not null check (source_path = '/fire-safety-ai'),
  created_at timestamptz not null default now(),
  -- A daily cleanup after day 89 removes records before day 90 in normal operation.
  expires_at timestamptz not null default (now() + interval '89 days'),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'demo-scheduled', 'completed')),
  admin_note text not null default '' check (char_length(admin_note) <= 2000)
);

create index if not exists fire_safety_demo_requests_created_idx
  on public.fire_safety_demo_requests (created_at desc);
create index if not exists fire_safety_demo_requests_expiry_idx
  on public.fire_safety_demo_requests (expires_at);

alter table public.fire_safety_demo_admins enable row level security;
alter table public.fire_safety_demo_requests enable row level security;

-- Revoke Supabase's legacy default table grants and any previous column grants.
revoke all privileges on table public.fire_safety_demo_admins from public, anon, authenticated;
revoke all privileges (user_id) on table public.fire_safety_demo_admins from public, anon, authenticated;
revoke all privileges on table public.fire_safety_demo_requests from public, anon, authenticated;
revoke all privileges (
  id, company_name, contact_name, email, role, building_count, interests,
  consent_granted, consent_version, source_path, created_at, expires_at, status, admin_note
) on table public.fire_safety_demo_requests from public, anon, authenticated;

grant select (user_id) on table public.fire_safety_demo_admins to authenticated;
grant insert (
  id, company_name, contact_name, email, role, building_count, interests,
  consent_granted, consent_version, source_path
) on table public.fire_safety_demo_requests to anon, authenticated;
grant select on table public.fire_safety_demo_requests to authenticated;
grant update (status, admin_note) on table public.fire_safety_demo_requests to authenticated;
grant delete on table public.fire_safety_demo_requests to authenticated;
grant all privileges on table public.fire_safety_demo_admins to service_role;
grant all privileges on table public.fire_safety_demo_requests to service_role;

drop policy if exists fire_safety_admin_self_read on public.fire_safety_demo_admins;
create policy fire_safety_admin_self_read
  on public.fire_safety_demo_admins for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists fire_safety_demo_public_submit on public.fire_safety_demo_requests;
create policy fire_safety_demo_public_submit
  on public.fire_safety_demo_requests for insert to anon, authenticated
  with check (
    consent_granted is true
    and consent_version = 'fire-safety-demo-v1-2026-11-17'
    and source_path = '/fire-safety-ai'
    and status = 'new'
    and admin_note = ''
  );

drop policy if exists fire_safety_demo_admin_read on public.fire_safety_demo_requests;
create policy fire_safety_demo_admin_read
  on public.fire_safety_demo_requests for select to authenticated
  using (exists (
    select 1 from public.fire_safety_demo_admins a
    where a.user_id = (select auth.uid())
  ));

drop policy if exists fire_safety_demo_admin_update on public.fire_safety_demo_requests;
create policy fire_safety_demo_admin_update
  on public.fire_safety_demo_requests for update to authenticated
  using (exists (
    select 1 from public.fire_safety_demo_admins a
    where a.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.fire_safety_demo_admins a
    where a.user_id = (select auth.uid())
  ));

drop policy if exists fire_safety_demo_admin_delete on public.fire_safety_demo_requests;
create policy fire_safety_demo_admin_delete
  on public.fire_safety_demo_requests for delete to authenticated
  using (exists (
    select 1 from public.fire_safety_demo_admins a
    where a.user_id = (select auth.uid())
  ));

-- UTC 18:17 is 03:17 the next day in Asia/Seoul. Named scheduling is an upsert.
-- This job contains no applicant information in either its SQL or execution logs.
create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;
select cron.schedule(
  'fire-safety-demo-retention',
  '17 18 * * *',
  $cleanup$delete from public.fire_safety_demo_requests where expires_at <= now();$cleanup$
);

notify pgrst, 'reload schema';
