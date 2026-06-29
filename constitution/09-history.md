# 09 — History

A running log of major product decisions, why they were made, and what we expected them to change. Append-only. Newest entries at the top.

Every entry includes: **Date**, **Decision**, **Reasoning**, **Expected impact**.

---

### 2026-06-27 — Constitution established

**Decision.** Create `/constitution` as the permanent product-truth folder, separate from `/docs/current-state` (today's implementation) and `/docs/spec` (future architecture).

**Reasoning.** Implementation drift is inevitable; product philosophy drift is fatal. The codebase preserves *how*; the constitution preserves *why*. Future contributors — human or AI — need a source of truth that is not a snapshot of the latest commit.

**Expected impact.** Every future feature, prompt change, and refactor is now measurable against a stable reference. PRs that violate the constitution can be rejected by citation, not by argument.

---

### 2026-06-27 — Current-state documentation completed

**Decision.** Produce a full `/docs/current-state` documentation pass with no code changes.

**Reasoning.** Before any refactor, the product needed an inspectable record of what actually ships — including the implicit and fragile behaviors that live only in code today (pressure curve, heartbeat threshold, dual mission catalogue, transcription pipeline, audio gesture arming).

**Expected impact.** Future migration work can be planned against a documented baseline. Drift between `docs/architecture` (spec) and the live code is now visible.

---

### Earlier — Decision distribution removed

**Decision.** Do not show players how their decision compares to others.

**Reasoning.** A "78% of players chose X" stat trains the next player to chase the majority. The product is about reasoning under one's own values, not about converging on a popular answer. Distribution stats would corrupt the reflective loop the Analyzer creates.

**Expected impact.** Players finish a case thinking about their decision, not their conformity to a crowd.

---

### Earlier — Decision Analysis re-framed from outcome to reasoning

**Decision.** The Analyzer evaluates *how* the player decided, not *what* the outcome was.

**Reasoning.** Outcome scoring teaches luck. Reasoning evaluation teaches judgment. The product's premise is that good reasoning sometimes loses and poor reasoning sometimes wins, and that the only honest feedback layer is the one that separates them.

**Expected impact.** The `luckVsSkill` field exists. Forbidden words (*good*, *bad*, *right*, *wrong*, *correct*, *incorrect*) are banned in Analyzer output. Strengths and blind spots are grounded in transcript evidence.

---

### Earlier — Canon guarantee made hard

**Decision.** After Stage B narration, the Analyzer's `timeline` is unconditionally overwritten with the authored canon for the matched archetype.

**Reasoning.** Generative models drift. The consequence timeline is a *promise* to the player about the world. A drifted beat would silently lie. Overwrite is the only way to make the promise unconditional.

**Expected impact.** The deterministic boundary between authored canon and generated voice is enforceable. Authors can rely on their timelines being delivered intact.

---

### Earlier — Opening rendered client-side, not generated

**Decision.** The first assistant message of every case is `engine.opening.text`, written verbatim by the author, rendered as a synthetic message — not produced by the model.

**Reasoning.** The first thirty seconds of a case are the most important seconds of the product. They cannot be subject to model variance. They are also where the chip protocol and character voice are established for the rest of the session.

**Expected impact.** Cold-start variance eliminated. Every player enters the same room.

---

### Earlier — Archive terminology adopted

**Decision.** The product describes itself in archive / case-file language, not in game language.

**Reasoning.** "Game" sets expectations of win-states, scores, and replayable optima. "Case" and "archive" set expectations of judgment, gravity, and permanence — which is the experience the product actually delivers.

**Expected impact.** Player expectations align with what the product is. Press, reviewers, and new players describe Decision Nodes accurately.

---

### Earlier — Landing page simplified to increase curiosity

**Decision.** The landing page does not explain mechanics, list features, or showcase screenshots. It states a premise and invites entry.

**Reasoning.** Explanation kills mystery. A player who arrives over-briefed has nothing to discover in the first case. Curiosity is the product's primary engagement mechanic.

**Expected impact.** Higher quality of first session. Players arrive ready to be surprised.
