import { getSoundtrack } from "./soundtracks";

// HTMLAudio-based ambient player: loops a mission-specific score and
// crossfades in/out. Falls back gracefully if the asset can't load.

export type Ambient = {
  start: () => Promise<void>;
  stop: () => void;
  setMuted: (m: boolean) => void;
  isRunning: () => boolean;
};

export function createAmbient(missionId = "mission-01"): Ambient {
  const track = getSoundtrack(missionId);
  let audio: HTMLAudioElement | null = null;
  let muted = false;
  let stopped = true;
  let fadeRaf: number | null = null;

  function rampTo(target: number, ms: number) {
    if (!audio) return;
    if (fadeRaf) cancelAnimationFrame(fadeRaf);
    const start = performance.now();
    const from = audio.volume;
    const step = (now: number) => {
      if (!audio) return;
      const t = Math.min(1, (now - start) / ms);
      audio.volume = from + (target - from) * t;
      if (t < 1) fadeRaf = requestAnimationFrame(step);
    };
    fadeRaf = requestAnimationFrame(step);
  }

  return {
    isRunning: () => !stopped,
    async start() {
      if (!stopped || !track) return;
      stopped = false;
      audio = new Audio(track.url);
      audio.loop = true;
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      audio.volume = 0;
      try {
        await audio.play();
      } catch (e) {
        // autoplay blocked — caller must start from a user gesture
        stopped = true;
        audio = null;
        throw e;
      }
      rampTo(muted ? 0 : track.volume, 4000);
    },
    stop() {
      if (stopped || !audio) return;
      stopped = true;
      const a = audio;
      rampTo(0, 800);
      setTimeout(() => {
        try { a.pause(); a.src = ""; a.load(); } catch { /* noop */ }
      }, 900);
      audio = null;
    },
    setMuted(m: boolean) {
      muted = m;
      if (!audio || !track) return;
      rampTo(m ? 0 : track.volume, 600);
    },
  };
}
