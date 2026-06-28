## Goal

Seed the Discovery & Marketplace architecture (doc §10) inside the existing `/missions` ledger so it scales from 10 → thousands without changing the soul. Focused on the "two bets to start now":

1. Reusable atoms — one `<MissionCard>`, one `<HeroDetail>`, one `<Rail>` scaffold.
2. A signal-logging substrate — completion, analysis-read depth, theme affinity, choices, case-level plays.

Plus the *Now phase* shape: **Today hero → collection rails → filterable ledger**.

Out of scope (later phases): search, faceted browse routes, profile-fit recommender, curator program, comparative post-decision insight, Gate/tiers gating.

---

## Changes

### 1. New atoms (`src/components/discovery/`)

- `MissionCard.tsx` — compact card used by every rail. Props: `mission`, `variant` (`"poster" | "row"`), optional `resonance` badge. Pulls art via existing `getSceneSrc` / `SceneArt`. Clean card: no star rating, no rank number, no "% chose X". Tracks impression on mount via signal logger.
- `HeroDetail.tsx` — the existing Today hero, extracted as a reusable component. Takes `mission` + an `eyebrow` label (`"Today"`, `"Featured"`, etc.) and an `onEnter` callback.
- `Rail.tsx` — horizontal-scroll scaffold with eyebrow label, optional accent line, snap scrolling, mobile-safe overflow. Renders `MissionCard`s in `"poster"` variant.

### 2. Signal logger (`src/lib/discovery/signals.ts`)

A tiny localStorage-backed event log. No backend yet — the doc explicitly says "log the signals now" so the recommender has history to exist before there are thousands of cases.

Events: `impression`, `open`, `commit`, `analysis_read` (with `depthPct`), `theme_dwell`. Each is `{ type, missionId, theme?, ts, meta? }`. Capped at ~1000 entries, FIFO.

Derived selectors (sync, pure):
- `getThemeAffinity()` → `{ [theme]: weight }` from commits + analysis_read.
- `getPlayCount(missionId)` → number (commits).
- `getResonance(missionId)` → coarse band (`"quiet" | "felt" | "widely-felt"`) computed from local commits + impressions across all users we *can't* see — so for now it's a placeholder pulled from a hard-coded per-mission seed map plus local boosts. Framed as "many are sitting with this," never a count.

Wired in at:
- `MissionCard` — `logImpression` on mount.
- `commit()` in `missions.tsx` — `logOpen`.
- `mission.$id.tsx` post-decide path — `logCommit` (theme included).
- `analysis.tsx` scroll handler — `logAnalysisRead({ depthPct })` at 25/50/75/100%.

### 3. Rewire `/missions` to the new shape

In `src/routes/missions.tsx`:

- Replace the inline Today block with `<HeroDetail mission={today} eyebrow="Today" onEnter={commit} />`.
- Add **one** curated rail above the ledger: **"New from the Guild"** — the 6 most recently authored missions by `MISSIONS` order, rendered as `<Rail label="New from the Guild" eyebrow="Fresh" items={…} />`. (Personalized "For how you think" rail is wired only when we have analysis_read signal — falls back to Guild rail until then.)
- Keep the existing filterable ledger below as the "browse" surface (it already plays the §10 "ledger becomes filtered results" role).
- Header copy unchanged.

### 4. Surface a *gentle* resonance marker on the cards

A small italic line on `MissionCard` poster variant: "felt by many" / "quietly held" / nothing — driven by `getResonance()`. **Never** a count, arrow, or rank. Off by default for cases with no resonance band.

### 5. No constitution-violating UI

Verified against doc §"forbidden vs. allowed":
- No leaderboards, no player ranks, no "% chose X", no rating-as-rank, no Top-N counts. The resonance marker is words only.

---

## Technical notes

- All new code is presentation + a localStorage util — no schema, no server fn changes.
- `analysis.tsx` gets a single `useEffect` IntersectionObserver to fire 25/50/75/100% depth events; otherwise untouched.
- `MISSIONS` in `src/lib/missions.ts` already exposes `theme`; no data changes needed.
- Reuse existing tokens (`accent`, `foreground`, `muted-foreground`) — no new design tokens.
- `Rail` uses `overflow-x-auto snap-x snap-mandatory` with `scrollbar-width: none` + WebKit shim already common in the codebase.

---

## Files

New:
- `src/components/discovery/MissionCard.tsx`
- `src/components/discovery/HeroDetail.tsx`
- `src/components/discovery/Rail.tsx`
- `src/lib/discovery/signals.ts`

Edited:
- `src/routes/missions.tsx` — swap Today block → `HeroDetail`; insert Guild rail; log `open` on commit.
- `src/routes/mission.$id.tsx` — log `commit` after `handleDecide` success.
- `src/routes/analysis.tsx` — log `analysis_read` at depth thresholds.

---

## Verification

- `tsgo` clean.
- `/missions` renders Today hero → Guild rail → ledger, no layout regressions on 390px viewport.
- Cards never show counts or ranks. Resonance, when shown, is words.
- After committing a decision and scrolling analysis, `localStorage["dn.signals"]` contains `commit` + `analysis_read` events.