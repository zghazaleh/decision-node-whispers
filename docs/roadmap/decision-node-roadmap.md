# Decision Node — Roadmap

Living document for work that is intentionally **not yet implemented**. Items
here have been discussed and accepted as direction, but require design or
infrastructure beyond a single batch. Reorder freely; promote to a spec when
work begins.

---

## Shipped recently

- **Confidence bands on the Decision Profile.** Each axis renders as a band
  that narrows as missions accumulate.
- **Per-trait drill-down.** Tapping a dimension reveals which missions formed
  that score and the per-mission value, with the Analyzer's one-sentence
  justification when available.
- **Structured Analyzer sub-scores (Batch 2).** The Analyzer now emits
  `dimensionScores` (0–100 per axis), `dimensionNotes` (one sentence each),
  `calibrationVerdict` (under/calibrated/over), and per-bias `confidence`.
  The Decision Profile scorer prefers these whenever present and falls back
  to the legacy keyword path only when the model omits them.
  Contributions are tagged with `source: "model" | "heuristic"` so drift is
  observable.
- **Reasoning-aware epilogue (Batch 3).** The Analyzer emits an optional
  `reasoningEcho` — a 2–3 sentence executive-coach reflection grounded in
  the player's own WHY, the `calibrationVerdict`, and one or two
  `dimensionNotes`. Rendered as a quiet italic block above the canon
  timeline on `/analysis`. Hard rule: may rephrase, may never invent
  consequences. Canon remains the only source of consequence text.

---

## Next batches (committed direction)

### Batch 4 — Player-built "what I've noticed" rail

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
