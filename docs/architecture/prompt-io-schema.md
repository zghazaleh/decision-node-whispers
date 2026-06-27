# Prompt I/O Schemas

Exact request/response contracts for every LLM call the app makes. Sources: `src/routes/api/chat.ts`, `src/lib/analysis.functions.ts`, `src/lib/missions/types.ts`.

Provider: `https://ai.gateway.lovable.dev/v1` via `createLovableAiGatewayProvider` (`src/lib/ai-gateway.server.ts`). Auth header `Lovable-API-Key: $LOVABLE_API_KEY`. All three calls use model `google/gemini-3-flash-preview`.

---

## 1. Director — `POST /api/chat`

Streaming chat. AI SDK `streamText` → `toUIMessageStreamResponse`.

### HTTP request (client → route)

```ts
// body
{
  missionId?: string;     // defaults to "mission-01"
  messages: UIMessage[];  // AI SDK UI message array (full transcript so far)
}
```

`UIMessage` (from `ai`):
```ts
{
  id: string;
  role: "user" | "assistant" | "system";
  parts: Array<{ type: "text"; text: string } | ...>;
}
```

Validation: `Array.isArray(messages)` and `getMissionEngine(missionId) !== null`. Returns `400` otherwise; `500` if `LOVABLE_API_KEY` missing.

### Model input

```ts
streamText({
  model:        gateway("google/gemini-3-flash-preview"),
  temperature:  0.85,
  system:       engine.systemPrompt,   // mission prompt + canonGroundTruthBlock()
  messages:     convertToModelMessages(messages),  // full transcript
})
```

No tools, no structured output, no `stopWhen`.

### Model output

Free-form text stream. By prompt contract (`src/lib/missions/<id>/index.ts`):

- 2–6 lines of in-character prose, italic name prefix, optional one-line sensory beat.
- Final line is a chips trailer:
  ```
  <<chips: "label 1" | "label 2" | "label 3">>
  ```
  Always 3 chips, 3–10 words each, no end punctuation, no emoji.

No JSON. The client parses chips via regex and renders the remaining text as the assistant turn.

### HTTP response

AI SDK UI message stream (`text/event-stream` framed via `toUIMessageStreamResponse`). Errors: `400` invalid body / unknown mission, `500` missing key, or upstream gateway status surfaced by the SDK.

---

## 2. Decision Analysis — `analyzeDecision` server function

Server function (`createServerFn({ method: "POST" })`). Two `generateObject` calls back-to-back: Stage A classifier (sometimes skipped), Stage B narrator.

### Server-function input (Zod)

```ts
AnalysisInput = z.object({
  missionId:   z.string().default("mission-01"),
  decision:    z.string().min(1),
  reasoning:   z.string().default(""),
  archetypeId: z.string().optional(),               // preset path: skip Stage A
  confidence:  z.number().min(0).max(100).optional(),  // self-reported at commit
  transcript:  z.array(z.object({
                 role: z.string(),
                 text: z.string(),
               })).min(1),
})
```

Errors: throws `Unknown mission: <id>` if registry miss, `Missing LOVABLE_API_KEY` if unset, or AI SDK gateway errors (e.g. 429/402) that propagate to the caller.

### Stage A — Classifier (skipped if `archetypeId` matches a registered archetype)

```ts
generateObject({
  model:       gateway("google/gemini-3-flash-preview"),
  temperature: 0.1,
  schema: z.object({
    archetypeId: z.enum(engine.archetypeIds),  // closed set per mission
    confidence:  z.number().min(0).max(1),
    rationale:   z.string(),
  }),
  system: `You classify a player's final decision in an interactive drama.

ARCHETYPES:
${engine.archetypeMenuForClassifier()}

