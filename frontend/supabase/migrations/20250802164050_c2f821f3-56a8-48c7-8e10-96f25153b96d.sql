
-- Create coupon_codes table
CREATE TABLE public.coupon_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'percentage',
  discount_value NUMERIC NOT NULL,
  minimum_order_amount NUMERIC NOT NULL DEFAULT 0,
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for coupon_codes
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for coupon_codes
CREATE POLICY "Admins can manage coupon codes" 
  ON public.coupon_codes 
  FOR ALL 
  USING (get_user_admin_status(auth.uid()));

CREATE POLICY "Anyone can view active coupon codes" 
  ON public.coupon_codes 
  FOR SELECT 
  USING (is_active = true);

-- Update products table to match interface
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;

-- Update journals table to match interface  
ALTER TABLE public.journals ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

-- Update shipping_methods table to match interface
ALTER TABLE public.shipping_methods ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;

-- Create users view that can be accessed by admins
CREATE OR REPLACE VIEW public.admin_users_view AS
SELECT 
  au.id,
  p.email,
  p.first_name,
  p.last_name,
  p.phone,
  p.created_at,
  COUNT(DISTINCT o.id) as total_orders,
  COALESCE(SUM(o.total_amount), 0) as total_spent,
  COUNT(DISTINCT a.id) as addresses_count
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id  
LEFT JOIN public.orders o ON au.id = o.user_id
LEFT JOIN public.addresses a ON au.id = a.user_id
GROUP BY au.id, p.email, p.first_name, p.last_name, p.phone, p.created_at;

-- Grant access to admin users view
CREATE POLICY "Admins can view users data" 
  ON public.admin_users_view
  FOR SELECT 
  USING (get_user_admin_status(auth.uid()));

ALTER VIEW public.admin_users_view OWNER TO postgres;
