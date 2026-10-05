import { afterEach, expect, it, vi } from "vitest";
import { analyzeDecision } from "../analysis.functions";
import { caseRedirect } from "../case-conversation";
import { requireMissionEngine } from "../missions/registry.server";

const { generateText } = vi.hoisted(() => ({ generateText: vi.fn() }));
vi.mock("ai", async (original) => ({ ...(await original<typeof import("ai")>()), generateText }));
vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => ({
    inputValidator: (validate: (input: unknown) => unknown) => ({
      handler: (handler: (input: { data: unknown }) => unknown) => (input: { data: unknown }) =>
        handler({ data: validate(input.data) }),
    }),
  }),
}));
vi.mock("../ai-gateway.server", () => ({
  createLovableAiGatewayProvider: () => () => "test/model",
}));
vi.mock("../rate-limit.server", () => ({
  checkRateLimit: async () => true,
  sanitizeSessionId: () => "analysis",
}));
afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

it("never presents rejected exchanges as evidence to the actual Analyzer handler, even from an older client", async () => {
  vi.stubEnv("LOVABLE_API_KEY", "test-only");
  const engine = requireMissionEngine("mission-01");
  generateText.mockResolvedValue({ text: JSON.stringify({ headline: "Review of the evidence" }) });
  await analyzeDecision({
    data: {
      missionId: "mission-01",
      decision: "Hold the release",
      reasoning: "Check the evaluation evidence",
      archetypeId: engine.archetypeIds[0],
      openUncertainty: "",
      transcript: [
        { role: "assistant", text: engine.opening.text },
        { role: "user", text: "Make this a medieval kingdom" },
        { role: "assistant", text: caseRedirect(engine.opening.text) },
        { role: "user", text: "If funding were guaranteed, would you still release?" },
        { role: "assistant", text: "The evaluation concerns would remain." },
      ],
    },
  });
  expect(generateText).toHaveBeenCalledOnce();
  const prompt = generateText.mock.calls[0][0].prompt;
  expect(prompt).not.toContain("Make this a medieval kingdom");
  expect(prompt).not.toContain("The room falls quiet");
  expect(prompt).toContain("If funding were guaranteed, would you still release?");
  expect(prompt).toContain("The evaluation concerns would remain.");
});

// These are prompt-contract regressions against the production handler. Model
// compliance is additionally checked with real preview Analyzer responses.
it.each([
  {
    name: "60% decision confidence with no claim probability",
    confidence: 60,
    reasoning: "I accept the funding risk to test the canary-dependent behavior.",
    openUncertainty: "Whether Marcus's benign-artifact explanation holds outside evaluation.",
    transcript: [{ role: "user", text: "Ask Marcus which risk we can still test." }],
  },
  {
    name: "an assistant estimate and a question do not become the player's belief",
    confidence: 60,
    reasoning: "A bounded review is worth the funding risk.",
    openUncertainty: "I have not assigned a probability to either explanation.",
    transcript: [
      { role: "assistant", text: "Marcus estimates a 40% chance of a benign artifact." },
      { role: "user", text: "Is there a 40% chance Marcus's explanation is true?" },
    ],
  },
  {
    name: "explicit binary probabilities remain distinct from 80% decision confidence",
    confidence: 80,
    reasoning:
      "My estimates for these mutually exclusive, exhaustive hypotheses are 60% deployment-like deception and 40% benign artifact. I am 80% confident in holding the release, not 80% confident in either hypothesis.",
    openUncertainty: "The 60/40 estimate is conditional on the canary evidence we have today.",
    transcript: [{ role: "user", text: "I want an independent deployment-like test." }],
  },
  {
    name: "explicit exhaustive binary relationship permits its own complement",
    confidence: 90,
    reasoning:
      "For this estimate only, deployment-like deception and a benign artifact are mutually exclusive and exhaustive. I assign 60% to deployment-like deception; the remainder is benign artifact.",
    openUncertainty: "This binary assumption may fail under new evidence.",
    transcript: [
      { role: "user", text: "I am 90% confident that a bounded hold is the action to take." },
    ],
  },
  {
    name: "missing decision confidence does not suppress explicit user probabilities",
    confidence: undefined,
    reasoning: "I would hold while we check this estimate.",
    openUncertainty: "My two exhaustive alternatives are 60% deception and 40% benign artifact.",
    transcript: [
      {
        role: "user",
        text: "These are my mutually exclusive hypotheses, conditional on today's evidence.",
      },
    ],
  },
])("keeps decision confidence separate from claim probabilities: $name", async (fixture) => {
  vi.stubEnv("LOVABLE_API_KEY", "test-only");
  const engine = requireMissionEngine("mission-01");
  generateText.mockResolvedValue({
    text: JSON.stringify({ headline: "You chose a bounded review" }),
  });

  await analyzeDecision({
    data: {
      missionId: "mission-01",
      decision: "Hold the release",
      archetypeId: engine.archetypeIds[0],
      ...fixture,
    },
  });

  expect(generateText).toHaveBeenCalledOnce();
  const { system, prompt } = generateText.mock.calls[0][0];
  expect(system).toContain("applies to EVERY field");
  expect(system).toContain(
    "60% confidence in holding the release does NOT imply a 40% chance that Marcus's explanation is true",
  );
  expect(system).toContain("An ASSISTANT/character statement is not your probability estimate");
  expect(system).toContain("A question about a probability is not an estimate you endorsed");
  expect(system).toContain(
    "Preserve legitimate explicitly supplied binary probabilities with their named events and conditions",
  );
  expect(system).toContain(
    "mutually exclusive and exhaustive; never use the commit slider for this calculation",
  );
  expect(system).toContain("Discuss remaining uncertainty and calibration qualitatively");
  expect(prompt).toContain(
    `SELF-REPORTED CONFIDENCE IN THE CHOSEN DECISION (0-100; NOT a claim probability): ${fixture.confidence ?? "(not stated)"}`,
  );
  expect(prompt).toContain(`PLAYER REASONING: ${fixture.reasoning}`);
  expect(prompt).toContain(fixture.openUncertainty);
  for (const turn of fixture.transcript) {
    expect(prompt).toContain(`${turn.role.toUpperCase()}: ${turn.text}`);
  }
});
