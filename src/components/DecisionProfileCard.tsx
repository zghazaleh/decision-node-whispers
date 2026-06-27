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

      <div className="max-w-xl mx-auto">
        <RadarPlot
          values={DIMENSIONS.map((d) => profile.scores[d])}
          labels={DIMENSIONS.map((d) => DIMENSION_LABELS[d])}
        />
      </div>

      <ul className="space-y-5 max-w-xl mx-auto mt-12">
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

function RadarPlot({ values, labels }: { values: number[]; labels: string[] }) {
  const n = values.length;
  const size = 380;
  const cx = size / 2;
  const cy = size / 2;
  const rMax = size * 0.36;

  const pointAt = (i: number, r: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  };

  const rings = [0.25, 0.5, 0.75, 1.0];
  const polygon = values
    .map((v, i) => {
      const p = pointAt(i, (Math.max(0, Math.min(100, v)) / 100) * rMax);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div className="relative mx-auto" style={{ maxWidth: size }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-auto"
        role="img"
        aria-label="Decision DNA radar plot"
      >
        {/* Concentric polygon rings */}
        {rings.map((r, ri) => {
          const pts = Array.from({ length: n }, (_, i) => {
            const p = pointAt(i, r * rMax);
            return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
          }).join(" ");
          return (
            <polygon
              key={ri}
              points={pts}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.08 + ri * 0.025}
              className="text-foreground"
            />
          );
        })}
        {/* Axes */}
        {Array.from({ length: n }, (_, i) => {
          const p = pointAt(i, rMax);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="currentColor"
              strokeOpacity={0.08}
              className="text-foreground"
            />
          );
        })}
        {/* Filled DNA polygon */}
        <polygon
          points={polygon}
          fill="var(--color-accent)"
          fillOpacity={0.18}
          stroke="var(--color-accent)"
          strokeOpacity={0.85}
          strokeWidth={1.25}
          strokeLinejoin="round"
        />
        {/* Dot at each vertex */}
        {values.map((v, i) => {
          const p = pointAt(i, (Math.max(0, Math.min(100, v)) / 100) * rMax);
          return (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={2.5}
              fill="var(--color-accent)"
              opacity={0.95}
            />
          );
        })}
        {/* Labels */}
        {labels.map((label, i) => {
          const p = pointAt(i, rMax + 22);
          // Compact label — first word only for cramped axes
          const short = label.length > 12 ? label.split(" ")[0] : label;
          const anchor =
            Math.abs(p.x - cx) < 8
              ? "middle"
              : p.x > cx
                ? "start"
                : "end";
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor={anchor}
              dominantBaseline="middle"
              className="fill-foreground/55"
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)",
              }}
            >
              {short}
            </text>
          );
        })}
      </svg>
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
          <span className="text-[0.6rem] tracking-[0.3em] uppercase text-foreground/40 tabular-nums">
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
