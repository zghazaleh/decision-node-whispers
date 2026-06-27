/**
 * Runtime validation for mission engine modules.
 *
 * Each mission module must export a complete canon and a complete outcomes
 * set. We validate the assembled MissionEngine at registration time so a
 * malformed mission fails loudly with a precise field list, rather than
 * crashing deep inside the analyzer or chat route.
 */

import { z } from "zod";
import type { MissionEngine } from "./types";

const NonEmpty = z.string().trim().min(1, "must be a non-empty string");

const ArchetypeBeatSchema = z.object({
  beat: NonEmpty,
  consequence: NonEmpty,
});

const ArchetypeSchema = z.object({
  id: NonEmpty,
  label: NonEmpty,
  matchHints: z.array(NonEmpty).min(1, "needs at least one matchHint"),
  timeline: z.array(ArchetypeBeatSchema).min(1, "needs at least one beat"),
  secondOrder: z.record(z.string(), NonEmpty).refine(
    (r) => Object.keys(r).length >= 1,
    { message: "secondOrder must have at least one entry" },
  ),
  tone: NonEmpty,
});

const DecisionPresetSchema = z.object({
  label: NonEmpty,
  text: NonEmpty,
  archetypeId: NonEmpty,
});

/**
 * Canon is mission-specific in shape, but every mission must export *something*
 * non-trivial as canonical ground truth. We require an object with at least
 * one populated top-level field so an empty `{}` is rejected.
 */
const CanonSchema = z
  .record(z.string(), z.unknown())
  .refine((c) => Object.keys(c).length >= 1, {
    message: "canon must export at least one ground-truth field",
  });

const MissionEngineSchema = z.object({
  id: NonEmpty,
  systemPrompt: NonEmpty,
  opening: z.object({ text: NonEmpty }),
  archetypes: z.record(z.string(), ArchetypeSchema).refine(
    (a) => Object.keys(a).length >= 1,
    { message: "engine must define at least one archetype" },
  ),
  archetypeIds: z.array(NonEmpty).min(1, "archetypeIds must not be empty"),
  archetypeMenuForClassifier: z.function(),
  getArchetype: z.function(),
  decisionPresets: z.array(DecisionPresetSchema).min(1, "needs at least one decisionPreset"),
  canon: CanonSchema,
});

export type MissionEngineValidationError = {
  path: string;
  message: string;
};

export type MissionEngineValidationResult =
  | { ok: true }
  | { ok: false; errors: MissionEngineValidationError[] };

export function validateMissionEngine(engine: unknown): MissionEngineValidationResult {
  const parsed = MissionEngineSchema.safeParse(engine);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => ({
        path: i.path.length ? i.path.join(".") : "(root)",
        message: i.message,
      })),
    };
  }

  // Cross-field checks the schema can't express on its own.
  const e = parsed.data as unknown as MissionEngine & { canon: unknown };
  const errors: MissionEngineValidationError[] = [];

  for (const id of e.archetypeIds) {
    if (!e.archetypes[id]) {
      errors.push({
        path: `archetypeIds`,
        message: `archetypeIds references "${id}" but no matching entry in archetypes`,
      });
    }
  }

  for (const [key, arche] of Object.entries(e.archetypes)) {
    if (arche.id !== key) {
      errors.push({
        path: `archetypes.${key}.id`,
        message: `archetype key "${key}" does not match its id "${arche.id}"`,
      });
    }
  }

  e.decisionPresets.forEach((p, idx) => {
    if (!e.archetypes[p.archetypeId]) {
      errors.push({
        path: `decisionPresets[${idx}].archetypeId`,
        message: `preset "${p.label}" references unknown archetypeId "${p.archetypeId}"`,
      });
    }
  });

  return errors.length ? { ok: false, errors } : { ok: true };
}

export function formatMissionEngineErrors(
  missionId: string,
  errors: MissionEngineValidationError[],
): string {
  const lines = errors.map((e) => `  • ${e.path}: ${e.message}`);
  return `Mission engine "${missionId}" failed validation:\n${lines.join("\n")}`;
}
