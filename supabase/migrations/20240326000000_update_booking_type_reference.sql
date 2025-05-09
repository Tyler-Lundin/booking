-- Drop the existing foreign key constraint
ALTER TABLE public.bookings
DROP CONSTRAINT IF EXISTS bookings_appointment_type_id_fkey;

-- Rename the column
ALTER TABLE public.bookings
RENAME COLUMN appointment_type_id TO booking_type_id;

-- Add the new foreign key constraint
ALTER TABLE public.bookings
ADD CONSTRAINT bookings_booking_type_id_fkey
FOREIGN KEY (booking_type_id)
REFERENCES public.booking_types(id);

-- Update the index
DROP INDEX IF EXISTS idx_bookings_appointment_type_id;
CREATE INDEX IF NOT EXISTS idx_bookings_booking_type_id ON bookings(booking_type_id); 