import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";

/**
 * Generates the "portrait statement" line shown on the Decision Profile card.
 *
 * The line must:
 *  - name (or clearly evoke) a real decision-science concept that the player's
 *    behavior actually exhibited — cognitive bias, heuristic, or reasoning pattern,
 *  - be expressed in the product's literary / cinematic voice — specific, a little
 *    uncomfortable, the kind of line someone would want to share,
 *  - feel personal to the player's pattern across recent missions, not generic.
 */
const PortraitInput = z.object({
  scores: z.record(z.string(), z.number()),
  topDimensions: z.array(z.string()).default([]),      // strongest 1-2 axes
  weakDimensions: z.array(z.string()).default([]),     // weakest 1-2 axes
  recentSignals: z.array(z.string()).default([]),      // signal tags across last few missions
  recentBiases: z
    .array(z.object({ name: z.string(), evidence: z.string().default("") }))
    .default([]),
  recentBlindSpots: z
    .array(z.object({ pattern: z.string(), reframe: z.string().default("") }))
    .default([]),
  calibration: z.string().default(""),
  luckVsSkill: z.string().default(""),
  missionsCompleted: z.number().default(0),
});

const PortraitSchema = z.object({
  portrait: z
    .string()
    .min(40)
    .max(280)
    .describe(
      "One to two sentences. Names or evokes a specific decision-science concept the player actually exhibited. Cinematic, specific, a little uncomfortable. Never generic personality-quiz language.",
    ),
});

export type PortraitOutput = z.infer<typeof PortraitSchema>;

export const generatePortrait = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => PortraitInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    const system = `You write the "portrait statement" that appears on a player's Decision Profile in a literary, cinematic decision-making game.

VOICE
- Literary noir. Spare. Present tense. Second person.
- Specific. A little uncomfortable. The kind of line someone screenshots and shares.
- Never therapeutic, never congratulatory, never a personality quiz.
- Forbidden words: "good", "bad", "right", "wrong", "correct", "incorrect", "tend to", "you are someone who", "valuable habit", "next step".
- No exclamation marks. No em-dash drama clusters. No metaphors about journeys, paths, or chapters.

CONTENT
- The line MUST be anchored in a real decision-science concept the player actually exhibited: a named bias (anchoring, confirmation, affect heuristic, availability, framing, sunk cost, overconfidence, base-rate neglect, recency, halo, narrative fallacy, etc.), a heuristic, or a reasoning pattern (premature closure, motivated reasoning, calibration drift, second-order blindness, evidence asymmetry, etc.).
- Name the concept directly OR evoke it precisely enough that someone who knows the term recognizes it. Don't lecture, don't define it.
- Ground it in WHAT THE PLAYER ACTUALLY DID across their missions (the signals, biases, blind spots provided). If the input is thin, pick the single sharpest signal — do not hedge into generality.
- Length: 1-2 sentences. Roughly 18-40 words total.

FORMAT
- Output a single object: { "portrait": "..." }.

EXAMPLES of the right register (do not reuse the wording):
- "Affect heuristic runs your first read — you feel the weight before you count the evidence. That's not impatience. That's a pattern."
- "You anchor on the first frame and audit the room for confirmation. The contradicting detail is in there. You just don't ask it twice."
- "Your confidence tracks your story, not your evidence. Calibration drifts upward the longer you hold the floor."`;

    const profileLines = Object.entries(data.scores)
      .map(([k, v]) => `  - ${k}: ${v}`)
      .join("\n");

    const user = `MISSIONS COMPLETED: ${data.missionsCompleted}

DIMENSION SCORES (0-100):
${profileLines}

STRONGEST AXES: ${data.topDimensions.join(", ") || "(none stable)"}
WEAKEST AXES:   ${data.weakDimensions.join(", ") || "(none stable)"}

RECENT BEHAVIORAL SIGNALS (tags across last few missions):
${data.recentSignals.length ? data.recentSignals.map((s) => `  - ${s}`).join("\n") : "  (none)"}

POSSIBLE BIASES FLAGGED IN RECENT ANALYSIS (with evidence):
${
  data.recentBiases.length
    ? data.recentBiases
        .map((b) => `  - ${b.name}${b.evidence ? ` — ${b.evidence}` : ""}`)
        .join("\n")
    : "  (none)"
}

RECENT BLIND SPOTS (pattern + the question they didn't ask):
${
  data.recentBlindSpots.length
    ? data.recentBlindSpots
        .map((b) => `  - ${b.pattern}${b.reframe ? ` — reframe: ${b.reframe}` : ""}`)
        .join("\n")
    : "  (none)"
}

CALIBRATION NOTE: ${data.calibration || "(none)"}
LUCK VS SKILL:    ${data.luckVsSkill || "(none)"}

Write the portrait now. One concept. Named or unmistakably evoked. Anchored in what the player actually did. No verdicts.`;

    const { object } = await generateObject({
      model: gateway("google/gemini-3-flash-preview"),
      schema: PortraitSchema,
      temperature: 0.8,
      system,
      prompt: user,
    });

    return object;
  });
