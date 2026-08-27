-- Table: remove anonymous read access
DROP POLICY IF EXISTS product_documents_public_read ON public.product_documents;
REVOKE SELECT ON public.product_documents FROM anon;

-- Ensure authenticated read remains
DROP POLICY IF EXISTS product_documents_authenticated_read ON public.product_documents;
CREATE POLICY product_documents_authenticated_read
ON public.product_documents
FOR SELECT
TO authenticated
USING (true);

-- Storage: remove anonymous read on the private bucket
DROP POLICY IF EXISTS coa_public_read ON storage.objects;
DROP POLICY IF EXISTS product_documents_public_read ON storage.objects;
DROP POLICY IF EXISTS coa_authenticated_read ON storage.objects;

CREATE POLICY coa_authenticated_read
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'product-documents');