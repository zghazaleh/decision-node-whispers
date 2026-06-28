import { useEffect } from "react";
import type { MissionMeta } from "@/lib/missions";
import { SceneArt } from "./scene-art";
import { getSceneSrc, toneWord, shortDuration } from "@/lib/discovery/helpers";
import {
  getResonance,
  resonanceCopy,
  logImpression,
} from "@/lib/discovery/signals";

/**
 * Poster card — used in every rail. Carries the case's identity and tone.
 * Never shows a star rating, rank number, score, or "% chose X". The only
 * social signal is a small italic resonance line (words, not a count).
 */
export function MissionCard({
  mission,
  onSelect,
}: {
  mission: MissionMeta;
  onSelect: (id: string) => void;
}) {
  useEffect(() => {
    logImpression(mission.id, mission.theme);
  }, [mission.id, mission.theme]);

  const resonance = resonanceCopy(getResonance(mission.id));

  return (
    <button
      type="button"
      onClick={() => onSelect(mission.id)}
      aria-label={`Open ${mission.codename}`}
      className="group relative shrink-0 w-[240px] sm:w-[260px] snap-start overflow-hidden rounded-[12px] border border-foreground/10 bg-[#0b0d10] text-left transition-colors hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0b0d10]">
        <SceneArt src={getSceneSrc(mission.id)} theme={mission.theme} />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-16"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,8,12,0.55) 0%, rgba(6,8,12,0) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,8,12,0) 0%, rgba(6,8,12,0.65) 60%, rgba(6,8,12,0.92) 100%)",
          }}
        />
        <p className="absolute left-3 top-3 text-[0.5rem] tracking-[0.4em] uppercase text-foreground/85">
          {mission.theme ?? "Case File"}
        </p>
        <div className="absolute bottom-3 left-3 right-3">
          <h5 className="font-display text-lg leading-[1.1] text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {mission.codename}
          </h5>
          <p className="mt-1 text-[0.55rem] tracking-[0.35em] uppercase text-foreground/75">
            {toneWord(mission.tone)} · {shortDuration(mission.duration)}
          </p>
        </div>
      </div>
      {resonance && (
        <p className="px-3 py-2 text-[0.7rem] italic text-muted-foreground/70">
          {resonance}
        </p>
      )}
    </button>
  );
}
