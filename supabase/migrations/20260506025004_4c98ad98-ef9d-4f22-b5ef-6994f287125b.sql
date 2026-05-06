
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS refund_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS refund_requested_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS refund_processed_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS refund_reason text;

-- Guard: limit what end users can change on their own orders.
CREATE OR REPLACE FUNCTION public.guard_order_user_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
declare
  is_service boolean := current_setting('request.jwt.claim.role', true) = 'service_role'
                        or session_user = 'postgres';
begin
  if is_service then
    return new;
  end if;

  -- Allowed transition 1: cancel a pending order
  if new.status is distinct from old.status then
    if not (old.status = 'pending' and new.status = 'canceled') then
      raise exception 'You cannot change order status from % to %', old.status, new.status;
    end if;
  end if;

  -- Allowed transition 2: request a refund on a shipped/delivered order
  if new.refund_status is distinct from old.refund_status then
    if not (
      coalesce(old.refund_status, 'none') = 'none'
      and new.refund_status = 'requested'
      and old.status in ('paid', 'shipped', 'delivered', 'completed')
    ) then
      raise exception 'Refund cannot be requested in current state';
    end if;
    new.refund_requested_at := now();
  end if;

  -- Block edits to financial / point fields by users
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
$$;

DROP TRIGGER IF EXISTS guard_order_user_update_trigger ON public.orders;
CREATE TRIGGER guard_order_user_update_trigger
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.guard_order_user_update();
