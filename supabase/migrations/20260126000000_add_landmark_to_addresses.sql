-- Add landmark column to addresses table
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS landmark TEXT;
