import { useEffect, useState } from "react";
import type { DecisionAnalysis } from "@/lib/analysis.functions";

const KEY = "decision-node:profile";

export const DIMENSIONS = [
  "strategicThinking",
  "curiosity",
  "informationGathering",
  "confidenceCalibration",
  "adaptability",
  "negotiation",
  "longTermThinking",
  "biasResistance",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_LABELS: Record<Dimension, string> = {
  strategicThinking: "Strategic Thinking",
  curiosity: "Curiosity",
  informationGathering: "Information Gathering",
  confidenceCalibration: "Confidence Calibration",
  adaptability: "Adaptability",
  negotiation: "Negotiation",
  longTermThinking: "Second-Order Thinking",
  biasResistance: "Bias Resistance",
};

export type MissionContribution = {
  missionId: string;
  at: number;
  scores: Record<Dimension, number>;
  signals: string[]; // short tags (e.g. "anchored-early", "revised-on-evidence")
};

export type DecisionProfile = {
  version: 1;
  missionsCompleted: number;
  contributions: MissionContribution[]; // newest last, cap at 30
  scores: Record<Dimension, number>; // rolling weighted average
  emergingPattern: string;
};

const empty = (): DecisionProfile => ({
  version: 1,
  missionsCompleted: 0,
  contributions: [],
  scores: DIMENSIONS.reduce(
    (acc, d) => ({ ...acc, [d]: 50 }),
    {} as Record<Dimension, number>,
  ),
  emergingPattern: "Not enough data yet. Complete a mission to begin building your profile.",
});

export function readProfile(): DecisionProfile {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as DecisionProfile;
    if (parsed.version !== 1) return empty();
    // Backfill any missing dimensions (e.g. older stored profiles).
    const base = empty().scores;
    parsed.scores = { ...base, ...(parsed.scores ?? {}) };
    return parsed;
  } catch {
    return empty();
  }
}