Pick the single archetype that best matches the SUBSTANCE of the player's decision. Ignore reasoning quality; classify the action.`,
  prompt: `DECISION: ${decision}\n\nREASONING: ${reasoning || "(none)"}`,
})
```

`archetypeMenuForClassifier()` emits one line per archetype:
```
- <id>: <label>. Player phrases like: "<hint1>", "<hint2>", ...
```

Output use: only `archetypeId` is read downstream; `confidence` and `rationale` are forcing-functions for the model and discarded. On any thrown error: `archetypeId = null` and Stage B runs without a canon block.

### Stage B — Narrator

```ts
generateObject({
  model:       gateway("google/gemini-3-flash-preview"),
  temperature: 0.6,
  schema:      AnalysisSchema,  // see below
  system:      <coach + decision-scientist prompt, verbatim in analysis.functions.ts>,
  prompt: `${canonTimelineBlock}

FINAL DECISION: ${decision}

PLAYER REASONING: ${reasoning || "(none provided)"}

PLAYER SELF-REPORTED CONFIDENCE AT COMMIT: ${confidence != null ? `${confidence}/100` : "(not reported)"}
(Use this for the 'calibration' field — compare it to the strength of the evidence the player actually gathered.)

FULL TRANSCRIPT:
${transcript.map(m => `${m.role.toUpperCase()}: ${m.text}`).join("\n\n")}`,
})
```

`canonTimelineBlock` when an archetype matched:
```
CANON CONSEQUENCE TIMELINE — these beats are GROUND TRUTH. Use them verbatim for the 'timeline' field, in this exact order. You may NOT add, drop, reorder, or invent beats.

1. beat: "<beat>" | consequence: "<consequence>"
2. ...

SECOND-ORDER FACTS (weave into closing/alternatives, never as new timeline beats):
- <pillar>: <consequence>
...

CLOSING TONE: <tone>
```

When no archetype matched: `"No canonical archetype matched. Write the timeline yourself, 4-6 beats, but stay grounded in the transcript."`

### AnalysisSchema (Stage B output)

```ts
AnalysisSchema = z.object({
  headline:        z.string(),                    // ≤18 words, third person, present tense
  archetypeId?:    z.string(),                    // stamped server-side, not by model
  archetypeLabel?: z.string(),                    // stamped server-side, not by model
  timeline: z.array(z.object({                    // OVERWRITTEN with canon when archetype matched
    beat:        z.string(),
    consequence: z.string(),
  })),
  assumptions:     z.string(),                    // 2–3 sentences
  evidenceUsed:    z.string(),                    // 2–3 sentences
  evidenceIgnored: z.string(),                    // 2–3 sentences
  alternatives:    z.string(),                    // 2–3 sentences
  closing:         z.string(),                    // one paragraph, lands in archetype.tone
  reasoningAssessment: z.object({
    summary: z.string(),                          // one paragraph
    strengths: z.array(z.object({                 // 0–4
      behavior: z.string(),
      evidence: z.string(),
    })).max(4),
    blindSpots: z.array(z.object({                // 0–4
      pattern:       z.string(),
      evidence:      z.string(),
      gentleReframe: z.string(),
    })).max(4),
    possibleBiases: z.array(z.object({            // 0–3, only with behavioral evidence
      name:               z.string(),
      evidence:           z.string(),
      gentleExplanation:  z.string(),
    })).max(3),
    calibration: z.string(),                      // 1–2 sentences
    luckVsSkill: z.string(),                      // 1–2 sentences
  }),
  beliefTrajectory: z.array(z.object({            // 3–8 ordered snapshots
    marker:     z.string(),                       // e.g. "After reading the memo"
    hypothesis: z.string(),
    confidence: z.enum(["low", "medium", "high"]),
    trigger:    z.string(),
    update:     z.enum(["formed", "reinforced", "revised", "abandoned", "held"]),
    note:       z.string(),
  })).max(8),
})
```

### Hard server-side post-processing (after Stage B returns)

```ts
finalAnalysis = archetype
  ? {
      ...object,
      timeline:       archetype.timeline.map(t => ({ ...t })),  // overwrite verbatim
      archetypeId:    archetype.id,
      archetypeLabel: archetype.label,
    }
  : object;
```

The model can never alter the canon timeline or archetype labeling; both are stamped from the registered `MissionEngine` after generation.

### Server-function output

`DecisionAnalysis = z.infer<typeof AnalysisSchema>` (with `timeline`, `archetypeId`, `archetypeLabel` guaranteed when an archetype matched). Persisted to `localStorage` via `mission-store` and rendered by `/analysis`.
