import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { getMissionEngine } from "@/lib/missions/registry";
import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
import { z } from "zod";

const DEFAULT_MISSION_ID = "mission-01";

const AnalysisInput = z.object({
  missionId: z.string().default(DEFAULT_MISSION_ID),
  decision: z.string().min(1),
  reasoning: z.string().default(""),
  archetypeId: z.string().optional(), // preset path: skip classification
  confidence: z.number().min(0).max(100).optional(), // player self-reported at commit
  transcript: z
    .array(z.object({ role: z.string(), text: z.string() }))
    .min(1),
});

const DimensionScore = z.number().min(0).max(100);

const AnalysisSchema = z.object({
  headline: z.string(),
  archetypeId: z.string().optional(),
  archetypeLabel: z.string().optional(),
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
  reasoningAssessment: z.object({
    summary: z.string(),
    strengths: z
      .array(z.object({ behavior: z.string(), evidence: z.string() }))
      .max(4),
    blindSpots: z
      .array(
        z.object({
          pattern: z.string(),
          evidence: z.string(),
          gentleReframe: z.string(),
        }),
      )
      .max(4),
    possibleBiases: z
      .array(
        z.object({
          name: z.string(),
          evidence: z.string(),
          gentleExplanation: z.string(),
          // NEW: model's own confidence in the bias claim. Half-weighted
          // against the bias-resistance axis when "low" or "medium".
          confidence: z.enum(["low", "medium", "high"]).optional(),
        }),
      )
      .max(3),
    calibration: z.string(),
    // NEW: structured calibration verdict. Drives the Confidence-Calibration
    // axis directly, replacing the brittle keyword-sniffing path.
    calibrationVerdict: z
      .enum(["under", "calibrated", "over"])
      .optional(),
    luckVsSkill: z.string(),
  }),
  beliefTrajectory: z
    .array(
      z.object({
        marker: z.string(),
        hypothesis: z.string(),
        confidence: z.enum(["low", "medium", "high"]),
        trigger: z.string(),
        update: z.enum(["formed", "reinforced", "revised", "abandoned", "held"]),
        note: z.string(),
      }),
    )
    .max(8),

  // NEW: per-dimension sub-scores emitted by the Analyzer, with a short
  // justification per axis. The Decision Profile scorer prefers these over
  // the legacy keyword inference whenever they are present.
  dimensionScores: z
    .object({
      strategicThinking: DimensionScore,
      curiosity: DimensionScore,
      informationGathering: DimensionScore,
      confidenceCalibration: DimensionScore,
      adaptability: DimensionScore,
      negotiation: DimensionScore,
      longTermThinking: DimensionScore,
      biasResistance: DimensionScore,
    })
    .optional(),
  dimensionNotes: z
    .object({
      strategicThinking: z.string(),
      curiosity: z.string(),
      informationGathering: z.string(),
      confidenceCalibration: z.string(),
      adaptability: z.string(),
      negotiation: z.string(),
      longTermThinking: z.string(),
      biasResistance: z.string(),
    })
    .optional(),

  // NEW: 2–3 sentence executive-coach reflection addressed to "you", grounded
  // in the player's own reasoning text + the structured calibrationVerdict +
  // one or two dimensionNotes. Rephrases their stance back to them; MUST NOT
  // invent consequences, MUST NOT contradict canon, MUST NOT use forbidden
  // vocabulary (good/bad/right/wrong/correct/incorrect).
  reasoningEcho: z.string().optional(),
});


export type DecisionAnalysis = z.infer<typeof AnalysisSchema>;

