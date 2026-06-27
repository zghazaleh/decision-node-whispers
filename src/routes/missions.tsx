import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MISSIONS, type MissionMeta } from "@/lib/missions";
import { createAmbient } from "@/lib/ambient";
import { getSoundtrack } from "@/lib/soundtracks";

export const Route = createFileRoute("/missions")({
  head: () => ({
    meta: [
      { title: "Missions — Decision Node" },
      {
        name: "description",
        content:
          "Choose a mission. Each one drops you into a stranger's body, moments before the decision that defines them.",
      },
      { property: "og:title", content: "Missions — Decision Node" },
      {
        property: "og:description",
        content:
          "Choose a mission. Each one drops you into a stranger's body, moments before the decision that defines them.",
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

  // Respect the global mute pref set on the mission screen.
  const soundOn = (() => {
    try { return localStorage.getItem("dn:sound") !== "off"; } catch { return true; }
  })();

  // Single ambient instance for this page. Browsers gate autoplay behind a
  // user gesture, so we arm on first pointerdown/keydown and then let hover
  // previews crossfade between tracks.
  const ambientRef = useRef<ReturnType<typeof createAmbient> | null>(null);
  useEffect(() => {
    if (!ambientRef.current) ambientRef.current = createAmbient(null);
    const a = ambientRef.current;
    a.setMuted(!soundOn);
    const arm = async () => {
      if (armed) return;
      try {
        // Start silent (no mission), then let hover decide what to play.
        // We need to call start() in the gesture; pass a known track so the
        // <audio> element is allowed to play. If nothing is hovered, we
        // immediately fade it back out.
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

  // Crossfade ambient to whichever card is hovered/selected.
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
    if (m.status !== "available" || !m.route) return;
    if (entering) return;
    setSelected(m.id);
    setEntering(true);
    // Let the selected track swell, then leave it playing on the mission page.
    setTimeout(() => navigate({ to: m.route! }), 900);
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

      {/* Cinematic "entering" curtain when launching a mission */}
      <div
        className={`pointer-events-none fixed inset-0 z-40 bg-black transition-opacity duration-700 ${
          entering ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden
      />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-16 sm:px-10 sm:py-24">
        {/* Header */}
        <header className="mb-16 flex items-start justify-between">
          <Link
            to="/"
            className="text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground hover:text-foreground/90 transition-colors"
          >
            ← Decision Node
          </Link>
          <p className="text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground/70">
            Dossier · {MISSIONS.length} Files
          </p>
        </header>

        <div className="mb-16 max-w-2xl animate-fade-up">
          <p className="text-[0.65rem] tracking-[0.5em] uppercase text-muted-foreground mb-6">
            Select a Mission
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] text-foreground/95 text-balance">
            Whose decision
            <br />
            do you want to live inside?
          </h1>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground text-pretty">
            Each mission drops you into a stranger's body, moments before the
            choice that will define their life. You will not know who you are.
            You will have to find out.
          </p>
        </div>

        {/* Mission grid */}
        <ul className="grid gap-6 sm:grid-cols-2">
          {MISSIONS.map((m, i) => (
            <li
              key={m.id}
              className="animate-fade-up"
              style={{ animationDelay: `${0.15 + i * 0.12}s` }}
            >
              <MissionCard
                mission={m}
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
          <span>More files inbound</span>
        </footer>
      </section>
    </main>
  );
}

function MissionCard({
  mission,
  hovered,
  dimmed,
  selected,
  onHover,
  onSelect,
}: {
  mission: MissionMeta;
  hovered: boolean;
  dimmed: boolean;
  selected: boolean;
  onHover: (h: boolean) => void;
  onSelect: () => void;
}) {
  const available = mission.status === "available";
  const statusLabel =
    mission.status === "available"
      ? "Available"
      : mission.status === "classified"
      ? "Classified"
      : "Locked";

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
      style={{ minHeight: "16rem" }}
    >
      {/* Faint scan line that grows on hover */}
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

      {/* Header row */}
      <div className="flex items-start justify-between">
        <span className="font-display text-5xl text-foreground/30 leading-none">
          {mission.number}
        </span>
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

      {/* Title */}
      <div className="mt-10">
        <p className="text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground/70">
          Codename
        </p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl text-foreground/95 leading-tight">
          {mission.codename}
        </h2>
      </div>

      {/* Logline */}
      <p
        className={`mt-5 max-w-md text-sm leading-relaxed text-pretty ${
          available ? "text-foreground/70" : "text-muted-foreground/60 blur-[1.5px] select-none"
        }`}
      >
        {mission.logline}
      </p>

      {/* Footer row */}
      <div className="mt-8 flex items-center justify-between text-[0.55rem] tracking-[0.35em] uppercase text-muted-foreground/70">
        <span>{mission.tone ?? "—"}</span>
        <span>{mission.duration ?? ""}</span>
      </div>

      {/* CTA appears on hover for available missions */}
      {available && (
        <div
          className={`mt-6 flex items-center gap-3 text-[0.6rem] tracking-[0.4em] uppercase transition-all duration-500 ${
            hovered ? "text-foreground/90 translate-x-0" : "text-foreground/40 -translate-x-1"
          }`}
        >
          <span className="h-px w-6 bg-current" />
          {selected ? "Entering" : "Begin"}
          <span className="h-px w-6 bg-current" />
        </div>
      )}
    </button>
  );
}
