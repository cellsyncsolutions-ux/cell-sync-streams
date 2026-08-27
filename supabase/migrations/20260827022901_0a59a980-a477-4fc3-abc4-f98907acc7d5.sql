GRANT SELECT ON public.product_documents TO anon;
CREATE POLICY product_documents_public_read ON public.product_documents FOR SELECT TO anon USING (true);
CREATE POLICY coa_public_read ON storage.objects FOR SELECT TO anon USING (bucket_id = 'product-documents');