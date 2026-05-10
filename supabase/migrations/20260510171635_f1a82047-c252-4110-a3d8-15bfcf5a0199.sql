DROP POLICY IF EXISTS "Authenticated users can view active coupons" ON public.coupon_codes;

CREATE POLICY "Users can view applicable active coupons"
ON public.coupon_codes
FOR SELECT
TO authenticated
USING (
  is_active = true
  AND (
    assigned_users IS NULL
    OR lower((auth.jwt() ->> 'email')) = ANY (
      string_to_array(lower(replace(assigned_users, ' ', '')), ',')
    )
  )
);