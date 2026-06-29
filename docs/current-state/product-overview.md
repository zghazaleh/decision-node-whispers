# Product Overview — Current State

Snapshot of what the Decision Nodes MVP *is today*, as built. Companion: `docs/architecture/` (design intent) — when the two disagree, this folder describes the code.

## What the product does

A short-form, single-decision interactive drama. The player wakes up inside a stranger's life with no context, investigates by speaking with characters and inspecting the room, then commits to one irreversible decision. The system then analyzes the *process* of that decision (not its rightness) and feeds a long-lived "Decision Profile" stored on the device.

There are four shipped missions, all under `src/lib/missions/mission-0X/` and registered in `src/lib/missions/registry.ts`:

| id           | codename     | logline (truncated)                                                            | source                                |
| ------------ | ------------ | ------------------------------------------------------------------------------ | ------------------------------------- |
| `mission-01` | The Release  | Twelve minutes before the boardroom. The model is ready. The memo is not.       | `src/lib/missions/mission-01/`        |
| `mission-02` | Black Site   | You are the prosecutor's last witness. You no longer remember which side…       | `src/lib/missions/mission-02/`        |
| `mission-03` | Lazarus      | The capsule is six hours from re-entry. The pilot has been dead for nine.       | `src/lib/missions/mission-03/`        |
| `mission-04` | The Vote     | A senator on the night of a war authorization.                                  | `src/lib/missions/mission-04/`        |

Mission catalog metadata (number, codename, logline, location, year, category, difficulty, version, status) is declared separately in `src/lib/missions.ts` as the constant `MISSIONS`. There is no runtime link between this list and the engine registry beyond the shared `id` string.

## User-visible surfaces

| Route          | Source                              | Purpose                                                                                                                |
| -------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `/`            | `src/routes/index.tsx`              | Landing page. Title, 3-line tagline, "Begin" link → `/missions`.                                                       |
| `/missions`    | `src/routes/missions.tsx`           | Case-file grid. Pulls per-mission play stats via `getAllMissionStats` (TanStack Query). Plays hovered mission's ambient bed. |
| `/mission/$id` | `src/routes/mission.$id.tsx`        | The mission itself: cinematic scene, chat transcript, voice/text composer, Decide modal. SSR off (`ssr: false`).       |
| `/analysis`    | `src/routes/analysis.tsx`           | Reads the active mission from `localStorage`, renders headline + canon timeline + expandable analysis sections + radar profile. SSR off. |
| `/sound-test`  | `src/routes/sound-test.tsx`         | Internal QA page; auditions mission-01..04 ambient beds via `createAmbient`. `robots: noindex`.                        |
| `/api/chat`    | `src/routes/api/chat.ts`            | Server route. Streams narrative via AI SDK + Lovable AI Gateway using `engine.systemPrompt`.                           |
| `/api/transcribe` | `src/routes/api/transcribe.ts`   | Server route. Forwards a multipart WAV to the gateway's `openai/gpt-4o-mini-transcribe` and proxies the JSON back.     |

Root layout (`src/routes/__root.tsx`) provides the document shell, dark theme, global meta/OG/Twitter tags, Google Fonts (Fraunces / Inter Tight / Instrument Serif), TanStack Query provider, Sonner `<Toaster />`, and root 404 / error boundaries.

## End-to-end session flow

1. **Land** at `/` → click *Begin*.
2. **Browse** `/missions`. Hover plays that mission's ambient bed; click opens the case file.
3. **Run** `/mission/$id`:
   - 3.6 s "awakening" black-out with eyelid keyframes.
   - The mission's `engine.opening.text` is rendered as a synthetic first assistant `UIMessage` (id `"opening"`) and persisted to `localStorage` on first mount.
   - Player types or dictates a reply; voice input goes mic → `record-wav.ts` → `/api/transcribe` → text inserted into the composer.
   - Each submission posts the full message history to `/api/chat` via `useChat` (AI SDK React) and streams the assistant reply.
   - Chips at the end of each assistant turn (`<<chips: "…" | "…" | "…">>`) are stripped from the visible text and rendered as quick-reply buttons.
   - "Pressure" is a derived scalar from `(messages.length - 1) / 18`, capped at 1. It modulates scene FX, ambient gain, sub-pad gain, and the heartbeat synth (activated once pressure ≥ 0.6).
   - The *Decide* pill becomes interactive when pressure ≥ 0.45 and chat is idle. Natural-language decision phrases in the composer ("I decide…", "let's go with…", etc.) open the Decide modal pre-filled instead of sending.
4. **Commit** in the Decide modal: pick one preset stance *or* free-write; optional reasoning; confidence slider 0..100. Submitting calls the `analyzeDecision` server function.
5. **Analyze** in `/analysis`: reads the just-saved mission from `localStorage`, shows the analysis sections, then writes back into the Decision Profile via `updateProfileWithAnalysis`. Mission play telemetry (timings, message count) is fire-and-forgotten into Lovable Cloud.

## Per-mission knobs that vary the feel

Defined on `MissionEngine` (`src/lib/missions/types.ts`):

- `scene.src`, `scene.filter`, `scene.mood` — cinematic background image + base CSS filter.
- `atmosphere` — overrides for haze gradient, pulse gradient/duration, Ken-Burns duration, dust opacity scale, chromatic-breathe duration, and the audio bed (`padFrequency`, `filterBaseHz`, `filterLfoDepthHz`, `lfoRateHz`).
- `archetypes`, `archetypeIds`, `decisionPresets` — the closed set of stances and the preset buttons in the Decide modal.
- `canon` — mission-specific deterministic ground truth (shape varies per mission).

## Out-of-scope today

- No accounts, no server-side per-user state. Mission progress, decisions, analyses, and the Decision Profile all live in `localStorage`.
- No payments, no auth, no email.
- "Classified" / "locked" mission statuses exist in the type (`src/lib/missions.ts`) but every shipped mission is currently `"available"`.
- The "community archive · open to contributors soon" footer string on `/missions` is copy only — no contributor flow exists.
