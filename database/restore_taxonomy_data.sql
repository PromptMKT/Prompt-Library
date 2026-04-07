-- =============================================
-- RESTORE ORIGINAL TAXONOMY VALUES (Audiences & Outputs)
-- =============================================

-- 1. ADD DESCRIPTION COLUMN TO OUTPUTS IF IT DOESN'T EXIST
ALTER TABLE public.outputs 
ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. INSERT ORIGINAL OUTPUTS (Upsert using ON CONFLICT if name is unique)
-- Assuming 'name' is unique in the table. 
-- If not unique, we can clear the table first (TRUNCATE public.outputs CASCADE;)
INSERT INTO public.outputs (name, description) VALUES
('Long-form text', 'Articles, essays, reports, documentation'),
('Short copy', 'Emails, ads, captions, taglines'),
('Structured data', 'JSON, tables, lists, YAML, XML'),
('Code', 'Scripts, components, queries, configs'),
('Image / visual', 'Midjourney, DALL-E, FLUX, SD'),
('Audio / music', 'TTS, voice clone, song, sound effects'),
('Video', 'Sora, Runway, Kling, Veo output'),
('Conversational', 'Multi-turn, roleplay, agent dialogue'),
('Tool call / function', 'API call, function output, action'),
('Multiple outputs', 'Variations, batch results, ranked')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- 3. INSERT ORIGINAL AUDIENCES
INSERT INTO public.audiences (name) VALUES
('Designers'),
('Developers'),
('Marketers'),
('Founders'),
('Writers'),
('Students'),
('Creators'),
('Analysts'),
('Sales')
ON CONFLICT (name) DO NOTHING;
