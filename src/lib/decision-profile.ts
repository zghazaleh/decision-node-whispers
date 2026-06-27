import { useEffect, useState } from "react";
import type { DecisionAnalysis } from "@/lib/analysis.functions";

const KEY = "decision-node:profile";

export const DIMENSIONS = [
  "curiosity",
  "strategicThinking",
  "adaptability",
  "confidenceCalibration",
  "informationGathering",
  "longTermThinking",
  "biasResistance",
  "patternRecognition",
] as const;

export type Dimension = (typeof DIMENSIONS)[number];

export const DIMENSION_LABELS: Record<Dimension, string> = {
  curiosity: "Curiosity",
  strategicThinking: "Strategic Thinking",
  adaptability: "Adaptability",
  confidenceCalibration: "Confidence Calibration",
  informationGathering: "Information Gathering",
  longTermThinking: "Long-term Thinking",
  biasResistance: "Bias Resistance",
  patternRecognition: "Pattern Recognition",
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
  emergingPattern: "Not enough data yet. Complete a mission to begin shaping your Decision DNA.",
});

export function readProfile(): DecisionProfile {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as DecisionProfile;
    if (parsed.version !== 1) return empty();
    return parsed;
  } catch {
    return empty();
  }
}

function writeProfile(p: DecisionProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

/** Deterministic score in 0–100 from analysis content. */
function scoreFromAnalysis(a: DecisionAnalysis): {
  scores: Record<Dimension, number>;
  signals: string[];
} {
  const r = a.reasoningAssessment;
  const strengths = r?.strengths?.length ?? 0;
  const blindSpots = r?.blindSpots?.length ?? 0;
  const biases = r?.possibleBiases?.length ?? 0;
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

  const hasAny = (s: string, words: string[]) => words.some((w) => s.includes(w));

  const curiosity = clamp(
    50 + strengths * 6 - blindSpots * 4 + (hasAny(calText, ["asked", "question", "probed"]) ? 8 : 0),
  );
  const strategicThinking = clamp(
    50 +
      (hasAny(alt, ["leverage", "long", "second-order", "downstream", "cascade"]) ? 14 : 0) +
      (hasAny(closing, ["strategic", "structural", "systemic"]) ? 8 : 0) -
      blindSpots * 3,
  );
  const adaptability = clamp(
    50 + revised * 10 - held * 12 + (traj.length >= 4 ? 5 : 0),
  );
  const confidenceCalibration = clamp(
    50 +
      (hasAny(calText, ["calibrat", "matched", "appropriate", "measured"]) ? 18 : 0) -
      (hasAny(calText, ["overconfid", "overstated", "certain", "absolute"]) ? 22 : 0) -
      (hasAny(luckText, ["lucky", "fortunate", "got away"]) ? 10 : 0),
  );
  const informationGathering = clamp(
    50 + Math.min(20, used / 20) - Math.min(25, ignored / 18) + strengths * 4,
  );
  const longTermThinking = clamp(
    50 +
      (hasAny(alt + closing, ["long-term", "long term", "future", "downstream", "second-order"]) ? 18 : 0) -
      (hasAny(closing, ["short-term", "immediate", "reactive"]) ? 10 : 0),
  );
  const biasResistance = clamp(
    70 - biases * 14 - (held > revised ? 8 : 0),
  );
  const patternRecognition = clamp(
    50 + strengths * 5 + reinforced * 4 - (held > 1 ? 8 : 0),
  );

  const signals: string[] = [];
  if (held > revised) signals.push("anchored-after-confidence-rose");
  if (revised >= 2) signals.push("updates-on-evidence");
  if (biases >= 2) signals.push("multiple-bias-textures");
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
      patternRecognition,
    },
    signals,
  };
}

function deriveEmergingPattern(contribs: MissionContribution[]): string {
  if (contribs.length === 0)
    return "Not enough data yet. Complete a mission to begin shaping your Decision DNA.";
  const recent = contribs.slice(-5);
  const tally: Record<string, number> = {};
  for (const c of recent) for (const s of c.signals) tally[s] = (tally[s] ?? 0) + 1;
  const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
  if (!top || top[1] < 2) {
    return "Your pattern is still forming. Each mission sharpens the read on how you decide.";
  }
  const [tag] = top;
  switch (tag) {
    case "anchored-after-confidence-rose":
      return "You consistently form accurate early hypotheses, but you tend to stop searching for contradictory evidence once your confidence increases.";
    case "updates-on-evidence":
      return "You let evidence move you. Your working theory gets revised when the room gives you reason to revise it — a rare habit.";
    case "multiple-bias-textures":
      return "Cognitive shortcuts show up under time pressure. Naming them in the moment is the next leverage point.";
    case "reachable-evidence-skipped":
      return "You decide before the room is fully read. A pattern of leaving accessible information on the table.";
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

/** Per-dimension delta from previous mission to latest, or null if <2 contributions. */
export function dimensionTrends(
  profile: DecisionProfile,
): Record<Dimension, number | null> {
  const out = {} as Record<Dimension, number | null>;
  const n = profile.contributions.length;
  for (const d of DIMENSIONS) {
    if (n < 2) out[d] = null;
    else
      out[d] =
        profile.contributions[n - 1].scores[d] -
        profile.contributions[n - 2].scores[d];
  }
  return out;
}
