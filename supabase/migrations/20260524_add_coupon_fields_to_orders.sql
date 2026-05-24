-- Add coupon_id and discount_amount columns to orders table
ALTER TABLE orders ADD COLUMN coupon_id UUID REFERENCES coupon_codes(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN discount_amount NUMERIC(10, 2) DEFAULT 0;

-- Create index on coupon_id for faster lookups
CREATE INDEX idx_orders_coupon_id ON orders(coupon_id);
