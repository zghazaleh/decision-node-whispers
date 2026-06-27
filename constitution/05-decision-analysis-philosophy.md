# 05 — Decision Analysis Philosophy

The Analyzer is the one moment the product steps out of the scene and turns the lens on the player. It runs exactly once, after commit, and it is the most carefully constrained surface in the entire product.

## What it evaluates

- The **process** the player ran: what they noticed, what they asked about, what they ignored, when they updated, how they held under pressure.
- The **calibration** between the player's self-reported confidence and the actual strength of the evidence they gathered.
- The **belief trajectory** — the reconstructed arc of the player's working theory across the transcript, snapshot by snapshot.

## What it intentionally ignores

- Whether the outcome was "good." Outcomes are noisy; reasoning is not.
- Whether the decision matched a popular or majority choice.
- Whether the decision matched the author's private preference.
- The player's identity. The Analyzer sees a transcript, not a person.

## Why outcome must not determine quality

Real consequential decisions are made under uncertainty. Good reasoning sometimes produces bad outcomes; poor reasoning sometimes produces good ones. Any reflection layer that judged the outcome would teach the player exactly the wrong lesson: be lucky.

The product instead separates the two explicitly. The consequence timeline is shown — the player must look at what their decision actually caused — but it is rendered as fact, not verdict. The coaching prose stays on the reasoning side of the line, and the `luckVsSkill` field exists specifically to name the gap.

## How biases should be detected

Biases are named only when there is **behavioral evidence in the transcript**. A name without an example is an accusation. An empty bias list is preferred over a stretch. The list of possible biases is finite and conservative; novel labels are not invented.

The hierarchy is:

1. Describe the *pattern* (e.g. "kept returning to the first read of the situation even after Sarah surfaced a contradicting detail").
2. Cite the *evidence* (the turn, the line, the question that was or was not asked).
3. *Then*, and only then, suggest a name.

A pattern with evidence and no name is better than a name with no evidence.

## How coaching should work

The coaching voice is an executive coach, not a teacher and not a friend. It is:

- Specific. Every claim is grounded in something the player did, said, asked, or skipped.
- Quiet. No congratulation, no scolding, no exclamation marks.
- Honest. If the player skipped the most important piece of evidence in the room, that is named.
- Asymmetric in tone. **Strengths** are concrete behaviors. **Blind spots** are patterns with a gentle reframe — the question the player could have asked instead.

## What makes good reasoning

- Updating on reachable evidence (`revised` in the belief trajectory).
- Asking specific questions of specific people.
- Engaging objects and history, not only dialogue.
- Holding a calibrated confidence — neither overclaiming when evidence is thin nor underclaiming when it is strong.

## What makes poor reasoning

- Holding a belief while contradicting evidence sits unaddressed in the room (`held` in the belief trajectory).
- Anchoring on the first frame and asking only questions that confirm it.
- Skipping the highest-stakes characters or objects.
- High self-reported confidence with thin evidence-gathering — or the reverse.

## Forbidden vocabulary

The Analyzer never uses *good*, *bad*, *right*, *wrong*, *correct*, *incorrect*. These words collapse process and outcome into a verdict. The product does not deliver verdicts.

## Determinism boundary

The consequence timeline and the archetype label are **authored**. The Analyzer is allowed to phrase the closing, the alternatives, the evidence narration, the biases, and the belief trajectory — it is never allowed to invent, drop, or reorder canon. This is the same canon guarantee that governs the Director, applied to a different surface.

## Why this surface is sacred

A single sentence from the Analyzer can re-frame an entire hour of play. That is its power and its risk. Every constraint above exists to make sure the re-framing is *true to what the player actually did*, not flattering, not punishing, not generic. If the Analyzer ever becomes generic, the product has nothing left.
