import {
  DIMENSIONS,
  DIMENSION_LABELS,
  dimensionBands,
  type DecisionProfile,
} from "@/lib/decision-profile";


export function DecisionProfileCard({
  profile,
  delay = 2.9,
}: {
  profile: DecisionProfile;
  delay?: number;
}) {
  const trends = dimensionTrends(profile);
  const bands = dimensionBands(profile);
  return (
    <div
      className="animate-fade-up border-t border-foreground/15 pt-12"
      style={{ animationDelay: `${delay}s` }}
    >
      <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-2 text-center">
        Decision Profile
      </p>
      <p className="text-center text-xs text-foreground/45 max-w-md mx-auto leading-relaxed mb-10">
        A portrait, not a score. Each axis describes a tendency that has
        appeared across your sessions; the band is the room for doubt, and
        it narrows as more cases accumulate.
      </p>

      <div className="max-w-xl mx-auto">
        <RadarPlot
          values={DIMENSIONS.map((d) => profile.scores[d])}
          los={DIMENSIONS.map((d) => bands[d].lo)}
          his={DIMENSIONS.map((d) => bands[d].hi)}
          labels={DIMENSIONS.map((d) => DIMENSION_LABELS[d])}
        />
      </div>

      <ul className="space-y-5 max-w-xl mx-auto mt-12">
        {DIMENSIONS.map((d) => (
          <DimensionRow
            key={d}
            dim={d}
            label={DIMENSION_LABELS[d]}
            band={bands[d]}
            delta={trends[d]}
            contributions={profile.contributions}
          />
        ))}
      </ul>

      <div className="mt-12 border-t border-foreground/10 pt-8 max-w-xl mx-auto">
        <p className="text-[0.6rem] tracking-[0.35em] uppercase text-foreground/45 mb-3">
          Portrait so far
        </p>
        <p className="font-display text-lg sm:text-xl leading-relaxed text-foreground/90 text-pretty">
          {profile.emergingPattern}
        </p>
        <p className="mt-4 text-[0.65rem] tracking-[0.3em] uppercase text-foreground/35">
          Reflects you across {profile.contributions.length} case
          {profile.contributions.length === 1 ? "" : "s"} — nothing here is a verdict.
        </p>
      </div>
    </div>
  );
}

function RadarPlot({
  values,
  los,
  his,
  labels,
}: {
  values: number[];
  los: number[];
  his: number[];
  labels: string[];
}) {
  const n = values.length;
  const size = 380;
  const cx = size / 2;
  const cy = size / 2;
  const rMax = size * 0.36;

  const pointAt = (i: number, r: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  };

  const clamp01 = (v: number) => Math.max(0, Math.min(100, v)) / 100;
  const ptsAt = (vs: number[]) =>
    vs
      .map((v, i) => {
        const p = pointAt(i, clamp01(v) * rMax);
        return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
      })
      .join(" ");

  const rings = [0.25, 0.5, 0.75, 1.0];
  const polygon = ptsAt(values);
  const hiPoly = ptsAt(his);
  const loPoly = ptsAt(los);

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
        {/* Confidence band: outer (hi) filled, inner (lo) punched out via even-odd */}
        <path
          d={`M ${hiPoly.replace(/ /g, " L ")} Z M ${loPoly.replace(/ /g, " L ")} Z`}
          fill="var(--color-accent)"
          fillOpacity={0.1}
          fillRule="evenodd"
          stroke="var(--color-accent)"
          strokeOpacity={0.18}
          strokeWidth={0.75}
        />
        {/* Filled DNA polygon */}
        <polygon
          points={polygon}
          fill="var(--color-accent)"
          fillOpacity={0.22}
          stroke="var(--color-accent)"
          strokeOpacity={0.9}
          strokeWidth={1.25}
          strokeLinejoin="round"
        />
        {/* Dot at each vertex */}
        {values.map((v, i) => {
          const p = pointAt(i, clamp01(v) * rMax);
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

export type { Dimension } from "@/lib/decision-profile";

