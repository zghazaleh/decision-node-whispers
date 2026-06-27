# Decision Analysis Model

The analyzer runs **once** when the player commits a decision. It produces the entire post-game write-up the `/analysis` route renders.

## Where it lives

- **Server function:** `src/lib/analysis.functions.ts` — `analyzeDecision` (`createServerFn({ method: "POST" })`).
- **Gateway:** Lovable AI Gateway (`src/lib/ai-gateway.server.ts`).
- **Model (both stages):** `google/gemini-3-flash-preview`.
- **Schema validation:** `zod` via `generateObject` from the `ai` SDK.

## Input

```ts
AnalysisInput = {
  missionId: string,              // default "mission-01"
  decision: string,               // required, non-empty
  reasoning: string,              // optional ("")
  archetypeId?: string,           // present when the player used a preset
  confidence?: number,            // 0..100, player-self-reported at commit
  transcript: { role, text }[],   // full session, min length 1
}
```

## Pipeline

### Stage A — Classification

Skipped entirely when `archetypeId` is supplied **and** valid for this mission's engine.

Otherwise, runs `generateObject` with:

- `temperature: 0.1`
- Schema:
  ```ts
  { archetypeId: enum(engine.archetypeIds), confidence: 0..1, rationale: string }
  ```
- System prompt: "You classify a player's final decision…" with `engine.archetypeMenuForClassifier()` appended.
- User prompt: `DECISION: …\n\nREASONING: …`.

On any thrown error, `archetypeId` falls back to `null`. The analyzer then proceeds with no canon timeline.

### Stage B — Narration

Runs `generateObject` with:

- `temperature: 0.6`
- Schema: `AnalysisSchema` (see below).
- System prompt: the executive-coach / decision-scientist persona (quoted in full in `prompt-logic.md`).
- User prompt:
  - The **canon timeline block** for the matched archetype, plus its `secondOrder` map and `tone`. The model is told these beats are GROUND TRUTH and must be used verbatim, in order.
  - The final decision text.
  - The player's reasoning.
  - The player's self-reported confidence (used for `calibration`).
  - The full transcript.

If no archetype matched, the prompt instead says "No canonical archetype matched. Write the timeline yourself, 4–6 beats, but stay grounded in the transcript."

### Post-processing — Hard canon guarantee

After Stage B, if an archetype matched:

```ts
finalAnalysis = {
  ...object,
  timeline: archetype.timeline.map((t) => ({ ...t })),  // overwrite
  archetypeId: archetype.id,
  archetypeLabel: archetype.label,
}
```

This is intentional. The model is allowed to phrase the closing, alternatives, evidence, biases, and belief trajectory — it is **never** allowed to invent, drop, or reorder canon beats.

## Output schema (`AnalysisSchema`)

```ts
{
  headline: string,                     // ≤18 words, third person, present tense
  archetypeId?: string,                 // stamped post-hoc
  archetypeLabel?: string,              // stamped post-hoc
  timeline: { beat, consequence }[],    // canon-overwritten when archetype matched
  assumptions: string,                  // 2–3 sentences
  evidenceUsed: string,                 // 2–3 sentences
  evidenceIgnored: string,              // 2–3 sentences
  alternatives: string,                 // 2–3 sentences
  closing: string,                      // one paragraph, executive-coach tone
  reasoningAssessment: {
    summary: string,                    // one paragraph on process quality
    strengths:    [{ behavior, evidence }]                       // 0–4
    blindSpots:   [{ pattern,  evidence, gentleReframe }]        // 0–4
    possibleBiases: [{ name,   evidence, gentleExplanation }]    // 0–3
    calibration: string,                // 1–2 sentences
    luckVsSkill: string,                // 1–2 sentences
  },
  beliefTrajectory: [{
    marker,                             // narrative tag, e.g. "After Sarah's first line"
    hypothesis,                         // what they appeared to believe
    confidence: "low"|"medium"|"high",
    trigger,                            // the specific input that produced this snapshot
    update: "formed"|"reinforced"|"revised"|"abandoned"|"held",
    note,                               // one neutral observational sentence
  }],                                   // up to 8
}
```

## Style constraints (from the prompt)

- Never use "good", "bad", "right", "wrong", "correct", "incorrect".
- Never congratulate. Never scold. Never accuse the player of a bias by name without behavioral evidence.
- Always ground claims in something the player actually did, said, asked, or skipped.
- Separate process from outcome explicitly via `luckVsSkill`.
- Biases are drawn from a fixed list (confirmation, anchoring, availability, representativeness, loss aversion, framing, overconfidence, sunk cost, halo, authority, status quo, recency, survivorship, groupthink, hindsight, escalation of commitment). Empty array is preferred over a stretch.
- Strengths are sound decision-making moves in plain language, never jargon.
- Blind spots describe patterns, never bias names; each carries a `gentleReframe` — the question the player could have asked instead.

## Determinism

For a given archetype, the **consequence timeline** is bit-for-bit deterministic across runs because it is overwritten from `engine.archetypes[id].timeline` after the model returns. Prose around it (closing, alternatives, evidence narration, belief trajectory) varies with the transcript.
