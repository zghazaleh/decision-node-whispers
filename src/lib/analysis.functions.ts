import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { frameworkAnalyzerBlock, assertMissionFrameworkReady } from "@/lib/missions/framework";
import { createServerFn } from "@tanstack/react-start";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import type { Archetype } from "@/lib/missions/types";
import { checkRateLimit, sanitizeSessionId } from "@/lib/rate-limit.server";

const DEFAULT_MISSION_ID = "mission-01";


const AnalysisInput = z.object({
  missionId: z.string().max(64).default(DEFAULT_MISSION_ID),
  decision: z.string().min(1).max(2000),
  reasoning: z.string().max(4000).default(""),
  archetypeId: z.string().max(64).optional(),
  confidence: z.number().min(0).max(100).optional(),
  transcript: z
    .array(z.object({ role: z.string().max(32), text: z.string().max(4000) }))
    .min(1)
    .max(60),
  sessionId: z.string().max(96).optional(),
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

const TextBlockOrList = z.union([z.string(), z.array(z.string())]);

const RawAnalysisSchema = AnalysisSchema.extend({
  // Gemini sometimes formats these paragraph fields as short string arrays even
  // when prompted for prose. Accept both shapes at the model boundary, then
  // normalize back to the app's canonical DecisionAnalysis contract below.
  assumptions: TextBlockOrList,
  evidenceUsed: TextBlockOrList,
  evidenceIgnored: TextBlockOrList,
  alternatives: TextBlockOrList,
});

type RawDecisionAnalysis = z.infer<typeof RawAnalysisSchema>;

function normalizeTextBlock(value: string | string[]) {
  return Array.isArray(value)
    ? value.map((line) => line.trim()).filter(Boolean).join("\n\n")
    : value;
}

function normalizeAnalysis(raw: RawDecisionAnalysis): DecisionAnalysis {
  return AnalysisSchema.parse({
    ...raw,
    assumptions: normalizeTextBlock(raw.assumptions),
    evidenceUsed: normalizeTextBlock(raw.evidenceUsed),
    evidenceIgnored: normalizeTextBlock(raw.evidenceIgnored),
    alternatives: normalizeTextBlock(raw.alternatives),
  });
}

function extractJsonObject(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const source = fenced?.[1]?.trim() || trimmed;

  try {
    return JSON.parse(source);
  } catch {
    const start = source.indexOf("{");
    const end = source.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(source.slice(start, end + 1));
    }
    throw new Error("Analysis response was not valid JSON.");
  }
}

function safeString(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value)) {
    const joined = value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim())
      .filter(Boolean)
      .join("\n\n");
    if (joined) return joined;
  }
  return fallback;
}

function coerceArray<T>(value: unknown, schema: z.ZodType<T>, max: number): T[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => schema.safeParse(item))
    .filter((result): result is z.SafeParseSuccess<T> => result.success)
    .map((result) => result.data)
    .slice(0, max);
}

