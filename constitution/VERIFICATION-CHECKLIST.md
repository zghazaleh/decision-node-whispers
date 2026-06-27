# Constitution Verification Checklist

Run this checklist before merging any change to `/constitution/` or before using the Constitution as the source of truth for a rebuild, migration, or spec update. If any item fails, the Constitution is not complete — fix it before proceeding.

---

## 1. North Star Test

- [ ] The statement **"If someone had to rebuild Decision Node from scratch using only one folder in this repository, this would be the folder."** is true of `/constitution/`.
- [ ] A new contributor with zero prior context could read only this folder and understand *what* the product is, *why* it exists, and *how* it should behave.
- [ ] Nothing critical to the product's identity lives only in code, chat history, or someone's head.

---

## 2. File Inventory (presence)

Confirm every expected file exists and is non-empty:

- [ ] `README.md`
- [ ] `00-product-philosophy.md`
- [ ] `01-first-principles.md`
- [ ] `02-design-principles.md`
- [ ] `03-decision-node-spec.md`
- [ ] `04-ai-director-philosophy.md`
- [ ] `05-decision-analysis-philosophy.md`
- [ ] `06-world-building.md`
- [ ] `07-roadmap.md`
- [ ] `08-non-negotiables.md`
- [ ] `09-history.md`

Quick check:
```bash
ls -la constitution/ && wc -l constitution/*.md
```

---

## 3. Structural Integrity (per file)

For each file:

- [ ] Has a clear H1 title matching its filename intent.
- [ ] Opens with a one-paragraph purpose statement ("This document defines…").
- [ ] Uses consistent heading hierarchy (no jumps from H1 → H3).
- [ ] No TODOs, `TBD`, `XXX`, `???`, or placeholder lorem.
- [ ] No code-implementation details that would rot (file paths, function names, package versions) — only conceptual rules.

Quick check:
```bash
rg -n "TODO|TBD|XXX|\?\?\?|lorem|FIXME" constitution/
```

---

## 4. Conceptual Coverage

The Constitution must answer all of these. Mark each only if a specific file/section answers it directly:

**Identity**
- [ ] What is Decision Node, in one sentence?
- [ ] Who is it for?
- [ ] What is it explicitly *not*?

**First principles**
- [ ] Curiosity before certainty — stated and explained.
- [ ] No win-states / no correct answers — stated and explained.
- [ ] The interface disappears — stated and explained.

**AI behavior**
- [ ] Director: in-world only, character-consistent — defined.
- [ ] Analyzer: process-focused, separates luck from skill — defined.
- [ ] Canon guarantee — defined with an example.
- [ ] Hard line between Director and Analyzer voices — stated.

**Design**
- [ ] Tone, pacing, and typography rules.
- [ ] What the UI must never do (e.g. gamification, scores, badges).

**World**
- [ ] How worlds/archetypes/cases relate.
- [ ] What makes a "canon" case.

**Roadmap & history**
- [ ] Where the product is going (next 1–3 horizons).
- [ ] Why earlier directions were abandoned.

**Non-negotiables**
- [ ] An explicit list of things that must never change without re-opening the Constitution.

---

## 5. Internal Consistency

Cross-file contradiction checks:

- [ ] No principle in `01-first-principles.md` is violated by guidance in `02-design-principles.md` or `04`/`05`.
- [ ] Director rules (`04`) and Analyzer rules (`05`) do not overlap responsibilities or contradict the "hard line" between them.
- [ ] `08-non-negotiables.md` is a strict subset of rules already justified elsewhere — nothing appears here that isn't grounded in `00`–`07`.
- [ ] `07-roadmap.md` does not propose anything that violates `08-non-negotiables.md`.
- [ ] `09-history.md` explains *why* abandoned directions were abandoned, and those reasons are consistent with current principles.
- [ ] Terminology is uniform: *Director*, *Analyzer*, *canon*, *case*, *archetype*, *world*, *Decision Graph* mean the same thing in every file.

Quick check:
```bash
rg -n "Director|Analyzer|canon|archetype|Decision Graph" constitution/
```

---

## 6. Independence from Implementation

- [ ] No file references a specific AI model name, vendor, or API as a requirement (model choice is a `/docs/spec/` concern).
- [ ] No file depends on TanStack, Supabase, Lovable, React, or any framework to make sense.
- [ ] Removing the entire `/src/` tree would not invalidate a single sentence in `/constitution/`.

Quick check:
```bash
rg -ni "tanstack|supabase|lovable|react|vite|gpt-|claude-|openai|anthropic" constitution/
```
Any hit must be justified (e.g. in `09-history.md` as historical context) or removed.

---

## 7. Spec Alignment (one-way)

The Constitution defines *what must be true*. `/docs/spec/` defines *how v1 implements it*.

- [ ] Every non-negotiable in `08` is reflected as a constraint or contract in `/docs/spec/`.
- [ ] `docs/spec/migration-gap-analysis.md` cites Constitution sections (C) accurately — spot-check 3 citations.
- [ ] No spec document silently overrides a Constitution rule. If it does, the Constitution must be updated *first*, deliberately.

---

## 8. README as Entry Point

`constitution/README.md` must:

- [ ] State the north-star sentence verbatim.
- [ ] List every file with a one-line description.
- [ ] Define the reading order for a new contributor.
- [ ] State the change-control rule: Constitution changes require explicit deliberation, not drive-by edits.

---

## 9. Change-Control Hygiene

- [ ] The last edit to any constitution file was intentional and reviewed (not a side effect of a UI/code change).
- [ ] No file was modified in the same commit as application code unless the commit message explicitly calls out the Constitution change.
- [ ] If anything in this checklist failed, an issue or note has been opened before continuing.

---

## 10. Final Gate

Sign off only when all of the above are checked:

- [ ] North Star statement is true.
- [ ] All files present, structured, and free of placeholders.
- [ ] Conceptual coverage is complete.
- [ ] No internal contradictions.
- [ ] No implementation leakage.
- [ ] Spec aligns one-way with Constitution.
- [ ] README is a valid entry point.
- [ ] Change-control hygiene is intact.

If all ten sections pass, the Constitution is complete enough to be the source of truth for the next decision.
