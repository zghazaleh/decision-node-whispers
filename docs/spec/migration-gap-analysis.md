# Migration Gap Analysis

Three-way comparison between:

- **C** — `/constitution` (what the product *is*, philosophy)
- **I** — `/docs/current-state` (what the code does today)
- **S** — `/docs/spec` (target architecture, v1)

Status legend per row:

- ✅ **Aligned** — C, I, and S already agree.
- ⚠️ **Drift, low risk** — I diverges from C/S, but the divergence is contained and behavior-preserving to fix.
- 🟠 **Drift, structural** — I diverges from S in a way that requires real refactoring.
- 🔒 **Never change** — C and I align on something that S must preserve regardless of how the surrounding code evolves.

---

## 1. Director surface

| Topic | C | I | S | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Single live AI for in-character dialogue | "the only AI the player speaks to" | `/api/chat`, `streamText`, one model | `director.stream({...})` interface | ✅ | |
| Authored opening, not generated | non-negotiable | `engine.opening.text` synthesized client-side | platform emits opening verbatim | ✅ 🔒 | Keep the client-side synthetic opening. |
| Chip protocol in exact format | non-negotiable | enforced in prompt, parsed client-side, never repaired | platform preamble enforces, runtime never repairs | ✅ 🔒 | |
| Canon block in system prompt | non-negotiable | `canonGroundTruthBlock()` appended per mission | runtime composes from `canon.json` + schema | 🟠 | Today canon is TypeScript with bespoke formatter; spec wants data + schema with generated block. Behavior preserving migration is possible but multi-step. |
| Meta-resistance, no markdown, no emoji | non-negotiable | enforced per-mission in `index.ts` system prompt | platform preamble enforces, identical across cases | ⚠️ | Today each mission re-states the rules; spec wants them owned centrally. Drift is low-risk because the rules are identical across missions. |
| Model id + temperature hard-coded | unspecified | `google/gemini-3-flash-preview`, temp `0.85` | per-case `ModelDescriptor` + fallback chain | 🟠 | A single model and no fallback is the biggest production risk in I. |
| Server-side conversation memory | forbidden ("no Director memory across cases") | none; client re-sends transcript each turn | none | ✅ 🔒 | |
| Self-revision / critic pass | forbidden | none | none | ✅ 🔒 | |

## 2. Decision Analysis surface

| Topic | C | I | S | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Runs exactly once, post-commit | non-negotiable | `analyzeDecision` server function, called once | same | ✅ 🔒 | |
| Two stages (classify, narrate) | implied | implemented | required | ✅ | |
| Skip Stage A when preset id is supplied | implied | implemented | required | ✅ | |
| Hard canon overwrite of `timeline` | non-negotiable | implemented (`timeline: archetype.timeline.map(...)`) | required | ✅ 🔒 | The single most important line in the analyzer. |
| Forbidden vocabulary in output | non-negotiable | enforced only via prompt instruction | platform post-validates, one auto-reprompt | 🟠 | Today vocabulary discipline is best-effort. Spec adds a validation pass. Add this without changing behavior at first by logging-only. |
| Biases require behavioral evidence | non-negotiable | enforced via prompt; empty array allowed | platform-enforced rule | ✅ | |
| Calibration vs evidence, not outcome | non-negotiable | implemented (`calibration` field, prompt explicit) | required | ✅ 🔒 | |
| `luckVsSkill` field exists | non-negotiable | implemented | required | ✅ 🔒 | |
| Session is sealed after commit | non-negotiable | no re-run path in code | required | ✅ 🔒 | |
| Per-session persistence | required | `localStorage` only | platform storage | 🟠 | Storage migration is the main step toward S. |
| Compare to other players | forbidden | not implemented | forbidden | ✅ 🔒 | |
| Single numeric score or grade | forbidden | not implemented | forbidden | ✅ 🔒 | |

## 3. Case authoring surface

| Topic | C | I | S | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| A case is a self-contained bundle | implied | TypeScript triad under `src/lib/missions/<id>/` | directory under `/cases/<id>/` with manifest + data files | 🟠 | Biggest structural delta. Migration is multi-release. |
| Canon shape is mission-private | acceptable | TS literal `CANON` per mission, no shared schema | each case ships `canon.schema.json` | 🟠 | Adding per-case schemas without changing the runtime is a safe first step. |
| Archetypes enumerated finitely | required | TS `ARCHETYPES` map + union | one JSON per archetype | 🟠 | |
| Presets bind to an archetype id | required | TS array with `satisfies ArchetypeId` | JSON with same constraint, validated at publish | ✅ | |
| Display catalog vs runtime engine | not stipulated | two catalogues: `MISSIONS` + registry, cross-check absent | one manifest per case, no duplicate catalog | ⚠️ | Document the drift; add a cross-check warning today. |
| Authoring requires an editor / engineer | acceptable for MVP | true — must edit TS by hand | a non-engineer can author end-to-end | 🟠 | Tooling work. |
| Non-negotiables checklist at publish | implied | none (no publish flow) | required gate | 🟠 | |

