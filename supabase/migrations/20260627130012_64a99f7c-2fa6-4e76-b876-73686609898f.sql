
DROP POLICY "Anyone can record a play" ON public.mission_plays;

CREATE POLICY "Anonymous plays must be well-formed"
  ON public.mission_plays FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(mission_id) BETWEEN 3 AND 64
    AND (decision_seconds IS NULL OR decision_seconds BETWEEN 0 AND 86400)
    AND (investigation_seconds IS NULL OR investigation_seconds BETWEEN 0 AND 86400)
    AND (message_count IS NULL OR message_count BETWEEN 0 AND 500)
  );
