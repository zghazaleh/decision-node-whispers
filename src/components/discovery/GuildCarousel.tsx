import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MissionMeta } from "@/lib/missions";
import { SceneArt } from "./scene-art";
import { DifficultyDots } from "./difficulty-dots";
import {
  getResonance,
  resonanceCopy,
  logImpression,
} from "@/lib/discovery/signals";
import { getSceneSrc, shortDuration, toneWord } from "@/lib/discovery/helpers";

/**
 * Guild carousel — a quieter, more cinematic replacement for the bare
 * horizontal rail. A compact strip of poster thumbnails sits below an
 * eyebrow rule; one tile is "spotlit" at a time and the spotlight drifts
 * forward every few seconds (paused on hover / focus / once the user
 * clicks). Tapping any tile expands that case in place — same shape as a
 * ledger row's open state — and only the dedicated Enter affordance
 * navigates into the mission.
 *
 *   - cards are smaller and uniform so a full row fits on common widths
 *   - the active tile lifts, brightens, and gains an accent rule
 *   - opening a case never leaves the page; it reveals the HeroDetail panel
 */
export function GuildCarousel({
  label,
  rightEyebrow,
  items,
  onEnter,
  onActiveChange,
  loading = false,
  error = null,
  onRetry,
  emptyCopy = "No fresh cases tonight. Check back when the Guild stirs.",
}: {
  label: string;
  rightEyebrow?: string;
  items: MissionMeta[];
  onEnter: (id: string) => void;
  onActiveChange?: (id: string | null) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyCopy?: string;
}) {
  const showSkeleton = loading && items.length === 0;
  const showError = !loading && !!error;
  const showEmpty = !loading && !error && items.length === 0;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const userTouched = useRef(false);
  const stripRef = useRef<HTMLUListElement>(null);

  // Reset active if the items list shrinks.
  useEffect(() => {
    if (active >= items.length) setActive(0);
  }, [items.length, active]);

  // Auto-advance the spotlight. Pauses on hover / focus, after a user
  // click, or while a card is expanded — so the page never animates
  // beneath someone who is reading.
  useEffect(() => {
    if (showSkeleton || showError || showEmpty) return;
    if (paused || expandedId || userTouched.current) return;
    if (items.length < 2) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [items.length, paused, expandedId, showSkeleton, showError, showEmpty]);

  // Keep the spotlit tile visible inside the strip on narrow widths.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const el = strip.children[active] as HTMLElement | undefined;
    if (!el) return;
    const stripBox = strip.getBoundingClientRect();
    const elBox = el.getBoundingClientRect();
    if (elBox.left < stripBox.left + 8 || elBox.right > stripBox.right - 8) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [active]);

  // Tell the parent when the spotlit case changes (so the ambient bed can
  // cross-fade in step with the rotation, the same way it does for the
  // ledger). Suppressed while a card is expanded — the expanded card
  // owns the audio state at that point. We hold the callback in a ref so
  // an inline parent function doesn't re-fire the effect each render.
  const activeChangeRef = useRef(onActiveChange);
  useEffect(() => { activeChangeRef.current = onActiveChange; }, [onActiveChange]);
  useEffect(() => {
    if (showSkeleton || showError || showEmpty) {
      activeChangeRef.current?.(null);
      return;
    }
    if (expandedId) return;
    activeChangeRef.current?.(items[active]?.id ?? null);
  }, [active, items, expandedId, showSkeleton, showError, showEmpty]);


  const handlePick = useCallback(
    (i: number, id: string) => {
      userTouched.current = true;
      setActive(i);
      setExpandedId((cur) => (cur === id ? null : id));
    },
    [],
  );

  const expanded = useMemo(
    () => (expandedId ? items.find((m) => m.id === expandedId) ?? null : null),
    [expandedId, items],
  );

  return (
    <section className="mb-12" aria-label={label}>
      <div className="mb-3 flex items-center gap-3">
        <span className="text-[0.55rem] tracking-[0.4em] uppercase text-accent/90">
          {label}
        </span>
        <span className="h-px flex-1 bg-accent/15" aria-hidden />
        {rightEyebrow && (
          <span className="text-[0.55rem] tracking-[0.4em] uppercase text-muted-foreground/55">
            {rightEyebrow}
          </span>
        )}
      </div>

      {showSkeleton ? (
        <CarouselSkeleton />
      ) : showError ? (
        <CarouselNotice tone="error" message={error!} onRetry={onRetry} />
      ) : showEmpty ? (
        onRetry ? (
          <CarouselNotice tone="empty" message={emptyCopy} onRetry={onRetry} />
        ) : null
      ) : (
        <div
          className="relative -mx-6 px-6 sm:-mx-10 sm:px-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setPaused(false);
            }
          }}
        >
          <ul
            ref={stripRef}
            role="listbox"
            aria-label={`${label} — use arrow keys to browse, Enter to open`}
            aria-activedescendant={items[active] ? `carousel-tile-${items[active].id}` : undefined}
            tabIndex={-1}
            className="scrollbar-hide dn-carousel-strip flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:gap-5"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
            aria-busy={loading || undefined}
            onKeyDown={(e) => {
              if (items.length === 0) return;
              const focusAt = (idx: number) => {
                userTouched.current = true;
                setActive(idx);
                const strip = stripRef.current;
                const li = strip?.children[idx] as HTMLElement | undefined;
                const btn = li?.querySelector<HTMLButtonElement>("button");
                btn?.focus();
              };
              if (e.key === "ArrowRight") {
                e.preventDefault();
                focusAt((active + 1) % items.length);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                focusAt((active - 1 + items.length) % items.length);
              } else if (e.key === "Home") {
                e.preventDefault();
                focusAt(0);
              } else if (e.key === "End") {
                e.preventDefault();
                focusAt(items.length - 1);
              } else if (e.key === "Escape" && expandedId) {
                e.preventDefault();
                setExpandedId(null);
              }
            }}
          >
            {items.map((m, i) => (
              <li key={m.id} className="dn-carousel-tile snap-start" role="presentation">
                <CarouselTile
                  mission={m}
                  index={i}
                  spotlit={i === active}
                  open={expandedId === m.id}
                  focusable={i === active}
                  onPick={() => handlePick(i, m.id)}
                />
              </li>
            ))}
          </ul>

          {items.length > 1 && (
            <ProgressDots
              count={items.length}
              active={active}
              onJump={(i) => {
                userTouched.current = true;
                setActive(i);
              }}
            />
          )}
        </div>
      )}

      {/* Inline expanded detail — same shape as a ledger row opening.
          Tile click only ever opens this panel; navigation happens only
          from the "Enter" affordance inside the panel. */}
      {expanded && (
        <div
          className="mt-5"
          ref={(el) => {
            if (!el) return;
            // Bring the panel into view the same way an opened ledger row does.
            requestAnimationFrame(() => {
              el.scrollIntoView({ behavior: "smooth", block: "nearest" });
            });
          }}
        >
          <ExpandedCase
            mission={expanded}
            onEnter={onEnter}
            onClose={() => {
              setExpandedId(null);
              // Hand the bed back to the spotlit case.
              onActiveChange?.(items[active]?.id ?? null);
            }}
          />
        </div>
      )}
    </section>
  );
}

