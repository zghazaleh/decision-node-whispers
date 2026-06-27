
## Goal

Produce a single source-of-truth documentation set describing how the game's AI systems actually work today. Reading-only pass over the codebase. No application code, prompts, routes, components, or behavior change.

## Deliverables

All new files under `docs/architecture/`. Markdown only.

```text
docs/architecture/
  README.md                  # index + glossary + how the pieces connect
  director-model.md          # the narrative chat engine
  decision-analysis-model.md # the post-decision analyzer
  prompt-logic.md            # every prompt, assembled and annotated
  case-structure.md          # mission engine + canon + outcomes schema
  ai-behavior.md             # cross-cutting rules, guarantees, failure modes
```

## What each file covers

**README.md** — one-page map.
- The two LLM surfaces (Director chat vs. Decision Analysis) and where they live in `src/`.
- End-to-end request flow for a turn of play and for a decision commit, with file references.
- Glossary: Case / Archetype / Canon / Preset / Second-order / Belief trajectory.

**director-model.md** — the live narrative engine.
- Source: `src/routes/api/chat.ts` (server route, gateway, model `google/gemini-3-flash-preview`, temperature 0.85).
- Inputs: `messages`, `missionId`; resolution via `getMissionEngine`.
- Output contract: streamed UI messages, the chips-on-last-line convention.
- Per-mission opening message + scene metadata from `MissionEngine.opening` / `scene`.
- Narration rules surfaced from the system prompt (in-world voice, italic name prefix, sensory beats, no markdown, no meta).
- How CANON is injected as ground truth and what the model is forbidden to invent.

**decision-analysis-model.md** — the post-commit analyzer.
- Source: `src/lib/analysis.functions.ts` (`createServerFn`, two-stage pipeline).
- Stage A (classification): schema, model, temperature, when it is skipped (preset path supplies `archetypeId`).
- Stage B (narration): schema (`AnalysisSchema`) field-by-field — `headline`, `timeline`, `assumptions`, `evidenceUsed`, `evidenceIgnored`, `alternatives`, `closing`, `reasoningAssessment.{summary,strengths,blindSpots,possibleBiases,calibration,luckVsSkill}`, `beliefTrajectory`.
- Hard guarantee: canonical timeline + archetype label always overwrite model output when an archetype matched.
- Inputs: decision text, optional reasoning, optional confidence, transcript.
- Style constraints lifted from the system prompt (no "right/wrong", process over outcome, evidence-grounded).

**prompt-logic.md** — every prompt the app ships, annotated.
- Director system prompt (Mission 01 quoted in full as the canonical example) with section-by-section commentary: situation, character roster, observables, opening, narration rules, decision handling, chips spec.
- `canonGroundTruthBlock()` — what gets appended and why.
- Analyzer Stage A classification prompt — role, archetype menu format, what the rationale is for.
- Analyzer Stage B narration prompt — coaching persona, observation checklist, bias list, strength list, schema field instructions, canon-timeline block injection.
- Where temperatures, models, and SDK live (`src/lib/ai-gateway.server.ts`).

**case-structure.md** — the mission engine.
- `MissionEngine` type (`src/lib/missions/types.ts`) field by field.
- Registry (`src/lib/missions/registry.ts`): registration, validation-at-load, safe lookups, `requireMissionEngine` error path.
- `validateMissionEngine` (`src/lib/missions/validation.ts`): schema rules, cross-field checks (archetypeIds ↔ archetypes ↔ presets).
- Per-case folder layout: `index.ts` (engine assembly + system prompt + presets + opening + scene), `canon.ts` (deterministic ground truth + injection helper), `outcomes.ts` (archetypes, timeline beats, second-order pillars, tone).
- Player-facing metadata: `MISSIONS` in `src/lib/missions.ts` — id, codename, logline, tone, duration, location, year, category, difficulty, creator, version, status.
- How to add a new case (file checklist, validation contract, registry edit).

**ai-behavior.md** — cross-cutting guarantees and failure modes.
- Determinism boundary: canon timeline is authored, not generated; analyzer is forbidden to reorder or invent beats.
- Voice guarantees: no markdown, no emoji, no meta, no congratulating/scolding, no "right/wrong" language.
- Classification fallback: if Stage A fails or returns "unclassified", analyzer narrates without a canon timeline.
- Preset path vs free-text path through `decisionPresets`.
- Belief trajectory semantics: `formed | reinforced | revised | abandoned | held` and what each reveals.
- Where the model is allowed to be creative (closing, alternatives, evidence narration) vs. constrained (timeline, archetype label, opening line).
- Known failure modes worth documenting: missing `LOVABLE_API_KEY`, unknown mission id, malformed engine surfaced via registry validation.

## Approach

1. Read every file referenced above end-to-end (most already in context; remaining: missions 02–04 engines, `src/lib/mission-store.ts`, `src/routes/analysis.tsx` only for output rendering shape).
2. Write the six docs in one pass, cross-linking by relative path and citing `file:line` for every claim.
3. Quote prompts verbatim from source (no paraphrasing into instructions).
4. No edits to any `src/`, `supabase/`, prompt, or config file. Docs only.

## Out of scope

Roadmap, refactor proposals, evaluation methodology, prompt rewrites, new features, UI copy. If gaps or inconsistencies surface during reading, they are noted in a short "Observations" section at the end of `ai-behavior.md` — not fixed.
