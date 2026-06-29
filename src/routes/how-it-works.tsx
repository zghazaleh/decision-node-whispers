import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { audio } from "@/lib/audio/director";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — Decision Nodes" },
      {
        name: "description",
        content:
          "How Decision Nodes works: the mission format, the Decision Profile, and what to expect before you step inside a case.",
      },
      { property: "og:title", content: "How It Works — Decision Nodes" },
      {
        property: "og:description",
        content:
          "How Decision Nodes works: the mission format, the Decision Profile, and what to expect before you step inside a case.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const SECTIONS = [
  {
    label: "01  The Mission Format",
    title: "One case. One decision. No return.",
    body: [
      "Each mission places you in a single, irreversible moment. A boardroom memo that isn't ready. A checkpoint at dawn. A village with no armed men in it.",
      "You read. You question. You decide. The case unfolds through dialogue and scene — not multiple-choice, but a living transcript that responds to what you ask, what you ignore, and what you commit to.",
      "Most cases run 20 to 40 minutes. Some are shorter. None are easy.",
    ],
  },
  {
    label: "02  The Decision",
    title: "There is no right answer. Only your answer.",
    body: [
      "At the heart of every case is a choice you cannot undo. The game does not score you on correctness. It listens to how you got there.",
      "Did you gather everything available, or decide with what you had? Did your confidence rise and then lock, or did you revise when the evidence shifted? Did you see second-order consequences, or only the immediate pressure?",
      "Your decision is recorded. Your reasoning is assessed. And both become part of something larger.",
    ],
  },
  {
    label: "03  The Decision Profile",
    title: "A portrait built across missions.",
    body: [
      "After each case, an analysis maps your reasoning across eight dimensions — Strategic Thinking, Curiosity, Information Gathering, Confidence Calibration, Adaptability, Negotiation, Second-Order Thinking, and Bias Resistance.",
      "These scores are not grades. They are readings. Over time they form a radar chart: a shape that shifts as you play, revealing how you reason under different kinds of pressure.",
      "The Profile is yours. It persists across devices if you create an account. Anonymous players can complete up to three cases before saving their progress.",
    ],
  },
  {
    label: "04  What to Expect",
    title: "Atmosphere, not arcade.",
    body: [
      "Decision Nodes is designed for headphones and a quiet room. Each case has its own score, its own visual scene, and its own emotional temperature.",
      "Some cases are tense and claustrophobic. Others are vast and quiet. All of them ask you to inhabit someone else's dilemma fully, without the safety of a rewind.",
      "After you complete a mission, you can explore Alternate Paths — the outcomes of the choices you did not take — without altering your canonical profile. This is for curiosity, not correction.",
    ],
  },
];

function HowItWorksPage() {
  useEffect(() => {
    if (audio.isIgnited()) {
      void audio.enter("archive");
    }
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="starfield animate-drift" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="film-grain" aria-hidden />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-14 sm:px-10 sm:py-20">
        {/* Header */}
        <header className="mb-12 flex items-baseline justify-between">
          <Link
            to="/missions"
            className="text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground hover:text-foreground/90 transition-colors"
          >
            ← Case Archive
          </Link>
          <p className="text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground/70 tabular-nums">
            Field Manual
          </p>
        </header>

        {/* Title */}
        <div className="mb-16 animate-fade-up">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[0.95] text-foreground/95 text-balance">
            How it works
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-foreground/60 text-pretty">
            Decision Nodes is an interactive drama built around irreversible
            decisions. Before you open your first case, here is what awaits
            inside.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-16">
          {SECTIONS.map((section, i) => (
            <article
              key={section.label}
              className="animate-fade-up"
              style={{ animationDelay: `${0.2 + i * 0.15}s` }}
            >
              <div className="mb-4 flex items-center gap-4">
                <span className="text-[0.55rem] tracking-[0.4em] uppercase text-accent/90 tabular-nums">
                  {section.label}
                </span>
                <span className="h-px flex-1 bg-foreground/10" aria-hidden />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl leading-tight text-foreground/95 text-balance">
                {section.title}
              </h2>
              <div className="mt-5 space-y-4">
                {section.body.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-sm leading-[1.7] text-foreground/65 text-pretty"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 animate-fade-up" style={{ animationDelay: "0.8s" }}>
          <div className="flex flex-col items-center gap-6 border-t border-foreground/10 pt-12">
            <p className="text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground/60">
              Ready to begin?
            </p>
            <Link
              to="/missions"
              className="group inline-flex items-center gap-4 px-1 py-3 text-sm tracking-[0.4em] uppercase text-foreground/85 hover:text-foreground transition-colors"
            >
              <span className="h-px w-10 bg-foreground/30 group-hover:bg-foreground/70 group-hover:w-16 transition-all duration-500" />
              Open the Case Archive
              <span className="h-px w-10 bg-foreground/30 group-hover:bg-foreground/70 group-hover:w-16 transition-all duration-500" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 flex items-center justify-between text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground/55">
          <span>Headphones recommended</span>
          <span>Decision Nodes</span>
        </footer>
      </section>
    </main>
  );
}
