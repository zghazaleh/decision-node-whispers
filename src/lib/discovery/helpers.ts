import { SCENE_SRC } from "@/lib/missions/client-manifest";

export function getSceneSrc(missionId: string): string | null {
  return SCENE_SRC[missionId] ?? null;
}

export function shortDuration(d: string | undefined): string {
  if (!d) return "—";
  return d.replace(/\s*min\b/i, "m");
}

export function toneWord(t: string | undefined): string {
  if (!t) return "—";
  return t.split("·")[0]!.trim();
}
