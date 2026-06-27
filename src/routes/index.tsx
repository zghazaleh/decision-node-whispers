import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Decision Node" },
      {
        name: "description",
        content:
          "Wake up in someone else's life. One irreversible decision. An interactive drama.",
      },
      { property: "og:title", content: "Decision Node" },
      {
        property: "og:description",
        content:
          "Wake up in someone else's life. One irreversible decision. An interactive drama.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative min-h-[100svh] overflow-x-hidden bg-background">
      <div className="starfield animate-drift" aria-hidden />
      <div
        className="starfield animate-drift"
        style={{ animationDuration: "32s", animationDirection: "alternate-reverse", opacity: 0.6 }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 55%, oklch(0.78 0.10 80 / 0.08), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="vignette" aria-hidden />
      <div className="film-grain" aria-hidden />

      <section className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-6 pt-20 pb-28 text-center">
        <h1
          className="animate-fade-up font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.95] text-foreground/95 text-balance"
          style={{ animationDelay: "0.2s" }}
        >
          Decision Node
        </h1>

        {/* Mysterious four-line opening, paced like a stanza */}
        <div
          className="animate-fade-up mt-10 sm:mt-12 space-y-3 text-foreground/85"
          style={{ animationDelay: "0.9s" }}
        >
          <p className="font-display text-lg sm:text-xl md:text-2xl tracking-wide">{"\n"}</p>
          <p className="font-display text-lg sm:text-xl md:text-2xl tracking-wide text-foreground/70">
            Someone else's life.
          </p>
          <p className="font-display text-lg sm:text-xl md:text-2xl tracking-wide text-accent">
            One irreversible decision.
          </p>
        </div>

        <div
          className="animate-fade-up mt-12 sm:mt-16"
          style={{ animationDelay: "1.6s" }}
        >
          <Link
            to="/missions"
            className="group inline-flex items-center gap-4 px-1 py-3 text-sm tracking-[0.4em] uppercase text-foreground/85 hover:text-foreground transition-colors"
          >
            <span className="h-px w-10 bg-foreground/30 group-hover:bg-foreground/70 group-hover:w-16 transition-all duration-500" />
            Begin
            <span className="h-px w-10 bg-foreground/30 group-hover:bg-foreground/70 group-hover:w-16 transition-all duration-500" />
          </Link>
        </div>

        <p
          className="animate-fade-in-slow absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground/60"
          style={{ animationDelay: "2.4s" }}
        >
          Headphones recommended
        </p>
      </section>
    </main>
  );
}
