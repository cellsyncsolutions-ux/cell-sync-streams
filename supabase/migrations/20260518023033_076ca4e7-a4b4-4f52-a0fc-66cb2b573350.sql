
CREATE TABLE public.order_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL UNIQUE,
  user_id uuid NOT NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.order_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_select_own" ON public.order_reviews
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "reviews_insert_own" ON public.order_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );
