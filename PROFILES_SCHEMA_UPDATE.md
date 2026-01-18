# Updated Profiles Table Schema

## New Fields Added

The profiles table has been updated with the following additional fields:

### 1. **birth_time** (TIME)
- Stores the birth time for horoscope/kundali matching
- Format: HH:MM:SS (24-hour format)
- Example: `14:30:00` for 2:30 PM
- Optional field

### 2. **birth_city** (VARCHAR 100)
- Birth city for astrological purposes
- Used for creating accurate birth charts
- Example: `"Mumbai"`, `"Delhi"`
- Indexed for faster searches

### 3. **blood_group** (VARCHAR 5)
- Blood type of the person
- Constrained to valid blood groups: `A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`
- Example: `"O+"`
- Indexed for filtering

### 4. **yearly_income** (DECIMAL 15,2)
- Numeric yearly income for precise filtering and sorting
- Stores up to 15 digits with 2 decimal places
- Example: `1500000.00` for ₹15 lakhs
- Indexed for range queries
- **Note**: `annual_income` (VARCHAR) is kept for backward compatibility

### 5. **expectations** (TEXT)
- Partner expectations and requirements
- Long text field for detailed preferences
- Example: "Looking for someone who is family-oriented, well-educated, and shares similar values..."

### 6. **contact_details** (JSONB)
- Flexible JSON field for storing various contact information
- Can include: phone, WhatsApp, email, address, etc.
- Example:
  ```json
  {
    "phone": "9876543210",
    "whatsapp": "9876543210",
    "email": "user@example.com",
    "alternate_phone": "9123456789",
    "address": "123 Main Street, Mumbai, Maharashtra 400001"
  }
  ```

---

## Complete Profiles Table Structure

```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    
    -- Basic Information
    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10),
    date_of_birth DATE NOT NULL,
    birth_time TIME,                    -- NEW
    birth_city VARCHAR(100),            -- NEW
    age INTEGER (auto-calculated),
    height_cm INTEGER,
    weight_kg INTEGER,
    blood_group VARCHAR(5),             -- NEW
    marital_status VARCHAR(20),
    
    -- Religious Information
    religion VARCHAR(50) DEFAULT 'Jain',
    caste VARCHAR(100),
    sub_caste VARCHAR(100),
    gotra VARCHAR(100),
    manglik VARCHAR(20),
    
    -- Location
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    
    -- Education & Career
    education VARCHAR(255),
    occupation VARCHAR(255),
    annual_income VARCHAR(50),
    yearly_income DECIMAL(15, 2),       -- NEW
    company_name VARCHAR(255),
    
    -- Family Information
    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    father_occupation VARCHAR(255),
    mother_occupation VARCHAR(255),
    siblings INTEGER DEFAULT 0,
    family_type VARCHAR(20),
    family_status VARCHAR(20),
    
    -- About
    about_me TEXT,
    hobbies TEXT,
    expectations TEXT,                  -- NEW
    
    -- Contact Details
    contact_details JSONB,              -- NEW
    
    -- Photos & Documents
    profile_photo_url TEXT,
    photo_urls TEXT[],
    biodata_pdf_url TEXT,
    
    -- Preferences
    partner_preferences JSONB,
    
    -- Metadata
    profile_views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);
```

---

## New Indexes Added

For optimized search performance:

```sql
CREATE INDEX idx_profiles_blood_group ON profiles(blood_group);
CREATE INDEX idx_profiles_birth_city ON profiles(birth_city);
CREATE INDEX idx_profiles_yearly_income ON profiles(yearly_income);
CREATE INDEX idx_profiles_height ON profiles(height_cm);
```

---

## Usage Examples

### Insert Profile with New Fields

```sql
INSERT INTO profiles (
    user_id, full_name, gender, date_of_birth, 
    birth_time, birth_city, blood_group, 
    yearly_income, expectations, contact_details
) VALUES (
    'user-uuid-here',
    'Rahul Shah',
    'Male',
    '1995-05-15',
    '14:30:00',                    -- 2:30 PM
    'Mumbai',
    'O+',
    1500000.00,                    -- ₹15 lakhs
    'Looking for a well-educated, family-oriented partner who values traditions',
    '{"phone": "9876543210", "whatsapp": "9876543210", "email": "rahul@example.com"}'::jsonb
);
```

### Query Examples

**Filter by blood group:**
```sql
SELECT * FROM profiles WHERE blood_group = 'O+';
```

**Filter by income range:**
```sql
SELECT * FROM profiles 
WHERE yearly_income BETWEEN 1000000 AND 2000000
ORDER BY yearly_income DESC;
```

**Filter by birth city:**
```sql
SELECT * FROM profiles WHERE birth_city = 'Mumbai';
```

**Search contact details:**
```sql
SELECT full_name, contact_details->>'phone' as phone 
FROM profiles 
WHERE contact_details->>'phone' IS NOT NULL;
```

**Filter by height range:**
```sql
SELECT * FROM profiles 
WHERE height_cm BETWEEN 165 AND 180;
```

---

## Benefits of New Fields

1. **birth_time & birth_city**: Essential for Jain matrimony where horoscope matching (kundali milan) is important
2. **blood_group**: Medical compatibility and health considerations
3. **yearly_income**: Enables precise income-based filtering and sorting
4. **expectations**: Helps users express detailed partner preferences
5. **contact_details**: Flexible JSON structure for various contact methods
6. **Indexes**: Faster search and filtering on commonly queried fields

---

## Migration Notes

If you already have data in the profiles table:
- All new fields are **optional** (nullable)
- Existing data will not be affected
- You can gradually populate new fields as users update their profiles
- The `annual_income` field is retained for backward compatibility

---

## Next Steps

1. ✅ Updated SQL schema in `supabase-setup.sql`
2. ✅ Added indexes for new fields
3. ⏳ Update frontend forms to collect new fields
4. ⏳ Update profile display components to show new information
5. ⏳ Update search/filter logic to use new fields
