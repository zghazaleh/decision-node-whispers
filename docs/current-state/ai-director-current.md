# AI Director — Current State

What the "director" actually is in the code today: a single streamed chat completion per turn, with a mission-specific system prompt injected from `engine.systemPrompt`. There is no agentic loop, no tool use, no memory beyond the chat transcript.

## Components

### 1. Model gateway — `src/lib/ai-gateway.server.ts`

- **What**: Wraps `@ai-sdk/openai-compatible`'s `createOpenAICompatible` with `baseURL: https://ai.gateway.lovable.dev/v1` and the header `Lovable-API-Key: <key>`.
- **Inputs**: `apiKey: string` (passed by callers from `process.env.LOVABLE_API_KEY`).
- **Output**: an AI SDK provider factory used as `gateway("google/gemini-3-flash-preview")` in both chat and analysis paths.
- **Assumptions**: Lovable AI Gateway is reachable and accepts the OpenAI-compatible chat-completions and structured-output endpoints. The model id `google/gemini-3-flash-preview` is hard-coded in `/api/chat` and `analyzeDecision`.
- **Fragile**: A gateway outage, model rename, or schema drift in the OpenAI-compatible response surface breaks every mission turn and every analysis. There is no fallback model.
- **Risks if changed**: Swapping models will change pacing, chip discipline, and the analyzer's JSON adherence; the temperature settings (chat `0.85`, classifier `0.1`, analysis `0.6`) were tuned for the current model.

### 2. Narrative turn endpoint — `src/routes/api/chat.ts`

- **What**: TanStack server route. Accepts `POST { messages: UIMessage[], missionId?: string }`. Resolves the engine (defaulting to `mission-01`), reads `LOVABLE_API_KEY` from `process.env`, calls `streamText` with `system: engine.systemPrompt`, `temperature: 0.85`, then returns `result.toUIMessageStreamResponse({ originalMessages: messages })`.
- **Inputs**: Full message history (including the synthetic `id: "opening"` first assistant message) and the active mission id.
- **Output**: An AI SDK UI message stream the client consumes via `useChat` from `@ai-sdk/react`.
- **Assumptions**:
  - The client sends the entire prior transcript each turn — there is no server-side session state.
  - `engine.systemPrompt` already contains everything the model needs, including the canon block injected via `canonGroundTruthBlock()` at module-load time.
  - Unknown `missionId` returns HTTP 400; missing API key returns HTTP 500.
- **Fragile/implicit**:
  - Default mission id `mission-01` is silently applied when `missionId` is missing or non-string. A client bug that drops the field will run the wrong system prompt without warning.
  - There is no input size cap. A very long transcript will be sent verbatim to the model.
  - Chip discipline (the `<<chips: "a" | "b" | "c">>` line at end of every reply) is entirely enforced by the system prompt; if the model drops or malforms it, the client's `extractChips` regex tolerates a missing block and renders no chips but never repairs them.
- **Risks if changed**: Touching the streaming path, the system value, or removing `originalMessages` will break optimistic UI updates in `useChat`.

### 3. Mission system prompts — `src/lib/missions/mission-0X/index.ts`

- **What**: Each mission exports `missionXxxEngine.systemPrompt` — a single template string that contains: the brand/tone preamble (Villeneuve / Brooker / Chiang), the hidden situation, character roster, observable objects, the canonical first message ("OPENING"), narration rules, the chip protocol, and the canon ground-truth block appended via ``${canonGroundTruthBlock()}``.
- **Inputs**: None at request time — assembled once at module load.
- **Output**: A literal string passed to `streamText({ system })`.
- **Assumptions**: The model will obey "your VERY FIRST message is exactly this" wording. (In practice, the client never asks the model to generate the opening — see "Opening message" below.)
- **Fragile/implicit**:
  - The opening dialogue is duplicated: once inside `SYSTEM_PROMPT` and again as `OPENING_TEXT`/`engine.opening.text`. Only the latter is actually rendered; the former exists to keep the model in voice if it ever regenerates the scene.
  - The chip protocol (`<<chips: "..." | "..." | "...">>`, exactly three, 3–10 words each, no terminal punctuation, no repeats verbatim) is enforced only by prose instructions in the prompt.
- **Risks if changed**: Editing any narration rule or the canon block changes the felt voice of every reply and may break the chip parser if the format wording drifts.

### 4. Canon injection — `src/lib/missions/mission-0X/canon.ts`

