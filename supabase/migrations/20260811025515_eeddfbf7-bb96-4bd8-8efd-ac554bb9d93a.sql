CREATE TABLE public.product_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id text NOT NULL,
  title text NOT NULL,
  file_path text NOT NULL,
  file_size integer,
  uploaded_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.product_documents TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_documents TO authenticated;
GRANT ALL ON public.product_documents TO service_role;

ALTER TABLE public.product_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_documents_public_read" ON public.product_documents FOR SELECT USING (true);
CREATE POLICY "product_documents_admin_insert" ON public.product_documents FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "product_documents_admin_update" ON public.product_documents FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "product_documents_admin_delete" ON public.product_documents FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX product_documents_product_id_idx ON public.product_documents (product_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_product_documents_updated_at BEFORE UPDATE ON public.product_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "coa_public_read" ON storage.objects FOR SELECT USING (bucket_id = 'product-documents');
CREATE POLICY "coa_admin_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-documents' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "coa_admin_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-documents' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "coa_admin_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-documents' AND public.has_role(auth.uid(), 'admin'));