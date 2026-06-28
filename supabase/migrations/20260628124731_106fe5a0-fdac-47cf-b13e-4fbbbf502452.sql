DROP POLICY IF EXISTS "Verification tokens are publicly readable" ON public.gsc_verification_tokens;
REVOKE SELECT ON public.gsc_verification_tokens FROM anon, authenticated;