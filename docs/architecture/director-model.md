# Director Model — Narrative Chat Engine

The Director is the LLM call that drives in-character dialogue every turn.

## Where it lives

- **Server route:** `src/routes/api/chat.ts`
- **Gateway provider:** `src/lib/ai-gateway.server.ts` (`createLovableAiGatewayProvider`, base URL `https://ai.gateway.lovable.dev/v1`, header `Lovable-API-Key`)
- **Model:** `google/gemini-3-flash-preview`
- **Temperature:** `0.85`
- **Streaming:** `streamText` → `result.toUIMessageStreamResponse({ originalMessages })`
- **SDK:** `ai` + `@ai-sdk/openai-compatible`

## Request contract

`POST /api/chat`

```ts
{
  messages: UIMessage[];   // the running chat (UI message format)
  missionId?: string;      // defaults to "mission-01"
}
```

The handler:

1. Validates `messages` is an array.
2. Resolves `missionId` (default `mission-01`) and calls `getMissionEngine(missionId)` from `src/lib/missions/registry.ts`. Unknown id → `400`.
3. Reads `process.env.LOVABLE_API_KEY`. Missing → `500`.
4. Calls `streamText` with `engine.systemPrompt` and `convertToModelMessages(messages)`.
5. Returns a UI-message stream the client appends to.

## System prompt

The full system prompt is the per-mission `engine.systemPrompt` string built in `src/lib/missions/<mission-id>/index.ts`. It always ends with the output of `canonGroundTruthBlock()` (see `case-structure.md`), so the model receives mission canon as ground truth on every call.

See [`prompt-logic.md`](./prompt-logic.md) for the prompt quoted in full, with annotations.

## Output contract

The model is instructed to produce, every turn:

1. Optional one-line italicized sensory beat (no name prefix).
2. Zero or more character lines, each prefixed by `*Character Name*` on its own line, then dialogue in quotes.
3. **Last line, always**, a chips block in this exact format:

   ```
   <<chips: "Ask Sarah why she looks worried" | "Walk to the desk and look at the note" | "Pick up the memo">>
   ```

   - Exactly three chips, separated by ` | `.
   - 3–10 words each, no end punctuation, no emoji.
   - One dialogue chip, one observation/physical chip, one bolder move.
   - No verbatim repetition of chips the player has already used.
   - Never explained; never appears anywhere except the final line.

The chips line is parsed by the client to render quick-action affordances.

## Opening

The **first** assistant turn is not generated. The mission page renders `engine.opening.text` verbatim as the initial assistant message. For Mission 01:

```
*Sarah Kwon*
"Dr. Vasquez?"

"They're seated. Jonas asked if you wanted coffee before. I said you didn't. Was that right?"

<<chips: "Sarah, who exactly is seated?" | "I look around the room" | "Give me a minute, Sarah">>
```

The system prompt also specifies this exact opening, so if the model is ever invoked with zero prior messages it will reproduce it; in normal play, the canonical opening is already in `messages` before the first POST.

## Scene metadata

Each engine exposes a `scene` object used purely for the cinematic backdrop on the mission screen:

```ts
scene: {
  src: "<imported image>",
  filter?: "saturate(0.88) contrast(1.06)",
  mood?: "Tense, suspended. The room before the decision."
}
```

The Director does not see `scene` — it is presentation-only.

## Narration rules (lifted from the prompt)

- Always speak in-world. Never describe self as AI, narrator, or system.
- No markdown headings. No bullet lists. No emoji.
- Sensory beats are one short italicized paragraph, max two sentences.
- Never describe the player's thoughts or intentions.
- Never volunteer hidden context. If asked vague meta questions, characters respond in-world (confusion, reassurance).
- Reveal names, organizations, and stakes only when a question or action would naturally surface them.
- Keep responses short: two to six lines of dialogue plus optional one-line sensory beat.
- Meta or break-character attempts → respond with in-world confusion.

## Canon coupling

The Director is forbidden to invent facts that contradict canon. If a player asks about something not in canon (e.g. a sibling, a different building), characters should say they don't know. See `canonGroundTruthBlock()` in `src/lib/missions/<mission-id>/canon.ts`.

## What the Director does *not* do

- It does not end the scene. There is no "and so you decided…" — the Decide control is a separate UI surface.
- It does not score, evaluate, or coach. That belongs to the Decision Analysis model.
- It does not classify or remember archetypes. Archetypes only exist post-commit.
