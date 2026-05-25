# Adding Coupon Columns to Orders Table

## Problem
The orders table is missing `coupon_id` and `discount_amount` columns, which are required for the coupon system to work.

## Solution
Run this SQL in your Supabase dashboard:

### Steps:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project: **nastearitualsworld**
3. Click **SQL Editor** on the left
4. Click **New Query**
5. Paste this SQL:

```sql
-- Add coupon columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupon_codes(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_coupon_id ON orders(coupon_id);
```

6. Click **Run** (or press Ctrl+Enter)
7. Wait for completion

## Result
✅ Orders table will now have:
- `coupon_id` - Links to applied coupon
- `discount_amount` - Amount discounted from order
- `idx_orders_coupon_id` - Index for performance

After this, orders with coupons will be created successfully!
