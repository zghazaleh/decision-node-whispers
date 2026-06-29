
-- Profiles table linked to auth users
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Decision profile (one row per user, JSONB blob)
CREATE TABLE public.decision_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  emerging_pattern text NOT NULL DEFAULT '',
  missions_completed integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.decision_profiles TO authenticated;
GRANT ALL ON public.decision_profiles TO service_role;
ALTER TABLE public.decision_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own decision profile" ON public.decision_profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER decision_profiles_updated_at BEFORE UPDATE ON public.decision_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Mission contributions (per-mission scoring rows that build the profile)
CREATE TABLE public.mission_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id text NOT NULL,
  scores jsonb NOT NULL,
  signals text[] NOT NULL DEFAULT '{}',
  notes jsonb,
  source text,
  at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, mission_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mission_contributions TO authenticated;
GRANT ALL ON public.mission_contributions TO service_role;
ALTER TABLE public.mission_contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own contributions" ON public.mission_contributions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX mission_contributions_user_at_idx ON public.mission_contributions (user_id, at);

-- Saved missions (in-progress & completed mission state)
CREATE TABLE public.saved_missions (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id text NOT NULL,
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  decision text,
  reasoning text,
  analysis jsonb,
  archetype_id text,
  confidence integer,
  started_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, mission_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_missions TO authenticated;
GRANT ALL ON public.saved_missions TO service_role;
ALTER TABLE public.saved_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own saved missions" ON public.saved_missions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER saved_missions_updated_at BEFORE UPDATE ON public.saved_missions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
