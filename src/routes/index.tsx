import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Decision Node" },
      {
        name: "description",
        content:
          "You wake up in someone else's body moments before the most important decision of their life. An AI-native interactive drama.",
      },
      { property: "og:title", content: "Decision Node" },
      {
        property: "og:description",
        content:
          "You wake up in someone else's body moments before the most important decision of their life.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* Layered starfield */}
      <div className="starfield animate-drift" aria-hidden />
      <div
        className="starfield animate-drift"
        style={{ animationDuration: "32s", animationDirection: "alternate-reverse", opacity: 0.6 }}
        aria-hidden
      />
      {/* Subtle radial glow at center */}
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

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="animate-fade-in-slow text-[0.65rem] tracking-[0.5em] uppercase text-muted-foreground mb-10">
          Mission One
        </p>

        <h1
          className="animate-fade-up font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.95] text-foreground/95 text-balance"
          style={{ animationDelay: "0.2s" }}
        >
          Decision Node
        </h1>

        <p
          className="animate-fade-up mt-10 max-w-xl text-base md:text-lg leading-relaxed text-muted-foreground text-pretty"
          style={{ animationDelay: "0.9s" }}
        >
          You wake up in someone else's body,
          <br className="hidden sm:inline" />
          moments before the most important decision of their life.
        </p>

        <div
          className="animate-fade-up mt-16"
          style={{ animationDelay: "1.6s" }}
        >
          <Link
            to="/mission"
            className="group inline-flex items-center gap-4 px-1 py-3 text-sm tracking-[0.4em] uppercase text-foreground/85 hover:text-foreground transition-colors"
          >
            <span className="h-px w-10 bg-foreground/30 group-hover:bg-foreground/70 group-hover:w-16 transition-all duration-500" />
            Begin Mission
            <span className="h-px w-10 bg-foreground/30 group-hover:bg-foreground/70 group-hover:w-16 transition-all duration-500" />
          </Link>
        </div>

        <p
          className="animate-fade-in-slow absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground/60"
          style={{ animationDelay: "2.4s" }}
        >
          Headphones recommended
        </p>
      </section>
    </main>
  );
}
