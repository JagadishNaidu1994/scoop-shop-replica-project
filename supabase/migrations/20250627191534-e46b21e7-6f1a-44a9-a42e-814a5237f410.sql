
-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  date_published DATE DEFAULT CURRENT_DATE,
  category TEXT,
  read_time TEXT,
  ingredients TEXT[], -- Array of ingredients
  instructions TEXT[], -- Array of instructions
  nutritional_benefits TEXT[], -- Array of benefits
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  is_published BOOLEAN DEFAULT false
);

-- Create admin_users table to manage admin access
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for recipes
-- Anyone can view published recipes
CREATE POLICY "Anyone can view published recipes" 
  ON public.recipes 
  FOR SELECT 
  USING (is_published = true);

-- Only admins can insert recipes
CREATE POLICY "Admins can insert recipes" 
  ON public.recipes 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Only admins can update recipes
CREATE POLICY "Admins can update recipes" 
  ON public.recipes 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Only admins can delete recipes
CREATE POLICY "Admins can delete recipes" 
  ON public.recipes 
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for admin_users
-- Only admins can view admin users
CREATE POLICY "Admins can view admin users" 
  ON public.admin_users 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Only admins can manage other admins
CREATE POLICY "Admins can manage admin users" 
  ON public.admin_users 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );

-- Insert a default admin user (you'll need to replace this UUID with an actual user ID after creating your admin account)
-- For now, we'll create a function to make someone admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Insert into admin_users if not already exists
  INSERT INTO public.admin_users (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;
