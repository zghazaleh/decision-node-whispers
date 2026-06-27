
CREATE TABLE public.mission_plays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id TEXT NOT NULL,
  decision_seconds INTEGER,
  investigation_seconds INTEGER,
  message_count INTEGER,
  difficulty_rating SMALLINT CHECK (difficulty_rating BETWEEN 1 AND 5),
  completed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.mission_plays TO anon;
GRANT SELECT, INSERT ON public.mission_plays TO authenticated;
GRANT ALL ON public.mission_plays TO service_role;

ALTER TABLE public.mission_plays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record a play"
  ON public.mission_plays FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read plays"
  ON public.mission_plays FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX mission_plays_mission_id_idx ON public.mission_plays (mission_id);
