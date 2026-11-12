COMMENT ON COLUMN public.product_inventory.unit_cost IS 'DEPRECATED: replaced by product_costs (admin-only)';
CREATE TABLE public.product_costs (
  product_id text NOT NULL,
  variant text NOT NULL DEFAULT '',
  unit_cost numeric NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, variant)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_costs TO authenticated;
GRANT ALL ON public.product_costs TO service_role;
ALTER TABLE public.product_costs ENABLE ROW LEVEL SECURITY;
CREATE POLICY product_costs_admin_all ON public.product_costs FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));