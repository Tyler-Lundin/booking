-- Update bookings table with new columns
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS appointment_type_id uuid REFERENCES appointment_types(id),
ADD COLUMN IF NOT EXISTS attendee_count integer,
ADD COLUMN IF NOT EXISTS metadata jsonb;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_appointment_type_id ON bookings(appointment_type_id); 