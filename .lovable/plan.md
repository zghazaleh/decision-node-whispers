# Mission Discovery & Social — Benchmark + Options Memo

You want "Apple App Store, but for missions": curated cases, ratings, discovery first, social engagement around them. Before we design or build anything, the deliverable here is a **decision memo**: 5–6 reference experiences pulled apart for what to steal, then 3 distinct organizing models for Decision Nodes with honest tradeoffs. You pick one direction; we move to design directions and then build.

No code changes in this step.

## What I'll research

Six references, chosen because each solves a different facet of "discover a piece of slow, considered content before committing":

1. **Apple App Store / Today tab** — editorial card stack, "Story of the Day", hand-picked collections, ratings as quiet trust signal not leaderboard.
2. **Letterboxd** — list culture, friend activity as discovery, ratings that feel personal not gamified, beautiful poster grids.
3. **MUBI** — 30-films-at-a-time scarcity, a curator's voice as the product, the "Notebook" essay layer attached to each title.
4. **Criterion Channel** — themed collections ("Noir in Color", "Films by Agnès Varda"), context essays, "if you liked X" curatorial logic.
5. **Are.na** — channels as nested curation, low-velocity, contributor-as-collaborator model.
6. **Pitchfork / NYT Interactive** — review-as-artifact: a single piece of content gets a long, designed page with score, essay, sidebar.

For each I'll capture: card anatomy, discovery model (browse / feed / editorial / search), social signals (ratings, comments, lists, follows), pacing, and what would or wouldn't port to a 9-mission interactive drama.

## What I'll propose

Three organizing models for Decision Nodes — these are **the shape of the product**, not visual variations. Each one would later get its own design direction round.

```text
A. THE CURATED STORE              B. THE CRITERION ARCHIVE         C. THE LIVING CASE FILE
─────────────────────             ───────────────────────          ──────────────────────
App Store "Today" energy.         MUBI/Criterion energy.           Genius/Reddit-thread energy.
                                                                    
Home = editorial cards            Home = themed collections        Home = case index
+ "Mission of the Week"           ("Power & Compliance",           Each mission opens into a
+ hand-picked collections         "Bodies & Borders")              dossier: the dilemma + every
+ ratings as small trust badge    + curator essay per mission      archetype's reasoning, ratings,
+ aggregate decision split        + companion commentary           annotations, contested moments.
+ "if you decided X, try Y"       + sparse rotating selection      Social = annotation, not feed.
                                                                    
Discovery: editorial + browse.    Discovery: themed depth.         Discovery: per-case immersion.
Social: light (rate, share).      Social: very light (save).       Social: heavy (debate, annotate).
Velocity: medium.                 Velocity: slow, prestige.        Velocity: deep, niche.
                                                                    
Closest to your stated frame.     Most differentiated.             Most defensible long-term.
Risk: feels generic if not        Risk: needs strong editorial     Risk: requires player volume
exquisitely art-directed.         voice; you become the curator.   to feel alive.
```

For each model I'll spell out: home surface, card anatomy, how ratings work, how a player moves from browse → commit → see-others, what "social" means concretely (and what it deliberately is NOT), and roughly what would change in the existing `/missions` route.

## Format of the deliverable

A single memo posted in chat — not in the repo — with:
- Benchmarks section (each reference: 2–3 sentences + the one thing worth stealing)
- The three models, side by side, with the tradeoff matrix above expanded
- A recommendation pick with reasoning, framed as a starting point not a verdict
- Two follow-up questions to lock in the model before we move to design directions

## After you pick a model

Plan-mode flow continues:
1. You pick A / B / C (or a hybrid you direct).
2. New plan: design directions round using the redesign skill — pin palette + type + layout for the discovery surface, then render 3 visual variants of the chosen model.
3. You pick a direction.
4. Build plan: scope the actual route changes (likely `/missions` becomes the discovery hub, possibly a new `/cases/$id` dossier route, ratings table, etc.) and any backend (ratings, curated collections, annotations depending on model).

## What this plan deliberately does not do

- No code, schema, or route changes yet.
- No commitment on audience/gating — that's a question inside the memo, answered after you see the models.
- No design directions yet — those come after the model is picked, so we're not iterating on visuals for a shape we might throw away.
