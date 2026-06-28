// useRoomEntrance — one canonical place where rooms (landing / archive /
// mission / analysis) cue their ambient bed when the player walks in.
//
// Why: every room route was hand-rolling the same dance: try `audio.enter`,
// otherwise arm a one-shot pointer/keydown listener to ignite the
// AudioContext on first gesture (browser autoplay rules), then enter. That
// drifted between files. This hook locks the contract:
//
//   1. If the engine is already ignited, the bed cross-fades in immediately
//      — no waiting for a second gesture.
//   2. Otherwise, the very next pointerdown/keydown anywhere in the window
//      ignites and enters in the same tick, so the bed feels automatic
//      from the player's point of view.
//   3. Unmounting cleanly removes any pending listeners.
//
// The function never throws — audio is always best-effort.

import { useEffect } from "react";
import { audio, type Screen } from "@/lib/audio/director";
import type { AudioProfile } from "@/lib/ambient";

export type RoomEntranceOptions = {
  missionId?: string;
  profile?: AudioProfile;
  fadeMs?: number;
  /** Re-run the enter() call whenever any of these dep values change. */
  deps?: ReadonlyArray<unknown>;
};

export function useRoomEntrance(screen: Screen, opts: RoomEntranceOptions = {}) {
  const { missionId, profile, fadeMs, deps = [] } = opts;
  useEffect(() => {
    let disposed = false;
    const enter = async () => {
      if (disposed) return;
      try {
        await audio.enter(screen, { missionId, profile, fadeMs });
      } catch {
        // Audio is best-effort — a thrown enter() must never break the room.
      }
    };
    if (audio.isIgnited()) {
      void enter();
      return () => { disposed = true; };
    }
    const onGesture = () => {
      void (async () => {
        try { await audio.ignite(); } catch { /* noop */ }
        await enter();
      })();
    };
    window.addEventListener("pointerdown", onGesture, { once: true });
    window.addEventListener("keydown", onGesture, { once: true });
    return () => {
      disposed = true;
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, missionId, fadeMs, ...deps]);
}
