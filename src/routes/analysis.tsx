import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DecisionAnalysis } from "@/lib/analysis.functions";
import { readMission, useMission, type SavedMission } from "@/lib/mission-store";
import sceneCosmos from "@/assets/scene-cosmos.jpg";

export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      { title: "Decision Node — Analysis" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Analysis,
  ssr: false,
});

function Analysis() {
  const navigate = useNavigate();
  const { reset } = useMission();
  const [mission, setMission] = useState<SavedMission | null>(null);

  useEffect(() => {
    const m = readMission();
    if (!m.analysis) {
      navigate({ to: "/" });
      return;
    }
    setMission(m);
  }, [navigate]);

  if (!mission?.analysis) return null;
  const a = mission.analysis;

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Cosmic backdrop */}
      <div className="fixed inset-0">
        <img
          src={sceneCosmos}
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-40"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0 0 0 / 0.7), oklch(0 0 0 / 0.85))",
          }}
        />
        <div className="film-grain" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 sm:px-10 py-20 sm:py-28 space-y-24">
        {/* Headline */}
        <section className="animate-fade-up text-center">
          <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-6">
            The decision is made
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight text-foreground/95 text-balance">
            {a.headline}
          </h1>
        </section>

        {/* Interactive Timeline */}
        <section className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <SectionLabel>Consequence Timeline</SectionLabel>
          <p className="mt-4 text-center text-xs text-foreground/45 tracking-wide">
            Scrub through the turning points. Watch how the outcome assembled itself.
          </p>
          <TimelineScrubber timeline={a.timeline} />
        </section>

        {/* Decision Analysis */}
        <section className="space-y-16">
          <div className="animate-fade-up text-center" style={{ animationDelay: "1.4s" }}>
            <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-4">
              Decision Analysis
            </p>
            <p className="text-sm text-foreground/55 max-w-md mx-auto leading-relaxed">
              Not right or wrong. A look at how the choice was made.
            </p>
          </div>

          <AnalysisBlock
            label="Assumptions you carried in"
            body={a.assumptions}
            delay={1.7}
          />
          <AnalysisBlock
            label="Evidence you leaned on"
            body={a.evidenceUsed}
            delay={1.95}
          />
          <AnalysisBlock
            label="What you didn't look at"
            body={a.evidenceIgnored}
            delay={2.2}
          />
          <AnalysisBlock
            label="Other paths through this"
            body={a.alternatives}
            delay={2.45}
          />

          <div
            className="animate-fade-up border-t border-foreground/15 pt-12"
            style={{ animationDelay: "2.7s" }}
          >
            <p className="text-[0.6rem] tracking-[0.35em] uppercase text-accent/80 mb-4">
              In closing
            </p>
            <p className="font-display text-2xl sm:text-3xl leading-snug text-foreground/95 text-pretty">
              {a.closing}
            </p>
          </div>
        </section>

        {/* Coda */}
        <section
          className="animate-fade-up text-center pt-8 pb-4"
          style={{ animationDelay: "3.0s" }}
        >
          <div className="flex items-center justify-center gap-10">
            <button
              onClick={() => {
                reset();
                navigate({ to: "/mission" });
              }}
              className="group flex items-center gap-3 text-[0.65rem] tracking-[0.4em] uppercase text-foreground/70 hover:text-foreground transition-colors"
            >
              <span className="h-px w-8 bg-foreground/30 group-hover:bg-foreground/70 group-hover:w-12 transition-all" />
              Wake again
            </button>
            <button
              onClick={() => navigate({ to: "/" })}
              className="text-[0.65rem] tracking-[0.4em] uppercase text-foreground/40 hover:text-foreground/80 transition-colors"
            >
              Return
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 text-center">
      {children}
    </p>
  );
}

function AnalysisBlock({
  label,
  body,
  delay,
}: {
  label: string;
  body: string;
  delay: number;
}) {
  return (
    <div className="animate-fade-up" style={{ animationDelay: `${delay}s` }}>
      <p className="text-[0.6rem] tracking-[0.35em] uppercase text-foreground/45 mb-3">
        {label}
      </p>
      <p className="font-display text-xl sm:text-2xl leading-relaxed text-foreground/90 text-pretty">
        {body}
      </p>
    </div>
  );
}

