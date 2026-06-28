// Subtle on-screen indicator that surfaces when an audio bed or SFX fails
// to load. Deliberately quiet: a small dot + label that fades in/out near
// the existing SoundControls, never blocks transitions, and never throws
// a modal/toast that would steal focus or disrupt motion timing.

import { useEffect, useState } from "react";
import { subscribeAudioFailures } from "@/lib/ambient";

const VISIBLE_MS = 4200;
const FADE_MS = 600;

export function AudioFailureIndicator() {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let hideTimer: number | undefined;
    const unsub = subscribeAudioFailures(() => {
      setCount((c) => c + 1);
      setVisible(true);
      if (hideTimer) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setVisible(false), VISIBLE_MS);
    });
    return () => {
      unsub();
      if (hideTimer) window.clearTimeout(hideTimer);
    };
  }, []);

  if (count === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none flex items-center gap-1.5 select-none"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-2px)",
        transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
      }}
    >
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full bg-amber-400/80"
        style={{
          boxShadow: "0 0 6px rgba(251, 191, 36, 0.55)",
          animation: visible ? "audio-fail-pulse 1.8s ease-in-out infinite" : "none",
        }}
      />
      <span className="text-[10px] tracking-[0.18em] uppercase text-foreground/55">
        audio unavailable
      </span>
      <style>{`
        @keyframes audio-fail-pulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
