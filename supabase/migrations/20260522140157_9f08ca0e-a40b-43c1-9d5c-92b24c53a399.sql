-- Remove the broad authenticated SELECT policy that exposed sensitive columns.
DROP POLICY IF EXISTS "Users can view applicable active coupons" ON public.coupon_codes;

-- Safe helper: returns coupons available to the calling user (or anon),
-- exposing only checkout-relevant columns and pre-filtering by eligibility.
CREATE OR REPLACE FUNCTION public.get_available_coupons()
RETURNS TABLE(
  id uuid,
  code text,
  description text,
  discount_type text,
  discount_value numeric,
  minimum_order_amount numeric,
  expires_at timestamptz,
  is_active boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT c.id, c.code, c.description, c.discount_type, c.discount_value,
         c.minimum_order_amount, c.expires_at, c.is_active
  FROM public.coupon_codes c
  WHERE c.is_active = true
    AND (c.expires_at IS NULL OR c.expires_at > now())
    AND (c.max_uses IS NULL OR c.used_count < c.max_uses)
    AND (
      c.assigned_users IS NULL
      OR lower(COALESCE((auth.jwt() ->> 'email'), '')) = ANY(
        string_to_array(lower(replace(c.assigned_users, ' ', '')), ',')
      )
    );
$$;

REVOKE EXECUTE ON FUNCTION public.get_available_coupons() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_available_coupons() TO authenticated, anon;

-- Safe helper: look up a single coupon by code at checkout time.
CREATE OR REPLACE FUNCTION public.get_coupon_by_code(_code text)
RETURNS TABLE(
  id uuid,
  code text,
  description text,
  discount_type text,
  discount_value numeric,
  minimum_order_amount numeric,
  expires_at timestamptz,
  is_active boolean
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT c.id, c.code, c.description, c.discount_type, c.discount_value,
         c.minimum_order_amount, c.expires_at, c.is_active
  FROM public.coupon_codes c
  WHERE upper(c.code) = upper(_code)
    AND c.is_active = true
    AND (c.expires_at IS NULL OR c.expires_at > now())
    AND (c.max_uses IS NULL OR c.used_count < c.max_uses)
    AND (
      c.assigned_users IS NULL
      OR lower(COALESCE((auth.jwt() ->> 'email'), '')) = ANY(
        string_to_array(lower(replace(c.assigned_users, ' ', '')), ',')
      )
    );
$$;

REVOKE EXECUTE ON FUNCTION public.get_coupon_by_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_coupon_by_code(text) TO authenticated, anon;