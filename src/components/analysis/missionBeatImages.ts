// Per-mission cinematic beat images for the "What Happened" film sequence.
// Each mission contributes three images that progress temporally:
// I (immediate) → II (medium term) → III (long after).
// Falls back to the generic beat images when a mission has no override.

import beatImmediate from "@/assets/analysis/beat-immediate.jpg";
import beatMedium from "@/assets/analysis/beat-medium.jpg";
import beatLong from "@/assets/analysis/beat-long.jpg";

import m01b1 from "@/assets/analysis/mission-01/beat-1.jpg";
import m01b2 from "@/assets/analysis/mission-01/beat-2.jpg";
import m01b3 from "@/assets/analysis/mission-01/beat-3.jpg";
import m02b1 from "@/assets/analysis/mission-02/beat-1.jpg";
import m02b2 from "@/assets/analysis/mission-02/beat-2.jpg";
import m02b3 from "@/assets/analysis/mission-02/beat-3.jpg";
import m03b1 from "@/assets/analysis/mission-03/beat-1.jpg";
import m03b2 from "@/assets/analysis/mission-03/beat-2.jpg";
import m03b3 from "@/assets/analysis/mission-03/beat-3.jpg";
import m04b1 from "@/assets/analysis/mission-04/beat-1.jpg";
import m04b2 from "@/assets/analysis/mission-04/beat-2.jpg";
import m04b3 from "@/assets/analysis/mission-04/beat-3.jpg";
import m05b1 from "@/assets/analysis/mission-05/beat-1.jpg";
import m05b2 from "@/assets/analysis/mission-05/beat-2.jpg";
import m05b3 from "@/assets/analysis/mission-05/beat-3.jpg";
import m06b1 from "@/assets/analysis/mission-06/beat-1.jpg";
import m06b2 from "@/assets/analysis/mission-06/beat-2.jpg";
import m06b3 from "@/assets/analysis/mission-06/beat-3.jpg";
import m07b1 from "@/assets/analysis/mission-07/beat-1.jpg";
import m07b2 from "@/assets/analysis/mission-07/beat-2.jpg";
import m07b3 from "@/assets/analysis/mission-07/beat-3.jpg";
import m08b1 from "@/assets/analysis/mission-08/beat-1.jpg";
import m08b2 from "@/assets/analysis/mission-08/beat-2.jpg";
import m08b3 from "@/assets/analysis/mission-08/beat-3.jpg";
import m09b1 from "@/assets/analysis/mission-09/beat-1.jpg";
import m09b2 from "@/assets/analysis/mission-09/beat-2.jpg";
import m09b3 from "@/assets/analysis/mission-09/beat-3.jpg";
import m10b1 from "@/assets/analysis/mission-10/beat-1.jpg";
import m10b2 from "@/assets/analysis/mission-10/beat-2.jpg";
import m10b3 from "@/assets/analysis/mission-10/beat-3.jpg";
import m11b1 from "@/assets/analysis/mission-11/beat-1.jpg";
import m11b2 from "@/assets/analysis/mission-11/beat-2.jpg";
import m11b3 from "@/assets/analysis/mission-11/beat-3.jpg";
import m12b1 from "@/assets/analysis/mission-12/beat-1.jpg";
import m12b2 from "@/assets/analysis/mission-12/beat-2.jpg";
import m12b3 from "@/assets/analysis/mission-12/beat-3.jpg";
import m13b1 from "@/assets/analysis/mission-13/beat-1.jpg";
import m13b2 from "@/assets/analysis/mission-13/beat-2.jpg";
import m13b3 from "@/assets/analysis/mission-13/beat-3.jpg";
import m14b1 from "@/assets/analysis/mission-14/beat-1.jpg";
import m14b2 from "@/assets/analysis/mission-14/beat-2.jpg";
import m14b3 from "@/assets/analysis/mission-14/beat-3.jpg";
import m15b1 from "@/assets/analysis/mission-15/beat-1.jpg";
import m15b2 from "@/assets/analysis/mission-15/beat-2.jpg";
import m15b3 from "@/assets/analysis/mission-15/beat-3.jpg";
import m16b1 from "@/assets/analysis/mission-16/beat-1.jpg";
import m16b2 from "@/assets/analysis/mission-16/beat-2.jpg";
import m16b3 from "@/assets/analysis/mission-16/beat-3.jpg";
import m17b1 from "@/assets/analysis/mission-17/beat-1.jpg";
import m17b2 from "@/assets/analysis/mission-17/beat-2.jpg";
import m17b3 from "@/assets/analysis/mission-17/beat-3.jpg";
import m18b1 from "@/assets/analysis/mission-18/beat-1.jpg";
import m18b2 from "@/assets/analysis/mission-18/beat-2.jpg";
import m18b3 from "@/assets/analysis/mission-18/beat-3.jpg";
import m19b1 from "@/assets/analysis/mission-19/beat-1.jpg";
import m19b2 from "@/assets/analysis/mission-19/beat-2.jpg";
import m19b3 from "@/assets/analysis/mission-19/beat-3.jpg";
import m20b1 from "@/assets/analysis/mission-20/beat-1.jpg";
import m20b2 from "@/assets/analysis/mission-20/beat-2.jpg";
import m20b3 from "@/assets/analysis/mission-20/beat-3.jpg";

export type BeatTriplet = readonly [string, string, string];

const MAP: Record<string, BeatTriplet> = {
  "mission-01": [m01b1, m01b2, m01b3],
  "mission-02": [m02b1, m02b2, m02b3],
  "mission-03": [m03b1, m03b2, m03b3],
  "mission-04": [m04b1, m04b2, m04b3],
  "mission-05": [m05b1, m05b2, m05b3],
  "mission-06": [m06b1, m06b2, m06b3],
  "mission-07": [m07b1, m07b2, m07b3],
  "mission-08": [m08b1, m08b2, m08b3],
  "mission-09": [m09b1, m09b2, m09b3],
  "mission-10": [m10b1, m10b2, m10b3],
  "mission-11": [m11b1, m11b2, m11b3],
  "mission-12": [m12b1, m12b2, m12b3],
  "mission-13": [m13b1, m13b2, m13b3],
  "mission-14": [m14b1, m14b2, m14b3],
  "mission-15": [m15b1, m15b2, m15b3],
  "mission-16": [m16b1, m16b2, m16b3],
  "mission-17": [m17b1, m17b2, m17b3],
  "mission-18": [m18b1, m18b2, m18b3],
  "mission-19": [m19b1, m19b2, m19b3],
  "mission-20": [m20b1, m20b2, m20b3],
};

const FALLBACK: BeatTriplet = [beatImmediate, beatMedium, beatLong];

export function beatsForMission(missionId?: string): BeatTriplet {
  if (!missionId) return FALLBACK;
  return MAP[missionId] ?? FALLBACK;
}
