
-- 1. Revoke EXECUTE on SECURITY DEFINER functions from anon/authenticated/PUBLIC.
-- Trigger functions don't need to be callable; has_role is invoked from RLS as definer and doesn't need direct EXECUTE.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_order_status() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_order_status_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.award_points_on_order() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.guard_order_user_update() FROM PUBLIC, anon, authenticated;

-- 2. Tighten sms_subscribers INSERT policy (no more WITH CHECK true).
DROP POLICY IF EXISTS "anyone can subscribe" ON public.sms_subscribers;
CREATE POLICY "anyone can subscribe"
  ON public.sms_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    opted_out = false
    AND last_sent_at IS NULL
    AND phone IS NOT NULL
  );

-- 3. Restrict order UPDATE to only safe columns. Trigger guard_order_user_update still enforces rules.
REVOKE UPDATE ON public.orders FROM authenticated;
GRANT UPDATE (
  status,
  refund_status,
  refund_reason,
  shipping_name,
  shipping_address_line1,
  shipping_address_line2,
  shipping_city,
  shipping_state,
  shipping_postal_code,
  shipping_country
) ON public.orders TO authenticated;
