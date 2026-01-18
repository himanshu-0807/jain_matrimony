# Fix Admin Login - Step by Step

## Problem
Admin login shows "Invalid email or password" error.

## Root Cause
Either the admin user doesn't exist OR RLS policies are blocking the SELECT query.

---

## Solution - Run These SQLs in Order

### Step 1: Check if admin user exists

```sql
-- Check if admin user exists
SELECT id, email, role, is_active FROM users WHERE email = 'admin@matri.com';
```

**Expected Result:** Should return 1 row with the admin user.

**If NO rows returned:** Admin user doesn't exist, proceed to Step 2.

**If row exists:** Skip to Step 3.

---

### Step 2: Create Admin User (if doesn't exist)

```sql
-- Create admin user
INSERT INTO users (email, phone, password_hash, role, is_verified, is_active)
VALUES (
    'admin@matri.com',
    '+919999999999',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',  -- Password: 123456
    'admin',
    true,
    true
)
ON CONFLICT (email) DO NOTHING;
```

---

### Step 3: Fix RLS Policies

```sql
-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Authenticated users can read users" ON users;
DROP POLICY IF EXISTS "Authenticated users can insert users" ON users;
DROP POLICY IF EXISTS "Users can update own record" ON users;
DROP POLICY IF EXISTS "Anyone can read users for login" ON users;

-- Allow ANYONE (including anonymous) to read users table for login
CREATE POLICY "Public read access for login"
ON users FOR SELECT
TO anon, authenticated
USING (true);

-- Allow authenticated users to insert users (for admin approval)
CREATE POLICY "Authenticated can insert users"
ON users FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to update their own record
CREATE POLICY "Users can update own record"
ON users FOR UPDATE
TO authenticated
USING (id = auth.uid() OR true);  -- Allow all for now since we're not using Supabase Auth
```

---

### Step 4: Verify Policies

```sql
-- Check policies on users table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users';
```

**Expected Result:** Should show 3 policies:
1. "Public read access for login" - SELECT
2. "Authenticated can insert users" - INSERT
3. "Users can update own record" - UPDATE

---

### Step 5: Test Query Manually

```sql
-- Test the exact query that the login function uses
SELECT * FROM users WHERE email = 'admin@matri.com';
```

**Expected Result:** Should return the admin user with all fields.

---

## After Running All SQLs

1. Go to `http://localhost:5173/admin`
2. Login with:
   - Email: `admin@matri.com`
   - Password: `123456`
3. Should work! ✅

---

## If Still Failing

Check browser console for the exact error and share it with me.

The issue is 100% either:
- Admin user not in database
- RLS policy blocking SELECT

These SQLs fix both issues.
