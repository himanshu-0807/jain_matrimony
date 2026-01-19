-- Add utr_number to registration_applications
ALTER TABLE registration_applications 
ADD COLUMN utr_number VARCHAR(100);

-- Add index for utr_number
CREATE INDEX idx_registration_utr ON registration_applications(utr_number);
