import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { MISSIONS, type MissionMeta } from "@/lib/missions";
import { createAmbient } from "@/lib/ambient";
import { getSoundtrack } from "@/lib/soundtracks";
import { getAllMissionStats, type MissionStats } from "@/lib/mission-stats.functions";
import { readMission } from "@/lib/mission-store";
import { getMissionEngine } from "@/lib/missions/registry";

type PriorDecision = { archetypeLabel: string; decidedAt: number };

/** Read the player's last committed decision per mission from localStorage.
 *  Client-only; returns {} on the server. */
function usePriorDecisions(): Record<string, PriorDecision> {
  const [prior, setPrior] = useState<Record<string, PriorDecision>>({});
  useEffect(() => {
    const out: Record<string, PriorDecision> = {};
    for (const m of MISSIONS) {
      const saved = readMission(m.id);
      if (!saved.archetypeId || !saved.decidedAt) continue;
      const engine = getMissionEngine(m.id);
      const arche = engine?.getArchetype(saved.archetypeId);
      if (!arche) continue;
      out[m.id] = { archetypeLabel: arche.label, decidedAt: saved.decidedAt };
    }
    setPrior(out);
  }, []);
  return prior;
}

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Case Files — Decision Node" },
      {
        name: "description",
        content:
          "Browse the archive of cases. Each one drops you into a single moment before an irreversible decision.",
      },
      { property: "og:title", content: "Case Files — Decision Node" },
      {
        property: "og:description",
        content:
          "Browse the archive of cases. Each one drops you into a single moment before an irreversible decision.",
      },
    ],
  }),
  component: MissionsPage,
});

