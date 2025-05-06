-- Update embeds table with new columns
ALTER TABLE embeds
ADD COLUMN IF NOT EXISTS industry text CHECK (industry IN ('barbershop', 'tattoo', 'optometry', 'dental', 'custom')),
ADD COLUMN IF NOT EXISTS timezone text,
ADD COLUMN IF NOT EXISTS theme text; 