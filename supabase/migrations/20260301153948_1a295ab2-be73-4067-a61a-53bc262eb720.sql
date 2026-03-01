
-- Fix 1: Enable RLS on admin_users (policies exist but RLS is disabled)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Fix 2: Enable RLS on products (policies exist but RLS is disabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Fix 3: Restrict website-images storage to admin-only write access
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

CREATE POLICY "Admins can upload website images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'website-images' AND 
  public.get_user_admin_status(auth.uid())
);

CREATE POLICY "Admins can update website images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'website-images' AND 
  public.get_user_admin_status(auth.uid())
);

CREATE POLICY "Admins can delete website images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'website-images' AND 
  public.get_user_admin_status(auth.uid())
);
