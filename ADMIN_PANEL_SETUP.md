# Admin Panel Setup Guide

## Accessing the Admin Panel

The admin panel can be accessed in two ways:

### Option 1: Via Main Domain (Easiest for Development)

Simply navigate to:
```
http://localhost:5173/admin
```

This will show the admin login page.

### Option 2: Via Subdomain (Production-like)

For a production-like setup with subdomain:

1. **Edit your hosts file:**

   **Mac/Linux:**
   ```bash
   sudo nano /etc/hosts
   ```

   **Windows:**
   Open `C:\Windows\System32\drivers\etc\hosts` as Administrator

2. **Add this line:**
   ```
   127.0.0.1 admin.localhost
   ```

3. **Save and access:**
   ```
   http://admin.localhost:5173
   ```

---

## Creating an Admin User

Before you can log in to the admin panel, you need to create an admin user in Supabase.

### Step 1: Create Admin User in Supabase Auth

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Fill in:
   - Email: `admin@jainmatrimony.com` (or your preferred email)
   - Password: Create a strong password
   - Auto Confirm User: ✅ **Enable this**
4. Click **Create User**
5. **Copy the User ID** (you'll need it in the next step)

### Step 2: Add Admin Record to Users Table

Go to Supabase Dashboard → **SQL Editor** and run:

```sql
-- Replace 'YOUR_USER_ID_HERE' with the actual user ID from Step 1
INSERT INTO users (id, email, phone, password_hash, role, is_verified, is_active)
VALUES (
    'YOUR_USER_ID_HERE',  -- Paste the user ID from Auth
    'admin@jainmatrimony.com',  -- Your admin email
    '+919999999999',  -- Admin phone (can be any)
    'managed_by_supabase_auth',
    'admin',  -- This is the important part!
    true,
    true
);
```

**Important:** Make sure to replace `'YOUR_USER_ID_HERE'` with the actual UUID from Step 1!

---

## Admin Panel Features

Once logged in, you can:

### 1. **Dashboard**
- View statistics (total, pending, approved, rejected applications)
- Quick access to pending applications

### 2. **Pending Applications**
- View all pending registration applications
- Search by email or phone
- Click "Review" to open detailed view

### 3. **Review Application**
- **Left Panel:**
  - View biodata PDF (opens in new tab)
  - View all 5 uploaded photos
  - See contact information

- **Right Panel:**
  - Complete profile data entry form with all fields:
    - Basic info (name, gender, DOB, birth time/city)
    - Physical details (height, weight, blood group)
    - Religious info (caste, sub-caste, gotra, manglik)
    - Location (city, state, country)
    - Education & career
    - Family information
    - Personal information (about me, hobbies, expectations)

- **Actions:**
  - Generate secure password
  - Approve application (creates user account)
  - Reject application (with reason)

### 4. **Approval Workflow**
When you approve an application:
1. User account is created in Supabase Auth
2. User record is added to `users` table
3. Profile is created in `profiles` table
4. Application status is updated to 'approved'
5. Credentials are displayed for you to send to the user

---

## Admin Panel URLs

- **Login:** `/admin` or `http://admin.localhost:5173`
- **Dashboard:** `/admin/dashboard`
- **Pending Applications:** `/admin/applications/pending`
- **All Applications:** `/admin/applications/all`
- **Approved Applications:** `/admin/applications/approved`
- **Rejected Applications:** `/admin/applications/rejected`
- **Review Application:** `/admin/review/{application_id}`

---

## Security Notes

1. **Admin Role:** Only users with `role = 'admin'` in the `users` table can access the admin panel
2. **Authentication:** Admin panel requires login with admin credentials
3. **Password Generation:** Passwords are auto-generated securely (12 characters, mixed case, numbers, special chars)
4. **Credentials Display:** Generated passwords are shown only once after approval

---

## Troubleshooting

### "Access denied. Admin privileges required"
- Make sure you added `role = 'admin'` in the users table
- Check that the user ID matches between Auth and users table

### "Application not found"
- Verify the application exists in `registration_applications` table
- Check that you're using the correct application ID

### Subdomain not working
- Make sure you edited the hosts file correctly
- Try clearing browser cache
- Restart your browser after editing hosts file

---

## Next Steps

1. Create your admin user following the steps above
2. Log in to the admin panel
3. Review and approve pending applications
4. Send credentials to approved users via Email/WhatsApp

---

## Production Deployment

For production:
1. Set up actual subdomain DNS (admin.yourdomain.com)
2. Configure your hosting to route admin subdomain to the app
3. Update environment variables for production Supabase
4. Implement email/WhatsApp notifications for approved users
