
-- Fix overly permissive email_signups SELECT policy
DROP POLICY IF EXISTS "Users can view their own email signups" ON public.email_signups;

CREATE POLICY "Users can view their own email signup"
  ON public.email_signups FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
