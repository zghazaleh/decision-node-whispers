// Procedural cinematic ambient: a slow low drone, two detuned pads, and a
// distant high shimmer through a lowpass with a wandering cutoff. No assets,
// loops forever, very low CPU. Must be started from a user gesture.

type Ambient = {
  start: () => Promise<void>;
  stop: () => void;
  setMuted: (m: boolean) => void;
  isRunning: () => boolean;
};

export function createAmbient(): Ambient {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let stopped = true;
  let muted = false;
  const nodes: { stop?: () => void; disconnect: () => void }[] = [];

  async function start() {
    if (!stopped) return;
    const AC: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    if (ctx.state === "suspended") {
      try { await ctx.resume(); } catch { /* noop */ }
    }
    stopped = false;

    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    // 4s gentle fade-in
    master.gain.linearRampToValueAtTime(muted ? 0 : 0.18, ctx.currentTime + 4);

    // Lowpass with slow wandering cutoff — gives the "breathing" feel.
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 700;
    filter.Q.value = 0.6;
    filter.connect(master);
    nodes.push({ disconnect: () => filter.disconnect() });

    const cutoffLfo = ctx.createOscillator();
    cutoffLfo.frequency.value = 0.05; // 20s cycle
    const cutoffDepth = ctx.createGain();
    cutoffDepth.gain.value = 380;
    cutoffLfo.connect(cutoffDepth);
    cutoffDepth.connect(filter.frequency);
    cutoffLfo.start();
    nodes.push({
      stop: () => { try { cutoffLfo.stop(); } catch { /* noop */ } },
      disconnect: () => { cutoffLfo.disconnect(); cutoffDepth.disconnect(); },
    });

    // Drone + two detuned pad voices in a minor-ish stack: A2, E3, A3, C4.
    const voices = [
      { freq: 110.00, type: "sine" as OscillatorType, gain: 0.35, detune: 0 },
      { freq: 164.81, type: "sine" as OscillatorType, gain: 0.22, detune: -6 },
      { freq: 220.00, type: "triangle" as OscillatorType, gain: 0.16, detune: 4 },
      { freq: 261.63, type: "triangle" as OscillatorType, gain: 0.10, detune: -3 },
    ];
    for (const v of voices) {
      const osc = ctx.createOscillator();
      osc.type = v.type;
      osc.frequency.value = v.freq;
      osc.detune.value = v.detune;

      const g = ctx.createGain();
      g.gain.value = v.gain;

      // Slow amplitude LFO per voice so the bed feels alive.
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.03 + Math.random() * 0.05;
      const lfoDepth = ctx.createGain();
      lfoDepth.gain.value = v.gain * 0.45;
      lfo.connect(lfoDepth);
      lfoDepth.connect(g.gain);

      osc.connect(g);
      g.connect(filter);
      osc.start();
      lfo.start();
      nodes.push({
        stop: () => { try { osc.stop(); lfo.stop(); } catch { /* noop */ } },
        disconnect: () => { osc.disconnect(); g.disconnect(); lfo.disconnect(); lfoDepth.disconnect(); },
      });
    }

    // Distant shimmer: very quiet high triangle drifting in and out.
    const shimmer = ctx.createOscillator();
    shimmer.type = "triangle";
    shimmer.frequency.value = 1318.51; // E6
    const shimmerGain = ctx.createGain();
    shimmerGain.gain.value = 0;
    const shimmerLfo = ctx.createOscillator();
    shimmerLfo.frequency.value = 0.018;
    const shimmerDepth = ctx.createGain();
    shimmerDepth.gain.value = 0.025;
    shimmerLfo.connect(shimmerDepth);
    shimmerDepth.connect(shimmerGain.gain);
    shimmer.connect(shimmerGain);
    shimmerGain.connect(filter);
    shimmer.start();
    shimmerLfo.start();
    nodes.push({
      stop: () => { try { shimmer.stop(); shimmerLfo.stop(); } catch { /* noop */ } },
      disconnect: () => {
        shimmer.disconnect(); shimmerGain.disconnect();
        shimmerLfo.disconnect(); shimmerDepth.disconnect();
      },
    });
  }

  function stop() {
    if (stopped || !ctx || !master) return;
    stopped = true;
    const c = ctx;
    const m = master;
    m.gain.cancelScheduledValues(c.currentTime);
    m.gain.linearRampToValueAtTime(0, c.currentTime + 0.8);
    setTimeout(() => {
      for (const n of nodes) { n.stop?.(); n.disconnect(); }
      nodes.length = 0;
      try { m.disconnect(); } catch { /* noop */ }
      try { c.close(); } catch { /* noop */ }
      ctx = null;
      master = null;
    }, 900);
  }

  function setMuted(m: boolean) {
    muted = m;
    if (ctx && master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(m ? 0 : 0.18, ctx.currentTime + 0.6);
    }
  }

  return { start, stop, setMuted, isRunning: () => !stopped };
}
