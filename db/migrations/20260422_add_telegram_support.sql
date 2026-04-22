-- Migration: Add Telegram Support to Managers
-- Date: 2026-04-22

-- 1. Update managers table
ALTER TABLE public.managers 
ADD COLUMN telegram_chat_id BIGINT UNIQUE,
ADD COLUMN telegram_notifications_enabled BOOLEAN DEFAULT TRUE;

-- 2. Create verification codes table for linking bot
CREATE TABLE public.telegram_verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    manager_id UUID REFERENCES public.managers(id) ON DELETE CASCADE NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + interval '15 minutes') NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup during bot interaction
CREATE INDEX idx_telegram_verification_codes_code ON public.telegram_verification_codes(code);
CREATE INDEX idx_managers_telegram_chat_id ON public.managers(telegram_chat_id);

-- Enable RLS (though only service role/backend should access this directly in most cases)
ALTER TABLE public.telegram_verification_codes ENABLE ROW LEVEL SECURITY;

-- Note: Policies should be added if you plan to query this from the client-side,
-- but usually the Telegram Bot API route (backend) will handle this with a service role.
