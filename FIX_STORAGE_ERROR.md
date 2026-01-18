# Fixing Storage Upload Error - Row Level Security

## Problem
You're getting a "row-level security policy" error when trying to upload files during registration. This is because Supabase Storage has RLS enabled but no policies allow unauthenticated uploads.

## Solution

You need to add storage policies in your Supabase dashboard. Follow these steps:

---

## Step 1: Go to Storage Policies

1. Open your Supabase Dashboard
2. Click **Storage** in the left sidebar
3. Click on the **Policies** tab at the top

---

## Step 2: Add Policies for `biodata-pdfs` Bucket

### Policy 1: Allow Public Uploads

1. Click **New Policy**
2. Choose **For full customization** → **Create policy**
3. Fill in:
   - **Policy name**: `Allow public uploads to biodata-pdfs`
   - **Allowed operation**: `INSERT`
   - **Target roles**: `public`
   - **USING expression**: Leave empty (or use `true`)
   - **WITH CHECK expression**:
     ```sql
     bucket_id = 'biodata-pdfs'
     ```

4. Click **Review** → **Save policy**

### Policy 2: Allow Public Reads

1. Click **New Policy** again
2. Choose **For full customization** → **Create policy**
3. Fill in:
   - **Policy name**: `Allow public reads from biodata-pdfs`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `public`
   - **USING expression**:
     ```sql
     bucket_id = 'biodata-pdfs'
     ```

4. Click **Review** → **Save policy**

---

## Step 3: Add Policies for `profile-photos` Bucket

### Policy 1: Allow Public Uploads

1. Click **New Policy**
2. Choose **For full customization** → **Create policy**
3. Fill in:
   - **Policy name**: `Allow public uploads to profile-photos`
   - **Allowed operation**: `INSERT`
   - **Target roles**: `public`
   - **WITH CHECK expression**:
     ```sql
     bucket_id = 'profile-photos'
     ```

4. Click **Review** → **Save policy**

### Policy 2: Allow Public Reads

1. Click **New Policy** again
2. Choose **For full customization** → **Create policy**
3. Fill in:
   - **Policy name**: `Allow public reads from profile-photos`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `public`
   - **USING expression**:
     ```sql
     bucket_id = 'profile-photos'
     ```

4. Click **Review** → **Save policy**

---

## Alternative: SQL Script Method

If you prefer to use SQL, run this in the **SQL Editor**:

```sql
-- Policies for biodata-pdfs bucket
CREATE POLICY "Allow public uploads to biodata-pdfs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'biodata-pdfs');

CREATE POLICY "Allow public reads from biodata-pdfs"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'biodata-pdfs');

-- Policies for profile-photos bucket
CREATE POLICY "Allow public uploads to profile-photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'profile-photos');

CREATE POLICY "Allow public reads from profile-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');
```

---

## Step 4: Verify Policies

After adding policies:

1. Go to **Storage** → **Policies**
2. You should see 4 policies total:
   - ✅ Allow public uploads to biodata-pdfs (INSERT)
   - ✅ Allow public reads from biodata-pdfs (SELECT)
   - ✅ Allow public uploads to profile-photos (INSERT)
   - ✅ Allow public reads from profile-photos (SELECT)

---

## Step 5: Test Registration Again

1. Go back to your app at `http://localhost:5175`
2. Try registering again with biodata PDF and 5 photos
3. The upload should now work! ✅

---

## Why This Happened

- Supabase Storage has Row Level Security (RLS) enabled by default
- Without policies, **no one** can upload or read files
- During registration, users are **not authenticated** yet
- So we need to allow `public` role to upload files
- Once uploaded, anyone can read them (needed for viewing profiles)

---

## Security Note

This allows anyone to upload to these buckets. For production, you might want to:
- Add file size limits in bucket settings
- Add file type validation (already done in the app)
- Consider using authenticated uploads after user approval
- Add cleanup jobs for rejected applications

---

## Next Steps

After fixing this, your registration flow will work completely:
1. ✅ User fills registration form
2. ✅ Biodata PDF uploads to `biodata-pdfs` bucket
3. ✅ 5 photos upload to `profile-photos` bucket
4. ✅ Application saved to `registration_applications` table
5. ✅ Success message shown
6. ✅ User redirected to login

Try it now! 🚀
