import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getArchetypeReveal, type ArchetypeReveal } from "@/lib/mission-shell.functions";

/**
 * ChosenSecondOrder — expandable "how this ripples" block for the player's
 * own chosen archetype. Fetches the single archetype from the server so the
 * timeline / secondOrder / tone never ships into the client bundle for other
 * archetypes.
 */
export function ChosenSecondOrder({
  missionId,
  chosenArchetypeId,
}: {
  missionId: string;
  chosenArchetypeId?: string | null;
}) {
  const fetchReveal = useServerFn(getArchetypeReveal);
  const [arc, setArc] = useState<ArchetypeReveal | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!chosenArchetypeId) { setArc(null); return; }
    let cancelled = false;
    fetchReveal({ data: { missionId, archetypeId: chosenArchetypeId } })
      .then((r) => { if (!cancelled) setArc(r); })
      .catch(() => { if (!cancelled) setArc(null); });
    return () => { cancelled = true; };
  }, [missionId, chosenArchetypeId, fetchReveal]);

  if (!arc) return null;
  const entries = Object.entries(arc.secondOrder ?? {});
  if (entries.length === 0) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="border border-foreground/10 bg-foreground/[0.02] backdrop-blur-sm transition-colors hover:border-accent/30">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        >
          <span className="flex-1">
            <span className="block text-[0.6rem] tracking-[0.35em] uppercase text-accent/70">
              How this ripples
            </span>
            <span className="mt-1 block font-display text-base sm:text-lg text-foreground/90">
              Second-order effects of your decision
            </span>
          </span>
          <span
            aria-hidden
            className={`text-foreground/40 text-xs tracking-[0.3em] transition-transform ${
              open ? "rotate-90" : ""
            }`}
          >
            →
          </span>
        </button>

        {open && (
          <div className="px-5 pb-6 pt-1 animate-fade-in">
            <dl className="space-y-2 border-l border-foreground/15 pl-5">
              {entries.map(([k, v]) => (
                <div key={k} className="text-xs sm:text-sm leading-relaxed">
                  <dt className="inline text-foreground/55">{k}: </dt>
                  <dd className="inline text-foreground/80">{String(v)}</dd>
                </div>
              ))}
            </dl>
            {arc.tone && (
              <p className="mt-5 text-xs sm:text-sm italic text-foreground/55 leading-relaxed text-pretty">
                {arc.tone}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