export const analyzeDecision = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalysisInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const engine = getMissionEngine(data.missionId);
    if (!engine) throw new Error(`Unknown mission: ${data.missionId}`);

    const gateway = createLovableAiGatewayProvider(key);

    const transcriptText = data.transcript
      .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
      .join("\n\n");

    // ─── Stage A: classify into an archetype (skipped if preset gave us one)
    let archetypeId: string | null = null;
    if (data.archetypeId && engine.getArchetype(data.archetypeId)) {
      archetypeId = data.archetypeId;
    } else {
      const ClassifySchema = z.object({
        archetypeId: z.enum([...engine.archetypeIds] as [string, ...string[]]),
        confidence: z.number().min(0).max(1),
        rationale: z.string(),
      });
      try {
        const { object: classification } = await generateObject({
          model: gateway("google/gemini-3-flash-preview"),
          temperature: 0.1,
          schema: ClassifySchema,
          system: `You classify a player's final decision in an interactive drama.

ARCHETYPES:
${engine.archetypeMenuForClassifier()}

Pick the single archetype that best matches the SUBSTANCE of the player's decision. Ignore reasoning quality; classify the action.`,
          prompt: `DECISION: ${data.decision}\n\nREASONING: ${data.reasoning || "(none)"}`,
        });
        archetypeId = classification.archetypeId;
      } catch {
        archetypeId = null;
      }
    }

    const archetype = archetypeId ? engine.getArchetype(archetypeId) : null;

    // ─── Stage B: narrate, using canon timeline as the spine
    const canonTimelineBlock = archetype
      ? `CANON CONSEQUENCE TIMELINE — these beats are GROUND TRUTH. Use them verbatim for the 'timeline' field, in this exact order. You may NOT add, drop, reorder, or invent beats.

${archetype.timeline.map((t, i) => `${i + 1}. beat: "${t.beat}" | consequence: "${t.consequence}"`).join("\n")}

SECOND-ORDER FACTS (weave into closing/alternatives, never as new timeline beats):
${Object.entries(archetype.secondOrder)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

CLOSING TONE: ${archetype.tone}`
      : `No canonical archetype matched. Write the timeline yourself, 4-6 beats, but stay grounded in the transcript.`;

    const { object } = await generateObject({
      model: gateway("google/gemini-3-flash-preview"),
      temperature: 0.6,
      schema: AnalysisSchema,
      system: `You are a senior executive coach AND a decision scientist reviewing a high-stakes decision an operator just made inside an immersive interactive drama. The consequences of the chosen stance are FIXED CANON — you narrate them, you do not invent them. Your real work is to evaluate HOW the player reached the decision, not whether the decision was "correct".

You draw from modern decision science, behavioral economics, cognitive psychology, probabilistic reasoning under uncertainty, and strategic thinking. You judge process, not outcome. A sound process that produced a poor outcome is still a sound process. A lucky outcome from a sloppy process is still a sloppy process — name that separation explicitly.

Style: precise, kind, human, never a rubric. Never use the words "good", "bad", "right", "wrong", "correct", "incorrect". Never congratulate. Never scold. Never accuse the player of a bias — describe the pattern in their behavior and let them recognize it. Always ground every claim in something the player actually did, said, asked, or skipped in the transcript.

WHAT TO OBSERVE FROM THE TRANSCRIPT:
- What information did they actively seek? What did they ignore that was reachable?
- Which assumptions did they make without testing?
- Did they update beliefs when new evidence appeared, or stay anchored?
- Did they ask sharp questions or accept first answers?
- Did they entertain multiple hypotheses or commit early?
- Did they recognize uncertainty, or speak in false certainties?
- Did they move too fast, or stall past the point of useful information?
- Did they recognize conflicting incentives between characters (Marcus vs. Amara vs. Jonas)?
- Did they distinguish facts from assumptions?
- Did they consider second-order effects?
- Did they calibrate confidence to evidence?

BIASES TO CONSIDER (do not list them; only surface 0-3 if the transcript shows clear behavioral evidence): confirmation bias, anchoring, availability heuristic, representativeness heuristic, loss aversion, framing effects, overconfidence, sunk cost, halo effect, authority bias, status quo bias, recency bias, survivorship bias, groupthink, hindsight bias, escalation of commitment.

STRENGTHS TO RECOGNIZE when present: seeking disconfirming evidence, holding multiple hypotheses, belief updating on new evidence, clarifying questions before deciding, separating facts from assumptions, naming weak evidence, weighing short vs long-term, identifying second-order effects, calibrated confidence, knowing when more information stops being worth the time.

Return a JSON object with these fields:
- headline: one restrained sentence (max 18 words), third person, present tense, naming what the player actually did.
- timeline: the canon beats above, verbatim. Same count, same order, same wording.
- assumptions: 2-3 sentences naming the unspoken assumptions this player operated on.
- evidenceUsed: 2-3 sentences on what information the player actually gathered and leaned on.
- evidenceIgnored: 2-3 sentences on what was on the desk, in the room, or one question away that they never reached for.
- alternatives: 2-3 sentences on one or two paths a different operator might have taken. Reference the second-order facts where natural.
- closing: one paragraph, executive-coach tone, addressed to "you". Land in the specified closing tone.
- reasoningAssessment:
   - summary: one paragraph on the QUALITY of the reasoning process, independent of outcome. Address "you".
   - strengths: 0-4 items. Each is {behavior, evidence}. "behavior" names a sound decision-making move in plain language (no jargon). "evidence" quotes or paraphrases the specific moment in the transcript where they did it. Empty array if there is genuinely nothing to cite.
   - blindSpots: 0-4 items. Each is {pattern, evidence, gentleReframe}. "pattern" describes a reasoning pattern (NOT a bias name) in plain language. "evidence" cites the specific moment. "gentleReframe" is one sentence offering the question they could have asked instead. Never accuse. Phrase as observation.
   - possibleBiases: 0-3 items, ONLY if the transcript shows clear behavioral evidence. Each is {name, evidence, gentleExplanation, confidence}. "name" is the bias from the list above. "evidence" is the specific behavior. "gentleExplanation" is 1-2 sentences explaining the pattern through their own actions, never as a diagnosis. "confidence" is your own confidence in the claim — "high" only if the behavior is unmistakable, "medium" for a clear tendency, "low" for a hedged "possibly". Empty array is preferred over a stretch.
   - calibration: 1-2 sentences on whether their confidence matched the strength of the evidence they had. Note over- or under-confidence by what they said, not by the outcome.
   - calibrationVerdict: a single enum — "under" if they were less confident than the evidence warranted, "calibrated" if their stated confidence matched the evidence, "over" if they overclaimed. Required.
   - luckVsSkill: 1-2 sentences explicitly separating the quality of the process from the quality of the outcome. If a poor process happened to land well, say so. If a sound process landed badly because of uncertainty, say so.
- beliefTrajectory: 3-8 ordered snapshots reconstructing how the player's working theory of the situation evolved across the transcript. Walk the transcript chronologically and emit a snapshot whenever their stance plausibly shifted, hardened, or stayed put in the face of new information. Each snapshot:
   - marker: short tag for WHEN in the session this is, drawn from the actual transcript (e.g. "After Sarah's first line", "On reading the memo", "After pressing Marcus", "Just before deciding"). No turn numbers.
   - hypothesis: one sentence in plain language describing what the player APPEARED to believe about the situation at that moment (about the model, the anomaly, the people, the stakes). Infer from what they said, asked, or did — not from outcomes.
   - confidence: "low" | "medium" | "high" — how strongly they were holding that belief, judged by tone and behavior.
   - trigger: the specific piece of information, question, or silence that produced this snapshot. Quote or paraphrase from the transcript.
   - update: "formed" (first time this belief appears), "reinforced" (new evidence strengthened an existing belief), "revised" (belief shifted in response to evidence), "abandoned" (belief was dropped), "held" (new contrary evidence appeared but belief did not move).
   - note: one short sentence on what the update reveals about their reasoning — especially flag "held" entries where the player did not update on reachable evidence, and "revised" entries where they did. Neutral, observational.
- dimensionScores: REQUIRED. Score the player's reasoning on each of these eight axes, 0-100, grounded ONLY in transcript behavior. Anchors: 0 = absent or actively counterproductive; 35 = thin or inconsistent; 50 = baseline with mixed signals; 65 = clearly present and load-bearing; 85 = a defining strength of this session; 100 = exemplary across multiple moments. Do NOT default everything to 50 — differentiate. Outcome MUST NOT affect any score.
   - strategicThinking: did they reason about leverage, structure, and downstream cascades — not just the immediate move?
   - curiosity: did they ask sharp, specific questions and pursue threads, or accept first answers?
   - informationGathering: did they reach for the evidence that was on the desk, in the room, or one question away?
   - confidenceCalibration: did their stated/implied confidence match the strength of the evidence they actually had?
   - adaptability: did they update on new evidence, or anchor on the first frame?
   - negotiation: did they recognize counterparts' incentives, hold space for their position, and update on their information — rather than steamroll?
   - longTermThinking: did they weigh second-order effects, long-term consequences, and reputational/structural costs?
   - biasResistance: were they free of the biases listed above, or did clear bias patterns drive the reasoning?
- dimensionNotes: REQUIRED. For each of the eight axes above, one short sentence (max 25 words) grounded in a specific transcript moment that justifies the score. Same keys as dimensionScores.`,


      prompt: `${canonTimelineBlock}

FINAL DECISION: ${data.decision}

PLAYER REASONING: ${data.reasoning || "(none provided)"}

PLAYER SELF-REPORTED CONFIDENCE AT COMMIT: ${typeof data.confidence === "number" ? `${data.confidence}/100` : "(not reported)"}
(Use this for the 'calibration' field — compare it to the strength of the evidence the player actually gathered.)

FULL TRANSCRIPT:
${transcriptText}`,
    });

    // Hard-guarantee: overwrite the model's timeline with canon if we have one,
    // and stamp the archetype id/label so the analysis screen can name it.
    const finalAnalysis: DecisionAnalysis = archetype
      ? {
          ...object,
          timeline: archetype.timeline.map((t) => ({ ...t })),
          archetypeId: archetype.id,
          archetypeLabel: archetype.label,
        }
      : object;

    return finalAnalysis;
  });
