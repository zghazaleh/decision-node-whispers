import { useEffect, useState } from "react";
import type { DecisionAnalysis } from "@/lib/analysis.functions";
import { syncProfileToDB } from "@/lib/auth-sync";

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
  /** Optional: one-sentence per-axis justification from the Analyzer.
   *  Surfaces under each dimension's drill-down. Missing for legacy
   *  contributions scored before structured sub-scores existed. */
  notes?: Partial<Record<Dimension, string>>;
  /** "model" when the Analyzer emitted dimensionScores; "heuristic" when
   *  scoring fell back to the legacy keyword path. */
  source?: "model" | "heuristic";
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

/** Validate the model's emitted dimensionScores. Returns null if any axis
 *  is missing, not finite, or outside [0,100]. */
function readModelScores(a: DecisionAnalysis): Record<Dimension, number> | null {
  const ds = a.dimensionScores;
  if (!ds) return null;
  const out = {} as Record<Dimension, number>;
  for (const d of DIMENSIONS) {
    const v = (ds as Record<string, unknown>)[d];
    if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 100) {
      return null;
    }
    out[d] = Math.round(v);
  }
  return out;
}

function readModelNotes(a: DecisionAnalysis): Partial<Record<Dimension, string>> | undefined {
  const dn = a.dimensionNotes;
  if (!dn) return undefined;
  const out: Partial<Record<Dimension, string>> = {};
  for (const d of DIMENSIONS) {
    const v = (dn as Record<string, unknown>)[d];
    if (typeof v === "string" && v.trim().length > 0) out[d] = v.trim();
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Legacy keyword-based scorer. Kept as a fallback for analyses that lack
 *  structured `dimensionScores` (older sessions, model omissions). */
function heuristicScores(a: DecisionAnalysis): Record<Dimension, number> {
  const r = a.reasoningAssessment;
  const strengths = r?.strengths?.length ?? 0;
  const blindSpots = r?.blindSpots?.length ?? 0;
  const biasList = r?.possibleBiases ?? [];
  // Prefer the model's own `confidence` enum on each bias; fall back to
  // hedge-word sniffing of the explanation text when absent.
  const hedgeRe = /\b(possibly|possible|may|might|tendency|tendencies|appears|appeared|seems|seemed|perhaps)\b/i;
  const biasWeight = biasList.reduce((sum, b) => {
    if (b?.confidence === "high") return sum + 1;
    if (b?.confidence === "medium") return sum + 0.66;
    if (b?.confidence === "low") return sum + 0.33;
    const text = `${b?.name ?? ""} ${b?.evidence ?? ""} ${b?.gentleExplanation ?? ""}`;
    return sum + (hedgeRe.test(text) ? 0.5 : 1);
  }, 0);
  const traj = a.beliefTrajectory ?? [];
  const revised = traj.filter((t) => t.update === "revised").length;
  const held = traj.filter((t) => t.update === "held").length;

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
  // Prefer the structured calibrationVerdict when present.
  const verdict = r?.calibrationVerdict;
  let confidenceCalibration: number;
  if (verdict === "calibrated") confidenceCalibration = 75;
  else if (verdict === "under") confidenceCalibration = 45;
  else if (verdict === "over") confidenceCalibration = 30;
  else {
    const calibratedRe = /\b(well[- ]calibrated|calibrated|appropriately\s+\w+|measured|matched\s+the\s+evidence|proportional)\b/;
    const overconfidentRe = /\b(overconfiden\w*|overstated|overclaim\w*|unwarranted\s+certainty|absolute\s+certainty)\b/;
    const underconfidentRe = /\b(underconfiden\w*|understated|hedged\s+too\s+much)\b/;
    const luckyRe = /(?<!\bno\s)(?<!\bnot\s)\b(lucky|fortunate|got\s+away|luck\s+rather\s+than)\b/;
    confidenceCalibration = clamp(
      50 +
        (has(calText, calibratedRe) ? 18 : 0) -
        (has(calText, overconfidentRe) ? 22 : 0) -
        (has(calText, underconfidentRe) ? 10 : 0) -
        (has(luckText, luckyRe) ? 10 : 0),
    );
  }
  const informationGathering = clamp(
    50 + Math.min(20, used / 20) - Math.min(25, ignored / 18) + strengths * 4,
  );
  const longTermThinking = clamp(
    50 +
      (has(alt + " " + closing, /\b(long[- ]term|future|downstream|second[- ]order)\b/) ? 18 : 0) -
      (has(closing, /\b(short[- ]term|immediate|reactive)\b/) ? 10 : 0),
  );
  const biasResistance = clamp(50 - biasWeight * 10 - (held > revised ? 8 : 0));
  const negotiation = clamp(
    50 + strengths * 4 + revised * 5 - held * 8 - biasWeight * 3,
  );

  return {
    curiosity,
    strategicThinking,
    adaptability,
    confidenceCalibration,
    informationGathering,
    longTermThinking,
    biasResistance,
    negotiation,
  };
}

/** Deterministic scoring entry point. Prefers model-emitted sub-scores
 *  when present and valid, falls back to the heuristic scorer otherwise. */
function scoreFromAnalysis(a: DecisionAnalysis): {
  scores: Record<Dimension, number>;
  signals: string[];
  notes?: Partial<Record<Dimension, string>>;
  source: "model" | "heuristic";
} {
  const r = a.reasoningAssessment;
  const traj = a.beliefTrajectory ?? [];
  const biasList = r?.possibleBiases ?? [];
  const hedgeRe = /\b(possibly|possible|may|might|tendency|tendencies|appears|appeared|seems|seemed|perhaps)\b/i;
  const biasWeight = biasList.reduce((sum, b) => {
    if (b?.confidence === "high") return sum + 1;
    if (b?.confidence === "medium") return sum + 0.66;
    if (b?.confidence === "low") return sum + 0.33;
    const text = `${b?.name ?? ""} ${b?.evidence ?? ""} ${b?.gentleExplanation ?? ""}`;
    return sum + (hedgeRe.test(text) ? 0.5 : 1);
  }, 0);
  const revised = traj.filter((t) => t.update === "revised").length;
  const held = traj.filter((t) => t.update === "held").length;
  const strengths = r?.strengths?.length ?? 0;
  const blindSpots = r?.blindSpots?.length ?? 0;
  const ignored = (a.evidenceIgnored ?? "").length;
  const used = (a.evidenceUsed ?? "").length;

  // Signals are derived from the same transcript facts regardless of scorer.
  const signals: string[] = [];
  if (held > revised) signals.push("anchored-after-confidence-rose");
  if (revised >= 2) signals.push("updates-on-evidence");
  if (biasWeight >= 2) signals.push("multiple-bias-textures");
  if (ignored > used) signals.push("reachable-evidence-skipped");
  if (strengths >= 3 && blindSpots === 0) signals.push("strong-process");

  const modelScores = readModelScores(a);
  if (modelScores) {
    return {
      scores: modelScores,
      signals,
      notes: readModelNotes(a),
      source: "model",
    };
  }
  return {
    scores: heuristicScores(a),
    signals,
    source: "heuristic",
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
  const { scores, signals, notes, source } = scoreFromAnalysis(analysis);
  const contribution: MissionContribution = {
    missionId,
    at: Date.now(),
    scores,
    signals,
    ...(notes ? { notes } : {}),
    source,
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

/** Half-width of the displayed confidence band for a dimension.
 *  Wider when the sample is small or the per-mission scores are volatile;
 *  narrows as missions accumulate and the estimate stabilizes. */
export type DimensionBand = {
  value: number;       // displayed rolling-average score (matches profile.scores)
  lo: number;          // clamped value - halfWidth
  hi: number;          // clamped value + halfWidth
  halfWidth: number;   // width of the uncertainty band, in score units
  samples: number;     // number of contributions backing this band
};

export function dimensionBands(
  profile: DecisionProfile,
): Record<Dimension, DimensionBand> {
  const n = profile.contributions.length;
  const out = {} as Record<Dimension, DimensionBand>;
  for (const d of DIMENSIONS) {
    const value = profile.scores[d];
    if (n === 0) {
      out[d] = { value, lo: value, hi: value, halfWidth: 0, samples: 0 };
      continue;
    }
    const xs = profile.contributions.map((c) => c.scores[d]);
    const mean = xs.reduce((s, x) => s + x, 0) / xs.length;
    const variance = xs.reduce((s, x) => s + (x - mean) ** 2, 0) / xs.length;
    const stdev = Math.sqrt(variance);
    // Prior dominates with few samples; observed volatility takes over later.
    const prior = 25 / Math.sqrt(n);
    const raw = prior + stdev * 0.55;
    const halfWidth = Math.max(4, Math.min(32, Math.round(raw)));
    out[d] = {
      value,
      lo: Math.max(0, value - halfWidth),
      hi: Math.min(100, value + halfWidth),
      halfWidth,
      samples: n,
    };
  }
  return out;
}

