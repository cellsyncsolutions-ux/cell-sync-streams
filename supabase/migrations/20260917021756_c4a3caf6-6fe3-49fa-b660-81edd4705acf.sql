INSERT INTO public.product_inventory (product_id, product_name, variant, quantity, available)
VALUES ('kpv', 'KPV', '5mg', 0, false), ('kpv', 'KPV', '10mg', 0, false)
ON CONFLICT (product_id, variant) DO UPDATE SET quantity = 0, available = false;