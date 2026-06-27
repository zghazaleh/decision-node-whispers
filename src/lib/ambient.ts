import { getSoundtrack, type Soundtrack } from "./soundtracks";

// HTMLAudio-based ambient player with smooth crossfades between mission
// scores. Falls back gracefully if no track exists for a mission.

export type Ambient = {
  start: (missionId?: string) => Promise<void>;
  stop: () => void;
  switchTo: (missionId: string | null, fadeMs?: number) => Promise<void>;
  setMuted: (m: boolean) => void;
  /** 0..1 — drives subtle volume swell + slight detune as mission stakes rise. */
  setPressure: (p: number) => void;
  /** Toggle a low synthesized sub-pulse heartbeat as stakes peak. */
  setHeartbeat: (active: boolean) => void;
  isRunning: () => boolean;
  currentMission: () => string | null;
};


type Voice = {
  audio: HTMLAudioElement;
  track: Soundtrack;
  missionId: string;
  fadeRaf: number | null;
};

function rampVolume(v: Voice, target: number, ms: number, onDone?: () => void) {
  if (v.fadeRaf) cancelAnimationFrame(v.fadeRaf);
  const start = performance.now();
  const from = v.audio.volume;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    v.audio.volume = from + (target - from) * t;
    if (t < 1) {
      v.fadeRaf = requestAnimationFrame(step);
    } else {
      v.fadeRaf = null;
      onDone?.();
    }
  };
  v.fadeRaf = requestAnimationFrame(step);
}

export function createAmbient(initialMissionId: string | null = null): Ambient {
  let current: Voice | null = null;
  let muted = false;
  let stopped = true;
  let pendingMission: string | null = initialMissionId;
  let pressure = 0; // 0..1

  // Effective target volume for a track, accounting for pressure swell.
  // We lift by up to +55% of the base volume — still well below 1.0 for the
  // mission-01 ambient (base 0.35 → max ~0.54) so it never crowds dialogue.
  function targetVolume(track: Soundtrack): number {
    if (muted) return 0;
    const lift = 1 + pressure * 0.55;
    return Math.min(1, track.volume * lift);
  }

  function applyPressure(v: Voice, fadeMs = 4000) {
    rampVolume(v, targetVolume(v.track), fadeMs);
    // Subtle detune downward — feels heavier without being noticeable as pitch.
    try {
      v.audio.playbackRate = 1 - pressure * 0.04;
    } catch { /* noop */ }
  }

  async function playMission(missionId: string, fadeInMs: number): Promise<Voice | null> {
    const track = getSoundtrack(missionId);
    if (!track) return null;
    const audio = new Audio(track.url);
    audio.loop = true;
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audio.volume = 0;
    try {
      audio.playbackRate = 1 - pressure * 0.04;
    } catch { /* noop */ }
    try {
      await audio.play();
    } catch {
      return null;
    }
    const v: Voice = { audio, track, missionId, fadeRaf: null };
    rampVolume(v, targetVolume(track), fadeInMs);
    return v;
  }


  function disposeVoice(v: Voice, fadeMs: number) {
    rampVolume(v, 0, fadeMs, () => {
      try {
        v.audio.pause();
        v.audio.src = "";
        v.audio.load();
      } catch {
        /* noop */
      }
    });
  }

  return {
    isRunning: () => !stopped,
    currentMission: () => current?.missionId ?? null,

    async start(missionId?: string) {
      stopped = false;
      const target = missionId ?? pendingMission;
      if (!target) return;
      if (current?.missionId === target) return;
      const next = await playMission(target, 3500);
      if (!next) return;
      if (current) disposeVoice(current, 1200);
      current = next;
      pendingMission = target;
    },

    async switchTo(missionId: string | null, fadeMs = 1400) {
      if (stopped) {
        // Remember the desired track for whenever audio is unlocked.
        pendingMission = missionId;
        return;
      }
      pendingMission = missionId;
      if (missionId === null) {
        if (current) {
          const c = current;
          current = null;
          disposeVoice(c, fadeMs);
        }
        return;
      }
      if (current?.missionId === missionId) {
        // already playing this track — just ensure volume is up
        if (!muted) rampVolume(current, current.track.volume, fadeMs);
        return;
      }
      const next = await playMission(missionId, fadeMs);
      if (!next) return;
      // If during the await we switched again, dispose the just-created voice.
      if (pendingMission !== missionId) {
        disposeVoice(next, 300);
        return;
      }
      if (current) disposeVoice(current, fadeMs);
      current = next;
    },

    stop() {
      stopped = true;
      if (current) {
        disposeVoice(current, 600);
        current = null;
      }
    },

    setMuted(m: boolean) {
      muted = m;
      if (!current) return;
      rampVolume(current, targetVolume(current.track), 500);
    },

    setPressure(p: number) {
      const next = Math.min(1, Math.max(0, p));
      if (Math.abs(next - pressure) < 0.01) return;
      pressure = next;
      if (current) applyPressure(current);
    },

  };
}
