import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  getMissionArchetypeBreakdown,
  type ArchetypeBreakdown,
} from "@/lib/mission-stats.functions";
import { getMissionEngine } from "@/lib/missions/registry";

/**
 * Community Stats — "How did others decide?"
 *
 * Aggregated percentage breakdown of which archetype other players chose for
 * the same mission. Read-only telemetry; does not alter the user's profile.
 */
export function CommunityStats({
  missionId,
  chosenArchetypeId,
}: {
  missionId: string;
  chosenArchetypeId?: string | null;
}) {
  const fetchBreakdown = useServerFn(getMissionArchetypeBreakdown);
  const [data, setData] = useState<ArchetypeBreakdown | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchBreakdown({ data: { missionId } })
      .then((r) => { if (!cancelled) setData(r); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [fetchBreakdown, missionId]);

  const labels = useMemo(() => {
    const engine = getMissionEngine(missionId);
    const map = new Map<string, string>();
    if (engine) {
      for (const id of engine.archetypeIds) {
        const arc = engine.getArchetype(id);
        if (arc) map.set(id, arc.label);
      }
    }
    return map;
  }, [missionId]);

  if (error) return null;
  if (!data) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[0.55rem] tracking-[0.4em] uppercase text-foreground/35 italic">
          Counting the room…
        </p>
      </div>
    );
  }

  if (data.totalPlays === 0) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs text-foreground/50 leading-relaxed">
          You're early. No one else has decided this one yet.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 text-center">
        <p className="text-[0.55rem] tracking-[0.4em] uppercase text-foreground/45 italic">
          {data.totalPlays.toLocaleString()} {data.totalPlays === 1 ? "player has" : "players have"} stood where you stood
        </p>
      </div>
      <ul className="space-y-3">
        {data.counts.map((row) => {
          const isYou = row.archetypeId === chosenArchetypeId;
          const label = labels.get(row.archetypeId) ?? row.archetypeId;
          return (
            <li
              key={row.archetypeId}
              className={`border bg-foreground/[0.02] backdrop-blur-sm px-5 py-4 ${
                isYou
                  ? "border-accent/40"
                  : "border-foreground/10"
              }`}
            >
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <div className="flex items-baseline gap-3 min-w-0">
                  <span className="font-display text-sm sm:text-base text-foreground/90 truncate">
                    {label}
                  </span>
                  {isYou && (
                    <span className="text-[0.55rem] tracking-[0.35em] uppercase text-accent/80 shrink-0">
                      Your path
                    </span>
                  )}
                </div>
                <span className="font-display tabular-nums text-base sm:text-lg text-foreground/85 shrink-0">
                  {row.percent}%
                </span>
              </div>
              <div className="h-px w-full bg-foreground/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ease-out ${
                    isYou ? "bg-accent/70" : "bg-foreground/40"
                  }`}
                  style={{ width: `${Math.max(row.percent, 1.5)}%` }}
                  aria-hidden
                />
              </div>
              <p className="mt-2 text-[0.65rem] tracking-[0.2em] uppercase text-foreground/40 tabular-nums">
                {row.count} {row.count === 1 ? "decision" : "decisions"}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