function fallbackAnalysis({
  raw,
  archetype,
  decision,
  reasoning,
}: {
  raw?: Record<string, unknown>;
  archetype: Archetype | null;
  decision: string;
  reasoning: string;
}): DecisionAnalysis {
  const reasoningAssessment = raw?.reasoningAssessment && typeof raw.reasoningAssessment === "object"
    ? raw.reasoningAssessment as Record<string, unknown>
    : {};
  const rawScores = raw?.dimensionScores && typeof raw.dimensionScores === "object"
    ? raw.dimensionScores as Record<string, unknown>
    : {};
  const rawNotes = raw?.dimensionNotes && typeof raw.dimensionNotes === "object"
    ? raw.dimensionNotes as Record<string, unknown>
    : {};
  const score = (key: string) => {
    const value = rawScores[key];
    return typeof value === "number" && Number.isFinite(value)
      ? Math.min(100, Math.max(0, Math.round(value)))
      : 50;
  };
  const note = (key: string, fallback: string) => safeString(rawNotes[key], fallback);

  const StrengthSchema = z.object({ behavior: z.string(), evidence: z.string() });
  const BlindSpotSchema = z.object({
    pattern: z.string(),
    evidence: z.string(),
    gentleReframe: z.string(),
  });
  const BiasSchema = z.object({
    name: z.string(),
    evidence: z.string(),
    gentleExplanation: z.string(),
    confidence: z.enum(["low", "medium", "high"]).optional(),
  });
  const TrajectorySchema = z.object({
    marker: z.string(),
    hypothesis: z.string(),
    confidence: z.enum(["low", "medium", "high"]),
    trigger: z.string(),
    update: z.enum(["formed", "reinforced", "revised", "abandoned", "held"]),
    note: z.string(),
  });
  const verdict = reasoningAssessment.calibrationVerdict;

  return {
    headline: safeString(raw?.headline, `You committed to ${decision}.`),
    timeline: archetype?.timeline.map((t) => ({ ...t })) ?? coerceArray(
      raw?.timeline,
      z.object({ beat: z.string(), consequence: z.string() }),
      6,
    ),
    assumptions: safeString(raw?.assumptions, "You made the decision with incomplete evidence and accepted that uncertainty as part of the room."),
    evidenceUsed: safeString(raw?.evidenceUsed, "You leaned on the details you surfaced in the conversation and the reasoning you named at the moment of commitment."),
    evidenceIgnored: safeString(raw?.evidenceIgnored, "Some reachable facts remained untested before you moved from investigation to commitment."),
    alternatives: safeString(raw?.alternatives, "A different version of you could have paused to test one more assumption or ask one more targeted question before committing."),
    closing: safeString(raw?.closing, archetype?.tone ?? "You made the call under uncertainty; the shape of that process is the thing to carry forward."),
    reasoningAssessment: {
      summary: safeString(reasoningAssessment.summary, "Your reasoning shows a decision made under pressure with incomplete information. The useful question is how deliberately you separated evidence from assumption before committing."),
      strengths: coerceArray(reasoningAssessment.strengths, StrengthSchema, 4),
      blindSpots: coerceArray(reasoningAssessment.blindSpots, BlindSpotSchema, 4),
      possibleBiases: coerceArray(reasoningAssessment.possibleBiases, BiasSchema, 3),
      calibration: safeString(reasoningAssessment.calibration, "Your confidence can only be judged against the evidence you had in the room, not against the eventual outcome."),
      calibrationVerdict: verdict === "under" || verdict === "over" || verdict === "calibrated"
        ? verdict
        : "calibrated",
      luckVsSkill: safeString(reasoningAssessment.luckVsSkill, "Your process and the eventual consequence are separate signals; one does not fully explain the other."),
    },
    beliefTrajectory: coerceArray(reasoningAssessment.beliefTrajectory ?? raw?.beliefTrajectory, TrajectorySchema, 8),
    dimensionScores: {
      strategicThinking: score("strategicThinking"),
      curiosity: score("curiosity"),
      informationGathering: score("informationGathering"),
      confidenceCalibration: score("confidenceCalibration"),
      adaptability: score("adaptability"),
      negotiation: score("negotiation"),
      longTermThinking: score("longTermThinking"),
      biasResistance: score("biasResistance"),
    },
    dimensionNotes: {
      strategicThinking: note("strategicThinking", "You showed mixed evidence of thinking beyond the immediate move."),
      curiosity: note("curiosity", "You asked enough to act, while leaving some reachable questions untouched."),
      informationGathering: note("informationGathering", "You gathered some decision-relevant evidence before committing."),
      confidenceCalibration: note("confidenceCalibration", "Your stated confidence is treated as proportional to the evidence available."),
      adaptability: note("adaptability", "You adjusted as the conversation developed, though not every assumption was retested."),
      negotiation: note("negotiation", "You did not make negotiation the center of the decision process."),
      longTermThinking: note("longTermThinking", "You considered the immediate stakes more clearly than the downstream consequences."),
      biasResistance: note("biasResistance", "You showed some resistance to first impressions, with room to test more disconfirming evidence."),
    },
    reasoningEcho: safeString(raw?.reasoningEcho, reasoning
      ? `You described your reasoning as: ${reasoning}. Your confidence sat where the evidence appeared to be in the moment, and the remaining uncertainty is part of the lesson.`
      : "You gave little explicit reasoning, so the clearest signal is the path you took through the conversation before committing."),
  };
}


export type DecisionAnalysis = z.infer<typeof AnalysisSchema>;

