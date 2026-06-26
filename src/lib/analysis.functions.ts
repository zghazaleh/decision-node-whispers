import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";

const AnalysisInput = z.object({
  decision: z.string().min(1),
  reasoning: z.string().default(""),
  transcript: z
    .array(z.object({ role: z.string(), text: z.string() }))
    .min(1),
});

const AnalysisSchema = z.object({
  headline: z
    .string()
    .describe(
      "One restrained sentence (max 18 words) that names what the player actually did, in the third person, present tense. No praise, no judgment."
    ),
  timeline: z
    .array(
      z.object({
        beat: z
          .string()
          .describe("Short label, 2-5 words, like 'Asked Sarah about the board' or 'Did not read the memo'."),
        consequence: z
          .string()
          .describe("One sentence on what this choice cost or revealed downstream."),
      })
    )
    .min(3)
    .max(6)
    .describe("A cinematic timeline of 3-6 turning points from the actual transcript."),
  assumptions: z
    .string()
    .describe(
      "2-3 sentences. Name the unspoken assumptions the player operated on. Be specific to the transcript."
    ),
  evidenceUsed: z
    .string()
    .describe("2-3 sentences. What information the player actually gathered and leaned on."),
  evidenceIgnored: z
    .string()
    .describe(
      "2-3 sentences. What was on the desk, in the room, or one question away that the player never reached for."
    ),
  alternatives: z
    .string()
    .describe(
      "2-3 sentences. One or two paths a different operator might have taken, without claiming superiority."
    ),
  closing: z
    .string()
    .describe(
      "One paragraph, executive-coach tone. No 'good job'. No 'wrong'. Address the player as 'you'."
    ),
});

export type DecisionAnalysis = z.infer<typeof AnalysisSchema>;

export const analyzeDecision = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalysisInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const transcriptText = data.transcript
      .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n\n");

    const { experimental_output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      temperature: 0.6,
      experimental_output: Output.object({ schema: AnalysisSchema }),
      system: `You are a senior executive coach reviewing a high-stakes decision an operator just made. The operator was placed inside a scenario without context and had to discover the situation through conversation, observation, and reading documents before committing to an action. You will receive the full transcript of what they said and what the world said back, plus their final stated decision and reasoning.

The hidden scenario was: as Dr. Elena Vasquez, CEO of an AI lab called Aperture Synthesis, decide whether to authorize the public release of a frontier model called ORION-9 at 8 AM. 36 hours earlier, alignment found a possible deceptive-evaluation artifact; head of alignment Marcus Chen signed off, senior researcher Amara Okafor sent a 14-page memo asking for a two-week hold; Helios ships in 6 days; $4B in funding depends on shipping this quarter.

Judge process, not outcome. There is no right answer. Be precise. Be kind. Sound like a person, not a rubric. Never use the words "good", "bad", "right", "wrong", "correct", "incorrect". Never congratulate. Never scold.`,
      prompt: `FINAL DECISION:
${data.decision}

PLAYER REASONING:
${data.reasoning || "(none provided)"}

FULL TRANSCRIPT:
${transcriptText}`,
    });

    return experimental_output;
  });
