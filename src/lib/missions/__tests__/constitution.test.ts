/**
 * Constitution-as-test.
 *
 * Encodes the non-negotiables from constitution/08-non-negotiables.md and
 * the Director rules from constitution/04-ai-director-philosophy.md as
 * machine checks across every registered mission. A new mission cannot
 * silently ship without honoring the spine of the product.
 *
 * Scope: anything statically inspectable from the mission engine + framework.
 * Runtime checks against live Director output live in scripts/prompt-test-harness.ts.
 */

import { describe, expect, it } from "vitest";
import { listMissionEngineIds, requireMissionEngine } from "../registry";
import { getMissionFramework, validateMissionFramework } from "../framework";
import { DIRECTOR_INVARIANTS } from "../director-invariants";

const CHIPS_TRAILER = /<<chips:\s*"[^"]+"\s*\|\s*"[^"]+"\s*\|\s*"[^"]+"\s*>>\s*$/;

// Vocabulary the Analyzer/Director must never use to grade the player. These
// also must not appear in a system prompt as instructions to say them.
// We allow these in the system prompt itself when used to *forbid* them.
const MORALIZING_WORDS = ["correct", "incorrect"] as const;

const missionIds = listMissionEngineIds();

describe("constitution: every registered mission", () => {
  it("has at least one mission registered", () => {
    expect(missionIds.length).toBeGreaterThan(0);
  });

  describe.each(missionIds)("%s", (id) => {
    const engine = requireMissionEngine(id);

    it("inherits the Director invariants block", () => {
      // The registry composes DIRECTOR_INVARIANTS into every system prompt.
      // A regression where a mission bypasses the registry would fail this.
      expect(engine.systemPrompt).toContain("DIRECTOR INVARIANTS");
      // Pin a stable identifying line from the invariants so re-ordering
      // the block doesn't silently lose a clause.
      expect(engine.systemPrompt).toContain(
        "Never describe the player's thoughts",
      );
    });

    it("opens with a valid chip trailer", () => {
      const opening = engine.opening.text.trim();
      expect(opening).toMatch(CHIPS_TRAILER);
    });

    it("has ≥2 archetypes with timelines and second-order facts", () => {
      const archetypes = Object.values(engine.archetypes);
      expect(archetypes.length).toBeGreaterThanOrEqual(2);
      for (const a of archetypes) {
        expect(a.timeline.length, `${a.id} timeline`).toBeGreaterThanOrEqual(3);
        expect(
          Object.keys(a.secondOrder).length,
          `${a.id} secondOrder`,
        ).toBeGreaterThanOrEqual(1);
      }
    });

    it("offers ≥2 decision presets, every preset wired to a real archetype", () => {
      expect(engine.decisionPresets.length).toBeGreaterThanOrEqual(2);
      for (const p of engine.decisionPresets) {
        expect(engine.archetypes[p.archetypeId], `${p.label}`).toBeDefined();
      }
    });

    it("has a fully populated Decision Nodes framework entry", () => {
      const missing = validateMissionFramework(id);
      expect(missing).toEqual([]);
    });

    it("does not surface its hidden truths in the opening (mystery before exposition)", () => {
      const fw = getMissionFramework(id);
      if (!fw) return;
      const opening = engine.opening.text.toLowerCase();
      // Cheap heuristic: any 5-word phrase pulled from a hiddenTruth that
      // appears verbatim in the opening is a leak. Skip very short truths.
      for (const truth of fw.hiddenTruths) {
        const words = truth.toLowerCase().split(/\s+/).filter(Boolean);
        if (words.length < 6) continue;
        const phrase = words.slice(2, 7).join(" ");
        expect(
          opening.includes(phrase),
          `mission ${id}: opening leaks hiddenTruth fragment "${phrase}"`,
        ).toBe(false);
      }
    });

    it("does not instruct the Director to grade with moralizing vocabulary", () => {
      const prompt = engine.systemPrompt;
      for (const word of MORALIZING_WORDS) {
        // The invariants block contains "never coach, score, evaluate"; we
        // only flag occurrences outside the invariants and forbidden-word
        // contexts. Match a literal "say correct" / "is incorrect" style.
        const re = new RegExp(`\\b(say|say that|is|are|was|were|the)\\s+${word}\\b`, "i");
        expect(
          re.test(prompt),
          `mission ${id} system prompt appears to grade with "${word}"`,
        ).toBe(false);
      }
    });
  });
});

describe("constitution: Director invariants block", () => {
  it("forbids out-of-character behavior, chips, markdown, and meta", () => {
    expect(DIRECTOR_INVARIANTS).toMatch(/never refer to yourself as an AI/i);
    expect(DIRECTOR_INVARIANTS).toMatch(/never describe the player's thoughts/i);
    expect(DIRECTOR_INVARIANTS).toMatch(/no markdown headings/i);
    expect(DIRECTOR_INVARIANTS).toMatch(/<<chips:/);
    expect(DIRECTOR_INVARIANTS).toMatch(/no countdown numbers/i);
  });
});
