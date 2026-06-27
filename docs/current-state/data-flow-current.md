# Data Flow — Current State

End-to-end paths in the running code. Everything user-specific is in `localStorage`; community telemetry is the only server-side store.

## State locations

| Concern | Where | Notes |
| --- | --- | --- |
| Active mission id | `localStorage["decision-node:active-mission"]` | Written on every `writeMission`. Read by `readMission()` when no id is passed. |
| Per-mission save | `localStorage["decision-node:mission:<id>"]` | `SavedMission`: messages, startedAt, decision?, reasoning?, analysis?, decidedAt?, archetypeId?, confidence?. |
| Decision profile | `localStorage["decision-node:profile"]` | Single `DecisionProfile` across all missions. |
| Sound toggle | `localStorage["dn:sound"]` | `"on"` or `"off"`. |
| Mission play telemetry | Lovable Cloud table `mission_plays` | Server-side, no PII; columns enumerated below. |
| Server-side session | — | None. Each chat turn re-posts the full transcript. |

## A mission run, turn by turn

1. **Mount** `/mission/$id` (`src/routes/mission.$id.tsx`).
   - `getMissionEngine(id)` resolves the engine; missing → `navigate({to:"/missions"})`.
   - `Mission` is keyed on `id` so switching missions remounts.
   - 3.6 s eyelid awakening overlay.
   - `useMission(id)` reads `SavedMission` from `localStorage`.
   - `initialMessages` is seeded once: saved messages if any, else `[OPENING]` where `OPENING` is built from `engine.opening.text`.
   - On first mount with no saved messages, the synthetic opening is written to `localStorage` immediately.
   - `useChat({ id, messages: initialMessages, transport: DefaultChatTransport({ api: "/api/chat", body: { missionId } }) })` from `@ai-sdk/react`.
   - Ambient: `createAmbient(MISSION_ID)`, then `setAudioProfile(engine.atmosphere)`. Audio is armed on the first `pointerdown`/`keydown` gesture, gated by `soundOn`.
2. **Player input** → `submit(text)`:
   - `detectDecisionIntent(text)` runs a small regex set. If it matches AND `decideReady` (pressure ≥ 0.45, not busy), opens the Decide modal pre-filled with the matched object. If it matches but the moment isn't ripe, shows a Sonner toast.
   - Otherwise: `sendMessage({ text })` posts the full `messages` array + `{ missionId }` to `/api/chat`.
3. **Server** (`/api/chat`): resolves engine, defaults to `mission-01` on missing/non-string id, returns 400 for unknown id. `streamText({ model: gateway("google/gemini-3-flash-preview"), system: engine.systemPrompt, temperature: 0.85, messages: convertToModelMessages(messages) })`. Stream is returned as `toUIMessageStreamResponse({ originalMessages: messages })`.
4. **Stream** is consumed by `useChat`. Every change to `messages` triggers a `useEffect` that calls `update({ messages })`, persisting to `localStorage`. Pressure is recomputed (`(messages.length - 1) / 18`, clamped 0..1). Pressure ≥ 0.6 toggles the heartbeat synth on.
5. **Voice input** (optional):
   - `MicButton` calls `startRecording()` from `record-wav.ts`.
   - On stop, posts a multipart form with field `file` (a WAV `Blob`) to `/api/transcribe`.
   - Server forwards to `https://ai.gateway.lovable.dev/v1/audio/transcriptions` with `model=openai/gpt-4o-mini-transcribe`, proxies the JSON.
   - The client appends `text` into the composer textarea (it does **not** auto-send).
