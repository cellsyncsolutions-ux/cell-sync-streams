
-- Allow users to update their own orders (needed for cancellation)
CREATE POLICY "orders_update_own"
ON public.orders
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Trigger function: handle status transitions to canceled/refunded
CREATE OR REPLACE FUNCTION public.handle_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  was_terminal boolean;
  is_terminal boolean;
begin
  was_terminal := old.status in ('canceled', 'refunded');
  is_terminal := new.status in ('canceled', 'refunded');

  -- Only act on transition into canceled/refunded
  if is_terminal and not was_terminal then
    -- Refund redeemed points back to user
    if old.points_redeemed > 0 then
      update public.profiles
        set points = points + old.points_redeemed, updated_at = now()
        where id = old.user_id;
    end if;

    -- Reclaim points earned from this order
    if old.points_earned > 0 then
      update public.profiles
        set points = greatest(0, points - old.points_earned), updated_at = now()
        where id = old.user_id;
    end if;

    -- Zero them out on the order to prevent double-processing
    new.points_redeemed := 0;
    new.points_earned := 0;
  end if;

  -- Prevent reverting out of a terminal state
  if was_terminal and not is_terminal then
    raise exception 'Cannot change status of a % order', old.status;
  end if;

  return new;
end;
$$;

DROP TRIGGER IF EXISTS on_order_status_change ON public.orders;
CREATE TRIGGER on_order_status_change
BEFORE UPDATE OF status ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_order_status_change();

-- Ensure the existing award_points trigger only fires on insert (not updates)
DROP TRIGGER IF EXISTS award_points_on_order_trigger ON public.orders;
CREATE TRIGGER award_points_on_order_trigger
BEFORE INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.award_points_on_order();
