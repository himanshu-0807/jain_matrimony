# Supabase Database Setup Guide

## Quick Start Guide

This guide will help you set up Supabase database for your Jain Matrimony application.

---

## Step 1: Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (free tier available)
3. Click "New Project"
4. Fill in project details:
   - **Name**: jain-matrimony (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start
5. Click "Create new project" and wait 2-3 minutes for setup

---

## Step 2: Get Your API Credentials

1. Once project is created, go to **Settings** (gear icon) → **API**
2. You'll see:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **Project API keys**:
     - `anon` `public` key (safe to use in browser)
     - `service_role` key (keep secret! server-side only)

3. **Copy these values** - you'll need them in Step 4

---

## Step 3: Create Database Tables

### Option A: Using SQL Editor (Recommended)

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open the file `supabase-setup.sql` from your project
4. Copy the **entire contents** of the file
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl/Cmd + Enter)
7. Wait for "Success. No rows returned" message

### Option B: Using Table Editor (Manual)

If you prefer a visual approach, you can create tables manually:
1. Click **Table Editor** (left sidebar)
2. Click **New table**
3. Create each table following the schema in `supabase-setup.sql`

> **Recommendation**: Use Option A (SQL Editor) - it's faster and ensures all indexes, triggers, and policies are set up correctly.

---

## Step 4: Set Up Storage Buckets

1. Click **Storage** (left sidebar)
2. Click **New bucket**
3. Create first bucket:
   - **Name**: `biodata-pdfs`
   - **Public bucket**: ✅ Yes (so files can be accessed via URL)
   - Click **Create bucket**

4. Create second bucket:
   - **Name**: `profile-photos`
   - **Public bucket**: ✅ Yes
   - Click **Create bucket**

### Configure Storage Policies

For each bucket, set up access policies:

1. Click on the bucket name
2. Go to **Policies** tab
3. Click **New policy**
4. Choose **For full customization** → **Create policy**

**For `biodata-pdfs` bucket:**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload biodata"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'biodata-pdfs');

-- Allow public to read
CREATE POLICY "Public can read biodata"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'biodata-pdfs');
```

**For `profile-photos` bucket:**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'profile-photos');

-- Allow public to read
CREATE POLICY "Public can read photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');
```

---

## Step 5: Configure Your Application

### 5.1 Create Environment File

In your project root (`/Users/stylecheck/Documents/matri/`), create a file named `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

**Replace** `your-project-id` and `your-anon-public-key-here` with your actual values from Step 2.

### 5.2 Update .gitignore

Make sure `.env` is in your `.gitignore` file to prevent committing secrets:

```bash
# Add to .gitignore
.env
.env.local
.env.*.local
```

### 5.3 Install Supabase Client

Run this command in your terminal:

```bash
npm install @supabase/supabase-js
```

---

## Step 6: Verify Setup

### Check Tables

1. Go to **Table Editor** in Supabase
2. You should see 7 tables:
   - ✅ users
   - ✅ profiles
   - ✅ registration_applications
   - ✅ interests
   - ✅ messages
   - ✅ profile_views
   - ✅ saved_profiles

### Check Storage

1. Go to **Storage** in Supabase
2. You should see 2 buckets:
   - ✅ biodata-pdfs
   - ✅ profile-photos

### Test Connection

Create a test file `test-connection.js` in your project:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Test query
const testConnection = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('count');
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('✅ Connected successfully!');
  }
};

testConnection();
```

Run: `node test-connection.js`

---

## Step 7: Create Test User (Optional)

To test login functionality:

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Fill in:
   - **Email**: test@example.com
   - **Password**: Test123!
   - **Auto Confirm User**: ✅ Yes
4. Click **Create user**

Now you can use these credentials to test the login page.

---

## Common Issues & Solutions

### Issue: "relation does not exist"
**Solution**: Make sure you ran the entire SQL script in Step 3.

### Issue: "Invalid API key"
**Solution**: Double-check your `.env` file has the correct `anon` key (not the `service_role` key).

### Issue: "Storage bucket not found"
**Solution**: Verify bucket names are exactly `biodata-pdfs` and `profile-photos` (case-sensitive).

### Issue: "Row Level Security policy violation"
**Solution**: Make sure RLS policies were created by the SQL script. Check in SQL Editor.

---

## Next Steps

Once setup is complete:

1. ✅ Database tables created
2. ✅ Storage buckets configured
3. ✅ Environment variables set
4. ✅ Supabase client installed

You're ready to proceed with the implementation! The next phase will involve:
- Creating service files to interact with the database
- Updating React components to use real data
- Implementing authentication flow
- Connecting registration form to database

---

## Useful Supabase Dashboard Links

- **Table Editor**: View and edit data
- **SQL Editor**: Run custom queries
- **Authentication**: Manage users
- **Storage**: View uploaded files
- **API Docs**: Auto-generated API documentation
- **Logs**: Debug errors and monitor activity

---

## Security Best Practices

1. ✅ **Never commit** `.env` file to Git
2. ✅ **Use `anon` key** in frontend code only
3. ✅ **Keep `service_role` key** secret (server-side only)
4. ✅ **Enable RLS** on all tables (already done in SQL script)
5. ✅ **Validate user input** before database operations
6. ✅ **Use prepared statements** (Supabase does this automatically)

---

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Discord**: https://discord.supabase.com
- **SQL Reference**: https://supabase.com/docs/guides/database

---

**You're all set!** 🎉

Once you confirm the setup is complete, I can proceed with creating the service files and integrating the database with your application.
