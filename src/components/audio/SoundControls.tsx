import { useCallback, useEffect, useState } from "react";
import { audio, type MusicIntensity } from "@/lib/audio/director";

function useAudioState() {
  const [, force] = useState(0);
  useEffect(() => audio.subscribe(() => force((n) => n + 1)), []);
  return {
    muted: audio.isMuted(),
    intensity: audio.getMusicIntensity(),
  };
}

/* Map the director's discrete states to a continuous 0-100 slider value. */
function stateToSlider(muted: boolean, intensity: MusicIntensity): number {
  if (muted) return 0;
  if (intensity === "off") return 28;
  if (intensity === "low") return 62;
  return 100;
}

/* Map a 0-100 slider value back to the director's discrete states. */
function sliderToState(v: number): { muted: boolean; intensity: MusicIntensity } {
  if (v <= 8) return { muted: true, intensity: "off" };
  if (v <= 45) return { muted: false, intensity: "off" };
  if (v <= 78) return { muted: false, intensity: "low" };
  return { muted: false, intensity: "normal" };
}

function zoneLabel(v: number): string {
  if (v <= 8) return "Mute";
  if (v <= 45) return "Bed off";
  if (v <= 78) return "Low";
  return "Full";
}

/**
 * Single fader that replaces the mute toggle + intensity radio group.
 * 0  = mute (all audio off)
 * 28 = sound on, calm bed off (SFX / motif still play)
 * 62 = sound on, calm bed at reduced volume
 * 100 = sound on, full authored mix
 */
export function SoundControls({ className = "" }: { className?: string }) {
  const { muted, intensity } = useAudioState();
  const initial = stateToSlider(muted, intensity);
  const [value, setValue] = useState(initial);
  const [hovering, setHovering] = useState(false);

  // Sync external changes (e.g. another component or keyboard shortcuts)
  useEffect(() => {
    setValue(stateToSlider(muted, intensity));
  }, [muted, intensity]);

  const apply = useCallback(async (v: number) => {
    const { muted: nextMuted, intensity: nextIntensity } = sliderToState(v);
    if (nextMuted) {
      audio.setMuted(true);
    } else {
      if (audio.isMuted()) {
        audio.setMuted(false);
        await audio.resumeLatest();
      }
      audio.setMusicIntensity(nextIntensity);
      if (nextIntensity !== "off") await audio.resumeLatest();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setValue(v);
    void apply(v);
  };

  const label = zoneLabel(value);
  const active = value > 8;

  return (
    <div
      className={`flex items-center gap-2.5 ${className}`}
      role="group"
      aria-label="Sound mix"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Tiny sound-state glyph */}
      <span
        aria-hidden="true"
        className={`text-[0.55rem] uppercase tracking-[0.22em] transition-opacity duration-300 select-none ${
          active ? "text-foreground/55" : "text-foreground/25"
        } ${hovering ? "opacity-100" : "opacity-0"}`}
        style={{ width: 36, textAlign: "right" }}
      >
        {label}
      </span>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={handleChange}
        className="dn-fader"
        aria-label="Sound level"
        aria-valuetext={label}
      />
    </div>
  );
}
