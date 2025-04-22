-- Drop existing select policies
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- Create new select policy that allows viewing any booking
CREATE POLICY "Anyone can view bookings"
  ON public.bookings FOR SELECT
  USING (true); 