/* ── tile ───────────────────────────────────────────────── */

function CarouselTile({
  mission,
  index,
  spotlit,
  open,
  focusable,
  onPick,
}: {
  mission: MissionMeta;
  index: number;
  spotlit: boolean;
  open: boolean;
  focusable: boolean;
  onPick: () => void;
}) {
  useEffect(() => {
    logImpression(mission.id, mission.theme);
  }, [mission.id, mission.theme]);

  return (
    <button
      type="button"
      onClick={onPick}
      id={`carousel-tile-${mission.id}`}
      role="option"
      aria-selected={spotlit}
      aria-expanded={open}
      aria-controls={open ? `carousel-panel-${mission.id}` : undefined}
      aria-posinset={index + 1}
      aria-label={`${open ? "Close" : "Open"} ${mission.codename}`}
      tabIndex={focusable ? 0 : -1}
      className={[
        "group relative block shrink-0 overflow-hidden rounded-[12px] text-left",
        "w-[172px] sm:w-[188px] md:w-[200px]",
        "border bg-[#0b0d10]",
        // Asymmetric cinematic easing on state changes — slower exhale than
        // attack, no hard snap between spotlit / dim.
        "transition-[transform,border-color,opacity,box-shadow,filter] duration-[1100ms]",
        "[transition-timing-function:cubic-bezier(0.33,1,0.68,1)]",
        // Strong, brand-aligned focus ring — visible on dark posters.
        "focus:outline-none focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "focus-visible:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_28%,transparent)]",
        spotlit
          ? "border-accent/55 shadow-[0_24px_60px_-28px_rgba(214,182,109,0.55)] scale-[1.025] opacity-100"
          : "border-foreground/10 opacity-55 hover:opacity-90 hover:border-foreground/25 [filter:saturate(0.7)_brightness(0.92)]",
        open ? "border-accent/80" : "",
      ].join(" ")}
      // Reserve a compositor layer only while the tile is the one
      // animating (spotlit) or transitioning open — idle tiles drop the
      // hint so the GPU isn't holding nine layers in memory at rest.
      style={{ willChange: spotlit || open ? "transform, opacity, filter" : "auto" }}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0b0d10]">
        {/* Scene art — slow parallax drift while spotlit, settled otherwise. */}
        <div
          className={[
            "dn-carousel-art absolute inset-0 transition-[filter,transform] duration-[1400ms]",
            "[transition-timing-function:cubic-bezier(0.33,1,0.68,1)]",
            spotlit ? "motion-safe:animate-[dn-drift_14s_ease-in-out_infinite_alternate]" : "scale-100",
          ].join(" ")}
          style={{ filter: spotlit ? "saturate(1.08) brightness(1.04)" : "saturate(0.85) brightness(0.9)" }}
        >
          <SceneArt src={getSceneSrc(mission.id)} theme={mission.theme} />
        </div>

        {/* Spotlight wash — a soft radial of accent light that drifts across
            the active tile, then fades when handing off. */}
        <div
          aria-hidden
          className={[
            "dn-carousel-wash pointer-events-none absolute inset-[-40%]",
            "transition-opacity duration-[1400ms] ease-out",
            // One-shot drift-in: arrives and settles ~1700ms in, holds
            // through 2000ms, then leaves the accent rule the floor for
            // its 2600ms brightness peak. No infinite alternate — the
            // wash and the breath stop ever moving in the same instant.
            spotlit ? "opacity-100 motion-safe:animate-[dn-wash_2000ms_cubic-bezier(0.22,1,0.36,1)_forwards]" : "opacity-0",
          ].join(" ")}
          style={{
            background:
              "radial-gradient(circle at center, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 62%)",
            mixBlendMode: "screen",
          }}
        />

        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-12"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,8,12,0.55) 0%, rgba(6,8,12,0) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-3/5"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,8,12,0) 0%, rgba(6,8,12,0.7) 60%, rgba(6,8,12,0.95) 100%)",
          }}
        />
        <p className="absolute left-3 top-3 text-[0.5rem] tracking-[0.35em] uppercase text-foreground/85 sm:left-3.5 sm:top-3.5">
          {mission.theme ?? "Case File"}
        </p>
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-3.5 sm:left-3.5 sm:right-3.5">
          <h5 className="font-display text-[16px] leading-[1.1] text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] sm:text-[17px]">
            {mission.codename}
          </h5>
          <p className="mt-1.5 text-[0.5rem] tracking-[0.3em] uppercase text-foreground/70">
            {toneWord(mission.tone)} · {shortDuration(mission.duration)}
          </p>
        </div>
        {/* Breathing accent rule — eases in with a soft glow, peaks mid-cycle,
            then dissolves through blur instead of snapping back. Restarts on
            each spotlit cycle via React's key remount. */}
        <span
          aria-hidden
          className={[
            "absolute inset-x-3 bottom-2 h-px origin-left rounded-full bg-accent/85 sm:inset-x-3.5",
            "shadow-[0_0_10px_color-mix(in_oklab,var(--accent)_55%,transparent)]",
            spotlit
              ? "motion-safe:animate-[dn-rule-breathe_5200ms_cubic-bezier(0.4,0,0.2,1)_forwards]"
              : "scale-x-0 opacity-0",
          ].join(" ")}
          key={spotlit ? `on-${mission.id}` : `off-${mission.id}`}
        />
      </div>
    </button>
  );
}

