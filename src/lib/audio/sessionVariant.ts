// Per-session bed variant picker.
//
// Some rooms ship multiple calm-bed variants (e.g. landing-drone,
// landing-drone-2). To keep continuity within a play session we pick one
// variant per registry key on first request and remember the choice in
// sessionStorage, so reloads / cross-room returns within the same tab
// always resolve to the same bed. A fresh tab gets a fresh roll.

const SESSION_KEY = "dn:bed-variant-picks";

type PickMap = Record<string, number>;

function read(): PickMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return parsed as PickMap;
    return {};
  } catch {
    return {};
  }
}

function write(map: PickMap): void {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(map)); } catch { /* noop */ }
}

/**
 * Return the index (0..count-1) chosen for `key` this session. Picks once
 * and persists. If `count <= 1` always returns 0.
 */
export function pickSessionVariant(key: string, count: number): number {
  if (count <= 1) return 0;
  const map = read();
  const prior = map[key];
  if (typeof prior === "number" && Number.isInteger(prior) && prior >= 0 && prior < count) {
    return prior;
  }
  const idx = Math.floor(Math.random() * count);
  map[key] = idx;
  write(map);
  return idx;
}

/** Snapshot of every bed variant pick this session — for diagnostics. */
export function getSessionVariantPicks(): Record<string, number> {
  return { ...read() };
}

/** Forget every session pick. Next request rolls fresh. */
export function resetSessionVariants(): void {
  if (typeof window === "undefined") return;
  try { window.sessionStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
}
