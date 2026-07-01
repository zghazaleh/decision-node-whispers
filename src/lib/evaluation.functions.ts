/**
 * Admin evaluation report — server function.
 *
 * Aggregates three signals about the latest build:
 *   1. Decision Nodes framework validation per mission
 *   2. Constitution checks per mission (chip trailer, invariants block,
 *      archetype depth, hidden-truth leakage, moralizing vocabulary)
 *   3. Percentile-surface audit (does the analysis route still expose
 *      ranking / "longer than X% of players" framing forbidden by #4)
 *
 * Gated by ADMIN_EVAL_TOKEN (server-only secret). The caller must pass
 * the same token; comparison is constant-time.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { listMissionEngineIds, requireMissionEngine } from "./missions/registry.server";
import {
  getMissionFramework,
  validateMissionFramework,
} from "./missions/framework";
import { DIRECTOR_INVARIANTS } from "./missions/director-invariants";

const CHIPS_TRAILER = /<<chips:\s*"[^"]+"\s*\|\s*"[^"]+"\s*\|\s*"[^"]+"\s*>>\s*$/;
const MORALIZING_RE = /\b(say|say that|is|are|was|were|the)\s+(correct|incorrect)\b/i;

// Patterns that would re-introduce leaderboard / ranking language on the
// player-facing analysis surface (constitution §08 non-negotiable #4).
const RANKING_PATTERNS: { label: string; re: RegExp }[] = [
  { label: '"longer than X% of players"', re: /longer than[^.]{0,40}% of (players|people)/i },
  { label: '"faster than X%"', re: /faster than[^.]{0,40}%/i },
  { label: '"top N%"', re: /\btop\s+\d+\s*%/i },
  { label: '"leaderboard"', re: /\bleaderboard\b/i },
  { label: '"rank"/"ranked"', re: /\brank(ed|ing)?\b/i },
  { label: '"percentile" word visible to player', re: /percentile/i },
];

export type MissionEvaluation = {
  id: string;
  frameworkMissing: string[];
  checks: {
    invariantsInherited: boolean;
    chipTrailerOk: boolean;
    archetypeDepthOk: boolean;
    decisionPresetsWired: boolean;
    hiddenTruthLeak: string | null;
    moralizingVocabulary: boolean;
  };
  pass: boolean;
};

export type EvaluationReport = {
  generatedAt: string;
  missions: MissionEvaluation[];
  summary: {
    totalMissions: number;
    fullyPassing: number;
    frameworkIncomplete: number;
    constitutionFailures: number;
  };
  percentileAudit: {
    file: string;
    findings: { pattern: string; lineNumbers: number[] }[];
    clean: boolean;
  };
  invariants: {
    forbidsAIMention: boolean;
    forbidsPlayerInteriority: boolean;
    enforcesChipsProtocol: boolean;
    forbidsCountdown: boolean;
  };
};

function evaluateMission(id: string): MissionEvaluation {
  const engine = requireMissionEngine(id);
  const frameworkMissing = validateMissionFramework(id);

  const invariantsInherited =
    engine.systemPrompt.includes("DIRECTOR INVARIANTS") &&
    engine.systemPrompt.includes("Never describe the player's thoughts");

  const chipTrailerOk = CHIPS_TRAILER.test(engine.opening.text.trim());

  const archetypes = Object.values(engine.archetypes);
  const archetypeDepthOk =
    archetypes.length >= 2 &&
    archetypes.every(
      (a) => a.timeline.length >= 3 && Object.keys(a.secondOrder).length >= 1,
    );

  const decisionPresetsWired =
    engine.decisionPresets.length >= 2 &&
    engine.decisionPresets.every((p) => Boolean(engine.archetypes[p.archetypeId]));

  let hiddenTruthLeak: string | null = null;
  const fw = getMissionFramework(id);
  if (fw) {
    const opening = engine.opening.text.toLowerCase();
    for (const truth of fw.hiddenTruths) {
      const words = truth.toLowerCase().split(/\s+/).filter(Boolean);
      if (words.length < 6) continue;
      const phrase = words.slice(2, 7).join(" ");
      if (opening.includes(phrase)) {
        hiddenTruthLeak = phrase;
        break;
      }
    }
  }

  const moralizingVocabulary = MORALIZING_RE.test(engine.systemPrompt);

  const pass =
    frameworkMissing.length === 0 &&
    invariantsInherited &&
    chipTrailerOk &&
    archetypeDepthOk &&
    decisionPresetsWired &&
    hiddenTruthLeak === null &&
    !moralizingVocabulary;

  return {
    id,
    frameworkMissing,
    checks: {
      invariantsInherited,
      chipTrailerOk,
      archetypeDepthOk,
      decisionPresetsWired,
      hiddenTruthLeak,
      moralizingVocabulary,
    },
    pass,
  };
}

async function auditPercentileSurface(): Promise<EvaluationReport["percentileAudit"]> {
  // Read the player-facing analysis route from disk and grep for ranking
  // language. We allow `percentile` in imports/type-only positions but flag
  // it inside JSX-visible string literals via the regex above (it matches
  // anywhere; we then filter out import/type lines).
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const file = "src/routes/analysis.tsx";
  let source = "";
  try {
    source = await fs.readFile(path.resolve(process.cwd(), file), "utf8");
  } catch {
    return { file, findings: [], clean: true };
  }
  const lines = source.split("\n");
  const findings: { pattern: string; lineNumbers: number[] }[] = [];
  for (const { label, re } of RANKING_PATTERNS) {
    const hits: number[] = [];
    lines.forEach((line, idx) => {
      // Skip import lines and pure TypeScript type references — they are
      // internal and never reach the player.
      const trimmed = line.trim();
      if (
        trimmed.startsWith("import ") ||
        trimmed.startsWith("//") ||
        trimmed.startsWith("*") ||
        /^type\s/.test(trimmed) ||
        /MissionPercentile/.test(trimmed)
      ) {
        return;
      }
      if (re.test(line)) hits.push(idx + 1);
    });
    if (hits.length) findings.push({ pattern: label, lineNumbers: hits });
  }
  return { file, findings, clean: findings.length === 0 };
}

function evaluateInvariants(): EvaluationReport["invariants"] {
  return {
    forbidsAIMention: /never refer to yourself as an AI/i.test(DIRECTOR_INVARIANTS),
    forbidsPlayerInteriority: /never describe the player's thoughts/i.test(
      DIRECTOR_INVARIANTS,
    ),
    enforcesChipsProtocol: /<<chips:/.test(DIRECTOR_INVARIANTS),
    forbidsCountdown: /no countdown numbers/i.test(DIRECTOR_INVARIANTS),
  };
}

function constantTimeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const getEvaluationReport = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ token: z.string().min(1) }).parse(d))
  .handler(async ({ data }): Promise<EvaluationReport> => {
    const expected = process.env.ADMIN_EVAL_TOKEN;
    if (!expected || !constantTimeEq(data.token, expected)) {
      throw new Response("Unauthorized", { status: 401 });
    }

    const ids = listMissionEngineIds();
    const missions = ids.map(evaluateMission);
    const fullyPassing = missions.filter((m) => m.pass).length;
    const frameworkIncomplete = missions.filter(
      (m) => m.frameworkMissing.length > 0,
    ).length;
    const constitutionFailures = missions.filter((m) => {
      const c = m.checks;
      return (
        !c.invariantsInherited ||
        !c.chipTrailerOk ||
        !c.archetypeDepthOk ||
        !c.decisionPresetsWired ||
        c.hiddenTruthLeak !== null ||
        c.moralizingVocabulary
      );
    }).length;

    const percentileAudit = await auditPercentileSurface();
    const invariants = evaluateInvariants();

    return {
      generatedAt: new Date().toISOString(),
      missions,
      summary: {
        totalMissions: missions.length,
        fullyPassing,
        frameworkIncomplete,
        constitutionFailures,
      },
      percentileAudit,
      invariants,
    };
  });
