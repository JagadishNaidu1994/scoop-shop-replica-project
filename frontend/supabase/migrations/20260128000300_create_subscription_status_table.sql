-- Create subscription_status table to track subscription status changes
CREATE TABLE IF NOT EXISTS public.subscription_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'cancelled')),
  reason TEXT,
  paused_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscription_status_order_id ON public.subscription_status(order_id);
CREATE INDEX IF NOT EXISTS idx_subscription_status_created_at ON public.subscription_status(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscription_status_status ON public.subscription_status(status);

-- Enable RLS on subscription_status table
ALTER TABLE public.subscription_status ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own subscription statuses" ON public.subscription_status;
DROP POLICY IF EXISTS "Users can create their own subscription statuses" ON public.subscription_status;
DROP POLICY IF EXISTS "Admins can view all subscription statuses" ON public.subscription_status;
DROP POLICY IF EXISTS "Admins can manage all subscription statuses" ON public.subscription_status;

-- Policy: Users can view their own subscription statuses
CREATE POLICY "Users can view their own subscription statuses"
  ON public.subscription_status
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = subscription_status.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Policy: Users can create status changes for their own subscriptions
CREATE POLICY "Users can create their own subscription statuses"
  ON public.subscription_status
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = subscription_status.order_id
      AND orders.user_id = auth.uid()
      AND orders.is_subscription = true
    )
  );

-- Policy: Admins can view all subscription statuses
CREATE POLICY "Admins can view all subscription statuses"
  ON public.subscription_status
  FOR SELECT
  USING (public.get_user_admin_status(auth.uid()));

-- Policy: Admins can manage all subscription statuses (INSERT, UPDATE, DELETE)
CREATE POLICY "Admins can manage all subscription statuses"
  ON public.subscription_status
  FOR ALL
  USING (public.get_user_admin_status(auth.uid()))
  WITH CHECK (public.get_user_admin_status(auth.uid()));

-- Add comments for documentation
COMMENT ON TABLE public.subscription_status IS 'Tracks subscription status changes (pause, resume, cancel)';
COMMENT ON COLUMN public.subscription_status.order_id IS 'Reference to the subscription order';
COMMENT ON COLUMN public.subscription_status.status IS 'Current status: active, paused, or cancelled';
COMMENT ON COLUMN public.subscription_status.reason IS 'Reason for the status change';
COMMENT ON COLUMN public.subscription_status.paused_until IS 'Date when paused subscription should resume';