6. **Commit** — *Decide* modal opens (either via the pill or via decision-intent detection):
   - Player selects a preset or free-writes; sets a confidence slider 0..100. Optional reasoning textarea.
   - `handleDecide(decision, reasoning, archetypeId?, confidence?)`:
     - Maps current `messages` → `[{ role, text }]` via `partsToText` (concatenates `parts` of type `"text"`).
     - Calls the `analyzeDecision` server function with the transcript, decision, reasoning, optional archetypeId/confidence, and missionId.
     - On success: `update({ decision, reasoning, analysis, decidedAt, archetypeId?, confidence? })` → persisted.
     - `updateProfileWithAnalysis(missionId, analysis)` → updates `localStorage["decision-node:profile"]`. Wrapped in try/catch; failure logs but doesn't block.
     - Fire-and-forget `recordMissionPlay({ missionId, investigationSeconds, decisionSeconds, messageCount, completed: true })` — see telemetry below.
     - 600 ms dramatic pause, then `navigate({to:"/analysis"})`.
7. **/analysis** mounts:
   - `readMission()` (no arg) → uses `ACTIVE_KEY` to find the just-saved mission.
   - If `mission.analysis` is absent, redirects to `/`.
   - Fires `getMissionPercentile({ missionId, investigationSeconds: decidedAt - startedAt })` for the community comparison card (only shown when `percentile.plays >= 3`).
   - Renders sections (see `decision-analysis-current.md`).

## Server functions vs server routes

- **Server functions** (`createServerFn`, called via `useServerFn` on the client):
  - `analyzeDecision` (`src/lib/analysis.functions.ts`) — POST, runs Stage A + B.
  - `getAllMissionStats` (`src/lib/mission-stats.functions.ts`) — GET, used by `/missions` via TanStack Query (`staleTime: 60_000`).
  - `recordMissionPlay` — POST, fire-and-forget telemetry.
  - `getMissionPercentile` — POST, used by `/analysis`.

- **Server routes** (`createFileRoute(...).server.handlers`):
  - `/api/chat` — streaming chat completion. POST only.
  - `/api/transcribe` — multipart proxy to the transcription endpoint. POST only.

Both server-function modules import `@/lib/ai-gateway.server` or `@supabase/supabase-js` directly. They read `process.env.LOVABLE_API_KEY`, `process.env.SUPABASE_URL`, `process.env.SUPABASE_PUBLISHABLE_KEY` inside the handler (not at module top level).

## Telemetry — `mission_plays`

- Inserted by `recordMissionPlay`, queried by `getAllMissionStats` and `getMissionPercentile`.
- Columns referenced in code: `mission_id`, `decision_seconds`, `investigation_seconds`, `message_count`, `difficulty_rating`, `completed`.
- Supabase client uses the publishable key with `persistSession: false`. No auth; RLS policies on the table govern read/write.
- Aggregates computed in TypeScript, not SQL: per-mission averages of decision/investigation seconds (rounded), difficulty rating average (1 dp), completion rate as `completed/total`, plays count.
- `getMissionPercentile` returns `investigationPercentile = (#plays with value < yours) / totalPlays * 100`, rounded. `decisionPercentile` only if the caller passed `decisionSeconds`.

### Assumptions

- The `mission_plays` table exists with those columns and a policy allowing `INSERT` and `SELECT` with the publishable key. (Confirmed by the code making the calls; the migration file is not inspected here.)
- Timings are clamped client-side: `Math.max(0, Math.round((now - start) / 1000))`. Server-side Zod caps at `86400` seconds.

### Fragile / implicit behavior

- Replays of the same mission insert **new** rows; there is no per-user dedup (and no per-user concept). `plays` will inflate with re-runs.
- `messageCount` in telemetry is the total `messages.length` at commit, including the synthetic opening, *not* user turns.
- `investigationSeconds` is the entire wall-clock from mount to commit, including idle time, paused tabs, walk-aways.
- `getAllMissionStats` returns `{}` on any Supabase error — the `/missions` UI then renders `"—"` for every stat column, indistinguishable from "no data yet".

### Risks if changed

- Renaming any of the four `localStorage` keys orphans existing user data with no migration.
- Removing the synthetic opening from `messages` would shift `pressure` (which divides by 18 of `messages.length - 1`) and shift `messageCount` telemetry retroactively for new plays.
- Adding write paths that bypass `writeMission()` will silently desync `ACTIVE_KEY`.
