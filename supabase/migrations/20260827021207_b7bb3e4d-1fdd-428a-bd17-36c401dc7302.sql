create or replace function public.increment_coupon_usage()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.coupon_code is not null and length(trim(new.coupon_code)) > 0 then
    update public.coupons
      set times_used = times_used + 1, updated_at = now()
      where upper(code) = upper(trim(new.coupon_code));
  end if;
  return new;
end;
$$;

drop trigger if exists orders_increment_coupon_usage on public.orders;
create trigger orders_increment_coupon_usage
after insert on public.orders
for each row execute function public.increment_coupon_usage();