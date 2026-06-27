import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import {
  ARCHETYPE_IDS,
  archetypeMenuForClassifier,
  getArchetype,
  type ArchetypeId,
} from "@/lib/missions/mission-01/outcomes";
import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";

const AnalysisInput = z.object({
  decision: z.string().min(1),
  reasoning: z.string().default(""),
  archetypeId: z.string().optional(), // preset path: skip classification
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

const ClassifySchema = z.object({
  archetypeId: z.enum([...ARCHETYPE_IDS] as [string, ...string[]]),
  confidence: z.number().min(0).max(1),
  rationale: z.string(),
});

export const analyzeDecision = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalysisInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const transcriptText = data.transcript
      .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n\n");

    // ─── Stage A: classify into an archetype (skipped if preset gave us one)
    let archetypeId: ArchetypeId | null = null;
    if (data.archetypeId && getArchetype(data.archetypeId as ArchetypeId)) {
      archetypeId = data.archetypeId as ArchetypeId;
    } else {
      try {
        const { object: classification } = await generateObject({
          model: gateway("google/gemini-3-flash-preview"),
          temperature: 0.1,
          schema: ClassifySchema,
          system: `You classify a player's final decision in an interactive drama about whether to authorize the release of a frontier AI model called ORION-9.

ARCHETYPES:
${archetypeMenuForClassifier()}

Pick the single archetype that best matches the SUBSTANCE of the player's decision. Ignore reasoning quality; classify the action.`,
          prompt: `DECISION: ${data.decision}\n\nREASONING: ${data.reasoning || "(none)"}`,
        });
        archetypeId = classification.archetypeId as ArchetypeId;
      } catch {
        archetypeId = null;
      }
    }

    const archetype = archetypeId ? getArchetype(archetypeId) : null;

    // ─── Stage B: narrate, using canon timeline as the spine
    const canonTimelineBlock = archetype
      ? `CANON CONSEQUENCE TIMELINE — these beats are GROUND TRUTH. Use them verbatim for the 'timeline' field, in this exact order. You may NOT add, drop, reorder, or invent beats.

${archetype.timeline.map((t, i) => `${i + 1}. beat: "${t.beat}" | consequence: "${t.consequence}"`).join("\n")}

SECOND-ORDER FACTS (weave into closing/alternatives, never as new timeline beats):
- ORION-9: ${archetype.secondOrder.orion9}
- Aperture: ${archetype.secondOrder.aperture}
- Helios: ${archetype.secondOrder.helios}
- Marcus: ${archetype.secondOrder.marcus}
- Amara: ${archetype.secondOrder.amara}
- Board: ${archetype.secondOrder.board}
- Elena: ${archetype.secondOrder.elena}

CLOSING TONE: ${archetype.tone}`
      : `No canonical archetype matched. Write the timeline yourself, 4-6 beats, but stay grounded in the transcript.`;

    const { object } = await generateObject({
      model: gateway("google/gemini-3-flash-preview"),
      temperature: 0.6,
      schema: AnalysisSchema,
      system: `You are a senior executive coach reviewing a high-stakes decision an operator just made. The operator was placed inside the body of Dr. Elena Vasquez, CEO of Aperture Synthesis, and had 12 minutes to decide whether to authorize the public release of ORION-9 at 8 AM, against the backdrop of: a possible deceptive-evaluation signal flagged 36h earlier; Marcus Chen (head of alignment) signed off; Amara Okafor (senior alignment) requested a two-week hold via a 14-page memo; Helios ships in 6 days; $4B in funding contingent on shipping this quarter.

The consequences of the chosen stance are FIXED CANON. Your job is to narrate them — not to invent them. The player's reasoning and what they did or did not gather from the transcript shape the assumptions/evidence/alternatives/closing fields. The timeline field MUST be the canon timeline verbatim.

Judge process, not outcome. Be precise. Be kind. Sound like a person, not a rubric. Never use the words "good", "bad", "right", "wrong", "correct", "incorrect". Never congratulate. Never scold.

Return a JSON object with these fields:
- headline: one restrained sentence (max 18 words), third person, present tense, naming what the player actually did.
- timeline: the canon beats above, verbatim. Same count, same order, same wording.
- assumptions: 2-3 sentences naming the unspoken assumptions this player operated on (read from transcript + reasoning).
- evidenceUsed: 2-3 sentences on what information the player actually gathered and leaned on.
- evidenceIgnored: 2-3 sentences on what was on the desk, in the room, or one question away that they never reached for.
- alternatives: 2-3 sentences on one or two paths a different operator might have taken. Reference the second-order facts where natural.
- closing: one paragraph, executive-coach tone, addressed to "you". Land in the specified closing tone.`,
      prompt: `${canonTimelineBlock}

FINAL DECISION: ${data.decision}

PLAYER REASONING: ${data.reasoning || "(none provided)"}

FULL TRANSCRIPT:
${transcriptText}`,
    });

    // Hard-guarantee: overwrite the model's timeline with canon if we have one.
    // Even if the model drifted, the player sees the deterministic beats.
    const finalAnalysis: DecisionAnalysis = archetype
      ? { ...object, timeline: archetype.timeline.map((t) => ({ ...t })) }
      : object;

    return finalAnalysis;
  });
