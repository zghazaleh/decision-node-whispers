import { createFileRoute } from "@tanstack/react-router";

// Temporary build-time helper: generates a mood track via ElevenLabs Music
// and returns raw MP3 bytes. Removed after the asset is uploaded.
export const Route = createFileRoute("/api/public/ambient-gen")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.ELEVENLABS_API_KEY;
        if (!key) return new Response("Missing ELEVENLABS_API_KEY", { status: 500 });
        const { prompt, duration_seconds } = (await request.json()) as {
          prompt: string;
          duration_seconds?: number;
        };
        const res = await fetch("https://api.elevenlabs.io/v1/music", {
          method: "POST",
          headers: { "xi-api-key": key, "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            music_length_ms: Math.round((duration_seconds ?? 90) * 1000),
          }),
        });
        if (!res.ok) {
          return new Response(await res.text(), { status: res.status });
        }
        return new Response(await res.arrayBuffer(), {
          headers: { "Content-Type": "audio/mpeg" },
        });
      },
    },
  },
});
