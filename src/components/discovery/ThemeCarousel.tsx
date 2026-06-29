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

export interface ThemeRowState {
  isOpen: boolean;
  isHovered: boolean;
  onHover: (h: boolean) => void;
  onToggle: () => void;
  onEnter: () => void;
}

interface ThemeCarouselProps {
  groups: { label: string; caption?: string; ids: string[] }[];
  missions: MissionMeta[];
  onEnter: (missionId: string) => void;
  renderRow: (mission: MissionMeta, state: ThemeRowState) => React.ReactNode;
}

export function ThemeCarousel({
  groups,
  missions,
  onEnter,
  renderRow,
}: ThemeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Track which cards have already been handled by touch so the
  // follow-up synthetic click (if any) is ignored.
  const touchFiredRef = useRef<Set<string>>(new Set());

  const handleTap = (label: string, isActive: boolean) => {
    setExpandedGroup(isActive ? null : label);
    setOpenId(null);
    setHoveredId(null);
  };

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

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  const expanded = expandedGroup
    ? groups.find((g) => g.label === expandedGroup) ?? null
    : null;
  const expandedMissions = expanded
    ? expanded.ids
        .map((id) => missions.find((m) => m.id === id))
        .filter((m): m is MissionMeta => !!m && m.status === "available")
    : [];

  return (
    <section className="mb-10" aria-label="Curated themes">
      <div className="mb-4 flex items-center gap-3">
        <span className="text-[0.55rem] tracking-[0.4em] uppercase text-accent/90">
          Curated themes
        </span>
        <span className="h-px flex-1 bg-accent/15" aria-hidden />
        {expandedGroup && (
          <button
            type="button"
            onClick={() => setExpandedGroup(null)}
            className="text-[0.55rem] tracking-[0.35em] uppercase text-muted-foreground/50 hover:text-accent transition-colors"
          >
            Close
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

            const isActive = expandedGroup === g.label;
            const img = THEME_IMAGES[g.label];

            return (
              <button
                key={g.label}
                type="button"
                onClick={() => {
                  if (touchFiredRef.current.has(g.label)) {
                    touchFiredRef.current.delete(g.label);
                    return;
                  }
                  handleTap(g.label, isActive);
                }}
                onTouchStart={(e) => {
                  const t = e.changedTouches[0];
                  if (!t) return;
                  (e.currentTarget as HTMLElement).dataset.tx = String(t.clientX);
                  (e.currentTarget as HTMLElement).dataset.ty = String(t.clientY);
                }}
                onTouchEnd={(e) => {
                  const startX = Number((e.currentTarget as HTMLElement).dataset.tx);
                  const startY = Number((e.currentTarget as HTMLElement).dataset.ty);
                  const t = e.changedTouches[0];
                  if (!t || Number.isNaN(startX)) return;
                  const dx = Math.abs(t.clientX - startX);
                  const dy = Math.abs(t.clientY - startY);
                  // If the finger barely moved, treat it as a tap.
                  if (dx < 10 && dy < 10) {
                    e.preventDefault();
                    touchFiredRef.current.add(g.label);
                    handleTap(g.label, isActive);
                  }
                }}
                aria-expanded={isActive}
                className={`group relative shrink-0 w-[240px] snap-start overflow-hidden rounded-[12px] border text-left transition-all duration-300 sm:w-[260px] ${
                  isActive
                    ? "border-accent/60 ring-1 ring-accent/30"
                    : "border-foreground/10 hover:border-accent/40"
                }`}
              >
                {/* Image background */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0b0d10]">
                  {img && (
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      width={1024}
                      height={1280}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-16"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(6,8,12,0.55) 0%, rgba(6,8,12,0) 100%)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-2/3"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(6,8,12,0) 0%, rgba(6,8,12,0.65) 60%, rgba(6,8,12,0.92) 100%)",
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
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-[0.5rem] tracking-[0.4em] uppercase text-foreground/70">
                      {availableCount} {availableCount === 1 ? "case" : "cases"}
                    </span>
                    <h3 className="mt-1 font-display text-lg leading-[1.1] text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                      {g.label}
                    </h3>
                    {g.caption && (
                      <p className="mt-1 text-[0.55rem] tracking-[0.35em] uppercase text-foreground/75">
                        {g.caption}
                      </p>
                    )}
                    <span
                      className={`mt-2 inline-flex items-center gap-1.5 text-[0.5rem] tracking-[0.4em] uppercase transition-colors ${
                        isActive
                          ? "text-accent"
                          : "text-accent/75 group-hover:text-accent"
                      }`}
                    >
                      {isActive ? "Open" : "Tap to explore"}
                      <span
                        aria-hidden
                        className={`transition-transform ${
                          isActive ? "rotate-90" : "group-hover:translate-x-0.5"
                        }`}
                      >
                        →
                      </span>
                    </span>
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

      {/* Expanded theme panel — cases inside the selected theme. */}
      {expanded && (
        <div className="mt-5 rounded-[14px] border border-accent/25 bg-foreground/[0.02] p-5 sm:p-6">
          <div className="mb-4 flex items-baseline justify-between gap-3">
            <div>
              <h3 className="font-display text-lg text-foreground sm:text-xl">
                {expanded.label}
              </h3>
              {expanded.caption && (
                <p className="mt-1 text-[0.7rem] italic text-muted-foreground/80">
                  {expanded.caption}
                </p>
              )}
            </div>
            <span className="text-[0.55rem] tracking-[0.4em] uppercase text-muted-foreground/55 tabular-nums">
              {expandedMissions.length}{" "}
              {expandedMissions.length === 1 ? "case" : "cases"}
            </span>
          </div>

          <ul className="flex flex-col gap-3">
            {expandedMissions.map((m) =>
              renderRow(m, {
                isOpen: openId === m.id,
                isHovered: hoveredId === m.id,
                onHover: (h) => setHoveredId(h ? m.id : null),
                onToggle: () =>
                  setOpenId((cur) => (cur === m.id ? null : m.id)),
                onEnter: () => onEnter(m.id),
              }),
            )}
          </ul>
        </div>
      )}
    </section>
  );
}
