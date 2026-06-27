import releaseTrack from "@/assets/audio/ambient-release.mp3.asset.json";

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
};

export function getSoundtrack(missionId: string): Soundtrack | null {
  return SOUNDTRACKS[missionId] ?? null;
}
