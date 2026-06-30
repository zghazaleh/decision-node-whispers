// Sound Studio — server-side ElevenLabs ambient generation. Used by the
// temporary /admin/sound diagnostic tool. Returns base64 MP3 so the client
// can preview, optionally persist to localStorage, and route through the
// existing override system without touching the project filesystem.

import { createServerFn } from "@tanstack/react-start";

type GenInput = {
  prompt: string;
  durationSeconds: number; // 1..22
};

export const generateAmbientBed = createServerFn({ method: "POST" })
  .inputValidator((input: GenInput) => {
    if (!input || typeof input.prompt !== "string" || input.prompt.trim().length < 3) {
      throw new Error("Prompt must be at least 3 characters.");
    }
    const dur = Number(input.durationSeconds);
    if (!Number.isFinite(dur) || dur < 1 || dur > 22) {
      throw new Error("durationSeconds must be between 1 and 22.");
    }
    return { prompt: input.prompt.trim(), durationSeconds: dur };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("ElevenLabs is not connected to this project.");

    const res = await fetch("https://api.elevenlabs.io/v1/sound-generation", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: data.prompt,
        duration_seconds: data.durationSeconds,
        prompt_influence: 0.6,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`ElevenLabs ${res.status}: ${body.slice(0, 400)}`);
    }

    const buf = await res.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");
    return {
      mimeType: "audio/mpeg",
      base64,
      size: buf.byteLength,
    };
  });
