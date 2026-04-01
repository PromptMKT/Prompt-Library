-- ========================================================
-- WISHLIST TABLE CREATION
-- ========================================================

-- 1. Create the wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    -- Ensure each prompt can only be wishlisted once per user
    UNIQUE (user_id, prompt_id)
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS wishlist_user_id_idx ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS wishlist_prompt_id_idx ON public.wishlist(prompt_id);

-- 3. Enable RLS
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- 4. Policies
-- Users can read their own wishlist
DROP POLICY IF EXISTS "wishlist_self_read" ON public.wishlist;
CREATE POLICY "wishlist_self_read" 
ON public.wishlist FOR SELECT 
USING (auth.uid() = user_id);

-- Users can add items to their own wishlist
DROP POLICY IF EXISTS "wishlist_self_insert" ON public.wishlist;
CREATE POLICY "wishlist_self_insert" 
ON public.wishlist FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can remove items from their own wishlist
DROP POLICY IF EXISTS "wishlist_self_delete" ON public.wishlist;
CREATE POLICY "wishlist_self_delete" 
ON public.wishlist FOR DELETE 
USING (auth.uid() = user_id);
