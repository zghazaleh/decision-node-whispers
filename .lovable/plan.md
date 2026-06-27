A comprehensive copy pass across every player-facing screen and label. The goal is to keep the immersive, high-stakes drama intact while removing the body-snatching marketing hook, sci-fi framing, and UI copy that feels like an AI product demo.

## Scope
All routes, components, meta tags, and mission metadata that contain user-facing text.

## What to change

### 1. Landing page (`src/routes/index.tsx`)
- Tagline: replace "You wake up in someone else's body, moments before the most important decision of their life" with a premise that is mysterious but not sci-fi gimmicky.
- CTA: soften "Select Mission".
- Remove "Mission One" as a label above the title; it reads like a tutorial prompt.
- Keep "Headphones recommended" but consider a quieter variant.

### 2. Missions page (`src/routes/missions.tsx`)
- Headline: replace "Whose decision do you want to live inside?"
- Description: replace "Each mission drops you into a stranger's body..."
- Header label: replace "Dossier · 4 Files" and "More files inbound".
- Card CTAs: replace "Begin" / "Entering" with something more grounded.

### 3. Mission loglines (`src/lib/missions.ts`)
- Refine all four loglines to feel like literary scene openings, not movie trailers.
- Tone descriptors ("Tense · Suspended", etc.) may stay or be refined depending on fit.

### 4. Mission gameplay screen (`src/routes/mission.$id.tsx`)
- Toast/hint messages: replace "Stay in the room a little longer", "The moment hasn't ripened", "Commit to a decision".
- "Decide" button label and locked state hint.
- Quick-action chips and input placeholder if present.

### 5. Analysis screen (`src/routes/analysis.tsx`)
- Section headers: "The decision is made", "Consequence Timeline", "Decision Analysis", "In closing".
- Instructional copy: "Scrub through the turning points. Watch how the outcome assembled itself.", "Not right or wrong. A look at how the choice was made."
- Labels: "Cognitive textures", "What you did well", "Patterns to notice".
- Replay / navigation buttons: "Wake again", "Return".
- "You played this as The [Archetype]" framing.

### 6. Decision DNA card (`src/components/DecisionProfileCard.tsx`)
- Title: replace "Decision DNA".
- Subtitle: replace "Your profile begins here. Every mission re-shapes it."
- "Emerging pattern" label.

### 7. Meta / SEO (`src/routes/__root.tsx`, route heads)
- Update `description`, `og:description`, and `twitter:description` to match the new premise language.

## Approach
Work screen by screen, editing strings in-place. No component structure or logic changes. A single build check at the end to confirm no JSX breakage.