# Prompt golden snapshots

Each file pins one fixture's contract:

- `shape` — recursive structural fingerprint of the validated response
  (keys, value types, array lengths bucketed into ranges). Free-form prose
  is intentionally NOT recorded — it would churn on every run.
- `critical` — a small dict of mission-defining invariants that must remain
  stable: chip count (director), archetypeId + canon-timeline length match
  + counts of strengths/blindSpots/biases + belief-trajectory enum values
  used (analysis).

## Workflow

```bash
# Run and compare against the golden files. Drift = failure.
LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts

# Bless intentional changes after reviewing the diff.
LOVABLE_API_KEY=... bun run scripts/prompt-test-harness.ts --update-snapshots
```

Snapshots live next to the harness so they version with the prompt logic
they pin. Delete a file to force a fresh re-bless on the next `-u` run.
