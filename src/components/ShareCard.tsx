import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  type DecisionProfile,
} from "@/lib/decision-profile";

/**
 * ShareCard — a 1200×630 social-share card showing the player's 8-axis
 * Decision Profile radar and portrait statement. The SVG below is the
 * source of truth: it renders as the on-screen preview AND is rasterized
 * to PNG for download / clipboard / share-sheet.
 *
 * Everything is inline (no external fonts, no CSS variables) so the PNG
 * is reproducible across browsers without webfont-loading races.
 */

const W = 1200;
const H = 630;

// Hardcoded palette — must match the product's cinematic dark identity
// without depending on CSS variables (which canvas rasterization drops).
const BG = "#070808";
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
      const scale = 2; // retina-quality export
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
        typeof window !== "undefined" ? (window as unknown as { ClipboardItem?: typeof ClipboardItem }).ClipboardItem : undefined;
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
 * The SVG. Self-contained, no external assets, no CSS variables.
 * ──────────────────────────────────────────────────────────────────── */

type SVGProps = {
  profile: DecisionProfile;
  missionCodename?: string;
  portrait: string;
};

const ShareCardSVG = ({
  profile,
  missionCodename,
  portrait,
  ref,
}: SVGProps & { ref?: React.Ref<SVGSVGElement> }) => {
  const values = DIMENSIONS.map((d) => profile.scores[d]);
  const labels = DIMENSIONS.map((d) => DIMENSION_LABELS[d]);
  const count = profile.missionsCompleted;

  // Radar geometry — left half of the card.
  const cx = 330;
  const cy = H / 2 + 10;
  const rMax = 200;
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

  // Wrap the portrait into ~3 lines for the right column.
  const portraitLines = wrap(
    portrait || "A portrait will emerge as you complete more cases.",
    44,
    4,
  );

  // Right-column geometry.
  const rightX = 640;
  const rightWidth = 500;

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
      {/* Background plate + cinematic vignettes */}
      <defs>
        <radialGradient id="vignette" cx="20%" cy="50%" r="80%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.08" />
          <stop offset="60%" stopColor={ACCENT} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="topglow" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.05" />
          <stop offset="70%" stopColor={ACCENT} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hairline" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={FG} stopOpacity="0" />
          <stop offset="50%" stopColor={FG} stopOpacity="0.35" />
          <stop offset="100%" stopColor={FG} stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x={0} y={0} width={W} height={H} fill={BG} />
      <rect x={0} y={0} width={W} height={H} fill="url(#vignette)" />
      <rect x={0} y={0} width={W} height={H} fill="url(#topglow)" />

      {/* Outer frame — restrained, prestige-print feel */}
      <rect
        x={32}
        y={32}
        width={W - 64}
        height={H - 64}
        fill="none"
        stroke={FG}
        strokeOpacity={0.12}
      />

      {/* Top label strip */}
      <text
        x={64}
        y={84}
        fontFamily={sansStack}
        fontSize={14}
        letterSpacing={6}
        fill={ACCENT}
        opacity={0.85}
      >
        DECISION PROFILE
      </text>
      <text
        x={W - 64}
        y={84}
        textAnchor="end"
        fontFamily={sansStack}
        fontSize={12}
        letterSpacing={4}
        fill={FG}
        opacity={0.5}
      >
        {`${count} CASE${count === 1 ? "" : "S"} ON RECORD`}
      </text>

      {/* Radar — left half */}
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
            strokeOpacity={0.06 + ri * 0.025}
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
            strokeOpacity={0.08}
          />
        );
      })}
      <polygon
        points={polyPts}
        fill={ACCENT}
        fillOpacity={0.22}
        stroke={ACCENT}
        strokeOpacity={0.9}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      {values.map((v, i) => {
        const p = pointAt(i, clamp01(v) * rMax);
        return (
          <circle key={i} cx={p.x} cy={p.y} r={3.5} fill={ACCENT} />
        );
      })}
      {labels.map((label, i) => {
        const p = pointAt(i, rMax + 26);
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
            fontSize={11}
            letterSpacing={2.4}
            fill={FG}
            opacity={0.6}
          >
            {short.toUpperCase()}
          </text>
        );
      })}

      {/* Right column — portrait statement */}
      <text
        x={rightX}
        y={170}
        fontFamily={sansStack}
        fontSize={11}
        letterSpacing={4}
        fill={ACCENT}
        opacity={0.8}
      >
        PORTRAIT SO FAR
      </text>
      <line
        x1={rightX}
        y1={188}
        x2={rightX + 80}
        y2={188}
        stroke={ACCENT}
        strokeOpacity={0.6}
      />

      {portraitLines.map((line, i) => (
        <text
          key={i}
          x={rightX}
          y={232 + i * 44}
          fontFamily={serifStack}
          fontSize={30}
          fill={FG}
          opacity={0.95}
        >
          {line}
        </text>
      ))}

      {missionCodename && (
        <text
          x={rightX}
          y={232 + portraitLines.length * 44 + 36}
          fontFamily={sansStack}
          fontSize={11}
          letterSpacing={4}
          fill={FG}
          opacity={0.45}
        >
          {`AFTER · ${missionCodename.toUpperCase()}`}
        </text>
      )}

      {/* Footer wordmark */}
      <line
        x1={64}
        y1={H - 110}
        x2={W - 64}
        y2={H - 110}
        stroke="url(#hairline)"
      />
      <text
        x={64}
        y={H - 60}
        fontFamily={serifStack}
        fontSize={32}
        fill={FG}
        opacity={0.95}
      >
        Decision Nodes
      </text>
      <text
        x={64}
        y={H - 36}
        fontFamily={sansStack}
        fontSize={11}
        letterSpacing={5}
        fill={MUTED}
      >
        AN INTERACTIVE DRAMA
      </text>
      <text
        x={W - 64}
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

/** Naive word-wrap to a max line length, capped at `maxLines`. The final
 *  line is ellipsized if content remains. */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const next = current ? `${current} ${w}` : w;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = w;
      if (lines.length === maxLines - 1) break;
    } else {
      current = next;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  // If we broke out early, append the remainder ellipsized.
  const joined = lines.join(" ");
  if (joined.length < text.length && lines.length === maxLines - 1) {
    const tail = text.slice(joined.length).trim();
    const trimmed =
      tail.length > maxChars ? `${tail.slice(0, maxChars - 1).trimEnd()}…` : tail;
    lines.push(trimmed);
  } else if (joined.length < text.length && lines[lines.length - 1]) {
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.,;:!?\s]+$/, "")}…`;
  }
  return lines;
}
