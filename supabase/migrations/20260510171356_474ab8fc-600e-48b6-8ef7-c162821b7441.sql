-- Remove the overly permissive public SELECT policy that exposes assigned_users emails
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupon_codes;

-- Only authenticated users can view active coupons (checkout requires auth anyway)
CREATE POLICY "Authenticated users can view active coupons"
ON public.coupon_codes
FOR SELECT
TO authenticated
USING (is_active = true);