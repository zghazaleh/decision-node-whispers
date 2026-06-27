/**
 * Fixture scaffolder for the prompt test harness.
 *
 * Appends a new entry to `scripts/prompt-test-fixtures.ts` (Director or
 * Analysis), seeds an empty snapshot stub under `scripts/snapshots/`, and
 * refreshes the "Registered fixtures" block in
 * `docs/architecture/prompt-test-harness.md`.
 *
 * Usage:
 *   bun run scripts/scaffold-fixture.ts director <id> --mission=mission-01 \
 *       --turn="user:Sarah, who is here?" [--turn="assistant:..."]
 *
 *   bun run scripts/scaffold-fixture.ts analysis <id> --mission=mission-01 \
 *       --decision="..." --reasoning="..." \
 *       [--archetype=<id>] [--confidence=70] \
 *       [--turn="user:..." --turn="assistant:..."]
 *
 * Flags:
 *   --dry-run        print planned edits, write nothing
 *   --no-snapshot    skip seeding the snapshot stub
 *   --no-docs        skip refreshing the docs fixture index
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

// ─── Paths ──────────────────────────────────────────────────────────────────

const ROOT = resolve(import.meta.dir ?? __dirname, "..");
const FIXTURES_FILE = join(ROOT, "scripts/prompt-test-fixtures.ts");
const SNAPSHOT_DIR = join(ROOT, "scripts/snapshots");
const DOCS_FILE = join(ROOT, "docs/architecture/prompt-test-harness.md");

const DIRECTOR_MARKER = "// <scaffold:director>";
const ANALYSIS_MARKER = "// <scaffold:analysis>";
const DOCS_START = "<!-- fixtures:start -->";
const DOCS_END = "<!-- fixtures:end -->";

// ─── CLI parsing ────────────────────────────────────────────────────────────

type Kind = "director" | "analysis";
type Turn = { role: "user" | "assistant"; text: string };

type Args = {
  kind: Kind;
  id: string;
  mission: string;
  turns: Turn[];
  decision?: string;
  reasoning?: string;
  archetypeId?: string;
  confidence?: number;
  dryRun: boolean;
  writeSnapshot: boolean;
  writeDocs: boolean;
};

function die(msg: string): never {
  console.error(`✖ ${msg}`);
  process.exit(2);
}

function parseTurn(raw: string): Turn {
  const idx = raw.indexOf(":");
  if (idx < 1) die(`--turn must be "role:text", got: ${JSON.stringify(raw)}`);
  const role = raw.slice(0, idx).trim();
  const text = raw.slice(idx + 1).trim();
  if (role !== "user" && role !== "assistant") {
    die(`--turn role must be 'user' or 'assistant', got: ${role}`);
  }
  if (!text) die(`--turn text is empty for ${JSON.stringify(raw)}`);
  return { role, text };
}

function parseArgs(argv: string[]): Args {
  const positional: string[] = [];
  const turns: Turn[] = [];
  let mission = "mission-01";
  let decision: string | undefined;
  let reasoning: string | undefined;
  let archetypeId: string | undefined;
  let confidence: number | undefined;
  let dryRun = false;
  let writeSnapshot = true;
  let writeDocs = true;

  for (const a of argv.slice(2)) {
    if (a === "--dry-run") dryRun = true;
    else if (a === "--no-snapshot") writeSnapshot = false;
    else if (a === "--no-docs") writeDocs = false;
    else if (a.startsWith("--mission=")) mission = a.slice("--mission=".length);
    else if (a.startsWith("--turn=")) turns.push(parseTurn(a.slice("--turn=".length)));
    else if (a.startsWith("--decision=")) decision = a.slice("--decision=".length);
    else if (a.startsWith("--reasoning=")) reasoning = a.slice("--reasoning=".length);
    else if (a.startsWith("--archetype=")) archetypeId = a.slice("--archetype=".length);
    else if (a.startsWith("--confidence=")) {
      const n = Number(a.slice("--confidence=".length));
      if (!Number.isFinite(n)) die(`--confidence must be a number`);
      confidence = n;
    } else if (a.startsWith("--")) die(`unknown flag: ${a}`);
    else positional.push(a);
  }

  const [kindRaw, id] = positional;
  if (kindRaw !== "director" && kindRaw !== "analysis") {
    die(`first positional must be 'director' or 'analysis', got: ${kindRaw ?? "(none)"}`);
  }
  if (!id || !/^[a-z0-9][a-z0-9-]*$/.test(id)) {
    die(`second positional must be a kebab-case id, got: ${id ?? "(none)"}`);
  }

  if (kindRaw === "analysis" && !decision) die(`analysis fixtures require --decision`);

  return {
    kind: kindRaw,
    id,
    mission,
    turns,
    decision,
    reasoning,
    archetypeId,
    confidence,
    dryRun,
    writeSnapshot,
    writeDocs,
  };
}

// ─── Code generation ────────────────────────────────────────────────────────

function tsString(s: string): string {
  // Prefer double-quoted; escape backslashes and double quotes.
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function renderTurns(turns: Turn[]): string {
  if (turns.length === 0) return "[]";
  const inner = turns
    .map((t) => `      { role: ${tsString(t.role)}, text: ${tsString(t.text)} },`)
    .join("\n");
  return `[\n${inner}\n    ]`;
}

function renderDirector(args: Args): string {
  if (args.turns.length === 0) {
    die("director fixtures require at least one --turn");
  }
  return [
    `  {`,
    `    id: ${tsString(args.id)},`,
    `    turns: ${renderTurns(args.turns)},`,
    `  },`,
  ].join("\n");
}

function renderAnalysis(args: Args): string {
  const lines: string[] = [`  {`, `    id: ${tsString(args.id)},`];
  if (args.archetypeId) lines.push(`    archetypeId: ${tsString(args.archetypeId)},`);
  if (typeof args.confidence === "number") lines.push(`    confidence: ${args.confidence},`);
  lines.push(`    decision: ${tsString(args.decision!)},`);
  if (args.reasoning) lines.push(`    reasoning: ${tsString(args.reasoning)},`);
  else lines.push(`    reasoning: "",`);
  lines.push(`    transcript: ${renderTurns(args.turns)},`);
  lines.push(`  },`);
  return lines.join("\n");
}

// ─── File editors ───────────────────────────────────────────────────────────

function insertBeforeMarker(source: string, marker: string, block: string): string {
  const idx = source.indexOf(marker);
  if (idx === -1) {
    die(`marker ${marker} not found in ${FIXTURES_FILE} — restore it before scaffolding`);
  }
  // Find start of marker line (preserve indent on marker).
  const lineStart = source.lastIndexOf("\n", idx) + 1;
  return source.slice(0, lineStart) + block + "\n" + source.slice(lineStart);
}

function fixtureExists(source: string, kind: Kind, id: string): boolean {
  // Cheap heuristic: search within the relevant array's bounds.
  const arrayName = kind === "director" ? "DIRECTOR_FIXTURES" : "ANALYSIS_FIXTURES";
  const arrIdx = source.indexOf(arrayName);
  if (arrIdx === -1) return false;
  const slice = source.slice(arrIdx);
  const idRegex = new RegExp(`id:\\s*["']${id.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}["']`);
  return idRegex.test(slice);
}

function appendFixture(args: Args): { source: string; before: string; after: string } {
  const before = readFileSync(FIXTURES_FILE, "utf8");
  if (fixtureExists(before, args.kind, args.id)) {
    die(`fixture ${args.kind}/${args.id} already exists in ${FIXTURES_FILE}`);
  }
  const block = args.kind === "director" ? renderDirector(args) : renderAnalysis(args);
  const marker = args.kind === "director" ? DIRECTOR_MARKER : ANALYSIS_MARKER;
  const after = insertBeforeMarker(before, marker, block);
  return { source: after, before, after };
}

function snapshotStubPath(args: Args): string {
  const id = `${args.kind}/${args.mission}/${args.id}`;
  const safe = id.replace(/[^a-zA-Z0-9._-]+/g, "_");
  return join(SNAPSHOT_DIR, `${safe}.json`);
}

function writeSnapshotStub(args: Args): { path: string; content: string } | null {
  const path = snapshotStubPath(args);
  if (existsSync(path)) return null;
  const stub = {
    id: `${args.kind}/${args.mission}/${args.id}`,
    shape: "",
    critical: {},
    blessedAt: null,
    _note: "Placeholder created by scaffold-fixture.ts. Run the harness with --update-snapshots to bless.",
  };
  const content = JSON.stringify(stub, null, 2) + "\n";
  return { path, content };
}

// ─── Docs index refresh ─────────────────────────────────────────────────────

function listFixtureIds(): { director: string[]; analysis: string[] } {
  const source = readFileSync(FIXTURES_FILE, "utf8");
  const arrayBounds = (name: string): [number, number] | null => {
    const start = source.indexOf(`${name}: DirectorFixture[]`);
    const altStart = start === -1 ? source.indexOf(`${name}: AnalysisFixture[]`) : start;
    if (altStart === -1) return null;
    const end = source.indexOf("];", altStart);
    return end === -1 ? null : [altStart, end];
  };
  const idsIn = (range: [number, number] | null): string[] => {
    if (!range) return [];
    const slice = source.slice(range[0], range[1]);
    return Array.from(slice.matchAll(/id:\s*["']([^"']+)["']/g)).map((m) => m[1]);
  };
  return {
    director: idsIn(arrayBounds("DIRECTOR_FIXTURES")),
    analysis: idsIn(arrayBounds("ANALYSIS_FIXTURES")),
  };
}

function listSnapshotIds(): string[] {
  if (!existsSync(SNAPSHOT_DIR)) return [];
  return readdirSync(SNAPSHOT_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

function renderDocsIndex(): string {
  const { director, analysis } = listFixtureIds();
  const snapshots = listSnapshotIds();
  const lines: string[] = [];
  lines.push("");
  lines.push("_Auto-generated by `scripts/scaffold-fixture.ts`. Do not edit by hand._");
  lines.push("");
  lines.push("**Director fixtures**");
  lines.push("");
  if (director.length === 0) lines.push("- _(none)_");
  else for (const id of director) lines.push(`- \`${id}\``);
  lines.push("");
  lines.push("**Analysis fixtures**");
  lines.push("");
  if (analysis.length === 0) lines.push("- _(none)_");
  else for (const id of analysis) lines.push(`- \`${id}\``);
  lines.push("");
  lines.push("**Snapshot files** (`scripts/snapshots/*.json`)");
  lines.push("");
  if (snapshots.length === 0) lines.push("- _(none — run harness with `--update-snapshots` to seed)_");
  else for (const s of snapshots) lines.push(`- \`${s}.json\``);
  lines.push("");
  return lines.join("\n");
}

function refreshDocs(): { before: string; after: string } | null {
  if (!existsSync(DOCS_FILE)) return null;
  const before = readFileSync(DOCS_FILE, "utf8");
  const startIdx = before.indexOf(DOCS_START);
  const endIdx = before.indexOf(DOCS_END);
  if (startIdx === -1 || endIdx === -1 || endIdx < startIdx) {
    console.warn(`⚠ ${DOCS_FILE} is missing ${DOCS_START}/${DOCS_END} markers — skipping docs refresh`);
    return null;
  }
  const head = before.slice(0, startIdx + DOCS_START.length);
  const tail = before.slice(endIdx);
  const after = `${head}\n${renderDocsIndex()}\n${tail}`;
  if (after === before) return null;
  return { before, after };
}

// ─── Main ───────────────────────────────────────────────────────────────────

function ensureDir(path: string) {
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function main() {
  const args = parseArgs(process.argv);

  // 1. Append fixture.
  const fixture = appendFixture(args);

  // 2. Stub snapshot.
  const snapshot = args.writeSnapshot ? writeSnapshotStub(args) : null;

  // 3. Refresh docs (read state AFTER fixture write would land — do it in a
  //    second pass below, after we've actually written the fixture file or
  //    simulated it).
  const banner = args.dryRun ? "DRY RUN — no files written" : "writing changes";
  console.log(`▶ scaffold ${args.kind}/${args.mission}/${args.id} — ${banner}`);

  if (args.dryRun) {
    console.log(`\n── ${FIXTURES_FILE} (preview) ──`);
    // Show only the inserted block + surrounding context.
    const insertedAt = fixture.after.indexOf(
      args.kind === "director" ? DIRECTOR_MARKER : ANALYSIS_MARKER,
    );
    const ctxStart = Math.max(0, fixture.after.lastIndexOf("\n  {", insertedAt));
    console.log(fixture.after.slice(ctxStart, insertedAt + 60));
    if (snapshot) {
      console.log(`\n── ${snapshot.path} (preview) ──`);
      console.log(snapshot.content);
    }
    if (args.writeDocs) {
      console.log(`\n── docs index would be regenerated in ${DOCS_FILE}`);
    }
    return;
  }

  writeFileSync(FIXTURES_FILE, fixture.after, "utf8");
  console.log(`  ✓ appended fixture to ${FIXTURES_FILE}`);

  if (snapshot) {
    ensureDir(snapshot.path);
    writeFileSync(snapshot.path, snapshot.content, "utf8");
    console.log(`  ✓ seeded snapshot stub at ${snapshot.path}`);
  } else if (!args.writeSnapshot) {
    console.log(`  · snapshot stub skipped (--no-snapshot)`);
  } else {
    console.log(`  · snapshot already exists at ${snapshotStubPath(args)} — left untouched`);
  }

  if (args.writeDocs) {
    const docs = refreshDocs();
    if (docs) {
      writeFileSync(DOCS_FILE, docs.after, "utf8");
      console.log(`  ✓ refreshed fixture index in ${DOCS_FILE}`);
    } else {
      console.log(`  · docs index already up to date`);
    }
  } else {
    console.log(`  · docs refresh skipped (--no-docs)`);
  }

  console.log(
    `\nNext: LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts --only=${args.kind} --mission=${args.mission} --update-snapshots`,
  );
}

main();
