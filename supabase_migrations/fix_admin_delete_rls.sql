-- Fix RLS for admin delete operations

-- Check current RLS status
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('users', 'profiles');

-- Option 1: Disable RLS on users and profiles tables (simplest for table-based auth)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled, create permissive delete policies

-- For users table
DROP POLICY IF EXISTS "Allow all delete" ON users;
CREATE POLICY "Allow all delete" ON users FOR DELETE USING (true);

-- For profiles table  
DROP POLICY IF EXISTS "Allow all delete" ON profiles;
CREATE POLICY "Allow all delete" ON profiles FOR DELETE USING (true);
