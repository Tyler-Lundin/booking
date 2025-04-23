-- Add fingerprint column to bookings table
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS fingerprint text;

-- Add comment to explain the column
COMMENT ON COLUMN public.bookings.fingerprint IS 'Browser fingerprint for unauthenticated users to prevent spam'; 