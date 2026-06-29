// WhatHappenedFilm — the post-decision consequence timeline, rendered as a
// short film-noir sequence. Each of up to three beats is a full-bleed
// cinematic panel with its own AI-generated still, a slow Ken Burns pan,
// a vignette + grain pass, and the canon text overlaid in the product's
// display typography. Panels reveal on scroll so the sequence unfolds
// like a montage of consequence — immediate, medium-term, long-term.

import { useEffect, useRef, useState } from "react";
import beatImmediate from "@/assets/analysis/beat-immediate.jpg";
import beatMedium from "@/assets/analysis/beat-medium.jpg";
import beatLong from "@/assets/analysis/beat-long.jpg";

type Beat = { beat: string; consequence: string };

const HORIZONS: { numeral: string; label: string; image: string; pan: string }[] = [
  { numeral: "I", label: "Immediate",  image: beatImmediate, pan: "55% 50%" },
  { numeral: "II", label: "Medium term", image: beatMedium,    pan: "50% 55%" },
  { numeral: "III", label: "Long after", image: beatLong,      pan: "50% 45%" },
];

/** Map N beats (1–3) onto the three horizon stages. With 1 beat → just
 * "immediate"; with 2 → "immediate" + "long after"; with 3 → all three. */
function horizonsFor(count: number): typeof HORIZONS {
  if (count >= 3) return HORIZONS;
  if (count === 2) return [HORIZONS[0], HORIZONS[2]];
  return [HORIZONS[0]];
}

export function WhatHappenedFilm({ beats }: { beats: ReadonlyArray<Beat> }) {
  const stages = horizonsFor(beats.length);
  return (
    <section className="-mx-6 sm:-mx-10">
      <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-8 text-center">
        What happened
      </p>
      <div className="space-y-6 sm:space-y-8">
        {beats.slice(0, stages.length).map((b, i) => (
          <FilmPanel
            key={i}
            beat={b}
            stage={stages[i]}
            index={i}
            isLast={i === stages.length - 1}
          />
        ))}
      </div>
    </section>
  );
}

function FilmPanel({
  beat,
  stage,
  index,
  isLast,
}: {
  beat: Beat;
  stage: typeof HORIZONS[number];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Once a panel enters the viewport we light it; we never re-hide it,
    // so a scroll-back doesn't strobe the sequence.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Stagger each panel's reveal so the sequence feels paced rather than
  // popping in all at once if the section is short on tall screens.
  const enterDelay = `${index * 120}ms`;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-[#06070a] shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
      style={{ aspectRatio: "21 / 9", minHeight: "60svh" }}
    >
      {/* Image plate — continuous Ken Burns, fades in on enter. */}
      <div
        className={`absolute inset-0 transition-opacity duration-[2000ms] ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ transitionDelay: enterDelay }}
      >
        <img
          src={stage.image}
          alt=""
          aria-hidden
          width={1920}
          height={1088}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover animate-ken-burns"
          style={{ transformOrigin: stage.pan }}
        />
      </div>

      {/* Letterbox + vignette + bottom gradient for legibility. */}
      <div className="vignette" aria-hidden />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            "linear-gradient(to top, rgba(4,5,7,0.92) 0%, rgba(4,5,7,0.65) 38%, rgba(4,5,7,0) 100%)",
        }}
        aria-hidden
      />
      {/* Top whisper of black so the eyebrow tag has weight. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,5,7,0.55) 0%, rgba(4,5,7,0) 100%)",
        }}
        aria-hidden
      />

      {/* Frame line — single hairline at the bottom of every panel except the
          last, evoking the cut between film frames. */}
      {!isLast && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.18), transparent)" }}
          aria-hidden
        />
      )}

      {/* Text overlay. */}
      <div
        className={`absolute inset-0 flex flex-col justify-end px-6 sm:px-12 md:px-16 pb-8 sm:pb-12 md:pb-14 transition-[opacity,transform] duration-[1400ms] ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: `calc(${enterDelay} + 350ms)` }}
      >
        <div className="flex items-baseline gap-3 mb-3 sm:mb-4">
          <span className="font-display text-xs sm:text-sm tracking-[0.4em] uppercase text-accent/90">
            {stage.numeral}.
          </span>
          <span className="text-[0.55rem] sm:text-[0.6rem] tracking-[0.5em] uppercase text-foreground/55">
            {stage.label}
          </span>
          <span className="ml-2 h-px flex-1 bg-foreground/15" aria-hidden />
        </div>
        <p className="font-display text-xl sm:text-2xl md:text-3xl leading-snug text-foreground text-pretty drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] max-w-2xl">
          {beat.beat}
        </p>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-foreground/80 leading-relaxed text-pretty max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {beat.consequence}
        </p>
      </div>
    </div>
  );
}
