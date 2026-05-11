-- Remove previous view (caused security definer view warning)
drop view if exists public.user_visible_coupons;

-- Re-add a tight, user-scoped SELECT policy on coupon_codes
drop policy if exists "Users can view applicable active coupons" on public.coupon_codes;
create policy "Users can view applicable active coupons"
on public.coupon_codes
for select
to authenticated
using (
  is_active = true
  and (
    assigned_users is null
    or lower(coalesce(auth.jwt() ->> 'email', '')) = any (
      string_to_array(lower(replace(assigned_users, ' ', '')), ',')
    )
  )
);

-- Column-level privileges: hide sensitive columns from regular signed-in users.
-- Admin access goes through service role / RLS ALL policy and is unaffected.
revoke select on public.coupon_codes from authenticated, anon;

grant select
  (id, code, discount_type, discount_value, minimum_order_amount,
   expires_at, description, is_active, created_at, updated_at)
on public.coupon_codes to authenticated;