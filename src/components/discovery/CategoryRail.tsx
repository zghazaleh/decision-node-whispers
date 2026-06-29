import type { MissionMeta } from "@/lib/missions";
import { MissionCard } from "./MissionCard";

/**
 * Horizontal scrolling rail of poster cards for a curated category.
 * Quiet eyebrow label + a row of MissionCard posters. Scrolls horizontally
 * within itself — never moves the page vertically.
 */
export function CategoryRail({
  label,
  caption,
  items,
  onSelect,
}: {
  label: string;
  caption?: string;
  items: MissionMeta[];
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <section className="mb-10" aria-label={label}>
      <div className="mb-3 flex items-baseline gap-3">
        <span className="text-[0.55rem] tracking-[0.4em] uppercase text-foreground/80">
          {label}
        </span>
        <span className="h-px flex-1 bg-foreground/10" aria-hidden />
        {caption && (
          <span className="text-[0.55rem] tracking-[0.4em] uppercase text-muted-foreground/55">
            {caption}
          </span>
        )}
      </div>
      <div className="relative -mx-6 px-6 sm:-mx-10 sm:px-10">
        <ul
          className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:gap-5"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {items.map((m) => (
            <li key={m.id} className="snap-start">
              <MissionCard mission={m} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
