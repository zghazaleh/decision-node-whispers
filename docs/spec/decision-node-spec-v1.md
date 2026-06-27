# Decision Node Spec — v1 (Future)

Target architecture for a published Decision Node, independent of the current MVP implementation. This is what every case — house-edition or community-authored — must conform to once the creator platform exists.

> **Status:** Future. The current implementation partially satisfies this spec; see `migration-gap-analysis.md` for deltas.

## 1. Manifest

Every Decision Node is a self-describing bundle with a single `manifest.json` at the root:

```jsonc
{
  "id": "string, kebab-case, globally unique",
  "version": "semver",
  "creator": { "name": "string", "handle": "string" },
  "meta": {
    "codename": "string",
    "title": "string",
    "logline": "string",
    "duration": "string, e.g. '20–40 min'",
    "tone": "string",
    "location": "string",
    "year": "string",
    "category": "Corporate | Legal | Aerospace | Civic | Personal | Other",
    "difficulty": 1,
    "status": "available | classified | locked"
  },
  "scene":      { "image": "asset path", "filter": "css filter?", "mood": "string?" },
  "atmosphere": { "soundtrack": "asset path?", "...": "FX overrides" },
  "opening":    { "text": "verbatim first assistant turn including chips line" },
  "director":   { "systemPromptRef": "prompts/director.md" },
  "canon":      { "schemaRef": "canon.schema.json", "dataRef": "canon.json" },
  "archetypes": { "ref": "archetypes/" },
  "presets":    [ { "label": "string", "text": "string", "archetypeId": "string" } ]
}
```

The bundle is the unit of authoring, review, versioning, and publishing.

## 2. Canon

Canon is structured data. Each Decision Node ships its own JSON Schema for canon (`canon.schema.json`), and the manifest references it. The schema is published alongside the case so:

- The Director's canon-block formatter can compile against a known shape.
- Validation catches missing fields before publish, not at runtime.
- Forks may extend the schema without breaking the parent case.

Mandatory top-level sections (names are recommendations, the schema is per-case):

- `world` — when and where the case happens.
- `players` — the role the player inhabits.
- `characters` — every named NPC, their role, their incentive, what they know.
- `objects` — every observable artifact in the scene.
- `history` — the timeline of events leading into the decision.
- `constraints` — the hard facts the Director must never violate.

## 3. Archetypes

Each archetype is a separate file under `archetypes/<id>.json`:

```jsonc
{
  "id": "string, locally unique within case",
  "label": "string, player-facing",
  "matchHints": ["example player phrasings used by Stage A classifier"],
  "timeline": [
    { "beat": "string", "consequence": "string" }
  ],
  "secondOrder": { "<pillar>": "consequence string" },
  "tone": "string, tone the closing paragraph must land in"
}
```

Constraints:
- ≥1 timeline beat, ≥1 secondOrder pillar, ≥1 matchHint.
- `id` must be stable across versions; renaming requires a major version bump and a migration entry in case history.
- Timelines are append-only across minor versions. Reordering or removing a beat is a major version bump.

## 4. Decision presets

Presets are first-class authoring surfaces. Each preset is bound to exactly one archetype id. The published spec requires:

- ≥1 preset per archetype.
- Preset text is first-person, present tense, ≤140 characters.
- No two presets share text.

## 5. Director contract

A Decision Node provides a Director system prompt and is responsible for these guarantees by construction:

- The prompt ends with a programmatically-generated canon block derived from `canon.json` + `canon.schema.json`.
- The prompt enforces the chip protocol verbatim (three chips, 3–10 words, no end punctuation, no emoji, no verbatim repeats).
- The prompt forbids meta self-reference, markdown headings, bullet lists, and emoji.

The runtime may swap the underlying model; the prompt is the contract.

## 6. Analyzer contract

The Analyzer is provided by the platform, not the case. The case provides only the data the Analyzer needs: archetypes (with their canon timelines, secondOrder maps, and tones), and the canon block. The Analyzer's output schema (`headline`, `timeline`, `assumptions`, `evidenceUsed`, `evidenceIgnored`, `alternatives`, `closing`, `reasoningAssessment`, `beliefTrajectory`) is fixed by the platform and is not case-configurable.

## 7. Persistence contract

A session produces a `SavedSession`:

```jsonc
{
  "caseId":      "string",
  "caseVersion": "semver",
  "startedAt":   "ISO 8601",
  "transcript":  [ { "role": "user|assistant|system", "text": "string", "ts": "ISO 8601" } ],
  "decision":    { "text": "string", "presetId": "string?", "confidence": 0 },
  "decidedAt":   "ISO 8601",
  "analysis":    "DecisionAnalysis (platform schema)",
  "archetypeId": "string"
}
```

Storage is platform-managed. Sessions are immutable once `decidedAt` is set.

## 8. Versioning rules

- **Patch** — typo, prose polish in the Director prompt that does not change behavior, image swap.
- **Minor** — added archetype, added preset, new canon field, new history step.
- **Major** — renamed archetype id, altered timeline of an existing archetype, removed canon field, changed opening text.

Old SavedSessions always render against the case version they were played at.

## 9. Validation pipeline

A case cannot publish until:

- Manifest parses against the platform schema.
- Canon parses against the case's own `canon.schema.json`.
- Every archetype passes the archetype schema.
- Every preset's `archetypeId` resolves.
- The Director prompt compiles with the canon block embedded.
- A smoke session can be played end-to-end through Director + Analyzer in the platform's CI environment.
- A human editor signs off on tone and the non-negotiables in `constitution/08-non-negotiables.md`.

## 10. Out of scope (deliberately)

- Branching narrative graphs across multiple decision points.
- Inventory or stat systems.
- Multiplayer.
- Real-time multiplayer commit comparison.
- Cross-case persistent state inside a case.
