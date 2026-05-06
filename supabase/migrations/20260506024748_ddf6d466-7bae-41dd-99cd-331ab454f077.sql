
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS points_reversed boolean NOT NULL DEFAULT false;

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

  if is_terminal and not was_terminal and not coalesce(old.points_reversed, false) then
    if old.points_redeemed > 0 then
      update public.profiles
        set points = points + old.points_redeemed, updated_at = now()
        where id = old.user_id;
    end if;

    if old.points_earned > 0 then
      update public.profiles
        set points = greatest(0, points - old.points_earned), updated_at = now()
        where id = old.user_id;
    end if;

    new.points_reversed := true;
  end if;

  if was_terminal and not is_terminal then
    raise exception 'Cannot change status of a % order', old.status;
  end if;

  return new;
end;
$$;
