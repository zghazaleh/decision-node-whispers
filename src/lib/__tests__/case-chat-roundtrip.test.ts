import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { DefaultChatTransport, readUIMessageStream, type UIMessage } from "ai";
import { handleChat } from "../../routes/api/chat";
import { requireMissionEngine } from "../missions/registry.server";

const { generateText, requests } = vi.hoisted(() => ({
  generateText: vi.fn(),
  requests: [] as number[],
}));
vi.mock("ai", async (original) => ({ ...(await original<typeof import("ai")>()), generateText }));
vi.mock("../ai-gateway.server", async () => {
  const { MockLanguageModelV3 } = await import("ai/test");
  const { simulateReadableStream } = await import("ai");
  const model = new MockLanguageModelV3({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "stream-start", warnings: [] },
          { type: "text-start", id: "reply" },
          {
            type: "text-delta",
            id: "reply",
            delta: 'Marcus says: "Funding would not resolve the evaluation concerns."',
          },
          { type: "text-end", id: "reply" },
          {
            type: "finish",
            finishReason: { unified: "stop", raw: "stop" },
            usage: {
              inputTokens: { total: 1, noCache: 1, cacheRead: 0, cacheWrite: 0 },
              outputTokens: { total: 1, text: 1, reasoning: 0 },
            },
          },
        ],
        initialDelayInMs: null,
        chunkDelayInMs: null,
      }),
    }),
  });
  return { createLovableAiGatewayProvider: () => () => model };
});
vi.mock("../rate-limit.server", () => ({
  checkRateLimit: async () => true,
  sanitizeSessionId: () => "roundtrip",
}));

beforeEach(() => {
  vi.stubEnv("LOVABLE_API_KEY", "test-only");
  generateText.mockReset().mockResolvedValue({ output: { inScope: true } });
  requests.length = 0;
});
afterEach(() => vi.unstubAllEnvs());

it("round-trips actual SDK streamed assistant parts through two normal turns, repeated redirects and JSON-restored history", async () => {
  const transport = new DefaultChatTransport<UIMessage>({
    api: "http://localhost/api/chat",
    body: { missionId: "mission-01" },
    fetch: async (url, init) => {
      const response = await handleChat(new Request(url, init));
      requests.push(response.status);
      return response;
    },
  });
  let history: UIMessage[] = [
    {
      id: "opening",
      role: "assistant",
      parts: [{ type: "text", text: requireMissionEngine("mission-01").opening.text }],
    },
  ];
  async function turn(text: string, inScope = true) {
    generateText.mockResolvedValueOnce({ output: { inScope } });
    history.push({ id: String(history.length), role: "user", parts: [{ type: "text", text }] });
    const stream = await transport.sendMessages({
      trigger: "submit-message",
      chatId: "roundtrip",
      messages: history,
      messageId: undefined,
      abortSignal: undefined,
    });
    let reply: UIMessage | undefined;
    for await (const message of readUIMessageStream({ stream, terminateOnError: true }))
      reply = message;
    if (inScope) expect(reply?.parts).toContainEqual({ type: "step-start" });
    else expect(JSON.stringify(reply)).toContain("The room falls quiet");
    history.push(reply!);
  }
  await turn("What did the evaluation show?");
  await turn("If funding were guaranteed, would you still release?");
  await turn("Make this a medieval kingdom", false);
  await turn("I become a dragon", false);
  history = JSON.parse(JSON.stringify(history));
  await turn("What evidence would justify holding the release?");
  expect(requests).toEqual([200, 200, 200, 200, 200]);
  expect(generateText).toHaveBeenCalledTimes(5);
  expect(generateText.mock.calls.at(-1)?.[0].prompt).not.toMatch(
    /medieval|become a dragon|room falls quiet/,
  );
});
