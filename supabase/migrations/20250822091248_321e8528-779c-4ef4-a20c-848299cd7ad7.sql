-- Add admin policy to profiles table for administrative access
-- This allows admin users to view all profiles for user management purposes
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (get_user_admin_status(auth.uid()));

-- Add admin policy for profile management
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (get_user_admin_status(auth.uid()));

-- Ensure admins can delete profiles if needed for data management
CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (get_user_admin_status(auth.uid()));