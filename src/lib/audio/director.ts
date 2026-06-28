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

import { createAmbient, type Ambient, type AudioProfile } from "@/lib/ambient";
import { audioUrl } from "@/lib/audio/assets";

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

class Director {
  private ambient: Ambient | null = null;
  private screen: Screen | null = null;
  private muted = readBool(SOUND_KEY, true) === false; // dn:sound "on"|"off"; default sound on
  private reduced = readBool(REDUCED_KEY, false);
  private ignited = false;
  private listeners = new Set<Listener>();
  private motifGuard = 0; // throttle motif so it stays sparse

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
    writeBool(SOUND_KEY, !next ? false : true); // store "on"/"off" matching legacy
    // dn:sound stores "on" when audio is ON (not muted)
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
   * Cross-fade into the bed for `screen`. Carries audio across transitions
   * — never hard-cut to silence between screens.
   */
  async enter(screen: Screen, opts: EnterOpts = {}) {
    const a = this.engine(); if (!a) return;
    const fade = opts.fadeMs ?? 1400;
    if (opts.profile) a.setAudioProfile(opts.profile);
    this.screen = screen;
    switch (screen) {
      case "landing":   await a.switchTo("__landing__", fade); break;
      case "archive":   await a.switchTo("__archive__", fade); break;
      case "mission":   await a.switchTo(opts.missionId ?? null, fade); break;
      case "analysis":  await a.switchTo("__analysis__", fade); break;
      case "decide":    this.duck(0.28, 500); break;     // keep bed, narrow it
      case "commit":    this.duck(0.18, 400); break;     // air leaves the room
      case "silence":   await a.switchTo(null, fade); break;
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
