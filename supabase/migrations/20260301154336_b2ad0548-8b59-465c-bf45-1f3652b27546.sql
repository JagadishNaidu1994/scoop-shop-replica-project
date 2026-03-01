
-- Fix 1: Wholesale enquiries - restrict SELECT/UPDATE to admin only
DROP POLICY IF EXISTS "Allow authenticated users to read enquiries" ON public.wholesale_enquiries;
DROP POLICY IF EXISTS "Allow authenticated users to update enquiries" ON public.wholesale_enquiries;

CREATE POLICY "Admins can view wholesale enquiries"
  ON public.wholesale_enquiries
  FOR SELECT
  USING (public.get_user_admin_status(auth.uid()));

CREATE POLICY "Admins can update wholesale enquiries"
  ON public.wholesale_enquiries
  FOR UPDATE
  USING (public.get_user_admin_status(auth.uid()))
  WITH CHECK (public.get_user_admin_status(auth.uid()));

-- Fix 2: Add search_path to all SECURITY DEFINER functions
CREATE OR REPLACE FUNCTION public.get_user_admin_status(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE user_id = check_user_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.check_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN public.get_user_admin_status(user_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  INSERT INTO public.admin_users (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_inventory_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.stock_quantity IS DISTINCT FROM NEW.stock_quantity) THEN
    INSERT INTO public.inventory_history (
      product_id, quantity_change, new_quantity, reason, notes, user_id
    ) VALUES (
      NEW.id, NEW.stock_quantity - OLD.stock_quantity, NEW.stock_quantity,
      'adjustment', 'Automatic tracking from product update', auth.uid()
    );
  ELSIF (TG_OP = 'INSERT' AND NEW.stock_quantity IS NOT NULL AND NEW.stock_quantity > 0) THEN
    INSERT INTO public.inventory_history (
      product_id, quantity_change, new_quantity, reason, notes, user_id
    ) VALUES (
      NEW.id, NEW.stock_quantity, NEW.stock_quantity,
      'initial', 'Initial stock quantity', auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Fix 3: Add search_path to non-DEFINER functions too
CREATE OR REPLACE FUNCTION public.update_subscription_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_product_page_content_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_page_content_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
