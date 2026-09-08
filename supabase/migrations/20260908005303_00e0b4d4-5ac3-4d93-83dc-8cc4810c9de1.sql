CREATE POLICY "orders_admin_update" ON public.orders
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.guard_order_user_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
declare
  is_service boolean := current_setting('request.jwt.claim.role', true) = 'service_role'
                        or session_user = 'postgres';
begin
  if is_service or public.has_role(auth.uid(), 'admin') then
    return new;
  end if;

  if new.status is distinct from old.status then
    if not (old.status = 'pending' and new.status = 'canceled') then
      raise exception 'You cannot change order status from % to %', old.status, new.status;
    end if;
  end if;

  if new.refund_status is distinct from old.refund_status then
    if not (
      coalesce(old.refund_status, 'none') = 'none'
      and new.refund_status = 'requested'
      and old.status in ('paid', 'shipped', 'fulfilled', 'delivered', 'completed')
    ) then
      raise exception 'Refund cannot be requested in current state';
    end if;
    new.refund_requested_at := now();
  end if;

  if new.total <> old.total
     or new.subtotal <> old.subtotal
     or new.discount <> old.discount
     or new.points_earned <> old.points_earned
     or new.points_redeemed <> old.points_redeemed
     or new.points_reversed <> old.points_reversed
     or new.user_id <> old.user_id then
    raise exception 'These order fields cannot be modified';
  end if;

  return new;
end;
$function$;