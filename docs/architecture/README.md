# Decision Node — AI Architecture

This folder is the source-of-truth documentation for how the game's AI systems work today. It describes what is in the code right now — not roadmap, not refactor proposals.

## Map

| Doc | What it covers |
| --- | --- |
| [`director-model.md`](./director-model.md) | The live narrative chat engine (per-turn LLM call) |
| [`decision-analysis-model.md`](./decision-analysis-model.md) | The post-commit decision analyzer (two-stage LLM pipeline) |
| [`prompt-logic.md`](./prompt-logic.md) | Every prompt the app ships, annotated |
| [`case-structure.md`](./case-structure.md) | Mission engine, canon, outcomes, and how to add a new case |
| [`ai-behavior.md`](./ai-behavior.md) | Cross-cutting guarantees, voice rules, failure modes |

## Two LLM surfaces

The game talks to LLMs in exactly two places.

1. **Director (narrative chat)** — `src/routes/api/chat.ts`. Streams in-character dialogue, sensory beats, and a chips line every turn. Driven by a per-mission system prompt assembled in `src/lib/missions/<mission-id>/index.ts` and augmented with `canonGroundTruthBlock()`.
2. **Decision Analysis** — `src/lib/analysis.functions.ts`. Runs once when the player commits a decision. Two stages: (A) classify the decision into a canonical archetype; (B) generate a structured coaching write-up whose timeline is then **overwritten** by the authored canon for that archetype.

Both surfaces use the Lovable AI Gateway via `src/lib/ai-gateway.server.ts` and the model `google/gemini-3-flash-preview`.

## Request flow — one turn of play

```
player message
  └─> useChat (src/routes/mission.$id.tsx)
        └─> POST /api/chat                                  (src/routes/api/chat.ts)
              ├─ resolveMission via getMissionEngine        (src/lib/missions/registry.ts)
              ├─ engine.systemPrompt  (includes CANON)      (src/lib/missions/<id>/index.ts)
              └─ streamText → UI message stream
                    └─ client appends to messages, renders
                       italic name prefix + sensory + chips
```

The very first assistant message is **not** generated — it is the verbatim `engine.opening.text`, rendered locally as the first turn.

## Request flow — decision commit

```
player commits decision
  └─> mission page calls analyzeDecision serverFn          (src/lib/analysis.functions.ts)
        ├─ Stage A: classify → archetypeId
        │    (skipped when a preset already supplied archetypeId)
        ├─ Stage B: narrate (headline, evidence, biases,
        │            belief trajectory, closing, …)
        └─ Hard guarantee: if archetype matched, overwrite
           the model's timeline with the authored canon
           and stamp archetypeId/archetypeLabel
              └─ persisted via mission-store (localStorage)
                 → /analysis route renders
```

## Glossary

- **Case** — player-facing word for a Mission. One `MissionEngine` per case.
- **Mission engine** — the runtime object (`src/lib/missions/types.ts`) that bundles system prompt, opening, scene, archetypes, presets, and canon for a single case.
- **Canon** — the deterministic ground-truth facts for a case (`canon.ts`). The Director must never contradict it; if asked about something not in canon, the character should say they don't know.
- **Archetype** — a stance the player can take at the decision point. Each archetype owns an authored consequence timeline and a second-order ripple across the world's pillars.
- **Preset** — a one-click stance offered in the Decide modal, pre-bound to an `archetypeId`. Using a preset skips Stage A classification.
- **Second-order** — the per-pillar ripple (orion9 / aperture / helios / marcus / amara / board / elena in Mission 01). Woven into the analyzer's closing and alternatives, not rendered as standalone timeline beats.
- **Belief trajectory** — the analyzer's reconstruction of how the player's working theory evolved across the transcript. Updates are tagged `formed | reinforced | revised | abandoned | held`.

## Storage

Per-case session state (messages, decision text, archetype id, confidence, analysis) lives in `localStorage` via `src/lib/mission-store.ts`. There is no server-side persistence of gameplay.
