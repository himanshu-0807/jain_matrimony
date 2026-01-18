-- Disable RLS on interests table (for table-based authentication)
ALTER TABLE interests DISABLE ROW LEVEL SECURITY;

-- OR if you want to keep RLS enabled, drop all policies and create permissive ones:

-- First, drop existing policies
DROP POLICY IF EXISTS "Users can view sent interests" ON interests;
DROP POLICY IF EXISTS "Users can send interests" ON interests;
DROP POLICY IF EXISTS "Users can update received interests" ON interests;
DROP POLICY IF EXISTS "Users can delete sent interests" ON interests;
DROP POLICY IF EXISTS "Authenticated can view interests" ON interests;
DROP POLICY IF EXISTS "Authenticated can send interests" ON interests;
DROP POLICY IF EXISTS "Authenticated can update interests" ON interests;
DROP POLICY IF EXISTS "Authenticated can delete interests" ON interests;

-- Then create permissive policies that allow all operations
CREATE POLICY "Allow all select" ON interests FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON interests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON interests FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON interests FOR DELETE USING (true);
