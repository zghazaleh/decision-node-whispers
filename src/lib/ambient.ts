import { getSoundtrack, type Soundtrack } from "./soundtracks";

// Seamless ambient player. Each mission's score is decoded once into an
// AudioBuffer and looped via AudioBufferSourceNode (no HTMLAudio loop gap).
// A shared WebAudio graph adds a low-pass filter with gentle LFO, a quiet
// sub-pad that swells with pressure, and a sub-pulse heartbeat for peak stakes.

export type AudioProfile = {
  padFrequency?: number;
  filterBaseHz?: number;
  filterLfoDepthHz?: number;
  lfoRateHz?: number;
};

export type Ambient = {
  start: (missionId?: string) => Promise<void>;
  stop: () => void;
  /**
   * Resolves to `true` once the requested bed is actually playing (or once
   * silence is established for `null`). Resolves to `false` if the asset
   * failed to load / decode — callers can use that to fall back to a
   * safer bed instead of leaving the user in silence.
   */
  switchTo: (missionId: string | null, fadeMs?: number) => Promise<boolean>;
  setMuted: (m: boolean) => void;
  setPressure: (p: number) => void;
  setHeartbeat: (active: boolean) => void;
  setAudioProfile: (profile: AudioProfile) => void;
  setReducedAudio: (reduced: boolean) => void;
  /** `true` when the sample played to completion, `false` on any failure. */
  playOneShot: (url: string, opts?: { gain?: number; fadeInMs?: number; fadeOutMs?: number; bus?: "sfx" | "motif" }) => Promise<boolean>;
  prefetch: (url: string) => Promise<void>;
  duck: (amount?: number, ms?: number) => void;
  release: (ms?: number) => void;
  ignite: () => Promise<void>;
  isRunning: () => boolean;
  currentMission: () => string | null;
};


type Voice = {
  missionId: string;
  track: Soundtrack;
  source: AudioBufferSourceNode;
  filter: BiquadFilterNode;
  gain: GainNode;
  startedAt: number;
};

// Decoded-buffer cache, shared across createAmbient instances and remounts.
const bufferCache = new Map<string, Promise<AudioBuffer>>();
// Network-level cache: warm the HTTP cache and stash the ArrayBuffer before
// the AudioContext exists so the first decode never has to round-trip.
const arrayBufferCache = new Map<string, Promise<ArrayBuffer>>();
// URLs that recently failed to fetch or decode. We back off for ~30s so a
// broken bed/SFX doesn't get re-requested on every transition (which would
// turn a transient CDN hiccup into a stream of 404s). The cooldown lets us
// recover automatically once the asset is reachable again.
const FAILED_URL_TTL_MS = 30_000;
const failedUrls = new Map<string, number>();
const warnedUrls = new Set<string>();
function isFailing(url: string): boolean {
  const t = failedUrls.get(url);
  if (t === undefined) return false;
  if (Date.now() - t > FAILED_URL_TTL_MS) {
    failedUrls.delete(url);
    return false;
  }
  return true;
}
function markFailed(url: string, why: unknown): void {
  failedUrls.set(url, Date.now());
  if (!warnedUrls.has(url)) {
    warnedUrls.add(url);
    // One-line, non-fatal: this is expected behavior for missing/blocked
    // assets, not an application bug.
    console.warn(`[ambient] audio asset unavailable — continuing without it: ${url}`, why);
  }
}

// ---------------------------------------------------------------------------
// Persistent encoded-audio cache (IndexedDB).
//
// AudioBuffers can't be structured-cloned, so we persist the *encoded* bytes
// (mp3) keyed by URL. Our asset URLs embed an immutable asset_id, so cached
// entries never go stale — a URL either resolves to the same bytes forever
// or 404s once the asset is deleted. On repeat visits this skips the network
// round-trip entirely; only the (fast) decodeAudioData step runs.
// ---------------------------------------------------------------------------
const IDB_NAME = "dn-audio-cache";
const IDB_STORE = "buffers";
const IDB_VERSION = 1;
const IDB_MAX_BYTES = 32 * 1024 * 1024; // ~32MB soft cap; LRU-evict oldest
const IDB_DISABLED = typeof indexedDB === "undefined";

