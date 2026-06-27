/**
 * Integration test for the scaffolder + harness loop.
 *
 *   1. Runs `scaffold-fixture.ts --dry-run` and asserts the preview is
 *      printed AND no files were mutated.
 *   2. Scaffolds a temporary fixture for real (director and analysis).
 *   3. Invokes `prompt-test-harness.ts --fixture=<id> --update-snapshots`
 *      (skipped with a warning when LOVABLE_API_KEY is missing — the
 *      structural checks below still run against the stub).
 *   4. Loads the resulting snapshot JSON and validates it against a Zod
 *      Snapshot schema, plus the documented critical-field contract.
 *   5. Restores `prompt-test-fixtures.ts` from a backup and removes the
 *      temporary snapshot file.
 *
 * Usage:
 *   bun run scripts/scaffold-integration-test.ts
 *   LOVABLE_API_KEY=... bun run scripts/scaffold-integration-test.ts
 *
 * Exit code: 0 on success, 1 on any failed assertion.
 */

import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";

const ROOT = resolve(import.meta.dir ?? __dirname, "..");
const FIXTURES_FILE = join(ROOT, "scripts/prompt-test-fixtures.ts");
const FIXTURES_BACKUP = join(ROOT, "scripts/prompt-test-fixtures.ts.bak");
const DOCS_FILE = join(ROOT, "docs/architecture/prompt-test-harness.md");
const DOCS_BACKUP = join(ROOT, "docs/architecture/prompt-test-harness.md.bak");
const SNAPSHOT_DIR = join(ROOT, "scripts/snapshots");

const MISSION = "mission-01";
const TEMP_DIRECTOR_ID = "integration-temp-director";
const TEMP_ANALYSIS_ID = "integration-temp-analysis";

// ─── Snapshot Zod contract ──────────────────────────────────────────────────

const SnapshotSchema = z.object({
  id: z.string(),
  shape: z.string(),
  critical: z.record(
    z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.string())]),
  ),
  blessedAt: z.union([z.string(), z.null()]),
  _note: z.string().optional(),
});

const DirectorCriticalSchema = z.object({
  chipCount: z.literal(3),
  hasChipsTrailer: z.literal(true),
  bodyNonEmpty: z.literal(true),
});

const AnalysisCriticalSchema = z.object({
  archetypeId: z.union([z.string(), z.null()]),
  archetypeMatchedCanon: z.boolean(),
  timelineLength: z.number().int().nonnegative(),
  canonTimelineLength: z.union([z.number().int().nonnegative(), z.null()]),
  timelineMatchesCanon: z.union([z.boolean(), z.null()]),
  strengthsCount: z.number().int().min(0).max(4),
  blindSpotsCount: z.number().int().min(0).max(4),
  biasesCount: z.number().int().min(0).max(3),
  beliefTrajectoryLength: z.number().int().min(3).max(8),
  beliefUpdatesUsed: z.array(
    z.enum(["formed", "reinforced", "revised", "abandoned", "held"]),
  ),
  beliefConfidencesUsed: z.array(z.enum(["low", "medium", "high"])),
});

// ─── Assertions ─────────────────────────────────────────────────────────────

const failures: string[] = [];
function assert(cond: unknown, msg: string) {
  if (cond) {
    console.log(`  ✓ ${msg}`);
  } else {
    failures.push(msg);
    console.log(`  ✗ ${msg}`);
  }
}

// ─── Process helpers ────────────────────────────────────────────────────────

function run(args: string[], opts: { env?: Record<string, string> } = {}) {
  const res = spawnSync("bun", ["run", ...args], {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, ...(opts.env ?? {}) },
  });
  return {
    status: res.status ?? -1,
    stdout: res.stdout ?? "",
    stderr: res.stderr ?? "",
  };
}

function fileMtime(p: string): number {
  return existsSync(p) ? statSync(p).mtimeMs : 0;
}

function snapshotPath(kind: "director" | "analysis", id: string): string {
  const safe = `${kind}/${MISSION}/${id}`.replace(/[^a-zA-Z0-9._-]+/g, "_");
  return join(SNAPSHOT_DIR, `${safe}.json`);
}

// ─── Cleanup ────────────────────────────────────────────────────────────────

function cleanup() {
  if (existsSync(FIXTURES_BACKUP)) {
    copyFileSync(FIXTURES_BACKUP, FIXTURES_FILE);
    rmSync(FIXTURES_BACKUP);
  }
  if (existsSync(DOCS_BACKUP)) {
    copyFileSync(DOCS_BACKUP, DOCS_FILE);
    rmSync(DOCS_BACKUP);
  }
  for (const kind of ["director", "analysis"] as const) {
    const id = kind === "director" ? TEMP_DIRECTOR_ID : TEMP_ANALYSIS_ID;
    const p = snapshotPath(kind, id);
    if (existsSync(p)) rmSync(p);
  }
}

// ─── Steps ──────────────────────────────────────────────────────────────────

function stepDryRun() {
  console.log("\n[1/4] scaffold --dry-run");
  const before = fileMtime(FIXTURES_FILE);
  const res = run([
    "scripts/scaffold-fixture.ts",
    "director",
    TEMP_DIRECTOR_ID,
    `--mission=${MISSION}`,
    `--turn=user:Integration dry-run probe`,
    "--dry-run",
  ]);
  assert(res.status === 0, `dry-run exited 0 (got ${res.status})\n${res.stderr}`);
  assert(res.stdout.includes("DRY RUN"), "dry-run banner printed");
  assert(res.stdout.includes(`id: "${TEMP_DIRECTOR_ID}"`), "preview shows generated fixture");
  assert(fileMtime(FIXTURES_FILE) === before, "fixtures file untouched by --dry-run");
}

