# 10 — Narration Typography & Text Rendering

The chat surface is not a chat. It is a typeset page that happens to update. Every assistant turn is composed of a small, fixed set of text *kinds*, and each kind has exactly one rendering. The Director writes in this vocabulary; the renderer (`CinematicText` in `src/routes/mission.$id.tsx`) honors it. This file is the canonical contract between the two.

If the page ever looks like a chat transcript — uniform paragraphs, no hierarchy, no white space — the contract has been broken on one side or the other.

## The five text kinds

There are exactly five. No others ship. New kinds require a constitution change, not a one-off CSS class.

### 1. Character label
A character name on its own line, wrapped in `*…*`. Renders as a small, wide-tracked, uppercased label in the accent color. It is a *frame*, not dialogue — short, quiet, sets the speaker.

  Markup: `*Cole Avery*`
  Class:  `text-[0.65rem] tracking-[0.35em] uppercase text-accent/80 mb-2`
  Reads as: a printed cue above a line of stage direction.

A character label is only valid when followed (same block) by dialogue. A bare label with nothing under it is a bug.

### 2. Dialogue
The line directly under a character label. Renders in the display serif at the largest body size in the product — this is the load-bearing voice of the scene.

  Markup: any non-italic line(s) under a `*Name*`
  Class:  `font-display text-2xl sm:text-3xl leading-snug text-foreground/95`
  Reads as: a single weighted sentence on a page of prose.

Dialogue is short. Two to four lines per turn, plus an optional sensory beat. Lush dialogue collapses the typography; it stops feeling weighted because every line is weighted.

### 3. Sensory beat (standalone)
A full italic paragraph standing on its own, wrapped in `*…*` end to end. Renders in the *sans* face at a small size in low-contrast foreground — the visual opposite of dialogue. It is the camera, the room, the weather. Never the player's interiority.

  Markup: `*Rain against tall windows. The CMS cursor blinks.*`
  Class:  `font-sans text-sm italic text-foreground/55 leading-relaxed`
  Reads as: an editor's stage direction in the margin.

One or two sentences. A sensory beat that runs three sentences is prose creep and must be cut.

### 4. Inline italic (within dialogue)
A short italic phrase *inside* a dialogue line, used for a remembered fragment, a piece of read text, a half-thought. Wrapped in `*…*` mid-sentence. The renderer flips it to the sans face at body weight so it visually *recedes* against the surrounding display serif — the eye reads it as a different register, not louder emphasis.

  Markup: `"They wrote *we are still holding the front* — that's it."`
  Class:  `not-italic text-foreground/55 text-base font-sans`
  Reads as: a quoted scrap inside the speaker's line.

Never use inline italics for emphasis. Emphasis in this product is carried by line breaks and white space, never by italics or bold. There is no bold in narration, ever.

### 5. Chips line (closing line, every turn)
A single trailing line in the exact form `<<chips: "..." | "..." | "...">>`. The renderer strips this from the prose flow and presents the three options as tappable chips beneath the dialogue. It is the player's low-cost path forward and the only structured affordance the Director emits.

  Markup: `<<chips: "Aday, who gave us this" | "Pull up the proof file" | "Call Tessa">>`
  Class:  rendered by the chips component, not as text.
  Reads as: a printed footer of next actions.

Three chips, 3–10 words each, no end punctuation, no emoji, separated by ` | `, never repeated verbatim, only on the final line. Already covered in `04-ai-director-philosophy.md`; restated here so the typography contract is complete in one place.

## The rhythm of a turn

A canonical assistant turn, top to bottom:

```
*Rain against tall windows. The newsroom is half-dark.*   ← sensory beat (optional)

*Aday Okonkwo*                                            ← character label
"It's clean, Dana. Every text, the wire, a witness."      ← dialogue

"The front's holding for you. Do I send it?"              ← dialogue (same speaker, new beat)

<<chips: "..." | "..." | "...">>                          ← chips (always last)
```

Blocks are separated by **blank lines** (`\n\n`). The renderer splits on `\n{2,}`; a single newline within a block is a soft wrap inside the same paragraph. A turn without blank lines collapses into one undifferentiated paragraph and reads like chat.

A turn with two speakers stacks two `*Name* + dialogue` blocks, separated by a blank line. Never put two characters' lines under one label.

## What this typography is *for*

The product is asking the player to take a real hour and turn it inward. The typography is the chassis that lets that happen:

- **Display serif for dialogue** says: this is a line worth weighing.
- **Wide-tracked label for names** says: someone is speaking *to you*, and they have a body in the room.
- **Small, italic sans for sensory beats** says: this is the camera, not the script — read it and let it set the air, then move on.
- **Inline italic that *recedes*** says: this fragment is borrowed — a memory, a quote, a thing on a screen — not the speaker raising their voice.
- **Chips footer** says: you are never stranded, but the menu is never the point.

The reason none of these are interchangeable is that the page has to read in three seconds and reward three minutes. If everything is the same size, the eye finds nothing first. If everything shouts (bold, color, caps), nothing shouts.

## Constraints the Director must respect

- **No markdown headings, no bullet lists, no emoji**, ever, in narration. The five kinds above are the only structure available.
- **No bold.** Emphasis is line breaks and silence.
- **No second-person stage direction.** The Director never writes "*You feel your jaw tighten*". The player owns their interiority — sensory beats describe the *room*, not the *reader*.
- **No meta.** No "the scene tightens", no "this is the moment", no "you have N turns left". Pressure is felt through writing length and beat selection, not announced.
- **Two to four lines of dialogue per turn**, plus an optional one-line sensory beat. The renderer rewards short turns by giving each line typographic weight; long turns punish themselves by flattening.
- **Sensory beat goes first or last in a turn**, never sandwiched between two dialogue blocks of the same speaker — it breaks the speaker's rhythm.
- **Inline italics are scraps, not stress.** If a phrase wants emphasis, rewrite the sentence so the structure carries it.

## Constraints the renderer must respect

- The five classes above are the *only* text classes used in mission narration. No new font, no new size, no new color introduced into the chat surface without a constitution change here.
- The space between blocks is `space-y-4`. Tighter feels like chat; looser feels like a slide.
- The display face renders dialogue; the sans face renders both sensory beats and inline italic scraps. Two faces, three voices — never more.
- The renderer never invents structure the markup did not request. No auto-quote-styling, no auto-emdash, no auto-capitalization of names.

## Why a separate file

The Director philosophy (`04-ai-director-philosophy.md`) tells the Director *what to say*. The design principles (`02-design-principles.md`) tell the product *what to look like*. This file is the seam between them — the small, hard rules that make the prose render the way it was authored, every turn, in every mission, without anyone having to think about it.

When a mission stops feeling like the others, the regression is almost always here: an opening that forgot the `*Name*` line, a sensory beat that ran three sentences, a Director reply that returned a markdown bullet list, or a renderer change that quietly shifted the dialogue class. Fix the contract, not the symptom.
