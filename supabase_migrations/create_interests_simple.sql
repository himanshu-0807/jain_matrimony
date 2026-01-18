-- Simple interests table creation (no RLS for now)
CREATE TABLE interests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    from_user_id UUID NOT NULL,
    to_user_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign keys
ALTER TABLE interests 
ADD CONSTRAINT fk_from_user 
FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE interests 
ADD CONSTRAINT fk_to_user 
FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add constraints
ALTER TABLE interests 
ADD CONSTRAINT unique_interest UNIQUE(from_user_id, to_user_id);

ALTER TABLE interests 
ADD CONSTRAINT no_self_interest CHECK (from_user_id != to_user_id);

ALTER TABLE interests 
ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'rejected'));

-- Create indexes
CREATE INDEX idx_interests_from_user ON interests(from_user_id);
CREATE INDEX idx_interests_to_user ON interests(to_user_id);
CREATE INDEX idx_interests_status ON interests(status);
CREATE INDEX idx_interests_created_at ON interests(created_at DESC);
