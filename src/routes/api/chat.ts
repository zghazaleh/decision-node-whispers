import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  validateUIMessages,
  type UIMessage,
} from "ai";
import { caseRedirect, isCaseRequest, withoutRedirectedTurns } from "@/lib/case-scope.server";
import { checkRateLimit, sanitizeSessionId } from "@/lib/rate-limit.server";

type ChatRequestBody = { messages?: unknown; missionId?: unknown };

const DEFAULT_MISSION_ID = "mission-01";
const MAX_MESSAGES = 60;
const MAX_MESSAGE_CHARS = 4000;

export async function handleChat(request: Request): Promise<Response> {
  let body: ChatRequestBody;
  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!body || typeof body !== "object") return new Response("Invalid JSON body", { status: 400 });
  const { messages, missionId } = body;
  if (!Array.isArray(messages)) {
    return new Response("Messages are required", { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return new Response(`Too many messages (max ${MAX_MESSAGES})`, { status: 400 });
  }
  // Text is the only player input. Ordinary SDK assistant replies also carry
  // step/reasoning/source parts; validate those, then omit them from model input.
  const assistantParts = new Set([
    "text",
    "step-start",
    "reasoning",
    "source-url",
    "source-document",
  ]);
  for (const m of messages) {
    if (
      !m ||
      (m.role !== "user" && m.role !== "assistant") ||
      !Array.isArray(m.parts) ||
      m.parts.length > 100 ||
      m.parts.some(
        (part: { type?: string } | null) =>
          !part ||
          (m.role === "user" ? part.type !== "text" : !assistantParts.has(part.type ?? "")),
      )
    )
      return new Response("Invalid conversation message", { status: 400 });
    const length = m.parts.reduce(
      (total: number, part: { text?: unknown }) =>
        total + (typeof part.text === "string" ? part.text.length : 0),
      0,
    );
    if (length > MAX_MESSAGE_CHARS) {
      return new Response(`A single message exceeds ${MAX_MESSAGE_CHARS} chars`, { status: 400 });
    }
  }
  let validated: UIMessage[];
  try {
    validated = await validateUIMessages({ messages });
  } catch {
    return new Response("Invalid conversation message", { status: 400 });
  }
  const conversation = validated.map((message) => ({
    id: message.id,
    role: message.role,
    parts: message.parts
      .filter((part) => part.type === "text")
      .map((part) => ({ type: "text" as const, text: part.text })),
  }));
  if (
    conversation.at(-1)?.role !== "user" ||
    !conversation.at(-1)?.parts.some((part) => part.text.trim())
  ) {
    return new Response("A player request is required", { status: 400 });
  }

  // Per-session rate limit: 40 messages / 20 minutes. The pressure meter
  // saturates around 18 turns, so a genuine player sits well under this.
  const sessionId = sanitizeSessionId(request.headers.get("x-dn-session"));
  const ok = await checkRateLimit(`chat:${sessionId}`, 40, 20 * 60);
  if (!ok) {
    return new Response("Rate limit exceeded. Slow down and try again shortly.", {
      status: 429,
    });
  }

  const resolvedMissionId =
    typeof missionId === "string" && missionId.length > 0 ? missionId : DEFAULT_MISSION_ID;
  const { getMissionEngine } = await import("@/lib/missions/registry.server");
  const engine = getMissionEngine(resolvedMissionId);
  if (!engine) {
    return new Response(`Unknown mission: ${resolvedMissionId}`, { status: 400 });
  }

  const key = process.env.LOVABLE_API_KEY;
  if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

  const gateway = createLovableAiGatewayProvider(key);
  const model = gateway("google/gemini-3-flash-preview");
  const redirect = caseRedirect(engine.opening.text);
  let inScope: boolean;
  try {
    inScope = await isCaseRequest(engine, conversation, model);
  } catch {
    // Fail closed: a classifier outage must not send unchecked text to the Director.
    return new Response("The line dropped. Try again.", { status: 503 });
  }
  if (!inScope) {
    return createUIMessageStreamResponse({
      stream: createUIMessageStream({
        originalMessages: validated,
        execute: ({ writer }) => {
          writer.write({ type: "start" });
          writer.write({ type: "text-start", id: "case-redirect" });
          writer.write({ type: "text-delta", id: "case-redirect", delta: redirect });
          writer.write({ type: "text-end", id: "case-redirect" });
          writer.write({ type: "finish", finishReason: "stop" });
        },
      }),
    });
  }
  const result = streamText({
    model,
    system: engine.systemPrompt,
    messages: await convertToModelMessages(withoutRedirectedTurns(conversation, redirect)),
    temperature: 0.85,
  });

  return result.toUIMessageStreamResponse({
    originalMessages: validated,
  });
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: ({ request }) => handleChat(request),
    },
  },
});
