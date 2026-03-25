
-- ==========================================
-- FINAL DATABASE FIX SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR
-- ==========================================

-- 1. FIX USERS TABLE (INFINITE RECURSION)
-- ------------------------------------------
DROP POLICY IF EXISTS "Public read access" ON public.users;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on auth_user_id" ON public.users;

-- Re-enable RLS just in case
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Clean, non-recursive policies
CREATE POLICY "Public read profiles" ON public.users 
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for own auth_user_id" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Enable update for own auth_user_id" ON public.users 
  FOR UPDATE USING (auth.uid() = auth_user_id);


-- 2. FIX PROMPTS TABLE (403 FORBIDDEN)
-- ------------------------------------------
DROP POLICY IF EXISTS "Public read prompts" ON public.prompts;
DROP POLICY IF EXISTS "Creators can manage own prompts" ON public.prompts;

-- Re-enable RLS
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Clean policies that don't depend on complex subqueries
CREATE POLICY "Anyone can view published prompts" ON public.prompts 
  FOR SELECT USING (is_published = true);

CREATE POLICY "Authenticated users can insert prompts" ON public.prompts 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Creators can update own prompts" ON public.prompts 
  FOR UPDATE USING (auth.uid() IN (
    SELECT auth_user_id FROM public.users WHERE id = creator_id
  ));


-- 3. FIX PROMPT STEPS & IMAGES
-- ------------------------------------------
ALTER TABLE public.prompt_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view prompt contents" ON public.prompt_steps;
DROP POLICY IF EXISTS "Anyone can view prompt images" ON public.prompt_images;

CREATE POLICY "Anyone can view prompt contents" ON public.prompt_steps FOR SELECT USING (true);
CREATE POLICY "Anyone can view prompt images" ON public.prompt_images FOR SELECT USING (true);

-- Allow authenticated users to insert detail records
CREATE POLICY "Authenticated users can insert steps" ON public.prompt_steps FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert images" ON public.prompt_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');
