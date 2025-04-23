-- First, drop the existing foreign key constraint
ALTER TABLE public.bookings
DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;

-- Recreate the foreign key constraint with ON DELETE CASCADE and allowing NULL
ALTER TABLE public.bookings
ADD CONSTRAINT bookings_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id)
ON DELETE CASCADE;

-- Ensure user_id is nullable
ALTER TABLE public.bookings
ALTER COLUMN user_id DROP NOT NULL;

-- Drop and recreate the delete policy to ensure it's properly applied
DROP POLICY IF EXISTS "Admins can delete any booking" ON public.bookings;

CREATE POLICY "Admins can delete any booking"
  ON public.bookings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  ); 