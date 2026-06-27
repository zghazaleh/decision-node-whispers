import { useEffect, useMemo, useState } from "react";
import type { DecisionAnalysis } from "@/lib/analysis.functions";
import { DIMENSIONS, DIMENSION_LABELS, type Dimension } from "@/lib/decision-profile";

/**
 * "What I've noticed" — a player-built reflection rail.
 *
 * The player picks prompts that describe what they think they did in the
 * session. Each prompt is mapped to one Analyzer dimension; when picked,
 * the rail reveals the Analyzer's own short note on that axis (from
 * dimensionNotes). The juxtaposition — player's self-claim next to the
 * Analyzer's observation — is the entire point. Selections persist per
 * missionId so the rail survives reload.
 *
 * No model calls. No new schema. Pure UI on top of existing dimensionNotes.
 */

type Prompt = { id: string; dimension: Dimension; text: string };

// Two prompts per axis — one "did do", one "could have done" — so the
// player can self-claim in either direction. The dimension key drives
// which dimensionNote we reveal.
const PROMPTS: Prompt[] = [
  { id: "strat-1", dimension: "strategicThinking", text: "I reasoned about leverage and structure, not just the next move." },
  { id: "strat-2", dimension: "strategicThinking", text: "I should have thought more about how the pieces fit together." },
  { id: "cur-1", dimension: "curiosity", text: "I asked the questions that mattered." },
  { id: "cur-2", dimension: "curiosity", text: "I accepted first answers too easily." },
  { id: "info-1", dimension: "informationGathering", text: "I reached for the evidence that was within reach." },
  { id: "info-2", dimension: "informationGathering", text: "I left useful information on the desk." },
  { id: "calib-1", dimension: "confidenceCalibration", text: "My confidence sat where the evidence actually was." },
  { id: "calib-2", dimension: "confidenceCalibration", text: "I spoke with more certainty than the evidence carried." },
  { id: "adapt-1", dimension: "adaptability", text: "I updated when new evidence appeared." },
  { id: "adapt-2", dimension: "adaptability", text: "I held my first frame longer than I should have." },
  { id: "neg-1", dimension: "negotiation", text: "I held space for the other side's incentives." },
  { id: "neg-2", dimension: "negotiation", text: "I underweighted what the other side actually wanted." },
  { id: "long-1", dimension: "longTermThinking", text: "I weighed the second-order effects." },
  { id: "long-2", dimension: "longTermThinking", text: "I focused on the immediate aftermath more than the downstream." },
  { id: "bias-1", dimension: "biasResistance", text: "I kept my own biases in check." },
  { id: "bias-2", dimension: "biasResistance", text: "A pattern in my own thinking probably pulled the decision." },
];

const storageKey = (missionId: string) => `decision-node:noticed:${missionId}`;

function readSelection(missionId: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(missionId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeSelection(missionId: string, ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(missionId), JSON.stringify(ids));
  } catch {
    /* quota — ignore */
  }
}

export function NoticedRail({
  missionId,
  dimensionNotes,
}: {
  missionId: string;
  dimensionNotes: NonNullable<DecisionAnalysis["dimensionNotes"]>;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSelected(readSelection(missionId));
    setHydrated(true);
  }, [missionId]);

  useEffect(() => {
    if (hydrated) writeSelection(missionId, selected);
  }, [hydrated, missionId, selected]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // Group available prompts by dimension for the picker, hiding already-picked ones.
  const available = useMemo(() => {
    const byDim = new Map<Dimension, Prompt[]>();
    for (const d of DIMENSIONS) byDim.set(d, []);
    for (const p of PROMPTS) {
      if (!selected.includes(p.id)) byDim.get(p.dimension)!.push(p);
    }
    return byDim;
  }, [selected]);

  const picked = selected
    .map((id) => PROMPTS.find((p) => p.id === id))
    .filter((p): p is Prompt => Boolean(p));

  return (
    <div className="border-y border-foreground/10 py-10">
      <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 text-center mb-3">
        What I've noticed
      </p>
      <p className="text-center text-xs text-foreground/45 max-w-md mx-auto leading-relaxed mb-8">
        Pick any reflections that ring true. Each one surfaces what the
        Analyzer noticed on that same axis — your self-claim, mirrored.
      </p>

      {picked.length > 0 && (
        <ul className="space-y-4 max-w-2xl mx-auto mb-10">
          {picked.map((p) => (
            <li
              key={p.id}
              className="border-l-2 border-accent/50 pl-5 animate-fade-up"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-[0.55rem] tracking-[0.35em] uppercase text-foreground/45 mb-1.5">
                    You said
                  </p>
                  <p className="font-display text-base sm:text-lg leading-snug text-foreground/95 text-pretty">
                    {p.text}
                  </p>
                  <p className="mt-4 text-[0.55rem] tracking-[0.35em] uppercase text-accent/70 mb-1.5">
                    {DIMENSION_LABELS[p.dimension]} — Analyzer noticed
                  </p>
                  <p className="text-sm text-foreground/75 leading-relaxed italic text-pretty">
                    {dimensionNotes[p.dimension] || "No note was recorded on this axis."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(p.id)}
                  aria-label="Remove from rail"
                  className="text-foreground/35 hover:text-foreground/80 transition-colors text-lg leading-none mt-1"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <details className="max-w-2xl mx-auto group">
        <summary className="cursor-pointer list-none text-center text-[0.6rem] tracking-[0.4em] uppercase text-foreground/55 hover:text-foreground/85 transition-colors">
          <span className="inline-flex items-center gap-2">
            <span className="h-px w-6 bg-foreground/30 group-hover:bg-foreground/70 transition-all" />
            {picked.length === 0 ? "Choose a reflection" : "Add another"}
            <span className="h-px w-6 bg-foreground/30 group-hover:bg-foreground/70 transition-all" />
          </span>
        </summary>
        <div className="mt-8 space-y-6">
          {DIMENSIONS.map((dim) => {
            const items = available.get(dim) ?? [];
            if (items.length === 0) return null;
            return (
              <div key={dim}>
                <p className="text-[0.55rem] tracking-[0.35em] uppercase text-foreground/40 mb-2.5">
                  {DIMENSION_LABELS[dim]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggle(p.id)}
                      className="text-left text-xs sm:text-sm text-foreground/75 hover:text-foreground border border-foreground/15 hover:border-accent/60 px-3.5 py-2 rounded-sm transition-colors leading-snug"
                    >
                      {p.text}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}
