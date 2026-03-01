-- Migration: Auth Trigger & RLS Policies
-- Run this in Supabase SQL Editor after deploying the app
--
-- What this does:
-- 1. Creates a trigger that syncs auth.users → public.users on signup
-- 2. Enables Row Level Security on the users table
-- 3. Creates RLS policies for user self-access

-- ============================================================================
-- TRIGGER: Sync auth.users → public.users on signup (safety net)
-- ============================================================================
-- The server action inserts into public.users during signup.
-- This trigger is a safety net: if the server action insert fails,
-- the trigger creates the row from auth.users metadata.
-- Uses ON CONFLICT DO UPDATE to merge data without race conditions.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, role, first_name, last_name, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'consumer')::user_role,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'display_name'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = COALESCE(EXCLUDED.first_name, public.users.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.users.last_name),
    display_name = COALESCE(EXCLUDED.display_name, public.users.display_name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop if exists to make this idempotent
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can read their own row (idempotent: drop first if exists)
DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own row (idempotent: drop first if exists)
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- ============================================================================
-- TABLE GRANTS
-- ============================================================================
-- RLS policies control which rows are visible, but the role still needs
-- base table privileges. Without these, queries return 403 before RLS runs.

GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;

-- Note: Service role clients bypass RLS by design.
-- No INSERT policy needed — the admin client (service role) handles inserts.