export const analyzeDecision = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalysisInput.parse(input))
  .handler(async ({ data }) => {
    const sessionId = sanitizeSessionId(data.sessionId);

    // 10 analyses / hour / session. A real player completes at most a
    // handful of missions per hour; this cap sits well above that.
    const ok = await checkRateLimit(`analyze:${sessionId}`, 10, 3600);
    if (!ok) {
      throw new Response("Rate limit exceeded. Try again in a bit.", { status: 429 });
    }

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { getMissionEngine } = await import("@/lib/missions/registry.server");
    const engine = getMissionEngine(data.missionId);
    if (!engine) throw new Error(`Unknown mission: ${data.missionId}`);

    // Hard precondition: the Decision Nodes framework fields must be fully
    // populated for this mission, or the reasoning assessment degrades to
    // generic output. Fail loudly here instead of silently shipping a weak debrief.
    assertMissionFrameworkReady(data.missionId);

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

    const { text: analysisText } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      temperature: 0.6,
      maxOutputTokens: 8192,
      system: `You are a senior executive coach AND a decision scientist reviewing a high-stakes decision you just made inside an immersive interactive drama. You are speaking TO the person who just decided — always in the second person ("you", "your"). Never refer to "the player", "the operator", "the user", or "this player". The consequences of the chosen stance are FIXED CANON — narrate them, do not invent them. Your real work is to evaluate HOW you reached the decision, not whether the decision was "correct".

You draw from modern decision science, behavioral economics, cognitive psychology, probabilistic reasoning under uncertainty, and strategic thinking. Judge process, not outcome. A sound process that produced a poor outcome is still a sound process. A lucky outcome from a sloppy process is still a sloppy process — name that separation explicitly.

Style: precise, kind, human, never a rubric. Never use the words "good", "bad", "right", "wrong", "correct", "incorrect". Never congratulate. Never scold. Never accuse you of a bias — describe the pattern in your behavior and let you recognize it. Always ground every claim in something you actually did, said, asked, or skipped in the transcript. Every sentence of every field is addressed to "you" in the second person.

WHAT TO OBSERVE FROM THE TRANSCRIPT:
- What information did you actively seek? What did you ignore that was reachable?
- Which assumptions did you make without testing?
- Did you update beliefs when new evidence appeared, or stay anchored?
- Did you ask sharp questions or accept first answers?
- Did you entertain multiple hypotheses or commit early?
- Did you recognize uncertainty, or speak in false certainties?
- Did you move too fast, or stall past the point of useful information?
- Did you recognize conflicting incentives between characters?
- Did you distinguish facts from assumptions?
- Did you consider second-order effects?
- Did you calibrate confidence to evidence?

BIASES TO CONSIDER (do not list them; only surface 0-3 if the transcript shows clear behavioral evidence): confirmation bias, anchoring, availability heuristic, representativeness heuristic, loss aversion, framing effects, overconfidence, sunk cost, halo effect, authority bias, status quo bias, recency bias, survivorship bias, groupthink, hindsight bias, escalation of commitment.

STRENGTHS TO RECOGNIZE when present: seeking disconfirming evidence, holding multiple hypotheses, belief updating on new evidence, clarifying questions before deciding, separating facts from assumptions, naming weak evidence, weighing short vs long-term, identifying second-order effects, calibrated confidence, knowing when more information stops being worth the time.

Return ONLY a valid JSON object. Do not wrap it in markdown. Do not include commentary before or after it. EVERY string field is addressed to "you" in the second person. Fields described as sentences or paragraphs MUST be a single JSON string, never an array of strings:
- headline: one restrained sentence (max 18 words), second person, present tense, naming what you actually did. E.g. "You took the stand and qualified your opinion under oath."
- timeline: the canon beats above, verbatim. Same count, same order, same wording.
- assumptions: 2-3 sentences naming the unspoken assumptions you operated on.
- evidenceUsed: 2-3 sentences on what information you actually gathered and leaned on.
- evidenceIgnored: 2-3 sentences on what was on the desk, in the room, or one question away that you never reached for.
- alternatives: 2-3 sentences on one or two paths a different version of you might have taken. Reference the second-order facts where natural.
- closing: one paragraph, executive-coach tone, addressed to "you". Land in the specified closing tone.
- reasoningAssessment:
   - summary: one paragraph on the QUALITY of your reasoning process, independent of outcome. Address "you".
   - strengths: 0-4 items. Each is {behavior, evidence}. "behavior" names a sound decision-making move you made in plain language. "evidence" quotes or paraphrases the specific moment in the transcript where you did it. Empty array if there is genuinely nothing to cite.
   - blindSpots: 0-4 items. Each is {pattern, evidence, gentleReframe}. "pattern" describes a reasoning pattern in plain language (NOT a bias name), phrased about you. "evidence" cites the specific moment. "gentleReframe" is one sentence offering the question you could have asked instead. Never accuse. Phrase as observation.
   - possibleBiases: 0-3 items, ONLY if the transcript shows clear behavioral evidence. Each is {name, evidence, gentleExplanation, confidence}. "name" is the bias from the list above. "evidence" is the specific behavior. "gentleExplanation" is 1-2 sentences explaining the pattern through your own actions, never as a diagnosis. "confidence" is your own confidence in the claim — "high" only if the behavior is unmistakable, "medium" for a clear tendency, "low" for a hedged "possibly". Empty array is preferred over a stretch.
   - calibration: 1-2 sentences on whether your confidence matched the strength of the evidence you had. Note over- or under-confidence by what you said, not by the outcome.
   - calibrationVerdict: a single enum — "under" if you were less confident than the evidence warranted, "calibrated" if your stated confidence matched the evidence, "over" if you overclaimed. Required.
   - luckVsSkill: 1-2 sentences explicitly separating the quality of your process from the quality of the outcome. If a poor process happened to land well, say so. If a sound process landed badly because of uncertainty, say so.
- beliefTrajectory: 3-8 ordered snapshots reconstructing how your working theory of the situation evolved across the transcript. Walk the transcript chronologically and emit a snapshot whenever your stance plausibly shifted, hardened, or stayed put in the face of new information. Each snapshot:
   - marker: short tag for WHEN in the session this is, drawn from the actual transcript. No turn numbers.
   - hypothesis: one sentence in plain language describing what you APPEARED to believe at that moment, addressed to you ("You took it as given that…"). Infer from what you said, asked, or did — not from outcomes.
   - confidence: "low" | "medium" | "high" — how strongly you were holding that belief, judged by tone and behavior.
   - trigger: the specific piece of information, question, or silence that produced this snapshot. Quote or paraphrase from the transcript.
   - update: "formed" | "reinforced" | "revised" | "abandoned" | "held".
   - note: one short sentence on what the update reveals about your reasoning, addressed to you — especially flag "held" entries where you did not update on reachable evidence, and "revised" entries where you did. Neutral, observational.
- dimensionScores: REQUIRED. Score your reasoning on each of these eight axes, 0-100, grounded ONLY in transcript behavior. Anchors: 0 = absent or actively counterproductive; 35 = thin or inconsistent; 50 = baseline with mixed signals; 65 = clearly present and load-bearing; 85 = a defining strength of this session; 100 = exemplary across multiple moments. Do NOT default everything to 50 — differentiate. Outcome MUST NOT affect any score.
   - strategicThinking, curiosity, informationGathering, confidenceCalibration, adaptability, negotiation, longTermThinking, biasResistance — all judged against your behavior.
- dimensionNotes: REQUIRED. For each of the eight axes above, one short sentence (max 25 words) addressed to you and grounded in a specific transcript moment.
- reasoningEcho: REQUIRED. 2–3 sentences in an executive-coach voice, addressed to "you", that mirror your reasoning back with precision. Use your own WHY text as the spine. Reference the calibrationVerdict explicitly in plain language (e.g. for "calibrated": "your confidence sat where the evidence actually was"; for "over": "you stated more certainty than the evidence carried"; for "under": "the evidence was stronger than your confidence suggested"). Quote or paraphrase one or two specific transcript moments that map to the highest- and lowest-scoring dimensions. Do NOT invent consequences, do NOT repeat the canon timeline, do NOT contradict it, do NOT use the forbidden vocabulary (good/bad/right/wrong/correct/incorrect). If you provided no reasoning text, ground the echo entirely in your behavior. Tone: quiet, specific, respectful — never congratulatory, never scolding.`,


      prompt: `${canonTimelineBlock}

${frameworkAnalyzerBlock(data.missionId)}

FINAL DECISION: ${data.decision}

PLAYER REASONING: ${data.reasoning || "(none provided)"}

FULL TRANSCRIPT:
${transcriptText}`,
    });

    // Parse permissively first, because this is prose-heavy JSON and schema-
    // constrained decoding has proven brittle for this large object. Then
    // validate/normalize into the strict app contract, with a last-resort
    // fallback so analysis failure never blanks the mission experience.
    let parsed: unknown;
    try {
      parsed = extractJsonObject(analysisText);
    } catch (error) {
      console.warn("analysis JSON parse failed; using fallback analysis", error);
    }

    const rawResult = RawAnalysisSchema.safeParse(parsed);
    const object = rawResult.success
      ? normalizeAnalysis(rawResult.data)
      : fallbackAnalysis({
          raw: parsed && typeof parsed === "object"
            ? parsed as Record<string, unknown>
            : undefined,
          archetype,
          decision: data.decision,
          reasoning: data.reasoning,
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
