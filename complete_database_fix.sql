
-- ========================================================
-- ABSOLUTE FINAL DATABASE FIX SCRIPT (ALL-IN-ONE)
-- ========================================================

-- 1. FIX USERS TABLE (No more recursion)
DROP POLICY IF EXISTS "Public read profiles" ON public.users;
DROP POLICY IF EXISTS "Enable insert for own auth_user_id" ON public.users;
DROP POLICY IF EXISTS "Enable update for own auth_user_id" ON public.users;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Enable insert for own auth_user_id" ON public.users FOR INSERT WITH CHECK (auth.uid() = auth_user_id);
CREATE POLICY "Enable update for own auth_user_id" ON public.users FOR UPDATE USING (auth.uid() = auth_user_id);

-- 2. FIX PROMPTS TABLE (No more 403 Forbidden)
DROP POLICY IF EXISTS "Anyone can view published prompts" ON public.prompts;
DROP POLICY IF EXISTS "Authenticated users can insert prompts" ON public.prompts;
DROP POLICY IF EXISTS "Creators can update own prompts" ON public.prompts;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published prompts" ON public.prompts FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can insert prompts" ON public.prompts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Creators can update own prompts" ON public.prompts FOR UPDATE USING (auth.uid() IN (SELECT auth_user_id FROM public.users WHERE id = creator_id));

-- 3. FIX PROMPT STEPS
DROP POLICY IF EXISTS "Anyone can view contents" ON public.prompt_steps;
DROP POLICY IF EXISTS "Auth users can insert contents" ON public.prompt_steps;
ALTER TABLE public.prompt_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view contents" ON public.prompt_steps FOR SELECT USING (true);
CREATE POLICY "Auth users can insert contents" ON public.prompt_steps FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 4. FIX PROMPT IMAGES (THE CURRENT BLOCKER)
DROP POLICY IF EXISTS "Anyone can view images" ON public.prompt_images;
DROP POLICY IF EXISTS "Auth users can insert images" ON public.prompt_images;
ALTER TABLE public.prompt_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view images" ON public.prompt_images FOR SELECT USING (true);
CREATE POLICY "Auth users can insert images" ON public.prompt_images FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. FIX USE CASES (Just in case)
ALTER TABLE public.use_cases ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view use cases" ON public.use_cases;
DROP POLICY IF EXISTS "Auth users can insert custom use cases" ON public.use_cases;
CREATE POLICY "Anyone can view use cases" ON public.use_cases FOR SELECT USING (true);
CREATE POLICY "Auth users can insert custom use cases" ON public.use_cases FOR INSERT WITH CHECK (auth.role() = 'authenticated');
