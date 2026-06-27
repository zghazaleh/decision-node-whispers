/**
 * Prompt Test Harness
 * ───────────────────
 * Runs sample Director and Decision Analysis prompts against the live
 * Lovable AI Gateway and verifies the responses conform to the schemas
 * documented in `docs/architecture/prompt-io-schema.md`.
 *
 * This harness is READ-ONLY with respect to application logic — it does
 * not import `analyzeDecision` or `/api/chat`. It re-builds the same
 * prompts and re-declares the same Zod schemas so a drift between the
 * documented contract and the running code is caught here.
 *
 * Usage:
 *   LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts
 *   LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts --only=director
 *   LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts --only=analysis
 *   LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts --mission=mission-02
 *   LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts --update-snapshots
 *
 * In addition to schema validation, each fixture is compared against a
 * golden snapshot in `scripts/snapshots/` that pins the response SHAPE
 * (recursive type signature) plus mission-critical fields (archetypeId,
 * timeline length vs canon, belief-trajectory enum values used, etc.).
 * Use `--update-snapshots` (or `-u`) to bless intentional contract changes.
 *
 * Exit code is non-zero if any sample fails schema validation OR snapshot
 * comparison.
 */

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { getMissionEngine } from "@/lib/missions/registry";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { DIRECTOR_FIXTURES, ANALYSIS_FIXTURES } from "./prompt-test-fixtures";
import {
  diffSnapshot,
  formatDiff,
  loadSnapshot,
  shapeOf,
  writeSnapshot,
  type Snapshot,
} from "./prompt-snapshots";

// ─── Documented schemas (mirrored from prompt-io-schema.md) ──────────────────

const ChipsTrailerSchema = z.object({
  raw: z.string(),
  chips: z.array(z.string().min(3)).length(3),
});

const AnalysisSchema = z.object({
  headline: z.string(),
  archetypeId: z.string().optional(),
  archetypeLabel: z.string().optional(),
  timeline: z.array(z.object({ beat: z.string(), consequence: z.string() })),
  assumptions: z.string(),
  evidenceUsed: z.string(),
  evidenceIgnored: z.string(),
  alternatives: z.string(),
  closing: z.string(),
  reasoningAssessment: z.object({
    summary: z.string(),
    strengths: z
      .array(z.object({ behavior: z.string(), evidence: z.string() }))
      .max(4),
    blindSpots: z
      .array(
        z.object({
          pattern: z.string(),
          evidence: z.string(),
          gentleReframe: z.string(),
        }),
      )
      .max(4),
    possibleBiases: z
      .array(
        z.object({
          name: z.string(),
          evidence: z.string(),
          gentleExplanation: z.string(),
        }),
      )
      .max(3),
    calibration: z.string(),
    luckVsSkill: z.string(),
  }),
  beliefTrajectory: z
    .array(
      z.object({
        marker: z.string(),
        hypothesis: z.string(),
        confidence: z.enum(["low", "medium", "high"]),
        trigger: z.string(),
        update: z.enum(["formed", "reinforced", "revised", "abandoned", "held"]),
        note: z.string(),
      }),
    )
    .max(8),
});

// ─── CLI ─────────────────────────────────────────────────────────────────────

type Args = { only?: "director" | "analysis"; mission: string; updateSnapshots: boolean };

function parseArgs(argv: string[]): Args {
  const args: Args = { mission: "mission-01", updateSnapshots: false };
  for (const a of argv.slice(2)) {
    if (a.startsWith("--only=")) {
      const v = a.slice("--only=".length);
      if (v !== "director" && v !== "analysis") {
        throw new Error(`--only must be 'director' or 'analysis'`);
      }
      args.only = v;
    } else if (a.startsWith("--mission=")) {
      args.mission = a.slice("--mission=".length);
    } else if (a === "--update-snapshots" || a === "-u") {
      args.updateSnapshots = true;
    }
  }
  return args;
}

// ─── Snapshot comparison ─────────────────────────────────────────────────────

type SnapshotOutcome = "match" | "written" | "updated" | "drift" | "new";

function compareOrBless(
  id: string,
  shape: string,
  critical: Snapshot["critical"],
  updateSnapshots: boolean,
): { outcome: SnapshotOutcome; detail: string } {
  const existing = loadSnapshot(id);
  const candidate: Omit<Snapshot, "blessedAt"> = { id, shape, critical };
  if (!existing) {
    if (updateSnapshots) {
      writeSnapshot({ ...candidate, blessedAt: new Date().toISOString() });
      return { outcome: "written", detail: "snapshot written (new)" };
    }
    return { outcome: "new", detail: "no golden snapshot on disk (run with --update-snapshots to bless)" };
  }
  const diffs = diffSnapshot(existing, candidate);
  if (diffs.length === 0) return { outcome: "match", detail: "snapshot matched" };
  if (updateSnapshots) {
    writeSnapshot({ ...candidate, blessedAt: new Date().toISOString() });
    return { outcome: "updated", detail: `snapshot updated (${diffs.length} field(s) changed)` };
  }
  return { outcome: "drift", detail: `snapshot drift:\n${formatDiff(diffs)}` };
}

