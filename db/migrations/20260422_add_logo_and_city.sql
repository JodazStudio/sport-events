-- Migration to add logo_url and city to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS logo_url VARCHAR(255);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS city VARCHAR(100);
