-- Add new columns to the bookings table
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS booking_type text,
ADD COLUMN IF NOT EXISTS number_of_attendees integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS special_requirements text;

-- Add check constraint for booking_type
ALTER TABLE public.bookings
ADD CONSTRAINT valid_booking_type 
CHECK (booking_type IN ('consultation', 'meeting', 'appointment', 'other'));

-- Add check constraint for number_of_attendees
ALTER TABLE public.bookings
ADD CONSTRAINT valid_number_of_attendees 
CHECK (number_of_attendees >= 1 AND number_of_attendees <= 10);

-- Update RLS policies to include new fields
CREATE POLICY "Users can view their own bookings with new fields"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings with new fields"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings with new fields"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id); 