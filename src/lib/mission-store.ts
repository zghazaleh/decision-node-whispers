import { useEffect, useState } from "react";
import type { UIMessage } from "ai";
import type { DecisionAnalysis } from "@/lib/analysis.functions";
import { syncMissionToDB, getCurrentUserId } from "@/lib/auth-sync";
import { deleteSavedMission } from "@/lib/user-data.functions";

const KEY_PREFIX = "decision-node:mission:";
const ACTIVE_KEY = "decision-node:active-mission";

export type SavedMission = {
  missionId: string;
  messages: UIMessage[];
  startedAt: number;
  decision?: string;
  reasoning?: string;
  analysis?: DecisionAnalysis;
  decidedAt?: number;
  /** Archetype id classified for the decision (preset or LLM-classified). */
  archetypeId?: string;
  /** Player-reported confidence 0..100 at commit time. */
  confidence?: number;
};

const empty = (missionId: string): SavedMission => ({
  missionId,
  messages: [],
  startedAt: Date.now(),
});

function keyFor(missionId: string) {
  return `${KEY_PREFIX}${missionId}`;
}

export function readMission(missionId?: string): SavedMission {
  if (typeof window === "undefined") return empty(missionId ?? "mission-01");
  const id = missionId ?? window.localStorage.getItem(ACTIVE_KEY) ?? "mission-01";
  try {
    const raw = window.localStorage.getItem(keyFor(id));
    if (!raw) return empty(id);
    const parsed = JSON.parse(raw) as SavedMission;
    return { ...empty(id), ...parsed, missionId: id };
  } catch {
    return empty(id);
  }
}

export function writeMission(m: SavedMission) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(keyFor(m.missionId), JSON.stringify(m));
  window.localStorage.setItem(ACTIVE_KEY, m.missionId);
  syncMissionToDB(m);
}

export function clearMission(missionId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(keyFor(missionId));
  if (getCurrentUserId()) {
    void deleteSavedMission({ data: { missionId } }).catch((err) =>
      console.warn("[sync] delete mission", err),
    );
  }
}

export function getActiveMissionId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_KEY);
}

export function useMission(missionId: string) {
  const [mission, setMission] = useState<SavedMission>(() => empty(missionId));
  useEffect(() => {
    setMission(readMission(missionId));
  }, [missionId]);
  return {
    mission,
    update: (patch: Partial<SavedMission> | ((prev: SavedMission) => SavedMission)) => {
      setMission((prev) => {
        const next =
          typeof patch === "function"
            ? patch(prev)
            : { ...prev, ...patch, missionId: prev.missionId };
        writeMission(next);
        return next;
      });
    },
    reset: () => {
      clearMission(missionId);
      setMission(empty(missionId));
    },
  };
}

export function partsToText(message: UIMessage): string {
  return message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
}
