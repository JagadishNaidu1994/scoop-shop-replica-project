-- Add RLS policies for admins to manage returns

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view all returns" ON public.returns;
DROP POLICY IF EXISTS "Admins can update returns" ON public.returns;
DROP POLICY IF EXISTS "Admins can view all return items" ON public.return_items;

-- Create policies for returns table
CREATE POLICY "Admins can view all returns"
  ON public.returns
  FOR SELECT
  USING (public.get_user_admin_status(auth.uid()));

CREATE POLICY "Admins can update returns"
  ON public.returns
  FOR UPDATE
  USING (public.get_user_admin_status(auth.uid()))
  WITH CHECK (public.get_user_admin_status(auth.uid()));

-- Create policies for return_items table
CREATE POLICY "Admins can view all return items"
  ON public.return_items
  FOR SELECT
  USING (public.get_user_admin_status(auth.uid()));