function TimelineScrubber({ timeline }: { timeline: DecisionAnalysis["timeline"] }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const total = timeline.length;
  const last = total - 1;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clamp = useCallback(
    (n: number) => Math.max(0, Math.min(last, n)),
    [last],
  );
  const go = useCallback((n: number) => setIndex(clamp(n)), [clamp]);

  // Auto-advance
  useEffect(() => {
    if (!playing) return;
    if (index >= last) {
      setPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => setIndex((i) => clamp(i + 1)), 3600);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [playing, index, last, clamp]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
      else if (e.key === " ") { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go]);

  const current = timeline[index];
  const progressPct = total > 1 ? (index / last) * 100 : 100;

  return (
    <div className="mt-10 space-y-8">
      {/* Stage */}
      <div className="relative min-h-[260px] sm:min-h-[300px] rounded-sm border border-foreground/10 bg-foreground/[0.02] px-6 sm:px-10 py-10 overflow-hidden">
        <div className="absolute inset-0 vignette" aria-hidden />
        <div className="relative">
          <div className="flex items-center justify-between text-[0.6rem] tracking-[0.4em] uppercase text-foreground/40 mb-6">
            <span>Beat {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
            <span>{playing ? "Playing" : "Paused"}</span>
          </div>
          <div key={index} className="animate-fade-in">
            <p className="text-[0.7rem] tracking-[0.35em] uppercase text-accent/85 mb-4">
              {current.beat}
            </p>
            <p className="font-display text-2xl sm:text-3xl leading-snug text-foreground/95 text-pretty">
              {current.consequence}
            </p>
          </div>
        </div>
      </div>

      {/* Scrubber rail */}
      <div className="space-y-4">
        <div className="relative h-8 flex items-center">
          {/* track */}
          <div className="absolute left-0 right-0 h-px bg-foreground/15" />
          {/* progress */}
          <div
            className="absolute left-0 h-px bg-accent/80 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }}
          />
          {/* dots */}
          <div className="relative w-full flex justify-between">
            {timeline.map((t, i) => {
              const active = i === index;
              const passed = i < index;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setPlaying(false); go(i); }}
                  aria-label={`Jump to beat ${i + 1}: ${t.beat}`}
                  className="group relative -my-3 p-2"
                >
                  <span
                    className={[
                      "block h-2.5 w-2.5 rounded-full border transition-all duration-300",
                      active
                        ? "h-3.5 w-3.5 border-accent bg-accent shadow-[0_0_12px_2px_rgba(224,179,113,0.45)]"
                        : passed
                          ? "border-accent/70 bg-accent/70"
                          : "border-foreground/30 bg-background group-hover:border-foreground/60",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>
          {/* invisible range for drag/touch */}
          <input
            type="range"
            min={0}
            max={last}
            step={1}
            value={index}
            onChange={(e) => { setPlaying(false); go(parseInt(e.target.value, 10)); }}
            aria-label="Scrub timeline"
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Transport */}
        <div className="flex items-center justify-center gap-8 pt-2">
          <button
            type="button"
            onClick={() => { setPlaying(false); go(index - 1); }}
            disabled={index === 0}
            className="text-[0.65rem] tracking-[0.4em] uppercase text-foreground/60 hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => {
              if (index >= last) { setIndex(0); setPlaying(true); }
              else setPlaying((p) => !p);
            }}
            className="flex items-center gap-3 text-[0.65rem] tracking-[0.45em] uppercase text-foreground hover:text-accent transition-colors"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/40 group-hover:border-accent">
              {playing ? (
                <span className="flex gap-[3px]">
                  <span className="block h-3 w-[3px] bg-current" />
                  <span className="block h-3 w-[3px] bg-current" />
                </span>
              ) : (
                <span className="block h-0 w-0 border-y-[6px] border-y-transparent border-l-[9px] border-l-current ml-[2px]" />
              )}
            </span>
            {index >= last && !playing ? "Replay" : playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            onClick={() => { setPlaying(false); go(index + 1); }}
            disabled={index === last}
            className="text-[0.65rem] tracking-[0.4em] uppercase text-foreground/60 hover:text-foreground disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
        <p className="text-center text-[0.55rem] tracking-[0.35em] uppercase text-foreground/30">
          ← → to scrub · space to play
        </p>
      </div>

      {/* Outcome accumulator — how the outcome assembled */}
      <div className="border-t border-foreground/10 pt-6">
        <p className="text-[0.55rem] tracking-[0.4em] uppercase text-foreground/40 mb-4 text-center">
          Outcome through beat {index + 1}
        </p>
        <ol className="space-y-2 text-sm text-foreground/70 leading-relaxed">
          {timeline.slice(0, index + 1).map((t, i) => (
            <li key={i} className="flex gap-3 animate-fade-in">
              <span className="text-accent/70 font-display text-base leading-none pt-[2px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-pretty">{t.consequence}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
