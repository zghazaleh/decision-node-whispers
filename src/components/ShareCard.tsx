import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  type DecisionProfile,
} from "@/lib/decision-profile";

/**
 * ShareCard — 1200×630 social card. Hero radar on the left, large
 * editorial portrait statement on the right, restrained wordmark.
 * The SVG is the source of truth (rasterized to PNG for export).
 */

const W = 1200;
const H = 630;

const BG = "#070808";
const BG_2 = "#0d0e10";
const FG = "#f5f1e8";
const ACCENT = "#d9bb89";
const MUTED = "#7a7368";

type ShareCardProps = {
  profile: DecisionProfile;
  missionCodename?: string;
};

export function ShareCard({ profile, missionCodename }: ShareCardProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [busy, setBusy] = useState<null | "download" | "copy">(null);

  const shareUrl =
    typeof window !== "undefined" && window.location.origin.includes("decision-nodes")
      ? `${window.location.origin}/`
      : "https://decision-nodes.com/";

  const portrait = (profile.emergingPattern ?? "").trim();
  const shareText = useMemo(() => {
    const count = profile.missionsCompleted;
    const lead = `My Decision Profile after ${count} case${count === 1 ? "" : "s"} on Decision Nodes:`;
    const body = portrait.replace(/\s+/g, " ").slice(0, 200);
    return `${lead} ${body}`;
  }, [portrait, profile.missionsCompleted]);

  const rasterize = async (): Promise<Blob | null> => {
    if (!svgRef.current) return null;
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", String(W));
    clone.setAttribute("height", String(H));
    const xml = new XMLSerializer().serializeToString(clone);
    const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    try {
      const img = new Image();
      img.decoding = "async";
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("svg load failed"));
        img.src = url;
      });
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = W * scale;
      canvas.height = H * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0, W, H);
      return await new Promise<Blob | null>((res) =>
        canvas.toBlob((b) => res(b), "image/png", 1.0),
      );
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const onDownload = async () => {
    setBusy("download");
    try {
      const blob = await rasterize();
      if (!blob) throw new Error("no blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "decision-profile.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast("Card downloaded.", {
        description: "Attach it to your post for the best look.",
      });
    } catch {
      toast("Couldn't render the card.", { description: "Try again in a moment." });
    } finally {
      setBusy(null);
    }
  };

  const onCopyImage = async () => {
    setBusy("copy");
    try {
      const blob = await rasterize();
      if (!blob) throw new Error("no blob");
      const ClipboardItemCtor =
        typeof window !== "undefined"
          ? (window as unknown as { ClipboardItem?: typeof ClipboardItem }).ClipboardItem
          : undefined;
      if (!navigator.clipboard?.write || !ClipboardItemCtor) {
        throw new Error("unsupported");
      }
      await navigator.clipboard.write([
        new ClipboardItemCtor({ "image/png": blob }),
      ]);
      toast("Image copied.", { description: "Paste it into your post." });
    } catch {
      toast("Image copy isn't supported here.", {
        description: "Download the card instead.",
      });
    } finally {
      setBusy(null);
    }
  };

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText,
  )}&url=${encodeURIComponent(shareUrl)}`;
  const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl,
  )}`;

  return (
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-2xl border border-foreground/15 bg-black/60 shadow-[0_24px_80px_-32px_oklch(0_0_0)]">
        <div className="aspect-[1200/630] w-full">
          <ShareCardSVG
            ref={svgRef}
            profile={profile}
            missionCodename={missionCodename}
            portrait={portrait}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[0.65rem] tracking-[0.35em] uppercase">
        <button
          type="button"
          onClick={onDownload}
          disabled={busy !== null}
          className="text-foreground/75 hover:text-foreground border-b border-foreground/30 hover:border-foreground pb-1 transition-colors disabled:opacity-50"
        >
          {busy === "download" ? "Rendering…" : "Download PNG"}
        </button>
        <button
          type="button"
          onClick={onCopyImage}
          disabled={busy !== null}
          className="text-foreground/55 hover:text-foreground border-b border-foreground/20 hover:border-foreground pb-1 transition-colors disabled:opacity-50"
        >
          {busy === "copy" ? "Copying…" : "Copy image"}
        </button>
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/55 hover:text-foreground border-b border-foreground/20 hover:border-foreground pb-1 transition-colors"
        >
          Share on X
        </a>
        <a
          href={liUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground/55 hover:text-foreground border-b border-foreground/20 hover:border-foreground pb-1 transition-colors"
        >
          Share on LinkedIn
        </a>
      </div>
      <p className="text-center text-[0.6rem] tracking-[0.25em] uppercase text-foreground/30">
        Download or copy the card, then attach it to your post.
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * The SVG.
 * ──────────────────────────────────────────────────────────────────── */

type SVGProps = {
  profile: DecisionProfile;
  missionCodename?: string;
  portrait: string;
};

const ShareCardSVG = ({
  profile,
  portrait,
  ref,
}: SVGProps & { ref?: React.Ref<SVGSVGElement> }) => {
  const values = DIMENSIONS.map((d) => profile.scores[d]);
  const labels = DIMENSIONS.map((d) => DIMENSION_LABELS[d]);
  const count = profile.missionsCompleted;

  // Radar — hero, left side, large.
  const cx = 305;
  const cy = H / 2 + 8;
  const rMax = 215;
  const n = values.length;
  const pointAt = (i: number, r: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  };
  const clamp01 = (v: number) => Math.max(0, Math.min(100, v)) / 100;
  const polyPts = values
    .map((v, i) => {
      const p = pointAt(i, clamp01(v) * rMax);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Right column — portrait is the hero of the right side.
  const rightX = 640;
  const rightW = 500;
  // Choose font size that fits portrait into 4 lines comfortably.
  const { lines: portraitLines, fontSize: portraitSize, lineHeight: portraitLH } =
    fitPortrait(portrait || "A portrait will emerge as you complete more cases.", rightW);

  // Vertically center the portrait block in the right column.
  const portraitBlockH = portraitLines.length * portraitLH;
  const portraitTop = (H - portraitBlockH) / 2 + portraitSize * 0.3;

  const sansStack =
    "'Inter Tight', 'Inter', system-ui, -apple-system, 'Helvetica Neue', sans-serif";
  const serifStack =
    "'Fraunces', 'Instrument Serif', Georgia, 'Times New Roman', serif";

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Decision Profile share card"
      style={{ display: "block", background: BG }}
    >
      <defs>
        <linearGradient id="plate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={BG_2} />
          <stop offset="100%" stopColor={BG} />
        </linearGradient>
        <radialGradient id="radarGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.18" />
          <stop offset="55%" stopColor={ACCENT} stopOpacity="0.04" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="portraitGlow" cx="40%" cy="50%" r="70%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.06" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x={0} y={0} width={W} height={H} fill="url(#plate)" />
      <circle cx={cx} cy={cy} r={rMax * 1.4} fill="url(#radarGlow)" />
      <rect x={rightX - 40} y={0} width={rightW + 80} height={H} fill="url(#portraitGlow)" />

      {/* Vertical divider between hero radar and portrait */}
      <line
        x1={600}
        y1={120}
        x2={600}
        y2={H - 120}
        stroke={FG}
        strokeOpacity={0.08}
      />

      {/* Top-left brand mark — restrained, well clear of radar labels */}
      <text
        x={48}
        y={56}
        fontFamily={serifStack}
        fontSize={22}
        fill={FG}
        opacity={0.95}
      >
        Decision Nodes
      </text>

      {/* Top-right case counter */}
      <text
        x={W - 48}
        y={56}
        textAnchor="end"
        fontFamily={sansStack}
        fontSize={11}
        letterSpacing={5}
        fill={ACCENT}
        opacity={0.85}
      >
        {`${count} CASE${count === 1 ? "" : "S"} ON RECORD`}
      </text>

      {/* Radar */}
      {rings.map((r, ri) => {
        const pts = Array.from({ length: n }, (_, i) => {
          const p = pointAt(i, r * rMax);
          return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
        }).join(" ");
        return (
          <polygon
            key={ri}
            points={pts}
            fill="none"
            stroke={FG}
            strokeOpacity={0.05 + ri * 0.025}
          />
        );
      })}
      {Array.from({ length: n }, (_, i) => {
        const p = pointAt(i, rMax);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke={FG}
            strokeOpacity={0.07}
          />
        );
      })}
      <polygon
        points={polyPts}
        fill={ACCENT}
        fillOpacity={0.26}
        stroke={ACCENT}
        strokeOpacity={0.95}
        strokeWidth={1.75}
        strokeLinejoin="round"
      />
      {values.map((v, i) => {
        const p = pointAt(i, clamp01(v) * rMax);
        return <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={ACCENT} />;
      })}
      {labels.map((label, i) => {
        const p = pointAt(i, rMax + 22);
        const short = label.length > 14 ? label.split(" ")[0] : label;
        const anchor =
          Math.abs(p.x - cx) < 10
            ? ("middle" as const)
            : p.x > cx
              ? ("start" as const)
              : ("end" as const);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontFamily={sansStack}
            fontSize={10}
            letterSpacing={2.6}
            fill={FG}
            opacity={0.55}
          >
            {short.toUpperCase()}
          </text>
        );
      })}

      {/* Right column — large editorial portrait */}
      {portraitLines.map((line, i) => (
        <text
          key={i}
          x={rightX}
          y={portraitTop + i * portraitLH}
          fontFamily={serifStack}
          fontSize={portraitSize}
          fill={FG}
          opacity={0.97}
        >
          {line}
        </text>
      ))}

      {/* Bottom-right URL — small, never crosses the chart */}
      <text
        x={W - 48}
        y={H - 36}
        textAnchor="end"
        fontFamily={sansStack}
        fontSize={11}
        letterSpacing={4}
        fill={MUTED}
      >
        decision-nodes.com
      </text>
    </svg>
  );
};

/** Fit portrait text into the right column. Tries decreasing font sizes
 *  until the text wraps into ≤ maxLines lines at the given max width. */
function fitPortrait(text: string, maxWidth: number) {
  // Approximate average serif glyph width as a fraction of font size.
  const avgGlyph = 0.5;
  const maxLines = 5;
  const sizes = [44, 40, 36, 32, 30, 28];
  for (const size of sizes) {
    const maxChars = Math.floor(maxWidth / (size * avgGlyph));
    const lines = wrap(text, maxChars);
    if (lines.length <= maxLines) {
      return { lines, fontSize: size, lineHeight: size * 1.22 };
    }
  }
  const last = 26;
  const maxChars = Math.floor(maxWidth / (last * avgGlyph));
  const lines = wrap(text, maxChars).slice(0, maxLines);
  return { lines, fontSize: last, lineHeight: last * 1.22 };
}

function wrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = w;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}
