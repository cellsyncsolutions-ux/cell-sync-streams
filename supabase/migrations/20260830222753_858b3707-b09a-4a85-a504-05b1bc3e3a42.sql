-- Public read of COA metadata
DROP POLICY IF EXISTS product_documents_public_read ON public.product_documents;
CREATE POLICY product_documents_public_read
  ON public.product_documents FOR SELECT
  TO anon, authenticated
  USING (true);

GRANT SELECT ON public.product_documents TO anon;

-- Public read of COA files in storage
DROP POLICY IF EXISTS coa_public_read ON storage.objects;
CREATE POLICY coa_public_read
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-documents');
