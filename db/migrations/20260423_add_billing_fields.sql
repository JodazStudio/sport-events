-- Migration: Add service_fee and settlement fields to registration_stages
-- Date: 2026-04-23

ALTER TABLE public.registration_stages 
ADD COLUMN IF NOT EXISTS service_fee DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS is_settled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS settled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS start_date DATE,
ADD COLUMN IF NOT EXISTS end_date DATE;

-- Comment for documentation
COMMENT ON COLUMN public.registration_stages.service_fee IS 'Platform commission fee in USD per registration';
COMMENT ON COLUMN public.registration_stages.is_settled IS 'Whether the commission for this stage has been settled/paid to the platform';
COMMENT ON COLUMN public.registration_stages.settled_at IS 'Timestamp when the stage was marked as settled';
COMMENT ON COLUMN public.registration_stages.start_date IS 'Start date of the registration stage';
COMMENT ON COLUMN public.registration_stages.end_date IS 'End date of the registration stage';
