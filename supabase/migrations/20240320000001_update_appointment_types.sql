-- Update appointment_types table with new columns
ALTER TABLE appointment_types
ADD COLUMN IF NOT EXISTS embed_id uuid REFERENCES embeds(id),
ADD COLUMN IF NOT EXISTS price numeric(10,2),
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_appointment_types_embed_id ON appointment_types(embed_id); 