CREATE OR REPLACE FUNCTION public.admin_user_activity(_user_id uuid, _limit integer DEFAULT 100)
RETURNS TABLE (event_at timestamptz, action text, ip_address text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT a.created_at,
         COALESCE(a.payload->>'action', 'unknown')::text,
         NULLIF(a.payload->>'ip_address', '')::text
  FROM auth.audit_log_entries a
  WHERE a.payload->>'actor_id' = _user_id::text
  ORDER BY a.created_at DESC
  LIMIT LEAST(COALESCE(_limit, 100), 500);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_user_activity(uuid, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_user_activity(uuid, integer) TO authenticated, service_role;