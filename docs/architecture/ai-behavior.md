# AI Behavior — Cross-cutting Rules, Guarantees, Failure Modes

## Determinism boundary

The system mixes authored content and generated prose deliberately.

| Surface | Authored (deterministic) | Generated (varies per run) |
| --- | --- | --- |
| Director chat | Opening message; canon facts | All dialogue and sensory beats |
| Decision analysis | Per-archetype consequence `timeline`; archetype `label`; preset decision text | `headline`, `assumptions`, `evidenceUsed`, `evidenceIgnored`, `alternatives`, `closing`, `reasoningAssessment.*`, `beliefTrajectory` |

The analyzer post-processing step (`src/lib/analysis.functions.ts`) **overwrites** the model's `timeline` with `archetype.timeline` whenever an archetype matched. The model can phrase ripple effects in `closing`/`alternatives` using `secondOrder`, but cannot mutate or reorder the canon beats.

## Voice guarantees

Director (per system prompt):
- In-world only. No AI/narrator/system self-reference.
- No markdown headings, no bullet lists, no emoji.
- Italicized one-line sensory beats; `*Character Name*` line above any spoken line.
- Never describes player thoughts or intentions.
- Never volunteers hidden context. Meta or break-character attempts → in-world confusion.
- Always ends with the chips line (`<<chips: "…" | "…" | "…">>`), three chips, 3–10 words each.

Analyzer (per system prompt):
- Never uses "good", "bad", "right", "wrong", "correct", "incorrect".
- Never congratulates, never scolds.
- Never accuses the player of a bias by name without behavioral evidence; biases stay an empty array when unsupported.
- Every claim grounded in something the player did, said, asked, or skipped in the transcript.
- Process is judged separately from outcome (`luckVsSkill`).

## Decision paths

Two paths reach the analyzer:

1. **Preset path** — `DECISION_PRESETS` in the engine. Player picks "Ship", "Hold two weeks", etc. The `archetypeId` is known a-priori, so Stage A classification is skipped and the analyzer goes straight to narration with the authored canon timeline.
2. **Free-text path** — player writes their own decision. Stage A runs at temperature `0.1` against the archetype menu. On success, narration proceeds with the matched canon. On any thrown error, `archetypeId` becomes `null` and narration proceeds with no canon timeline; the model is told to write 4–6 beats itself, "grounded in the transcript".

## Belief trajectory semantics

`reasoningAssessment.beliefTrajectory` (in `src/lib/analysis.functions.ts`) reconstructs how the player's working theory evolved. Each snapshot's `update` field carries a specific meaning the prompt enforces:

- `formed` — the belief appears for the first time.
- `reinforced` — new evidence strengthens an existing belief.
- `revised` — the belief shifted in response to new evidence.
- `abandoned` — the belief was dropped.
- `held` — new contrary evidence appeared but the belief did not move.

The prompt explicitly flags `held` (failure to update on reachable evidence) and `revised` (a clean update) as the most informative.

## Self-reported confidence vs. evidence

The player's commit-time confidence (`SavedMission.confidence`, 0..100) is passed to the analyzer and used solely for the `calibration` field — the model compares it to the strength of the evidence the player actually gathered, calling out over- or under-confidence by what they said and skipped, never by the outcome.

## Failure modes

| Condition | Behavior |
| --- | --- |
| Missing `LOVABLE_API_KEY` (Director) | `/api/chat` returns `500 "Missing LOVABLE_API_KEY"`. |
| Missing `LOVABLE_API_KEY` (Analyzer) | `analyzeDecision` throws `"Missing LOVABLE_API_KEY"`; the calling route surfaces via the analysis page error boundary. |
| Unknown `missionId` (Director) | `/api/chat` returns `400 "Unknown mission: <id>"`. |
| Unknown `missionId` (Analyzer) | `analyzeDecision` throws `"Unknown mission: <id>"`. |
| Malformed engine | `registry.ts` calls `validateMissionEngine`; engine is omitted from the registry, and `console.error` logs `Mission engine "<id>" failed validation:` with a per-field error list. `requireMissionEngine(id)` re-throws the formatted message when called. |
| Stage A classification throws | `archetypeId` falls back to `null`; analyzer narrates without a canon timeline. |
| Model returns an extra/missing/reordered timeline beat | Silently overwritten by `archetype.timeline` in post-processing. The drift is invisible to players. |

## What the system explicitly does *not* do today

- No leaderboards or decision-distribution metrics surfaced to players.
- No server-side persistence of gameplay — `localStorage` only (`src/lib/mission-store.ts`).
- No moderation layer between the player and the Director beyond the system prompt's behavioral constraints.
- The Director has no memory of prior cases the player completed; each session is scoped to one `missionId`.
- The analyzer does not consult the Director and the Director does not consult the analyzer; they share only the engine (system prompt vs. archetypes/canon timeline).

## Observations (from reading)

Notes surfaced during this documentation pass. Not fixed here.

- The Stage A classifier's `rationale` field is requested but unused downstream. It exists to force a committed justification; it is discarded after parsing.
- The Director's first-message opening is rendered locally from `engine.opening.text`, and is also written verbatim into `SYSTEM_PROMPT`. The two strings must be kept aligned by hand — there is no automated check that they match.
- `MissionMeta.status` allows `"classified" | "locked"`, but every shipped case is currently `"available"`. These statuses appear to be reserved for a future case-selection UI.
- `MissionMeta.creator` / `version` are reserved for a future community-authored cases feature; all shipped cases are `"House Edition" / "v1.0"`.
