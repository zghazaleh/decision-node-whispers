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
- `scripts/prompt-snapshots.ts` — shape/critical-field extractor and
  diff helpers for golden snapshots.
- `scripts/snapshots/*.json` — golden snapshots, one file per fixture.

## Usage

```sh
LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts
LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts --only=director
LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts --only=analysis
LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts --mission=mission-02
LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts --update-snapshots
```

Exit code is `0` when every fixture conforms AND every snapshot matches
(or was just blessed via `--update-snapshots`), `1` on any schema failure
or snapshot drift, `2` if `LOVABLE_API_KEY` is missing.

## Golden snapshots

Each fixture is paired with a JSON file in `scripts/snapshots/` that pins:

- **`shape`** — recursive structural fingerprint of the validated
  response. Keys and value types are pinned; array lengths are bucketed
  into ranges (`0`, `1`, `2-3`, `4-5`, `6-8`, `9+`) so minor count drift
  does not churn. Free-form prose is not recorded — only its type/presence.
- **`critical`** — mission-defining invariants:
  - Director: `chipCount`, `hasChipsTrailer`, `bodyNonEmpty`.
  - Analysis: `archetypeId`, `archetypeMatchedCanon`, `timelineLength`,
    `canonTimelineLength`, `timelineMatchesCanon`, `strengthsCount`,
    `blindSpotsCount`, `biasesCount`, `beliefTrajectoryLength`,
    `beliefUpdatesUsed` (sorted enum literals actually used),
    `beliefConfidencesUsed`.

A change in either bucket fails with a `[FAIL] … :: snapshot` line and a
printed diff. Bless intentional changes with `--update-snapshots`.

First-time fixtures have no golden file on disk and fail with
`outcome=new`; run once with `--update-snapshots` to seed.


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

Use the scaffolder CLI — it appends to `prompt-test-fixtures.ts`, seeds a
placeholder snapshot stub under `scripts/snapshots/`, and refreshes the
fixture index below.

```sh
# Director fixture (each --turn is "role:text", role ∈ user|assistant)
bun run scripts/scaffold-fixture.ts director ask-jonas-pressure \
  --mission=mission-01 \
  --turn="user:Jonas, what happens if we delay?"

# Analysis fixture (--turn repeatable; --archetype + --confidence optional)
bun run scripts/scaffold-fixture.ts analysis escalate-to-board \
  --mission=mission-01 \
  --decision="I escalate to the full board before deciding." \
  --reasoning="Single-point-of-failure on Marcus's read." \
  --archetype=delay --confidence=55 \
  --turn="assistant:Sarah: They're seated." \
  --turn="user:Who is in the room?"
```

Flags:

- `--dry-run` prints the planned edits without writing.
- `--no-snapshot` skips creating the snapshot stub (the next harness run
  will create it on first `--update-snapshots`).
- `--no-docs` skips refreshing the fixture index below.

After scaffolding, run the harness once with `--update-snapshots` to bless
the new golden file, then commit fixture + snapshot + docs together.

You can also hand-edit `scripts/prompt-test-fixtures.ts` directly — keep
the `// <scaffold:director>` / `// <scaffold:analysis>` marker comments at
the end of each array so the scaffolder keeps working. Every fixture is
one live gateway call, so keep them small and focused.

### Integration test

`scripts/scaffold-integration-test.ts` exercises the full
scaffolder → harness → snapshot loop end-to-end:

1. Runs the scaffolder with `--dry-run` and asserts no files mutated.
2. Scaffolds a temporary Director and Analysis fixture for real.
3. Calls the harness with `--fixture=<id> --update-snapshots` (skipped
   with a warning when `LOVABLE_API_KEY` is missing).
4. Validates the resulting snapshot JSON against the documented
   `Snapshot` envelope and the kind-specific critical-field contract.
5. Restores `prompt-test-fixtures.ts` and removes the temp snapshots.

```sh
bun run scripts/scaffold-integration-test.ts                  # stub mode
LOVABLE_API_KEY=... bun run scripts/scaffold-integration-test.ts  # live mode
```

### Registered fixtures

<!-- fixtures:start -->
<!-- fixtures:end -->


## Caveats

- The harness hits the live gateway and consumes credits. Run only when
  you are debugging prompt or schema drift.
- LLM output is non-deterministic. A single transient failure is not a
  regression; re-run before concluding the contract drifted.
- The Stage B system prompt in the harness is a trimmed mirror of the
  production prompt, intentionally pared down to the field-shape
  requirements. The harness validates **structure**, not stylistic
  adherence (e.g. forbidden-word avoidance).
