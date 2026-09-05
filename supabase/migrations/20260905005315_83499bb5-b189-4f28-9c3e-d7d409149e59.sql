GRANT SELECT ON public.product_inventory TO anon, authenticated;

ALTER TABLE public.product_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view product availability"
ON public.product_inventory
FOR SELECT
TO anon, authenticated
USING (true);