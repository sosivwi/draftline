-- Migration: Create saved_posts table for Draftline story bookmarks
-- Description: Allows authenticated users to save/bookmark articles with full RLS protection.

CREATE TABLE IF NOT EXISTS public.saved_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    post_slug TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT saved_posts_user_slug_unique UNIQUE (user_id, post_slug)
);

-- Fast lookup indexes for user bookmarks and slug checks
CREATE INDEX IF NOT EXISTS idx_saved_posts_user_id ON public.saved_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_posts_slug ON public.saved_posts(post_slug);

-- Enable Row Level Security (RLS)
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to allow safe re-runs
DROP POLICY IF EXISTS "Users can view their own saved posts" ON public.saved_posts;
DROP POLICY IF EXISTS "Users can bookmark stories" ON public.saved_posts;
DROP POLICY IF EXISTS "Users can remove their own saved stories" ON public.saved_posts;

-- RLS Policy: Users can only read their own bookmarks
CREATE POLICY "Users can view their own saved posts"
    ON public.saved_posts FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policy: Users can only insert bookmarks for their own account
CREATE POLICY "Users can bookmark stories"
    ON public.saved_posts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can only delete their own bookmarks
CREATE POLICY "Users can remove their own saved stories"
    ON public.saved_posts FOR DELETE
    USING (auth.uid() = user_id);
