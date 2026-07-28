
-- Ensure order guard trigger is attached to enforce field restrictions on user updates
DROP TRIGGER IF EXISTS orders_guard_user_update ON public.orders;
CREATE TRIGGER orders_guard_user_update
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.guard_order_user_update();

DROP TRIGGER IF EXISTS orders_status_history_log ON public.orders;
CREATE TRIGGER orders_status_history_log
AFTER INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.log_order_status();

DROP TRIGGER IF EXISTS orders_status_change ON public.orders;
CREATE TRIGGER orders_status_change
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_order_status_change();

-- Replace overly-broad user update policy on orders with column-scoped policy
DROP POLICY IF EXISTS orders_update_own ON public.orders;
CREATE POLICY orders_update_own ON public.orders
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Restrict column privileges: users may only update status/refund fields; the trigger enforces valid transitions
REVOKE UPDATE ON public.orders FROM authenticated;
GRANT UPDATE (status, refund_status, refund_reason) ON public.orders TO authenticated;

-- Lock down sms_subscribers SELECT explicitly (no policy = denied, but add restrictive policy for defense-in-depth)
REVOKE SELECT ON public.sms_subscribers FROM anon, authenticated;

-- Prevent user_roles self-grant: ensure no INSERT/UPDATE/DELETE grants to anon/authenticated
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM anon, authenticated, PUBLIC;
