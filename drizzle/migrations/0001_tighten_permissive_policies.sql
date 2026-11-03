DROP POLICY IF EXISTS consents_insert_anyone ON public.compliance_consents;
CREATE POLICY consents_insert_validated ON public.compliance_consents
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    (user_id IS NULL OR user_id = auth.uid())
    AND length(version) BETWEEN 1 AND 50
    AND (visitor_id IS NULL OR length(visitor_id) <= 100)
    AND (page_url IS NULL OR length(page_url) <= 2000)
    AND (user_agent IS NULL OR length(user_agent) <= 1000)
    AND (language IS NULL OR length(language) <= 35)
    AND accepted_at > now() - interval '1 day' AND accepted_at < now() + interval '1 day'
  );

DROP POLICY IF EXISTS product_documents_authenticated_read ON public.product_documents;

DROP POLICY IF EXISTS coa_public_read ON storage.objects;
DROP POLICY IF EXISTS coa_authenticated_read ON storage.objects;
DROP POLICY IF EXISTS product_documents_signed_read ON storage.objects;
CREATE POLICY coa_published_read ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id = 'product-documents'
    AND EXISTS (SELECT 1 FROM public.product_documents d WHERE d.file_path = storage.objects.name)
  );