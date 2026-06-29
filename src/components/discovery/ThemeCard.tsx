import type { MissionMeta } from "@/lib/missions";
import { MissionCard } from "./MissionCard";
import { SceneArt } from "./scene-art";
import { getSceneSrc } from "@/lib/discovery/helpers";

/**
 * Theme card — a standalone, full-width tile representing a curated group
 * (Moral Dilemmas, Business & Power, etc.). Click to expand inline; the
 * missions inside the theme are revealed in a poster grid beneath the header.
 *
 * Replaces the horizontal-scrolling CategoryRail on the Case Archive.
 */
export function ThemeCard({
  label,
  caption,
  items,
  isOpen,
  onToggle,
  onSelect,
}: {
  label: string;
  caption?: string;
  items: MissionMeta[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) return null;
  const preview = items.slice(0, 3);

  return (
    <section
      className={`group/theme relative mb-4 overflow-hidden rounded-[14px] border bg-[#0b0d10] transition-colors ${
        isOpen
          ? "border-accent/40"
          : "border-foreground/10 hover:border-foreground/25"
      }`}
      aria-label={label}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="relative flex w-full items-stretch text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {/* Montage strip */}
        <div className="relative hidden sm:flex h-32 w-56 shrink-0 overflow-hidden border-r border-foreground/10">
          {preview.map((m, i) => (
            <div
              key={m.id}
              className="relative flex-1 overflow-hidden"
              style={{
                transform: `translateX(${i * -4}px)`,
              }}
            >
              <SceneArt src={getSceneSrc(m.id)} theme={m.theme} />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(6,8,12,0.25) 0%, rgba(6,8,12,0.78) 100%)",
                }}
              />
            </div>
          ))}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0b0d10] via-[#0b0d10]/70 to-transparent"
          />
        </div>

        {/* Title block */}
        <div className="relative flex flex-1 flex-col justify-center gap-2 px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-baseline gap-3">
            <span className="text-[0.55rem] tracking-[0.4em] uppercase text-accent/85">
              Theme
            </span>
            <span className="h-px flex-1 bg-foreground/10" aria-hidden />
            <span className="text-[0.55rem] tracking-[0.35em] uppercase text-muted-foreground/55 tabular-nums">
              {items.length} {items.length === 1 ? "case" : "cases"}
            </span>
          </div>
          <h3 className="font-display text-xl leading-[1.1] text-foreground sm:text-2xl">
            {label}
          </h3>
          {caption && (
            <p className="text-[0.75rem] italic text-muted-foreground/75">
              {caption}
            </p>
          )}
        </div>

        {/* Chevron */}
        <div className="flex items-center pr-5 sm:pr-6">
          <span
            aria-hidden
            className={`text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground/60 transition-transform duration-300 ${
              isOpen ? "rotate-90 text-accent/90" : ""
            }`}
          >
            ›
          </span>
        </div>
      </button>

      {/* Expanded mission posters */}
      {isOpen && (
        <div className="border-t border-foreground/10 px-5 py-6 sm:px-6 motion-safe:animate-[fade-in_0.4s_ease-out_both]">
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((m) => (
              <li key={m.id} className="flex">
                <div className="w-full [&>button]:w-full">
                  <MissionCard mission={m} onSelect={onSelect} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
