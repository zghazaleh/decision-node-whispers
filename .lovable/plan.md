# Make Mission One a real case, not improv

Today the engine is fully open: the system prompt describes the scene to the LLM in prose, and the analyzer judges *process*, not consequences. That means facts can drift between turns and outcomes are invented every run. We'll split the mission into two layers:

1. **Canon** — deterministic, machine-readable ground truth the LLM must never contradict.
2. **Outcome model** — a finite set of decision archetypes, each with a pre-authored consequence timeline. The LLM classifies the player's decision into one archetype; the timeline is then deterministic.

The free-chat improv stays — only the *facts* and the *consequences* become fixed.

## What we build

### 1. `src/lib/missions/mission-01/canon.ts` — the fact base

A typed object, single source of truth:

- `world`: date/time, location, company, product
- `characters`: id, role, stance, what they know, what they'll reveal under what prompt
- `objects`: memo contents (the actual technical detail of the deception artifact), the note, laptop contents, photograph backstory
- `timeline`: what happened in the 36h before wake-up, hour by hour
- `constraints`: hard facts the LLM must never violate ("Helios ships in 6 days", "Amara's memo is 14 pages", "Marcus signed off at 21:40 the night before")

### 2. `src/lib/missions/mission-01/outcomes.ts` — the consequence model

5–7 **decision archetypes**, each with:

- `id` (e.g. `ship_on_time`, `hold_two_weeks`, `narrow_release`, `indefinite_pause`, `step_down`, `delegate`)
- `matchHints`: short phrases that characterize this stance (used by the classifier)
- `timeline`: 4–6 pre-authored beats `{ beat, consequence }` covering T+1 day, T+1 week, T+1 month, T+6 months, T+1 year
- `secondOrder`: what happens to ORION-9, Aperture, Helios, Marcus, Amara, the board, Elena personally
- `tone`: how the closing should land (somber, vindicated, ambiguous…)

These are authored once. They are the "right" answers the game actually knows.

### 3. Two-stage analysis

Replace the single `analyzeDecision` call with:

**Stage A — classify** (`generateObject`, tiny schema):
```
{ archetypeId: enum(...), confidence: number, rationale: string }
```
Input: the player's decision text + reasoning + transcript. Output: which archetype this is.

**Stage B — narrate** (`generateObject`, current AnalysisSchema):
Input: the chosen archetype's pre-authored `timeline` + `secondOrder` + the transcript. The LLM's job is now *narration and personalization* of fixed beats, not invention. The `timeline` field in the output is seeded from canon; the model can rephrase but not invent new beats.

This means: same decision → same consequences, every run. Different player reasoning → different *prose*, same *facts*.

### 4. Lock the chat to canon

In `src/routes/api/chat.ts`, append the canon (serialized, compact) to the system prompt with a hard rule: "These facts are ground truth. Never contradict them. Never invent facts not listed here. If asked something not in canon, have the character say they don't know." This stops drift mid-conversation.

### 5. Wire presets to archetypes

The 5 preset stances in `DecideModal` already map cleanly to archetypes — give each preset an `archetypeId` so picking a preset skips Stage A entirely and goes straight to the deterministic timeline. Free-chat decisions run Stage A.

## Files touched

- new: `src/lib/missions/mission-01/canon.ts`
- new: `src/lib/missions/mission-01/outcomes.ts`
- edit: `src/lib/mission-brief.ts` — import canon, inject as ground-truth block
- edit: `src/routes/api/chat.ts` — already picks up the new prompt
- edit: `src/lib/analysis.functions.ts` — two-stage flow, seed timeline from canon
- edit: `src/routes/mission.tsx` — presets carry `archetypeId`

## Open questions before I build

1. **How many archetypes?** I'd suggest 5 (matching your current presets) + 1 fallback `unclassified` for genuinely novel free-chat decisions. OK?
2. **How deterministic on prose?** Two options:
   - **Strict**: timeline beats are verbatim from canon, LLM only writes `assumptions/evidenceUsed/evidenceIgnored/alternatives/closing`.
   - **Loose**: LLM may rephrase beats but must preserve the consequence's meaning and order.
   I lean **strict** — it's what makes the game feel like a real case.
3. **Should Mission Two follow the same shape now**, or ship Mission One first and template later?
