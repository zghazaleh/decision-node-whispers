# Decision Node — Roadmap

Living document for work that is intentionally **not yet implemented**. Items
here have been discussed and accepted as direction, but require design or
infrastructure beyond a single batch. Reorder freely; promote to a spec when
work begins.

---

## Shipped recently

- **Confidence bands on the Decision Profile.** Each axis renders as a band
  that narrows as missions accumulate. (`src/components/DecisionProfileCard.tsx`,
  `dimensionBands()` in `src/lib/decision-profile.ts`.)
- **Per-trait drill-down.** Tapping a dimension reveals which missions formed
  that score and the per-mission value.

---

## Next batches (committed direction)

### Batch 2 — Structured Analyzer sub-scores (replaces keyword-sniffing)

**Why.** `scoreFromAnalysis` infers per-axis scores by string-matching the
Analyzer's prose. That is the root cause behind the calibration false-negatives
and most volatility. Move the source of truth into the model output.

**Shape.**

- Extend the `DecisionAnalysis` schema with:
  - `dimensionScores: Record<Dimension, number>` (0–100, model-emitted)
  - `calibrationVerdict: "under" | "calibrated" | "over"`
  - `biasConfidence: Record<biasName, "low" | "medium" | "high">` on each
    entry in `possibleBiases`.
- `scoreFromAnalysis` reads `dimensionScores` directly when present, falls
  back to the current keyword path only when missing or out of range.
- Show *why* a score moved on the drill-down (the Analyzer's one-sentence
  justification per dimension, cached on the contribution).

### Batch 3 — Reasoning-aware epilogue beat

**Why.** The canon timeline is authored per archetype; players who write a
thoughtful WHY currently see a default beat that can softly contradict their
stated intent.

**Shape.**

- Add a `reasoningEcho: string` field to `DecisionAnalysis` (1–2 sentences,
  grounded in the player's reasoning text, never canon-violating).
- Render above the canon timeline on the analysis page in a quieter voice.
- Hard rule: `reasoningEcho` may rephrase but may not invent consequences.
  Canon remains the only source of consequence text.

### Batch 4 — Player-built "what I've noticed" rail

**Why.** Late-mission transcripts are long. The constitution forbids
tutorialized clue-marking — so the rail must be **derived from what the player
asked**, not from authored hints.

**Shape.**

- Collapsible side rail on `mission.$id.tsx`, closed by default.
- Lists assistant turns that answered a direct player question, grouped by
  the NPC/object named. No highlighting, no "key clue" affordance.
- Pure transcript projection; no extra LLM call.

---

## Bigger bets (directional, not scheduled)

### 1. Profile as the retention engine

No leaderboards. Retention comes from compounding self-insight.

- Longitudinal view: "how your reasoning changed over 10 cases" — per-axis
  sparklines, signal-tag frequency over time, the moments your pattern
  shifted.
- Revisit a past decision: open any archived session and re-read the
  transcript, the WHY, and the Analyzer's read of it. Read-only.
- Private export (JSON) of the profile + sessions. No social share surface.
- A "your blind spot this run" callout that reads the last 3 contributions
  and names the one tag that is widening, not just present.

### 2. Authoring pipeline + non-negotiables CI gate

`docs/spec/case-authoring-spec-v1.md` already imagines the authoring schema.
Before opening the archive to community cases, build the publish gate:

- JSON/MDX case schema, validated at author time.
- Smoke-test harness in CI that exercises every archetype against the
  registered prompts and checks: every archetype is defensible, there is at
  least one reachable-but-undelivered truth, every NPC has a withheld
  answer, no forbidden vocabulary in canon text.
- A draft → review → publish flow with a clear rejection trail.
- Versioning + immutable case hashes so a published session's analysis is
  always reproducible.

### 3. Content-warning + tone metadata per case

As subject matter widens, surface an opt-in content note on the case card.
Quiet, literary register — never breaking immersion inside the scene.

- `contentNotes: string[]` on `MissionMeta` (e.g. `"institutional grief"`,
  `"medical decision under uncertainty"`).
- Card-level dot/label; full note revealed on hover or before entering the
  scene. Never shown during the mission.
- Default tone is "adult, literary." Anything beyond that gets an explicit
  note.

---

## Deferred / explicitly not doing

- Numeric leaderboards, social scores, public profiles. The product is a
  private mirror; ranking corrupts the read.
- Outcome-based grading. Good reasoning sometimes produces bad outcomes;
  the Analyzer must continue to score process, not result.
- Auto-marking "the clue" in the transcript. Forbidden by the constitution
  and would collapse the genre.
