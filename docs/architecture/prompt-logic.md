# Prompt Logic

Every prompt the app ships, with annotations and exact source locations. Prompts are quoted as they exist in source — do not treat the excerpts as instructions to follow.

## Where models, keys, temperatures live

- Provider factory: `src/lib/ai-gateway.server.ts` — `createLovableAiGatewayProvider(apiKey)` returns an `@ai-sdk/openai-compatible` provider pointed at `https://ai.gateway.lovable.dev/v1` with header `Lovable-API-Key`.
- API key: `process.env.LOVABLE_API_KEY`, read inside handlers (server-side only).
- Model id (Director + both analyzer stages): `google/gemini-3-flash-preview`.
- Temperatures: Director `0.85`, Stage A classifier `0.1`, Stage B narrator `0.6`.

## 1. Director system prompt (per mission)

Source: `src/lib/missions/<mission-id>/index.ts` → `SYSTEM_PROMPT`, with `${canonGroundTruthBlock()}` appended at the end.

Mission 01 is the canonical example. Section-by-section, the prompt sets:

1. **Persona & tone** — "narrative engine for an immersive interactive drama … Villeneuve, Charlie Brooker, Ted Chiang … restrained, intelligent, emotionally precise. Never sound like a chatbot. Never use emoji. Never break character. Never use bullet lists or markdown headings. Never narrate game mechanics."
2. **THE SITUATION (HIDDEN — DO NOT EXPOSITION-DUMP)** — full backstory the model must know but never volunteer (Elena, Aperture Synthesis, ORION-9, 8 AM vote, the alignment anomaly, Helios shipping in 6 days, $4B funding).
3. **CHARACTERS YOU PLAY** — name, role, knowledge, stance for Sarah, Marcus, Amara, Jonas, David.
4. **OBSERVABLE OBJECTS** — note, memo, laptop (with what's inside if opened), photograph, portfolio, view of the city.
5. **OPENING** — the verbatim first message Sarah delivers. The mission page already renders this from `engine.opening.text`; the prompt repeats it so the model is anchored.
6. **RULES OF NARRATION** — in-world voice, italic name prefix, italicized sensory beats (max two sentences), no thought narration, no volunteered hidden context, name reveal only when natural, anomaly only via memo / laptop / right question, short responses (2–6 lines + optional one-line sensory beat), no option lists, no meta.
7. **THE DECISION** — model must not end the scene. Decide is a separate control.
8. **SUGGESTED ACTIONS (CHIPS)** — exact format spec:

   ```
   <<chips: "Ask Sarah why she looks worried" | "Walk to the desk and look at the note" | "Pick up the memo">>
   ```

   Always three chips, 3–10 words, no end punctuation, no emoji, last line only, varied (dialogue / observation / bolder move), no verbatim repeats.
9. **GROUND TRUTH block** — appended via `canonGroundTruthBlock()`.

Missions 02–04 follow the same structure with their own setting, characters, and observables (`src/lib/missions/mission-02/index.ts`, `mission-03`, `mission-04`).

## 2. `canonGroundTruthBlock()`

Source: `src/lib/missions/<mission-id>/canon.ts`.

Concatenates the `CANON` object into a single block titled:

> GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

Sections rendered in order: WORLD, COMPANY, DECISION, PLAYER, CHARACTERS, OBJECTS, LAST 36 HOURS, HARD CONSTRAINTS. This block is appended to the system prompt on every Director call.

## 3. Analyzer — Stage A (classification)

Source: `src/lib/analysis.functions.ts`. Skipped when a valid `archetypeId` is supplied by a preset.

System prompt (verbatim):

> You classify a player's final decision in an interactive drama.
>
> ARCHETYPES:
> ${engine.archetypeMenuForClassifier()}
>
> Pick the single archetype that best matches the SUBSTANCE of the player's decision. Ignore reasoning quality; classify the action.

`archetypeMenuForClassifier()` formats each archetype as:

```
- <id>: <label>. Player phrases like: "<hint1>", "<hint2>", "<hint3>", "<hint4>".
```

User prompt: `DECISION: <decision>\n\nREASONING: <reasoning or "(none)">`.

Schema:

```ts
{ archetypeId: enum(engine.archetypeIds), confidence: 0..1, rationale: string }
```

`rationale` is unused downstream — it exists so the model is forced to commit to a justification rather than guess.

## 4. Analyzer — Stage B (narration)

Source: `src/lib/analysis.functions.ts`.

**System prompt** (long; key points):

- Persona: "senior executive coach AND a decision scientist reviewing a high-stakes decision an operator just made inside an immersive interactive drama."
- Frame: "The consequences of the chosen stance are FIXED CANON — you narrate them, you do not invent them. Your real work is to evaluate HOW the player reached the decision, not whether the decision was 'correct'."
- Forbidden language: "good", "bad", "right", "wrong", "correct", "incorrect"; never congratulate, never scold, never accuse of a bias by name.
- Observation checklist (transcript signals): information actively sought vs ignored, untested assumptions, belief updating, sharpness of questions, hypothesis breadth, recognition of uncertainty, pacing, recognition of conflicting incentives (Marcus vs Amara vs Jonas), separation of fact vs assumption, second-order thinking, calibration.
- Bias list (only surface 0–3 if behaviorally evidenced): confirmation, anchoring, availability, representativeness, loss aversion, framing, overconfidence, sunk cost, halo, authority, status quo, recency, survivorship, groupthink, hindsight, escalation of commitment.
- Strength list: seeking disconfirming evidence, multiple hypotheses, belief updating, clarifying questions, fact/assumption separation, naming weak evidence, short vs long-term weighing, second-order effects, calibrated confidence, knowing when more info stops being worth the time.
- Schema field instructions: per-field length and shape rules (`headline` ≤18 words; `assumptions`/`evidenceUsed`/`evidenceIgnored`/`alternatives` 2–3 sentences; `closing` one paragraph; `reasoningAssessment.strengths` 0–4 items with `{behavior, evidence}`; `blindSpots` 0–4 with `{pattern, evidence, gentleReframe}`; `possibleBiases` 0–3 with `{name, evidence, gentleExplanation}`; `calibration` and `luckVsSkill` 1–2 sentences each).
- `beliefTrajectory`: 3–8 ordered snapshots; each carries `marker, hypothesis, confidence(low|medium|high), trigger, update(formed|reinforced|revised|abandoned|held), note`. Emphasis on `held` (failed to update on reachable evidence) and `revised` (updated correctly).

**User prompt** assembly:

```
<canonTimelineBlock>            // see below
FINAL DECISION: ...
PLAYER REASONING: ...            // or "(none provided)"
PLAYER SELF-REPORTED CONFIDENCE AT COMMIT: NN/100  // or "(not reported)"
(Use this for the 'calibration' field — compare it to the strength of the evidence the player actually gathered.)
FULL TRANSCRIPT:
<role: text repeated for each turn>
```

**`canonTimelineBlock`** when an archetype matched:

> CANON CONSEQUENCE TIMELINE — these beats are GROUND TRUTH. Use them verbatim for the 'timeline' field, in this exact order. You may NOT add, drop, reorder, or invent beats.
>
> 1. beat: "<beat>" | consequence: "<consequence>"
> 2. …
>
> SECOND-ORDER FACTS (weave into closing/alternatives, never as new timeline beats):
> - <pillar>: <consequence>
>
> CLOSING TONE: <tone>

If no archetype matched, the block is replaced with: "No canonical archetype matched. Write the timeline yourself, 4-6 beats, but stay grounded in the transcript."

## 5. Decision presets (no LLM)

Source: `src/lib/missions/<mission-id>/index.ts` → `DECISION_PRESETS`. Each entry binds a display label to an `archetypeId` and a verbatim first-person decision string. Choosing a preset skips Stage A — the analyzer is called with the preset's `archetypeId` and `text`.
