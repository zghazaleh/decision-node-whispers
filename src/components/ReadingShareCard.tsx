import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { themeTint } from "@/lib/discovery/theme-tint";

/**
 * ReadingShareCard — a poster of the decision itself.
 * 1200x630, dark cinematic. Shows the case title, the player's archetype
 * (the decision they made), and the analysis headline (a clean hook line
 * about HOW they decided — no consequence spoilers).
 */

const W = 1200;
const H = 630;

const BG = "#070808";
const BG_2 = "#0d0e10";
const FG = "#f5f1e8";
const MUTED = "#7a7368";

type Props = {
  caseTitle: string;
  caseNumber?: string;
  theme?: string;
  archetypeLabel?: string;
  headline: string;
};

export function ReadingShareCard({
  caseTitle,
  caseNumber,
  theme,
  archetypeLabel,
  headline,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [busy, setBusy] = useState<null | "download" | "copy" | "share">(null);
  const [canCopyImage, setCanCopyImage] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as { ClipboardItem?: typeof ClipboardItem };
    const hasApi =
      typeof w.ClipboardItem !== "undefined" &&
      typeof navigator.clipboard?.write === "function";
    const ua = navigator.userAgent || "";
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (/Macintosh/.test(ua) &&
        (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints! > 1);
    setCanCopyImage(hasApi && !isIOS);

    try {
      const nav = navigator as Navigator & {
        share?: (data: ShareData) => Promise<void>;
        canShare?: (data: ShareData) => boolean;
      };
      if (typeof nav.share === "function") {
        if (typeof nav.canShare === "function") {
          const probe = new File([new Uint8Array([0])], "probe.png", { type: "image/png" });
          setCanNativeShare(nav.canShare({ files: [probe] }));
        } else {
          setCanNativeShare(true);
        }
      }
    } catch {
      setCanNativeShare(false);
    }
  }, []);

  const shareUrl =
    typeof window !== "undefined" && window.location.origin.includes("decision-nodes")
      ? `${window.location.origin}/`
      : "https://decision-nodes.com/";

  const shareText = useMemo(() => {
    const lead = archetypeLabel
      ? `${archetypeLabel} — ${caseTitle}.`
      : `${caseTitle}.`;
    const body = headline.replace(/\s+/g, " ").slice(0, 200);
    return `${lead} ${body}`;
  }, [archetypeLabel, caseTitle, headline]);

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
      a.download = "decision-reading.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      toast("Card downloaded.", { description: "Attach it to your post." });
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
      const Ctor =
        typeof window !== "undefined"
          ? (window as unknown as { ClipboardItem?: typeof ClipboardItem }).ClipboardItem
          : undefined;
      if (!navigator.clipboard?.write || !Ctor) throw new Error("unsupported");
      await navigator.clipboard.write([new Ctor({ "image/png": blob })]);
      toast("Image copied.", { description: "Paste it into your post." });
    } catch {
      toast("Image copy isn't supported here.", { description: "Download the card instead." });
    } finally {
      setBusy(null);
    }
  };

  const onNativeShare = async () => {
    setBusy("share");
    try {
      const blob = await rasterize();
      if (!blob) throw new Error("no blob");
      const file = new File([blob], "decision-reading.png", { type: "image/png" });
      const nav = navigator as Navigator & {
        share?: (data: ShareData) => Promise<void>;
        canShare?: (data: ShareData) => boolean;
      };
      const payload: ShareData = {
        files: [file],
        title: caseTitle,
        text: shareText,
        url: shareUrl,
      };
      if (nav.canShare && !nav.canShare(payload)) {
        await nav.share!({ title: payload.title, text: payload.text, url: payload.url });
      } else {
        await nav.share!(payload);
      }
    } catch (err) {
      if ((err as DOMException)?.name !== "AbortError") {
        toast("Couldn't open the share sheet.", { description: "Try Download instead." });
      }
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
          <ReadingCardSVG
            ref={svgRef}
            caseTitle={caseTitle}
            caseNumber={caseNumber}
            theme={theme}
            archetypeLabel={archetypeLabel}
            headline={headline}
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
        {canNativeShare && (
          <button
            type="button"
            onClick={onNativeShare}
            disabled={busy !== null}
            className="inline-flex items-center gap-2 text-foreground/75 hover:text-foreground border-b border-foreground/30 hover:border-foreground pb-1 transition-colors disabled:opacity-50"
          >
            <svg aria-hidden viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v13" />
              <path d="M7 8l5-5 5 5" />
              <path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
            </svg>
            {busy === "share" ? "Opening…" : "Share via…"}
          </button>
        )}
        {canCopyImage && (
          <button
            type="button"
            onClick={onCopyImage}
            disabled={busy !== null}
            className="text-foreground/55 hover:text-foreground border-b border-foreground/20 hover:border-foreground pb-1 transition-colors disabled:opacity-50"
          >
            {busy === "copy" ? "Copying…" : "Copy image"}
          </button>
        )}
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
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * SVG
 * ──────────────────────────────────────────────────────────────────── */

type SVGProps = {
  caseTitle: string;
  caseNumber?: string;
  theme?: string;
  archetypeLabel?: string;
  headline: string;
};

const ReadingCardSVG = ({
  caseTitle,
  caseNumber,
  theme,
  archetypeLabel,
  headline,
  ref,
}: SVGProps & { ref?: React.Ref<SVGSVGElement> }) => {
  const tint = themeTint(theme);
  // Approximate hex from theme — for SVG we can use the oklch strings directly,
  // browsers support them in stop-color in modern engines and we rasterize via
  // canvas which accepts them.
  const accent = tint.label; // oklch high-chroma readable tint
  const accentSoft = tint.glow;

  const serifStack = "'Fraunces', 'Instrument Serif', Georgia, 'Times New Roman', serif";
  const sansStack = "'Inter Tight', 'Inter', system-ui, -apple-system, 'Helvetica Neue', sans-serif";

  // Layout: editorial poster.
  // Top brand bar. Center hook line (headline) — biggest type.
  // Below: archetype label (small caps, accent).
  // Bottom: case number + title (right aligned), domain (left).
  const pad = 64;

  // Fit headline into 3 lines max at large size.
  const { lines, fontSize, lineHeight } = fitHeadline(headline, W - pad * 2);
  const blockH = lines.length * lineHeight;
  // Vertically centred-ish, slightly above middle.
  const startY = H / 2 - blockH / 2 + fontSize * 0.55;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Decision reading share card"
      style={{ display: "block", background: BG }}
    >
      <defs>
        <linearGradient id="rc-plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BG_2} />
          <stop offset="100%" stopColor={BG} />
        </linearGradient>
        <radialGradient id="rc-glow" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor={accentSoft} stopOpacity="0.55" />
          <stop offset="60%" stopColor={accentSoft} stopOpacity="0.12" />
          <stop offset="100%" stopColor={accentSoft} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x={0} y={0} width={W} height={H} fill="url(#rc-plate)" />
      <rect x={0} y={0} width={W} height={H} fill="url(#rc-glow)" />

      {/* Top hairline */}
      <line x1={pad} y1={88} x2={W - pad} y2={88} stroke={FG} strokeOpacity={0.1} />

      {/* Brand mark */}
      <text x={pad} y={64} fontFamily={serifStack} fontSize={22} fill={FG} opacity={0.92}>
        Decision Nodes
      </text>
      <text
        x={W - pad}
        y={64}
        textAnchor="end"
        fontFamily={sansStack}
        fontSize={11}
        letterSpacing={5}
        fill={accent}
      >
        A READING
      </text>

      {/* Headline — the hook */}
      {lines.map((line, i) => (
        <text
          key={i}
          x={W / 2}
          y={startY + i * lineHeight}
          textAnchor="middle"
          fontFamily={serifStack}
          fontSize={fontSize}
          fill={FG}
          opacity={0.97}
        >
          {line}
        </text>
      ))}

      {/* Archetype label below headline */}
      {archetypeLabel && (
        <text
          x={W / 2}
          y={startY + blockH + 36}
          textAnchor="middle"
          fontFamily={sansStack}
          fontSize={13}
          letterSpacing={6}
          fill={accent}
          opacity={0.95}
        >
          {archetypeLabel.toUpperCase()}
        </text>
      )}

      {/* Bottom hairline */}
      <line x1={pad} y1={H - 88} x2={W - pad} y2={H - 88} stroke={FG} strokeOpacity={0.1} />

      {/* Case stamp — bottom right */}
      <text
        x={W - pad}
        y={H - 56}
        textAnchor="end"
        fontFamily={sansStack}
        fontSize={10}
        letterSpacing={5}
        fill={MUTED}
      >
        {caseNumber ? `CASE ${caseNumber}` : "CASE FILE"}
      </text>
      <text
        x={W - pad}
        y={H - 34}
        textAnchor="end"
        fontFamily={serifStack}
        fontSize={20}
        fill={FG}
        opacity={0.85}
      >
        {caseTitle}
      </text>

      {/* Domain — bottom left */}
      <text
        x={pad}
        y={H - 40}
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

/** Fit headline text into ≤3 lines at the largest size that wraps cleanly. */
function fitHeadline(text: string, maxWidth: number) {
  const avgGlyph = 0.5;
  const maxLines = 3;
  const sizes = [68, 60, 54, 48, 44, 40, 36];
  for (const size of sizes) {
    const maxChars = Math.floor(maxWidth / (size * avgGlyph));
    const lines = wrap(text, maxChars);
    if (lines.length <= maxLines) {
      return { lines, fontSize: size, lineHeight: size * 1.18 };
    }
  }
  const last = 34;
  const maxChars = Math.floor(maxWidth / (last * avgGlyph));
  const lines = wrap(text, maxChars).slice(0, maxLines);
  return { lines, fontSize: last, lineHeight: last * 1.18 };
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
