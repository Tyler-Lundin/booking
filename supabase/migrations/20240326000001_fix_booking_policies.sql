-- First, disable RLS temporarily to ensure our changes take effect
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on the bookings table
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings with simplified fields" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;

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

-- Create new policies
-- Allow anyone to create bookings
CREATE POLICY "Anyone can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

-- Allow users to view their own bookings
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Allow users to update their own bookings
CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Re-enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY; 