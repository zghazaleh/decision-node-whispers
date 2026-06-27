# Case Structure

A "case" is a single playable scenario. Each case is one **mission engine** registered at startup.

## Types

Source: `src/lib/missions/types.ts`.

```ts
type ArchetypeBeat = { beat: string; consequence: string };

type Archetype = {
  id: string;
  label: string;
  matchHints: string[];              // example player phrasings → Stage A classifier menu
  timeline: ArchetypeBeat[];         // authored consequences, T+1d → T+1y
  secondOrder: Record<string, string>; // per-pillar ripple (e.g. orion9, helios, elena)
  tone: string;                      // tone the analyzer's closing paragraph must land in
};

type DecisionPreset = {
  label: string;
  text: string;                      // verbatim first-person decision sentence
  archetypeId: string;
};

type MissionOpening = { text: string };       // verbatim first assistant message
type MissionScene   = { src: string; filter?: string; mood?: string };  // presentation only

type MissionEngine = {
  id: string;
  systemPrompt: string;              // full Director prompt + canon block
  opening: MissionOpening;
  scene: MissionScene;
  archetypes: Record<string, Archetype>;
  archetypeIds: string[];            // ordered, excludes "unclassified"
  archetypeMenuForClassifier: () => string;
  getArchetype: (id: string) => Archetype | null;
  decisionPresets: DecisionPreset[];
  canon: MissionCanon;               // arbitrary mission-specific ground-truth object
};
```

## Registry

Source: `src/lib/missions/registry.ts`.

- Each mission engine is `register`ed at module load.
- `register` runs `validateMissionEngine` (`src/lib/missions/validation.ts`) before inserting into the in-memory `REGISTRY`. Failures are logged via `console.error` with a precise field list and the engine is **not** added.
- Lookups:
  - `getMissionEngine(id)` → `MissionEngine | null`. Used by `/api/chat` and `analyzeDecision`.
  - `requireMissionEngine(id)` → throws with the validation message if the engine failed to register.
  - `listMissionEngineIds()` → ids that passed validation.
  - `getMissionEngineValidationErrors(id)` → recorded errors for any engine that failed.

## Validation rules

Source: `src/lib/missions/validation.ts`. Zod schema + cross-field checks.

Per-field:
- All string fields (`id`, `systemPrompt`, `opening.text`, `scene.src`, archetype `id|label|tone`, beat `beat|consequence`, preset `label|text|archetypeId`) must be non-empty after trim.
- `archetypes` map must have ≥1 entry; each archetype needs ≥1 `matchHint`, ≥1 `timeline` beat, ≥1 `secondOrder` entry.
- `archetypeIds` must be non-empty.
- `decisionPresets` must be non-empty.
- `canon` must be an object with ≥1 top-level field.

Cross-field:
- Every `archetypeIds` entry must exist in `archetypes`.
- For each `archetypes` entry, the map key must equal `archetype.id`.
- Every `decisionPresets[i].archetypeId` must exist in `archetypes`.

A failing engine is silently absent from the registry; `requireMissionEngine` will surface the formatted error message when accessed.

## Per-case folder layout

```
src/lib/missions/<mission-id>/
  index.ts      # SYSTEM_PROMPT, DECISION_PRESETS, OPENING_TEXT, exported MissionEngine
  canon.ts      # CANON object + canonGroundTruthBlock() helper
  outcomes.ts   # ArchetypeId union, ARCHETYPES map, ARCHETYPE_IDS,
                # getArchetype(id), archetypeMenuForClassifier()
```

### `index.ts`

Assembles the engine:

1. Imports `CANON` and `canonGroundTruthBlock` from `./canon`.
2. Imports `ARCHETYPES`, `ARCHETYPE_IDS`, `getArchetype`, `archetypeMenuForClassifier` from `./outcomes`.
3. Defines the full Director system prompt as a template literal ending in `${canonGroundTruthBlock()}`.
4. Defines `DECISION_PRESETS` — each preset's `archetypeId` is typed `satisfies ArchetypeId` so the compiler enforces alignment.
5. Defines `OPENING_TEXT` — verbatim first assistant turn, including italic character label and the chips line.
6. Exports `missionOneEngine: MissionEngine` (or `missionTwoEngine`, etc.).

### `canon.ts`

Exports a `CANON` literal whose shape is mission-specific. For Mission 01 the top-level keys are `world, company, decisionWindow, player, characters, objects, history36h, constraints`. The exported `canonGroundTruthBlock()` flattens it into a single block the Director appends as ground truth.

### `outcomes.ts`

Defines the union of archetype ids for this case (e.g. `"ship_on_time" | "hold_two_weeks" | "narrow_release" | "indefinite_pause" | "step_down" | "unclassified"`) and exports the `ARCHETYPES` record (excluding `"unclassified"`). Each archetype's `timeline` is the authored canonical consequence sequence the analyzer is forbidden to alter.

## Player-facing metadata

Source: `src/lib/missions.ts` — `MISSIONS: MissionMeta[]`.

```ts
type MissionStatus = "available" | "classified" | "locked";

type MissionMeta = {
  id: string;
  number: string;        // "01"
  codename: string;
  title: string;
  logline: string;       // first-line narrative hook
  status: MissionStatus;
  route?: string;
  duration?: string;     // e.g. "20–40 min"
  tone?: string;         // e.g. "Tense · Suspended"
  location?: string;
  year?: string;
  category?: string;     // "Corporate" | "Legal" | "Aerospace" | "Civic"
  difficulty?: 1 | 2 | 3 | 4 | 5;
  creator?: string;      // reserved for community cases — currently "House Edition"
  version?: string;      // reserved — currently "v1.0"
};
```

This metadata feeds the case-selection screen. It is **not** consumed by either LLM; the Director gets the system prompt + canon block, and the analyzer gets the engine + transcript.

## Session storage

Source: `src/lib/mission-store.ts` — `localStorage`-backed `SavedMission` per case:

```ts
{
  missionId, messages: UIMessage[], startedAt,
  decision?, reasoning?, analysis?: DecisionAnalysis,
  decidedAt?, archetypeId?, confidence?    // 0..100
}
```

Keys: `decision-node:mission:<id>` per case, `decision-node:active-mission` for the last one touched.

## Adding a new case

1. Create `src/lib/missions/<new-id>/canon.ts`, `outcomes.ts`, `index.ts` following the existing pattern.
2. Pick scene image, import it in `index.ts`.
3. Define the archetype set — every distinct stance the player might commit to. Write timeline + secondOrder + tone for each.
4. Define `DECISION_PRESETS` for the Decide modal; each entry's `archetypeId satisfies ArchetypeId`.
5. Write the system prompt, end it with `${canonGroundTruthBlock()}`.
6. Export `<newName>Engine: MissionEngine`.
7. Register in `src/lib/missions/registry.ts` by importing and calling `register(<newName>Engine)`.
8. Add a `MissionMeta` entry in `src/lib/missions.ts`.
9. Validation runs automatically at module load; check the dev server console for any error block titled `Mission engine "<id>" failed validation:` and fix before shipping.