/* ── expanded panel ─────────────────────────────────────── */

function ExpandedCase({
  mission,
  onEnter,
  onClose,
}: {
  mission: MissionMeta;
  onEnter: (id: string) => void;
  onClose: () => void;
}) {
  const resonance = resonanceCopy(getResonance(mission.id));
  return (
    <div id={`carousel-panel-${mission.id}`} role="region" aria-label={`${mission.codename} case file`} className="overflow-hidden rounded-[14px] border border-accent/40 bg-[#0b0d10] motion-safe:animate-fade-up">
      <div className="relative aspect-[16/9] sm:aspect-auto sm:h-[236px] w-full overflow-hidden bg-[#0b0d10]">
        <SceneArt src={getSceneSrc(mission.id)} theme={mission.theme} brighten />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,8,12,0.05) 30%, rgba(6,8,12,0.78) 100%)",
          }}
        />
        <p className="absolute left-5 top-4 text-[0.55rem] tracking-[0.4em] uppercase text-foreground/85">
          Case File · {mission.theme ?? "—"}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close case"
          className="absolute right-4 top-4 rounded-full border border-foreground/15 bg-background/40 px-2.5 py-1 text-[0.5rem] tracking-[0.35em] uppercase text-foreground/70 backdrop-blur-sm hover:border-accent/40 hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)]"
        >
          Close
        </button>
        <div className="absolute bottom-4 left-5 right-5">
          <h4 className="font-display text-3xl sm:text-[40px] leading-[1.05] text-foreground">
            {mission.codename}
          </h4>
          <p className="mt-1 text-[0.6rem] tracking-[0.35em] uppercase text-foreground/75">
            {[mission.location, mission.year].filter(Boolean).join(" · ")}
          </p>
        </div>
      </div>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        <p className="font-display text-base sm:text-lg leading-snug text-foreground/90 text-pretty">
          {mission.logline}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground/75">
          <span>{toneWord(mission.tone)}</span>
          <DifficultyDots level={mission.difficulty ?? null} />
          <span>{shortDuration(mission.duration)}</span>
          {mission.category && <span>{mission.category}</span>}
        </div>

        {resonance && (
          <p className="mt-3 text-xs italic text-muted-foreground/65 normal-case tracking-normal">
            {resonance}
          </p>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => onEnter(mission.id)}
            aria-label={`Enter ${mission.codename}`}
            className="inline-flex min-h-[44px] items-center gap-3 rounded-full bg-accent px-6 py-2 text-[0.65rem] tracking-[0.4em] uppercase text-background hover:bg-accent/90 transition-colors w-full sm:w-auto justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Enter
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── progress dots ──────────────────────────────────────── */

function ProgressDots({
  count,
  active,
  onJump,
}: {
  count: number;
  active: number;
  onJump: (i: number) => void;
}) {
  return (
    <div className="mt-3 flex items-center justify-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => {
        const on = i === active;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onJump(i)}
            aria-label={`Show case ${i + 1} of ${count}`}
            aria-current={on || undefined}
            className={`h-[3px] rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--ring)] ${
              on ? "w-6 bg-accent" : "w-2 bg-foreground/20 hover:bg-foreground/40"
            }`}
          />
        );
      })}
    </div>
  );
}

