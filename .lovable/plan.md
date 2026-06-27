# Documentation Pass: `/docs/current-state/`

Documentation-only. No code, prompts, components, file moves, renames, or behavior changes. Existing `docs/architecture/` stays untouched (it describes design intent; the new folder describes what the code actually does today).

## Approach

1. Read every relevant source file in full so each doc reflects the current implementation, not assumptions:
   - `src/routes/`: `__root.tsx`, `index.tsx`, `missions.tsx`, `mission.$id.tsx`, `analysis.tsx`, `sound-test.tsx`, `api/chat.ts`, `api/transcribe.ts`
   - `src/lib/`: `ai-gateway.server.ts`, `ambient.ts`, `analysis.functions.ts`, `decision-profile.ts`, `mission-stats.functions.ts`, `mission-store.ts`, `missions.ts`, `soundtracks.ts`, `record-wav.ts`, `error-capture.ts`, `error-page.ts`, `lovable-error-reporting.ts`
   - `src/lib/missions/`: `registry.ts`, `types.ts`, `validation.ts`, and each `mission-0X/{index,canon,outcomes}.ts`
   - `src/components/DecisionProfileCard.tsx`, `src/hooks/use-mobile.tsx`
   - `docs/architecture/*.md` as cross-reference (cited, not copied)
2. Write the 7 files below. Every documented behavior carries the required fields: **Where**, **What**, **Inputs**, **Output**, **Assumptions**, **Fragile/implicit behavior**, **Risks if changed**. Improvement ideas go only into `open-questions.md`.

## Files

### 1. `product-overview.md`
High-level: what Decision Node MVP is today, the user-visible surfaces (home, missions list, mission run, analysis, sound test), how a session flows end-to-end. Lists the four shipped missions by id/title from `src/lib/missions/mission-0X/index.ts`.

### 2. `ai-director-current.md`
The AI director as implemented in `src/routes/api/chat.ts` and supporting libs: model selection via `ai-gateway.server.ts`, system/director prompt assembly, turn-by-turn flow, how mission canon/outcomes/state are fed in, transcription path (`api/transcribe.ts`, `record-wav.ts`), and the ambient audio coupling (`ambient.ts`, `soundtracks.ts`).

### 3. `decision-analysis-current.md`
The analysis pipeline: `analysis.functions.ts`, `decision-profile.ts`, `DecisionProfileCard.tsx`, the `/analysis` route. Inputs consumed from a finished mission run, scoring/profile shape produced, persistence (if any) via `mission-store.ts` / `mission-stats.functions.ts`.

### 4. `case-structure-current.md`
How a mission is structured in code: `missions/types.ts`, `registry.ts`, `validation.ts`, and the per-mission `index.ts` / `canon.ts` / `outcomes.ts` triad. Documents the actual fields used, not the idealized schema in `docs/architecture/case-structure.md`.

### 5. `data-flow-current.md`
End-to-end data flow for one mission turn: UI in `mission.$id.tsx` → recording → `/api/transcribe` → state in `mission-store.ts` → `/api/chat` → response handling → analysis trigger. Includes server-function vs route-handler split and where state lives (memory, store, none).

### 6. `known-behaviors.md`
Observed implicit/fragile behaviors found while reading: e.g. ambient audio restart rules from the recent fix, error-capture wiring (`error-capture.ts`, `lovable-error-reporting.ts`, `error-page.ts`), `use-mobile` breakpoints, anything depending on ordering, timeouts, or singletons.

### 7. `open-questions.md`
The only file allowed to contain forward-looking notes: ambiguities found in code, missing validation, undocumented assumptions, areas where intent in `docs/architecture/` diverges from current code.

## Out of scope

No edits to source, prompts, assets, or existing `docs/architecture/` files. No new code abstractions, helpers, or scripts. No reorganization of the repo.