function writeProfile(p: DecisionProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

const clamp = (n: number, lo = 0, hi = 100) =>
  Math.round(Math.max(lo, Math.min(hi, n)));

/** Word-boundary regex test. Avoids substring false-positives like
 *  "uncertain" matching "certain" or "not luck" matching "luck". */
const has = (s: string, re: RegExp) => re.test(s);

/** Deterministic score in 0–100 from analysis content. */
function scoreFromAnalysis(a: DecisionAnalysis): {
  scores: Record<Dimension, number>;
  signals: string[];
} {
  const r = a.reasoningAssessment;
  const strengths = r?.strengths?.length ?? 0;
  const blindSpots = r?.blindSpots?.length ?? 0;
  const biasList = r?.possibleBiases ?? [];
  // Hedged biases ("possibly/may/might/tendency") count at half weight —
  // the Analyzer's own confidence should drive the penalty.
  const hedgeRe = /\b(possibly|possible|may|might|tendency|tendencies|appears|appeared|seems|seemed|perhaps)\b/i;
  const biasWeight = biasList.reduce((sum, b) => {
    const text = `${b?.name ?? ""} ${b?.evidence ?? ""} ${b?.gentleExplanation ?? ""}`;
    return sum + (hedgeRe.test(text) ? 0.5 : 1);
  }, 0);
  const traj = a.beliefTrajectory ?? [];
  const revised = traj.filter((t) => t.update === "revised").length;
  const held = traj.filter((t) => t.update === "held").length;
  const reinforced = traj.filter((t) => t.update === "reinforced").length;

  const calText = (r?.calibration ?? "").toLowerCase();
  const luckText = (r?.luckVsSkill ?? "").toLowerCase();
  const ignored = (a.evidenceIgnored ?? "").length;
  const used = (a.evidenceUsed ?? "").length;
  const alt = (a.alternatives ?? "").toLowerCase();
  const closing = (a.closing ?? "").toLowerCase();

  const curiosity = clamp(
    50 + strengths * 6 - blindSpots * 4 +
      (has(calText, /\b(asked|question(?:ed|s)?|probed)\b/) ? 8 : 0),
  );
  const strategicThinking = clamp(
    50 +
      (has(alt, /\b(leverage|long[- ]term|second[- ]order|downstream|cascade)\b/) ? 14 : 0) +
      (has(closing, /\b(strategic|structural|systemic)\b/) ? 8 : 0) -
      blindSpots * 3,
  );
  const adaptability = clamp(
    50 + revised * 10 - held * 12 + (traj.length >= 4 ? 5 : 0),
  );
  // Word-boundary + negation-aware. "uncertain"/"uncertainty" no longer
  // trigger the overconfidence penalty; "not luck"/"no luck" no longer
  // trigger the luck penalty.
  const calibratedRe = /\b(well[- ]calibrated|calibrated|appropriately\s+\w+|measured|matched\s+the\s+evidence|proportional)\b/;
  const overconfidentRe = /\b(overconfiden\w*|overstated|overclaim\w*|unwarranted\s+certainty|absolute\s+certainty|certainty\s+(?:was|is)\s+(?:not\s+)?warranted)\b/;
  const underconfidentRe = /\b(underconfiden\w*|understated|hedged\s+too\s+much)\b/;
  const luckyRe = /(?<!\bno\s)(?<!\bnot\s)\b(lucky|fortunate|got\s+away|luck\s+rather\s+than)\b/;
  const confidenceCalibration = clamp(
    50 +
      (has(calText, calibratedRe) ? 18 : 0) -
      (has(calText, overconfidentRe) ? 22 : 0) -
      (has(calText, underconfidentRe) ? 10 : 0) -
      (has(luckText, luckyRe) ? 10 : 0),
  );
  const informationGathering = clamp(
    50 + Math.min(20, used / 20) - Math.min(25, ignored / 18) + strengths * 4,
  );
  const longTermThinking = clamp(
    50 +
      (has(alt + " " + closing, /\b(long[- ]term|future|downstream|second[- ]order)\b/) ? 18 : 0) -
      (has(closing, /\b(short[- ]term|immediate|reactive)\b/) ? 10 : 0),
  );
  const biasResistance = clamp(
    // Baseline aligned with the other axes at 50; hedged biases half-weight.
    60 - biasWeight * 10 - (held > revised ? 8 : 0),
  );
  // Negotiation: acknowledging counterparts' incentives and updating rather
  // than steamrolling. Hedged biases count at half weight here too.
  const negotiation = clamp(
    50 + strengths * 4 + revised * 5 - held * 8 - biasWeight * 3,
  );


  const signals: string[] = [];
  if (held > revised) signals.push("anchored-after-confidence-rose");
  if (revised >= 2) signals.push("updates-on-evidence");
  if (biasWeight >= 2) signals.push("multiple-bias-textures");
  if (ignored > used) signals.push("reachable-evidence-skipped");
  if (strengths >= 3 && blindSpots === 0) signals.push("strong-process");

  return {
    scores: {
      curiosity,
      strategicThinking,
      adaptability,
      confidenceCalibration,
      informationGathering,
      longTermThinking,
      biasResistance,
      negotiation,
    },
    signals,
  };
}

function deriveEmergingPattern(contribs: MissionContribution[]): string {
  if (contribs.length === 0)
    return "Not enough data yet. Complete a mission to begin building your profile.";
  const recent = contribs.slice(-5);
  const tally: Record<string, number> = {};
  for (const c of recent) for (const s of c.signals) tally[s] = (tally[s] ?? 0) + 1;
  const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
  if (!top || top[1] < 2) {
    return "Your pattern is still forming. Each mission refines the assessment.";
  }
  const [tag] = top;
  switch (tag) {
    case "anchored-after-confidence-rose":
      return "You consistently form accurate early hypotheses, but you tend to stop searching for contradictory evidence once your confidence increases.";
    case "updates-on-evidence":
      return "You revise your position when new evidence emerges — a valuable habit.";
    case "multiple-bias-textures":
      return "Cognitive shortcuts appear under pressure. Recognizing them in the moment is the next step.";
    case "reachable-evidence-skipped":
      return "You tend to decide before gathering all available information.";
    case "strong-process":
      return "You separate facts from assumptions, weigh second-order effects, and act with measured confidence. A durable process.";
    default:
      return "A pattern is taking shape. Stay with it — a few more missions will sharpen the read.";
  }
}

export function updateProfileWithAnalysis(
  missionId: string,
  analysis: DecisionAnalysis,
): DecisionProfile {
  const prev = readProfile();
  const { scores, signals } = scoreFromAnalysis(analysis);
  const contribution: MissionContribution = {
    missionId,
    at: Date.now(),
    scores,
    signals,
  };
  // De-dupe: replace any earlier contribution for the same mission.
  const filtered = prev.contributions.filter((c) => c.missionId !== missionId);
  const contributions = [...filtered, contribution].slice(-30);

  // Weighted rolling average: newer missions count more.
  const newScores = DIMENSIONS.reduce(
    (acc, d) => {
      let num = 0;
      let den = 0;
      contributions.forEach((c, i) => {
        const w = 1 + i * 0.25; // linear recency weight
        num += c.scores[d] * w;
        den += w;
      });
      acc[d] = Math.round(den > 0 ? num / den : 50);
      return acc;
    },
    {} as Record<Dimension, number>,
  );

  const next: DecisionProfile = {
    version: 1,
    missionsCompleted: prev.missionsCompleted + (filtered.length === prev.contributions.length ? 1 : 0),
    contributions,
    scores: newScores,
    emergingPattern: deriveEmergingPattern(contributions),
  };
  writeProfile(next);
  return next;
}

export function useDecisionProfile() {
  const [profile, setProfile] = useState<DecisionProfile>(() => empty());
  useEffect(() => {
    setProfile(readProfile());
  }, []);
  return profile;
}

/** Per-dimension delta in the *displayed* rolling-average score from the
 *  previous mission to the latest. Matches the number on screen, so the
 *  arrow and the value tell the same story. Null if <2 contributions. */
export function dimensionTrends(
  profile: DecisionProfile,
): Record<Dimension, number | null> {
  const out = {} as Record<Dimension, number | null>;
  const n = profile.contributions.length;
  if (n < 2) {
    for (const d of DIMENSIONS) out[d] = null;
    return out;
  }
  // Rolling weighted average over contributions[0..n-2] (state before the
  // latest mission). Mirrors the weighting in updateProfileWithAnalysis.
  const prev = profile.contributions.slice(0, -1);
  for (const d of DIMENSIONS) {
    let num = 0;
    let den = 0;
    prev.forEach((c, i) => {
      const w = 1 + i * 0.25;
      num += c.scores[d] * w;
      den += w;
    });
    const prevAvg = Math.round(den > 0 ? num / den : 50);
    out[d] = profile.scores[d] - prevAvg;
  }
  return out;
}
