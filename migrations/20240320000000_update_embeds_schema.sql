-- Add new columns
ALTER TABLE embeds
  ADD COLUMN supabase_project_id text,
  ADD COLUMN supabase_url text,
  ADD COLUMN supabase_api_key text,
  ADD COLUMN supabase_service_role_key text,
  ADD COLUMN supabase_database_url text,
  ADD COLUMN supabase_database_name text;

-- Migrate data from settings JSON to new columns
UPDATE embeds
SET 
  supabase_project_id = settings->>'supabase_project_id',
  supabase_url = settings->>'supabase_url',
  supabase_api_key = settings->>'supabase_api_key',
  supabase_service_role_key = settings->>'supabase_service_role_key',
  supabase_database_url = settings->>'supabase_database_url',
  supabase_database_name = settings->>'supabase_database_name';

-- Remove Supabase fields from settings JSON
UPDATE embeds
SET settings = settings - ARRAY[
  'supabase_project_id',
  'supabase_url',
  'supabase_api_key',
  'supabase_service_role_key',
  'supabase_database_url',
  'supabase_database_name'
];

-- Make required columns NOT NULL
ALTER TABLE embeds
  ALTER COLUMN supabase_project_id SET NOT NULL,
  ALTER COLUMN supabase_url SET NOT NULL,
  ALTER COLUMN supabase_api_key SET NOT NULL;

-- Add comments to columns
COMMENT ON COLUMN embeds.supabase_project_id IS 'The Supabase project ID';
COMMENT ON COLUMN embeds.supabase_url IS 'The Supabase project URL';
COMMENT ON COLUMN embeds.supabase_api_key IS 'The Supabase API key';
COMMENT ON COLUMN embeds.supabase_service_role_key IS 'The Supabase service role key (optional)';
COMMENT ON COLUMN embeds.supabase_database_url IS 'The Supabase database URL (optional)';
COMMENT ON COLUMN embeds.supabase_database_name IS 'The Supabase database name (optional)'; 