import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import type { DecisionAnalysis } from "@/lib/analysis.functions";
import { readMission, useMission, type SavedMission } from "@/lib/mission-store";
import { readProfile, type DecisionProfile } from "@/lib/decision-profile";
import { DecisionProfileCard } from "@/components/DecisionProfileCard";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getMissionPercentile, type MissionPercentile } from "@/lib/mission-stats.functions";
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
  const [mission, setMission] = useState<SavedMission | null>(null);
  const [profile, setProfile] = useState<DecisionProfile | null>(null);
  const [percentile, setPercentile] = useState<MissionPercentile | null>(null);
  const { reset } = useMission(mission?.missionId ?? "mission-01");
  const fetchPercentile = useServerFn(getMissionPercentile);

  useEffect(() => {
    const m = readMission();
    if (!m.analysis) {
      navigate({ to: "/" });
      return;
    }
    setMission(m);
    setProfile(readProfile());

    // Pull community percentile if we tracked investigation time.
    const invSeconds = m.startedAt && m.decidedAt
      ? Math.max(0, Math.round((m.decidedAt - m.startedAt) / 1000))
      : null;
    if (invSeconds !== null) {
      fetchPercentile({ data: { missionId: m.missionId, investigationSeconds: invSeconds } })
        .then(setPercentile)
        .catch(() => {});
    }
  }, [navigate, fetchPercentile]);

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
            Decision recorded
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight text-foreground/95 text-balance">
            {a.headline}
          </h1>
          {a.archetypeLabel && (
            <p className="mt-8 text-sm sm:text-base text-foreground/55 leading-relaxed">
              Your approach:{" "}
              <span className="font-display italic text-accent text-lg sm:text-xl">
                {a.archetypeLabel}
              </span>
              {typeof mission.confidence === "number" && (
                <span className="block mt-2 text-[0.6rem] tracking-[0.35em] uppercase text-foreground/40 tabular-nums">
                  Confidence: {mission.confidence}/100
                </span>
              )}
            </p>
          )}
        </section>

        {/* Interactive Timeline */}
        <section className="animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <SectionLabel>Consequence timeline</SectionLabel>
          <p className="mt-4 text-center text-xs text-foreground/45 tracking-wide">
            Review the key moments and how the outcome developed.
          </p>
          <TimelineScrubber timeline={a.timeline} />
        </section>

        {/* Verdict + expandable detail drawers */}
        <section className="space-y-12">
          <div className="animate-fade-up text-center" style={{ animationDelay: "1.4s" }}>
            <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-4">
              Verdict
            </p>
            <p className="font-display text-2xl sm:text-3xl leading-snug text-foreground/95 text-pretty max-w-2xl mx-auto">
              {a.closing}
            </p>
          </div>

          {/* Expandable details — ordered per spec */}
          <div className="animate-fade-up" style={{ animationDelay: "1.7s" }}>
            <SectionsProvider>
              <SectionsToolbar />
              <div className="divide-y divide-foreground/10 border-y border-foreground/10">
                {a.reasoningAssessment && (
                  <ExpandableSection
                    id="reasoning"
                    label="Reasoning assessment"
                    hint="How you weighed what you knew."
                  >
                    <ReasoningAssessment data={a.reasoningAssessment} />
                  </ExpandableSection>
                )}
                <ExpandableBlock
                  id="evidence-used"
                  label="Evidence considered"
                  hint="What you noticed and let shape the choice."
                  body={a.evidenceUsed}
                />
                <ExpandableBlock
                  id="evidence-ignored"
                  label="Evidence set aside"
                  hint="What was within reach but went unread."
                  body={a.evidenceIgnored}
                />
                <ExpandableBlock
                  id="assumptions"
                  label="Assumptions made"
                  hint="The beliefs you treated as settled."
                  body={a.assumptions}
                />
                <ExpandableBlock
                  id="alternatives"
                  label="Paths not taken"
                  hint="Other shapes this decision could have held."
                  body={a.alternatives}
                />
                {a.reasoningAssessment && a.reasoningAssessment.possibleBiases.length > 0 && (
                  <ExpandableSection
                    id="biases"
                    label="Cognitive patterns"
                    hint="Tendencies worth noticing — not verdicts."
                  >
                    <PossibleBiasesList biases={a.reasoningAssessment.possibleBiases} />
                  </ExpandableSection>
                )}
                <ExpandableSection
                  id="long-term"
                  label="Long-term consequences"
                  hint="Where this choice tends to lead, over time."
                >
                  <LongTermConsequences timeline={a.timeline} />
                </ExpandableSection>
                {a.beliefTrajectory && a.beliefTrajectory.length > 0 && (
                  <ExpandableSection
                    id="belief"
                    label="Belief trajectory"
                    hint="How your understanding shifted as it unfolded."
                  >
                    <BeliefTrajectory trajectory={a.beliefTrajectory} />
                  </ExpandableSection>
                )}
              </div>
            </SectionsProvider>
          </div>

          {percentile && percentile.plays >= 3 && (
            <CommunityComparison percentile={percentile} />
          )}

          {profile && <DecisionProfileCard profile={profile} delay={2.4} />}
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
                const id = mission?.missionId ?? "mission-01";
                navigate({ to: "/mission/$id", params: { id } });
              }}
              className="group flex items-center gap-3 text-[0.65rem] tracking-[0.4em] uppercase text-foreground/70 hover:text-foreground transition-colors"
            >
              <span className="h-px w-8 bg-foreground/30 group-hover:bg-foreground/70 group-hover:w-12 transition-all" />
              Replay
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

