/**
 * Mission engine registry.
 *
 * Add a new mission by creating `src/lib/missions/<mission-id>/index.ts`
 * that exports a `MissionEngine`, then register it here. Everything
 * downstream (chat system prompt, decision classifier, outcome narration,
 * decision presets) reads from this registry by mission id.
 *
 * Every engine is validated at registration time. A mission with a missing
 * or malformed canon / outcomes set fails loudly here instead of crashing
 * deeper in the analyzer or chat route.
 */

import type { MissionEngine } from "./types";
import { missionOneEngine } from "./mission-01";
import { missionTwoEngine } from "./mission-02";
import { missionThreeEngine } from "./mission-03";
import { missionFourEngine } from "./mission-04";
import { missionFiveEngine } from "./mission-05";
import { missionSixEngine } from "./mission-06";
import { missionSevenEngine } from "./mission-07";
import { missionEightEngine } from "./mission-08";
import { missionNineEngine } from "./mission-09";
import { composeSystemPrompt } from "./director-invariants";
import {
  formatMissionEngineErrors,
  validateMissionEngine,
  type MissionEngineValidationError,
} from "./validation";

const REGISTRY: Record<string, MissionEngine> = {};
const VALIDATION_ERRORS: Record<string, MissionEngineValidationError[]> = {};

function register(engine: MissionEngine): void {
  const result = validateMissionEngine(engine);
  if (!result.ok) {
    VALIDATION_ERRORS[engine?.id ?? "(unknown)"] = result.errors;
    // Loud, single-line server-side warning so the failure is visible in logs
    // even when callers use the safe lookups below.
    // eslint-disable-next-line no-console
    console.error(formatMissionEngineErrors(engine?.id ?? "(unknown)", result.errors));
    return;
  }
  // Inject the shared Director invariants at the top of every mission's
  // system prompt. A new mission cannot bypass the constitution by simply
  // forgetting to copy the rules block.
  REGISTRY[engine.id] = {
    ...engine,
    systemPrompt: composeSystemPrompt(engine.systemPrompt),
  };
}

register(missionOneEngine);
register(missionTwoEngine);
register(missionThreeEngine);
register(missionFourEngine);
register(missionFiveEngine);
register(missionSixEngine);
register(missionSevenEngine);
register(missionEightEngine);
register(missionNineEngine);

export function getMissionEngine(missionId: string): MissionEngine | null {
  return REGISTRY[missionId] ?? null;
}

export function requireMissionEngine(missionId: string): MissionEngine {
  const engine = getMissionEngine(missionId);
  if (engine) return engine;
  const errs = VALIDATION_ERRORS[missionId];
  if (errs) throw new Error(formatMissionEngineErrors(missionId, errs));
  throw new Error(`Unknown mission id: ${missionId}`);
}

export function listMissionEngineIds(): string[] {
  return Object.keys(REGISTRY);
}

export function getMissionEngineValidationErrors(
  missionId: string,
): MissionEngineValidationError[] | null {
  return VALIDATION_ERRORS[missionId] ?? null;
}
