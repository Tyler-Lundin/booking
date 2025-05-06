-- Update appointment_fields table with new columns
ALTER TABLE appointment_fields
ADD COLUMN IF NOT EXISTS field_type text CHECK (field_type IN ('text', 'number', 'select', 'textarea', 'checkbox', 'radio')),
ADD COLUMN IF NOT EXISTS required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS options jsonb,
ADD COLUMN IF NOT EXISTS placeholder text;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_appointment_fields_appointment_type_id ON appointment_fields(appointment_type_id); 