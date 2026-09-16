create or replace function public.handle_order_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_points integer;
  merch numeric;
begin
  if new.points_redeemed < 0 then
    raise exception 'points_redeemed must be non-negative';
  end if;

  if new.points_redeemed > 0 then
    select points into current_points from public.profiles where id = new.user_id for update;
    if current_points is null or current_points < new.points_redeemed then
      raise exception 'Insufficient points balance';
    end if;
    update public.profiles
      set points = points - new.points_redeemed, updated_at = now()
      where id = new.user_id;
  end if;

  -- Points are earned on merchandise only, never on shipping charges
  merch := greatest(0, new.total - coalesce(new.shipping_cost, 0));

  -- 20 points per $1 spent, plus a 1000-point ($10) bonus for every $100 in one order
  new.points_earned := (floor(merch) * 20)::int + (floor(merch / 100) * 1000)::int;

  if new.points_earned > 0 then
    update public.profiles
      set points = points + new.points_earned, updated_at = now()
      where id = new.user_id;
  end if;

  return new;
end;
$$;