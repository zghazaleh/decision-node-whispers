// Central audio asset registry. Resolves any *.mp3.asset.json pointer under
// src/assets/audio/ to its CDN URL via Vite's glob import — assets generated
// later land automatically on the next build, no source-edit required.

type AssetPointer = { url: string };

const pointers = import.meta.glob<AssetPointer>(
  "/src/assets/audio/*.mp3.asset.json",
  { eager: true, import: "default" },
);

export function audioUrl(name: string): string | null {
  return pointers[`/src/assets/audio/${name}.mp3.asset.json`]?.url ?? null;
}

export function hasAudio(name: string): boolean {
  return audioUrl(name) !== null;
}

/**
 * Return every URL registered for `name`, including numbered variants
 * (`<name>-2.mp3`, `<name>-3.mp3`, ...). The base name (if present) is
 * always first, followed by variants in ascending numeric order. Returns
 * an empty array when no asset matches.
 */
export function audioUrlVariants(name: string): string[] {
  const out: string[] = [];
  const base = pointers[`/src/assets/audio/${name}.mp3.asset.json`];
  if (base) out.push(base.url);
  const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const re = new RegExp(`^/src/assets/audio/${escaped}-(\\d+)\\.mp3\\.asset\\.json$`);
  const variants: Array<{ n: number; url: string }> = [];
  for (const [path, mod] of Object.entries(pointers)) {
    const m = path.match(re);
    if (m) variants.push({ n: Number(m[1]), url: mod.url });
  }
  variants.sort((a, b) => a.n - b.n);
  for (const v of variants) out.push(v.url);
  return out;
}

