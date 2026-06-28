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
