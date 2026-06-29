import { useRef, useState, useEffect } from "react";
import type { MissionMeta } from "@/lib/missions";

import businessPowerImg from "@/assets/themes/theme-business-power.jpg";
import politicsWarImg from "@/assets/themes/theme-politics-war.jpg";
import moralDilemmasImg from "@/assets/themes/theme-moral-dilemmas.jpg";
import lifeChangingImg from "@/assets/themes/theme-life-changing.jpg";
import loveLoyaltyImg from "@/assets/themes/theme-love-loyalty.jpg";
import frontierFutureImg from "@/assets/themes/theme-frontier-future.jpg";

const THEME_IMAGES: Record<string, string> = {
  "Business & Power": businessPowerImg,
  "Politics & War": politicsWarImg,
  "Moral Dilemmas": moralDilemmasImg,
  "Life-Changing Moments": lifeChangingImg,
  "Love & Loyalty": loveLoyaltyImg,
  "Frontier & Future": frontierFutureImg,
};

interface ThemeCarouselProps {
  groups: { label: string; caption?: string; ids: string[] }[];
  missions: MissionMeta[];
  activeGroup: string | null;
  onSelectGroup: (label: string | null) => void;
}

export function ThemeCarousel({
  groups,
  missions,
  activeGroup,
  onSelectGroup,
}: ThemeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const activeIds = new Set(
    activeGroup
      ? groups.find((g) => g.label === activeGroup)?.ids ?? []
      : [],
  );

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  return (
    <section className="mb-10" aria-label="Curated themes">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-[0.55rem] tracking-[0.4em] uppercase text-accent/90">
          Curated themes
        </span>
        <span className="h-px flex-1 bg-accent/15" aria-hidden />
        {activeGroup && (
          <button
            type="button"
            onClick={() => onSelectGroup(null)}
            className="text-[0.55rem] tracking-[0.35em] uppercase text-muted-foreground/50 hover:text-accent transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="relative -mx-6 sm:-mx-10">
        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-6 pb-2 sm:gap-5 sm:px-10"
          style={{
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
          }}
        >
          {groups.map((g) => {
            const availableCount = g.ids
              .map((id) => missions.find((m) => m.id === id))
              .filter((m): m is MissionMeta => !!m && m.status === "available")
              .length;
            if (availableCount === 0) return null;

            const isActive = activeGroup === g.label;
            const img = THEME_IMAGES[g.label];

            return (
              <button
                key={g.label}
                type="button"
                onClick={() => onSelectGroup(isActive ? null : g.label)}
                aria-pressed={isActive}
                className={`group relative shrink-0 w-[260px] snap-start overflow-hidden rounded-[14px] border text-left transition-all duration-300 sm:w-[300px] ${
                  isActive
                    ? "border-accent/60 ring-1 ring-accent/30"
                    : "border-foreground/10 hover:border-accent/40"
                }`}
              >
                {/* Image background */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  {img && (
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      width={1024}
                      height={576}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  {/* Bottom scrim for text */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(6,8,12,0.15) 0%, rgba(6,8,12,0.55) 60%, rgba(6,8,12,0.88) 100%)",
                    }}
                  />
                  {/* Top accent line */}
                  <div
                    aria-hidden
                    className={`absolute left-0 top-0 h-[2px] w-full transition-opacity duration-300 ${
                      isActive ? "opacity-100 bg-accent/80" : "opacity-0 group-hover:opacity-60 bg-accent/50"
                    }`}
                  />
                  {/* Content */}
                  <div className="absolute inset-x-0 bottom-0 px-4 pb-4 sm:px-5 sm:pb-5">
                    <span className="text-[0.5rem] tracking-[0.4em] uppercase text-foreground/70">
                      {availableCount} {availableCount === 1 ? "case" : "cases"}
                    </span>
                    <h3 className="mt-1 font-display text-lg leading-[1.15] text-foreground sm:text-xl">
                      {g.label}
                    </h3>
                    {g.caption && (
                      <p className="mt-1 text-[0.65rem] italic text-muted-foreground/80">
                        {g.caption}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right-edge fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background via-background/70 to-transparent sm:w-16"
        />

        {/* Arrow buttons */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollBy("left")}
            aria-label="Scroll left"
            className="absolute left-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-foreground/20 bg-background/80 text-foreground/70 backdrop-blur transition-colors hover:border-accent/50 hover:text-accent sm:left-4"
          >
            ‹
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollBy("right")}
            aria-label="Scroll right"
            className="absolute right-2 top-1/2 z-10 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-foreground/20 bg-background/80 text-foreground/70 backdrop-blur transition-colors hover:border-accent/50 hover:text-accent sm:right-4"
          >
            ›
          </button>
        )}
      </div>
    </section>
  );
}
