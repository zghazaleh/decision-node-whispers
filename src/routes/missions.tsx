import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { MISSIONS, type MissionMeta } from "@/lib/missions";
import { createAmbient } from "@/lib/ambient";
import { getSoundtrack } from "@/lib/soundtracks";
import { getAllMissionStats, type MissionStats } from "@/lib/mission-stats.functions";
import { readMission } from "@/lib/mission-store";
import { getMissionEngine } from "@/lib/missions/registry";

/* -------------------------------------------------------------------------- */
/* Route                                                                       */
/* -------------------------------------------------------------------------- */

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "The Archive — Decision Nodes" },
      {
        name: "description",
        content:
          "The archive of cases. Choose one and step inside the single moment before an irreversible decision.",
      },
      { property: "og:title", content: "The Archive — Decision Nodes" },
      {
        property: "og:description",
        content:
          "The archive of cases. Choose one and step inside the single moment before an irreversible decision.",
      },
    ],
  }),
  component: MissionsPage,
});

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

type PriorDecision = { archetypeLabel: string; decidedAt: number };

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

function getSceneSrc(missionId: string): string | null {
  const engine = getMissionEngine(missionId);
  const src = engine?.scene?.src;
  return typeof src === "string" ? src : null;
}

function shortDuration(d: string | undefined): string {
  if (!d) return "—";
  // "20–40 min" → "20–40m"; "30 min" → "30m"
  return d.replace(/\s*min\b/i, "m");
}

function toneWord(t: string | undefined): string {
  if (!t) return "—";
  // First segment of "Tense · Suspended" → "Tense"
  return t.split("·")[0]!.trim();
}

/** Deterministic "today's pick" — same case all day, rotates by date. */
function pickToday(list: MissionMeta[]): MissionMeta | null {
  const available = list.filter((m) => m.status === "available");
  if (available.length === 0) return null;
  const now = new Date();
  const dayKey = Number(
    `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}`,
  );
  return available[dayKey % available.length] ?? available[0]!;
}

type SortMode = "curated" | "difficulty" | "stood" | "newest";
const SORT_LABEL: Record<SortMode, string> = {
  curated: "Curated",
  difficulty: "Difficulty",
  stood: "Most stood",
  newest: "Newest",
};
const SORT_ORDER: SortMode[] = ["curated", "difficulty", "stood", "newest"];

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

