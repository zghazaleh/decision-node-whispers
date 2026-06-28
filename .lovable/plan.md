
# Plan — Simpler analysis, first-person voice, restored chat craft

Three workstreams. Each is independently shippable. I'd ship in the order below so the cheapest wins land first and the biggest rewrite (analysis) has the new voice already in place.

---

## 1 · Voice rewrite — "the operator" → "you" (sweep)

Goal: every surface speaks to the player in second person. No "the operator", no "the player", no third-person framing.

**Files I'll touch**
- `src/lib/analysis.functions.ts` — the analysis system prompt currently says *"a high-stakes decision an operator just made"* and *"a different operator might have taken"*. Both flip to "you / a different you".
- `src/lib/missions/__tests__/framework-fixtures.ts` — one test fixture string says "Career exposure for the operator." Becomes "for you."
- `src/lib/missions/*/index.ts` (all 9) — audit each `SYSTEM_PROMPT` and `OPENING_TEXT`. Most already address the player as the character ("Iris", "Dana"), but I'll catch any meta phrasing ("the player must…", "the operator decides…") and rewrite to direct address where the engine speaks *about* the player to itself. The in-scene character dialogue stays untouched — it already talks to "you".
- `src/lib/missions/framework.ts` — invariant copy and any narrator-facing meta text.
- `src/routes/mission.$id.tsx` + `src/routes/analysis.tsx` — UI copy strings (labels, empty states, retry prompts, decision-screen helpers). Any remaining third-person framing flips.
- `src/lib/decision-profile.ts` — already uses "You" in the rendered strings; quick verify pass.

**Method**: ripgrep sweep for `operator|the player|the user` across `src/lib/missions`, `src/routes`, `src/components`, `src/lib/*.ts`. Rewrite hit-by-hit. Tests get re-snapped if any prompt-test-harness fixture trips.

---

## 2 · Decision screen — remove the confidence slider

Goal: the decision flow is "pick your stance → write why → commit". No 0–100 self-rated confidence step.

