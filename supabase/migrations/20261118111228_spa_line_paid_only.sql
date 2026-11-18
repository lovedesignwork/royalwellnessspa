-- Royal Wellness LINE alerts only follow the first successful payment.
-- Existing sent alerts remain as an audit trail; other brands retain their behavior.
begin;
CREATE OR REPLACE FUNCTION notification_private.queue_brand_line()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare snapshot jsonb;
        request_key text;
begin
 -- Spa reservations are alerts about successful payments, never checkout attempts.
 -- Preserve the shared queue behavior for all other brands and contact inquiries.
 request_key := new.id::text;
 if tg_table_schema = 'public' and tg_table_name = 'spa_reservations' then
  if new.payment_status is distinct from 'paid' then return new; end if;
  -- A legacy creation alert may already occupy the original request ID.
  -- A separate payment event keeps its delivery audit and LINE retry key intact.
  request_key := request_key || ':paid';
 end if;
 select coalesce(jsonb_object_agg(key,value),'{}'::jsonb) into snapshot
 from jsonb_each(to_jsonb(new)) where key = any(array[
  'name','guest_name','first_name','last_name','email','phone','subject','message',
  'inquiry_type','inquiry_type_label','form_type','date','time','reservation_date',
  'reservation_time','event_date','event_type','guests','party_size','guest_count',
  'service','occasion','seating_preference','country','special_requests','reference',
  'payment_status','amount','created_at'
 ]);
 insert into public.brand_line_outbox(brand,source_table,request_id,row_snapshot)
 values(tg_argv[0],tg_table_name,request_key,snapshot)
 on conflict(source_table,request_id) do nothing;
 return new;
end;
$function$;


drop trigger if exists spa_reservation_line_queue on public.spa_reservations;
create trigger spa_reservation_line_queue
 after insert on public.spa_reservations
 for each row when (new.payment_status = 'paid')
 execute function notification_private.queue_brand_line('spa');

create trigger spa_payment_line_queue
 after update of payment_status on public.spa_reservations
 for each row when (new.payment_status = 'paid' and old.payment_status is distinct from 'paid')
 execute function notification_private.queue_brand_line('spa');

-- Quarantine old unsent creation alerts, so they cannot be delivered after this change.
-- Successful payment events are queued separately from the authenticated payment update.
update public.brand_line_outbox
 set status='needs_attention', last_error='ignored-unpaid-spa-reservation',
     lease=null, lease_until=null
 where source_table='spa_reservations' and brand='spa'
 and row_snapshot->>'payment_status' is distinct from 'paid'
 and status in ('pending','sending');
commit;
