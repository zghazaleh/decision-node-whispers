# Known Behaviors — Current State

Implicit, ordering-dependent, or fragile behaviors observed in the running code. None of these are bugs per se; they're things to know before touching the code.

## Mission run — `src/routes/mission.$id.tsx`

- **Awakening is fixed-length**. 3.6 s `setTimeout` regardless of network or asset load. The chat composer is autofocused only after `awakening` clears.
- **Synthetic opening is always seeded**. The first assistant message has `id: "opening"` and is written to `localStorage` before the user does anything. If `engine.opening.text` is missing a `<<chips: …>>` line, the first turn renders with no chips.
- **Pressure formula is `(messages.length - 1) / 18`, clamped 0..1**. It is recomputed on every `messages` change. Because the opening counts as message 1, the first user turn brings pressure to `1/18 ≈ 0.056`. The Decide pill becomes enabled at pressure ≥ 0.45, which corresponds to ~10 messages total (~5 user turns). The heartbeat synth activates at pressure ≥ 0.6 (~12 messages).
- **Decide pill opacity is `0.15 + pressureForDecide * 0.85`**. It is visually present from the start but only interactive at the threshold.
- **`detectDecisionIntent` is a small regex set, English-only**. Phrases like "I'll go with the hold" route to the Decide modal; "go with the hold" alone also matches. There is no NL classifier.
- **If decision intent is detected before the pill is ready**, a Sonner toast appears computing `turnsToGo = max(0, 4 - userTurnsCount)` — note this is hard-coded to 4 *user turns*, not pressure, and may diverge from the pressure-based pill enable.
- **Persistence on every message change**. `update({ messages })` runs on a `useEffect([messages])`. There is no debounce.
- **Replay does not reset the run** automatically. The analysis "Replay" button calls `reset()` on `useMission` then navigates back into the mission, but the ambient bed restarts and the awakening overlay replays.

## Ambient audio — `src/lib/ambient.ts`

- **Gesture-armed**. `AudioContext` is created lazily inside `ensureCtx()`; until the user produces a `pointerdown` or `keydown`, the once-listener never fires and audio stays silent. The `useEffect` cleanup removes both listeners.
- **Decoded buffer cache lives at module scope**. `bufferCache: Map<url, Promise<AudioBuffer>>` survives remounts. Failures `.delete(url)` themselves; success entries persist until reload.
- **`switchTo(missionId, fadeMs)` may race**. After `await playMission(next)`, the code re-checks `pendingMission !== missionId` and disposes the freshly created voice if it changed mid-load. Without that guard, rapid hover on `/missions` would stack voices.
- **`switchTo(null)` ramps pad gain down but leaves the LFO/sub-pad oscillators running**. They are started once and never stopped. Only the audible gain is muted.
- **Pad target gain is `min(0.06, 0.012 + pressure * 0.05)`**, so the sub-pad always has a small floor when unmuted. With pressure 0 it's 0.012; at pressure 1 it caps at 0.06.
- **Heartbeat BPM is `60 + pressure * 32`**, two thumps per beat (52 Hz then 44 Hz, fast pitch glide). When muted, it still schedules thumps but ramps `hbGain` to 0 — the timer continues firing in the background.
- **The single-oscillator sub-pad replaced an earlier two-oscillator detuned pad** (commented as "the beating read as choppy"). The `filterLfoDepthHz: 280` default likewise carries a comment that higher depth reads as pumping.

## Mission stats — `src/routes/missions.tsx`

- **Stats hover plays ambient**. On hover, `switchTo(missionId, 1400)`. On unhover, `switchTo(null, 1200)`. On click, the route navigates after a 900 ms blackout.
- **Sound preference reads localStorage *once* on render**. The IIFE `const soundOn = (() => { try {…} catch {…} })()` is not reactive — toggling sound in `/mission/$id` is mirrored back into `localStorage`, but `/missions` won't reflect the change without a remount.
- **`getAllMissionStats` errors silently**. Returned `{}` is indistinguishable from "no data".

## Voice recording — `src/lib/record-wav.ts`

- **`ScriptProcessorNode` is deprecated** in the spec but used because the AudioWorklet path would require an external module file. The function `node.connect(ctx.destination)` is needed for `onaudioprocess` to fire reliably in Safari.
- **`cancel()` does NOT return a Blob**; it just tears down the stream. Only `stop()` returns audio.
- **`stop()` resolves with an empty Blob** if called after the recorder was already cancelled. The caller must guard against `< 1 KB` payloads (the transcribe route also rejects them with 400).
- **Sample rate is fixed at 16 kHz mono**. Browser's native sample rate is downsampled by a simple averaging filter (`downsample()`), not an anti-aliased resampler.

## Analysis — `src/lib/analysis.functions.ts`

- **Stage A failure is silent**. Any throw → `archetypeId = null` → Stage B runs in "no canon" mode, which produces a model-authored timeline. The user sees no archetype label on the analysis page and no canon enforcement.
- **The model's timeline is always discarded** when an archetype was resolved; only canon beats render.
- **`AnalysisInput.missionId` defaults to `"mission-01"`**. A client that omits `missionId` will analyze any mission's transcript against mission-01's archetypes without error.

## Decision profile — `src/lib/decision-profile.ts`

- **Keyword-driven scoring**. Substring matches on English words from the analyzer output (`"calibrat"`, `"overconfid"`, `"lucky"`, `"second-order"`, etc.). A model that paraphrases ("well-calibrated" still matches via `"calibrat"`, but "even-handed assessment of confidence" would not).
- **Replay overwrites the previous contribution for the same `missionId`**. `missionsCompleted` is only incremented on the first contribution for a mission; replays do not bump it.
- **30-contribution cap**. Oldest contributions silently drop off.
- **Recency weighting is linear: `w = 1 + i * 0.25`**. The newest contribution can weigh up to ~8× the oldest at full cap.

## Error & telemetry plumbing

- **`src/lib/error-capture.ts`** registers `error` and `unhandledrejection` listeners at module import time on `globalThis`. It records the *most recent* error with a 5-second TTL. The only consumer is `consumeLastCapturedError()`, which is **not called anywhere in this codebase** — the file is dormant scaffolding.
- **`src/lib/error-page.ts`** exports `renderErrorPage()` returning a static HTML string. Also not referenced elsewhere in `src/`.
- **`src/lib/lovable-error-reporting.ts`** is wired in `src/routes/__root.tsx`'s `ErrorComponent` and reports through `window.__lovableEvents?.captureException?.` when available. If the global isn't installed by the host environment, the call is a no-op.
- **Analysis-page error boundary** (`AnalysisBoundary`) is a local class component — it intentionally does *not* call `reportLovableError`. Only the root error boundary does.

## Routing assumptions

- `/mission/$id` and `/analysis` are `ssr: false`. They rely on `window.localStorage` synchronously at mount.
- `/missions` is SSR-allowed; it does not touch `localStorage` during render (`soundOn` is a `try/catch` IIFE that defaults to `true` on the server).
- The root layout always sets a single `og:image` URL pointing at an R2 asset. Per-route `head()` does not override it.
- `useChat({ id: MISSION_ID })` namespaces hook state per mission, but the chat transport rebuilds via `useMemo([MISSION_ID])` — switching missions remounts both.
