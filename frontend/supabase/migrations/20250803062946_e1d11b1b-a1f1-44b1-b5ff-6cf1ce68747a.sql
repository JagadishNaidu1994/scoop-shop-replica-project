
-- Create coupon_codes table
CREATE TABLE public.coupon_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL CHECK (discount_value > 0),
  minimum_order_amount numeric NOT NULL DEFAULT 0,
  max_uses integer NULL,
  used_count integer NOT NULL DEFAULT 0,
  expires_at timestamp with time zone NULL,
  is_active boolean NOT NULL DEFAULT true,
  description text NULL,
  assigned_users text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by uuid NULL
);

-- Create coupon_usage table to track individual user usage
CREATE TABLE public.coupon_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  coupon_id uuid NOT NULL REFERENCES public.coupon_codes(id) ON DELETE CASCADE,
  used_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, coupon_id)
);

-- Create user_coupons table for assigned coupons
CREATE TABLE public.user_coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  coupon_id uuid NOT NULL REFERENCES public.coupon_codes(id) ON DELETE CASCADE,
  is_used boolean NOT NULL DEFAULT false,
  used_at timestamp with time zone NULL,
  assigned_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, coupon_id)
);

-- Enable RLS
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coupon_codes
CREATE POLICY "Anyone can view active coupons" ON public.coupon_codes
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage coupons" ON public.coupon_codes
  FOR ALL USING (get_user_admin_status(auth.uid()));

-- RLS Policies for coupon_usage
CREATE POLICY "Users can view their own coupon usage" ON public.coupon_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupon usage" ON public.coupon_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coupon usage" ON public.coupon_usage
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all coupon usage" ON public.coupon_usage
  FOR ALL USING (get_user_admin_status(auth.uid()));

-- RLS Policies for user_coupons
CREATE POLICY "Users can view their assigned coupons" ON public.user_coupons
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their assigned coupons" ON public.user_coupons
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage user coupons" ON public.user_coupons
  FOR ALL USING (get_user_admin_status(auth.uid()));
