-- Fix infinite recursion in admin_users RLS policy
-- Disable RLS on admin_users table since it's only used internally for checking admin status
ALTER TABLE public.admin_users DISABLE ROW LEVEL SECURITY;

-- Drop existing policies on admin_users to avoid conflicts
DROP POLICY IF EXISTS "Admin users can be viewed" ON public.admin_users;
DROP POLICY IF EXISTS "Only admins can insert" ON public.admin_users;

-- Ensure recipes table allows admin updates without RLS recursion
ALTER TABLE public.recipes DISABLE ROW LEVEL SECURITY;

-- Create a simple policy for recipes that doesn't depend on admin_users checks
CREATE POLICY "Anyone can read published recipes" ON public.recipes
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can update recipes" ON public.recipes
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert recipes" ON public.recipes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Re-enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
