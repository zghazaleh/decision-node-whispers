# Elevating Decision Node

A focused set of upgrades across five axes. Each item is scoped so it can ship independently — pick any subset to approve.

---

## 1. Ambiance (felt, not seen)

- **Per-mission scores.** Today only `mission-01` has a soundtrack. Author 3 more low-contrast beds (mission-02/03/04) with distinct harmonic centers so each mission has its own emotional fingerprint.
- **Pressure-reactive layers, not just volume.** Extend the ambient engine from "volume + detune" to a two-stem mix: a *bed* stem (always on) and a *tension* stem that fades in as time/turns deplete. Far more cinematic than a single track getting louder.
- **Diegetic punctuation.** Sub-audible cues on key beats: a low sub-thump when a stance is committed, a soft paper rustle on new evidence, a single bell on analysis-ready. Mixed −18 LUFS so they read as texture, not UI.
- **Heartbeat under the timer.** When time-remaining drops below 25%, introduce a 60→80bpm pulse synced to the lighting pressure curve already in place.

## 2. Aesthetics

- **Typographic identity pass.** Lock a distinctive display/serif pair (e.g. *Fraunces* + *Inter Tight*, or *Editorial New* + *Söhne*) and apply it consistently to mission titles, archetype names, and the Decision DNA panel. Avoid the default-AI look.
- **Mission-scene grading.** Each mission gets its own color grade (LUTs via CSS `filter`) — warm tungsten for Rome, cold mercury for a boardroom, etc. Already wired via `MissionScene.filter`; needs art-direction per mission.
- **Decision DNA visual upgrade.** Replace the eight horizontal bars with a single radar/octagon plot plus the bars as a secondary read. The radar becomes the shareable artifact (see retention below).
- **Cinematic letterboxing during dialogue.** Thin top/bottom bars (5vh) that animate in when a new beat lands; subtle but instantly elevates the mode-shift from "chat app" to "scene."
- **Microtype + numerals.** Tabular numerals on the timer and DNA scores; small-caps for chip labels; tighter tracking on display headings. Cheap, very high perceived-quality return.

## 3. Experience

- **Beat pacing.** Insert a 600–1200ms typewriter or fade-in cadence on the assistant's character lines so dialogue lands like a scene, not a chat dump. Skippable on tap.
- **Evidence ledger.** A collapsible side rail that auto-captures facts the player has seen vs. ignored. Feeds directly into the Information Gathering and Bias Resistance scores and makes the analysis feel earned.
- **Confidence slider on Commit.** Before committing, ask the player to mark confidence 0–100. This is the single biggest input to a real Calibration score (Brier-style) and unlocks far better post-mission feedback.
- **Post-commit "the room reacts" beat.** A 3–5s scripted reaction (one line per key character + a scene-grade shift) before the analysis screen. Currently the jump from Commit → Analysis is abrupt.
- **Resumable missions.** Persist turn history + timer per mission so a closed tab doesn't lose the run.

## 4. Appeal (first-impression + shareability)

- **Landing/menu redesign.** A single cinematic still + one line ("You have twelve minutes. Rome is burning.") + a Begin button. Replace any list-y mission picker on first load.
- **Mission cards with stakes, not summaries.** Each mission card shows: era, time budget, one provocation sentence, and a locked/unlocked state. Cards use the mission's own scene + grade.
- **Shareable Decision DNA card.** Export the radar + emerging-pattern sentence as a 1200×630 PNG (canvas render) with the mission name. This is the organic-growth lever.
- **Named archetypes on the result screen.** Surface the matched archetype (already in the engine) prominently — "You played this as *The Stoic Delegator*." People share labels.

## 5. Return-value (retention)

- **Daily provocation.** One short (3–5 turn) micro-mission per day with a global leaderboard on a single dimension (e.g. "Today: Calibration"). Cheap to author, strong habit loop.
- **DNA evolution timeline.** A `/profile` route showing how each dimension has moved over the last N missions as a sparkline. Players come back to watch themselves change.
- **Replay with a constraint.** "Replay Rome — but you cannot ask any question twice." Constraints make a finished mission feel new and produce a different DNA contribution.
- **Compare mode.** "Your DNA vs. average player" and "vs. a named historical decider" (Lincoln, Stoic, etc.) — purely cosmetic comparisons drive return visits.
- **Unlockable missions tied to DNA thresholds.** E.g. a mission unlocks at Confidence Calibration ≥ 70. Gives the score panel teeth.

---

## Suggested first slice (one week of work)

If you want a single high-leverage bundle to approve now, I'd build:

1. Confidence slider on Commit (calibration becomes real)
2. Two-stem pressure-reactive ambient (mission-01 only first)
3. Radar visualization for Decision DNA + shareable PNG export
4. Named archetype surfaced on analysis screen
5. Letterboxed dialogue + typewriter cadence

Together these change how the game *feels*, *concludes*, and *gets shared* — without touching mission content.

---

## What I need from you

Pick any combination of the five sections (or the "first slice"), and I'll come back with a concrete implementation plan for just those items.
