# Decision Node — Migration Plan (current-state → architecture spec)

Note: there is no `/docs/spec` folder in the repo. The closest target documentation is `/docs/architecture/*`, which the README labels "source of truth for how the AI systems work today." This plan treats `/docs/architecture` as the spec to align against, and `/docs/current-state` as the inspectable record of what actually ships.

The goal is alignment without behavior change. No prompt rewrites, no model swaps, no logic edits.

---

## 1. What can remain unchanged

These match the spec closely enough that they should be left alone:

- **Gateway wiring** — `src/lib/ai-gateway.server.ts` (base URL, header, model id `google/gemini-3-flash-preview`). Spec and code agree.
- **Director route** — `src/routes/api/chat.ts`: `streamText`, temperature `0.85`, `convertToModelMessages`, `toUIMessageStreamResponse({ originalMessages })`. Spec documents this exact shape.
- **Two-stage analyzer** — `src/lib/analysis.functions.ts`: Stage A classifier at temp `0.1`, Stage B narrator at temp `0.6`, post-hoc canon overwrite. Schema (`AnalysisSchema`), input schema (`AnalysisInput`), and the canon-timeline prompt block all match `prompt-io-schema.md`.
- **Registry + validation** — `src/lib/missions/registry.ts`, `src/lib/missions/validation.ts`. Behavior described in `case-structure.md` matches code.
- **Per-mission triad** — `index.ts` / `canon.ts` / `outcomes.ts` per `src/lib/missions/mission-0X/`. Matches spec.
- **Session storage** — `src/lib/mission-store.ts` keys (`decision-node:mission:<id>`, `decision-node:active-mission`) match spec.
- **Opening rendering** — client-side synthetic first assistant message from `engine.opening.text` in `src/routes/mission.$id.tsx`. Matches spec.
- **Chip parsing** — client-side `extractChips` regex tolerance. Matches spec.
- **Transcription path** — `src/lib/record-wav.ts` + `src/routes/api/transcribe.ts` with `openai/gpt-4o-mini-transcribe`. Not in `/docs/architecture` but stable; document, do not change.

## 2. What should be extracted into markdown later (no code change)

These behaviors exist in code but are absent or under-specified in `/docs/architecture`. They should be promoted from `current-state` into the spec set in a later pass:

- **`MissionEngine.atmosphere` field** — present in `types.ts` and consumed by `ambient.ts`; missing from `case-structure.md`.
- **Pressure curve and heartbeat thresholds** — `(messages.length - 1) / 18`, `> 0.6` toggles heartbeat, BPM `60 + p*32`. Currently only in `known-behaviors.md`.
- **Display catalog vs runtime engine** dual catalogue (`src/lib/missions.ts` vs registry). `case-structure.md` only describes the engine side.
- **Telemetry contract** — Lovable Cloud `mission_plays` table, the only server-side store. Not in spec.
- **Transcription contract** — request shape, size limits (1KB / 25MB), upstream form-field name.
- **Sound toggle key** — `localStorage["dn:sound"]`.
- **Default-mission coercion** — `missionId` defaults to `mission-01` silently in both `/api/chat` and `analyzeDecision`.
- **Reserved metadata fields** — `MissionMeta.status` values `classified | locked`, `creator`, `version`.

These extractions are documentation-only and can be batched into a follow-up doc PR; they do not affect the code migration.

## 3. What is risky to refactor

Touch with care. Each item lists *why* it is fragile:

- **System prompt text + canon block** (`src/lib/missions/*/index.ts`, `canon.ts`). The Director's voice, chip discipline, and ground-truth boundary are encoded entirely in prose. Any reformatting (whitespace, headings, list bullets) can shift output distribution. The opening is duplicated inside `SYSTEM_PROMPT` and as `OPENING_TEXT`; they must stay in lock-step manually.
- **`canonGroundTruthBlock()`** — no runtime guard. Removing or renaming a canon field that the formatter references prints `"undefined"` into the system prompt and passes validation.
- **`AnalysisSchema`** — `generateObject` strict-validates; adding/removing/renaming a field changes the contract for the model and the `/analysis` renderer simultaneously.
- **Canon overwrite step** in `analysis.functions.ts` — the `timeline: archetype.timeline.map(t => ({ ...t }))` line is the deterministic-canon guarantee. Removing it lets the model invent beats.
- **Archetype id rename** — must change `outcomes.ts` (both id and key), the `ArchetypeId` union, every `DECISION_PRESETS[i].archetypeId satisfies ArchetypeId`, and any persisted save in `localStorage` (in-flight users would carry a stale `archetypeId`).
- **Streaming response shape** — removing `originalMessages` or switching off `toUIMessageStreamResponse` breaks `useChat` optimistic updates.
- **WebAudio gesture-arming** in `ambient.ts` — removing the `pointerdown`/`keydown` `once` listeners reintroduces silent ambient on autoplay-blocking browsers.
- **Module-load singletons** — `bufferCache` Map, `REGISTRY` Map, `VALIDATION_ERRORS` Map. Hot-reload and test isolation depend on these surviving remounts.
- **`ScriptProcessorNode`** in `record-wav.ts` — deprecated but functional; replacing it changes codec/container and the upstream transcription endpoint has not been tested with alternatives in this codebase.

## 4. Tests and manual checks (run before AND after every step)

Automated:

