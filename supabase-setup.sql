-- ============================================
-- JAIN MATRIMONY DATABASE SCHEMA
-- Supabase PostgreSQL Database Setup
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS TABLE (Authentication & Basic Info)
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Index for faster email/phone lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- ============================================
-- 2. PROFILES TABLE (Detailed User Information)
-- ============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,

    full_name VARCHAR(255) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')),
    date_of_birth DATE NOT NULL,
    birth_time TIME,
    birth_city VARCHAR(100),

    height_cm INTEGER,
    weight_kg INTEGER,
    blood_group VARCHAR(5) CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    marital_status VARCHAR(20) CHECK (marital_status IN ('Never Married', 'Divorced', 'Widowed', 'Separated')),

    religion VARCHAR(50) DEFAULT 'Jain',
    caste VARCHAR(100),
    sub_caste VARCHAR(100),
    gotra VARCHAR(100),
    manglik VARCHAR(20) CHECK (manglik IN ('Yes', 'No', 'Anshik')),

    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',

    education VARCHAR(255),
    occupation VARCHAR(255),
    annual_income VARCHAR(50),
    yearly_income DECIMAL(15, 2),
    company_name VARCHAR(255),

    father_name VARCHAR(255),
    mother_name VARCHAR(255),
    father_occupation VARCHAR(255),
    mother_occupation VARCHAR(255),
    siblings INTEGER DEFAULT 0,
    family_type VARCHAR(20) CHECK (family_type IN ('Nuclear', 'Joint')),
    family_status VARCHAR(20) CHECK (family_status IN ('Middle Class', 'Upper Middle Class', 'Rich', 'Affluent')),

    about_me TEXT,
    hobbies TEXT,
    expectations TEXT,

    contact_details JSONB,
    profile_photo_url TEXT,
    photo_urls TEXT[],
    biodata_pdf_url TEXT,
    partner_preferences JSONB,

    profile_views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id)
);

-- Indexes for faster searches
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_gender ON profiles(gender);
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_marital_status ON profiles(marital_status);
CREATE INDEX idx_profiles_blood_group ON profiles(blood_group);
CREATE INDEX idx_profiles_birth_city ON profiles(birth_city);
CREATE INDEX idx_profiles_yearly_income ON profiles(yearly_income);
CREATE INDEX idx_profiles_height ON profiles(height_cm);

-- ============================================
-- 3. REGISTRATION APPLICATIONS TABLE
-- ============================================
CREATE TABLE registration_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Contact Information
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    
    -- Uploaded Documents
    biodata_pdf_url TEXT NOT NULL,
    photo_urls TEXT[] NOT NULL, -- Array of 5 photo URLs
    
    -- Application Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES users(id),
    review_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Credentials (generated after approval)
    generated_password VARCHAR(255),
    credentials_sent BOOLEAN DEFAULT FALSE,
    credentials_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_registration_email ON registration_applications(email);
CREATE INDEX idx_registration_status ON registration_applications(status);

-- ============================================
-- 4. INTERESTS TABLE (Show Interest Feature)
-- ============================================
CREATE TABLE interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Interest Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    message TEXT,
    
    -- Timestamps
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    
    -- Prevent duplicate interests
    UNIQUE(sender_id, receiver_id)
);

-- Indexes
CREATE INDEX idx_interests_sender ON interests(sender_id);
CREATE INDEX idx_interests_receiver ON interests(receiver_id);
CREATE INDEX idx_interests_status ON interests(status);

-- ============================================
-- 5. MESSAGES TABLE (Chat/Messaging)
-- ============================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message Content
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at DESC);

-- ============================================
-- 6. PROFILE VIEWS TABLE (Track who viewed whom)
-- ============================================
CREATE TABLE profile_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_profile_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

ALTER TABLE profile_views
ADD CONSTRAINT no_self_profile_view
CHECK (viewer_id <> viewed_profile_id);

CREATE UNIQUE INDEX unique_profile_view_per_day
ON profile_views (
    viewer_id,
    viewed_profile_id,
    (CAST(viewed_at AT TIME ZONE 'UTC' AS DATE))
);

-- Indexes
CREATE INDEX idx_profile_views_viewer ON profile_views(viewer_id);
CREATE INDEX idx_profile_views_viewed ON profile_views(viewed_profile_id);

-- ============================================
-- 7. SAVED PROFILES TABLE (Shortlist/Favorites)
-- ============================================
CREATE TABLE saved_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    saved_profile_id UUID REFERENCES users(id) ON DELETE CASCADE,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    
    UNIQUE(user_id, saved_profile_id)
);

-- Indexes
CREATE INDEX idx_saved_profiles_user ON saved_profiles(user_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registration_applications_updated_at BEFORE UPDATE ON registration_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Profiles policies
CREATE POLICY "Anyone can view verified profiles" ON profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE users.id = profiles.user_id AND users.is_verified = true)
    );

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Interests policies
CREATE POLICY "Users can view interests sent to them" ON interests
    FOR SELECT USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

CREATE POLICY "Users can send interests" ON interests
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update interests they received" ON interests
    FOR UPDATE USING (auth.uid() = receiver_id);

-- Messages policies
CREATE POLICY "Users can view their messages" ON messages
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert a test admin user (password: admin123)
-- Note: In production, use proper password hashing
INSERT INTO users (email, phone, password_hash, role, is_verified, is_active)
VALUES 
    ('admin@jainmatrimony.com', '9999999999', '$2a$10$example_hash_here', 'admin', true, true);

-- ============================================
-- USEFUL QUERIES FOR REFERENCE
-- ============================================

-- Get all pending registration applications
-- SELECT * FROM registration_applications WHERE status = 'pending' ORDER BY created_at DESC;

-- Get profile with user info
-- SELECT p.*, u.email, u.phone FROM profiles p JOIN users u ON p.user_id = u.id WHERE u.is_verified = true;

-- Get all interests received by a user
-- SELECT i.*, p.full_name, p.profile_photo_url FROM interests i 
-- JOIN profiles p ON i.sender_id = p.user_id 
-- WHERE i.receiver_id = 'user_uuid' ORDER BY i.sent_at DESC;

-- Get unread messages for a user
-- SELECT m.*, p.full_name FROM messages m 
-- JOIN profiles p ON m.sender_id = p.user_id 
-- WHERE m.receiver_id = 'user_uuid' AND m.is_read = false 
-- ORDER BY m.sent_at DESC;
