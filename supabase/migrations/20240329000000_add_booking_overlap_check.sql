-- Create a function to check for overlapping bookings
CREATE OR REPLACE FUNCTION check_booking_overlap(
  p_embed_id text,
  p_date date,
  p_start_time time,
  p_end_time time
) RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM bookings
    WHERE embed_id = p_embed_id
      AND date = p_date
      AND status IN ('pending', 'confirmed')
      AND (
        -- Check if the new booking overlaps with an existing booking
        (p_start_time < end_time AND p_end_time > start_time)
        OR
        -- Check if the new booking is completely within an existing booking
        (p_start_time >= start_time AND p_end_time <= end_time)
        OR
        -- Check if an existing booking is completely within the new booking
        (p_start_time <= start_time AND p_end_time >= end_time)
      )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get available time slots for a given date
CREATE OR REPLACE FUNCTION get_available_time_slots(
  p_embed_id text,
  p_date date
) RETURNS TABLE (
  start_time time,
  end_time time,
  is_available boolean
) AS $$
DECLARE
  v_slot record;
BEGIN
  -- First, get all availability slots for the day
  FOR v_slot IN (
    SELECT 
      a.start_time,
      a.end_time,
      a.buffer_minutes
    FROM availability a
    WHERE a.embed_id = p_embed_id
      AND a.day_of_week = EXTRACT(DOW FROM p_date)
    ORDER BY a.start_time
  ) LOOP
    -- For each slot, check if it's available
    RETURN QUERY
    SELECT 
      v_slot.start_time,
      v_slot.end_time,
      NOT check_booking_overlap(
        p_embed_id,
        p_date,
        v_slot.start_time,
        v_slot.end_time
      ) as is_available;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 