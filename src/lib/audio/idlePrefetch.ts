// Idle-time prefetch helpers.
//
// Why: warming the next room's bed should never compete with the audio
// currently fading in, with the route bundle, or with the user's first
// paint. `requestIdleCallback` (with a `setTimeout` fallback for Safari
// and SSR) gives us a polite scheduling primitive — the browser only
// runs the callback once the main thread has breathing room.
//
// Calls are serialized so we never fire two prefetches in the same idle
// slot; that keeps a missions list of nine beds from racing the network
// for bandwidth with the bed that's actively playing.
import { audio } from "@/lib/audio/director";
import { MISSIONS } from "@/lib/missions";

type IdleHandle = number;
type IdleDeadline = { didTimeout: boolean; timeRemaining: () => number };

function scheduleIdle(cb: (deadline: IdleDeadline) => void, timeout = 2000): IdleHandle {
  if (typeof window === "undefined") return 0;
  const w = window as Window & {
    requestIdleCallback?: (cb: (d: IdleDeadline) => void, opts?: { timeout: number }) => number;
  };
  if (typeof w.requestIdleCallback === "function") {
    return w.requestIdleCallback(cb, { timeout });
  }
  return window.setTimeout(
    () => cb({ didTimeout: true, timeRemaining: () => 0 }),
    Math.min(timeout, 400),
  );
}

function cancelIdle(handle: IdleHandle) {
  if (typeof window === "undefined" || !handle) return;
  const w = window as Window & { cancelIdleCallback?: (h: number) => void };
  if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(handle);
  else window.clearTimeout(handle);
}

type PrefetchTarget = Parameters<typeof audio.prefetch>[0];

/**
 * Run prefetch targets one per idle slot. Returns a cleanup function that
 * cancels any still-queued slots — call it from a `useEffect` cleanup so a
 * fast route change doesn't leave dangling idle work.
 */
export function idlePrefetch(targets: PrefetchTarget[]): () => void {
  if (targets.length === 0) return () => {};
  let cancelled = false;
  let handle: IdleHandle = 0;
  let i = 0;
  const tick = () => {
    if (cancelled || i >= targets.length) return;
    audio.prefetch(targets[i]!);
    i += 1;
    if (i < targets.length) handle = scheduleIdle(tick);
  };
  handle = scheduleIdle(tick);
  return () => {
    cancelled = true;
    cancelIdle(handle);
  };
}

/**
 * Predict the next mission the user is most likely to open. Heuristic:
 * the next available mission after `currentId` in authored order; if
 * `currentId` is missing or last, fall back to the first available one.
 * Returns null when there is nothing to suggest.
 */
export function nextLikelyMissionId(currentId?: string): string | null {
  const available = MISSIONS.filter((m) => m.status === "available");
  if (available.length === 0) return null;
  if (!currentId) return available[0]!.id;
  const idx = available.findIndex((m) => m.id === currentId);
  if (idx === -1) return available[0]!.id;
  const next = available[idx + 1];
  return (next ?? available[0]!).id;
}
