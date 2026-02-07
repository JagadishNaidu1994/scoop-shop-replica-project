-- Fix critical security vulnerability in email_signups table
-- Drop the insecure policy that allows any authenticated user to view all email signups
DROP POLICY IF EXISTS "Users can view their own email signups" ON public.email_signups;

-- Create a secure policy that only allows users to view signups with their own email address
CREATE POLICY "Users can view only their email signups" 
ON public.email_signups 
FOR SELECT 
USING (
  email = (
    SELECT email 
    FROM auth.users 
    WHERE auth.users.id = auth.uid()
  )
);

-- Also ensure users can only insert signups with their own email (if authenticated)
-- Drop existing insert policy first
DROP POLICY IF EXISTS "Anyone can signup for emails" ON public.email_signups;

-- Create new insert policy that allows anyone to insert (for newsletter signup)
-- but if authenticated, must use their own email
CREATE POLICY "Email signups with validation" 
ON public.email_signups 
FOR INSERT 
WITH CHECK (
  -- Allow anonymous signups (when auth.uid() is null)
  auth.uid() IS NULL 
  OR 
  -- Or authenticated users can only use their own email
  email = (
    SELECT email 
    FROM auth.users 
    WHERE auth.users.id = auth.uid()
  )
);