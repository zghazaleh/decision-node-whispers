/**
 * Contract tests for the ambient audio engine.
 *
 * The audio engine is best-effort by design: a missing or 404'd bed/sfx
 * must never throw, never reject, never strand a transition. These tests
 * lock that contract by exercising both happy and failure paths through
 * `createAmbient().switchTo()` and `createAmbient().playOneShot()` with
 * mocked WebAudio + fetch globals.
 *
 * Failure modes covered:
 *   - Soundtrack not registered → switchTo returns false (caller may fall back).
 *   - fetch returns !ok (404) → switchTo / playOneShot return false.
 *   - decodeAudioData throws (malformed bytes) → return false.
 *
 * Success modes covered:
 *   - Valid bed → switchTo resolves true.
 *   - switchTo(null) → resolves true (silence is a valid target).
 *   - Valid sfx → playOneShot resolves true.
 *
 * In every case the returned value is asserted to be a strict boolean.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// Mock the soundtrack registry so we can drive both bed kinds deterministically
// without depending on actual asset files.
// ---------------------------------------------------------------------------
vi.mock("../soundtracks", () => {
  return {
    getSoundtrack: (id: string) => {
      if (id === "good") return { url: "https://test.local/good.mp3", mood: "m", volume: 0.3 };
      if (id === "bad") return { url: "https://test.local/bad.mp3", mood: "m", volume: 0.3 };
      if (id === "corrupt") return { url: "https://test.local/corrupt.mp3", mood: "m", volume: 0.3 };
      return null;
    },
  };
});

// ---------------------------------------------------------------------------
// Minimal WebAudio fake. All node methods are no-ops, but they must exist —
// `createAmbient` wires up oscillators, gains, filters, and buffer sources
// at ignition.
// ---------------------------------------------------------------------------
function fakeParam() {
  return {
    value: 0,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    cancelScheduledValues: vi.fn(),
  };
}
function fakeNode(): any {
  const node: any = {
    gain: fakeParam(),
    frequency: fakeParam(),
    Q: fakeParam(),
    type: "",
    buffer: null,
    loop: false,
    connect: () => node,
    disconnect: () => {},
    start: () => {},
    stop: () => {},
  };
  return node;
}
class FakeAudioContext {
  currentTime = 0;
  state: "running" | "suspended" = "running";
  destination = fakeNode();
  async resume() { this.state = "running"; }
  createGain() { return fakeNode(); }
  createOscillator() { return fakeNode(); }
  createBiquadFilter() { return fakeNode(); }
  createBufferSource() { return fakeNode(); }
  async decodeAudioData(_buf: ArrayBuffer) {
    if (decodeShouldThrow) throw new Error("bad codec");
    return { duration: 1.5 } as AudioBuffer;
  }
}
let decodeShouldThrow = false;

beforeEach(() => {
  decodeShouldThrow = false;
  vi.stubGlobal("window", globalThis);
  vi.stubGlobal("AudioContext", FakeAudioContext as unknown as typeof AudioContext);
  vi.stubGlobal("fetch", vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();
    if (url.includes("/bad.mp3")) {
      return new Response("nope", { status: 404 });
    }
    if (url.includes("/corrupt.mp3")) {
      // Bytes succeed but decodeAudioData below will throw.
      decodeShouldThrow = true;
      return new Response(new ArrayBuffer(8), { status: 200 });
    }
    return new Response(new ArrayBuffer(8), { status: 200 });
  }));
  // Silence the engine's one-time failure warnings — they are expected here.
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.resetModules();
});

async function loadAmbient() {
  // Re-import fresh each test so module-level caches (failedUrls, bufferCache)
  // don't leak between specs.
  vi.resetModules();
  const mod = await import("../ambient");
  return mod;
}

describe("createAmbient().switchTo", () => {
  it("resolves to true for a valid bed", async () => {
    const { createAmbient } = await loadAmbient();
    const a = createAmbient(null);
    await a.ignite();
    const result = await a.switchTo("good", 10);
    expect(typeof result).toBe("boolean");
    expect(result).toBe(true);
  });

  it("resolves to true for the silence target (null)", async () => {
    const { createAmbient } = await loadAmbient();
    const a = createAmbient(null);
    await a.ignite();
    const result = await a.switchTo(null, 10);
    expect(typeof result).toBe("boolean");
    expect(result).toBe(true);
  });

  it("resolves to false (never throws) when the soundtrack is unregistered", async () => {
    const { createAmbient } = await loadAmbient();
    const a = createAmbient(null);
    await a.ignite();
    let result: boolean | undefined;
    await expect(
      (async () => { result = await a.switchTo("does-not-exist", 10); })(),
    ).resolves.toBeUndefined();
    expect(typeof result).toBe("boolean");
    expect(result).toBe(false);
  });

  it("resolves to false (never throws) on a 404 fetch", async () => {
    const { createAmbient } = await loadAmbient();
    const a = createAmbient(null);
    await a.ignite();
    let result: boolean | undefined;
    await expect(
      (async () => { result = await a.switchTo("bad", 10); })(),
    ).resolves.toBeUndefined();
    expect(typeof result).toBe("boolean");
    expect(result).toBe(false);
  });

  it("resolves to false (never throws) when decode fails", async () => {
    const { createAmbient } = await loadAmbient();
    const a = createAmbient(null);
    await a.ignite();
    const result = await a.switchTo("corrupt", 10);
    expect(typeof result).toBe("boolean");
    expect(result).toBe(false);
  });

  it("does not strand the previous bed when the next one fails", async () => {
    // Lock the cross-transition invariant: a failed switch leaves the prior
    // bed playing; currentMission stays on the last good value.
    const { createAmbient } = await loadAmbient();
    const a = createAmbient(null);
    await a.ignite();
    expect(await a.switchTo("good", 10)).toBe(true);
    expect(a.currentMission()).toBe("good");
    expect(await a.switchTo("bad", 10)).toBe(false);
    expect(a.currentMission()).toBe("good");
  });
});

describe("createAmbient().playOneShot", () => {
  it("resolves to a boolean for a valid url", async () => {
    const { createAmbient } = await loadAmbient();
    const a = createAmbient(null);
    await a.ignite();
    const ok = await a.playOneShot("https://test.local/good.mp3", { bus: "sfx" });
    expect(typeof ok).toBe("boolean");
    expect(ok).toBe(true);
  });

  it("resolves to false (never throws) on 404", async () => {
    const { createAmbient } = await loadAmbient();
    const a = createAmbient(null);
    await a.ignite();
    const ok = await a.playOneShot("https://test.local/bad.mp3", { bus: "sfx" });
    expect(typeof ok).toBe("boolean");
    expect(ok).toBe(false);
  });

  it("resolves to false (never throws) when decode fails", async () => {
    const { createAmbient } = await loadAmbient();
    const a = createAmbient(null);
    await a.ignite();
    const ok = await a.playOneShot("https://test.local/corrupt.mp3", { bus: "motif" });
    expect(typeof ok).toBe("boolean");
    expect(ok).toBe(false);
  });

  it("returns false (without throwing) when muted", async () => {
    const { createAmbient } = await loadAmbient();
    const a = createAmbient(null);
    await a.ignite();
    a.setMuted(true);
    const ok = await a.playOneShot("https://test.local/good.mp3", { bus: "sfx" });
    expect(typeof ok).toBe("boolean");
    expect(ok).toBe(false);
  });
});

describe("Director.enter falls back without throwing on bed failure", () => {
  it("never throws when the requested mission bed is missing", async () => {
    vi.resetModules();
    const { audio } = await import("../audio/director");
    // The director uses `enter('mission', { missionId })` which calls
    // engine.switchTo under the hood. With our mock, the asset URL won't
    // resolve through getSoundtrack — director must fall back, not throw.
    await expect(audio.enter("mission", { missionId: "does-not-exist", fadeMs: 10 }))
      .resolves.toBeUndefined();
    // The attempt log must reflect a boolean outcome (ok === false on the
    // primary attempt, ok === true on the archive fallback if one ran).
    const attempts = audio.recentAttempts();
    for (const a of attempts) {
      if (a.ok !== undefined) expect(typeof a.ok).toBe("boolean");
    }
  });
});
