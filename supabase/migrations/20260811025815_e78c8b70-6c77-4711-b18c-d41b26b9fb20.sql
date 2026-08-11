CREATE POLICY "reviews_update_own" ON public.order_reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON public.order_reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "anyone can subscribe" ON public.sms_subscribers;
REVOKE ALL ON public.sms_subscribers FROM anon, authenticated;
GRANT ALL ON public.sms_subscribers TO service_role;