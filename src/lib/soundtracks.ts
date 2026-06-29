import { audioUrlVariants } from "@/lib/audio/assets";
import { pickSessionVariant } from "@/lib/audio/sessionVariant";

// Existing per-mission pointers kept as fallbacks for missions whose beds
// pre-date the ElevenLabs revamp. New beds (and variants) are resolved by
// name through the glob registry so missing assets stay tolerant and any
// `<name>-2.mp3`, `<name>-3.mp3` dropped into src/assets/audio/ is picked
// up automatically.
import releaseTrack from "@/assets/audio/ambient-release.mp3.asset.json";
import mission02Track from "@/assets/audio/mission-02-ambient.mp3.asset.json";
import mission03Track from "@/assets/audio/mission-03-ambient.mp3.asset.json";
import mission04Track from "@/assets/audio/mission-04-ambient.mp3.asset.json";

export type Soundtrack = {
  url: string;
  mood: string;
  volume: number; // 0..1 target volume
};

/**
 * Resolve a bed by registry name, honoring numbered variants. The chosen
 * variant is picked once per browser session and persisted, so the room's
 * bed feels continuous across reloads and cross-room returns within the
 * same tab. `fallback` is used only when nothing under that name exists.
 */
function bed(name: string, fallback: string | null, mood: string, volume = 0.3): Soundtrack | null {
  const urls = audioUrlVariants(name);
  let url: string | null;
  if (urls.length > 0) {
    const idx = pickSessionVariant(`bed:${name}`, urls.length);
    url = urls[idx] ?? urls[0];
  } else {
    url = fallback;
  }
  if (!url) return null;
  return { url, mood, volume };
}

const _missions: Record<string, Soundtrack | null> = {
  "mission-01": bed("ambient-release", releaseTrack.url, "Tense, suspended. The room before the decision.", 0.35),
  "mission-02": bed("mission-02-ambient", mission02Track.url, "Windowless tribunal anteroom. Fluorescent hum, cold institutional dread.", 0.3),
  "mission-03": bed("mission-03-ambient", mission03Track.url, "Mission Control at 2am. Sub-heavy drone, distant hum, dread held in stillness.", 0.3),
  "mission-04": bed("mission-04-ambient", mission04Track.url, "Senate hideaway, thunderstorm. Warm heavy drone, distant thunder, weight of history.", 0.3),
  "mission-05": bed("mission-05", null, "Clinical night. Arrhythmic monitor pulses slipping out of sync. Encroaching red.", 0.3),
  "mission-06": bed("mission-06", null, "Vertiginous newsroom at night. Unstable, ticking deadline.", 0.3),
  "mission-07": bed("mission-07", null, "Rising river dread. Sub rumble that swells, distant rain.", 0.3),
  "mission-08": bed("mission-08", null, "Empty office at 3am. A single lamp. Quiet ache.", 0.3),
  "mission-09": bed("mission-09", null, "Frozen besieged city. Distant shelling, taut breath.", 0.3),
  "mission-10": bed("mission-10", null, "Freezing checkpoint. Diesel idle, breath fogging, dread held quiet.", 0.3),
  "mission-11": bed("mission-11", null, "Sweltering jury room. Failing fan, fluorescent hum, indifferent city outside.", 0.3),
  // Pseudo "screens" — played through the same loop engine as missions.
  __landing__: bed("landing-drone", null, "Stillness. The room before anything.", 0.3),
  __archive__: bed("archive-bed", null, "Hushed reading room. Low warm drone.", 0.25),
  __analysis__: bed("analysis-theme", null, "Reflective. Resolved but unsettled.", 0.3),
};

export const SOUNDTRACKS = _missions as Record<string, Soundtrack>;

export function getSoundtrack(missionId: string): Soundtrack | null {
  return _missions[missionId] ?? null;
}
