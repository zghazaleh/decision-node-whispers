import releaseTrack from "@/assets/audio/ambient-release.mp3.asset.json";
import mission02Track from "@/assets/audio/mission-02-ambient.mp3.asset.json";
import mission03Track from "@/assets/audio/mission-03-ambient.mp3.asset.json";
import mission04Track from "@/assets/audio/mission-04-ambient.mp3.asset.json";

export type Soundtrack = {
  url: string;
  mood: string;
  volume: number; // 0..1 target volume
};

export const SOUNDTRACKS: Record<string, Soundtrack> = {
  "mission-01": {
    url: releaseTrack.url,
    mood: "Tense, suspended. The room before the decision.",
    volume: 0.35,
  },
  "mission-02": {
    url: mission02Track.url,
    mood: "Windowless tribunal anteroom. Fluorescent hum, cold institutional dread.",
    volume: 0.3,
  },
  "mission-03": {
    url: mission03Track.url,
    mood: "Mission Control at 2am. Sub-heavy drone, distant hum, dread held in stillness.",
    volume: 0.3,
  },
  "mission-04": {
    url: mission04Track.url,
    mood: "Senate hideaway, thunderstorm. Warm heavy drone, distant thunder, weight of history.",
    volume: 0.3,
  },
};

export function getSoundtrack(missionId: string): Soundtrack | null {
  return SOUNDTRACKS[missionId] ?? null;
}
