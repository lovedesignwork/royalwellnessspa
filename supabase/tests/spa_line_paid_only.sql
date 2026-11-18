-- No fixture is committed, so the LINE worker cannot see or send these test jobs.
begin;
do $$
declare
 reservation_id uuid := gen_random_uuid();
 inserted_paid_id uuid := gen_random_uuid();
 n integer;
 snapshot jsonb;
begin
 insert into public.spa_reservations(id,reference,payment_ref,guest_name,email,phone,date,time,guests,service,amount,status,payment_status)
 values(reservation_id,'LINE-ROLLBACK-TEST',null,'LINE TEST - ROLLED BACK','line-test@example.com','',current_date,'TEST',1,'LINE queue test',10,'pending','pending');
 select count(*) into n from public.brand_line_outbox where source_table='spa_reservations' and request_id like reservation_id::text || '%';
 if n<>0 then raise exception 'Pending inserts must not queue a LINE alert'; end if;

 update public.spa_reservations set payment_status='failed',status='cancelled' where id=reservation_id;
 update public.spa_reservations set payment_status='pay_at_spa',status='new' where id=reservation_id;
 update public.spa_reservations set special_requests='Unpaid edit' where id=reservation_id;
 select count(*) into n from public.brand_line_outbox where source_table='spa_reservations' and request_id like reservation_id::text || '%';
 if n<>0 then raise exception 'Failed, cancelled, pay-at-spa or unrelated edits must not queue'; end if;

 -- Preserve the legacy sent creation event without letting it prevent a paid event.
 insert into public.brand_line_outbox(brand,source_table,request_id,row_snapshot,status)
 values('spa','spa_reservations',reservation_id::text,'{"payment_status":"pending"}'::jsonb,'sent');
 update public.spa_reservations set payment_status='paid',status='confirmed',transaction_id='ROLLBACK-TEST',payment_completed_at=now() where id=reservation_id;
 select count(*),min(row_snapshot::text)::jsonb into n,snapshot from public.brand_line_outbox where source_table='spa_reservations' and request_id=reservation_id::text || ':paid';
 if n<>1 or snapshot->>'payment_status'<>'paid' or (snapshot->>'amount')::numeric<>10 then raise exception 'Successful payment must queue exactly one accurate paid snapshot'; end if;

 update public.spa_reservations set payment_status='paid' where id=reservation_id;
 update public.spa_reservations set special_requests='Paid edit' where id=reservation_id;
 update public.spa_reservations set payment_status='failed' where id=reservation_id;
 update public.spa_reservations set payment_status='paid' where id=reservation_id;
 select count(*) into n from public.brand_line_outbox where source_table='spa_reservations' and request_id=reservation_id::text || ':paid';
 if n<>1 then raise exception 'Duplicate callbacks and later state changes must not duplicate the paid event'; end if;
 select count(*) into n from public.brand_line_outbox where source_table='spa_reservations' and request_id=reservation_id::text and status='sent';
 if n<>1 then raise exception 'Legacy sent alert audit must be retained'; end if;

 insert into public.spa_reservations(id,guest_name,email,phone,date,time,guests,status,payment_status,amount)
 values(inserted_paid_id,'PAID INSERT TEST','line-test@example.com','',current_date,'TEST',1,'confirmed','paid',10);
 select count(*) into n from public.brand_line_outbox where source_table='spa_reservations' and request_id=inserted_paid_id::text || ':paid';
 if n<>1 then raise exception 'A paid insert must queue one successful payment alert'; end if;
end $$;

-- Exercise the unchanged shared trigger branch without touching real brand bookings.
create temporary table line_other_brand_test(id uuid,guest_name text,payment_status text);
create trigger line_other_brand_test_queue after insert on line_other_brand_test
 for each row execute function notification_private.queue_brand_line('twist');
do $$
declare test_id uuid:=gen_random_uuid();n integer;
begin
 insert into line_other_brand_test values(test_id,'Other brand rollback test',null);
 select count(*) into n from public.brand_line_outbox where brand='twist' and source_table='line_other_brand_test' and request_id=test_id::text;
 if n<>1 then raise exception 'Other brand queue behavior must remain intact'; end if;
end $$;
rollback;
select 'PASS: unpaid ignored, successful payments queued once, paid snapshot correct, legacy audit retained, other brands unchanged; all fixtures rolled back.' as result;