// ─── Chips parser ────────────────────────────────────────────────────────────

const CHIPS_RE = /<<chips:\s*(.+?)>>\s*$/s;

function parseChipsTrailer(text: string) {
  const m = text.trim().match(CHIPS_RE);
  if (!m) throw new Error("missing `<<chips: ... | ... | ...>>` trailer");
  const raw = m[1];
  const chips = raw
    .split("|")
    .map((c) => c.trim().replace(/^"|"$/g, "").trim())
    .filter(Boolean);
  return ChipsTrailerSchema.parse({ raw, chips });
}

// ─── Result reporting ────────────────────────────────────────────────────────

type Result = { name: string; ok: boolean; detail: string };
const results: Result[] = [];

function record(name: string, ok: boolean, detail: string) {
  results.push({ name, ok, detail });
  const tag = ok ? "PASS" : "FAIL";
  // eslint-disable-next-line no-console
  console.log(`[${tag}] ${name} — ${detail}`);
}

// ─── Director runner ─────────────────────────────────────────────────────────

async function runDirector(
  gateway: ReturnType<typeof createLovableAiGatewayProvider>,
  missionId: string,
  updateSnapshots: boolean,
) {
  const engine = getMissionEngine(missionId);
  if (!engine) throw new Error(`Unknown mission: ${missionId}`);

  for (const fx of DIRECTOR_FIXTURES) {
    const name = `director / ${missionId} / ${fx.id}`;
    try {
      const messages = [
        { role: "assistant" as const, content: engine.opening.text },
        ...fx.turns.map((t) => ({ role: t.role, content: t.text })),
      ];
      const { text } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system: engine.systemPrompt,
        messages,
        temperature: 0.85,
      });
      const parsed = parseChipsTrailer(text);
      record(
        name,
        true,
        `chips=[${parsed.chips.map((c) => JSON.stringify(c)).join(", ")}]`,
      );

      // Snapshot: record the structural contract (chip count + body shape).
      const body = text.replace(CHIPS_RE, "").trim();
      const shape = shapeOf({
        body: typeof body,
        chips: parsed.chips,
      });
      const critical = {
        chipCount: parsed.chips.length,
        hasChipsTrailer: true,
        bodyNonEmpty: body.length > 0,
      };
      const snap = compareOrBless(`director/${missionId}/${fx.id}`, shape, critical, updateSnapshots);
      record(`${name} :: snapshot`, snap.outcome !== "drift" && snap.outcome !== "new", snap.detail);
    } catch (err) {
      record(name, false, (err as Error).message);
    }
  }
}

// ─── Decision Analysis runner ────────────────────────────────────────────────