type SectionsCtx = {
  open: Set<string>;
  register: (id: string) => void;
  isOpen: (id: string) => boolean;
  setOpen: (id: string, open: boolean) => void;
  collapseAll: () => void;
  expandAll: () => void;
  anyOpen: boolean;
};

const SectionsContext = createContext<SectionsCtx | null>(null);

function SectionsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpenState] = useState<Set<string>>(new Set());
  const idsRef = useRef<Set<string>>(new Set());

  const register = useCallback((id: string) => {
    idsRef.current.add(id);
  }, []);

  const setOpen = useCallback((id: string, next: boolean) => {
    setOpenState((prev) => {
      const n = new Set(prev);
      if (next) n.add(id);
      else n.delete(id);
      return n;
    });
  }, []);

  const collapseAll = useCallback(() => setOpenState(new Set()), []);
  const expandAll = useCallback(
    () => setOpenState(new Set(idsRef.current)),
    [],
  );

  const value = useMemo<SectionsCtx>(
    () => ({
      open,
      register,
      isOpen: (id) => open.has(id),
      setOpen,
      collapseAll,
      expandAll,
      anyOpen: open.size > 0,
    }),
    [open, register, setOpen, collapseAll, expandAll],
  );

  return (
    <SectionsContext.Provider value={value}>{children}</SectionsContext.Provider>
  );
}

function useSections() {
  const ctx = useContext(SectionsContext);
  if (!ctx) throw new Error("Sections components must be used within SectionsProvider");
  return ctx;
}

function SectionsToolbar() {
  const { anyOpen, collapseAll, expandAll } = useSections();
  return (
    <div className="flex justify-end pb-3">
      <button
        type="button"
        onClick={anyOpen ? collapseAll : expandAll}
        className="group inline-flex items-center gap-2 text-[0.55rem] tracking-[0.4em] uppercase text-foreground/45 hover:text-foreground/85 transition-colors"
      >
        <span className="h-px w-4 bg-foreground/30 group-hover:bg-foreground/70 group-hover:w-6 transition-all" />
        {anyOpen ? "Collapse all" : "Expand all"}
      </button>
    </div>
  );
}

function ExpandableBlock({
  id,
  label,
  hint,
  body,
}: {
  id: string;
  label: string;
  hint?: string;
  body: string;
}) {
  return (
    <ExpandableSection id={id} label={label} hint={hint}>
      <p className="font-display text-lg sm:text-xl leading-relaxed text-foreground/85 text-pretty">
        {body}
      </p>
    </ExpandableSection>
  );
}

