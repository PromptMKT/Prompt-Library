-- =====================================================================
-- ADD BIO COLUMN TO USERS TABLE
-- Run this in Supabase SQL editor to fix the edit profile feature.
-- =====================================================================

-- Add bio column if it doesn't already exist
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS bio text;

-- Ensure the username column has a unique index (it should already, but just in case)
CREATE UNIQUE INDEX IF NOT EXISTS users_username_idx ON public.users(username);
