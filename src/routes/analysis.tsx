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
