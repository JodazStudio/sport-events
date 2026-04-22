-- Migration: Fix Managers Columns and Verification Codes
-- Date: 2026-04-22

-- 1. Add missing columns to managers table
ALTER TABLE public.managers 
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'admin',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- 2. Update existing managers to have a role if missing (fallback)
UPDATE public.managers SET role = 'admin' WHERE role IS NULL;
UPDATE public.managers SET is_active = TRUE WHERE is_active IS NULL;
