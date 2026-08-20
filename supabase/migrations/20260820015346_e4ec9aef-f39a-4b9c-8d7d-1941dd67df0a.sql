REVOKE EXECUTE ON FUNCTION public.admin_user_activity(uuid, integer) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.admin_user_activity(uuid, integer) TO service_role;

REVOKE EXECUTE ON FUNCTION public.award_points_on_order() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_order_status_change() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.log_order_status() FROM anon, authenticated, public;

DROP POLICY IF EXISTS "product_documents_signed_read" ON storage.objects;
CREATE POLICY "product_documents_signed_read"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'product-documents');