# Open Questions

The only file in `current-state/` that may contain forward-looking notes. Each item is a question or ambiguity surfaced while reading the code today — not a proposal, and not a commitment to act.

## Catalog / engine drift

- `src/lib/missions.ts` and `src/lib/missions/registry.ts` are two parallel sources of truth keyed on the same id. Should they cross-validate at startup (e.g. warn if a `MISSIONS` entry has no engine, or vice versa)?
- `MissionMeta.status` includes `"classified"` and `"locked"`, but every shipped mission is `"available"`. Is the gating intended for future use, or dead code today?
- `MissionMeta` declares `route?: string`; nothing in code reads it. Intent vs. abandoned field?

## Canon shape

- `validation.ts` accepts any non-empty `canon` object. The fields `canonGroundTruthBlock()` reads in `mission-01/canon.ts` (and presumably in 02/03/04) are not validated — a missing field would render `"undefined"` into the system prompt. Should there be a per-mission canon shape declaration?
- Each mission's canon uses a different top-level shape. Is that intentional (per-genre flexibility) or an organic drift that should be normalized?

## Chip protocol enforcement

- Chips are governed entirely by the system prompt: "always exactly three", "3–10 words", "no terminal punctuation", "never repeat a chip the player has already used verbatim". The client parser (`extractChips`) tolerates a missing block (renders no chips) and caps at 4 chips. There is no repair pass and no model retry. How tolerant is the live model on this in practice? Is there value in a fallback?

## `analyzeDecision` failure modes

- Stage A classifier failure is swallowed (`archetypeId = null`); the analysis then renders without an archetype label and with a model-authored timeline. Should the user see any signal that the canon path was skipped?
- `AnalysisInput.missionId` defaults to `"mission-01"`. A client bug that drops the field silently mis-analyzes other missions. Should the default be removed in favor of an explicit error?
- The schema-strict `generateObject` retries are internal to the AI SDK. There's no visible budget / timeout from this codebase. What happens to UI state on a long-running retry — is the "Analyzing…" panel bounded?

## Decision Profile scoring

- All scoring thresholds (`+6 strengths`, `+18 calibrat-keyword`, `-22 overconfid-keyword`, etc.) are magic numbers. Are they intentionally tuned, or first-draft values? They effectively define what counts as a "good" decision-maker.
- Keyword-based scoring depends on the analyzer's English vocabulary. If the model paraphrases ("measured" vs. "calibrated"), scores swing without any visible cause. Is this acceptable?
- Replay semantics: a re-played mission overwrites the previous contribution, `missionsCompleted` is not bumped, but the rolling-average weights move. Is "replay overwrites" the right behavior for measuring growth?
- 30-contribution cap silently drops oldest history. No UI surfaces this.

## Telemetry semantics

- `messageCount` includes the synthetic opening. `investigationSeconds` is total wall-clock including idle. Is that the intended definition of "investigation"?
- `mission_plays` has no per-user concept and no dedup; replays inflate `plays`. Is the displayed "Plays" stat on `/missions` meant to be sessions, players, or completions?
- `difficulty_rating` is read and averaged, but no UI in this codebase appears to submit it. Where does it come from?

## State / persistence

- Four `localStorage` keys (`decision-node:mission:<id>`, `decision-node:active-mission`, `decision-node:profile`, `dn:sound`). No migrations, no versioning beyond `DecisionProfile.version`. Should other keys also carry a version?
- `/missions` reads `dn:sound` once via an IIFE; toggling in a mission doesn't propagate back without remount. Intended?

## Director / model choices

- `google/gemini-3-flash-preview` is hard-coded in three places (chat, classifier, analyzer). Different temperatures (`0.85` / `0.1` / `0.6`). Is centralization desired?
- The chat route has no per-mission temperature override. Different missions might benefit from different pacing.

## Audio bed

- `cancel()` returns no audio; `stop()` may return an empty Blob if called after cancel. The mic button code should be re-read to confirm both paths are handled, but it's a subtle invariant worth a comment.
- The single-oscillator sub-pad is documented as a fix for prior "choppy" behavior. Is there a regression test or audition page beyond the recently-added `/sound-test`? (Yes: `/sound-test` is the manual audition surface.)
- Heartbeat continues scheduling while muted (gain ramped to 0). Battery/CPU cost is small but non-zero. Intentional?

## Error reporting / dormant code

- `src/lib/error-capture.ts` and `src/lib/error-page.ts` are not consumed anywhere in `src/`. Are they wired in the host runtime, or genuinely dormant?
- `AnalysisBoundary` does not call `reportLovableError`. Was that intentional or an omission?

## Architecture-vs-implementation drift

The `docs/architecture/` folder documents intended models for the director, decision analysis, case structure, and prompt I/O. Spot-checks:

- The case-structure architecture doc may describe a normalized canon shape; the code uses per-mission ad-hoc canons. Confirm vs. `docs/architecture/case-structure.md`.
- `docs/architecture/prompt-io-schema.md` likely formalizes inputs/outputs to the analyzer; the current `AnalysisInput`/`AnalysisSchema` is the source of truth. Diff vs. doc?
- `docs/architecture/prompt-test-harness.md` references a test harness; no harness currently runs in CI here. Status?

These drifts should be reconciled before any refactor that claims to "match the architecture".
