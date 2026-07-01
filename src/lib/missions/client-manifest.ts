/**
 * Client-safe per-mission manifest. Contains ONLY assets and metadata that
 * are visible to the player anyway (scene backgrounds shown as card art or
 * mission backdrop). Never add systemPrompt, canon, hidden truths, archetype
 * timelines, secondOrder, or tone here — those must stay server-only in
 * `registry.server.ts` and be fetched via `mission-shell.functions.ts`.
 */

import s01 from "@/assets/scene-office.jpg";
import s02 from "@/assets/scene-tribunal.jpg";
import s03 from "@/assets/scene-capsule.jpg";
import s04 from "@/assets/scene-senate.jpg";
import s05 from "@/assets/scene-codeblack.jpg";
import s06 from "@/assets/scene-newsroom.jpg";
import s07 from "@/assets/scene-spillway.jpg";
import s08 from "@/assets/scene-veyra.jpg";
import s09 from "@/assets/scene-interpreter.jpg";
import s10 from "@/assets/scene-checkpoint.jpg";
import s11 from "@/assets/scene-juryroom.jpg";
import s12 from "@/assets/scene-bunker.jpg";
import s13 from "@/assets/scene-dock.jpg";
import s14 from "@/assets/scene-lodger.jpg";
import s15 from "@/assets/scene-papers.jpg";
import s16 from "@/assets/scene-village.jpg";
import s17 from "@/assets/scene-rope.jpg";
import s18 from "@/assets/scene-spring.jpg";
import s19 from "@/assets/scene-carer.jpg";
import s20 from "@/assets/scene-test.jpg";

export const SCENE_SRC: Record<string, string> = {
  "mission-01": s01,
  "mission-02": s02,
  "mission-03": s03,
  "mission-04": s04,
  "mission-05": s05,
  "mission-06": s06,
  "mission-07": s07,
  "mission-08": s08,
  "mission-09": s09,
  "mission-10": s10,
  "mission-11": s11,
  "mission-12": s12,
  "mission-13": s13,
  "mission-14": s14,
  "mission-15": s15,
  "mission-16": s16,
  "mission-17": s17,
  "mission-18": s18,
  "mission-19": s19,
  "mission-20": s20,
};

export function sceneSrcFor(missionId: string): string | null {
  return SCENE_SRC[missionId] ?? null;
}
