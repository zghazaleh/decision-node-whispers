
CREATE TABLE public.gsc_verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_url text NOT NULL UNIQUE,
  token text NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gsc_verification_tokens TO anon;
GRANT SELECT ON public.gsc_verification_tokens TO authenticated;
GRANT ALL ON public.gsc_verification_tokens TO service_role;

ALTER TABLE public.gsc_verification_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Verification tokens are publicly readable"
  ON public.gsc_verification_tokens
  FOR SELECT
  USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_gsc_verification_tokens_updated_at
  BEFORE UPDATE ON public.gsc_verification_tokens
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
