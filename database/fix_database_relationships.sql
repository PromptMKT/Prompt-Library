-- ========================================================
-- DATABASE RELATIONSHIP & IDENTITY REFACTOR (FIXED)
-- ========================================================

-- 1. CLEAN UP ORPHAN CREATOR REFERENCES
UPDATE public.prompts
SET creator_id = NULL
WHERE creator_id NOT IN (SELECT id FROM public.users);

-- 2. FORMALIZE THE FOREIGN KEY
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'prompts_creator_id_fkey'
    ) THEN
        ALTER TABLE public.prompts
        ADD CONSTRAINT prompts_creator_id_fkey
        FOREIGN KEY (creator_id)
        REFERENCES public.users(id)
        ON DELETE SET NULL;
    END IF;
END $$;

-- 3. ROLE STANDARDIZATION (CONSTRAINT DROP FIRST)
DO $$
DECLARE
    constraint_name text;
BEGIN
    -- Identify the check constraint on the role column if it exists
    -- We search for any check constraint on the 'users' table that looks like it's for 'role'
    SELECT conname INTO constraint_name
    FROM pg_constraint
    WHERE conrelid = 'public.users'::regclass
      AND contype = 'c'
      AND (pg_get_constraintdef(oid) LIKE '%role%');

    -- Drop the constraint FIRST if it exists, so we can update the data
    IF constraint_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.users DROP CONSTRAINT ' || constraint_name;
    END IF;

    -- NOW update existing 'seller' roles to 'creator'
    UPDATE public.users SET role = 'creator' WHERE role = 'seller';

    -- Re-apply the updated unified constraint including 'creator'
    ALTER TABLE public.users 
    ADD CONSTRAINT users_role_check 
    CHECK (role IN ('buyer', 'creator', 'designer', 'developer', 'marketer', 'business-owner', 'other'));
END $$;

-- 4. PROMOTE EXISTING UPLOADERS
UPDATE public.users
SET role = 'creator'
WHERE id IN (SELECT DISTINCT creator_id FROM public.prompts WHERE creator_id IS NOT NULL)
AND role != 'creator';

-- 5. AUTOMATIC ROLE PROMOTION TRIGGER
CREATE OR REPLACE FUNCTION public.promote_user_to_creator()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users
    SET role = 'creator'
    WHERE id = NEW.creator_id
    AND role = 'buyer';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_prompt_uploaded_promote_user ON public.prompts;
CREATE TRIGGER on_prompt_uploaded_promote_user
AFTER INSERT ON public.prompts
FOR EACH ROW
EXECUTE FUNCTION public.promote_user_to_creator();

-- 6. IDENTITY SYNC
UPDATE public.users
SET display_name = COALESCE(display_name, username, split_part(email, '@', 1))
WHERE display_name IS NULL OR display_name = '';
