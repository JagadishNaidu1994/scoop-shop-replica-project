-- Create wholesale_enquiries table
CREATE TABLE IF NOT EXISTS wholesale_enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_type TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  notes TEXT
);

-- Enable Row Level Security
ALTER TABLE wholesale_enquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read enquiries (for admin)
CREATE POLICY "Allow authenticated users to read enquiries"
  ON wholesale_enquiries
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy to allow service role to insert enquiries
CREATE POLICY "Allow service role to insert enquiries"
  ON wholesale_enquiries
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create policy to allow authenticated users to update enquiries (for admin)
CREATE POLICY "Allow authenticated users to update enquiries"
  ON wholesale_enquiries
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index on created_at for faster sorting
CREATE INDEX idx_wholesale_enquiries_created_at ON wholesale_enquiries(created_at DESC);
