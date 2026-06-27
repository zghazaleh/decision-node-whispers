# Director Spec — v1 (Future)

Target shape of the Director surface, independent of the current single-route, single-model implementation.

> **Status:** Future. Today's `/api/chat` partially satisfies this spec.

## 1. Responsibility

The Director is the only AI the player speaks to during a case. It owns:
- In-character dialogue.
- Sensory beats.
- The chips trailer on every turn.

It does not own: scoring, evaluation, classification, persistence, or moderation.

## 2. Interface

A pure streaming function:

```ts
director.stream({
  caseId:        string,
  caseVersion:   string,
  transcript:    Message[],     // platform UI message format
  systemPrompt:  string,        // resolved from the case bundle, canon block included
  options?: {
    temperature?: number,       // platform default applies
    abortSignal?: AbortSignal,
  },
}) → AsyncIterable<UIMessageDelta>
```

The signature is model-agnostic. The runtime is responsible for choosing a model, picking a provider, and handling retries.

## 3. Model abstraction

Today the runtime hard-codes one model. The spec requires:

- A `ModelDescriptor` per case (defaulted by the platform) — `{ provider, model, temperature, maxTokens? }`.
- A capabilities check — the runtime refuses cases whose Director descriptor requires capabilities the provider does not support.
- A fallback chain — at least one secondary descriptor per case. Fallback is invisible to the player.

## 4. System prompt assembly

The Director system prompt is assembled at request time from three pieces:

1. **Platform preamble** — chip protocol, narration rules, meta-resistance rules, forbidden vocabulary. Owned by the platform, identical across cases.
2. **Case prompt** — the case's voice, character roster, scene rules, opening reference. Owned by the case author.
3. **Canon block** — programmatically generated from `canon.json` + `canon.schema.json`. Refusal-shaped: "If asked about anything outside these facts, the character does not know."

Assembly is deterministic given `(platform version, case version)`.

## 5. Output contract

Every assistant turn must produce:

- 2–6 lines of in-character prose.
- Optional one-line italicized sensory beat.
- Character names on their own line above their dialogue.
- A trailing chips line in the exact format `<<chips: "..." | "..." | "...">>` with three chips, 3–10 words each, no end punctuation, no emoji.

The runtime parses the chips trailer client-side and never repairs it. Malformed chips render as no chips; the turn is still delivered.

## 6. Voice guarantees (enforced by the platform preamble)

- No self-reference as AI, narrator, or system.
- No markdown headings, no bullet lists, no emoji in prose.
- Never describes the player's thoughts or intentions.
- Never volunteers hidden context.
- Meta or break-character attempts return in-world confusion.
- Never contradicts canon. If asked outside canon, the character says they do not know.
- Never coaches, evaluates, or scores.

## 7. Opening rendering

The first assistant message is never generated. The runtime emits `case.opening.text` verbatim as a synthetic `assistant` message before the first call to `director.stream`. The Director may regenerate the opening if invoked with an empty transcript, in which case the runtime discards the model output and emits the authored opening instead.

## 8. Streaming contract

The runtime exposes a UI message stream that supports:
- Incremental rendering.
- Cancellation via `AbortSignal`.
- Re-attachment if the client disconnects mid-stream (best-effort).

## 9. Failure modes

| Condition                          | Behavior                                                       |
| ---------------------------------- | -------------------------------------------------------------- |
| Provider returns 5xx or times out  | Try next descriptor in the case's fallback chain. Then surface a single in-world recoverable error to the client: "*The connection wavers. Try again.*" Never expose provider names. |
| Provider rejects on policy         | Same fallback path. Never surface the upstream refusal text.   |
| Canon block is malformed at build  | Case fails publish validation. Never reachable at runtime.     |
| Unknown caseId                     | Runtime returns a structured error. The router shows the archive screen, not an error page. |
| Missing API key                    | Runtime fails closed; admin alert fires; no requests dispatched. |

## 10. Telemetry

The runtime records per-turn:

- caseId, caseVersion
- modelDescriptor used (including fallback if applicable)
- token counts, latency, status
- chips-parse success boolean

No transcript content is logged in production telemetry. Author-mode review logs full transcripts under explicit consent.

## 11. Non-goals

- Tool calling at chat time.
- JSON-mode output at chat time.
- Server-side conversation memory across sessions.
- Cross-case Director memory.
- Self-revision passes ("critic" or "judge" models after the Director responds).
