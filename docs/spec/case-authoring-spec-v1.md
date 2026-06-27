# Case Authoring Spec — v1 (Future)

Target workflow and tooling shape for authoring a Decision Node. The reference user is a writer or domain expert, not an engineer.

> **Status:** Future. Today, authoring is done by hand-editing TypeScript triads under `src/lib/missions/`.

## 1. The author's job

An author of a Decision Node is responsible for:

- The dilemma itself — a real, defensible, conflict-rich situation.
- The cast — three to seven named characters with conflicting incentives and asymmetric knowledge.
- Canon — the deterministic ground truth that makes the world consistent.
- Archetypes — the finite set of stances the player can land in, each with an authored consequence timeline and ripple.
- Presets — one-click phrasings for each archetype.
- Director voice — the tone the model must hold (style guide, examples).
- Opening — the verbatim first beat.
- Scene — image, mood, optional ambient.

The author is *not* responsible for: the Director runtime, the Analyzer, the chip protocol, the analysis output schema, persistence, or rendering.

## 2. Authoring surfaces

```
/cases/<case-id>/
  manifest.json
  canon.json
  canon.schema.json
  archetypes/
    <archetype-id>.json
    ...
  prompts/
    director.md           ← the case's voice; canon block injected at build time
  presets.json
  opening.md
  scene/
    cover.jpg
    soundtrack.mp3?
  README.md               ← author notes, references, content warnings
```

A case is a directory. Authoring tools edit the files; CI validates them.

## 3. Editor experience

The eventual creator platform provides:

- A canon editor with the case's `canon.schema.json` driving forms.
- An archetype editor with side-by-side timeline + secondOrder + tone fields.
- A live Director preview using the in-progress prompt and canon.
- A live Analyzer preview that runs end-to-end against a saved test transcript.
- A non-negotiables checklist (`constitution/08-non-negotiables.md`) that must be ticked before publish.

Until the platform exists, the same files can be hand-authored and validated via CLI.

## 4. The non-negotiables checklist (publish gate)

A case cannot publish until the author has affirmed each of:

- [ ] Every archetype is defensible by a thoughtful person.
- [ ] No archetype is the "right answer."
- [ ] At least one piece of knowledge in canon is reachable but never directly delivered.
- [ ] Every NPC has an incentive that does not align with the player's.
- [ ] Every NPC has at least one thing they will only volunteer to a specific question.
- [ ] The opening includes a `<<chips: …>>` line in the exact format.
- [ ] The Director prompt forbids meta self-reference, markdown headings, bullet lists, emoji.
- [ ] No archetype timeline contains the words *good*, *bad*, *right*, *wrong*, *correct*, *incorrect*.
- [ ] The case can be played end-to-end through Director + Analyzer in CI without a single canon contradiction.

## 5. Voice guide

Each case ships a one-page voice guide as part of `prompts/director.md`. It includes:

- Three to five example exchanges, in the exact format the model must produce.
- Tonal references (authors, films, registers) — illustrative, not binding.
- A short list of out-of-voice phrasings to avoid, with corrections.

The voice guide is what makes a model swap survivable. A new model on the same voice guide should sound like the same case.

## 6. Validation pipeline

Local (pre-commit):
- JSON schema validation for manifest, canon, archetypes, presets.
- Cross-field checks: every preset `archetypeId` exists; every archetype id matches its filename; the opening contains a valid chips line.

CI:
- All local checks.
- Director prompt compiles with the canon block embedded.
- Smoke session: scripted 5-turn transcript drives the Director end-to-end; output must include a parseable chips line on every turn.
- Smoke analysis: scripted commit drives the Analyzer end-to-end; output must validate against `DecisionAnalysis`; timeline must equal the matched archetype's canon beat-for-beat.

Editorial:
- Human review against `constitution/06-world-building.md` and `constitution/08-non-negotiables.md`.

## 7. Versioning

Per `docs/spec/decision-node-spec-v1.md` §8. Author-facing UI surfaces the version bump required for the change being made before the change can be saved.

## 8. Forks

A fork is a new case whose `manifest.fork.of` points at the source case. Forks may reuse canon, change archetypes, change opening, change Director voice. Forks are first-class citizens of the archive, not derivatives.

Forks must independently pass the non-negotiables checklist.

## 9. Attribution

`manifest.creator` is public and immutable per-version. Co-authors are listed. Editors are listed separately. The platform never publishes anonymous cases.

## 10. Non-goals

- Authoring branching multi-decision storylines from a single case file.
- Authoring multiplayer or shared cases.
- Authoring "endless" or procedurally generated cases.
- Authoring without an editorial review step for the public archive.
