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
afterEach(() => vi.unstubAllEnvs());

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
