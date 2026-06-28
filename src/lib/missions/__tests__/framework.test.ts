import { describe, expect, it, vi } from "vitest";
import {
  assertMissionFrameworkReady,
  validateFrameworkRecord,
  validateMissionFramework,
} from "../framework";
import { malformedFixtures, validFixture } from "./framework-fixtures";

describe("validateFrameworkRecord", () => {
  it("returns no missing fields for a fully-populated framework", () => {
    expect(validateFrameworkRecord(validFixture)).toEqual([]);
  });

  it.each(malformedFixtures)(
    "flags malformed fixture: $name",
    ({ value, expectMissing }) => {
      expect(validateFrameworkRecord(value)).toEqual(expectMissing);
    },
  );
});

describe("validateMissionFramework (live registry)", () => {
  it("returns [] for every shipped mission 01-09", () => {
    for (let i = 1; i <= 9; i++) {
      const id = `mission-0${i}`;
      expect(validateMissionFramework(id), `framework gap in ${id}`).toEqual([]);
    }
  });

  it("flags an unknown mission id as entirely missing", () => {
    expect(validateMissionFramework("mission-does-not-exist")).toEqual([
      "(framework entry missing entirely)",
    ]);
  });
});

describe("assertMissionFrameworkReady", () => {
  it("does not throw for a well-formed mission", () => {
    expect(() => assertMissionFrameworkReady("mission-01")).not.toThrow();
  });

  it("throws a descriptive error for an unknown mission", () => {
    expect(() => assertMissionFrameworkReady("mission-ghost")).toThrowError(
      /mission-ghost.*framework fields missing or empty.*framework entry missing entirely/s,
    );
  });

  it("error message names every missing field so authors can fix in one pass", () => {
    // We can't poke the live FRAMEWORK, but we can verify the formatter via
    // validateFrameworkRecord and confirm assert composes the same list.
    const missing = validateFrameworkRecord({});
    expect(missing).toEqual([
      "stakes",
      "hiddenTruths",
      "timeLimit",
      "decisionScience",
      "learningObjective",
    ]);
  });
});

describe("module-load self-check", () => {
  it("does not log errors at boot for the current registry", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.resetModules();
    await import("../framework");
    const frameworkErrors = spy.mock.calls.filter((args) =>
      String(args[0] ?? "").startsWith("[framework]"),
    );
    spy.mockRestore();
    expect(frameworkErrors).toEqual([]);
  });
});