function MissionsPage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [entering, setEntering] = useState(false);
  const [armed, setArmed] = useState(false);

  const fetchStats = useServerFn(getAllMissionStats);
  const { data: stats } = useQuery({
    queryKey: ["mission-stats"],
    queryFn: () => fetchStats(),
    staleTime: 60_000,
  });
  const priorDecisions = usePriorDecisions();

  const soundOn = (() => {
    try { return localStorage.getItem("dn:sound") !== "off"; } catch { return true; }
  })();

  const ambientRef = useRef<ReturnType<typeof createAmbient> | null>(null);
  useEffect(() => {
    if (!ambientRef.current) ambientRef.current = createAmbient(null);
    const a = ambientRef.current;
    a.setMuted(!soundOn);
    const arm = async () => {
      if (armed) return;
      try {
        await a.start("mission-01");
        if (!hovered) await a.switchTo(null, 600);
        setArmed(true);
      } catch { /* noop */ }
    };
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      a.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const a = ambientRef.current;
    if (!a || !armed) return;
    const target = selected ?? hovered;
    if (target && getSoundtrack(target)) {
      void a.switchTo(target, 1400);
    } else {
      void a.switchTo(null, 1200);
    }
  }, [hovered, selected, armed]);

  function open(m: MissionMeta) {
    if (m.status !== "available") return;
    if (entering) return;
    setSelected(m.id);
    setEntering(true);
    setTimeout(() => navigate({ to: "/mission/$id", params: { id: m.id } }), 900);
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="starfield animate-drift" aria-hidden />
      <div
        className="starfield animate-drift"
        style={{
          animationDuration: "32s",
          animationDirection: "alternate-reverse",
          opacity: 0.5,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 35%, oklch(0.78 0.10 80 / 0.06), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="vignette" aria-hidden />
      <div className="film-grain" aria-hidden />

      <div
        className={`pointer-events-none fixed inset-0 z-40 bg-black transition-opacity duration-700 ${
          entering ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16 sm:px-10 sm:py-24">
        <header className="mb-16 flex items-start justify-between">
          <Link
            to="/"
            className="text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground hover:text-foreground/90 transition-colors"
          >
            ← Decision Node
          </Link>
          <p className="text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground/70">
            Archive · {MISSIONS.length} Case Files
          </p>
        </header>

        <div className="mb-16 max-w-2xl animate-fade-up">
          <p className="text-[0.65rem] tracking-[0.5em] uppercase text-muted-foreground mb-6">
            Case Files
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-foreground/95 text-balance">
            Open a case
          </h1>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground text-pretty">
            Each file places you in a single moment. The context is incomplete.
            The stakes are real. You still have to choose.
          </p>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2">
          {MISSIONS.map((m, i) => (
            <li
              key={m.id}
              className="animate-fade-up"
              style={{ animationDelay: `${0.15 + i * 0.12}s` }}
            >
              <MissionCard
                mission={m}
                stats={stats?.[m.id]}
                prior={priorDecisions[m.id]}
                hovered={hovered === m.id}
                dimmed={selected !== null && selected !== m.id}
                selected={selected === m.id}
                onHover={(h) => setHovered(h ? m.id : null)}
                onSelect={() => open(m)}
              />
            </li>
          ))}
        </ul>

        <footer className="mt-20 flex items-center justify-between text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground/60">
          <span>Headphones recommended</span>
          <span>Community archive · open to contributors soon</span>
        </footer>
      </section>
    </main>
  );
}

function MissionCard({
  mission,
  stats,
  prior,
  hovered,
  dimmed,
  selected,
  onHover,
  onSelect,
}: {
  mission: MissionMeta;
  stats?: MissionStats;
  prior?: PriorDecision;
  hovered: boolean;
  dimmed: boolean;
  selected: boolean;
  onHover: (h: boolean) => void;
  onSelect: () => void;
}) {
  const available = mission.status === "available";
  const statusLabel =
    mission.status === "available"
      ? "Open"
      : mission.status === "classified"
      ? "Classified"
      : "Sealed";

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      disabled={!available}
      aria-label={`${mission.codename} — ${statusLabel}`}
      className={`group relative block w-full overflow-hidden border border-foreground/15 bg-foreground/[0.015] p-7 text-left transition-all duration-500 ${
        available
          ? "hover:border-foreground/45 hover:bg-foreground/[0.04] cursor-pointer"
          : "cursor-not-allowed opacity-60"
      } ${dimmed ? "opacity-30" : ""} ${selected ? "border-accent/70" : ""}`}
      style={{ minHeight: "20rem" }}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute left-0 top-0 h-px bg-accent/70 transition-all duration-700 ${
          hovered && available ? "w-full" : "w-8"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute bottom-0 right-0 h-px bg-foreground/40 transition-all duration-700 ${
          hovered && available ? "w-full" : "w-8"
        }`}
      />

      {/* Header — case number + status */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[0.55rem] tracking-[0.4em] uppercase text-muted-foreground/60 mb-1">
            Case File
          </p>
          <span className="font-display text-5xl text-foreground/30 leading-none">
            {mission.number}
          </span>
        </div>
        <span
          className={`text-[0.55rem] tracking-[0.4em] uppercase ${
            available
              ? "text-accent/90"
              : mission.status === "classified"
              ? "text-muted-foreground/60"
              : "text-muted-foreground/40"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Title block */}
      <div className="mt-8">
        <h2 className="font-display text-3xl sm:text-4xl text-foreground/95 leading-tight">
          {mission.codename}
        </h2>
        {(mission.location || mission.year) && (
          <p className="mt-2 text-[0.6rem] tracking-[0.35em] uppercase text-muted-foreground/70">
            {[mission.location, mission.year].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>

      {/* Logline */}
      <p
        className={`mt-5 max-w-md text-sm leading-relaxed text-pretty ${
          available ? "text-foreground/70" : "text-muted-foreground/60 blur-[1.5px] select-none"
        }`}
      >
        {mission.logline}
      </p>

      {/* Neutral case-file stats — no decision distribution */}
      <dl className="mt-6 grid grid-cols-2 gap-y-2.5 gap-x-4 text-[0.6rem] tracking-[0.28em] uppercase">
        <Stat label="Duration" value={mission.duration ?? "—"} />
        <Stat
          label="Difficulty"
          value={<DifficultyDots level={stats?.difficultyRating ?? mission.difficulty ?? null} />}
        />
        <Stat label="Category" value={mission.category ?? "—"} />
        <Stat
          label="Plays"
          value={typeof stats?.plays === "number" ? stats.plays.toLocaleString() : "—"}
        />
        <Stat
          label="Avg Decision"
          value={formatSeconds(stats?.avgDecisionSeconds)}
        />
        <Stat
          label="Avg Investigation"
          value={formatSeconds(stats?.avgInvestigationSeconds)}
        />
      </dl>

      {/* Prior decision — a quiet recall so a returning player can see what
          they committed to last time. No score, no judgment. Per §08 #4 and
          the Archive milestone in the roadmap. */}
      {prior && available && (
        <div className="mt-6 border-t border-foreground/10 pt-4">
          <p className="text-[0.5rem] tracking-[0.4em] uppercase text-muted-foreground/55 mb-1">
            Your prior decision
          </p>
          <p className="text-xs text-foreground/75 leading-snug">
            {prior.archetypeLabel}
          </p>
        </div>
      )}

      {/* Footer — creator metadata + CTA */}
      <div className="mt-7 flex items-end justify-between gap-4">
        <div className="text-[0.55rem] tracking-[0.35em] uppercase text-muted-foreground/55 leading-relaxed">
          <div>{mission.creator ?? "—"}</div>
          <div className="text-muted-foreground/40">
            {mission.version ?? ""}
            {typeof stats?.completionRate === "number"
              ? ` · ${Math.round(stats.completionRate * 100)}% completion`
              : ""}
          </div>
        </div>
        {available && (
          <div
            className={`flex items-center gap-3 text-[0.6rem] tracking-[0.4em] uppercase transition-all duration-500 ${
              hovered ? "text-foreground/90 translate-x-0" : "text-foreground/40 -translate-x-1"
            }`}
          >
            <span className="h-px w-6 bg-current" />
            {selected ? "Opening" : "Open File"}
          </div>
        )}
      </div>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-muted-foreground/55 text-[0.5rem] tracking-[0.35em] mb-0.5">
        {label}
      </dt>
      <dd className="text-foreground/80 tabular-nums truncate">{value}</dd>
    </div>
  );
}

function DifficultyDots({ level }: { level: number | null }) {
  if (!level) return <span className="text-foreground/40">—</span>;
  const rounded = Math.round(level);
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`block h-1.5 w-1.5 rounded-full ${
            n <= rounded ? "bg-accent/85" : "bg-foreground/15"
          }`}
          aria-hidden
        />
      ))}
      <span className="sr-only">{rounded} of 5</span>
    </span>
  );
}

function formatSeconds(s: number | null | undefined): string {
  if (typeof s !== "number") return "—";
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return rest ? `${m}m ${rest}s` : `${m}m`;
}