- `bun run scripts/scaffold-integration-test.ts` (stub mode) — verifies scaffolder + harness loop.
- With `LOVABLE_API_KEY` set: `bun run scripts/prompt-test-harness.ts` against each registered Director and Analysis fixture. Bless snapshots only at baseline; after migration steps, snapshots must match unchanged.
- `tsgo` typecheck (the repo's typecheck path) — catches `satisfies ArchetypeId` drift on preset rename.
- Build the app — Vite asset imports (`scene-*.jpg`) fail loudly here, not at registration.

Manual smoke (each mission `01..04`):

1. Open `/missions`, confirm all four cards render with status `available`.
2. Open `/mission/<id>`, confirm opening bubble renders verbatim from `engine.opening.text` (italic name line, chips trailer present).
3. Send 2–3 turns. Confirm: italic sensory beat optional, `*Name*` prefix on dialogue, exactly 3 chips on the last line.
4. Trigger heartbeat: send ≥12 turns until pressure crosses 0.6; confirm audio cue intensifies (audible).
5. Use the mic button — verify `/api/transcribe` returns text appended to composer.
6. Open Decide modal, pick each preset once. Confirm `/analysis` renders with `archetypeLabel` matching the preset and `timeline` length equal to the authored canon beats.
7. Free-text decision path — write a decision that maps to a known archetype; confirm Stage A classifies it (timeline overwritten) and a deliberately ambiguous decision falls back to model-authored 4–6 beats.
8. Reload `/analysis` — confirm it rehydrates from `localStorage` without re-calling the analyzer.
9. Toggle sound off, reload, verify `localStorage["dn:sound"] === "off"` and ambient stays silent.

Failure-mode probes (one-time at baseline; re-run if the relevant code is touched):

- Unset `LOVABLE_API_KEY` locally → `/api/chat` returns `500`, `analyzeDecision` throws.
- Send `missionId: "does-not-exist"` to `/api/chat` → `400 Unknown mission`.
- Temporarily break a mission's validation (e.g. blank `archetypes[k].label`) → `console.error` block, mission absent from registry, `/mission/<id>` redirects to `/missions`.

Capture baseline outputs of these checks before step 1 of the sequence below; diff after every step.

## 5. Step-by-step migration sequence (preserves behavior)

Each step is a single PR-sized change. Run §4 before and after each step. Stop and roll back if any output diverges that the step did not explicitly intend.

### Phase 0 — Baseline (no code change)
1. **Snapshot baseline.** Record current prompt-harness snapshots, screenshots of `/missions`, one mission turn, one analysis page, network HAR of `/api/chat` and `/api/transcribe`. Store under `/docs/current-state/baseline/`.
2. **Reconcile spec vs current-state.** Open the deltas from §2 as a tracking issue. No code or doc edits yet — just an inventory.

### Phase 1 — Doc-only alignment (zero runtime risk)
3. **Promote `atmosphere`** into `docs/architecture/case-structure.md` (field, type, consumer).
4. **Promote pressure/heartbeat formulas** into `docs/architecture/ai-behavior.md`.
5. **Promote dual-catalogue note** (display vs runtime engine) into `docs/architecture/case-structure.md`.
6. **Add `docs/architecture/telemetry.md`** describing the `mission_plays` table read out of code.
7. **Add `docs/architecture/transcription.md`** describing `/api/transcribe` IO and upstream model.
8. **Add `MissionMeta` reserved fields** note to `case-structure.md`.

Validation after phase 1: run §4 anyway to confirm no accidental code edits sneaked in.

### Phase 2 — Safe, mechanical code hygiene (no behavior change)
9. **Add a `MissionId` const tuple + type** derived from existing engine ids, exported from `src/lib/missions/registry.ts`. Replace the literal `"mission-01"` defaults in `/api/chat` and `analyzeDecision` with the exported constant. Functional output unchanged; only source clarity improves.
10. **Add `assertCanonShape()`** per mission canon, called from each mission's `index.ts` at module load (throws if a field referenced by `canonGroundTruthBlock()` is missing). Closes the `"undefined"` leak without touching prompt text. Re-run §4 fully — system prompt string must be byte-identical when canon is complete.
11. **Cross-check `MISSIONS` vs registry** at module load — log a single `console.warn` when a `MissionMeta` has no engine (or vice versa). Warning-only, no runtime divergence.
12. **Add a regression test** that asserts `engine.opening.text` appears verbatim inside `engine.systemPrompt` for every mission (catches the duplicated-opening drift documented in `ai-behavior.md`).

### Phase 3 — Optional, opt-in resilience (only if explicitly requested)
13. **Chip-line validator (warn, do not repair)** — client-side log when `extractChips` finds fewer than 3 chips. Telemetry only. Skip if the goal is strict no-change.
14. **Transcript size guard** — soft warning when `messages.length > N` (no truncation). Skip otherwise.

Phase 3 is deliberately gated; it changes observability, not behavior, but adds surface area. Do not start it unless requested.

### Phase 4 — Close-out
15. **Refresh `/docs/current-state/*` files** to reflect phases 2–3 changes; re-snapshot baseline.
16. **Update `docs/architecture/README.md`** map to reference the new files added in phase 1.

---

## Non-goals (explicitly out of scope for this plan)

- Renaming archetypes, missions, or any persisted localStorage key.
- Editing system prompts, opening text, canon prose, or the analyzer prompt body.
- Swapping the model, gateway, or temperatures.
- Refactoring per-mission folder layout, splitting `index.ts`, or extracting a shared canon schema.
- Replacing `ScriptProcessorNode` with `AudioWorklet`.
- Moving any server-side state out of (or into) `localStorage`.
- Touching `docs/current-state/open-questions.md` items — those are for a future design pass, not this migration.
