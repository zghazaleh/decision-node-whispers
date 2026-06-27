/**
 * Mission engine registry.
 *
 * Add a new mission by creating `src/lib/missions/<mission-id>/index.ts`
 * that exports a `MissionEngine`, then register it here. Everything
 * downstream (chat system prompt, decision classifier, outcome narration,
 * decision presets) reads from this registry by mission id.
 */

import type { MissionEngine } from "./types";
import { missionOneEngine } from "./mission-01";

const REGISTRY: Record<string, MissionEngine> = {
  [missionOneEngine.id]: missionOneEngine,
};

export function getMissionEngine(missionId: string): MissionEngine | null {
  return REGISTRY[missionId] ?? null;
}

export function requireMissionEngine(missionId: string): MissionEngine {
  const engine = getMissionEngine(missionId);
  if (!engine) throw new Error(`Unknown mission id: ${missionId}`);
  return engine;
}

export function listMissionEngineIds(): string[] {
  return Object.keys(REGISTRY);
}
