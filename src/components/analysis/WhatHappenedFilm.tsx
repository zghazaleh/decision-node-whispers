// WhatHappenedFilm — the post-decision consequence timeline, rendered as a
// three-frame film-noir sequence. The beats auto-advance (with a brief
// page-flip whoosh between frames) and the player can also tap/click to
// advance manually. Each beat is a full-viewport cinematic image with the
// text overlaid; the transition is a horizontal flip/slide, like a film
// frame being pulled across the gate.

import { useCallback, useEffect, useRef, useState } from "react";
import { audio } from "@/lib/audio/director";
import beatImmediate from "@/assets/analysis/beat-immediate.jpg";
import beatMedium from "@/assets/analysis/beat-medium.jpg";
import beatLong from "@/assets/analysis/beat-long.jpg";

type Beat = { beat: string; consequence: string };

const HORIZONS: { numeral: string; label: string; image: string; pan: string }[] = [
  { numeral: "I", label: "Immediate", image: beatImmediate, pan: "55% 50%" },
  { numeral: "II", label: "Medium term", image: beatMedium, pan: "50% 55%" },
  { numeral: "III", label: "Long after", image: beatLong, pan: "50% 45%" },
];

const AUTO_ADVANCE_MS = 5200;

function horizonsFor(count: number): typeof HORIZONS {
  if (count >= 3) return HORIZONS;
  if (count === 2) return [HORIZONS[0], HORIZONS[2]];
  return [HORIZONS[0]];
}

function playFlipSound() {
  void audio.playFlip({ gain: 0.18 });
}

export function WhatHappenedFilm({ beats }: { beats: ReadonlyArray<Beat> }) {
  const stages = horizonsFor(beats.length);
  const panels = beats.slice(0, stages.length).map((b, i) => ({
    beat: b,
    stage: stages[i],
  }));

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const timerRef = useRef<number | null>(null);
  const total = panels.length;

  const goTo = useCallback(
    (next: number, dir: 1 | -1) => {
      if (next < 0 || next >= total) return;
      setDirection(dir);
      setIndex(next);
      playFlipSound();
    },
    [total],
  );

  const advance = useCallback(() => {
    setIndex((prev) => {
      if (prev >= total - 1) return prev;
      setDirection(1);
      playFlipSound();
      return prev + 1;
    });
  }, [total]);

  // Auto-advance until the last frame is reached, then settle.
  useEffect(() => {
    if (total <= 1) return;
    if (index >= total - 1) return;
    timerRef.current = window.setTimeout(advance, AUTO_ADVANCE_MS);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, total, advance]);

  // Keyboard support: left/right arrows.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(index + 1, 1);
      else if (e.key === "ArrowLeft") goTo(index - 1, -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo]);

  const onStageClick = () => {
    if (index >= total - 1) {
      // After the final frame, tapping loops back to the first.
      goTo(0, 1);
    } else {
      goTo(index + 1, 1);
    }
  };

  return (
    <section className="-mx-6 sm:-mx-10">
      <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-8 text-center">
        What happened
      </p>
      <div
        className="relative h-[72svh] sm:h-[78svh] max-h-[680px] w-full overflow-hidden bg-[#06070a] select-none cursor-pointer touch-manipulation"
        onClick={onStageClick}
        role="button"
        tabIndex={0}
        aria-label={`Frame ${index + 1} of ${total}. Tap to advance.`}
        style={{ perspective: "1600px" }}
      >
        {panels.map((p, i) => {
          const offset = i - index;
          const isActive = i === index;
          // Frames behind the active one flip out to the opposite side of
          // the incoming direction; frames ahead wait off to the right.
          let translate = 0;
          let rotate = 0;
          let opacity = 0;
          if (offset === 0) {
            translate = 0;
            rotate = 0;
            opacity = 1;
          } else if (offset < 0) {
            translate = -100 * Math.min(1, Math.abs(offset));
            rotate = -18;
            opacity = 0;
          } else {
            translate = 100 * Math.min(1, offset);
            rotate = 18 * direction;
            opacity = 0;
          }
          return (
            <div
              key={i}
              className="absolute inset-0 will-change-transform"
              style={{
                transform: `translate3d(${translate}%, 0, 0) rotateY(${rotate}deg)`,
                transformOrigin: offset < 0 ? "right center" : "left center",
                opacity,
                transition:
                  "transform 850ms cubic-bezier(0.7, 0.05, 0.2, 1), opacity 600ms ease-out",
                backfaceVisibility: "hidden",
              }}
              aria-hidden={!isActive}
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

              {/* Text overlay for this frame. */}
              <div className="absolute inset-0 flex flex-col justify-end px-5 sm:px-10 md:px-16 pb-20 sm:pb-24">
                <div className="flex items-baseline gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="font-display text-[0.65rem] sm:text-xs tracking-[0.35em] uppercase text-accent/90">
                    {p.stage.numeral}.
                  </span>
                  <span className="text-[0.55rem] sm:text-[0.6rem] tracking-[0.5em] uppercase text-foreground/55">
                    {p.stage.label}
                  </span>
                  <span className="ml-2 h-px flex-1 bg-foreground/15" aria-hidden />
                </div>
                <p className="font-display text-xl sm:text-2xl md:text-3xl leading-snug text-foreground text-pretty drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] max-w-3xl">
                  {p.beat.beat}
                </p>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-foreground/85 leading-relaxed text-pretty max-w-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                  {p.beat.consequence}
                </p>
              </div>
            </div>
          );
        })}

        {/* Reel counter — top-right. */}
        <div className="pointer-events-none absolute top-6 right-6 sm:top-8 sm:right-10 flex items-center gap-3 z-10">
          <span className="text-[0.55rem] tracking-[0.5em] uppercase text-foreground/50">
            Reel
          </span>
          <span className="font-display text-xs tracking-[0.3em] text-accent/80">
            {String(index + 1).padStart(2, "0")}
            <span className="text-foreground/30"> / {String(total).padStart(2, "0")}</span>
          </span>
        </div>

        {/* Frame pips — bottom center, clickable jump. */}
        {total > 1 && (
          <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-3">
            {panels.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(i, i > index ? 1 : -1);
                }}
                aria-label={`Go to frame ${i + 1}`}
                className="group p-2"
              >
                <span
                  className={`block h-px transition-all ${
                    i === index
                      ? "w-10 bg-accent"
                      : "w-6 bg-foreground/30 group-hover:bg-foreground/60"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
