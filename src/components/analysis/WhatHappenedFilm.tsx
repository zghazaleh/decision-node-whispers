// WhatHappenedFilm — the post-decision consequence timeline, rendered as a
// three-frame film-noir sequence. The component pins a single full-viewport
// stage while the user scrolls a tall track. As scroll progresses, the
// active beat advances (1 → 2 → 3), each image cross-fading over the
// previous one with a slow Ken Burns pan continuing underneath. Only ONE
// image is visible at a time — the others are alpha-zero behind it — so
// the effect reads as cuts between movie frames, not a stacked list.

import { useEffect, useRef, useState } from "react";
import beatImmediate from "@/assets/analysis/beat-immediate.jpg";
import beatMedium from "@/assets/analysis/beat-medium.jpg";
import beatLong from "@/assets/analysis/beat-long.jpg";

type Beat = { beat: string; consequence: string };

const HORIZONS: { numeral: string; label: string; image: string; pan: string }[] = [
  { numeral: "I", label: "Immediate", image: beatImmediate, pan: "55% 50%" },
  { numeral: "II", label: "Medium term", image: beatMedium, pan: "50% 55%" },
  { numeral: "III", label: "Long after", image: beatLong, pan: "50% 45%" },
];

function horizonsFor(count: number): typeof HORIZONS {
  if (count >= 3) return HORIZONS;
  if (count === 2) return [HORIZONS[0], HORIZONS[2]];
  return [HORIZONS[0]];
}

export function WhatHappenedFilm({ beats }: { beats: ReadonlyArray<Beat> }) {
  const stages = horizonsFor(beats.length);
  const panels = beats.slice(0, stages.length).map((b, i) => ({
    beat: b,
    stage: stages[i],
  }));

  const trackRef = useRef<HTMLDivElement | null>(null);
  // Continuous progress 0 → panels.length-1 across the scroll track.
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Active region: from when the track top hits the viewport top, until
      // its bottom reaches the viewport bottom. While the sticky stage is
      // pinned, scroll travel inside the track maps linearly to progress.
      const total = rect.height - vh;
      if (total <= 0) {
        setProgress(0);
        return;
      }
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const t = (scrolled / total) * (panels.length - 1);
      setProgress(t);
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [panels.length]);

  // Track height: one viewport per panel so each beat gets a full screen of
  // scroll travel. Single-beat case collapses to one viewport (no scrub).
  const trackVh = Math.max(panels.length, 1) * 100;

  return (
    <section className="-mx-6 sm:-mx-10">
      <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-8 text-center">
        What happened
      </p>
      <div
        ref={trackRef}
        className="relative"
        style={{ height: `${trackVh}svh` }}
      >
        <div className="sticky top-0 h-svh w-full overflow-hidden bg-[#06070a]">
          {/* Image stack — all mounted, only the active one at full opacity. */}
          {panels.map((p, i) => {
            // Triangular opacity: peaks at i, falls off to 0 at i±1.
            const distance = Math.abs(progress - i);
            const opacity = Math.max(0, 1 - distance);
            return (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  opacity,
                  // Cross-fade is the cut; keep it snappy at the edges.
                  transition: "opacity 120ms linear",
                }}
                aria-hidden={opacity < 0.5}
              >
                <img
                  src={p.stage.image}
                  alt=""
                  aria-hidden
                  width={1920}
                  height={1088}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover animate-ken-burns"
                  style={{ transformOrigin: p.stage.pan }}
                />
              </div>
            );
          })}

          {/* Letterbox + vignette + bottom gradient for legibility. */}
          <div className="vignette pointer-events-none absolute inset-0" aria-hidden />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
            style={{
              background:
                "linear-gradient(to top, rgba(4,5,7,0.92) 0%, rgba(4,5,7,0.6) 38%, rgba(4,5,7,0) 100%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-32"
            style={{
              background:
                "linear-gradient(to bottom, rgba(4,5,7,0.6) 0%, rgba(4,5,7,0) 100%)",
            }}
            aria-hidden
          />

          {/* Frame counter — top-right, like a reel marker. */}
          <div className="pointer-events-none absolute top-6 right-6 sm:top-8 sm:right-10 flex items-center gap-3">
            <span className="text-[0.55rem] tracking-[0.5em] uppercase text-foreground/50">
              Reel
            </span>
            <span className="font-display text-xs tracking-[0.3em] text-accent/80">
              {String(Math.min(panels.length, Math.round(progress) + 1)).padStart(2, "0")}
              <span className="text-foreground/30"> / {String(panels.length).padStart(2, "0")}</span>
            </span>
          </div>

          {/* Text overlays — only the active panel's text is shown. */}
          {panels.map((p, i) => {
            const distance = Math.abs(progress - i);
            const visible = distance < 0.5;
            return (
              <div
                key={i}
                className="absolute inset-0 flex flex-col justify-end px-6 sm:px-12 md:px-20 pb-16 sm:pb-20 md:pb-24 transition-[opacity,transform] duration-500 ease-out"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  pointerEvents: visible ? "auto" : "none",
                }}
                aria-hidden={!visible}
              >
                <div className="flex items-baseline gap-3 mb-4 sm:mb-5">
                  <span className="font-display text-xs sm:text-sm tracking-[0.4em] uppercase text-accent/90">
                    {p.stage.numeral}.
                  </span>
                  <span className="text-[0.55rem] sm:text-[0.6rem] tracking-[0.5em] uppercase text-foreground/55">
                    {p.stage.label}
                  </span>
                  <span className="ml-2 h-px flex-1 bg-foreground/15" aria-hidden />
                </div>
                <p className="font-display text-2xl sm:text-3xl md:text-4xl leading-snug text-foreground text-pretty drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] max-w-3xl">
                  {p.beat.beat}
                </p>
                <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-foreground/85 leading-relaxed text-pretty max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                  {p.beat.consequence}
                </p>
              </div>
            );
          })}

          {/* Scroll affordance — only while there's more to reveal. */}
          {panels.length > 1 && (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-5 flex flex-col items-center gap-2 transition-opacity duration-500"
              style={{ opacity: progress > panels.length - 1.15 ? 0 : 0.7 }}
              aria-hidden
            >
              <span className="text-[0.5rem] tracking-[0.5em] uppercase text-foreground/50">
                Scroll
              </span>
              <span className="h-6 w-px bg-foreground/30" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
