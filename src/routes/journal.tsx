import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  useDecisionProfile,
  type Dimension,
  type MissionContribution,
} from "@/lib/decision-profile";
import { MISSIONS } from "@/lib/missions";
import { readMission } from "@/lib/mission-store";
import { useAuthUser } from "@/lib/auth-sync";
import sceneCosmos from "@/assets/scene-cosmos.jpg";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Decision Journal — Decision Nodes" },
      {
        name: "description",
        content:
          "A chronological record of every decision you've held, and how your Decision Profile is shifting underneath them.",
      },
      { property: "og:title", content: "Decision Journal — Decision Nodes" },
      {
        property: "og:description",
        content:
          "A chronological record of every decision you've held, and how your Decision Profile is shifting underneath them.",
      },
    ],
  }),
  component: JournalPage,
});

function fmtDate(ts: number) {
  return new Date(ts).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function missionMeta(id: string) {
  return MISSIONS.find((m) => m.id === id);
}

/** Per-axis weighted average across a contribution slice (older to newer). */
function rollingAxis(contribs: MissionContribution[], d: Dimension): number {
  if (contribs.length === 0) return 50;
  let num = 0;
  let den = 0;
  contribs.forEach((c, i) => {
    const w = 1 + i * 0.25;
    num += c.scores[d] * w;
    den += w;
  });
  return Math.round(num / den);
}

/** Growth = current rolling avg minus rolling avg from before the most recent half of missions. */
function growthAreas(contribs: MissionContribution[]) {
  if (contribs.length < 2) return [];
  const split = Math.max(1, Math.floor(contribs.length / 2));
  const earlier = contribs.slice(0, split);
  const out = DIMENSIONS.map((d) => ({
    dimension: d,
    delta: rollingAxis(contribs, d) - rollingAxis(earlier, d),
    current: rollingAxis(contribs, d),
  }));
  return out.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

function JournalPage() {
  const profile = useDecisionProfile();
  const user = useAuthUser();
  const contribs = profile.contributions;

  // Pair each contribution with its saved mission (for decision/reasoning text).
  const entries = useMemo(() => {
    // newest first for display
    return [...contribs].reverse().map((c, idxRev) => {
      const indexFromStart = contribs.length - 1 - idxRev;
      const prev = indexFromStart > 0 ? contribs[indexFromStart - 1] : null;
      const meta = missionMeta(c.missionId);
      const saved = typeof window !== "undefined" ? readMission(c.missionId) : null;
      return { contribution: c, prev, meta, saved, indexFromStart };
    });
  }, [contribs]);

  const growth = useMemo(() => growthAreas(contribs), [contribs]);
  const topGrowth = growth.filter((g) => g.delta > 0).slice(0, 3);
  const topAttention = growth.filter((g) => g.delta < 0).slice(0, 2);

  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed inset-0">
        <img
          src={sceneCosmos}
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-25"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0 0 0 / 0.78), oklch(0 0 0 / 0.94))",
          }}
        />
        <div className="film-grain" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 sm:py-28">
        {/* Header */}
        <header className="text-center animate-fade-up">
          <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-4">
            Decision Journal
          </p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-foreground/95 text-balance">
            Every room you've held.
          </h1>
          <p className="mt-5 text-sm sm:text-base text-foreground/55 max-w-lg mx-auto leading-relaxed text-pretty">
            A chronological record of the decisions you committed to — and how your
            profile has been shifting underneath them.
          </p>
        </header>

        {/* Summary strip */}
        <section
          className="mt-14 animate-fade-up grid grid-cols-3 gap-4 sm:gap-6 border-y border-foreground/10 py-6"
          style={{ animationDelay: "0.15s" }}
        >
          <Stat label="Decisions held" value={profile.missionsCompleted.toString()} />
          <Stat label="Missions logged" value={contribs.length.toString()} />
          <Stat
            label="First entry"
            value={contribs.length > 0 ? fmtDate(contribs[0].at) : "—"}
            small
          />
        </section>

        {/* Empty state */}
        {contribs.length === 0 && (
          <section
            className="mt-16 text-center animate-fade-up"
            style={{ animationDelay: "0.25s" }}
          >
            <p className="text-sm sm:text-base text-foreground/65 leading-relaxed max-w-md mx-auto text-pretty">
              The journal opens after your first decision. Walk into a room, hold a
              call, and it begins to fill on its own.
            </p>
            <div className="mt-10 flex items-center justify-center gap-8">
              <Link
                to="/missions"
                className="group flex items-center gap-3 text-[0.65rem] tracking-[0.4em] uppercase text-foreground/80 hover:text-foreground transition-colors"
              >
                <span className="h-px w-8 bg-foreground/40 group-hover:bg-foreground/80 group-hover:w-12 transition-all" />
                Enter the archive
              </Link>
            </div>
            {!user && (
              <p className="mt-10 text-[0.55rem] tracking-[0.4em] uppercase italic text-foreground/40">
                Sign in to keep your journal across devices
              </p>
            )}
          </section>
        )}

        {/* Emerging pattern */}
        {contribs.length > 0 && (
          <section
            className="mt-12 animate-fade-up"
            style={{ animationDelay: "0.25s" }}
          >
            <p className="text-[0.55rem] tracking-[0.4em] uppercase text-foreground/45 mb-3 text-center">
              Emerging pattern
            </p>
            <p className="font-display text-lg sm:text-xl text-foreground/85 leading-snug text-center text-balance max-w-2xl mx-auto">
              {profile.emergingPattern}
            </p>
          </section>
        )}

        {/* Growth areas */}
        {(topGrowth.length > 0 || topAttention.length > 0) && (
          <section
            className="mt-16 animate-fade-up"
            style={{ animationDelay: "0.35s" }}
          >
            <p className="text-[0.55rem] tracking-[0.4em] uppercase text-foreground/45 mb-5 text-center">
              How you've been shifting
            </p>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {topGrowth.length > 0 && (
                <GrowthCard
                  caption="Rising"
                  tone="up"
                  items={topGrowth}
                />
              )}
              {topAttention.length > 0 && (
                <GrowthCard
                  caption="Worth attention"
                  tone="down"
                  items={topAttention}
                />
              )}
            </div>
          </section>
        )}

        {/* Timeline */}
        {entries.length > 0 && (
          <section
            className="mt-20 animate-fade-up"
            style={{ animationDelay: "0.45s" }}
          >
            <p className="text-[0.55rem] tracking-[0.4em] uppercase text-foreground/45 mb-8 text-center">
              The timeline
            </p>
            <ol className="relative border-l border-foreground/15 ml-3 sm:ml-4 space-y-10">
              {entries.map(({ contribution, prev, meta, saved }) => {
                const deltas: { d: Dimension; delta: number }[] = prev
                  ? DIMENSIONS.map((d) => ({
                      d,
                      delta: contribution.scores[d] - prev.scores[d],
                    }))
                      .filter((x) => Math.abs(x.delta) >= 4)
                      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
                      .slice(0, 3)
                  : [];

                return (
                  <li key={`${contribution.missionId}-${contribution.at}`} className="pl-6 sm:pl-8 relative">
                    <span
                      aria-hidden
                      className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent/80 ring-4 ring-background"
                    />
                    <div className="flex items-baseline justify-between gap-4 flex-wrap">
                      <div className="min-w-0">
                        <p className="text-[0.55rem] tracking-[0.4em] uppercase text-foreground/45">
                          {meta ? `Case ${meta.number}` : "Case"} ·{" "}
                          {fmtDate(contribution.at)}
                        </p>
                        <h3 className="mt-1 font-display text-lg sm:text-xl text-foreground/95 leading-tight text-pretty">
                          {meta?.codename ?? contribution.missionId}
                        </h3>
                      </div>
                      {contribution.source && (
                        <span className="text-[0.5rem] tracking-[0.35em] uppercase text-foreground/35 italic shrink-0">
                          {contribution.source === "model" ? "Analyzed" : "Estimated"}
                        </span>
                      )}
                    </div>

                    {saved?.decision && (
                      <blockquote className="mt-3 border-l-2 border-accent/40 pl-4 text-sm sm:text-base text-foreground/80 leading-relaxed text-pretty">
                        {saved.decision}
                      </blockquote>
                    )}

                    {saved?.reasoning && (
                      <p className="mt-3 text-xs sm:text-sm text-foreground/55 leading-relaxed text-pretty">
                        {saved.reasoning}
                      </p>
                    )}

                    {deltas.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {deltas.map(({ d, delta }) => (
                          <span
                            key={d}
                            className={`text-[0.6rem] tracking-[0.2em] uppercase px-2.5 py-1 border ${
                              delta > 0
                                ? "border-accent/40 text-accent/90"
                                : "border-foreground/20 text-foreground/55"
                            }`}
                          >
                            {DIMENSION_LABELS[d]}{" "}
                            <span className="tabular-nums">
                              {delta > 0 ? "+" : ""}
                              {delta}
                            </span>
                          </span>
                        ))}
                      </div>
                    )}

                    {contribution.signals.length > 0 && (
                      <p className="mt-4 text-[0.6rem] tracking-[0.3em] uppercase text-foreground/35">
                        {contribution.signals.slice(0, 3).join(" · ")}
                      </p>
                    )}

                    <div className="mt-4">
                      <Link
                        to="/mission/$id"
                        params={{ id: contribution.missionId }}
                        className="text-[0.6rem] tracking-[0.35em] uppercase text-foreground/50 hover:text-foreground/85 transition-colors"
                      >
                        Re-open the room →
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* Coda */}
        <footer
          className="mt-24 pt-10 border-t border-foreground/10 text-center animate-fade-up"
          style={{ animationDelay: "0.55s" }}
        >
          <Link
            to="/missions"
            className="group inline-flex items-center gap-3 text-[0.65rem] tracking-[0.4em] uppercase text-foreground/70 hover:text-foreground transition-colors"
          >
            <span className="h-px w-8 bg-foreground/30 group-hover:bg-foreground/70 group-hover:w-12 transition-all" />
            Walk into another room
          </Link>
        </footer>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  small = false,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="text-center">
      <p
        className={`font-display tabular-nums text-foreground/90 ${
          small ? "text-base sm:text-lg" : "text-2xl sm:text-3xl"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-[0.55rem] tracking-[0.35em] uppercase text-foreground/45">
        {label}
      </p>
    </div>
  );
}

function GrowthCard({
  caption,
  tone,
  items,
}: {
  caption: string;
  tone: "up" | "down";
  items: { dimension: Dimension; delta: number; current: number }[];
}) {
  return (
    <div className="border border-foreground/10 bg-foreground/[0.02] backdrop-blur-sm p-5">
      <p
        className={`text-[0.55rem] tracking-[0.4em] uppercase mb-4 ${
          tone === "up" ? "text-accent/80" : "text-foreground/55"
        }`}
      >
        {caption}
      </p>
      <ul className="space-y-3">
        {items.map(({ dimension, delta, current }) => (
          <li key={dimension} className="flex items-baseline justify-between gap-3">
            <span className="font-display text-sm text-foreground/85 leading-snug">
              {DIMENSION_LABELS[dimension]}
            </span>
            <span className="text-xs tabular-nums text-foreground/55 shrink-0">
              <span
                className={tone === "up" ? "text-accent/90" : "text-foreground/70"}
              >
                {delta > 0 ? "+" : ""}
                {delta}
              </span>
              <span className="text-foreground/35"> · {current}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