function ExpandableSection({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const { register, isOpen, setOpen } = useSections();
  useEffect(() => {
    register(id);
  }, [id, register]);
  const open = isOpen(id);
  return (
    <Collapsible open={open} onOpenChange={(v) => setOpen(id, v)}>
      <CollapsibleTrigger className="group flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-foreground">
        <span className="flex-1 min-w-0">
          <span className="block text-[0.65rem] tracking-[0.4em] uppercase text-foreground/60 group-hover:text-foreground/90 transition-colors">
            {label}
          </span>
          {hint && (
            <span className="mt-1.5 block text-[0.78rem] leading-snug text-foreground/40 group-hover:text-foreground/55 transition-colors normal-case tracking-normal">
              {hint}
            </span>
          )}
        </span>
        <span
          className={`mt-1 text-foreground/40 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          aria-hidden
        >
          +
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
        <div className="pb-8 pt-1">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const UPDATE_STYLES: Record<
  NonNullable<DecisionAnalysis["beliefTrajectory"]>[number]["update"],
  { label: string; ring: string; dot: string }
> = {
  formed: { label: "Formed", ring: "border-accent/60", dot: "bg-accent" },
  reinforced: {
    label: "Reinforced",
    ring: "border-accent/40",
    dot: "bg-accent/70",
  },
  revised: {
    label: "Revised",
    ring: "border-emerald-400/60",
    dot: "bg-emerald-400",
  },
  abandoned: {
    label: "Abandoned",
    ring: "border-foreground/40",
    dot: "bg-foreground/60",
  },
  held: {
    label: "Held despite evidence",
    ring: "border-rose-400/50",
    dot: "bg-rose-400/80",
  },
};

const CONFIDENCE_BARS: Record<
  NonNullable<DecisionAnalysis["beliefTrajectory"]>[number]["confidence"],
  number
> = { low: 1, medium: 2, high: 3 };

function BeliefTrajectory({
  trajectory,
}: {
  trajectory: NonNullable<DecisionAnalysis["beliefTrajectory"]>;
}) {
  return (
    <div
      className="animate-fade-up border-t border-foreground/15 pt-12"
      style={{ animationDelay: "2.5s" }}
    >
      <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-4 text-center">
        Belief trajectory
      </p>
        <p className="text-center text-xs text-foreground/45 max-w-md mx-auto leading-relaxed mb-10">
          How your understanding evolved as information emerged.
        </p>

      <ol className="relative space-y-8 border-l border-foreground/15 pl-6 ml-2">
        {trajectory.map((snap, i) => {
          const style = UPDATE_STYLES[snap.update] ?? UPDATE_STYLES.formed;
          const bars = CONFIDENCE_BARS[snap.confidence] ?? 2;
          return (
            <li key={i} className="relative">
              <span
                className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full border-2 ${style.ring} ${style.dot}`}
                aria-hidden
              />
              <div className="flex items-baseline justify-between gap-4 mb-2">
                <p className="text-[0.6rem] tracking-[0.35em] uppercase text-foreground/55">
                  {snap.marker}
                </p>
                <span className="text-[0.55rem] tracking-[0.3em] uppercase text-accent/80 whitespace-nowrap">
                  {style.label}
                </span>
              </div>
              <p className="font-display text-lg leading-snug text-foreground/95 text-pretty">
                {snap.hypothesis}
              </p>
              <div className="mt-3 flex items-center gap-3">
                <span className="text-[0.55rem] tracking-[0.3em] uppercase text-foreground/40">
                  Conviction
                </span>
                <span className="flex gap-1">
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      className={`block h-[3px] w-5 ${
                        n <= bars ? "bg-accent/80" : "bg-foreground/15"
                      }`}
                    />
                  ))}
                </span>
              </div>
              <p className="mt-3 text-sm text-foreground/65 leading-relaxed text-pretty">
                <span className="text-foreground/45">Trigger — </span>
                {snap.trigger}
              </p>
              <p className="mt-1 text-sm text-foreground/75 leading-relaxed italic text-pretty">
                {snap.note}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}


