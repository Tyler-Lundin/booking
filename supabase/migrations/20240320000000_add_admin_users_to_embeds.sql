-- Add admin_users column to embeds table
ALTER TABLE embeds
ADD COLUMN admin_users JSONB DEFAULT '[]'::jsonb;

-- Add comment to explain the column
COMMENT ON COLUMN embeds.admin_users IS 'Array of user IDs who have admin access to this embed';

-- Create an index for better query performance
CREATE INDEX idx_embeds_admin_users ON embeds USING GIN (admin_users); 