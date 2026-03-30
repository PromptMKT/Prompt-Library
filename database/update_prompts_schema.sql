-- ========================================================
-- REFINED SCHEMA UPDATE (ONLY MISSING COLUMNS)
-- ========================================================

-- 1. ADD NEW GUIDE & NOTES COLUMNS TO PROMPTS TABLE
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS quick_setup TEXT,
ADD COLUMN IF NOT EXISTS guide_steps TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS fill_variables TEXT,
ADD COLUMN IF NOT EXISTS what_to_expect TEXT,
ADD COLUMN IF NOT EXISTS pro_tips TEXT,
ADD COLUMN IF NOT EXISTS common_mistakes TEXT,
ADD COLUMN IF NOT EXISTS how_to_adapt TEXT,
ADD COLUMN IF NOT EXISTS seller_note TEXT,
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS target_audience TEXT,
ADD COLUMN IF NOT EXISTS output_format TEXT,
ADD COLUMN IF NOT EXISTS use_case_id INT REFERENCES public.use_cases(id);

-- 2. ADD SORT ORDER TO PROMPT_IMAGES (For gallery control)
ALTER TABLE public.prompt_images
ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- ---------------------------------------------------------
-- NOTE: ALL OTHER FIELDS (input_types, prompt_text, price, etc.) 
-- APPEAR TO ALREADY EXIST BASED ON THE PAGE MAPPING LOGIC.
-- ---------------------------------------------------------