## 4. Player-facing surface

| Topic | C | I | S | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Editorial aesthetic, no game HUD | non-negotiable | matches | preserved | ✅ 🔒 | |
| No countdown timer | non-negotiable | none | none | ✅ 🔒 | |
| No decision-distribution stats shown | non-negotiable | none | none | ✅ 🔒 | |
| No leaderboard | non-negotiable | none | none | ✅ 🔒 | |
| Decision Profile across cases | roadmap | `decision-node:profile` exists in `localStorage` | first-class persisted entity | ⚠️ | Profile concept exists; needs server-side persistence to fulfill the vision. |
| Rising ambient pressure | implied (psychological tension over timers) | implemented via `ambient.ts`, pressure curve `(n-1)/18`, heartbeat > 0.6 | preserve as platform service | ✅ | Document the formulas; preserve behavior. |
| Mic input for player voice | not stipulated | implemented (`/api/transcribe`, `record-wav.ts`) | preserve | ✅ | |
| Tutorials / onboarding overlays inside a case | forbidden | none | forbidden | ✅ 🔒 | |

## 5. Cross-cutting

| Topic | C | I | S | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| AI never lectures | non-negotiable | enforced in Director + Analyzer prompts | platform-owned preambles | ✅ 🔒 | |
| The Constitution wins | non-negotiable | n/a (Constitution is new) | n/a | ✅ | This document is the first time the rule is enforceable. |
| Versioning of cases | implied (forks, returns) | none | semver per case, immutable per version | 🟠 | |
| Telemetry of sessions | acceptable, anonymized | `mission_plays` table (no PII) | structured, schema-versioned | ⚠️ | Document the schema; do not change. |
| Failure surface (model down) | implied | `500` from `/api/chat`, throw from analyzer | in-world recoverable error, fallback chain | 🟠 | Today a model outage is a hard wall. |

---

## What already aligns (do not touch)

- The two-AI architecture: live Director + post-commit Analyzer, with no overlap.
- The canon guarantee — Analyzer overwrites `timeline` after Stage B.
- The chip protocol on every Director turn.
- The synthetic, authored opening message.
- The forbidden-vocabulary discipline in the Analyzer prompt.
- The absence of leaderboards, distribution stats, countdown timers, and tutorials.
- The `localStorage`-only session model for the MVP era.

## What differs (and is safe to evolve)

- The platform preambles (Director and Analyzer rule sets) can be centralized out of per-mission TS files.
- Canon can move from TS literals + bespoke formatter to JSON + per-case schema + generated block, without changing what the model sees.
- Cases can move from TS triads to bundle directories.
- Model selection can move from a hard-coded id to a per-case descriptor with a fallback chain.
- Sessions can move from `localStorage` to platform storage, with the seal-on-commit rule preserved.
- A publish-gate non-negotiables checklist can be added.
- Vocabulary validation can be added post-generation (logging first, enforcing later).

## What must never change (🔒 items above)

- Authored canon, generated voice.
- Hard canon overwrite of the Analyzer timeline.
- Single Analyzer pass, sealed on commit.
- The chip protocol format.
- The synthetic opening.
- `luckVsSkill` separation in coaching.
- No leaderboards, no distribution stats, no countdown timers.
- No coaching during the Director scene.

## Recommended sequencing (high-level, not a commit plan)

1. **Documentation & guardrails** — preserve everything in I; promote drift notes from current-state into architecture; add the non-negotiables checklist as a doc.
2. **Centralize platform preambles** — pull the Director and Analyzer rule sets out of per-mission prompt strings into shared platform-owned strings, concatenated at request time. Behavior-preserving if done by literal extraction.
3. **Add per-case canon schemas** — JSON Schema per mission; runtime still uses TS literal; the schema is purely validation. Then flip the formatter to read from JSON validated against the schema.
4. **Add a model descriptor abstraction** — same model id, same temperature, but routed through a `ModelDescriptor`. Then add a fallback chain.
5. **Migrate sessions to platform storage** — keep `localStorage` as a cache; persist sealed sessions server-side. Then deprecate the local-only path.
6. **Bundle-ify cases** — TS triads become directory bundles with manifest + data. The runtime registry reads from bundles. The creator platform is built on top of this.
7. **Publish gate** — the non-negotiables checklist becomes a CI step, then an editor UI.

No step on this list is required by the Constitution. The Constitution requires only that, at every step, the 🔒 invariants survive intact.