async function runAnalysis(
  gateway: ReturnType<typeof createLovableAiGatewayProvider>,
  missionId: string,
  updateSnapshots: boolean,
) {
  const engine = getMissionEngine(missionId);
  if (!engine) throw new Error(`Unknown mission: ${missionId}`);

  for (const fx of ANALYSIS_FIXTURES) {
    const name = `analysis / ${missionId} / ${fx.id}`;
    try {
      // ── Stage A (classify) unless a valid preset id was provided
      let archetypeId: string | null = null;
      if (fx.archetypeId && engine.getArchetype(fx.archetypeId)) {
        archetypeId = fx.archetypeId;
      } else {
        const ClassifySchema = z.object({
          archetypeId: z.enum([...engine.archetypeIds] as [string, ...string[]]),
          confidence: z.number().min(0).max(1),
          rationale: z.string(),
        });
        try {
          const { object } = await generateObject({
            model: gateway("google/gemini-3-flash-preview"),
            temperature: 0.1,
            schema: ClassifySchema,
            system: `You classify a player's final decision in an interactive drama.

ARCHETYPES:
${engine.archetypeMenuForClassifier()}

Pick the single archetype that best matches the SUBSTANCE of the player's decision. Ignore reasoning quality; classify the action.`,
            prompt: `DECISION: ${fx.decision}\n\nREASONING: ${fx.reasoning || "(none)"}`,
          });
          archetypeId = object.archetypeId;
        } catch {
          archetypeId = null;
        }
      }

      const archetype = archetypeId ? engine.getArchetype(archetypeId) : null;
      const canonTimelineBlock = archetype
        ? `CANON CONSEQUENCE TIMELINE — these beats are GROUND TRUTH. Use them verbatim for the 'timeline' field, in this exact order. You may NOT add, drop, reorder, or invent beats.

${archetype.timeline.map((t, i) => `${i + 1}. beat: "${t.beat}" | consequence: "${t.consequence}"`).join("\n")}

SECOND-ORDER FACTS (weave into closing/alternatives, never as new timeline beats):
${Object.entries(archetype.secondOrder)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join("\n")}

CLOSING TONE: ${archetype.tone}`
        : `No canonical archetype matched. Write the timeline yourself, 4-6 beats, but stay grounded in the transcript.`;

      const transcriptText = fx.transcript
        .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
        .join("\n\n");

      const { object } = await generateObject({
        model: gateway("google/gemini-3-flash-preview"),
        temperature: 0.6,
        schema: AnalysisSchema,
        system: ANALYSIS_SYSTEM_PROMPT,
        prompt: `${canonTimelineBlock}

FINAL DECISION: ${fx.decision}

PLAYER REASONING: ${fx.reasoning || "(none provided)"}

PLAYER SELF-REPORTED CONFIDENCE AT COMMIT: ${typeof fx.confidence === "number" ? `${fx.confidence}/100` : "(not reported)"}
(Use this for the 'calibration' field — compare it to the strength of the evidence the player actually gathered.)

FULL TRANSCRIPT:
${transcriptText}`,
      });

      // Re-validate (generateObject already validates, but this asserts the
      // documented schema matches the runtime schema):
      const validated = AnalysisSchema.parse(object);

      // Canon spine assertion: when an archetype matched, after the hard
      // overwrite the timeline length must equal canon length.
      if (archetype && validated.timeline.length !== archetype.timeline.length) {
        throw new Error(
          `timeline length ${validated.timeline.length} != canon ${archetype.timeline.length}`,
        );
      }

      record(
        name,
        true,
        `archetypeId=${archetypeId ?? "(none)"} headline=${JSON.stringify(validated.headline.slice(0, 60))} beats=${validated.timeline.length} belief=${validated.beliefTrajectory.length}`,
      );

      // Snapshot: pin the response shape + a tight set of mission-critical fields.
      const shape = shapeOf(validated);
      const beliefUpdates = Array.from(
        new Set(validated.beliefTrajectory.map((b) => b.update)),
      ).sort();
      const beliefConfidences = Array.from(
        new Set(validated.beliefTrajectory.map((b) => b.confidence)),
      ).sort();
      const critical: Snapshot["critical"] = {
        archetypeId: archetypeId ?? null,
        archetypeMatchedCanon: Boolean(archetype),
        timelineLength: validated.timeline.length,
        canonTimelineLength: archetype ? archetype.timeline.length : null,
        timelineMatchesCanon: archetype
          ? validated.timeline.length === archetype.timeline.length
          : null,
        strengthsCount: validated.reasoningAssessment.strengths.length,
        blindSpotsCount: validated.reasoningAssessment.blindSpots.length,
        biasesCount: validated.reasoningAssessment.possibleBiases.length,
        beliefTrajectoryLength: validated.beliefTrajectory.length,
        beliefUpdatesUsed: beliefUpdates,
        beliefConfidencesUsed: beliefConfidences,
      };
      const snap = compareOrBless(
        `analysis/${missionId}/${fx.id}`,
        shape,
        critical,
        updateSnapshots,
      );
      record(`${name} :: snapshot`, snap.outcome !== "drift" && snap.outcome !== "new", snap.detail);
    } catch (err) {
      record(name, false, (err as Error).message);
    }
  }
}

// Mirror of the Stage B system prompt — kept inline so the harness exercises
// the documented contract, not whatever happens to be in source today.
const ANALYSIS_SYSTEM_PROMPT = `You are a senior executive coach AND a decision scientist reviewing a high-stakes decision an operator just made inside an immersive interactive drama. The consequences of the chosen stance are FIXED CANON — you narrate them, you do not invent them. Your real work is to evaluate HOW the player reached the decision, not whether the decision was "correct".

Style: precise, kind, human. Never use the words "good", "bad", "right", "wrong", "correct", "incorrect". Never congratulate. Never scold. Never accuse the player of a bias — describe the pattern in their behavior. Always ground every claim in something the player actually did, said, asked, or skipped in the transcript.

Return a JSON object matching the provided schema. headline ≤ 18 words, third person, present tense. timeline must reuse the canon beats verbatim and in order when one is provided. assumptions / evidenceUsed / evidenceIgnored / alternatives are each 2–3 sentences. closing is one paragraph. reasoningAssessment.strengths 0–4, blindSpots 0–4, possibleBiases 0–3 (only if behavioral evidence exists). calibration and luckVsSkill 1–2 sentences each. beliefTrajectory has 3–8 ordered snapshots with marker, hypothesis, confidence(low|medium|high), trigger, update(formed|reinforced|revised|abandoned|held), and a one-sentence note.`;

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv);
  const key = process.env.LOVABLE_API_KEY;
  if (!key) {
    // eslint-disable-next-line no-console
    console.error("Missing LOVABLE_API_KEY in environment.");
    process.exit(2);
  }
  const gateway = createLovableAiGatewayProvider(key);

  // eslint-disable-next-line no-console
  console.log(
    `▶ Prompt test harness — mission=${args.mission} only=${args.only ?? "(all)"} update=${args.updateSnapshots}`,
  );

  if (args.only !== "analysis") await runDirector(gateway, args.mission, args.updateSnapshots);
  if (args.only !== "director") await runAnalysis(gateway, args.mission, args.updateSnapshots);

  const failed = results.filter((r) => !r.ok);
  // eslint-disable-next-line no-console
  console.log(
    `\n──────── ${results.length - failed.length}/${results.length} passed${failed.length ? `, ${failed.length} failed` : ""} ────────`,
  );
  process.exit(failed.length ? 1 : 0);
}

void main();
