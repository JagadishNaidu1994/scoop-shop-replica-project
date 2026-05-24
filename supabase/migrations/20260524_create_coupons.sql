-- Create coupons table for first-time user discounts
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percentage INT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_used BOOLEAN DEFAULT FALSE,
  used_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  max_uses INT DEFAULT 1,
  times_used INT DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own coupons
CREATE POLICY "Users can view their own coupons" ON public.coupons
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to use (update) their own coupons
CREATE POLICY "Users can use their own coupons" ON public.coupons
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_coupons_user_id ON public.coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
