import { useEffect, useState } from "react";
import type { UIMessage } from "ai";
import type { DecisionAnalysis } from "@/lib/analysis.functions";

const KEY = "decision-node:mission-01";

export type SavedMission = {
  messages: UIMessage[];
  startedAt: number;
  decision?: string;
  reasoning?: string;
  analysis?: DecisionAnalysis;
  decidedAt?: number;
};

const empty = (): SavedMission => ({ messages: [], startedAt: Date.now() });

export function readMission(): SavedMission {
  if (typeof window === "undefined") return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as SavedMission;
    return { ...empty(), ...parsed };
  } catch {
    return empty();
  }
}

export function writeMission(m: SavedMission) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(m));
}

export function clearMission() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

export function useMission() {
  const [mission, setMission] = useState<SavedMission>(empty);
  useEffect(() => { setMission(readMission()); }, []);
  return {
    mission,
    update: (patch: Partial<SavedMission> | ((prev: SavedMission) => SavedMission)) => {
      setMission((prev) => {
        const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
        writeMission(next);
        return next;
      });
    },
    reset: () => { clearMission(); setMission(empty()); },
  };
}

export function partsToText(message: UIMessage): string {
  return message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("")
    .trim();
}
