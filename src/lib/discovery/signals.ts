/**
 * Discovery signal log.
 *
 * Localstorage-backed event tape that records the raw signals our future
 * recommender + resonance rails need: impressions, opens, commits,
 * analysis-read depth, theme dwell. No PII, no server roundtrip yet —
 * the point (per the Discovery & Marketplace doc, §"two bets") is that
 * the log *exists before* we have thousands of cases.
 *
 * Reading the log is sync + pure (returns `[]` on SSR / quota errors).
 * Writing is a fire-and-forget side effect — never throws.
 */

const KEY = "dn.signals";
const MAX_EVENTS = 1000;

export type SignalType =
  | "impression"
  | "open"
  | "commit"
  | "analysis_read"
  | "theme_dwell";

export type Signal = {
  type: SignalType;
  missionId: string;
  theme?: string;
  ts: number;
  meta?: Record<string, unknown>;
};

function read(): Signal[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Signal[]) : [];
  } catch {
    return [];
  }
}

function write(events: Signal[]): void {
  if (typeof window === "undefined") return;
  try {
    const trimmed =
      events.length > MAX_EVENTS ? events.slice(events.length - MAX_EVENTS) : events;
    window.localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {
    // Quota or privacy mode — swallow.
  }
}

function push(sig: Signal): void {
  const log = read();
  log.push(sig);
  write(log);
}

/* ── public api ─────────────────────────────────────────── */

export function logImpression(missionId: string, theme?: string): void {
  push({ type: "impression", missionId, theme, ts: Date.now() });
}

export function logOpen(missionId: string, theme?: string): void {
  push({ type: "open", missionId, theme, ts: Date.now() });
}

export function logCommit(missionId: string, theme?: string): void {
  push({ type: "commit", missionId, theme, ts: Date.now() });
}

export function logAnalysisRead(missionId: string, depthPct: number): void {
  push({
    type: "analysis_read",
    missionId,
    ts: Date.now(),
    meta: { depthPct },
  });
}

export function logThemeDwell(theme: string, missionId: string): void {
  push({ type: "theme_dwell", missionId, theme, ts: Date.now() });
}

/* ── derived selectors (read-only) ──────────────────────── */

export function getPlayCount(missionId: string): number {
  return read().filter((s) => s.type === "commit" && s.missionId === missionId)
    .length;
}

export function getThemeAffinity(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of read()) {
    if (!s.theme) continue;
    const weight =
      s.type === "commit"
        ? 3
        : s.type === "analysis_read"
          ? 2
          : s.type === "open"
            ? 1
            : 0;
    if (weight === 0) continue;
    out[s.theme] = (out[s.theme] ?? 0) + weight;
  }
  return out;
}

/**
 * Coarse resonance band for a case. Local play data is sparse, so this
 * blends a curated baseline (where the field has historically gathered)
 * with local boosts. Returned as words — never a count or a rank.
 *
 *   "widely-felt"  → "many are sitting with this"
 *   "felt"         → "a quiet crowd is holding this"
 *   "quiet"        → null (we say nothing rather than label a case "unpopular")
 */
export type ResonanceBand = "widely-felt" | "felt" | "quiet";

// Curator baseline: where cases have *culturally* landed so far. Hand-set,
// not a play count. Update when the editorial read changes.
const BASELINE: Record<string, ResonanceBand> = {
  "mission-01": "widely-felt",
  "mission-02": "felt",
  "mission-03": "felt",
  "mission-04": "widely-felt",
  "mission-05": "felt",
  "mission-06": "quiet",
  "mission-07": "felt",
  "mission-08": "quiet",
  "mission-09": "quiet",
  "mission-10": "quiet",
  "mission-11": "quiet",
  "mission-12": "quiet",
  "mission-13": "quiet",
  "mission-14": "quiet",
  "mission-15": "quiet",
};

export function getResonance(missionId: string): ResonanceBand {
  const local = getPlayCount(missionId);
  const base = BASELINE[missionId] ?? "quiet";
  // A single local commit lifts a "quiet" case to "felt" — the user has
  // *just* held it, that's resonance for them.
  if (local >= 2) return "widely-felt";
  if (local >= 1 && base === "quiet") return "felt";
  return base;
}

export function resonanceCopy(band: ResonanceBand): string | null {
  if (band === "widely-felt") return "many are sitting with this";
  if (band === "felt") return "a quiet crowd is holding this";
  return null;
}
