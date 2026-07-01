import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { checkRateLimit, sanitizeSessionId } from "@/lib/rate-limit.server";

type ChatRequestBody = { messages?: unknown; missionId?: unknown };

const DEFAULT_MISSION_ID = "mission-01";
const MAX_MESSAGES = 60;
const MAX_MESSAGE_CHARS = 4000;

function messageTextLength(m: UIMessage): number {
  if (!m || typeof m !== "object") return 0;
  const parts = (m as { parts?: Array<{ type?: string; text?: string }> }).parts;
  if (!Array.isArray(parts)) return 0;
  let n = 0;
  for (const p of parts) {
    if (p && p.type === "text" && typeof p.text === "string") n += p.text.length;
  }
  return n;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: ChatRequestBody;
        try {
          body = (await request.json()) as ChatRequestBody;
        } catch {
          return new Response("Invalid JSON body", { status: 400 });
        }

        const { messages, missionId } = body;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        if (messages.length > MAX_MESSAGES) {
          return new Response(`Too many messages (max ${MAX_MESSAGES})`, { status: 400 });
        }
        for (const m of messages as UIMessage[]) {
          if (messageTextLength(m) > MAX_MESSAGE_CHARS) {
            return new Response(
              `A single message exceeds ${MAX_MESSAGE_CHARS} chars`,
              { status: 400 },
            );
          }
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
          typeof missionId === "string" && missionId.length > 0
            ? missionId
            : DEFAULT_MISSION_ID;
        const { getMissionEngine } = await import("@/lib/missions/registry.server");
        const engine = getMissionEngine(resolvedMissionId);
        if (!engine) {
          return new Response(`Unknown mission: ${resolvedMissionId}`, { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: engine.systemPrompt,
          messages: await convertToModelMessages(messages as UIMessage[]),
          temperature: 0.85,
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
