import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { getMissionEngine } from "@/lib/missions/registry";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ChatRequestBody = { messages?: unknown; missionId?: unknown };

const DEFAULT_MISSION_ID = "mission-01";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, missionId } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const resolvedMissionId =
          typeof missionId === "string" && missionId.length > 0
            ? missionId
            : DEFAULT_MISSION_ID;
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
