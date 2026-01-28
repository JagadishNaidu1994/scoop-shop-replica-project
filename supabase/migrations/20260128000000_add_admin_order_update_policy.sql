-- Add policy for admins to update any order
CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  USING (public.get_user_admin_status(auth.uid()))
  WITH CHECK (public.get_user_admin_status(auth.uid()));

-- Add policy for admins to insert order tracking
CREATE POLICY "Admins can insert order tracking"
  ON public.order_tracking
  FOR INSERT
  WITH CHECK (public.get_user_admin_status(auth.uid()));

-- Add policy for admins to view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders
  FOR SELECT
  USING (public.get_user_admin_status(auth.uid()));
