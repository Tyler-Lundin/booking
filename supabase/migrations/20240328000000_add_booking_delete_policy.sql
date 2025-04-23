-- Add delete policy for admins on bookings table
CREATE POLICY "Admins can delete any booking"
  ON public.bookings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  ); 