# 03 — The Canonical Decision Nodes

This document defines what a Decision Nodes *is*, independent of how today's code implements it. Eventually this is the standard every community-authored case will be measured against.

## Purpose

A Decision Nodes is a single, self-contained, consequential dilemma authored so that:

- The player is placed in someone else's shoes under pressure.
- The player must gather information from in-world characters and objects.
- The player commits to a decision they own.
- The player receives an honest, structured reflection on *how* they reasoned.

## Required sections

Every Decision Nodes has six structural parts:

1. **Metadata** — codename, title, logline, duration, tone, location, year, category, difficulty, creator, version, status.
2. **Scene** — a single image and short mood line that establishes the world before the first word of dialogue.
3. **Opening** — a verbatim authored first beat. Establishes who the player is, who is in front of them, and the time pressure. Never generated.
4. **Director system prompt** — the persistent in-character constraints the live AI must obey while talking to the player. Includes the chip protocol and the canon block.
5. **Canon** — the deterministic ground truth of this situation. Characters, objects, history, hard constraints. The Director may refuse to speak beyond it; it may never contradict it.
6. **Archetypes & presets** — the finite set of stances the player can land in, each with an authored consequence timeline, second-order ripple effects, and a tone for the closing prose. Presets are one-click phrasings bound to archetypes.

## Player journey

A canonical session is a single arc:

1. **Awakening** — the scene loads, the opening beat lands, audio arms on first gesture.
2. **Interaction** — the player talks to the characters, examines objects, follows their curiosity. Pressure rises with each exchange.
3. **Decide** — a deliberate interruption surface where the player commits, either via a preset or in their own words, with a self-reported confidence.
4. **Analysis** — a coda screen that reflects the reasoning back without judgment of outcome.

Every Decision Nodes must support exactly this arc. Side quests, branching meta-progress, and inventory mechanics are out of scope by design.

## Hidden truths

Every Decision Nodes must contain things the player can find but is never told: a motive that was not on the agenda, an object that re-frames a character, a date in the history log that contradicts the official story. The presence of hidden truths is what separates a Decision Nodes from a survey.

## Characters

A Decision Nodes has between three and seven named characters. Each character has:

- A name and role.
- An incentive that does not perfectly align with the player's.
- At least one thing they know that they will only volunteer under the right question.

NPCs are never neutral information dispensers.

## Evidence

Evidence is everything the player can perceive in-world: lines of dialogue, observable objects, the history log, the chips that the Director surfaces. The analysis layer scores nothing about evidence directly, but it *tracks* which evidence the player engaged with and which they skipped — and uses that to ground its later observations.

## Decision

The decision is the player's commitment. It must be:

- Free-text by default.
- Augmented by a small set of authored presets (one per archetype).
- Accompanied by a self-reported confidence (0–100).
- Irreversible within the session — once committed, the analysis runs and the case is closed.

## Consequences

Consequences are authored, not generated. Each archetype carries a fixed consequence timeline (typically T+1d → T+1y) and a per-pillar second-order ripple. The live model may phrase the closing and alternatives around these beats but may never invent, drop, or reorder them. This is the **canon guarantee**.

## AI requirements

A Decision Nodes requires two AI surfaces:

- A **Director** that streams in-character dialogue and ends every turn with a chips line.
- An **Analyzer** that runs once, post-commit, in two stages: classify the decision into an archetype, then narrate a structured reflection that respects the archetype's canon.

A Decision Nodes must be playable end-to-end without either AI making a single claim that contradicts canon.

## Metadata contract

Metadata is for case-selection UI only. It is never read by either model. It exists so the archive can be browsed and so community cases can be attributed.
