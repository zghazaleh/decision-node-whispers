import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof Blob) || file.size < 1024) {
          return new Response("Empty or missing audio", { status: 400 });
        }
        if (file.size > 25 * 1024 * 1024) {
          return new Response("Audio too large (max 25MB)", { status: 413 });
        }

        const upstream = new FormData();
        upstream.append("model", "openai/gpt-4o-mini-transcribe");
        upstream.append("file", file, "recording.wav");

        const res = await fetch(
          "https://ai.gateway.lovable.dev/v1/audio/transcriptions",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${key}` },
            body: upstream,
          },
        );

        const body = await res.text();
        return new Response(body, {
          status: res.status,
          headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
        });
      },
    },
  },
});
