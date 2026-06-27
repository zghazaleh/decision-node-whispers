import { getSoundtrack, type Soundtrack } from "./soundtracks";

// HTMLAudio-based ambient player with smooth crossfades between mission
// scores. Falls back gracefully if no track exists for a mission.

export type AudioProfile = {
  padFrequency?: number;
  padDetune?: number;
  filterBaseHz?: number;
  filterLfoDepthHz?: number;
  lfoRateHz?: number;
};

export type Ambient = {
  start: (missionId?: string) => Promise<void>;
  stop: () => void;
  switchTo: (missionId: string | null, fadeMs?: number) => Promise<void>;
  setMuted: (m: boolean) => void;
  /** 0..1 — drives subtle volume swell + slight detune as mission stakes rise. */
  setPressure: (p: number) => void;
  /** Toggle a low synthesized sub-pulse heartbeat as stakes peak. */
  setHeartbeat: (active: boolean) => void;
  /** Per-mission tuning of the WebAudio bed (pad freq, filter cutoff, LFO rate). */
  setAudioProfile: (profile: AudioProfile) => void;
  isRunning: () => boolean;
  currentMission: () => string | null;
};



type Voice = {
  audio: HTMLAudioElement;
  track: Soundtrack;
  missionId: string;
  fadeRaf: number | null;
  // WebAudio chain (optional — only present if the AudioContext was unlocked).
  source?: MediaElementAudioSourceNode;
  filter?: BiquadFilterNode;
  gain?: GainNode;
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

  // Live audio profile — defaults match the original mission-03 bed; can be
  // overridden per-mission via setAudioProfile().
  const profile: Required<AudioProfile> = {
    padFrequency: 55,
    padDetune: 1.005,
    filterBaseHz: 1600,
    filterLfoDepthHz: 800,
    lfoRateHz: 0.05,
  };


  // Shared WebAudio graph ─ used by heartbeat synth, the LFO-modulated low-pass
  // filter on the music voice, and the sub-pad that swells with pressure.
  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;
  let hbGain: GainNode | null = null;
  let hbTimer: number | null = null;
  let hbActive = false;

  // LFO that drifts the music voice's filter cutoff — gives the bed a slow
  // "breathing" quality without colouring the dialogue.
  let lfo: OscillatorNode | null = null;
  let lfoDepth: GainNode | null = null;

  // Sub pad: two slightly detuned sines at ~55Hz. Always quiet, swells with
  // pressure. Separate from the heartbeat (which is rhythmic).
  let padOscA: OscillatorNode | null = null;
  let padOscB: OscillatorNode | null = null;
  let padGain: GainNode | null = null;

  function ensureCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!ctx) {
      try {
        const AC: typeof AudioContext =
          window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctx = new AC();
        masterGain = ctx.createGain();
        masterGain.gain.value = 1;
        masterGain.connect(ctx.destination);

        hbGain = ctx.createGain();
        hbGain.gain.value = 0.0;
        hbGain.connect(masterGain);

        // Sub pad runs the entire time a mission is playing.
        padGain = ctx.createGain();
        padGain.gain.value = 0;
        padGain.connect(masterGain);
        padOscA = ctx.createOscillator();
        padOscB = ctx.createOscillator();
        padOscA.type = "sine";
        padOscB.type = "sine";
        padOscA.frequency.value = profile.padFrequency;
        padOscB.frequency.value = profile.padFrequency * profile.padDetune;
        padOscA.connect(padGain);
        padOscB.connect(padGain);
        padOscA.start();
        padOscB.start();

        // Shared LFO for filter cutoff modulation.
        lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = profile.lfoRateHz;
        lfoDepth = ctx.createGain();
        lfoDepth.gain.value = profile.filterLfoDepthHz;
        lfo.connect(lfoDepth);
        lfo.start();

      } catch { return null; }
    }
    return ctx;
  }

  function wireVoiceToGraph(v: Voice) {
    if (!ctx || !masterGain || !lfoDepth) return;
    try {
      const src = ctx.createMediaElementSource(v.audio);
      const filt = ctx.createBiquadFilter();
      filt.type = "lowpass";
      filt.frequency.value = 1600;
      filt.Q.value = 0.7;
      lfoDepth.connect(filt.frequency); // LFO modulates cutoff
      const g = ctx.createGain();
      g.gain.value = 1;
      src.connect(filt).connect(g).connect(masterGain);
      v.source = src;
      v.filter = filt;
      v.gain = g;
    } catch { /* already wired or context unavailable */ }
  }

  function padTarget(): number {
    if (muted) return 0;
    // Quiet floor + pressure swell. Caps well below the music bed.
    return Math.min(0.09, 0.02 + pressure * 0.07);
  }
  function applyPadGain(fadeMs = 1200) {
    if (!ctx || !padGain) return;
    const now = ctx.currentTime;
    padGain.gain.cancelScheduledValues(now);
    padGain.gain.linearRampToValueAtTime(padTarget(), now + fadeMs / 1000);
  }

  function thump(at: number, freq: number, vel: number) {
    if (!ctx || !hbGain) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(freq * 1.6, at);
    o.frequency.exponentialRampToValueAtTime(freq, at + 0.08);
    g.gain.setValueAtTime(0.0, at);
    g.gain.linearRampToValueAtTime(vel, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.28);
    o.connect(g).connect(hbGain);
    o.start(at);
    o.stop(at + 0.32);
  }
  function scheduleHeartbeat() {
    if (!hbActive || !ctx || !hbGain) return;
    const now = ctx.currentTime;
    const bpm = 60 + pressure * 32;
    const interval = 60 / bpm;
    const target = muted ? 0 : Math.min(0.22, 0.05 + pressure * 0.20);
    hbGain.gain.cancelScheduledValues(now);
    hbGain.gain.linearRampToValueAtTime(target, now + 0.4);
    thump(now + 0.02, 52, 0.9);
    thump(now + 0.14, 44, 0.55);
    hbTimer = window.setTimeout(scheduleHeartbeat, interval * 1000);
  }
  function stopHeartbeat(fadeMs = 600) {
    if (hbTimer) { clearTimeout(hbTimer); hbTimer = null; }
    if (ctx && hbGain) {
      const now = ctx.currentTime;
      hbGain.gain.cancelScheduledValues(now);
      hbGain.gain.linearRampToValueAtTime(0, now + fadeMs / 1000);
    }
  }


  function targetVolume(track: Soundtrack): number {
    if (muted) return 0;
    const lift = 1 + pressure * 0.55;
    return Math.min(1, track.volume * lift);
  }

  function applyPressure(v: Voice, fadeMs = 4000) {
    rampVolume(v, targetVolume(v.track), fadeMs);
    try {
      v.audio.playbackRate = 1 - pressure * 0.04;
    } catch { /* noop */ }
    applyPadGain(fadeMs);
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
    // Try to wire WebAudio FX. If the context can't be created yet (no user
    // gesture), this is a no-op and the audio still plays through the element.
    const c = ensureCtx();
    if (c) {
      if (c.state === "suspended") c.resume().catch(() => {});
      wireVoiceToGraph(v);
      applyPadGain(fadeInMs);
    }
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
      try { v.source?.disconnect(); } catch { /* noop */ }
      try { v.filter?.disconnect(); } catch { /* noop */ }
      try { v.gain?.disconnect(); } catch { /* noop */ }
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
        if (ctx && padGain) {
          const now = ctx.currentTime;
          padGain.gain.cancelScheduledValues(now);
          padGain.gain.linearRampToValueAtTime(0, now + fadeMs / 1000);
        }
        return;
      }
      if (current?.missionId === missionId) {
        if (!muted) rampVolume(current, current.track.volume, fadeMs);
        return;
      }
      const next = await playMission(missionId, fadeMs);
      if (!next) return;
      if (pendingMission !== missionId) {
        disposeVoice(next, 300);
        return;
      }
      if (current) disposeVoice(current, fadeMs);
      current = next;
    },

    stop() {
      stopped = true;
      stopHeartbeat(400);
      hbActive = false;
      if (ctx && padGain) {
        const now = ctx.currentTime;
        padGain.gain.cancelScheduledValues(now);
        padGain.gain.linearRampToValueAtTime(0, now + 0.6);
      }
      if (current) {
        disposeVoice(current, 600);
        current = null;
      }
    },

    setMuted(m: boolean) {
      muted = m;
      if (current) rampVolume(current, targetVolume(current.track), 500);
      applyPadGain(500);
      if (hbGain && ctx) {
        const now = ctx.currentTime;
        hbGain.gain.cancelScheduledValues(now);
        hbGain.gain.linearRampToValueAtTime(m ? 0 : Math.min(0.22, 0.05 + pressure * 0.20), now + 0.4);
      }
    },

    setPressure(p: number) {
      const next = Math.min(1, Math.max(0, p));
      if (Math.abs(next - pressure) < 0.01) return;
      pressure = next;
      if (current) applyPressure(current);
      else applyPadGain();
    },

    setHeartbeat(active: boolean) {
      if (active === hbActive) return;
      hbActive = active;
      if (active) {
        const c = ensureCtx();
        if (!c) return;
        if (c.state === "suspended") c.resume().catch(() => {});
        scheduleHeartbeat();
      } else {
        stopHeartbeat();
      }
    },

  };
}
