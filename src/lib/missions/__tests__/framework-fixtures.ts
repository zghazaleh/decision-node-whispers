/**
 * Fixture missions for framework validation tests.
 *
 * Each fixture is a *candidate* MissionFramework value: some valid, some
 * deliberately malformed. They feed `validateFrameworkRecord` directly so we
 * never touch the live FRAMEWORK registry from tests.
 */

import type { MissionFramework } from "../framework";

export const validFixture: MissionFramework = {
  stakes: ["Lives on the line.", "Career exposure for you."],
  hiddenTruths: ["The memo on the desk is unopened."],
  timeLimit: "Decision must land in 12 minutes.",
  decisionScience: [
    "Sunk cost: years of work pull toward shipping.",
    "Authority bias: the senior signoff substitutes for reading the memo.",
  ],
  learningObjective: "Practice updating on disconfirming evidence under time pressure.",
};

export const malformedFixtures: Array<{
  name: string;
  value: unknown;
  expectMissing: string[];
}> = [
  {
    name: "entirely missing",
    value: undefined,
    expectMissing: ["(framework entry missing entirely)"],
  },
  {
    name: "null entry",
    value: null,
    expectMissing: ["(framework entry missing entirely)"],
  },
  {
    name: "non-object (string)",
    value: "oops",
    expectMissing: ["(framework entry is not an object)"],
  },
  {
    name: "empty object",
    value: {},
    expectMissing: [
      "stakes",
      "hiddenTruths",
      "timeLimit",
      "decisionScience",
      "learningObjective",
    ],
  },
  {
    name: "stakes is empty array",
    value: { ...validFixture, stakes: [] },
    expectMissing: ["stakes"],
  },
  {
    name: "stakes contains whitespace-only entry",
    value: { ...validFixture, stakes: ["  "] },
    expectMissing: ["stakes"],
  },
  {
    name: "hiddenTruths contains non-string",
    value: { ...validFixture, hiddenTruths: [42] },
    expectMissing: ["hiddenTruths"],
  },
  {
    name: "timeLimit empty string",
    value: { ...validFixture, timeLimit: "   " },
    expectMissing: ["timeLimit"],
  },
  {
    name: "timeLimit wrong type",
    value: { ...validFixture, timeLimit: 600 },
    expectMissing: ["timeLimit"],
  },
  {
    name: "decisionScience missing",
    value: { ...validFixture, decisionScience: undefined },
    expectMissing: ["decisionScience"],
  },
  {
    name: "learningObjective empty",
    value: { ...validFixture, learningObjective: "" },
    expectMissing: ["learningObjective"],
  },
  {
    name: "multiple fields invalid at once",
    value: {
      stakes: [],
      hiddenTruths: ["ok"],
      timeLimit: "",
      decisionScience: [],
      learningObjective: "ok",
    },
    expectMissing: ["stakes", "timeLimit", "decisionScience"],
  },
];
