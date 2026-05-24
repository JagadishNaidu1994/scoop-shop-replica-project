-- Create coupon_codes table for managing discount coupons
CREATE TABLE IF NOT EXISTS public.coupon_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  minimum_order_amount NUMERIC(10, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  max_uses INT,
  used_count INT DEFAULT 0,
  assigned_users TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_coupon_codes_code ON public.coupon_codes(code);
CREATE INDEX IF NOT EXISTS idx_coupon_codes_is_active ON public.coupon_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_coupon_codes_expires_at ON public.coupon_codes(expires_at);

-- Insert the 20% first-order coupon for new users
INSERT INTO public.coupon_codes (
  code,
  description,
  discount_type,
  discount_value,
  minimum_order_amount,
  is_active,
  max_uses
) VALUES (
  'WELCOME20',
  '20% off your first order',
  'percentage',
  20,
  0,
  TRUE,
  NULL
) ON CONFLICT (code) DO NOTHING;
