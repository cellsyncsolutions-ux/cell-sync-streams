INSERT INTO public.product_inventory (product_id, product_name, variant, quantity, available)
VALUES
  ('l-glutathione', 'L-Glutathione', '300mg', 0, false),
  ('l-glutathione', 'L-Glutathione', '600mg', 0, false),
  ('l-glutathione', 'L-Glutathione', '1200mg', 0, false)
ON CONFLICT (product_id, variant) DO UPDATE SET quantity = 0, available = false;