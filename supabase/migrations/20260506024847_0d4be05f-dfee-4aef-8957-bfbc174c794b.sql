
CREATE TABLE public.order_status_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_status_history_order ON public.order_status_history(order_id, created_at);

ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_status_history_select_own"
ON public.order_status_history
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.orders o
  WHERE o.id = order_status_history.order_id AND o.user_id = auth.uid()
));

CREATE OR REPLACE FUNCTION public.log_order_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
begin
  if (tg_op = 'INSERT') then
    insert into public.order_status_history (order_id, status, created_at)
    values (new.id, new.status, new.created_at);
  elsif (tg_op = 'UPDATE' and new.status is distinct from old.status) then
    insert into public.order_status_history (order_id, status)
    values (new.id, new.status);
  end if;
  return new;
end;
$$;

DROP TRIGGER IF EXISTS log_order_status_insert ON public.orders;
CREATE TRIGGER log_order_status_insert
AFTER INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.log_order_status();

DROP TRIGGER IF EXISTS log_order_status_update ON public.orders;
CREATE TRIGGER log_order_status_update
AFTER UPDATE OF status ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.log_order_status();

-- Backfill history for existing orders that have none
INSERT INTO public.order_status_history (order_id, status, created_at)
SELECT o.id, o.status, o.created_at
FROM public.orders o
WHERE NOT EXISTS (
  SELECT 1 FROM public.order_status_history h WHERE h.order_id = o.id
);
