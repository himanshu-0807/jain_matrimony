# 🧪 Testing Your Supabase Connection

Follow these steps to test if your Supabase database is properly connected:

## Step 1: Create Your .env File

Create a new file named `.env` in your project root (`/Users/stylecheck/Documents/matri/.env`):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

**Replace with your actual values from Supabase Dashboard → Settings → API**

---

## Step 2: Start the Development Server

```bash
npm run dev
```

---

## Step 3: Check the Browser Console

1. Open your browser to `http://localhost:5173`
2. Open Developer Tools (F12 or Right-click → Inspect)
3. Go to the **Console** tab
4. Look for one of these messages:

### ✅ Success Message:
```
🔄 Testing Supabase connection...
✅ Successfully connected to Supabase!
📊 Database is ready and accessible
```

### ❌ Error Messages:

**Missing Environment Variables:**
```
❌ Missing Supabase environment variables!
Please create a .env file with:
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```
**Solution:** Check that your `.env` file exists and has the correct variable names.

**Connection Failed:**
```
❌ Connection failed: [error message]
```
**Common Solutions:**
- Verify your Supabase URL and API key are correct
- Make sure you ran the SQL schema script in Supabase
- Check that the `users` table exists in your database
- Verify your Supabase project is active

---

## Step 4: Verify in Supabase Dashboard

1. Go to your Supabase Dashboard
2. Click on **Table Editor**
3. You should see all 7 tables:
   - ✅ users
   - ✅ profiles
   - ✅ registration_applications
   - ✅ interests
   - ✅ messages
   - ✅ profile_views
   - ✅ saved_profiles

---

## Troubleshooting

### Issue: "Missing environment variables"
- Make sure `.env` file is in the project root
- Restart the dev server after creating `.env`
- Variable names must start with `VITE_` for Vite to expose them

### Issue: "Connection failed: relation does not exist"
- You haven't run the SQL schema script yet
- Go to Supabase → SQL Editor → Run `supabase-setup.sql`

### Issue: "Invalid API key"
- Double-check you're using the `anon` key, not the `service_role` key
- Copy the key again from Supabase Dashboard

### Issue: Connection works but no success message
- Check browser console for JavaScript errors
- Make sure React app loaded correctly

---

## What Happens Behind the Scenes

The test function in `src/lib/supabase.js`:
1. Initializes Supabase client with your credentials
2. Attempts to query the `users` table
3. Logs success or error to console
4. Runs automatically when the app loads

---

## Next Steps After Successful Connection

Once you see the success message:
1. ✅ Your Supabase database is connected
2. ✅ Your environment variables are configured correctly
3. ✅ Your tables are created and accessible
4. 🎉 You're ready to start building features!

You can now proceed with:
- Creating service files for authentication
- Building profile management features
- Implementing registration flow
- Adding real-time features

---

## Need Help?

If you're still having issues:
1. Check the full error message in the console
2. Verify all steps in `SUPABASE_SETUP_GUIDE.md`
3. Make sure your Supabase project is not paused (free tier pauses after inactivity)
