# Decision Analysis — Current State

The two-stage server function in `src/lib/analysis.functions.ts` plus the client-side Decision Profile in `src/lib/decision-profile.ts` and renderer in `src/routes/analysis.tsx` + `src/components/DecisionProfileCard.tsx`.

## 1. `analyzeDecision` server function

**Where**: `src/lib/analysis.functions.ts` (created with `createServerFn({ method: "POST" })`).

**Inputs** (`AnalysisInput`, Zod-validated):
```
{
  missionId: string (default "mission-01"),
  decision: string (min 1),
  reasoning: string (default ""),
  archetypeId?: string,        // preset path — skips Stage A
  confidence?: number 0..100,  // self-reported at commit
  transcript: { role: string, text: string }[]  (min 1)
}
```

**Output**: `DecisionAnalysis` — see `AnalysisSchema` in the same file. Sections: `headline`, `archetypeId`, `archetypeLabel`, `timeline[]`, `assumptions`, `evidenceUsed`, `evidenceIgnored`, `alternatives`, `closing`, `reasoningAssessment {summary, strengths, blindSpots, possibleBiases, calibration, luckVsSkill}`, `beliefTrajectory[]` (max 8).

### Stage A — archetype classification

- **Skipped** when the caller passes a valid `archetypeId` (the preset path in the Decide modal).
- Otherwise, runs `generateObject` with `temperature: 0.1` and a Zod enum built from `engine.archetypeIds`. Prompt is `engine.archetypeMenuForClassifier()` plus `DECISION: … REASONING: …`.
- **Failure mode**: any throw inside the classifier sets `archetypeId = null` and the run continues without a canon archetype.

### Stage B — narration

- `generateObject` with `temperature: 0.6` and the full `AnalysisSchema`.
- When an archetype was resolved, the prompt embeds a **canon timeline block** verbatim plus the archetype's `secondOrder` facts and `tone`. The system prompt instructs the model to use those beats verbatim, in order, no additions, no reordering.
- When no archetype matched, the prompt tells the model to author its own 4–6-beat timeline grounded in the transcript.
- The system prompt is the longest in the codebase — it embeds the decision-science framing, observation checklist, allowed bias vocabulary, allowed strength vocabulary, JSON field-by-field instructions, and the explicit ban on the words "good", "bad", "right", "wrong", "correct", "incorrect", on congratulation, and on bias accusation.

### Post-processing

```ts
const finalAnalysis = archetype
  ? { ...object, timeline: archetype.timeline.map((t) => ({ ...t })),
      archetypeId: archetype.id, archetypeLabel: archetype.label }
  : object;
```

The model's `timeline` is **always overwritten** with the canon timeline when an archetype is known. Whatever the model returned in that field is discarded.

### Assumptions

- `LOVABLE_API_KEY` is present in the Worker env at call time.
- `engine.archetypeIds` is a non-empty array (validator enforces this at registration).
- The transcript fits in the model's context (no truncation here).
- The model returns valid JSON matching `AnalysisSchema` — AI SDK's `generateObject` retries internally; a final schema failure throws and is surfaced as a toast in `mission.$id.tsx`.

### Fragile / implicit behavior

- **Default-mission silent drop**: if the client omits `missionId` it defaults to `"mission-01"` and the analysis runs against mission-01's archetypes regardless of which mission the player actually played.
- **`archetypeId` validation is weak**: a preset id that doesn't exist on the engine causes the classifier path to run instead, with no warning to the caller.
- **No streaming**: the analysis call blocks until both stages finish. The UI shows a static "Analyzing…" panel.
- **Strict canon override**: if the canon timeline beats are edited but the system prompt still references "the beats above" the analyzer will still trust whatever we hand it.

### Risks if changed

- Lowering `temperature` from `0.6` removes the prose variation that makes each replay feel different.
- Removing the `headline … (max 18 words)` constraint will visibly stretch the analysis page hero.
- Touching `AnalysisSchema` requires a matching edit in `analysis.tsx`, which reads many of these fields directly (no defensive coding for missing keys other than `reasoningAssessment` and `beliefTrajectory`).

## 2. Decision Profile — `src/lib/decision-profile.ts`

**Where**: Pure client-side, persisted at `localStorage["decision-node:profile"]`.

