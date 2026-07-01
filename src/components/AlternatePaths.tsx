import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getArchetypeLabels,
  getArchetypeReveal,
  type ArchetypeReveal,
} from "@/lib/mission-shell.functions";

/**
 * Alternate Paths — read-only "what would have happened" view.
 *
 * Unlocks after a mission is completed. Fetches ONE archetype at a time from
 * the server (never bundles other archetypes' hidden outcomes into the client
 * JS). This keeps mission twists reachable-but-undelivered until the player
 * has actually committed a decision on this mission.
 */
export function AlternatePaths({
  missionId,
  chosenArchetypeId,
}: {
  missionId: string;
  chosenArchetypeId?: string | null;
}) {
  const fetchLabels = useServerFn(getArchetypeLabels);
  const fetchReveal = useServerFn(getArchetypeReveal);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const [reveals, setReveals] = useState<Record<string, ArchetypeReveal>>({});

  useEffect(() => {
    let cancelled = false;
    fetchLabels({ data: { missionId } })
      .then((r) => { if (!cancelled) setLabels(r); })
      .catch(() => { /* ignore */ });
    return () => { cancelled = true; };
  }, [missionId, fetchLabels]);

  const alternates = Object.keys(labels).filter((id) => id !== chosenArchetypeId);

  useEffect(() => {
    if (!openId || reveals[openId]) return;
    let cancelled = false;
    fetchReveal({ data: { missionId, archetypeId: openId } })
      .then((r) => {
        if (!cancelled && r) {
          setReveals((prev) => ({ ...prev, [openId]: r }));
        }
      })
      .catch(() => { /* ignore */ });
    return () => { cancelled = true; };
  }, [openId, missionId, fetchReveal, reveals]);

  if (alternates.length === 0) return null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 text-center">
        <p className="text-[0.55rem] tracking-[0.4em] uppercase text-foreground/45 italic">
          These outcomes do not change your profile.
        </p>
      </div>
      <ul className="space-y-3">
        {alternates.map((archetypeId) => {
          const isOpen = openId === archetypeId;
          const arc = reveals[archetypeId] ?? null;
          return (
            <li
              key={archetypeId}
              className="border border-foreground/10 bg-foreground/[0.02] backdrop-blur-sm transition-colors hover:border-accent/30"
            >
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : archetypeId)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="flex-1">
                  <span className="block text-[0.6rem] tracking-[0.35em] uppercase text-accent/70">
                    Path not taken
                  </span>
                  <span className="mt-1 block font-display text-base sm:text-lg text-foreground/90">
                    {arc?.label ?? "…"}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={`text-foreground/40 text-xs tracking-[0.3em] transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                >
                  →
                </span>
              </button>

              {isOpen && arc && (
                <div className="px-5 pb-6 pt-1 animate-fade-in">
                  <ol className="space-y-5 border-l border-foreground/15 pl-5">
                    {arc.timeline.map((t, i) => (
                      <li key={i}>
                        <p className="font-display text-sm sm:text-base leading-snug text-foreground/90 text-pretty">
                          {t.beat}
                        </p>
                        <p className="mt-1.5 text-xs sm:text-sm text-foreground/60 leading-relaxed text-pretty">
                          {t.consequence}
                        </p>
                      </li>
                    ))}
                  </ol>

                  {Object.keys(arc.secondOrder).length > 0 && (
                    <div className="mt-6 border-t border-foreground/10 pt-4">
                      <p className="text-[0.55rem] tracking-[0.4em] uppercase text-foreground/45 mb-3">
                        Second-order effects
                      </p>
                      <dl className="space-y-2">
                        {Object.entries(arc.secondOrder).map(([k, v]) => (
                          <div key={k} className="text-xs sm:text-sm leading-relaxed">
                            <dt className="inline text-foreground/55">{k}: </dt>
                            <dd className="inline text-foreground/75">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  {arc.tone && (
                    <p className="mt-5 text-xs sm:text-sm italic text-foreground/55 leading-relaxed text-pretty">
                      {arc.tone}
                    </p>
                  )}
                </div>
              )}
              {isOpen && !arc && (
                <p className="px-5 pb-6 text-xs text-foreground/45">Loading…</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