**Changes**
- `src/routes/mission.$id.tsx` — delete the slider control, its state, and the label/help text. The Decide sheet keeps: stance buttons (presets), the free-text "why", and the commit button.
- `src/lib/analysis.functions.ts` — `confidence` is currently an *optional* number on the input schema, so the server already tolerates its absence. I'll leave the field in the schema (no migration risk) but stop sending it. The analyzer prompt already derives a `calibrationVerdict` from behavior, not from the slider — verified.
- `src/routes/analysis.tsx` line 208–212 renders "Confidence: N/100" when present. I'll remove that block; nothing else on the page reads the slider value.
- `src/lib/decision-profile.ts` — `confidenceCalibration` dimension stays (it's derived from `calibrationVerdict`, not the slider).

Net effect: one fewer screen, one fewer decision the player has to make about themselves before the real one.

---

## 3 · Analysis page — redesign from scratch

Goal: one calm, readable post-decision page. Right now `src/routes/analysis.tsx` is ~1000 lines with ~10 sections (fallback header, decision summary, profile card, framework block, expandable sections, belief trajectory, reasoning assessment, timeline scrubber, biases, long-term, community percentile). It reads like a dashboard, not a debrief.

### New spine — five blocks, top to bottom

```text
┌─────────────────────────────────────────────┐
│  1. WHAT YOU DID                            │
│     One short paragraph — your stance,      │
│     in your own words, written back to you. │
├─────────────────────────────────────────────┤
│  2. WHAT HAPPENED                           │
│     The authored consequence beats, told    │
│     as a 3-beat timeline. No interactive    │
│     scrubber. Just three paragraphs.        │
├─────────────────────────────────────────────┤
│  3. HOW YOU REASONED                        │
│     The reasoningEcho (2–3 sentences) in    │
│     large type. The calibration verdict     │
│     surfaced as a single line beneath.      │
├─────────────────────────────────────────────┤
│  4. A PATTERN WORTH NOTICING (optional)     │
│     At most ONE bias OR ONE strength,       │
│     whichever the model flagged with the    │
│     highest confidence. If neither is       │
│     "high", this block is omitted entirely. │
├─────────────────────────────────────────────┤
│  5. CARRY FORWARD                           │
│     Your updated Decision Profile — a small │
│     card, no spider chart fan-out. Plus a   │
│     single "Run another" CTA.               │
└─────────────────────────────────────────────┘
```

### What goes away (or moves)

- **Belief trajectory rail** with bars — interesting once, noise every time. Cut from the default view.
- **Interactive timeline scrubber** — replaced by the static 3-beat retelling in block 2.
- **Multiple expandable accordions** — gone. If detail is wanted, one link at the bottom: "See full analysis" → routes to a `/analysis/$id/details` page that keeps the old dense view for power users. Zero data loss, full triage.
- **Community percentile** — moves into block 5 as a single sentence beside the profile card ("You sit in the 62nd percentile of choices on this case"), not its own section.
- **Possible biases list** — collapsed into block 4's "at most one pattern". The full list is on the details page.

### Voice & typography

- Every block addresses "you" in plain, quiet prose. Coach voice, not dashboard voice.
- One typographic scale: `font-display` for block headings, body for prose. No badges, no chips, no chart legends on the main page.
- Generous vertical rhythm; one block per screen on mobile.

### Implementation

- New component file: `src/components/analysis/AnalysisDebrief.tsx` housing the 5 blocks.
- `src/routes/analysis.tsx` becomes a thin route that loads data and renders `<AnalysisDebrief />`.
- The dense legacy view moves to `src/routes/analysis.details.tsx` (or stays inlined behind a query param — decided at implementation time based on what's least disruptive to the existing loader).
- No changes to `analysis.functions.ts` server contract — same payload, new presentation.

---

## 4 · Chat experience parity — missions 04–09 vs 02/03

This one needs diagnosis before code. I confirmed:
- The shared renderer (`CinematicText` in `mission.$id.tsx`) is identical for all missions.
- All 9 mission prompts share the same RULES OF NARRATION / SUGGESTED ACTIONS structure.

So the felt regression in 04–09 is most likely one of:
- (a) Opening text not seeded with the `*Name*` + dialogue format the renderer rewards, so the first impression is a wall of prose.
- (b) Prompts allow longer paragraphs ("two to six lines" vs older "two to four"), making beats less staccato.
- (c) Missing sensory-beat italic opening line (`*A wall clock. The second hand is missing.*` in mission 02) — the small italic frames are what makes 02/03 feel like cinema.

**Approach**
1. Play through openings of missions 04, 05, 06, 07, 08, 09 against 02/03. Capture screenshots side by side.
2. For each newer mission, patch `OPENING_TEXT` to start with a 1-sentence italic sensory beat, then a `*Name*` line + quoted dialogue, matching the 02/03 rhythm.
3. Tighten "two to six lines" → "two to four lines plus an optional one-line sensory beat" in 04–09 prompts (already correct in 02; 05/07/08/09 currently say "two to six").
4. Verify chips line is present and well-formed on the first turn — chip absence on turn 1 is a common cause of the "feels different" reaction.

No renderer changes. No new components. Pure prompt/opening tuning, mission by mission.

---

## Order of operations

1. **Voice sweep** (workstream 1) — small, safe, touches lots of files. Done first so the new analysis page is born in the right voice.
2. **Remove confidence slider** (workstream 2) — single-route surgery.
3. **Analysis redesign** (workstream 3) — biggest single change. Built in a new component so it can be reviewed in isolation.
4. **Chat parity tuning** (workstream 4) — last, because it benefits from a Playwright pass against the actual rendered openings, and any prompt tweak is independent of the other three.

## Out of scope

- The decision *screens themselves* (stance selection, why text) — you said those are OK aside from the slider.
- The framework / constitution layer — analysis presentation changes only, not the underlying model.
- New missions, new biases, or scoring algorithm changes.
- The Lovable-saved "Missions I'd run again" lists feature — that's a separate thread.
