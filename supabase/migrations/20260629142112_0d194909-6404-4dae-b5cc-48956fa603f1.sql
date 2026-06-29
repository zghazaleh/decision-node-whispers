ALTER TABLE public.mission_plays ADD COLUMN IF NOT EXISTS archetype_id text;
CREATE INDEX IF NOT EXISTS idx_mission_plays_mission_archetype ON public.mission_plays (mission_id, archetype_id);