create or replace function public.handle_order_points()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_points integer;
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
  new.points_earned := greatest(0, floor(new.total - coalesce(new.shipping_cost, 0)))::int;

  if new.points_earned > 0 then
    update public.profiles
      set points = points + new.points_earned, updated_at = now()
      where id = new.user_id;
  end if;

  return new;
end;
$$;