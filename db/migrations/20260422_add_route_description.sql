-- Migration: Add route_description to events table
-- Created: 2026-04-22

ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS route_description TEXT;

-- Update existing comments or documentation if any
COMMENT ON COLUMN public.events.route_description IS 'Detailed description of the event route/circuit';
