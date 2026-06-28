// AudioDirector — one sonic identity across every screen.
//
// Wraps a single shared `createAmbient` instance and adds the screen API
// (enter/duck/release/playMotif/playSfx) plus persisted user controls
// (mute, reduced-audio mode). Diegetic-leaning: no hard silence between
// screens, the bed cross-fades and motif/sfx ride on dedicated buses so a
// duck on the bed never starves a sting.
//
// Asset URLs come from `@/lib/audio/assets` (glob-resolved) so missing
// pointers degrade silently instead of breaking the build.

import { createAmbient, prefetchAudio, type Ambient, type AudioProfile } from "@/lib/ambient";
import { audioUrl } from "@/lib/audio/assets";
import { getSoundtrack } from "@/lib/soundtracks";


export type Screen =
  | "landing"
  | "archive"
  | "mission"
  | "decide"
  | "commit"
  | "analysis"
  | "silence";

type EnterOpts = {
  missionId?: string;
  profile?: AudioProfile;
  fadeMs?: number;
};

const SOUND_KEY = "dn:sound";
const REDUCED_KEY = "dn:audio-reduced";

function readBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key);
    if (v === null) return fallback;
    return v === "on" || v === "true" || v === "1";
  } catch {
    return fallback;
  }
}

function writeBool(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(key, value ? "on" : "off"); } catch { /* noop */ }
}

type Listener = () => void;

export type AudioAttempt = {
  id: number;
  at: number;
  kind: "switchTo" | "playOneShot";
  /** For switchTo: screen + missionId. For playOneShot: sfx/motif name. */
  label: string;
  /** The resolved URL when known (one-shots, beds with a soundtrack). */
  url?: string;
  /** undefined while pending, true on success, false on failure. */
  ok?: boolean;
  /** Wall-clock duration in ms once the promise settles. */
  durationMs?: number;
};

const MAX_ATTEMPTS = 80;
let attemptSeq = 0;

class Director {
  private ambient: Ambient | null = null;
  private screen: Screen | null = null;
  private muted = readBool(SOUND_KEY, true) === false; // dn:sound "on"|"off"; default sound on
  private reduced = readBool(REDUCED_KEY, false);
  private ignited = false;
  private listeners = new Set<Listener>();
  private motifGuard = 0; // throttle motif so it stays sparse
  private attempts: AudioAttempt[] = [];

  /** Ring buffer of recent switchTo / playOneShot attempts, newest first. */
  recentAttempts(): AudioAttempt[] { return this.attempts.slice(); }

  private recordAttempt(partial: Omit<AudioAttempt, "id" | "at">): AudioAttempt {
    const entry: AudioAttempt = { id: ++attemptSeq, at: Date.now(), ...partial };
    this.attempts.unshift(entry);
    if (this.attempts.length > MAX_ATTEMPTS) this.attempts.length = MAX_ATTEMPTS;
    this.emit();
    return entry;
  }

  private settleAttempt(entry: AudioAttempt, ok: boolean) {
    entry.ok = ok;
    entry.durationMs = Date.now() - entry.at;
    this.emit();
  }


  private engine(): Ambient | null {
    if (typeof window === "undefined") return null;
    if (!this.ambient) {
      this.ambient = createAmbient(null);
      // Default sound state per stored preference.
      this.ambient.setMuted(this.muted);
      this.ambient.setReducedAudio(this.reduced);
    }
    return this.ambient;
  }

  /** Resume the AudioContext on the first user gesture (Begin button). */
  async ignite() {
    const a = this.engine(); if (!a) return;
    await a.ignite();
    this.ignited = true;
    this.emit();
  }

  isIgnited() { return this.ignited; }
  isMuted() { return this.muted; }
  isReduced() { return this.reduced; }
  currentScreen() { return this.screen; }

  setMuted(next: boolean) {
    this.muted = next;
    // dn:sound stores "on" when audio is ON (legacy contract preserved).
    writeBool(SOUND_KEY, !next);
    this.engine()?.setMuted(next);
    this.emit();
  }

  setReducedAudio(next: boolean) {
    this.reduced = next;
    writeBool(REDUCED_KEY, next);
    this.engine()?.setReducedAudio(next);
    this.emit();
  }

  setPressure(p: number) { this.engine()?.setPressure(p); }
  setHeartbeat(active: boolean) { this.engine()?.setHeartbeat(active && !this.reduced); }
  setAudioProfile(p: AudioProfile) { this.engine()?.setAudioProfile(p); }

