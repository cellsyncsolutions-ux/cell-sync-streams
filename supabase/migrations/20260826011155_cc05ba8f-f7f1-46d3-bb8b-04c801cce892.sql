CREATE TABLE public.product_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  product_name text NOT NULL,
  variant text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 0,
  low_stock_threshold integer NOT NULL DEFAULT 5,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, variant)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_inventory TO authenticated;
GRANT ALL ON public.product_inventory TO service_role;

ALTER TABLE public.product_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "inventory_admin_select" ON public.product_inventory FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "inventory_admin_insert" ON public.product_inventory FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "inventory_admin_update" ON public.product_inventory FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "inventory_admin_delete" ON public.product_inventory FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_product_inventory_updated_at BEFORE UPDATE ON public.product_inventory FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();