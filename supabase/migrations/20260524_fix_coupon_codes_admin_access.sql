-- Add admin RLS policy to coupon_codes table for admin panel access
-- This allows users with admin role to manage coupons

DROP POLICY IF EXISTS "Users can view applicable active coupons" ON public.coupon_codes;

-- Admin policy: Allow admins to see all coupons (for admin panel)
CREATE POLICY "Admins can manage all coupons"
ON public.coupon_codes
FOR SELECT
TO authenticated
USING (
  public.get_user_admin_status(auth.uid())
);

-- Allow admins to insert coupons
CREATE POLICY "Admins can create coupons"
ON public.coupon_codes
FOR INSERT
TO authenticated
WITH CHECK (
  public.get_user_admin_status(auth.uid())
);

-- Allow admins to update coupons
CREATE POLICY "Admins can update coupons"
ON public.coupon_codes
FOR UPDATE
TO authenticated
USING (
  public.get_user_admin_status(auth.uid())
)
WITH CHECK (
  public.get_user_admin_status(auth.uid())
);

-- Allow admins to delete coupons
CREATE POLICY "Admins can delete coupons"
ON public.coupon_codes
FOR DELETE
TO authenticated
USING (
  public.get_user_admin_status(auth.uid())
);

-- Users can view active coupons that apply to them (for checkout)
CREATE POLICY "Users can view applicable active coupons"
ON public.coupon_codes
FOR SELECT
TO authenticated, anon
USING (
  is_active = true
  AND (
    assigned_users IS NULL
    OR lower(COALESCE((auth.jwt() ->> 'email'), '')) = ANY (
      string_to_array(lower(replace(assigned_users, ' ', '')), ',')
    )
  )
);
