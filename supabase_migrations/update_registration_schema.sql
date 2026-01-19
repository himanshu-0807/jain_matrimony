-- Update registration_applications to support manual form data
ALTER TABLE registration_applications 
ADD COLUMN profile_data JSONB,
ALTER COLUMN biodata_pdf_url DROP NOT NULL;

-- Add a comment for clarity
COMMENT ON COLUMN registration_applications.profile_data IS 'Captured manual form data from registration flow';
