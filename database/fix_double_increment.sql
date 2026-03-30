-- ========================================================
-- NUCLEAR FIX: DROP ALL TRIGGERS ON PURCHASES
-- ========================================================

-- This script will find and drop EVERY trigger on 'purchases' 
-- No matter what its name is.

DO $$
DECLARE
    trig RECORD;
BEGIN
    FOR trig IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_table = 'purchases' 
          AND event_object_schema = 'public'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || trig.trigger_name || ' ON public.purchases;';
        RAISE NOTICE 'Dropped trigger: %', trig.trigger_name;
    END LOOP;
END $$;

-- Now re-create ONLY the one we need
CREATE OR REPLACE FUNCTION public.handle_new_purchase()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.prompts
    SET purchases_count = COALESCE(purchases_count, 0) + 1
    WHERE id = NEW.prompt_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER sync_purchase_to_dashboard
AFTER INSERT ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_purchase();


-- FIX THE CURRENT COUNT
-- This precisely syncs the count to the number of records in the purchases table
UPDATE public.prompts p
SET purchases_count = (
    SELECT count(*) 
    FROM public.purchases pur 
    WHERE pur.prompt_id = p.id
);
