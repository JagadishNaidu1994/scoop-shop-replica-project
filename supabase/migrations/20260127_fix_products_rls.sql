-- Fix products table RLS policies to allow public reads for active products
-- This eliminates the expensive check_user_admin calls on every product read

-- Drop existing policies on products table
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to view products" ON products;
DROP POLICY IF EXISTS "Allow public read access to products" ON products;

-- Create simple policy for public SELECT access to active products
-- No function calls needed, just a simple column check
CREATE POLICY "Public can view active products"
ON products
FOR SELECT
TO public
USING (is_active = true);

-- Keep admin-only policies for modifications
-- Using existing check_user_admin function (this is fine for infrequent operations)
CREATE POLICY "Only admins can insert products"
ON products
FOR INSERT
TO authenticated
WITH CHECK (check_user_admin(auth.uid()));

CREATE POLICY "Only admins can update products"
ON products
FOR UPDATE
TO authenticated
USING (check_user_admin(auth.uid()));

CREATE POLICY "Only admins can delete products"
ON products
FOR DELETE
TO authenticated
USING (check_user_admin(auth.uid()));