function stepScaffoldReal() {
  console.log("\n[2/4] scaffold (real) — director + analysis");
  copyFileSync(FIXTURES_FILE, FIXTURES_BACKUP);
  if (existsSync(DOCS_FILE)) copyFileSync(DOCS_FILE, DOCS_BACKUP);

  const dir = run([
    "scripts/scaffold-fixture.ts",
    "director",
    TEMP_DIRECTOR_ID,
    `--mission=${MISSION}`,
    `--turn=user:What does Sarah see right now?`,
  ]);
  assert(dir.status === 0, `director scaffold exited 0 (got ${dir.status})\n${dir.stderr}`);
  assert(
    readFileSync(FIXTURES_FILE, "utf8").includes(`id: "${TEMP_DIRECTOR_ID}"`),
    "director fixture appended",
  );
  assert(existsSync(snapshotPath("director", TEMP_DIRECTOR_ID)), "director snapshot stub written");

  const ana = run([
    "scripts/scaffold-fixture.ts",
    "analysis",
    TEMP_ANALYSIS_ID,
    `--mission=${MISSION}`,
    `--decision=We delay the launch to investigate the anomaly.`,
    `--reasoning=Single weak signal still outweighs the cost of an unexplained eval artifact.`,
    `--archetype=delay`,
    `--confidence=60`,
    `--turn=assistant:Sarah: They're seated.`,
    `--turn=user:Pull Amara in.`,
  ]);
  assert(ana.status === 0, `analysis scaffold exited 0 (got ${ana.status})\n${ana.stderr}`);
  assert(
    readFileSync(FIXTURES_FILE, "utf8").includes(`id: "${TEMP_ANALYSIS_ID}"`),
    "analysis fixture appended",
  );
  assert(existsSync(snapshotPath("analysis", TEMP_ANALYSIS_ID)), "analysis snapshot stub written");
}

function stepRunHarness() {
  console.log("\n[3/4] harness against new fixtures (live gateway)");
  if (!process.env.LOVABLE_API_KEY) {
    console.log("  · LOVABLE_API_KEY missing — skipping live harness, validating stubs only");
    return false;
  }
  for (const [kind, id] of [
    ["director", TEMP_DIRECTOR_ID],
    ["analysis", TEMP_ANALYSIS_ID],
  ] as const) {
    const res = run([
      "scripts/prompt-test-harness.ts",
      `--only=${kind}`,
      `--mission=${MISSION}`,
      `--fixture=${id}`,
      "--update-snapshots",
    ]);
    const tail = res.stdout.split("\n").slice(-6).join("\n");
    assert(res.status === 0, `harness ${kind}/${id} exited 0 (got ${res.status})\n${tail}\n${res.stderr}`);
    assert(
      res.stdout.includes(`[PASS] ${kind} / ${MISSION} / ${id}`),
      `harness reported PASS for ${kind}/${id}`,
    );
  }
  return true;
}

function stepValidateSnapshots(live: boolean) {
  console.log("\n[4/4] validate snapshot JSON against Zod contract");
  for (const [kind, id, criticalSchema] of [
    ["director", TEMP_DIRECTOR_ID, DirectorCriticalSchema],
    ["analysis", TEMP_ANALYSIS_ID, AnalysisCriticalSchema],
  ] as const) {
    const p = snapshotPath(kind, id);
    if (!existsSync(p)) {
      assert(false, `snapshot file exists for ${kind}/${id}`);
      continue;
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(p, "utf8"));
    } catch (e) {
      assert(false, `snapshot ${kind}/${id} is valid JSON (${(e as Error).message})`);
      continue;
    }
    const envelope = SnapshotSchema.safeParse(parsed);
    assert(envelope.success, `${kind}/${id} snapshot matches Snapshot envelope${envelope.success ? "" : `: ${envelope.error.message}`}`);
    if (!envelope.success) continue;

    if (!live) {
      // Stub mode: shape is empty, critical is {}, blessedAt is null. Don't
      // assert the populated contract — just that the stub is well-formed.
      assert(envelope.data.shape === "", `${kind}/${id} stub shape empty`);
      assert(envelope.data.blessedAt === null, `${kind}/${id} stub blessedAt null`);
      continue;
    }

    assert(envelope.data.shape.length > 0, `${kind}/${id} shape populated after bless`);
    assert(typeof envelope.data.blessedAt === "string", `${kind}/${id} blessedAt timestamped`);
    const critical = criticalSchema.safeParse(envelope.data.critical);
    assert(critical.success, `${kind}/${id} critical fields match contract${critical.success ? "" : `: ${critical.error.message}`}`);
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("▶ scaffold ↔ harness integration test");
  let live = false;
  try {
    stepDryRun();
    stepScaffoldReal();
    live = stepRunHarness();
    stepValidateSnapshots(live);
  } finally {
    console.log("\n· cleanup");
    cleanup();
  }

  console.log(
    `\n──────── ${failures.length === 0 ? "all assertions passed" : `${failures.length} assertion(s) failed`} ────────`,
  );
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(failures.length ? 1 : 0);
}

void main();
