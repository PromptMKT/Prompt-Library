-- Migration to change verified_at to TEXT to support string dates like "March 2025"
ALTER TABLE public.prompts ALTER COLUMN verified_at TYPE TEXT;