function ReasoningAssessment({
  data,
}: {
  data: NonNullable<DecisionAnalysis["reasoningAssessment"]>;
}) {
  return (
    <div
      className="animate-fade-up border-t border-foreground/15 pt-12 space-y-12"
      style={{ animationDelay: "2.55s" }}
    >
      <div>
          <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-4 text-center">
            Reasoning assessment
          </p>
          <p className="text-center text-xs text-foreground/45 max-w-md mx-auto leading-relaxed mb-8">
            Evaluating the process, not the result.
          </p>
        <p className="font-display text-xl sm:text-2xl leading-relaxed text-foreground/90 text-pretty">
          {data.summary}
        </p>
      </div>

      {data.strengths.length > 0 && (
        <div>
          <p className="text-[0.6rem] tracking-[0.35em] uppercase text-foreground/45 mb-5">
            Strengths
          </p>
          <ul className="space-y-5">
            {data.strengths.map((s, i) => (
              <li key={i} className="border-l-2 border-accent/60 pl-5">
                <p className="font-display text-lg leading-snug text-foreground/95">
                  {s.behavior}
                </p>
                <p className="mt-2 text-sm text-foreground/60 leading-relaxed text-pretty">
                  {s.evidence}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.blindSpots.length > 0 && (
        <div>
          <p className="text-[0.6rem] tracking-[0.35em] uppercase text-foreground/45 mb-5">
            Areas for attention
          </p>
          <ul className="space-y-5">
            {data.blindSpots.map((b, i) => (
              <li key={i} className="border-l-2 border-foreground/30 pl-5">
                <p className="font-display text-lg leading-snug text-foreground/95">
                  {b.pattern}
                </p>
                <p className="mt-2 text-sm text-foreground/60 leading-relaxed text-pretty">
                  {b.evidence}
                </p>
                <p className="mt-2 text-sm text-accent/80 leading-relaxed italic text-pretty">
                  {b.gentleReframe}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.possibleBiases.length > 0 && (
        <div>
          <p className="text-[0.6rem] tracking-[0.35em] uppercase text-foreground/45 mb-5">
            Cognitive patterns
          </p>
          <ul className="space-y-5">
            {data.possibleBiases.map((b, i) => (
              <li key={i} className="border-l-2 border-foreground/20 pl-5">
                <p className="text-[0.6rem] tracking-[0.3em] uppercase text-accent/70 mb-2">
                  Possibly {b.name}
                </p>
                <p className="font-display text-base leading-snug text-foreground/90 text-pretty">
                  {b.gentleExplanation}
                </p>
                <p className="mt-2 text-xs text-foreground/55 leading-relaxed text-pretty">
                  {b.evidence}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-8 border-t border-foreground/10 pt-8">
        <div>
          <p className="text-[0.6rem] tracking-[0.35em] uppercase text-foreground/45 mb-3">
            Calibration
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed text-pretty">
            {data.calibration}
          </p>
        </div>
        <div>
          <p className="text-[0.6rem] tracking-[0.35em] uppercase text-foreground/45 mb-3">
            Luck vs. process
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed text-pretty">
            {data.luckVsSkill}
          </p>
        </div>
      </div>
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

    </div>
  );
}

function PossibleBiasesList({
  biases,
}: {
  biases: NonNullable<DecisionAnalysis["reasoningAssessment"]>["possibleBiases"];
}) {
  return (
    <ul className="space-y-6">
      {biases.map((b, i) => (
        <li key={i} className="border-l-2 border-foreground/20 pl-5">
          <p className="text-[0.6rem] tracking-[0.3em] uppercase text-accent/70 mb-2">
            Possibly {b.name}
          </p>
          <p className="font-display text-base sm:text-lg leading-snug text-foreground/95 text-pretty">
            {b.gentleExplanation}
          </p>
          <p className="mt-2 text-xs text-foreground/55 leading-relaxed text-pretty">
            {b.evidence}
          </p>
        </li>
      ))}
    </ul>
  );
}

function LongTermConsequences({
  timeline,
}: {
  timeline: DecisionAnalysis["timeline"];
}) {
  // The later half of the timeline reads as second-order effects.
  const tail = timeline.slice(Math.ceil(timeline.length / 2));
  const shown = tail.length > 0 ? tail : timeline;
  return (
    <div className="space-y-6">
      <p className="text-sm text-foreground/55 leading-relaxed">
        What unfolds downstream of this choice — beyond the immediate aftermath.
      </p>
      <ol className="space-y-5">
        {shown.map((t, i) => (
          <li key={i} className="border-l-2 border-accent/30 pl-5">
            <p className="text-[0.6rem] tracking-[0.35em] uppercase text-foreground/55 mb-1.5">
              {t.beat}
            </p>
            <p className="font-display text-lg leading-snug text-foreground/95 text-pretty">
              {t.consequence}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function CommunityComparison({ percentile }: { percentile: MissionPercentile }) {
  const fmt = (s: number | null) => {
    if (s === null) return "—";
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return r ? `${m}m ${r}s` : `${m}m`;
  };
  return (
    <div
      className="animate-fade-up border-t border-foreground/15 pt-12 text-center"
      style={{ animationDelay: "2.7s" }}
    >
      <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-4">
        Community context
      </p>
      <p className="text-xs text-foreground/45 max-w-md mx-auto leading-relaxed mb-6">
        How your preparation compared to others who opened this file.
        Not a ranking — a mirror.
      </p>
      {typeof percentile.investigationPercentile === "number" && (
        <p className="font-display text-xl sm:text-2xl text-foreground/95 leading-snug max-w-xl mx-auto text-pretty">
          You investigated longer than{" "}
          <span className="text-accent tabular-nums">
            {percentile.investigationPercentile}%
          </span>{" "}
          of players.
        </p>
      )}
      <p className="mt-4 text-[0.6rem] tracking-[0.35em] uppercase text-foreground/40">
        Community avg investigation: {fmt(percentile.avgInvestigationSeconds)}
        {" · "}
        {percentile.plays.toLocaleString()} plays
      </p>
    </div>
  );
}
