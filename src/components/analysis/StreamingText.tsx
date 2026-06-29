// StreamingText — reveals text word-by-word at a cinematic pace, so the
// post-decision reading feels like it is being written in real time rather
// than dumped on screen. Honours prefers-reduced-motion (renders the full
// string immediately) and supports tap-to-complete.

import { useEffect, useRef, useState } from "react";

type StreamingTextProps = {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** ms before the first word appears */
  startDelayMs?: number;
  /** base ms between words */
  wordMs?: number;
  /** extra ms after punctuation (. ! ? — :) */
  punctuationMs?: number;
  /** called once the full string is on screen */
  onDone?: () => void;
};

const PUNCT = /[.!?…—:;]$/;

export function StreamingText({
  text,
  as = "span",
  className,
  startDelayMs = 0,
  wordMs = 75,
  punctuationMs = 240,
  onDone,
}: StreamingTextProps) {
  const Tag = as as React.ElementType;
  const words = text.split(/(\s+)/); // keep whitespace tokens
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const [revealed, setRevealed] = useState(reduce ? words.length : 0);
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
    if (revealed >= words.length) {
      if (!doneRef.current) {
        doneRef.current = true;
        onDoneRef.current?.();
      }
      return;
    }
    const current = words[revealed] ?? "";
    const isWhitespace = /^\s+$/.test(current);
    const trimmed = current.trim();
    const isPunct = PUNCT.test(trimmed);
    const delay =
      revealed === 0
        ? startDelayMs
        : isWhitespace
        ? 0
        : isPunct
        ? wordMs + punctuationMs
        : wordMs;
    const t = window.setTimeout(() => setRevealed((n) => n + 1), delay);
    return () => window.clearTimeout(t);
  }, [revealed, words, wordMs, punctuationMs, startDelayMs, reduce]);

  const skip = () => {
    if (revealed < words.length) setRevealed(words.length);
  };

  const shown = words.slice(0, revealed).join("");
  const isComplete = revealed >= words.length;

  return (
    <Tag
      className={className}
      onClick={skip}
      style={{ cursor: isComplete ? undefined : "pointer" }}
    >
      {shown}
      {!isComplete && (
        <span
          aria-hidden
          className="inline-block w-[0.5ch] -mb-[0.05em] ml-[0.05em] align-baseline bg-accent/70 animate-pulse"
          style={{ height: "1em" }}
        />
      )}
    </Tag>
  );
}
