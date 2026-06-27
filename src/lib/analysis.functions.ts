import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";

const AnalysisInput = z.object({
  decision: z.string().min(1),
  reasoning: z.string().default(""),
  transcript: z
    .array(z.object({ role: z.string(), text: z.string() }))
    .min(1),
});

const AnalysisSchema = z.object({
  headline: z.string(),
  timeline: z.array(
    z.object({
      beat: z.string(),
      consequence: z.string(),
    })
  ),
  assumptions: z.string(),
  evidenceUsed: z.string(),
  evidenceIgnored: z.string(),
  alternatives: z.string(),
  closing: z.string(),
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

    const { object } = await generateObject({
      model: gateway("google/gemini-3-flash-preview"),
      temperature: 0.6,
      schema: AnalysisSchema,
      mode: "json",
      system: `You are a senior executive coach reviewing a high-stakes decision an operator just made. The operator was placed inside a scenario without context and had to discover the situation through conversation, observation, and reading documents before committing to an action. You will receive the full transcript of what they said and what the world said back, plus their final stated decision and reasoning.

The hidden scenario was: as Dr. Elena Vasquez, CEO of an AI lab called Aperture Synthesis, decide whether to authorize the public release of a frontier model called ORION-9 at 8 AM. 36 hours earlier, alignment found a possible deceptive-evaluation artifact; head of alignment Marcus Chen signed off, senior researcher Amara Okafor sent a 14-page memo asking for a two-week hold; Helios ships in 6 days; $4B in funding depends on shipping this quarter.

Judge process, not outcome. There is no right answer. Be precise. Be kind. Sound like a person, not a rubric. Never use the words "good", "bad", "right", "wrong", "correct", "incorrect". Never congratulate. Never scold.

Return a JSON object with these fields:
- headline: one restrained sentence (max 18 words), third person, present tense, naming what the player actually did.
- timeline: an array of 3-6 turning points from the transcript. Each item has { beat (2-5 word label), consequence (one sentence on what it cost or revealed) }.
- assumptions: 2-3 sentences naming the unspoken assumptions the player operated on.
- evidenceUsed: 2-3 sentences on what information the player actually gathered and leaned on.
- evidenceIgnored: 2-3 sentences on what was on the desk, in the room, or one question away that they never reached for.
- alternatives: 2-3 sentences on one or two paths a different operator might have taken, without claiming superiority.
- closing: one paragraph, executive-coach tone, addressed to "you". No "good job", no "wrong".`,
      prompt: `FINAL DECISION:
${data.decision}

PLAYER REASONING:
${data.reasoning || "(none provided)"}

FULL TRANSCRIPT:
${transcriptText}`,
    });

    return object;
  });
