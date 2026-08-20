CREATE TABLE public.compliance_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  visitor_id text,
  user_id uuid,
  page_url text,
  user_agent text,
  language text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.compliance_consents TO anon;
GRANT INSERT, SELECT ON public.compliance_consents TO authenticated;
GRANT ALL ON public.compliance_consents TO service_role;

ALTER TABLE public.compliance_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "consents_insert_anyone" ON public.compliance_consents
FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "consents_admin_select" ON public.compliance_consents
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_compliance_consents_accepted_at ON public.compliance_consents (accepted_at DESC);