-- Drop existing check constraint
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;

-- Add new check constraint with updated status options
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pending', 'confirmed', 'cancelled', 'no-show', 'completed'));

-- Create a function to auto-archive old bookings
CREATE OR REPLACE FUNCTION public.auto_archive_bookings()
RETURNS void AS $$
BEGIN
  UPDATE public.bookings
  SET status = 'completed'
  WHERE date < CURRENT_DATE
    AND status IN ('pending', 'confirmed')
    AND status != 'completed';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to run the auto-archive function daily
CREATE OR REPLACE FUNCTION public.auto_archive_bookings_trigger()
RETURNS trigger AS $$
BEGIN
  PERFORM public.auto_archive_bookings();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to run the auto-archive function daily at midnight
CREATE OR REPLACE FUNCTION public.schedule_auto_archive()
RETURNS void AS $$
BEGIN
  PERFORM cron.schedule(
    '0 0 * * *',  -- Run at midnight every day
    'SELECT public.auto_archive_bookings()'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the scheduling function
SELECT public.schedule_auto_archive(); 