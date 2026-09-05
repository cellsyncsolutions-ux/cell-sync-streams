DROP TRIGGER IF EXISTS award_points_on_order_trigger ON public.orders;
DROP TRIGGER IF EXISTS before_order_insert ON public.orders;

CREATE TRIGGER orders_award_points
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_order_points();