/* ── loading / empty / error states ─────────────────────── */

function CarouselSkeleton() {
  return (
    <ul className="flex gap-3 sm:gap-4" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <li
          key={i}
          className="relative w-[172px] shrink-0 overflow-hidden rounded-[12px] border border-foreground/10 bg-[#0b0d10] sm:w-[188px] md:w-[200px]"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden bg-foreground/[0.035]">
            <div
              className="absolute inset-0 motion-safe:animate-[shimmer_2.4s_ease-in-out_infinite] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.045)_50%,transparent_70%)] bg-[length:200%_100%]"
              style={{ animationDelay: `${i * 90}ms` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function CarouselNotice({
  tone,
  message,
  onRetry,
}: {
  tone: "error" | "empty";
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className={`flex w-full items-center gap-4 rounded-[12px] px-5 py-6 motion-safe:animate-[fade-in_0.4s_ease-out_both] ${
        tone === "error"
          ? "border border-foreground/10 bg-[#0b0d10]/60"
          : "border border-dashed border-foreground/10 bg-transparent"
      }`}
    >
      <p className="flex-1 text-[0.75rem] italic text-muted-foreground/75">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 rounded-full border border-foreground/15 px-3 py-1.5 text-[0.55rem] tracking-[0.35em] uppercase text-foreground/85 transition-colors hover:border-accent/50 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {tone === "error" ? "Try again" : "Refresh"}
        </button>
      )}
    </div>
  );
}
