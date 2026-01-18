-- Step 1: Create interests table
CREATE TABLE IF NOT EXISTS interests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent duplicate interests
    UNIQUE(from_user_id, to_user_id),
    
    -- Prevent self-interests
    CHECK (from_user_id != to_user_id)
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_interests_from_user ON interests(from_user_id);
CREATE INDEX IF NOT EXISTS idx_interests_to_user ON interests(to_user_id);
CREATE INDEX IF NOT EXISTS idx_interests_status ON interests(status);
CREATE INDEX IF NOT EXISTS idx_interests_created_at ON interests(created_at DESC);

-- Step 3: Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_interests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create trigger
CREATE TRIGGER interests_updated_at
    BEFORE UPDATE ON interests
    FOR EACH ROW
    EXECUTE FUNCTION update_interests_updated_at();

-- Step 5: Enable RLS
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Authenticated can view interests" ON interests;
DROP POLICY IF EXISTS "Authenticated can send interests" ON interests;
DROP POLICY IF EXISTS "Authenticated can update interests" ON interests;
DROP POLICY IF EXISTS "Authenticated can delete interests" ON interests;

-- Step 7: Create RLS policies
CREATE POLICY "Authenticated can view interests"
    ON interests
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated can send interests"
    ON interests
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated can update interests"
    ON interests
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated can delete interests"
    ON interests
    FOR DELETE
    TO authenticated
    USING (true);

-- Step 8: Grant permissions
GRANT ALL ON interests TO authenticated;
GRANT SELECT ON interests TO anon;
