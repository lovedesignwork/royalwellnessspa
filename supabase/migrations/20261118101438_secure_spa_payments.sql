-- Payment writes are server-only. Public visitors can still submit unpaid inquiries.
begin;
drop policy if exists spa_anon_update_for_payment on public.spa_reservations;
drop policy if exists spa_anon_read_for_status on public.spa_reservations;
drop policy if exists spa_anyone_create_reservation on public.spa_reservations;
create policy spa_anyone_create_reservation on public.spa_reservations for insert to anon,authenticated with check (
 status='new' and payment_status is null and payment_ref is null and reference is null
 and amount is null and transaction_id is null and payment_completed_at is null
);
create policy spa_admin_read_reservations on public.spa_reservations for select to authenticated using (
 exists(select 1 from public.admin_users where id=(select auth.uid()) and role in ('admin','superadmin','editor'))
);
create policy spa_admin_manage_reservations on public.spa_reservations for update to authenticated using (
 exists(select 1 from public.admin_users where id=(select auth.uid()) and role in ('admin','superadmin','editor'))
) with check (
 exists(select 1 from public.admin_users where id=(select auth.uid()) and role in ('admin','superadmin','editor'))
);
-- New Pay Solutions references have 12 digits; keep legacy 2C2P records intact.
create unique index spa_payso_payment_ref_unique on public.spa_reservations(payment_ref) where payment_ref ~ '^[0-9]{12}$';
grant select,insert,update,delete on public.spa_reservations to service_role;
commit;