- **What**: A typed `CANON` literal plus `canonGroundTruthBlock()` that flattens canon into a compact textual block appended to the mission's system prompt.
- **Inputs**: None.
- **Output**: A multi-section string covering WORLD / COMPANY / DECISION / PLAYER / CHARACTERS / OBJECTS / LAST 36 HOURS / HARD CONSTRAINTS.
- **Assumptions**: Every field referenced in the formatter exists on `CANON`. There is no runtime guard inside `canonGroundTruthBlock()`; missing fields would yield `"undefined"` in the prompt.
- **Fragile**: The mission engine validator (`src/lib/missions/validation.ts`) requires `canon` to be a non-empty object, but does **not** validate the shape used by each mission's `canonGroundTruthBlock()`. A canon edit that removes a referenced field passes validation and silently degrades the system prompt.
- **Risks if changed**: The director model treats this block as ground truth and is instructed never to invent facts — adding/removing fields here directly changes what the model will say.

### 5. Opening message — handled client-side

- **Where**: `src/routes/mission.$id.tsx` (`OPENING` constant and `useChat({ messages: initialMessages })`).
- **What**: On first mount of a mission, the client constructs a synthetic `UIMessage` with `id: "opening"`, `role: "assistant"`, parts: `[{ type: "text", text: engine.opening.text }]`, and seeds the chat with it. The model is never asked to produce the opening.
- **Inputs**: `engine.opening.text` (authored verbatim per mission, including a chips line).
- **Output**: First assistant bubble + initial chip row.
- **Assumptions**: `engine.opening.text` follows the same format the model is told to follow (italic character label on its own line, dialogue, then a chips line).
- **Risks if changed**: Removing the synthetic opening would force the model to generate the first turn from the system prompt alone; the existing prompts then race against `useChat` semantics that expect at least one message.

### 6. Voice input — `src/lib/record-wav.ts` + `src/routes/api/transcribe.ts`

- **`record-wav.ts`** (client): Captures mic via `getUserMedia`, runs a `ScriptProcessorNode` (4096 frames, mono), accumulates `Float32Array` chunks, downsamples to 16 kHz, encodes a 16-bit PCM mono WAV, returns a `Blob`.
- **`/api/transcribe`** (server): Reads multipart form `file`, rejects `< 1 KB` (400) or `> 25 MB` (413), forwards to `https://ai.gateway.lovable.dev/v1/audio/transcriptions` with `model=openai/gpt-4o-mini-transcribe`, proxies the response body and content-type through verbatim.
- **Inputs**: A WAV `Blob` from the recorder.
- **Output**: Whatever the upstream gateway returns, typically `{ "text": "..." }`. The client appends the text into the composer (`mission.$id.tsx`, `MicButton`).
- **Assumptions**:
  - `ScriptProcessorNode` is still available (deprecated in spec but works in current browsers; iOS Safari has the `webkitAudioContext` fallback).
  - The upstream gateway tolerates 16 kHz mono PCM WAV and the form-field name `file`.
- **Fragile**: A single network hiccup leaves no client-side retry; transcription is fire-and-forget per recording.
- **Risks if changed**: Switching to MediaRecorder/Opus would change codec — current upstream behavior with a different container is untested in this codebase.

### 7. Atmosphere — `src/lib/ambient.ts` and `src/lib/soundtracks.ts`

The director-shaped *feel* is delivered as much by audio/scene as by the prompt:

- `createAmbient()` exposes a singleton-style WebAudio graph (low-pass + shared LFO, sub-pad oscillator, optional heartbeat thumps). The mission's `engine.atmosphere` is applied via `setAudioProfile()` on mount.
- `setPressure(p)` is called each turn with `min(1, max(0, (messages.length - 1) / 18))`. It ramps the music gain, sub-pad gain, and (above 0.6) toggles `setHeartbeat(true)` whose BPM scales `60 + pressure * 32`.
- Audio start requires a user gesture (`pointerdown` / `keydown` once-listener), per browser autoplay rules.
- Soundtracks are mapped per mission in `src/lib/soundtracks.ts`. Missions without an entry play silently — by design.

Assumptions: WebAudio is available; decoded buffers fit in memory. The shared `bufferCache` module-level `Map` is intentional — it survives remounts.
Risks if changed: Removing the gesture-arming `once` listeners reintroduces silent ambient on autoplay-blocking browsers.

## What the director is *not*

- No tool calling, no function calling, no JSON mode at chat time.
- No re-prompting on malformed chips, no critic pass, no self-revision.
- No safety filter beyond whatever the upstream model applies.
- No persistence of conversation server-side. Every turn re-sends the entire `UIMessage[]` from `localStorage`.
