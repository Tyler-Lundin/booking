-- Drop existing policies for creating bookings
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings with simplified fields" ON public.bookings;

-- Create new policy that allows anyone to create bookings
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

-- Make user_id nullable if it's not already
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' 
    AND column_name = 'user_id' 
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.bookings
      ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;

-- Add a comment to explain the change
COMMENT ON COLUMN public.bookings.user_id IS 'Optional reference to the user who created the booking. Null for unauthenticated users.'; 