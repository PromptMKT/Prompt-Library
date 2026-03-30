-- ========================================================
-- COMPREHENSIVE PURCHASE & DASHBOARD SYNC (FINAL VERSION)
-- ========================================================

-- 1. ENSURE PROMPTS TABLE HAS STAT COLUMNS
-- (Safe to run if they already exist)
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS purchases_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(3,2) DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0;

-- 2. ENSURE PURCHASES TABLE HAS ALL REQUIRED COLUMNS
-- (Matches your verified schema)
ALTER TABLE public.purchases 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS prompt_id UUID REFERENCES public.prompts(id),
ADD COLUMN IF NOT EXISTS amount_paid NUMERIC DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD'::text,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS platform_fee NUMERIC,
ADD COLUMN IF NOT EXISTS seller_payout NUMERIC,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed'::text,
ADD COLUMN IF NOT EXISTS is_free_claim BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS purchased_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 3. ENSURE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS purchases_prompt_id_idx ON public.purchases(prompt_id);

-- 4. UNIQUE CONSTRAINT (One purchase per user/prompt)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'purchases_user_prompt_unique'
    ) THEN
        ALTER TABLE public.purchases ADD CONSTRAINT purchases_user_prompt_unique UNIQUE (user_id, prompt_id);
    END IF;
END $$;

-- 5. AUTOMATIC DASHBOARD UPDATES
-- Increments the sales count on the prompt whenever a new purchase record is added
CREATE OR REPLACE FUNCTION public.handle_new_purchase()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.prompts
    SET purchases_count = purchases_count + 1
    WHERE id = NEW.prompt_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger setup
DROP TRIGGER IF EXISTS on_purchase_inserted ON public.purchases;
CREATE TRIGGER on_purchase_inserted
AFTER INSERT ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_purchase();

-- 6. CLEANUP EXISTING NULLS
-- Ensures existing prompts start with 0 instead of NULL
UPDATE public.prompts SET purchases_count = 0 WHERE purchases_count IS NULL;
UPDATE public.prompts SET average_rating = 0.0 WHERE average_rating IS NULL;
UPDATE public.prompts SET review_count = 0 WHERE review_count IS NULL;

-- 7. ENABLE RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- 8. POLICIES (Matches your verified set)
DROP POLICY IF EXISTS "purchases_self_read" ON public.purchases;
CREATE POLICY "purchases_self_read" 
ON public.purchases FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "purchases_self_insert" ON public.purchases;
CREATE POLICY "purchases_self_insert" 
ON public.purchases FOR INSERT 
WITH CHECK (auth.uid() = user_id);
