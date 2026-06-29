# Decision Nodes — Charter

The single entry point. If you read one file before touching this project, read this one. It does not duplicate the canonical docs — it tells you what the product is, what it is NOT, which document is authoritative for what, and what is true today.

## What it is

Decision Nodes is a short-form interactive drama. You wake up inside a stranger's life at the moment of one consequential, irreversible decision. You have limited time to investigate, question the people around you, and surface what's hidden — then you commit. The system does not score whether you were "right"; it reflects how you reasoned under uncertainty back to you, and accumulates a long-lived Decision Profile that portrays how you think.

> One body. One dilemma. One decision. The only honest review of you that exists.

The objective is to understand your own mind, not to win.

## What it is NOT

- Not a game — no score, no win-state, no leaderboards.

- Not a chatbot — the Director serves the story, stays in character, withholds.

- Not a simulation — it models situations (finite, authored, with hidden truths), not systems.

- Not the knowledge-to-game compiler. A separate, much larger venture exists (in a 17-chapter design doc) for turning books/papers into multi-turn resource simulations. It shares this product's name and philosophy but contradicts its architecture (generated vs. authored consequences; many decisions vs. one; manage-a-system vs. inhabit-a-person). Do not merge them or point a coding agent at this repo with that document. See "The boundary" below.

## Source-of-truth precedence

When two sources disagree, this is the order of authority:

1. constitution/ — the law. Philosophy + the non-negotiables. Nothing ships that violates it.

2. The code + tests — the truth of what actually runs. framework.ts, constitution.test.ts, and the mission triads are the live spec; the gate enforces the constitution mechanically.

3. docs/spec/ + docs/architecture/ — design intent. Aspirational; defer to code when they differ.

Prose that merely mirrors the code is not a source of truth — it rots. That is why this Charter points to the living sources instead of restating them, and why docs/current-state/ has been retired down to its two non-mirror notes.

## The canonical index

Soul & rules — constitution/

- 00-product-philosophy, 01-first-principles, 02-design-principles

- 03-decision-node-spec, 04-ai-director-philosophy, 05-decision-analysis-philosophy

- 06-world-building, 07-roadmap, 08-non-negotiables (the spine — read this), 09-history

- 10-creator-template (the 13-field authoring template + crosswalk)

- VERIFICATION-CHECKLIST

How the systems work — docs/

- docs/spec/ — director, decision-analysis, decision-node, case-authoring-spec-v1 (the creator platform)

- docs/architecture/ — director-model, case-structure, ai-behavior, prompt-logic, prompt-io-schema, prompt-test-harness

- docs/roadmap/decision-node-roadmap

- docs/notes/ — known-behaviors, open-questions (salvaged from the old current-state)

The engine — src/lib/

- missions/<id>/{canon,outcomes,index}.ts — each case's triad (ground truth / authored outcomes / Director engine)

- missions/registry.ts — registration + composeSystemPrompt (injects the Director invariants)

- missions/framework.ts — the per-mission stakes / hidden truths / time limit / decision science / learning objective record; fed to the Analyzer

- missions/validation.ts + missions/__tests__/ — the quality gate (structural + constitution checks)

- analysis.functions.ts — the two-stage Analyzer (classify then narrate around authored canon)

- decision-profile.ts — the rolling Decision Profile

Operate the gate — /admin/evaluation shows every mission's pass/fail on framework + constitution.

## The two load-bearing ideas (do not erode)

1. Authored, deterministic canon (non-negotiable #13). Consequences are authored (the outcomes.ts timeline beats); the AI generates only the prose around fixed beats. The determinism is in the beats, the generation is in the voice. This boundary IS the moat.

2