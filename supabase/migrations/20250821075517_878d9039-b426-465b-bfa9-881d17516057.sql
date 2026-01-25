-- Enable Row Level Security on admin_users table
-- This fixes the critical security issue where policies exist but RLS is disabled
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;