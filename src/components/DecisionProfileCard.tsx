import {
  DIMENSIONS,
  DIMENSION_LABELS,
  dimensionTrends,
  type DecisionProfile,
  type Dimension,
} from "@/lib/decision-profile";

export function DecisionProfileCard({
  profile,
  delay = 2.9,
}: {
  profile: DecisionProfile;
  delay?: number;
}) {
  const trends = dimensionTrends(profile);
  return (
    <div
      className="animate-fade-up border-t border-foreground/15 pt-12"
      style={{ animationDelay: `${delay}s` }}
    >
      <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-2 text-center">
        Decision DNA
      </p>
      <p className="text-center text-xs text-foreground/45 max-w-md mx-auto leading-relaxed mb-10">
        {profile.missionsCompleted <= 1
          ? "Your profile begins here. Every mission re-shapes it."
          : `Updated across ${profile.contributions.length} mission${profile.contributions.length === 1 ? "" : "s"}. Recency-weighted.`}
      </p>

      <ul className="space-y-5 max-w-xl mx-auto">
        {DIMENSIONS.map((d) => (
          <DimensionRow
            key={d}
            label={DIMENSION_LABELS[d]}
            value={profile.scores[d]}
            delta={trends[d]}
          />
        ))}
      </ul>

      <div className="mt-12 border-t border-foreground/10 pt-8 max-w-xl mx-auto">
        <p className="text-[0.6rem] tracking-[0.35em] uppercase text-foreground/45 mb-3">
          Emerging pattern
        </p>
        <p className="font-display text-lg sm:text-xl leading-relaxed text-foreground/90 text-pretty">
          {profile.emergingPattern}
        </p>
      </div>
    </div>
  );
}

function DimensionRow({
  label,
  value,
  delta,
}: {
  label: string;
  value: number;
  delta: number | null;
}) {
  return (
    <li className="grid grid-cols-[1fr_auto] items-center gap-4">
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-3 mb-1.5">
          <span className="text-xs sm:text-sm text-foreground/80 truncate">
            {label}
          </span>
          <span className="text-[0.6rem] tracking-[0.3em] uppercase text-foreground/40">
            {delta === null ? "new" : delta === 0 ? "—" : delta > 0 ? `▲ ${delta}` : `▼ ${Math.abs(delta)}`}
          </span>
        </div>
        <div className="relative h-[3px] bg-foreground/10 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-accent/80 transition-[width] duration-700 ease-out"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
      <span className="font-display text-lg sm:text-xl tabular-nums text-foreground/95 w-10 text-right">
        {value}
      </span>
    </li>
  );
}

export type { Dimension };
