-- 1. product_documents: restrict reads to authenticated users
DROP POLICY IF EXISTS product_documents_public_read ON public.product_documents;
CREATE POLICY product_documents_authenticated_read
  ON public.product_documents FOR SELECT TO authenticated
  USING (true);
REVOKE ALL ON public.product_documents FROM anon;
GRANT SELECT ON public.product_documents TO authenticated;

-- Storage: remove public read of the private product-documents bucket
DROP POLICY IF EXISTS coa_public_read ON storage.objects;

-- 2. order_status_history: explicit admin-only write policies (triggers use SECURITY DEFINER)
CREATE POLICY order_status_history_admin_insert
  ON public.order_status_history FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY order_status_history_admin_update
  ON public.order_status_history FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY order_status_history_admin_delete
  ON public.order_status_history FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3. sms_subscribers: explicit admin-only read, no client writes
CREATE POLICY sms_subscribers_admin_select
  ON public.sms_subscribers FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
REVOKE ALL ON public.sms_subscribers FROM anon, authenticated;
GRANT SELECT ON public.sms_subscribers TO authenticated;
GRANT ALL ON public.sms_subscribers TO service_role;