let idbPromise: Promise<IDBDatabase | null> | null = null;
function openIdb(): Promise<IDBDatabase | null> {
  if (IDB_DISABLED) return Promise.resolve(null);
  if (idbPromise) return idbPromise;
  idbPromise = new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          const store = db.createObjectStore(IDB_STORE, { keyPath: "url" });
          store.createIndex("touched", "touched");
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onblocked = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
  return idbPromise;
}

async function idbGet(url: string): Promise<ArrayBuffer | null> {
  const db = await openIdb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(url);
      req.onsuccess = () => {
        const row = req.result as { url: string; bytes: ArrayBuffer; touched: number } | undefined;
        if (!row) { resolve(null); return; }
        // Touch for LRU.
        try { store.put({ ...row, touched: Date.now() }); } catch { /* noop */ }
        resolve(row.bytes);
      };
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbPut(url: string, bytes: ArrayBuffer): Promise<void> {
  const db = await openIdb();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      store.put({ url, bytes: bytes.slice(0), size: bytes.byteLength, touched: Date.now() });
      tx.oncomplete = () => { void idbEvictIfOver(); resolve(); };
      tx.onerror = () => resolve();
      tx.onabort = () => resolve();
    } catch {
      resolve();
    }
  });
}

let evicting = false;
async function idbEvictIfOver(): Promise<void> {
  if (evicting) return;
  evicting = true;
  try {
    const db = await openIdb();
    if (!db) return;
    const rows: Array<{ url: string; size: number; touched: number }> = await new Promise((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, "readonly");
        const store = tx.objectStore(IDB_STORE);
        const req = store.getAll();
        req.onsuccess = () => resolve(((req.result ?? []) as Array<{ url: string; size?: number; touched?: number; bytes?: ArrayBuffer }>).map((r) => ({
          url: r.url,
          size: r.size ?? r.bytes?.byteLength ?? 0,
          touched: r.touched ?? 0,
        })));
        req.onerror = () => resolve([]);
      } catch { resolve([]); }
    });
    let total = rows.reduce((s, r) => s + r.size, 0);
    if (total <= IDB_MAX_BYTES) return;
    rows.sort((a, b) => a.touched - b.touched);
    const tx = db.transaction(IDB_STORE, "readwrite");
    const store = tx.objectStore(IDB_STORE);
    for (const r of rows) {
      if (total <= IDB_MAX_BYTES) break;
      store.delete(r.url);
      total -= r.size;
    }
  } finally {
    evicting = false;
  }
}

/**
 * Fire-and-forget HTTP prefetch for a bed/sfx URL. Safe to call without an
 * AudioContext — buffers are kept until decode happens on first play.
 * Always resolves (never rejects); a failed prefetch just marks the URL as
 * cooling-down so later transitions can fall back instead of hitching.
 */
export function prefetchAudio(url: string): Promise<void> {
  if (!url || typeof window === "undefined") return Promise.resolve();
  if (bufferCache.has(url)) return Promise.resolve();
  if (isFailing(url)) return Promise.resolve();
  const cached = arrayBufferCache.get(url);
  if (cached) return cached.then(() => {}, () => {});
  const p = (async () => {
    const persisted = await idbGet(url);
    if (persisted) return persisted;
    const r = await fetch(url);
    if (!r.ok) throw new Error(`prefetch failed: ${r.status}`);
    const bytes = await r.arrayBuffer();
    void idbPut(url, bytes);
    return bytes;
  })();
  arrayBufferCache.set(url, p);
  p.catch((err) => {
    arrayBufferCache.delete(url);
    markFailed(url, err);
  });
  return p.then(() => {}, () => {});
}

async function loadBuffer(ctx: AudioContext, url: string): Promise<AudioBuffer> {
  const cached = bufferCache.get(url);
  if (cached) return cached;
  if (isFailing(url)) {
    // Fail fast — don't network/decode again until the cooldown elapses.
    throw new Error(`ambient asset cooling down: ${url}`);
  }
  const p = (async () => {
    const pre = arrayBufferCache.get(url);
    let data: ArrayBuffer;
    if (pre) {
      data = (await pre).slice(0);
    } else {
      const persisted = await idbGet(url);
      if (persisted) {
        data = persisted.slice(0);
      } else {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`ambient fetch failed: ${res.status}`);
        const bytes = await res.arrayBuffer();
        void idbPut(url, bytes);
        data = bytes;
      }
    }
    return await ctx.decodeAudioData(data);
  })();
  bufferCache.set(url, p);
  p.then(
    () => { failedUrls.delete(url); warnedUrls.delete(url); },
    (err) => { bufferCache.delete(url); markFailed(url, err); },
  );
  return p;
}





