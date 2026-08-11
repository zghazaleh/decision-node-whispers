# Response to the ChatGPT critique — and what I'd act on

## My read of the critique

It is largely right, and its sharpest points are the ones we can act on in the product this month:

- **Correct and already true of us:** authored canon + generated expression, refusal to moralise, debrief as the reason to exist. No change needed.
- **Correct and partly built:** confidence is already captured and scored (`confidenceCalibration` is one of eight profile dimensions, with a `calibrationVerdict`). What's missing is the *pre-decision commitment card* — stated confidence, one-line rationale, and the single unresolved uncertainty, captured before the outcome is known.
- **Correct and not built:** three labelled session formats (every mission currently advertises "20–40 min"), evidence-layered debrief language, longitudinal contradiction in the profile, and return loops.
- **Correct as a warning:** "false psychological authority". Our analyzer already forbids verdict vocabulary, but the debrief does not visually separate observed behaviour from inference.
- **Where I'd push back:** the two-audience split is real but premature to solve. Positioning language costs nothing to change now; a separate professional edition is a fork we shouldn't take before the retention thresholds are met.
- **What I'd deprioritise:** enterprise, seasons, more missions. The critique's own conclusion is right — the next milestone is trust + return, not inventory.

## Proposed action plan

### Phase 1 — Commitment and honesty in the debrief (highest value, contained)
1. **Commitment card before commit.** On DECIDE, capture: chosen action, confidence 0–100, one-sentence rationale, and "the one thing you still don't know". Feed all four into the analyzer.
2. **Evidence-layered debrief.** Restructure the reasoning section into visible layers: *Observed* (what you did — literal, no interpretation), *Inference* (what it suggests, hedged), *Alternative reading*, *Question back to you*. This is a prompt-schema and rendering change, not new AI.
3. **Aftermath before analysis.** Enforce the beat order: human consequence → pause → analysis. Analysis stays gated behind an explicit continue.

### Phase 2 — Make the profile longitudinal, not a trait sheet
4. **Contextual tags per contribution** (domain, pressure type, whether the challenge came from evidence or from a person) so patterns can be stated *conditionally*: "you seek disconfirming evidence in political decisions but not when loyalty is involved."
5. **Tension lines instead of labels.** The portrait surfaces contradiction and drift over time (calibration trend, search breadth under time pressure) rather than a fixed adjective.
6. **Reconsider loop.** After 30 days, invite the player to revisit one earlier judgment with what they know now.

### Phase 3 — Format, framing, measurement
7. **Three labelled formats** — Incident 8–12 min, Mission 20–25 min, Case 40–60 min — assigned per mission and shown on cards and detail. Shorten by narrowing the decision surface, never by removing ambiguity.
8. **Verb affordances** in the composer: Question someone / Inspect the room / Review what you know / Commit. Verbs, never suggested choices.
9. **Positioning pass** across landing, archive, meta and llms.txt: "narrative decision intelligence" and "Step into an irreversible decision. Investigate freely. Choose once. Then see how your mind got there."
10. **Instrumentation for the ten metrics** — completion, time-to-first-action, debrief read depth, second mission within 7 days, fourth within 30, share rate, cost per completed mission. We already write `mission_plays`; this extends it into an event model rather than a counter.

## Technical notes
- Commitment capture extends the existing `AnalysisInput` (which already accepts `confidence`) with `rationale` and `openUncertainty`; the analyzer prompt gains an evidence-layer section in its output schema.
- Contextual tags live on `mission_contributions`; the profile aggregation in `src/lib/decision-profile.ts` becomes conditional rather than a flat rolling average.
- Formats are metadata on the mission manifest, replacing the hardcoded `duration: "20–40 min"`.
- Metrics need a new events table plus RLS and grants; nothing here requires a new AI provider.

## What I'd not do yet
Enterprise edition, seasons, weekly release cadence, or any claim that the Decision Profile is a validated assessment.

## Suggested first step
Phase 1 only — commitment card, layered debrief, aftermath ordering. It is the cheapest change that directly tests the critique's central bet: whether players trust the mirror.
