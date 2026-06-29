import { useEffect, useState } from "react";
import { audio, type MusicIntensity } from "@/lib/audio/director";

function useAudioState() {
  const [, force] = useState(0);
  useEffect(() => audio.subscribe(() => force((n) => n + 1)), []);
  return {
    muted: audio.isMuted(),
    reduced: audio.isReduced(),
    intensity: audio.getMusicIntensity(),
  };
}

const INTENSITY_OPTIONS: { value: MusicIntensity; label: string; title: string }[] = [
  { value: "off",    label: "Off",    title: "Calm music off — keep stings and SFX" },
  { value: "low",    label: "Low",    title: "Calm music low — bed at reduced volume" },
  { value: "normal", label: "Normal", title: "Calm music at authored volume" },
];

/**
 * Combined mute + reduced-audio + music-intensity control. Mute is always
 * reachable; reduced mode keeps a faint drone but drops heartbeat, motif
 * and most stings; music intensity scales just the calm bed and persists
 * across missions.
 */
export function SoundControls({ className = "" }: { className?: string }) {
  const { muted, reduced, intensity } = useAudioState();
  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`} role="group" aria-label="Sound">
      <button
        type="button"
        onClick={() => audio.setMuted(!muted)}
        aria-pressed={!muted}
        aria-label={muted ? "Unmute" : "Mute"}
        className="rounded-full border border-foreground/15 bg-background/40 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.25em] text-foreground/70 transition-colors hover:text-foreground hover:border-foreground/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[44px] sm:min-h-0"
      >
        {muted ? "Sound off" : "Sound on"}
      </button>

      <div
        role="radiogroup"
        aria-label="Calm music intensity"
        className="inline-flex items-center rounded-full border border-foreground/15 bg-background/40 p-0.5"
      >
        {INTENSITY_OPTIONS.map((opt) => {
          const active = intensity === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              title={opt.title}
              onClick={() => audio.setMusicIntensity(opt.value)}
              className={`rounded-full px-2.5 py-1 text-[0.6rem] uppercase tracking-[0.22em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[36px] sm:min-h-0 ${
                active
                  ? "bg-foreground/12 text-foreground"
                  : "text-foreground/55 hover:text-foreground/85"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => audio.setReducedAudio(!reduced)}
        aria-pressed={reduced}
        aria-label={reduced ? "Disable reduced audio" : "Enable reduced audio"}
        title="Reduced audio — keep a faint drone, drop heartbeat and motif"
        className={`rounded-full border px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.25em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[44px] sm:min-h-0 ${
          reduced
            ? "border-foreground/40 bg-foreground/10 text-foreground"
            : "border-foreground/10 bg-background/40 text-foreground/55 hover:text-foreground/80 hover:border-foreground/25"
        }`}
      >
        Reduced
      </button>
    </div>
  );
}
