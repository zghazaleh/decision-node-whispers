import { audioUrl } from "@/lib/audio/assets";

// Existing per-mission pointers kept as fallbacks for missions whose beds
// pre-date the ElevenLabs revamp. New beds are resolved by name through the
// glob registry so missing assets stay tolerant.
import releaseTrack from "@/assets/audio/ambient-release.mp3.asset.json";
import mission02Track from "@/assets/audio/mission-02-ambient.mp3.asset.json";
import mission03Track from "@/assets/audio/mission-03-ambient.mp3.asset.json";
import mission04Track from "@/assets/audio/mission-04-ambient.mp3.asset.json";

export type Soundtrack = {
  url: string;
  mood: string;
  volume: number; // 0..1 target volume
};

function bed(name: string, fallback: string | null, mood: string, volume = 0.3): Soundtrack | null {
  const url = audioUrl(name) ?? fallback;
  if (!url) return null;
  return { url, mood, volume };
}

const _missions: Record<string, Soundtrack | null> = {
  "mission-01": { url: releaseTrack.url, mood: "Tense, suspended. The room before the decision.", volume: 0.35 },
  "mission-02": { url: mission02Track.url, mood: "Windowless tribunal anteroom. Fluorescent hum, cold institutional dread.", volume: 0.3 },
  "mission-03": { url: mission03Track.url, mood: "Mission Control at 2am. Sub-heavy drone, distant hum, dread held in stillness.", volume: 0.3 },
  "mission-04": { url: mission04Track.url, mood: "Senate hideaway, thunderstorm. Warm heavy drone, distant thunder, weight of history.", volume: 0.3 },
  "mission-05": bed("mission-05", null, "Clinical night. Arrhythmic monitor pulses slipping out of sync. Encroaching red.", 0.3),
  "mission-06": bed("mission-06", null, "Vertiginous newsroom at night. Unstable, ticking deadline.", 0.3),
  "mission-07": bed("mission-07", null, "Rising river dread. Sub rumble that swells, distant rain.", 0.3),
  "mission-08": bed("mission-08", null, "Empty office at 3am. A single lamp. Quiet ache.", 0.3),
  "mission-09": bed("mission-09", null, "Frozen besieged city. Distant shelling, taut breath.", 0.3),
  // Pseudo "screens" — played through the same loop engine as missions.
  __landing__: bed("landing-drone", null, "Stillness. The room before anything.", 0.3),
  __archive__: bed("archive-bed", null, "Hushed reading room. Low warm drone.", 0.25),
  __analysis__: bed("analysis-theme", null, "Reflective. Resolved but unsettled.", 0.3),
};

export const SOUNDTRACKS = _missions as Record<string, Soundtrack>;

export function getSoundtrack(missionId: string): Soundtrack | null {
  return _missions[missionId] ?? null;
}
