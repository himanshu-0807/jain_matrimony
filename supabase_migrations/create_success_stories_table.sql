-- Create success_stories table for admin-managed success stories
CREATE TABLE IF NOT EXISTS success_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    couple_name TEXT NOT NULL,
    story TEXT NOT NULL,
    wedding_date DATE,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_success_stories_active ON success_stories(is_active);
CREATE INDEX IF NOT EXISTS idx_success_stories_order ON success_stories(display_order);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_success_stories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER success_stories_updated_at
    BEFORE UPDATE ON success_stories
    FOR EACH ROW
    EXECUTE FUNCTION update_success_stories_updated_at();

-- Disable RLS for now (using table-based auth)
ALTER TABLE success_stories DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON success_stories TO authenticated;
GRANT SELECT ON success_stories TO anon;
