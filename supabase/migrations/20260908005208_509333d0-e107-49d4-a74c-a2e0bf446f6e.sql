DROP TRIGGER IF EXISTS log_order_status_insert ON public.orders;
DROP TRIGGER IF EXISTS log_order_status_update ON public.orders;
DROP TRIGGER IF EXISTS guard_order_user_update_trigger ON public.orders;
DROP TRIGGER IF EXISTS on_order_status_change ON public.orders;