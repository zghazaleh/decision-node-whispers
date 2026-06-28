
# Decision Node — Platform Evaluation vs. Vision

A read of the current build against the constitution (`00–08`), the Decision Nodes spec, and the long-term roadmap. Verdict per pillar, with the specific files that prove or contradict it, and the gaps worth closing next.

---

## 1. The Core Loop — "Inside a decision, then a mirror"

**Verdict: Strong. This is the part of the vision the product already delivers.**

- Nine authored cases (`src/lib/missions/mission-01..09`) each ship: a system prompt, canonical opening, scene image, atmosphere tuning, archetypes with **authored consequence timelines**, decision presets, and canon ground-truth.
- The Director (`/api/chat`) is per-mission, in-character, chip-protocol enforced — matches `04-ai-director-philosophy.md` cleanly.
- The Analyzer (`src/lib/analysis.functions.ts`) is a two-stage pipeline: classify → narrate. Timelines are **overwritten from canon** after generation (`finalAnalysis.timeline = archetype.timeline`), which honors non-negotiable #13 ("consequences are authored, not generated").
- The new `framework.ts` layer encodes stakes / hiddenTruths / timeLimit / decisionScience / learningObjective for all 9 missions and is asserted before any analysis call — this is what makes the debrief mission-specific rather than a generic bias menu.

**Holds:** #1, #2, #3, #9, #13, #14, #15, #16, #17.

---

## 2. The Director — In-world presence

**Verdict: Strong with one structural risk.**

- Each mission's system prompt names characters, forbids meta, requires the italic name-line format, and pins the chip protocol — consistent with `06-world-building.md` and `08` #11.
- `/api/chat` is stateless across cases; nothing persists Director memory beyond the transcript. Good.

**Risk:** the system-prompt enforcement is per-mission copy-paste. There is no shared invariant layer that *guarantees* every future mission honors: "no markdown headings, no emoji, chip protocol on every reply, never break character." A new author can ship a mission that quietly violates the constitution. The `constitution/VERIFICATION-CHECKLIST.md` exists but is not wired to anything that runs.

---

## 3. The Analyzer & Decision Profile — "Reflection before competition"

**Verdict: Strong on substance, partial on the long-arc vision.**

- Per-axis sub-scores + dimension notes + `reasoningEcho` + `calibrationVerdict` + `beliefTrajectory` are exactly the surfaces `05-decision-analysis-philosophy.md` calls for.
- `decision-profile.ts` accumulates a rolling 8-axis profile across sessions. Matches the "Decision Profile" milestone on the roadmap.
- The profile is **local-only** (`localStorage`, `decision-node:profile`). That is fine for MVP, but the vision ("portrait that follows the player across years, returnable archive") needs server persistence tied to identity.

**Gaps vs. vision:**
- No longitudinal view: a player who replays mission-01 a year later cannot see how their reasoning shifted (roadmap §Archive).
- No per-mission "your prior decision" recall on the case-file card.
- `emergingPattern` is a single sentence; the vision describes a *portrait*, not a tag.

---

## 4. Editorial Aesthetic — "Typography is the system"

**Verdict: On-brand. Quietly excellent.**

