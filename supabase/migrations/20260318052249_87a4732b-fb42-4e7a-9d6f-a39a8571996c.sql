CREATE OR REPLACE FUNCTION public.make_user_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Only existing admins may promote others
  IF NOT public.get_user_admin_status(auth.uid()) THEN
    RAISE EXCEPTION 'Forbidden: only admins can promote users';
  END IF;

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