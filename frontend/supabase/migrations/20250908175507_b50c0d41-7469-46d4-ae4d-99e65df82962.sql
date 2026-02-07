-- Make test-admin@gmail.com an admin user
-- Note: The user must first sign up through the app before running this
SELECT public.make_user_admin('test-admin@gmail.com');