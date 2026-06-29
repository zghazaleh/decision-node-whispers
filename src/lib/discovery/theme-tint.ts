/**
 * Map a case theme to a soft accent hue. Used by SceneArt skeletons so
 * loading shimmer carries the case's atmosphere instead of generic grey.
 */
const THEME_HUE: Record<string, number> = {
  Truth: 215,
  Conscience: 285,
  Duty: 35,
  Power: 350,
  Loyalty: 20,
  Justice: 230,
  Survival: 12,
  Sacrifice: 320,
  Memory: 260,
  Faith: 55,
  Honor: 40,
  Mercy: 300,
  Identity: 195,
  Family: 25,
  Legacy: 80,
};

export function themeTint(theme?: string) {
  const hue = (theme && THEME_HUE[theme]) ?? 230;
  return {
    base: `oklch(0.32 0.05 ${hue} / 0.22)`,
    glow: `oklch(0.65 0.14 ${hue} / 0.18)`,
    shimmer: `oklch(0.78 0.16 ${hue} / 0.14)`,
    label: `oklch(0.85 0.08 ${hue} / 0.55)`,
  };
}
