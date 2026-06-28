import type { MissionMeta } from "@/lib/missions";
import { MissionCard } from "./MissionCard";

/**
 * Horizontal-scroll scaffold — eyebrow label, accent rule, snap-scrolling row
 * of poster cards. The atomic unit of every collection surface (Today / Fit /
 * Curator / Resonance / Fresh). Scales because the data behind it is just a
 * `MissionMeta[]` — swap the source, the rail stays the same.
 */
export function Rail({
  label,
  rightEyebrow,
  items,
  onSelect,
}: {
  label: string;
  rightEyebrow?: string;
  items: MissionMeta[];
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) return null;
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
      <div
        className="-mx-6 sm:-mx-10 overflow-x-auto px-6 sm:px-10 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <ul className="flex gap-4 snap-x snap-mandatory">
          {items.map((m) => (
            <li key={m.id}>
              <MissionCard mission={m} onSelect={onSelect} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
