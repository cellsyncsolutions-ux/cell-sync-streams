-- profiles
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY profiles_insert_own ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- orders
DROP POLICY IF EXISTS orders_select_own ON public.orders;
DROP POLICY IF EXISTS orders_insert_own ON public.orders;
CREATE POLICY orders_select_own ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY orders_insert_own ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- order_items
DROP POLICY IF EXISTS order_items_select_own ON public.order_items;
DROP POLICY IF EXISTS order_items_insert_own ON public.order_items;
CREATE POLICY order_items_select_own ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));
CREATE POLICY order_items_insert_own ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()));

-- order_reviews
DROP POLICY IF EXISTS reviews_select_own ON public.order_reviews;
DROP POLICY IF EXISTS reviews_insert_own ON public.order_reviews;
CREATE POLICY reviews_select_own ON public.order_reviews FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY reviews_insert_own ON public.order_reviews FOR INSERT TO authenticated
  WITH CHECK ((auth.uid() = user_id) AND EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_reviews.order_id AND o.user_id = auth.uid()));

-- order_status_history
DROP POLICY IF EXISTS order_status_history_select_own ON public.order_status_history;
CREATE POLICY order_status_history_select_own ON public.order_status_history FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_status_history.order_id AND o.user_id = auth.uid()));

-- ensure anon has no residual table grants on these tables
REVOKE ALL ON public.profiles, public.orders, public.order_items, public.order_reviews, public.order_status_history FROM anon;
