export function DifficultyDots({
  level,
  compact = false,
}: {
  level: number | null;
  compact?: boolean;
}) {
  if (!level) return <span className="text-foreground/40">—</span>;
  const rounded = Math.round(level);
  const size = compact ? "h-1 w-1" : "h-1.5 w-1.5";
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`block rounded-full ${size} ${
            n <= rounded
              ? "bg-foreground/45"
              : "bg-foreground/25 ring-1 ring-inset ring-foreground/10"
          }`}
          aria-hidden
        />
      ))}
      <span className="sr-only">{rounded} of 5</span>
    </span>
  );
}
