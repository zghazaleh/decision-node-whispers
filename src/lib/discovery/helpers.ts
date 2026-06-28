import { getMissionEngine } from "@/lib/missions/registry";

export function getSceneSrc(missionId: string): string | null {
  const engine = getMissionEngine(missionId);
  const src = engine?.scene?.src;
  return typeof src === "string" ? src : null;
}

export function shortDuration(d: string | undefined): string {
  if (!d) return "—";
  return d.replace(/\s*min\b/i, "m");
}

export function toneWord(t: string | undefined): string {
  if (!t) return "—";
  return t.split("·")[0]!.trim();
}
