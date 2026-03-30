-- ========================================================
-- SALES ANALYTICS SYNCHRONIZATION
-- ========================================================

-- 1. ENHANCED PURCHASE TRIGGER
-- Updates both the individual prompt sales AND the user's total sales
CREATE OR REPLACE FUNCTION public.handle_new_purchase()
RETURNS TRIGGER AS $$
DECLARE
    creator_uuid UUID;
BEGIN
    -- Update the specific prompt's purchase count
    UPDATE public.prompts
    SET purchases_count = COALESCE(purchases_count, 0) + 1
    WHERE id = NEW.prompt_id
    RETURNING creator_id INTO creator_uuid;

    -- Update the creator's lifetime total sales
    IF creator_uuid IS NOT NULL THEN
        UPDATE public.users
        SET total_sales = COALESCE(total_sales, 0) + 1
        WHERE id = creator_uuid;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. ONE-TIME SYNCHRONIZATION
-- Fix existing discrepancies by recalculating totals from current prompt data
UPDATE public.users u
SET total_sales = (
    SELECT COALESCE(SUM(purchases_count), 0)
    FROM public.prompts
    WHERE creator_id = u.id
);
