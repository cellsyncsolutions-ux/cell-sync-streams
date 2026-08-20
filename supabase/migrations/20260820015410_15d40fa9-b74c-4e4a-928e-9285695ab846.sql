CREATE OR REPLACE FUNCTION public.admin_user_activity(_user_id uuid, _limit integer DEFAULT 100)
 RETURNS TABLE(event_at timestamp with time zone, action text, ip_address text)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
BEGIN
  IF NOT (
    public.has_role(auth.uid(), 'admin')
    OR current_setting('request.jwt.claim.role', true) = 'service_role'
    OR current_setting('request.jwt.claims', true)::jsonb->>'role' = 'service_role'
    OR session_user = 'postgres'
  ) THEN
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
$function$;

REVOKE EXECUTE ON FUNCTION public.admin_user_activity(uuid, integer) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.admin_user_activity(uuid, integer) TO service_role;