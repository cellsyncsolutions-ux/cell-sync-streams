ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_status_history REPLICA IDENTITY FULL;
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.order_status_history;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
CREATE POLICY order_status_history_admin_select ON public.order_status_history FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));