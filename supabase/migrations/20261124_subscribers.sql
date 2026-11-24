-- Migration: Create subscribers table for Draftline newsletter subscriptions
-- Description: Stores subscriber emails with unique constraints and RLS protection.

CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Fast lookup index on email for uniqueness checks
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to allow safe re-runs
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.subscribers;
DROP POLICY IF EXISTS "Service can view subscribers" ON public.subscribers;

-- RLS Policy: Anyone (guest or authenticated) can submit an email subscription
CREATE POLICY "Anyone can subscribe to newsletter"
    ON public.subscribers FOR INSERT
    WITH CHECK (true);

-- RLS Policy: Only authenticated users/service can view the subscriber list
CREATE POLICY "Service can view subscribers"
    ON public.subscribers FOR SELECT
    USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