**Shape** (`DecisionProfile`):
```
{ version: 1, missionsCompleted: number,
  contributions: MissionContribution[]  // newest last, cap 30
  scores: Record<Dimension, number>     // rolling weighted avg, 0..100
  emergingPattern: string }
```

**Dimensions** (fixed list): `strategicThinking, curiosity, informationGathering, confidenceCalibration, adaptability, negotiation, longTermThinking, biasResistance`.

### `scoreFromAnalysis(analysis)` — heuristic mapping

Reads counts + keyword matches from the analysis object:

- `strengths.length`, `blindSpots.length`, `possibleBiases.length` from `reasoningAssessment`.
- `beliefTrajectory.update` tallies (`revised`, `held`, `reinforced`).
- Substring searches on `calibration`, `luckVsSkill`, `alternatives`, `closing`, and the *length* of `evidenceUsed` / `evidenceIgnored`.
- Each dimension is `clamp(50 + a·X - b·Y, 0, 100)` with hand-tuned constants.
- Emits short signal tags: `anchored-after-confidence-rose`, `updates-on-evidence`, `multiple-bias-textures`, `reachable-evidence-skipped`, `strong-process`.

**Inputs**: one `DecisionAnalysis`. **Output**: `{ scores, signals }`.

**Assumptions**:
- The analyzer uses English vocabulary that matches the keyword lists (e.g. "lucky", "fortunate", "got away", "calibrat", "overconfid"). If the model paraphrases differently, scores swing.
- Character-count proxies for `evidenceUsed` / `evidenceIgnored` length are meaningful signals of behavior.

**Fragile / implicit**: every threshold is a magic number. Replacing the model with one that's more concise or more verbose will shift profiles without any code change.

### `updateProfileWithAnalysis(missionId, analysis)`

- De-dupes: if a contribution already exists for `missionId`, it is replaced (the new one is appended, the old one removed). `missionsCompleted` is incremented only when no prior contribution for this mission existed (otherwise treated as a re-play, count unchanged).
- Keeps the most recent 30 contributions.
- Rolling scores: linear recency weight `w = 1 + i * 0.25` per contribution in chronological order, then rounded.
- `deriveEmergingPattern` looks at the last 5 contributions, tallies signals, returns one of seven canned strings.

**Risks if changed**: the weighting and capping rules are not visible in any UI; users can't tell whether a low score is "first mission" noise or a settled pattern.

## 3. Analysis page — `src/routes/analysis.tsx`

- `ssr: false`; reads `localStorage` via `readMission()` on mount. Redirects to `/` if `mission.analysis` is missing.
- Renders sections in this order: headline → archetype label + commit-time confidence → consequence timeline scrubber → "Verdict" (`a.closing`) → expandable detail drawers (reasoning assessment, evidence used/set aside, assumptions, paths not taken, cognitive patterns, long-term consequences, belief trajectory) → community-percentile card (if `percentile.plays ≥ 3`) → `<DecisionProfileCard />` → coda buttons (Replay / Return).
- The community card is hydrated by calling `getMissionPercentile` with the elapsed `investigation_seconds = decidedAt - startedAt`.
- Error/404 surfaces: `AnalysisErrorComponent`, `AnalysisNotFound`, plus an in-route React `<AnalysisBoundary>` class component.

### Assumptions

- `mission-store.ts` was written successfully before navigation (`handleDecide` writes synchronously before `navigate({to:"/analysis"})`).
- `analysisProfile = readProfile()` includes the just-saved contribution (the write happens in `handleDecide` before the navigate, but if it throws — caught and logged — the profile shown will be the *previous* one).

### Risks if changed

- The page indexes into nested analysis fields without optional chaining beyond `reasoningAssessment` and `beliefTrajectory`. Removing any other top-level field from `AnalysisSchema` will crash this route.

## 4. Decision Profile card — `src/components/DecisionProfileCard.tsx`

- Renders an SVG radar plot (8 axes, concentric rings) plus a per-dimension bar with delta vs previous contribution (`▲n`, `▼n`, `—`, or `new` when fewer than 2 contributions).
- Reads `DIMENSIONS`, `DIMENSION_LABELS`, `dimensionTrends` from `decision-profile.ts`.
- Pure presentation — no side effects.
- Risks if changed: the radar labels truncate to the first word for axes whose label is `> 12` chars. Adding a dimension named `"Long Term"` would render as `"Long"`.
