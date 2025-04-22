-- Create appointment_types table
CREATE TABLE IF NOT EXISTS public.appointment_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create appointment_fields table for custom fields
CREATE TABLE IF NOT EXISTS public.appointment_fields (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    appointment_type_id UUID REFERENCES public.appointment_types(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    field_type TEXT NOT NULL CHECK (field_type IN ('text', 'number', 'select', 'textarea', 'checkbox')),
    label TEXT NOT NULL,
    placeholder TEXT,
    is_required BOOLEAN DEFAULT false,
    options JSONB, -- For select fields, stores options as JSON array
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create appointment_metadata table for storing field values
CREATE TABLE IF NOT EXISTS public.appointment_metadata (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    field_id UUID REFERENCES public.appointment_fields(id) ON DELETE CASCADE,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(booking_id, field_id)
);

-- Enable RLS
ALTER TABLE public.appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for appointment_types
CREATE POLICY "Anyone can view active appointment types"
    ON public.appointment_types FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage appointment types"
    ON public.appointment_types FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create policies for appointment_fields
CREATE POLICY "Anyone can view appointment fields"
    ON public.appointment_fields FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM appointment_types
            WHERE id = appointment_type_id AND is_active = true
        )
    );

CREATE POLICY "Admins can manage appointment fields"
    ON public.appointment_fields FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create policies for appointment_metadata
CREATE POLICY "Users can view their own appointment metadata"
    ON public.appointment_metadata FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM bookings
            WHERE id = booking_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own appointment metadata"
    ON public.appointment_metadata FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM bookings
            WHERE id = booking_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can manage all appointment metadata"
    ON public.appointment_metadata FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create triggers for updated_at
CREATE TRIGGER handle_appointment_types_updated_at
    BEFORE UPDATE ON public.appointment_types
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_appointment_fields_updated_at
    BEFORE UPDATE ON public.appointment_fields
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_appointment_metadata_updated_at
    BEFORE UPDATE ON public.appointment_metadata
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert some default appointment types
INSERT INTO public.appointment_types (name, description, duration_minutes) VALUES
    ('Consultation', 'Initial consultation meeting', 30),
    ('Follow-up', 'Follow-up appointment', 15),
    ('Project Review', 'Project review and planning session', 60),
    ('Training', 'Training session', 45); 