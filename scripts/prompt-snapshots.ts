/**
 * Golden snapshot machinery for the prompt test harness.
 *
 * A "snapshot" here is NOT the raw model text — model output is non-deterministic
 * (temperature > 0, no seed). Instead we record a STRUCTURAL FINGERPRINT plus a
 * small set of CRITICAL FIELDS that must remain stable across runs:
 *
 *   - shape:    a recursive type signature ("object{a:string,b:array<number>}")
 *               with array lengths summarized as ranges, so order/keys/types
 *               are pinned while free-form prose is not.
 *   - critical: a tiny dict of mission-defining invariants (e.g. archetypeId,
 *               timeline length, chip count, enum values that appeared).
 *
 * On every run the harness recomputes (shape, critical) for each fixture and
 * diffs them against the golden file at `scripts/snapshots/<fixture>.json`.
 * Any change in shape OR critical fields fails the run.
 *
 * Re-bless with `--update-snapshots` after you've intentionally changed
 * the contract.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export type Snapshot = {
  /** Fixture id (e.g. "director/mission-01/ask-sarah-context"). */
  id: string;
  /** Recursive structural fingerprint. */
  shape: string;
  /** Mission-defining invariants that must remain stable. */
  critical: Record<string, string | number | boolean | null | string[]>;
  /** ISO timestamp of when this snapshot was last blessed. */
  blessedAt: string;
};

const SNAPSHOT_DIR = join(import.meta.dir ?? __dirname, "snapshots");

/** Bucket array lengths into ranges so a 5-vs-6 belief trajectory doesn't churn. */
function lengthBucket(n: number): string {
  if (n === 0) return "0";
  if (n === 1) return "1";
  if (n <= 3) return "2-3";
  if (n <= 5) return "4-5";
  if (n <= 8) return "6-8";
  return "9+";
}

/**
 * Recursive structural fingerprint. Records keys and value types only.
 * - objects: `{k1:T1,k2:T2}` with keys sorted
 * - arrays:  `array<T>[<bucket>]` using element shape from index 0
 * - primitives: typeof name
 * - null: "null"
 * - enums: callers can pre-process to record literals if needed
 */
export function shapeOf(v: unknown): string {
  if (v === null) return "null";
  if (Array.isArray(v)) {
    const inner = v.length > 0 ? shapeOf(v[0]) : "unknown";
    return `array<${inner}>[${lengthBucket(v.length)}]`;
  }
  if (typeof v === "object") {
    const obj = v as Record<string, unknown>;
    const keys = Object.keys(obj).sort();
    const parts = keys.map((k) => `${k}:${shapeOf(obj[k])}`);
    return `{${parts.join(",")}}`;
  }
  return typeof v;
}

function ensureDir(filePath: string) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function snapshotPath(id: string): string {
  // Make id filesystem-safe.
  const safe = id.replace(/[^a-zA-Z0-9._-]+/g, "_");
  return join(SNAPSHOT_DIR, `${safe}.json`);
}

export function loadSnapshot(id: string): Snapshot | null {
  const path = snapshotPath(id);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Snapshot;
  } catch {
    return null;
  }
}

export function writeSnapshot(snap: Snapshot): string {
  const path = snapshotPath(snap.id);
  ensureDir(path);
  writeFileSync(path, JSON.stringify(snap, null, 2) + "\n", "utf8");
  return path;
}

export type SnapshotDiff =
  | { kind: "missing"; path: string }
  | { kind: "shape"; expected: string; actual: string }
  | {
      kind: "critical";
      key: string;
      expected: Snapshot["critical"][string];
      actual: Snapshot["critical"][string];
    };

export function diffSnapshot(expected: Snapshot, actual: Omit<Snapshot, "blessedAt">): SnapshotDiff[] {
  const diffs: SnapshotDiff[] = [];
  if (expected.shape !== actual.shape) {
    diffs.push({ kind: "shape", expected: expected.shape, actual: actual.shape });
  }
  const keys = new Set([...Object.keys(expected.critical), ...Object.keys(actual.critical)]);
  for (const k of keys) {
    const a = expected.critical[k];
    const b = actual.critical[k];
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      diffs.push({ kind: "critical", key: k, expected: a, actual: b });
    }
  }
  return diffs;
}

export function formatDiff(diffs: SnapshotDiff[]): string {
  return diffs
    .map((d) => {
      if (d.kind === "missing") return `  missing snapshot at ${d.path}`;
      if (d.kind === "shape")
        return `  shape changed:\n    expected: ${d.expected}\n    actual:   ${d.actual}`;
      return `  critical[${d.key}] changed: expected=${JSON.stringify(d.expected)} actual=${JSON.stringify(d.actual)}`;
    })
    .join("\n");
}
