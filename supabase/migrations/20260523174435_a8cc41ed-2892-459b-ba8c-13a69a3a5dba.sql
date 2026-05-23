-- Enable RLS on tables where policies exist but RLS is disabled
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.image_replacements ENABLE ROW LEVEL SECURITY;

-- Restrict image_replacements writes to admins only
DROP POLICY IF EXISTS "Authenticated users can insert replacements" ON public.image_replacements;
DROP POLICY IF EXISTS "Authenticated users can update replacements" ON public.image_replacements;

CREATE POLICY "Admins can insert replacements"
ON public.image_replacements
FOR INSERT
TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Admins can update replacements"
ON public.image_replacements
FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));

CREATE POLICY "Admins can delete replacements"
ON public.image_replacements
FOR DELETE
TO authenticated
USING (EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid()));