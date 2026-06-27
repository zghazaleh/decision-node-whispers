# Prompt Test Harness

A standalone script that calls the live Lovable AI Gateway with sample
Director and Decision Analysis inputs and verifies the responses match the
Zod schemas documented in [`prompt-io-schema.md`](./prompt-io-schema.md).

The harness does **not** modify or import the running server route
(`src/routes/api/chat.ts`) or the server function (`analyzeDecision` in
`src/lib/analysis.functions.ts`). It re-builds the same prompts and
re-declares the same Zod schemas. If the running code ever drifts from the
documented contract, the harness fails.

## Files

- `scripts/prompt-test-harness.ts` — runner (CLI).
- `scripts/prompt-test-fixtures.ts` — sample Director turn tails and
  Decision Analysis commits.

## Usage

```sh
LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts
LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts --only=director
LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts --only=analysis
LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts --mission=mission-02
```

Exit code is `0` when every fixture conforms, `1` on any failure, `2` if
`LOVABLE_API_KEY` is missing.

Each line of output is one fixture result, e.g.

```
[PASS] director / mission-01 / ask-sarah-context — chips=["...","...","..."]
[PASS] analysis / mission-01 / ship-confident-preset — archetypeId=ship headline="..." beats=5 belief=4
```

## What is verified

### Director (`runDirector`)

For each `DirectorFixture`:

1. Pre-pends the canonical `engine.opening.text` as the first assistant
   message (matching how `src/routes/mission.$id.tsx` seeds the chat).
2. Calls `generateText` against `google/gemini-3-flash-preview` at
   `temperature: 0.85` with `engine.systemPrompt`.
3. Parses the trailing chips block with the regex
   `/<<chips:\s*(.+?)>>\s*$/s` and validates against:

   ```ts
   z.object({
     raw: z.string(),
     chips: z.array(z.string().min(3)).length(3),
   })
   ```

### Decision Analysis (`runAnalysis`)

For each `AnalysisFixture` the harness replays both stages exactly as
`analyzeDecision` does:

- **Stage A — classify** (skipped if a valid preset `archetypeId` is in the
  fixture). Schema:
  `{ archetypeId: enum(engine.archetypeIds), confidence: 0..1, rationale: string }`.
- **Stage B — narrate** with the canon timeline block prepended. Schema:
  the full `AnalysisSchema` mirrored from `prompt-io-schema.md`.

After Stage B the harness asserts the canon-spine invariant: when an
archetype matched, the returned `timeline` length must equal
`engine.getArchetype(id).timeline.length`. (In production, `analyzeDecision`
hard-overwrites this; here we only assert structural agreement — the
overwrite itself lives in `analysis.functions.ts`.)

## Adding fixtures

Append entries to `scripts/prompt-test-fixtures.ts`:

- `DIRECTOR_FIXTURES` items carry an `id` and a `turns` array. The turns are
  appended after `engine.opening.text`. Use this to probe a specific edge
  (meta-break attempts, observation requests, canon-violating questions).
- `ANALYSIS_FIXTURES` items carry an `id`, `decision`, `reasoning`,
  optional `archetypeId` (simulating a Decide preset), optional
  `confidence`, and a `transcript` array of `{role, text}`.

Keep fixtures small and focused — every fixture is one live gateway call.

## Caveats

- The harness hits the live gateway and consumes credits. Run only when
  you are debugging prompt or schema drift.
- LLM output is non-deterministic. A single transient failure is not a
  regression; re-run before concluding the contract drifted.
- The Stage B system prompt in the harness is a trimmed mirror of the
  production prompt, intentionally pared down to the field-shape
  requirements. The harness validates **structure**, not stylistic
  adherence (e.g. forbidden-word avoidance).
