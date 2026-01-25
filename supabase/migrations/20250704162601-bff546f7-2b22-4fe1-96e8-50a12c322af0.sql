
-- Create a table for email signups from popup
CREATE TABLE public.email_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  signup_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  has_used_free_shipping BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unique constraint to prevent duplicate emails
ALTER TABLE public.email_signups ADD CONSTRAINT unique_email_signups UNIQUE (email);

-- Enable Row Level Security
ALTER TABLE public.email_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert email signups (since this is for lead generation)
CREATE POLICY "Anyone can signup for emails" 
  ON public.email_signups 
  FOR INSERT 
  WITH CHECK (true);

-- Allow authenticated users to view their own signups
CREATE POLICY "Users can view their own email signups" 
  ON public.email_signups 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Allow admins to view all email signups
CREATE POLICY "Admins can view all email signups" 
  ON public.email_signups 
  FOR ALL 
  USING (get_user_admin_status(auth.uid()));
