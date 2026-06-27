
## Goal

Make the `/mission/mission-03` scene feel alive instead of a still photo, and give the audio more presence and depth — without competing with the dialogue.

## Current state

- The image already has ken-burns, scene-sway, a light layer, dust, grain, vignette, mood wash, edge-darkening, and a heartbeat vignette.
- Ambient audio: only `mission-01` has a registered soundtrack. Mission-03 currently plays silently — the heartbeat synth is the *only* sound there.
- That is the root cause of "feels static": no track, and no scene-level animated atmosphere beyond slow pans.

## Visual: subtle dynamic layers (in `mission.$id.tsx` + `src/styles.css`)

Add three new low-opacity layers behind the existing gradients, all CSS-driven so they cost nothing:

1. **Atmospheric haze drift** — a very soft, large-radius radial cloud that slowly translates and scales (40–60s loop). Reads as air moving through the room.
2. **Slow chromatic breathing** — a barely-visible hue/brightness oscillation on the `<img>` filter (±3% brightness, ±2° hue, 18s sine). Pairs with ken-burns to break the "frozen frame" feel.
3. **Occasional light pulse** — a single soft warm highlight that sweeps across once every ~22s at low opacity (think distant lightning / passing headlight). Uses the mission accent token so it stays palette-correct.

Bonus: tiny pointer-driven parallax on the existing `--px/--py` vars (≤6px) on desktop only, so the scene reacts faintly to mouse movement.

All new layers respect `prefers-reduced-motion` (extend the existing `@media` block).

## Audio: register a mission-03 track and enrich the ambient bed

1. **Add a mission-03 soundtrack** in `src/lib/soundtracks.ts` — generate via ElevenLabs Music (long, slow, sub-heavy drone matching the mission's tone) and upload through `lovable-assets`. Volume around 0.30 so dialogue stays primary. This alone is the single biggest "feels less static" win.
2. **Enrich `src/lib/ambient.ts`** with a WebAudio sub-layer that's always on (very quiet) while a mission is active:
   - A slow LFO-modulated low-pass filter on the music voice (via `MediaElementAudioSourceNode` → `BiquadFilterNode`) — cutoff drifts between 800–2400 Hz on a 20s sine. Adds gentle "breathing" to the bed.
   - A second oscillator pad (two detuned sines, ~55 Hz) at very low gain that swells with `pressure`, separate from the heartbeat. Provides body without melody.
3. Both new audio elements honor mute and clean up in `stop()`.

## Technical notes

- New CSS utilities: `scene-haze`, `scene-pulse`, plus a `@keyframes chroma-breathe` applied via a new utility on the `<img>`.
- `ambient.ts` gains `ensureCtx()` usage outside the heartbeat path — wire the `<audio>` element into the graph the first time a voice is created. Guard for autoplay restrictions (already handled via `start()`).
- No changes to mission engine, prompts, or dialogue flow. Pressure curve drives the new pad gain the same way it already drives `targetVolume`.
- Files touched: `src/routes/mission.$id.tsx`, `src/styles.css`, `src/lib/ambient.ts`, `src/lib/soundtracks.ts`, `src/assets/audio/<new>.mp3.asset.json`.

## Open question

The ElevenLabs music generation needs a mood prompt. Want me to match it to mission-03's specific subject/tone (I'll read the engine file and infer), or do you have a directional cue — e.g. "cold cathedral hum", "warm rain on glass", "subterranean wind"?
