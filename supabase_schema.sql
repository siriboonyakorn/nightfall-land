-- ==========================================================================
-- NIGHT FALL LAND - Supabase Database Schema (Idempotent / Safe to re-run)
-- ==========================================================================

-- 1. Create Player Profiles Table
CREATE TABLE IF NOT EXISTS public.player_profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar TEXT DEFAULT '🌙',
  current_region TEXT DEFAULT 'Darkwood',
  current_level INT DEFAULT 1,
  unlocked_levels INT[] DEFAULT ARRAY[1],
  moon_shards INT DEFAULT 0,
  score INT DEFAULT 0,
  settings JSONB DEFAULT '{"masterVolume": 0.8, "sfxVolume": 0.75, "bgmVolume": 0.5}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they already exist (avoids "already exists" errors)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.player_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.player_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.player_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.player_profiles;

-- 4. Re-create Policies
CREATE POLICY "Users can view their own profile"
ON public.player_profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.player_profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.player_profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 5. Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_player_profile_updated ON public.player_profiles;
CREATE TRIGGER on_player_profile_updated
  BEFORE UPDATE ON public.player_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
