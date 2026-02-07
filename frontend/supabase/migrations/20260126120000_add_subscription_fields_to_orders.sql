-- Add subscription fields to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS is_subscription BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_frequency TEXT; -- 'weekly', 'monthly', etc.

-- Add index for faster subscription queries
CREATE INDEX IF NOT EXISTS idx_orders_is_subscription ON public.orders(is_subscription);
CREATE INDEX IF NOT EXISTS idx_orders_user_subscription ON public.orders(user_id, is_subscription);
