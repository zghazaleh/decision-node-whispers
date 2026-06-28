
# Mission Lists — Mockup PDFs (3 options)

You asked for visual mockups of the feature options as PDFs. No code yet — these are static, high-fidelity design artifacts you can review, mark up, and forward. After you pick a direction, we move to schema + build.

## What the feature has to do (shared across all options)

- Save any case file into one or more **personal lists** (default seed: "Missions I'd run again", "Watchlist", "Cited in writing").
- Create / rename / delete custom lists.
- Surface those lists on a **profile page** (`/u/$handle` or `/me`) as the primary content of the profile.
- Optional per-list visibility: private / unlisted / public — visual treatment shown in mockups, decided later.

## Three directions to mock up

Each will be a single multi-page PDF (cover + 3–4 key screens: list creation, case-file save affordance, profile view, list detail), rendered in the existing Decision Node visual language (dark, editorial, case-file typography, accent hairlines — matching `missions.tsx` and the constitution's design principles).

### Option A — "The Dossier Shelf"
Profile reads as an archivist's shelf. Lists are **labeled folios** stacked vertically, each with a spine, count, and three peeked case-file covers. Clicking opens a folio detail view that mirrors the existing `/missions` grid. Save affordance on a case file = a small "File into…" action that opens a folio picker.
- *Energy:* archival, Criterion-Channel-meets-FOIA. Slow, prestige.
- *Profile feels like:* a curator's shelf.

### Option B — "The Editor's Desk"
Profile is a **two-column editorial layout** — left rail of lists (with curator-style intros the user can write), right column showing the active list as a vertical editorial feed (poster + logline + the user's own note per case). Save affordance = "Add to list…" with an inline note field.
- *Energy:* Letterboxd × Are.na × a writer's commonplace book.
- *Profile feels like:* a published column.

### Option C — "The Case Wall"
Profile is a **dense visual grid / bento wall** of every saved case across all lists, color-tagged by list. Lists act as filters/chips above the grid rather than separate pages. Save affordance = a single tap to "Save" + secondary tag picker.
- *Energy:* Pinterest × evidence board × kinetic.
- *Profile feels like:* a working investigation wall.

## Deliverable

Three PDFs in `/mnt/documents/`:
- `mission-lists-A-dossier-shelf.pdf`
- `mission-lists-B-editors-desk.pdf`
- `mission-lists-C-case-wall.pdf`

Each ~4 pages: (1) profile overview, (2) list detail, (3) save flow from a case file, (4) create/edit list. Rendered as design comps (HTML → PDF via headless Chromium) using the existing palette and typography cues. No code changes to the app.

## After you pick

Lock the direction, then a follow-up turn handles:
- DB schema (`lists`, `list_items`, RLS scoped to `auth.uid()`, public-read policy for public lists)
- Profile route under `/u/$handle` (public) + `/me` (authenticated)
- Save-to-list UI wired into existing `MissionCard` / mission page
- Auth gate for the save action (inline "Sign in to save" CTA on public routes)

## One question before I render

Profile URL shape — do you want **public shareable profiles** at `/u/$handle` (so a list can be linked and indexed), or **private-only** lists visible to the signed-in owner at `/me`? This changes the profile overview mockup meaningfully (public adds handle, bio, share affordances; private is more utilitarian).
