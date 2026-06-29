import { createFileRoute, Link } from "@tanstack/react-router";

const URL = "https://decision-nodes.com/blog/decision-making-frameworks-guide";
const TITLE = "Decision-Making Frameworks: OODA, WRAP, and Cynefin Compared";
const DESCRIPTION =
  "A practical guide to OODA, WRAP, and Cynefin — when each framework helps, where it breaks, and how irreversible decisions change the math.";

export const Route = createFileRoute("/blog/decision-making-frameworks-guide")({
  component: FrameworksGuide,
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: URL },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: TITLE,
          description: DESCRIPTION,
          mainEntityOfPage: URL,
          author: { "@type": "Organization", name: "Decision Nodes" },
          publisher: { "@type": "Organization", name: "Decision Nodes" },
        }),
      },
    ],
  }),
});

function FrameworksGuide() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-foreground">
      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground">
        Field notes
      </p>
      <h1 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
        Decision-Making Frameworks: OODA, WRAP, and Cynefin Compared
      </h1>
      <p className="mt-6 text-base text-muted-foreground">
        A practical guide to the three frameworks people reach for when a
        decision matters — and what changes when the decision is
        irreversible.
      </p>

      <article className="prose prose-invert mt-12 max-w-none space-y-8 text-foreground/90">
        <section>
          <h2 className="font-display text-2xl">Why frameworks at all</h2>
          <p>
            A framework is a shape you press onto a moment so the moment
            stops moving long enough to think. None of them tell you what
            to do. They tell you what to look at, in what order, before
            you commit.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">The OODA loop</h2>
          <p>
            <strong>Observe, Orient, Decide, Act.</strong> Built by John
            Boyd for fighter pilots: the operator who cycles fastest
            wins, because the slower one is always reacting to a world
            that already moved. OODA shines in adversarial, fast-feedback
            environments — a sales call, a live incident, a negotiation
            mid-sentence.
          </p>
          <p>
            <em>Where it breaks:</em> when feedback is delayed by months
            or the wrong move can&apos;t be undone. Speed becomes
            recklessness when you can&apos;t loop again.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">WRAP</h2>
          <p>
            Chip and Dan Heath&apos;s antidote to the four villains of
            decision-making: <strong>W</strong>iden your options,{" "}
            <strong>R</strong>eality-test assumptions,{" "}
            <strong>A</strong>ttain distance before deciding,{" "}
            <strong>P</strong>repare to be wrong. WRAP is built for
            decisions you&apos;ll only make once — career moves, hiring,
            a big purchase.
          </p>
          <p>
            <em>Where it breaks:</em> live combat. You don&apos;t widen
            options while a kitchen fire spreads. WRAP wants room.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">Cynefin</h2>
          <p>
            Dave Snowden&apos;s sense-making model sorts a situation
            into five domains: <strong>clear</strong> (best practice
            applies), <strong>complicated</strong> (experts know),{" "}
            <strong>complex</strong> (patterns emerge only after you
            probe), <strong>chaotic</strong> (act first, then sense),
            and <strong>confusion</strong> (you don&apos;t yet know
            which domain you&apos;re in). Cynefin doesn&apos;t tell you
            what to decide — it tells you <em>which kind of thinking</em>{" "}
            the moment deserves.
          </p>
          <p>
            <em>Where it breaks:</em> it&apos;s a diagnostic, not a
            decision. You still need OODA or WRAP once you&apos;ve named
            the domain.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">A simple chooser</h2>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              <strong>Fast, adversarial, reversible</strong> — OODA.
            </li>
            <li>
              <strong>Slow, life-shaped, reversible-ish</strong> — WRAP.
            </li>
            <li>
              <strong>You can&apos;t tell what kind of problem this is</strong>{" "}
              — Cynefin first, then one of the others.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-2xl">
            What changes when the decision is irreversible
          </h2>
          <p>
            Every framework above assumes you get another turn. OODA
            assumes another loop. WRAP assumes you can course-correct
            after the call. Cynefin assumes you can probe.
          </p>
          <p>
            Irreversible decisions break that assumption. There is no
            second observation, no reality-test, no probe. The cost of
            being wrong is the rest of the story. The honest framework
            for irreversible choices is much shorter: <em>name the thing
            you can&apos;t take back, name who pays if you&apos;re wrong,
            decide anyway.</em>
          </p>
          <p>
            That&apos;s the question{" "}
            <Link to="/" className="underline underline-offset-4">
              Decision Nodes
            </Link>{" "}
            is built around — an interactive drama where the only
            decisions that count are the ones you can&apos;t undo.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl">Further reading</h2>
          <ul className="ml-6 list-disc space-y-2">
            <li>
              Chet Richards, <em>Certain to Win</em> — Boyd&apos;s OODA
              applied to business.
            </li>
            <li>
              Chip &amp; Dan Heath, <em>Decisive</em> — the book that
              introduces WRAP.
            </li>
            <li>
              Dave Snowden &amp; Mary Boone, <em>A Leader&apos;s
              Framework for Decision Making</em> (HBR, 2007) — the
              foundational Cynefin paper.
            </li>
          </ul>
        </section>
      </article>

      <p className="mt-16 text-xs tracking-[0.25em] uppercase text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          ← Back to Decision Nodes
        </Link>
      </p>
    </main>
  );
}
