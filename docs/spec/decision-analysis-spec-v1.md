# Decision Analysis Spec — v1 (Future)

Target shape of the Analyzer, independent of the current `analyzeDecision` server function.

> **Status:** Future. Today's two-stage `analyzeDecision` largely satisfies this spec; the deltas are mostly around persistence and versioning.

## 1. Responsibility

The Analyzer runs **once per session**, after the player commits a decision. It produces the entire `/analysis` page payload in a single structured response. It never speaks to the player otherwise.

## 2. Interface

```ts
analyzer.analyze({
  caseId:       string,
  caseVersion:  string,
  decision:     string,                            // required, non-empty
  reasoning:    string,                            // optional
  presetId?:    string,                            // if present, skip Stage A
  confidence?:  number,                            // 0..100
  transcript:   { role: string, text: string }[], // ≥1
  options?: {
    abortSignal?: AbortSignal,
  },
}) → Promise<DecisionAnalysis>
```

## 3. Two-stage pipeline

### Stage A — Classification

Skipped when a valid `presetId` is supplied. Otherwise runs structured generation with `temperature: 0.1` against the case's archetype menu. Returns `{ archetypeId, confidence, rationale }`. Only `archetypeId` is consumed.

On any error: `archetypeId` falls back to `null`. The pipeline proceeds.

### Stage B — Narration

Runs structured generation with `temperature: 0.6` against the `DecisionAnalysis` schema. Receives:

- The matched archetype's canon timeline block (or a "no canon matched, write your own 4–6 beats grounded in the transcript" instructions block).
- The matched archetype's `secondOrder` map and `tone`.
- The final decision text.
- The player's reasoning.
- The player's self-reported confidence.
- The full transcript.

## 4. Hard canon guarantee (post-processing)

After Stage B, if an archetype matched:

```ts
finalAnalysis = {
  ...modelOutput,
  timeline:       archetype.timeline.map(t => ({ ...t })),
  archetypeId:    archetype.id,
  archetypeLabel: archetype.label,
}
```

This step is non-negotiable. The model may phrase the closing, alternatives, evidence narration, biases, and belief trajectory; it may never alter, add, drop, or reorder canon beats. The labeling is stamped server-side from the registered case, not from the model.

## 5. Output schema (`DecisionAnalysis`)

```ts
{
  headline:        string,           // ≤18 words, third person, present tense
  archetypeId?:    string,
  archetypeLabel?: string,
  timeline:        { beat, consequence }[],
  assumptions:     string,           // 2–3 sentences
  evidenceUsed:    string,           // 2–3 sentences
  evidenceIgnored: string,           // 2–3 sentences
  alternatives:    string,           // 2–3 sentences
  closing:         string,           // one paragraph, lands in archetype.tone
  reasoningAssessment: {
    summary:    string,
    strengths:  { behavior, evidence }[]                       // 0–4
    blindSpots: { pattern, evidence, gentleReframe }[]         // 0–4
    possibleBiases: { name, evidence, gentleExplanation }[]    // 0–3
    calibration: string,
    luckVsSkill: string,
  },
  beliefTrajectory: {
    marker, hypothesis,
    confidence: "low" | "medium" | "high",
    trigger,
    update: "formed" | "reinforced" | "revised" | "abandoned" | "held",
    note,
  }[],                               // up to 8
}
```

## 6. Vocabulary constraints (platform-enforced)

The platform preamble forbids the following words anywhere in Stage B output: *good*, *bad*, *right*, *wrong*, *correct*, *incorrect*. The runtime validates output post-generation and re-prompts once if any forbidden word appears. A second failure ships the response with a single platform-side warning to the editor channel.

## 7. Bias detection rules

- Bias names are drawn from a finite, curated list (confirmation, anchoring, availability, representativeness, loss aversion, framing, overconfidence, sunk cost, halo, authority, status quo, recency, survivorship, groupthink, hindsight, escalation of commitment).
- Each bias entry requires `evidence` quoting or paraphrasing a specific transcript moment.
- An empty `possibleBiases` array is the expected default. Stretches are explicitly rejected.

## 8. Calibration

The player's commit-time self-reported confidence is used only for `reasoningAssessment.calibration`, and only against the strength of the evidence the player gathered — never against the outcome.

## 9. Persistence

The Analyzer's output is persisted to the SavedSession (see decision-node-spec-v1.md §7). The session is sealed at this point — re-running the Analyzer is not supported. Re-rendering the `/analysis` page reads from storage, never from the model.

## 10. Failure modes

| Condition | Behavior |
| --- | --- |
| Unknown caseId | Throw structured error; surface as recoverable error in `/analysis` with retry button. |
| Stage A throws | `archetypeId = null`; Stage B proceeds with no canon timeline. |
| Stage B throws | Surface recoverable error to client; storage records `analysis.status = "failed"`. Player can retry. |
| Model returns extra/missing/reordered timeline beat | Silently overwritten by canon. Drift is invisible to the player. |
| Forbidden vocabulary in Stage B output | One automatic re-prompt; if still failing, ship with editor warning. |

## 11. Non-goals

- Comparing the player's decision to other players.
- Producing a single numeric score or grade.
- Updating Stage B output based on later sessions or aggregated data.
- Showing the model's own confidence to the player.
- Allowing the player to argue with the analysis or have the model defend it.
