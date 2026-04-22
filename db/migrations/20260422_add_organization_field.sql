-- Add organization field to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS organization JSONB;

-- Comment for documentation
COMMENT ON COLUMN events.organization IS 'Stores organization details: name, logo_url, email, and phone';