export function createAmbient(initialMissionId: string | null = null): Ambient {
  let current: Voice | null = null;
  let muted = false;
  let stopped = true;
  let pendingMission: string | null = initialMissionId;
  let pressure = 0;

  const profile: Required<AudioProfile> = {
    padFrequency: 55,
    filterBaseHz: 1600,
    filterLfoDepthHz: 280, // gentle — too much depth reads as "pumping" / choppy
    lfoRateHz: 0.05,
  };

  let ctx: AudioContext | null = null;
  let masterGain: GainNode | null = null;

  // Buses — bed (mission/screen ambient + pad + heartbeat) can be ducked
  // independently of stings (sfx) and the gold-thread motif.
  let bedBus: GainNode | null = null;
  let sfxBus: GainNode | null = null;
  let motifBus: GainNode | null = null;
  let duckTimer: number | null = null;

  // Heartbeat
  let hbGain: GainNode | null = null;
  let hbTimer: number | null = null;
  let hbActive = false;

  // Shared LFO routed into every voice's filter.frequency
  let lfo: OscillatorNode | null = null;
  let lfoDepth: GainNode | null = null;

  // Sub pad — single oscillator (was two detuned; the beating read as choppy)
  let padOsc: OscillatorNode | null = null;
  let padGain: GainNode | null = null;

  let reduced = false;

  function ensureCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!ctx) {
      try {
        const AC: typeof AudioContext =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctx = new AC();
        masterGain = ctx.createGain();
        masterGain.gain.value = 1;
        masterGain.connect(ctx.destination);

        bedBus = ctx.createGain(); bedBus.gain.value = 1; bedBus.connect(masterGain);
        sfxBus = ctx.createGain(); sfxBus.gain.value = 1; sfxBus.connect(masterGain);
        motifBus = ctx.createGain(); motifBus.gain.value = 1; motifBus.connect(masterGain);

        hbGain = ctx.createGain();
        hbGain.gain.value = 0;
        hbGain.connect(bedBus);

        padGain = ctx.createGain();
        padGain.gain.value = 0;
        padGain.connect(bedBus);
        padOsc = ctx.createOscillator();
        padOsc.type = "sine";
        padOsc.frequency.value = profile.padFrequency;
        padOsc.connect(padGain);
        padOsc.start();

        lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = profile.lfoRateHz;
        lfoDepth = ctx.createGain();
        lfoDepth.gain.value = profile.filterLfoDepthHz;
        lfo.connect(lfoDepth);
        lfo.start();
      } catch {
        return null;
      }
    }
    return ctx;
  }

  function targetMusicGain(track: Soundtrack): number {
    if (muted) return 0;
    const lift = 1 + pressure * 0.45;
    return Math.min(1, track.volume * lift);
  }

  function padTarget(): number {
    if (muted) return 0;
    return Math.min(0.06, 0.012 + pressure * 0.05);
  }

  function rampParam(p: AudioParam, target: number, ms: number) {
    if (!ctx) return;
    const now = ctx.currentTime;
    p.cancelScheduledValues(now);
    p.setValueAtTime(p.value, now);
    p.linearRampToValueAtTime(target, now + ms / 1000);
  }

  function applyPadGain(ms = 1500) {
    if (!padGain) return;
    rampParam(padGain.gain, padTarget(), ms);
  }

  function thump(at: number, freq: number, vel: number) {
    if (!ctx || !hbGain) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(freq * 1.6, at);
    o.frequency.exponentialRampToValueAtTime(freq, at + 0.08);
    g.gain.setValueAtTime(0, at);
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
    const target = muted ? 0 : Math.min(0.2, 0.05 + pressure * 0.18);
    rampParam(hbGain.gain, target, 400);
    thump(now + 0.02, 52, 0.85);
    thump(now + 0.14, 44, 0.5);
    hbTimer = window.setTimeout(scheduleHeartbeat, interval * 1000);
  }
  function stopHeartbeat(ms = 600) {
    if (hbTimer) { clearTimeout(hbTimer); hbTimer = null; }
    if (hbGain) rampParam(hbGain.gain, 0, ms);
  }

  async function playMission(missionId: string, fadeInMs: number): Promise<Voice | null> {
    const track = getSoundtrack(missionId);
    if (!track) return null;
    const c = ensureCtx();
    if (!c || !masterGain || !lfoDepth) return null;
    if (c.state === "suspended") {
      try { await c.resume(); } catch { /* noop */ }
    }
    let buffer: AudioBuffer;
    try {
      buffer = await loadBuffer(c, track.url);
    } catch {
      return null;
    }
    const source = c.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    // Loop the entire decoded buffer (avoids the HTMLAudio seam pop).
    const filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = profile.filterBaseHz;
    filter.Q.value = 0.6;
    lfoDepth.connect(filter.frequency);
    const gain = c.createGain();
    gain.gain.value = 0;
    source.connect(filter).connect(gain).connect(bedBus ?? masterGain);
    source.start();
    const v: Voice = { missionId, track, source, filter, gain, startedAt: c.currentTime };
    rampParam(gain.gain, targetMusicGain(track), fadeInMs);
    applyPadGain(fadeInMs);
    return v;
  }

  function disposeVoice(v: Voice, ms: number) {
    if (!ctx) return;
    rampParam(v.gain.gain, 0, ms);
    const stopAt = ctx.currentTime + ms / 1000 + 0.05;
    try { v.source.stop(stopAt); } catch { /* already stopped */ }
    window.setTimeout(() => {
      try { v.source.disconnect(); } catch { /* noop */ }
      try { v.filter.disconnect(); } catch { /* noop */ }
      try { v.gain.disconnect(); } catch { /* noop */ }
    }, ms + 200);
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
        // Engine isn't running — treat as a deferred success so callers
        // don't trigger a fallback chain.
        return true;
      }
      pendingMission = missionId;
      if (missionId === null) {
        if (current) {
          const c = current;
          current = null;
          disposeVoice(c, fadeMs);
        }
        if (padGain) rampParam(padGain.gain, 0, fadeMs);
        return true;
      }
      if (current?.missionId === missionId) {
        if (!muted) rampParam(current.gain.gain, targetMusicGain(current.track), fadeMs);
        return true;
      }
      const next = await playMission(missionId, fadeMs);
      if (!next) {
        // Asset failed to load/decode. Leave the previous bed in place so
        // the transition never collapses into silence — the caller can
        // decide whether to fall back to a safer bed.
        return false;
      }
      if (pendingMission !== missionId) {
        disposeVoice(next, 300);
        // A newer switch raced ahead — not a failure for our caller.
        return true;
      }
      if (current) disposeVoice(current, fadeMs);
      current = next;
      return true;
    },


    stop() {
      stopped = true;
      stopHeartbeat(400);
      hbActive = false;
      if (padGain) rampParam(padGain.gain, 0, 600);
      if (current) {
        disposeVoice(current, 600);
        current = null;
      }
    },

    setMuted(m: boolean) {
      muted = m;
      if (masterGain) rampParam(masterGain.gain, m ? 0 : 1, 350);
      if (current) rampParam(current.gain.gain, targetMusicGain(current.track), 500);
      applyPadGain(500);
      if (hbGain && ctx) {
        rampParam(hbGain.gain, m ? 0 : Math.min(0.2, 0.05 + pressure * 0.18), 400);
      }
    },

    setPressure(p: number) {
      const next = Math.min(1, Math.max(0, p));
      if (Math.abs(next - pressure) < 0.01) return;
      pressure = next;
      if (current) rampParam(current.gain.gain, targetMusicGain(current.track), 4000);
      applyPadGain(4000);
    },

    setHeartbeat(active: boolean) {
      if (reduced) active = false;
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

    setAudioProfile(next: AudioProfile) {
      if (next.padFrequency !== undefined) profile.padFrequency = next.padFrequency;
      if (next.filterBaseHz !== undefined) profile.filterBaseHz = next.filterBaseHz;
      if (next.filterLfoDepthHz !== undefined) profile.filterLfoDepthHz = next.filterLfoDepthHz;
      if (next.lfoRateHz !== undefined) profile.lfoRateHz = next.lfoRateHz;
      if (!ctx) return;
      const ramp = 2.0;
      if (padOsc) rampParam(padOsc.frequency, profile.padFrequency, ramp * 1000);
      if (lfo) rampParam(lfo.frequency, profile.lfoRateHz, ramp * 1000);
      if (lfoDepth) rampParam(lfoDepth.gain, profile.filterLfoDepthHz, ramp * 1000);
      if (current) rampParam(current.filter.frequency, profile.filterBaseHz, ramp * 1000);
    },

    setReducedAudio(next: boolean) {
      if (next === reduced) return;
      reduced = next;
      if (next) {
        // Stop heartbeat, kill pad and motif bus, dim sfx — keep a faint drone.
        hbActive = false;
        stopHeartbeat(600);
        if (padGain) rampParam(padGain.gain, 0, 800);
        if (motifBus) rampParam(motifBus.gain, 0, 600);
        if (sfxBus) rampParam(sfxBus.gain, 0.25, 600);
      } else {
        applyPadGain(800);
        if (motifBus) rampParam(motifBus.gain, 1, 600);
        if (sfxBus) rampParam(sfxBus.gain, 1, 600);
      }
    },

    duck(amount = 0.35, ms = 600) {
      const c = ensureCtx(); if (!c || !bedBus) return;
      rampParam(bedBus.gain, Math.max(0, Math.min(1, amount)), ms);
      if (duckTimer) { clearTimeout(duckTimer); duckTimer = null; }
    },

    release(ms = 1200) {
      const c = ensureCtx(); if (!c || !bedBus) return;
      rampParam(bedBus.gain, 1, ms);
    },

    async prefetch(url) {
      if (!url) return;
      // Always warm the HTTP cache first — works before any user gesture.
      await prefetchAudio(url);
      // If a context already exists, decode now so first play is instant.
      const c = ctx;
      if (c) { try { await loadBuffer(c, url); } catch { /* noop */ } }
    },


    async ignite() {
      const c = ensureCtx(); if (!c) return;
      if (c.state === "suspended") { try { await c.resume(); } catch { /* noop */ } }
      // Mark the engine as running so subsequent `switchTo` calls actually
      // start a bed instead of deferring forever (pendingMission only).
      stopped = false;
      // If a bed was requested before ignition, honor it now.
      if (pendingMission && !current) {
        const next = await playMission(pendingMission, 2200);
        if (next) current = next;
      }
    },

    async playOneShot(url, opts) {
      const c = ensureCtx(); if (!c) return false;
      if (muted) return false;
      if (c.state === "suspended") { try { await c.resume(); } catch { /* noop */ } }
      const bus = opts?.bus ?? "sfx";
      const target = bus === "motif" ? motifBus : sfxBus;
      if (!target) return false;
      if (reduced && bus !== "motif" && opts?.bus !== "motif") {
        // In reduced mode, sfx are heavily attenuated via the bus; motif is muted.
      }
      let buffer: AudioBuffer;
      // Asset failures here are silent by design — a missing sting must
      // never interrupt the surrounding transition or moment.
      try { buffer = await loadBuffer(c, url); } catch { return false; }
      try {
        const src = c.createBufferSource();
        src.buffer = buffer;
        const g = c.createGain();
        const peak = opts?.gain ?? (bus === "motif" ? 0.55 : 0.5);
        const fadeIn = (opts?.fadeInMs ?? 30) / 1000;
        const fadeOut = (opts?.fadeOutMs ?? 400) / 1000;
        const now = c.currentTime;
        const dur = buffer.duration;
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(peak, now + Math.min(fadeIn, dur / 2));
        g.gain.setValueAtTime(peak, now + Math.max(0, dur - fadeOut));
        g.gain.linearRampToValueAtTime(0.0001, now + dur);
        src.connect(g).connect(target);
        src.start();
        src.stop(now + dur + 0.1);
        window.setTimeout(() => {
          try { src.disconnect(); } catch { /* noop */ }
          try { g.disconnect(); } catch { /* noop */ }
        }, (dur + 0.3) * 1000);
        return true;
      } catch {
        return false;
      }
    },

  };
}