- `index.tsx` landing, `missions.tsx` archive, and `analysis.tsx` all use display serif + tight tracking + generous whitespace + film-grain + vignette. No purple gradients, no neon, no badges shouting at the user.
- Ambient audio is per-mission and gesture-armed — psychological pressure, not a countdown timer (#18 honored).

**Small holds against the constitution:** no leaderboard, no decision-distribution stats, no "92% chose X." Confirmed by inspecting `analysis.tsx` and `missions.tsx`.

---

## 5. Mystery & Hidden Knowledge — "Every case has something the player can reach but won't be handed"

**Verdict: Now structurally enforced. New.**

- `framework.ts.hiddenTruths` makes the implicit "buried truth" surface explicit per mission and is fed to the analyzer so `evidenceIgnored` can reference what was reachable. This directly implements #6.
- However, **canon files themselves don't tag** which objects/lines are the hidden-truth surface. The Director can still volunteer a hidden truth on turn 2 if a future prompt drifts. No structural test catches that.

---

## 6. Author Platform — "Anyone can create"

**Verdict: Not started. This is the biggest gap vs. the roadmap.**

- Missions are TypeScript modules under `src/lib/missions/mission-XX/`. Adding a case requires: writing canon, outcomes, index, scene image, soundtrack registration, framework entry, registry entry, and (now) a fixture-validated framework record.
- There is no authoring UI, no schema validation that blocks publish on missing hidden knowledge or missing conflicting incentives, no fork model, no attribution, no versioning beyond git.
- The constitution's promise — "the platform enforces the constitution structurally" (roadmap §Creator platform) — is not yet enforced. `validation.ts` exists but is light.

---

## 7. Non-Negotiables — line-by-line

| # | Rule | Status | Evidence / Gap |
|---|---|---|---|
| 1 | No "correct answer" | ✅ | No archetype is marked correct anywhere. |
| 2/3 | Luck ≠ skill | ✅ | `luckVsSkill` is a required analyzer field. |
| 4 | No leaderboards / distribution stats to player | ⚠️ | `mission-stats.functions.ts` exists and returns percentiles (`getMissionPercentile`) used in `analysis.tsx`. **Check whether what's shown to the player crosses into "92% chose X" territory.** |
| 5 | Interface disappears | ✅ | |
| 6 | Hidden knowledge | ✅ (newly enforced) | `framework.hiddenTruths` + assert. |
| 7 | Every option defensible | ⚠️ | No structural test that each preset has an authored, non-strawman timeline. Manual review only. |
| 8 | NPCs have conflicting incentives | ✅ | Encoded in system prompts. Not machine-checked. |
| 9 | No lecture | ✅ | |
| 10 | Profile describes, doesn't rank | ⚠️ | Sub-scores are 0–100 numbers. Numbers invite ranking. Consider whether the UI presents them as a *portrait* or as *grades*. |
| 11 | Director never breaks character | ✅ | Per-mission prompts forbid it. Not test-enforced. |
| 12 | Canon never contradicted | ✅ | Timeline overwrite in analyzer guarantees this for the consequence list. Dialogue contradictions still possible. |
| 13 | Consequences authored | ✅ | |
| 14 | Decisions irreversible | ✅ | `mission-store` does not support undo. |
| 15 | Player owns interiority | ✅ | Prompts forbid describing player thoughts. |
| 16 | No moralizing vocabulary | ✅ | Analyzer prompt forbids good/bad/right/wrong/correct/incorrect. Not test-enforced. |
| 17 | No bias name without evidence | ✅ | `possibleBiases` capped at 3, "empty array preferred". |
| 18 | No countdown timers | ✅ | Pressure is psychological. |
| 19 | No tutorials / overlays | ✅ | Awakening is in-fiction. |
| 20 | Constitution wins | n/a | Cultural rule. |

---

## 8. Roadmap Alignment

| Milestone | State |
|---|---|
| Current MVP | **Done.** |
| Curated archive | **In progress.** 9 missions across corporate, legal, aerospace, civic, medical, journalism, infra, biotech, diplomatic. Good spread. |
| Decision Profile | **MVP done, local-only.** Server-side, longitudinal, returnable: not started. |
| Archive (browsable, returnable) | **Partial.** `missions.tsx` lists; no "your prior reasoning" recall. |
| Creator platform | **Not started.** |
| Community publishing / forks / institutions / Decision Graph | **Not started.** Correct ordering. |

---

## 9. What I would close next (priority order)

1. **Constitution-as-test.** Convert `VERIFICATION-CHECKLIST.md` and the non-negotiables into automated checks that run in `prompt-harness.yml`: forbidden vocabulary in analyzer output; chip-protocol present on every Director reply; every mission has ≥2 archetypes with non-empty timelines; every mission has a hiddenTruth that is *not* surfaced in the canonical opening.
2. **Audit the player-facing percentile surface.** Decide explicitly: is `getMissionPercentile` shown to players, or is it operator-only? If shown, it likely violates #4.
3. **"Your prior decision" on the case-file card.** Cheapest win toward the Archive milestone — read from `mission-store` and show, on `missions.tsx`, the archetype the player committed to last time (no score, no judgment, just the label).
4. **Author schema + validator.** Extend `validation.ts` so a mission cannot register without: ≥3 archetypes, every archetype with ≥4 timeline beats, framework fully populated, at least one hiddenTruth, scene + atmosphere + opening present. This is the spine of the future creator platform.
5. **Profile-as-portrait pass.** Re-read `DecisionProfileCard.tsx` against #10 — replace any leaderboard-flavored framing with descriptive language. Numbers can stay; the surrounding copy decides whether it reads as a portrait or a grade.
6. **Director invariant layer.** Factor the constitution-required rules (italic name-line, chip protocol, no markdown, never break character, never describe player thoughts) into a single appended block every mission prompt is composed *with*, so future missions inherit them.

---

## 10. One-line summary

The product faithfully delivers the **inner hour** the constitution describes; the unfinished work is the **outer architecture** — durable profiles, returnable archive, machine-enforced authorship — that turns one good hour into "the world's archive of consequential decisions."
