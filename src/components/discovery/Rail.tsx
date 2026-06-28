import type { MissionMeta } from "@/lib/missions";
import { MissionCard } from "./MissionCard";

/**
 * Horizontal-scroll scaffold — eyebrow label, accent rule, snap-scrolling row
 * of poster cards. Carries its own loading / empty / error states so every
 * discovery surface (Today / Fit / Curator / Resonance / Fresh) breathes the
 * same way while data arrives.
 *
 *   loading → cinematic shimmer skeletons in the card slot
 *   error   → quiet line + retry affordance, never a red toast
 *   empty   → italic muted line, no card frames
 */
export function Rail({
  label,
  rightEyebrow,
  items,
  onSelect,
  loading = false,
  error = null,
  onRetry,
  emptyCopy = "Nothing fresh here yet. The Guild is still writing.",
  skeletonCount = 4,
}: {
  label: string;
  rightEyebrow?: string;
  items: MissionMeta[];
  onSelect: (id: string) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyCopy?: string;
  skeletonCount?: number;
}) {
  const showSkeleton = loading && items.length === 0;
  const showError = !loading && !!error;
  const showEmpty = !loading && !error && items.length === 0;
  if (showEmpty && !onRetry) {
    // Truly nothing to show and no way to retry — collapse the rail.
    return null;
  }

  return (
    <section className="mb-12" aria-label={label}>
      <div className="mb-3 flex items-center gap-3">
        <span className="text-[0.55rem] tracking-[0.4em] uppercase text-accent/90">
          {label}
        </span>
        <span className="h-px flex-1 bg-accent/15" aria-hidden />
        {rightEyebrow && (
          <span className="text-[0.55rem] tracking-[0.4em] uppercase text-muted-foreground/55">
            {rightEyebrow}
          </span>
        )}
      </div>

      <div
        className="-mx-6 sm:-mx-10 overflow-x-auto px-6 sm:px-10 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
        aria-busy={loading || undefined}
      >
        {showSkeleton ? (
          <ul
            className="flex gap-4"
            aria-live="polite"
            aria-label={`${label} loading`}
          >
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <li key={i}>
                <RailSkeletonCard delayMs={i * 90} />
              </li>
            ))}
          </ul>
        ) : showError ? (
          <RailError message={error!} onRetry={onRetry} />
        ) : showEmpty ? (
          <RailEmpty message={emptyCopy} onRetry={onRetry} />
        ) : (
          <ul className="flex gap-4 snap-x snap-mandatory">
            {items.map((m) => (
              <li key={m.id} className="motion-safe:animate-[fade-in_0.45s_ease-out_both]">
                <MissionCard mission={m} onSelect={onSelect} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ── states ─────────────────────────────────────────────── */

function RailSkeletonCard({ delayMs = 0 }: { delayMs?: number }) {
  return (
    <div
      className="relative shrink-0 w-[240px] sm:w-[260px] overflow-hidden rounded-[12px] border border-foreground/10 bg-[#0b0d10]"
      aria-hidden
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-foreground/[0.035]">
        <div
          className="absolute inset-0 motion-safe:animate-[shimmer_2.4s_ease-in-out_infinite] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.045)_50%,transparent_70%)] bg-[length:200%_100%]"
          style={{ animationDelay: `${delayMs}ms` }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/3"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,8,12,0) 0%, rgba(6,8,12,0.55) 60%, rgba(6,8,12,0.85) 100%)",
          }}
        />
        <div className="absolute left-3 top-3 h-[6px] w-16 rounded-full bg-foreground/10" />
        <div className="absolute bottom-3 left-3 right-3 space-y-2">
          <div className="h-3 w-3/4 rounded-sm bg-foreground/12" />
          <div className="h-2 w-1/2 rounded-sm bg-foreground/8" />
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="h-2 w-2/3 rounded-sm bg-foreground/8" />
      </div>
    </div>
  );
}

function RailError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex w-full items-center gap-4 rounded-[12px] border border-foreground/10 bg-[#0b0d10]/60 px-5 py-6 motion-safe:animate-[fade-in_0.4s_ease-out_both]">
      <p className="flex-1 text-[0.75rem] italic text-muted-foreground/80">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-full border border-foreground/15 px-3 py-1.5 text-[0.55rem] tracking-[0.35em] uppercase text-foreground/85 transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Try again
        </button>
      )}
    </div>
  );
}

function RailEmpty({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex w-full items-center gap-4 rounded-[12px] border border-dashed border-foreground/10 bg-transparent px-5 py-6 motion-safe:animate-[fade-in_0.4s_ease-out_both]">
      <p className="flex-1 text-[0.75rem] italic text-muted-foreground/70">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-full border border-foreground/10 px-3 py-1.5 text-[0.55rem] tracking-[0.35em] uppercase text-muted-foreground/70 transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Refresh
        </button>
      )}
    </div>
  );
}