function MissionsPage() {
  const navigate = useNavigate();
  const fetchStats = useServerFn(getAllMissionStats);
  const { data: stats } = useQuery({
    queryKey: ["mission-stats"],
    queryFn: () => fetchStats(),
    staleTime: 60_000,
  });
  const priorDecisions = usePriorDecisions();

  // Filter state
  const [theme, setTheme] = useState<string>("All");
  const [domain, setDomain] = useState<string>("All");
  const [difficulty, setDifficulty] = useState<number | "Any">("Any");
  const [sort, setSort] = useState<SortMode>("curated");
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [entering, setEntering] = useState(false);

  // Available facet values
  const themes = useMemo(() => {
    const set = new Set<string>();
    for (const m of MISSIONS) if (m.theme) set.add(m.theme);
    return ["All", ...Array.from(set)];
  }, []);
  const domains = useMemo(() => {
    const set = new Set<string>();
    for (const m of MISSIONS) if (m.category) set.add(m.category);
    return ["All", ...Array.from(set).sort()];
  }, []);
  const difficulties = useMemo(() => {
    const set = new Set<number>();
    for (const m of MISSIONS) if (m.difficulty) set.add(m.difficulty);
    return Array.from(set).sort((a, b) => a - b);
  }, []);


  // TODAY pick (stable per day)
  const today = useMemo(() => pickToday(MISSIONS), []);

  // Apply filters + sort (exclude today's case from the list)
  const visible = useMemo(() => {
    let rows = MISSIONS.slice();
    if (today) rows = rows.filter((m) => m.id !== today.id);
    if (theme !== "All") rows = rows.filter((m) => m.theme === theme);
    if (domain !== "All") rows = rows.filter((m) => m.category === domain);
    if (difficulty !== "Any") rows = rows.filter((m) => m.difficulty === difficulty);
    switch (sort) {
      case "difficulty":
        rows.sort((a, b) => (a.difficulty ?? 99) - (b.difficulty ?? 99));
        break;
      case "stood":
        rows.sort(
          (a, b) =>
            (stats?.[b.id]?.plays ?? 0) - (stats?.[a.id]?.plays ?? 0),
        );
        break;
      case "newest":
        rows.sort((a, b) => b.number.localeCompare(a.number));
        break;
      case "curated":
      default:
        // Authored order
        break;
    }
    return rows;
  }, [theme, domain, difficulty, sort, stats, today]);

  // Closing the open row when filters change
  useEffect(() => {
    setOpenId(null);
  }, [theme, domain, difficulty, sort]);

  /* ----- Ambient soundtrack: only switches when a row is OPENED, not on peek */
  const soundOn = (() => {
    try { return localStorage.getItem("dn:sound") !== "off"; } catch { return true; }
  })();
  const ambientRef = useRef<ReturnType<typeof createAmbient> | null>(null);
  const armedRef = useRef(false);
  useEffect(() => {
    if (!ambientRef.current) ambientRef.current = createAmbient(null);
    const a = ambientRef.current;
    a.setMuted(!soundOn);
    const arm = async () => {
      if (armedRef.current) return;
      try {
        await a.start("mission-01");
        await a.switchTo(null, 600);
        armedRef.current = true;
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
    if (!a || !armedRef.current) return;
    if (openId && getSoundtrack(openId)) void a.switchTo(openId, 1400);
    else void a.switchTo(null, 1200);
  }, [openId]);

  function commit(id: string) {
    if (entering) return;
    setEntering(true);
    setTimeout(() => navigate({ to: "/mission/$id", params: { id } }), 700);
  }

  function clearFilters() {
    setTheme("All");
    setDomain("All");
    setDifficulty("Any");
  }


  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="starfield animate-drift" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="film-grain" aria-hidden />

      {/* Exit fade */}
      <div
        className={`pointer-events-none fixed inset-0 z-40 bg-black transition-opacity duration-700 ${
          entering ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-14 sm:px-10 sm:py-20">
        {/* ---------- Header ---------- */}
        <header className="mb-10 flex items-baseline justify-between">
          <Link
            to="/"
            className="text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground hover:text-foreground/90 transition-colors"
          >
            ← Decision Nodes
          </Link>
          <p className="text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground/70 tabular-nums">
            The Archive · {MISSIONS.length} case files
          </p>
        </header>

        {/* ---------- Filters ---------- */}
        <div className="mb-10 flex flex-wrap items-end gap-x-5 gap-y-3">
          {/* Domain */}
          <FilterSelect
            label="Domain"
            values={domains}
            active={domain}
            onChange={setDomain}
          />
          {/* Theme */}
          <FilterSelect
            label="Theme"
            values={themes}
            active={theme}
            onChange={setTheme}
          />

          {/* Difficulty */}
          <FilterSelect
            label="Difficulty"
            values={["Any", ...difficulties.map(String)]}
            active={difficulty === "Any" ? "Any" : String(difficulty)}
            onChange={(v) => setDifficulty(v === "Any" ? "Any" : Number(v))}
          />


          <div className="ml-auto flex items-center gap-4">
            {/* Active filter chip + clear */}
            {(theme !== "All" || domain !== "All" || difficulty !== "Any") && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-[0.55rem] tracking-[0.35em] uppercase text-muted-foreground/50 hover:text-accent transition-colors"
              >
                Clear
              </button>
            )}

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-[0.55rem] tracking-[0.4em] uppercase text-muted-foreground/55">
                Sort
              </span>
              <button
                type="button"
                onClick={() => {
                  const i = SORT_ORDER.indexOf(sort);
                  setSort(SORT_ORDER[(i + 1) % SORT_ORDER.length]!);
                }}
                className="text-[0.6rem] tracking-[0.35em] uppercase text-foreground/80 hover:text-accent transition-colors tabular-nums"
              >
                {SORT_LABEL[sort]} ↻
              </button>
            </div>
          </div>
        </div>

        {/* ---------- TODAY featured card ---------- */}
        {today && (
          <div className="mb-10">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-[0.55rem] tracking-[0.4em] uppercase text-accent">
                Today
              </span>
              <span className="h-px flex-1 bg-accent/25" aria-hidden />
              <span className="text-[0.55rem] tracking-[0.4em] uppercase text-muted-foreground/55">
                Case of the day
              </span>
            </div>
            <div className="overflow-hidden rounded-[14px] border border-accent/40 bg-[#0b0d10] motion-safe:animate-fade-up">
              {/* Art region */}
              <div className="relative aspect-[16/9] sm:aspect-auto sm:h-[260px] w-full overflow-hidden bg-[#0b0d10]">
                <SceneArt src={getSceneSrc(today.id)} theme={today.theme} brighten />
                {/* Top vignette — for eyebrow legibility */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-24"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(6,8,12,0.55) 0%, rgba(6,8,12,0) 100%)",
                  }}
                />
                {/* Bottom scrim — lighter, shorter, for title legibility */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1/2"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(6,8,12,0) 0%, rgba(6,8,12,0.55) 70%, rgba(6,8,12,0.75) 100%)",
                  }}
                />
                <p className="absolute left-5 top-4 text-[0.55rem] tracking-[0.4em] uppercase text-foreground/90">
                  Case File · {today.theme ?? "—"}
                </p>
                <div className="absolute bottom-4 left-5 right-5">
                  <h4 className="font-display text-3xl sm:text-[40px] leading-[1.05] text-foreground drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                    {today.codename}
                  </h4>
                  <p className="mt-1 text-[0.6rem] tracking-[0.35em] uppercase text-foreground/85">
                    {[today.location, today.year].filter(Boolean).join(" · ")}
                  </p>
                </div>
              </div>

              {/* Info strip */}
              <div className="px-5 py-5 sm:px-6 sm:py-6">
                <p className="font-display text-base sm:text-lg leading-snug text-foreground/90 text-pretty">
                  {today.logline}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground/75">
                  <span>{toneWord(today.tone)}</span>
                  <DifficultyDots level={today.difficulty ?? null} />
                  <span>{shortDuration(today.duration)}</span>
                  {today.category && <span>{today.category}</span>}
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => commit(today.id)}
                    aria-label={`Enter ${today.codename}`}
                    className="inline-flex min-h-[44px] items-center gap-3 rounded-full bg-accent px-6 py-2 text-[0.65rem] tracking-[0.4em] uppercase text-background hover:bg-accent/90 transition-colors w-full sm:w-auto justify-center"
                  >
                    Enter
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}




        {/* ---------- Ledger header ---------- */}
        <div className="hidden sm:grid grid-cols-[1fr_auto] items-baseline gap-x-8 border-b border-foreground/10 pb-2 text-[0.5rem] tracking-[0.4em] uppercase text-muted-foreground/55">
          <span>Case</span>
          <span className="grid grid-cols-[6rem_4rem_4rem_4rem] text-right tabular-nums">
            <span>Tone</span>
            <span>Level</span>
            <span>Length</span>
            <span>Stood</span>
          </span>
        </div>

        {/* ---------- Ledger ---------- */}
        {visible.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm italic text-muted-foreground/70">
              No cases under this lens.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-[0.6rem] tracking-[0.4em] uppercase text-accent/90 hover:text-accent"
            >
              Clear
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-foreground/10">
            {visible.map((m) => (
              <LedgerRow
                key={m.id}
                mission={m}
                stats={stats?.[m.id]}
                prior={priorDecisions[m.id]}
                isOpen={openId === m.id}
                isHovered={hoveredId === m.id}
                onHover={(h) => setHoveredId(h ? m.id : null)}
                onToggle={() => setOpenId((cur) => (cur === m.id ? null : m.id))}
                onEnter={() => commit(m.id)}
              />
            ))}
          </ul>
        )}

        <footer className="mt-16 flex items-center justify-between text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground/55">
          <span>Headphones recommended</span>
          <span>Stood = presence, not rank</span>
        </footer>
      </section>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Elegant filter select                                                       */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* Elegant filter select — custom dark dropdown                                */
/* -------------------------------------------------------------------------- */

function FilterSelect({
  label,
  values,
  active,
  onChange,
  renderValue,
}: {
  label: string;
  values: string[];
  active: string;
  onChange: (v: string) => void;
  renderValue?: (v: string) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-[0.55rem] tracking-[0.4em] uppercase text-muted-foreground/55">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between gap-3 rounded-md border border-foreground/10 bg-background/60 py-1.5 pl-3 pr-2.5 text-[0.65rem] tracking-[0.25em] uppercase text-foreground/90 outline-none transition-all hover:border-foreground/20 focus:border-accent/50 focus:ring-1 focus:ring-accent/30 cursor-pointer min-w-[140px]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="truncate flex items-center">
          {renderValue ? renderValue(active) : active}
        </span>
        <span
          className={`text-[0.5rem] text-foreground/40 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-md border border-foreground/10 bg-[#0b0d10] shadow-xl shadow-black/50">
          <ul role="listbox" className="max-h-[220px] overflow-y-auto py-1">
            {values.map((v) => {
              const isActive = v === active;
              return (
                <li key={v} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(v);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[0.6rem] tracking-[0.2em] uppercase transition-colors ${
                      isActive
                        ? "bg-accent/15 text-accent"
                        : "text-foreground/75 hover:bg-foreground/[0.04] hover:text-foreground"
                    }`}
                  >
                    <span className="w-2.5 text-center">
                      {isActive ? "✓" : ""}
                    </span>
                    <span className="truncate flex items-center">
                      {renderValue ? renderValue(v) : v}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ledger row (rest + peek + open)                                             */
/* -------------------------------------------------------------------------- */

function LedgerRow({
  mission,
  stats,
  prior,
  isOpen,
  isHovered,
  onHover,
  onToggle,
  onEnter,
}: {
  mission: MissionMeta;
  stats?: MissionStats;
  prior?: PriorDecision;
  isOpen: boolean;
  isHovered: boolean;
  onHover: (h: boolean) => void;
  onToggle: () => void;
  onEnter: () => void;
}) {
  const available = mission.status === "available";
  const stood = typeof stats?.plays === "number" ? stats.plays : null;
  const sceneSrc = available ? getSceneSrc(mission.id) : null;

  function onKey(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (!available) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  }

  return (
    <li>
      {/* ---- Rest / peek row ---- */}
      <div
        role="button"
        tabIndex={available ? 0 : -1}
        aria-expanded={isOpen}
        aria-disabled={!available}
        onClick={() => available && onToggle()}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onKeyDown={onKey}
        className={`group block cursor-pointer transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
          isOpen
            ? "h-2"
            : "min-h-[56px] px-2 py-4"
        } ${
          available
            ? "hover:bg-foreground/[0.03]"
            : "cursor-not-allowed opacity-50"
        } ${isOpen ? "bg-foreground/[0.02]" : ""}`}
      >
        {!isOpen && (
          <>
            {/* Desktop layout */}
            <div className="hidden sm:grid grid-cols-[1fr_auto] items-baseline gap-x-8">
              <div className="min-w-0">
                <div className="flex items-baseline gap-3">
                  <h3 className="font-display text-[21px] leading-tight text-foreground/95 truncate">
                    {mission.codename}
                  </h3>
                  <p className="text-[0.55rem] tracking-[0.35em] uppercase text-muted-foreground/65 truncate">
                    {[mission.location, mission.year].filter(Boolean).join(" · ")}
                  </p>
                </div>

                {/* Peek (desktop only): italic logline reveals on hover, no expand */}
                <div
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 motion-reduce:transition-none ${
                    isHovered
                      ? "max-h-12 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                  aria-hidden={!isHovered}
                >
                  <p className="mt-1 text-sm italic text-muted-foreground/80 line-clamp-1">
                    {mission.logline}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[6rem_4rem_4rem_4rem] items-baseline gap-x-0 text-right text-xs text-foreground/75 tabular-nums">
                <span className="truncate text-muted-foreground/75">{toneWord(mission.tone)}</span>
                <span className="inline-flex justify-end">
                  <DifficultyDots level={mission.difficulty ?? null} />
                </span>
                <span className="text-muted-foreground/75">{shortDuration(mission.duration)}</span>
                <span className="text-foreground/85">
                  {stood === null ? "—" : stood.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Mobile layout */}
            <div className="sm:hidden">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-[19px] leading-tight text-foreground/95 truncate">
                  {mission.codename}
                </h3>
                <span className="text-xs text-foreground/80 tabular-nums">
                  {stood === null ? "—" : stood.toLocaleString()}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground/70">
                <span>{toneWord(mission.tone)}</span>
                <DifficultyDots level={mission.difficulty ?? null} />
                <span>{shortDuration(mission.duration)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ---- Open card ---- */}
      {isOpen && available && (
        <div className="mb-4 overflow-hidden rounded-[14px] border border-accent/40 bg-[#0b0d10] motion-safe:animate-fade-up">
          {/* Art region */}
          <div className="relative aspect-[16/9] sm:aspect-auto sm:h-[236px] w-full overflow-hidden bg-[#0b0d10]">
            <SceneArt src={sceneSrc} theme={mission.theme} />

            {/* Bottom scrim — guarantees text contrast */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(6,8,12,0.05) 30%, rgba(6,8,12,0.78) 100%)",
              }}
            />
            <p className="absolute left-5 top-4 text-[0.55rem] tracking-[0.4em] uppercase text-foreground/85">
              Case File · {mission.theme ?? "—"}
            </p>
            <div className="absolute bottom-4 left-5 right-5">
              <h4 className="font-display text-3xl sm:text-[40px] leading-[1.05] text-foreground">
                {mission.codename}
              </h4>
              <p className="mt-1 text-[0.6rem] tracking-[0.35em] uppercase text-foreground/75">
                {[mission.location, mission.year].filter(Boolean).join(" · ")}
              </p>
            </div>
          </div>

          {/* Info strip */}
          <div className="px-5 py-5 sm:px-6 sm:py-6">
            <p className="font-display text-base sm:text-lg leading-snug text-foreground/90 text-pretty">
              {mission.logline}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground/75">
              <span>{toneWord(mission.tone)}</span>
              <DifficultyDots level={mission.difficulty ?? null} />
              <span>{shortDuration(mission.duration)}</span>
              <span>
                {stood === null
                  ? "Few have stood here"
                  : `${stood.toLocaleString()} stood here`}
              </span>
            </div>

            {prior && (
              <p className="mt-4 text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground/55">
                You last chose ·{" "}
                <span className="normal-case tracking-normal text-foreground/70 italic">
                  {prior.archetypeLabel}
                </span>
              </p>
            )}

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEnter();
                }}
                aria-label={`Enter ${mission.codename}`}
                className="inline-flex min-h-[44px] items-center gap-3 rounded-full bg-accent px-6 py-2 text-[0.65rem] tracking-[0.4em] uppercase text-background hover:bg-accent/90 transition-colors w-full sm:w-auto justify-center"
              >
                Enter
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}

/* -------------------------------------------------------------------------- */
/* Difficulty dots — muted, never gold                                         */
/* -------------------------------------------------------------------------- */

function DifficultyDots({
  level,
  compact = false,
}: {
  level: number | null;
  compact?: boolean;
}) {
  if (!level) return <span className="text-foreground/40">—</span>;
  const rounded = Math.round(level);
  const size = compact ? "h-1 w-1" : "h-1.5 w-1.5";
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`block rounded-full ${size} ${
            n <= rounded ? "bg-foreground/45" : "bg-foreground/12"
          }`}
          aria-hidden
        />
      ))}
      <span className="sr-only">{rounded} of 5</span>
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Scene art — skeleton shimmer + graceful fallback                            */
/* -------------------------------------------------------------------------- */

function SceneArt({
  src,
  theme,
  brighten = false,
}: {
  src: string | null;
  theme?: string;
  brighten?: boolean;
}) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error",
  );

  // Reset state when src changes (different mission opened)
  useEffect(() => {
    setStatus(src ? "loading" : "error");
  }, [src]);

  return (
    <>
      {/* Skeleton shimmer — visible while loading */}
      {status === "loading" && (
        <div
          aria-hidden
          className="absolute inset-0 overflow-hidden bg-foreground/[0.04]"
        >
          <div className="absolute inset-0 motion-safe:animate-[shimmer_2.4s_ease-in-out_infinite] bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.04)_50%,transparent_70%)] bg-[length:200%_100%]" />
        </div>
      )}

      {/* Fallback — quiet textured panel with theme watermark */}
      {status === "error" && (
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-[0.55rem] tracking-[0.5em] uppercase text-foreground/25">
              {theme ?? "Case File"}
            </span>
          </div>
        </div>
      )}

      {src && status !== "error" && (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setStatus("loaded")}
          onError={() => setStatus("error")}
          style={
            brighten
              ? { filter: "brightness(1.35) contrast(1.08) saturate(1.05)" }
              : undefined
          }
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            status === "loaded" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </>
  );
}

