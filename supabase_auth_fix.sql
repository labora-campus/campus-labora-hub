-- 1. Ensure Profiles table exists (idempotent check)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  initials TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student',
  cohort_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Drop existing function/trigger to replace them cleanly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Improved Trigger Function
-- Handles missing metadata (e.g. when creating user from Supabase Dashboard)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_initials TEXT;
BEGIN
  -- Get full name from metadata, or default to email prefix if missing
  v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  
  IF v_full_name IS NULL OR v_full_name = '' THEN
    v_full_name := split_part(NEW.email, '@', 1);
  END IF;

  -- Generate initials (First letter + First letter of second word if exists)
  IF length(v_full_name) > 0 THEN
    v_initials := upper(substr(v_full_name, 1, 1));
    IF position(' ' in v_full_name) > 0 THEN
       v_initials := v_initials || upper(substr(split_part(v_full_name, ' ', 2), 1, 1));
    END IF;
  ELSE
    v_initials := 'U';
  END IF;

  -- Insert into public.profiles
  INSERT INTO public.profiles (id, full_name, email, initials, role)
  VALUES (
    NEW.id,
    v_full_name,
    NEW.email,
    v_initials,
    'student' -- Default role is student
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error details to Postgres logs for debugging
     RAISE WARNING 'Error in handle_new_user trigger: %', SQLERRM;
     -- Start transaction rollback to ensure data consistency
     RAISE; 
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Re-create the Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
