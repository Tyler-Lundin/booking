-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own availability" ON public.availability;
DROP POLICY IF EXISTS "Users can manage their own availability" ON public.availability;
DROP POLICY IF EXISTS "Anyone can view availability" ON public.availability;
DROP POLICY IF EXISTS "Only admins can modify availability" ON public.availability;

-- Create new policies
CREATE POLICY "Anyone can view availability"
  ON public.availability FOR SELECT
  USING (true);

CREATE POLICY "Only admins can modify availability"
  ON public.availability FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  ); 