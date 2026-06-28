import type { MissionMeta } from "@/lib/missions";
import { SceneArt } from "./scene-art";
import { DifficultyDots } from "./difficulty-dots";
import { getSceneSrc, shortDuration, toneWord } from "@/lib/discovery/helpers";
import { getResonance, resonanceCopy } from "@/lib/discovery/signals";

/**
 * Cinematic detail card for a single case — used as the Today hero today,
 * reusable for Featured / spotlight surfaces tomorrow. Carries identity
 * and tone; never a count, rank, or rating.
 */
export function HeroDetail({
  mission,
  eyebrow = "Today",
  rightEyebrow = "Case of the day",
  onEnter,
}: {
  mission: MissionMeta;
  eyebrow?: string;
  rightEyebrow?: string;
  onEnter: (id: string) => void;
}) {
  const resonance = resonanceCopy(getResonance(mission.id));
  return (
    <div className="mb-10">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-[0.55rem] tracking-[0.4em] uppercase text-accent">
          {eyebrow}
        </span>
        <span className="h-px flex-1 bg-accent/25" aria-hidden />
        <span className="text-[0.55rem] tracking-[0.4em] uppercase text-muted-foreground/55">
          {rightEyebrow}
        </span>
      </div>
      <div className="overflow-hidden rounded-[14px] border border-accent/40 bg-[#0b0d10] motion-safe:animate-fade-up">
        <div className="relative aspect-[16/9] sm:aspect-auto sm:h-[260px] w-full overflow-hidden bg-[#0b0d10]">
          <SceneArt src={getSceneSrc(mission.id)} theme={mission.theme} brighten />
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-24"
            style={{
              background:
                "linear-gradient(180deg, rgba(6,8,12,0.55) 0%, rgba(6,8,12,0) 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{
              background:
                "linear-gradient(180deg, rgba(6,8,12,0) 0%, rgba(6,8,12,0.55) 70%, rgba(6,8,12,0.75) 100%)",
            }}
          />
          <p className="absolute left-5 top-4 text-[0.55rem] tracking-[0.4em] uppercase text-foreground/90">
            Case File · {mission.theme ?? "—"}
          </p>
          <div className="absolute bottom-4 left-5 right-5">
            <h4 className="font-display text-3xl sm:text-[40px] leading-[1.05] text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              {mission.codename}
            </h4>
            <p className="mt-1 text-[0.6rem] tracking-[0.35em] uppercase text-foreground/85">
              {[mission.location, mission.year].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <p className="font-display text-base sm:text-lg leading-snug text-foreground/90 text-pretty">
            {mission.logline}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground/75">
            <span>{toneWord(mission.tone)}</span>
            <DifficultyDots level={mission.difficulty ?? null} />
            <span>{shortDuration(mission.duration)}</span>
            {mission.category && <span>{mission.category}</span>}
          </div>

          {resonance && (
            <p className="mt-3 text-xs italic text-muted-foreground/65 normal-case tracking-normal">
              {resonance}
            </p>
          )}

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => onEnter(mission.id)}
              aria-label={`Enter ${mission.codename}`}
              className="inline-flex min-h-[44px] items-center gap-3 rounded-full bg-accent px-6 py-2 text-[0.65rem] tracking-[0.4em] uppercase text-background hover:bg-accent/90 transition-colors w-full sm:w-auto justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Enter
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