  duck(amount = 0.32, ms = 600) { this.engine()?.duck(amount, ms); }
  release(ms = 1200) { this.engine()?.release(ms); }

  async playSfx(name: "awakening" | "commit" | "analyzing" | "hover-tick" | "select-chip", opts?: { gain?: number }) {
    const url = audioUrl(name); if (!url) return;
    await this.engine()?.playOneShot(url, { gain: opts?.gain, bus: "sfx", fadeInMs: 40, fadeOutMs: 500 });
  }

  /** Play the gold-thread motif. Throttled so it stays a hinge moment. */
  async playMotif(_variant: "landing" | "awakening" | "commit" | "analysis" = "analysis") {
    const now = Date.now();
    if (now - this.motifGuard < 6_000) return; // never two in quick succession
    this.motifGuard = now;
    const url = audioUrl("node-motif"); if (!url) return;
    await this.engine()?.playOneShot(url, { gain: 0.6, bus: "motif", fadeInMs: 80, fadeOutMs: 1200 });
  }

  /**
   * Warm the HTTP cache (and decode, if a context already exists) for one or
   * more upcoming screens/missions, so the next `enter()` cross-fade starts
   * from a ready buffer instead of hitching on the first network round-trip.
   *
   * Safe to call before ignition — falls back to a plain `fetch()`.
   */
  prefetch(targets: { screen?: Screen; missionId?: string; sfx?: ("awakening" | "commit" | "analyzing" | "hover-tick" | "select-chip" | "node-motif")[] }) {
    const urls = new Set<string>();
    if (targets.screen) {
      const screenKey =
        targets.screen === "landing" ? "__landing__" :
        targets.screen === "archive" ? "__archive__" :
        targets.screen === "analysis" ? "__analysis__" :
        targets.screen === "mission" ? targets.missionId ?? null :
        null;
      if (screenKey) {
        const st = getSoundtrack(screenKey);
        if (st?.url) urls.add(st.url);
      }
    } else if (targets.missionId) {
      const st = getSoundtrack(targets.missionId);
      if (st?.url) urls.add(st.url);
    }
    for (const name of targets.sfx ?? []) {
      const u = audioUrl(name);
      if (u) urls.add(u);
    }
    const a = this.ambient; // do NOT force ctx creation; HTTP prefetch is enough
    for (const url of urls) {
      if (a) void a.prefetch(url);
      else void prefetchAudio(url);
    }
  }


  /**
   * Cross-fade into the bed for `screen`. Carries audio across transitions
   * — never hard-cut to silence between screens. If the requested bed
   * fails to load (404, network blip, decode error), we leave the
   * previous bed in place and, for mission detail, fall back to the
   * Archive bed so the player still feels held by sound.
   */
  async enter(screen: Screen, opts: EnterOpts = {}) {
    const a = this.engine(); if (!a) return;
    const fade = opts.fadeMs ?? 1400;
    if (opts.profile) a.setAudioProfile(opts.profile);
    this.screen = screen;
    let ok = true;
    switch (screen) {
      case "landing":   ok = await a.switchTo("__landing__", fade); break;
      case "archive":   ok = await a.switchTo("__archive__", fade); break;
      case "mission":   ok = await a.switchTo(opts.missionId ?? null, fade); break;
      case "analysis":  ok = await a.switchTo("__analysis__", fade); break;
      case "decide":    this.duck(0.28, 500); break;     // keep bed, narrow it
      case "commit":    this.duck(0.18, 400); break;     // air leaves the room
      case "silence":   ok = await a.switchTo(null, fade); break;
    }
    if (!ok) {
      // The requested bed couldn't be established. Don't strand the
      // player in silence — fall back to a known-good bed where one
      // exists. The previous bed is still playing at this point, so
      // these fallbacks are pure additive safety nets.
      if (screen === "mission") {
        // Mission bed is the most likely to be missing for a given case.
        // Drop into the Archive bed so the room still has air.
        await a.switchTo("__archive__", Math.max(800, fade));
      } else if (screen === "analysis") {
        // If even the analysis bed is gone, the Archive bed is a
        // reasonable reflective fallback.
        await a.switchTo("__archive__", Math.max(800, fade));
      }
      // landing / archive failures: leave whatever is currently playing.
      // We do NOT switch to silence on failure — that would be worse
      // than the previous bed continuing for a beat.
    }
    this.emit();
  }


  /** UI subscription for mute/reduced toggle components. */
  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => { this.listeners.delete(fn); };
  }
  private emit() { for (const l of this.listeners) l(); }
}

export const audio = new Director();
