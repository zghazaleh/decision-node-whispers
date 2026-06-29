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
  const enableSound = async () => {
    audio.setMuted(false);
    await audio.resumeLatest();
  };
  const setIntensity = async (value: MusicIntensity) => {
    audio.setMusicIntensity(value);
    if (value !== "off" && !audio.isMuted()) await audio.resumeLatest();
  };
  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`} role="group" aria-label="Sound">
      <button
        type="button"
        onClick={() => {
          if (muted) void enableSound();
          else audio.setMuted(true);
        }}
        aria-pressed={!muted}
        aria-label={muted ? "Unmute" : "Mute"}
        className="rounded-full border border-foreground/15 bg-background/40 px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.25em] text-foreground/70 transition-colors hover:text-foreground hover:border-foreground/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[44px] sm:min-h-0"
      >
        {muted ? "Sound off" : "Sound on"}
      </button>

      <div
        role="radiogroup"
        aria-label="Calm music intensity"
        className="hidden sm:inline-flex items-center rounded-full border border-foreground/15 bg-background/40 p-0.5"
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
              onClick={() => { void setIntensity(opt.value); }}
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

    </div>
  );
}
