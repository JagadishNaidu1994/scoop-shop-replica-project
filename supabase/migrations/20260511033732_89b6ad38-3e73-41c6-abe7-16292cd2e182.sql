drop policy if exists "Users can view applicable active coupons" on public.coupon_codes;

create or replace view public.user_visible_coupons as
select
  c.id,
  c.code,
  c.discount_type,
  c.discount_value,
  c.minimum_order_amount,
  c.expires_at,
  c.description,
  (c.assigned_users is not null) as is_personal,
  (c.max_uses is null or c.used_count < c.max_uses) as is_redeemable
from public.coupon_codes as c
where c.is_active = true
  and (
    c.assigned_users is null
    or lower(coalesce(auth.jwt() ->> 'email', '')) = any (
      string_to_array(lower(replace(c.assigned_users, ' ', '')), ',')
    )
  );

revoke all on public.user_visible_coupons from public;
grant select on public.user_visible_coupons to authenticated;