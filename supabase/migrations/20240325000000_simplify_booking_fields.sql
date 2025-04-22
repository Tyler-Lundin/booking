-- Drop existing columns that we no longer need
ALTER TABLE public.bookings
DROP COLUMN IF EXISTS booking_type,
DROP COLUMN IF EXISTS number_of_attendees,
DROP COLUMN IF EXISTS special_requirements;

-- Add new columns for simplified form
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS phone_number text;

-- Update RLS policies to include new fields
CREATE POLICY "Users can view their own bookings with simplified fields"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookings with simplified fields"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings with simplified fields"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id); 