// StreamingText — cinematic fade-in for decision-reading prose.
// Text is fully formed from the start; only opacity and a subtle upward
// drift animate.  Honours prefers-reduced-motion (renders immediately).

import { useEffect, useRef, useState } from "react";

type StreamingTextProps = {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** ms before the fade begins */
  startDelayMs?: number;
  /** @deprecated no longer used — kept for API compat */
  wordMs?: number;
  /** @deprecated no longer used — kept for API compat */
  punctuationMs?: number;
  /** called once the fade has finished */
  onDone?: () => void;
};

const FADE_DURATION_MS = 900;

export function StreamingText({
  text,
  as = "span",
  className,
  startDelayMs = 0,
  onDone,
}: StreamingTextProps) {
  const Tag = as as React.ElementType;
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const [visible, setVisible] = useState(reduce);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (reduce) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDoneRef.current?.();
      }
      return;
    }

    const delayTimer = window.setTimeout(() => {
      setVisible(true);
      const doneTimer = window.setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          onDoneRef.current?.();
        }
      }, FADE_DURATION_MS);
      return () => window.clearTimeout(doneTimer);
    }, startDelayMs);

    return () => window.clearTimeout(delayTimer);
  }, [startDelayMs, reduce]);

  return (
    <Tag
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: `opacity ${FADE_DURATION_MS}ms ease-out, transform ${FADE_DURATION_MS}ms ease-out`,
      }}
    >
      {text}
    </Tag>
  );
}
