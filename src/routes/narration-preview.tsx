import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

/**
 * Narration Typography Preview
 *
 * A standalone visual playground that renders each of the five text kinds
 * defined in `constitution/10-narration-typography.md` with sample content.
 *
 * Use this page to visually verify the rhythm, weight, and front of mission
 * narration without having to drive a real chat. The renderer here mirrors
 * the contract enforced by `CinematicText` in `src/routes/mission.$id.tsx`
 * — keep the two in sync; this page is the witness.
 */

export const Route = createFileRoute("/narration-preview")({
  head: () => ({
    meta: [
      { title: "Narration Typography — Preview" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NarrationPreview,
  ssr: false,
});

// ── Class contracts (mirrors src/routes/mission.$id.tsx) ─────────────
const CLASS_LABEL =
  "font-sans text-[0.65rem] tracking-[0.35em] uppercase text-accent/80 mb-2";
const CLASS_DIALOGUE =
  "font-display text-2xl sm:text-3xl leading-snug text-foreground/95 text-pretty";
const CLASS_SENSORY =
  "font-sans text-sm italic text-foreground/55 leading-relaxed text-pretty max-w-prose";
const CLASS_INLINE_ITALIC = "not-italic font-sans text-base text-foreground/55";

// ── Samples per text kind ────────────────────────────────────────────
const SAMPLES: Array<{
  id: string;
  kind: string;
  rule: string;
  text: string;
}> = [
  {
    id: "label-dialogue",
    kind: "1+2 · Character label + Dialogue",
    rule:
      "Name on its own line in *…*, dialogue under it. Two to four lines per turn.",
    text:
      `*Aday Okonkwo*\n"It's clean, Dana. Every text, the wire, a witness."\n"The front's holding for you. Do I send it?"`,
  },
  {
    id: "sensory",
    kind: "3 · Sensory beat",
    rule:
      "Full italic paragraph wrapped end-to-end in *…*. Camera, room, weather — never interiority.",
    text: `*Rain against tall windows. The CMS cursor blinks.*`,
  },
  {
    id: "inline-italic",
    kind: "4 · Inline italic scrap",
    rule:
      "A short *…* run inside a dialogue line. Renders in sans body — it RECEDES against the display serif.",
    text:
      `*Tessa Marquez*\n"They wrote *we are still holding the front* — that's it."\n"No source, no timestamp, just the line."`,
  },
  {
    id: "chips",
    kind: "5 · Chips line",
    rule:
      "Final line only: <<chips: \"a\" | \"b\" | \"c\">> — three options, 3–10 words each.",
    text:
      `*Cole Avery*\n"You've got maybe ninety seconds before legal walks in."\n\n<<chips: "Aday, who gave us this" | "Pull up the proof file" | "Call Tessa">>`,
  },
  {
    id: "canonical-turn",
    kind: "Canonical turn (all kinds, in order)",
    rule:
      "Sensory beat → label → dialogue → dialogue → chips. The rhythm a mission opens on.",
    text:
      `*Rain against tall windows. The newsroom is half-dark.*\n\n*Aday Okonkwo*\n"It's clean. Every text, the wire, a witness."\n"The front's holding for you. Do I send it?"\n\n<<chips: "Aday, who gave us this" | "Pull up the proof file" | "Call Tessa">>`,
  },
  {
    id: "two-speakers",
    kind: "Two speakers in one turn",
    rule: "Stack two label+dialogue blocks separated by a blank line.",
    text:
      `*Cole Avery*\n"Ninety seconds, Dana."\n\n*Tessa Marquez*\n"Don't let him rush you. Read it again."`,
  },
];

function NarrationPreview() {
  const [editor, setEditor] = useState<string>(SAMPLES[4].text);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-foreground/10 px-6 py-6 sm:px-10">
        <div className="mx-auto max-w-3xl flex items-baseline justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-foreground">
              Narration typography preview
            </h1>
            <p className="mt-1 text-sm text-foreground/55">
              The five text kinds from{" "}
              <code className="font-mono text-xs">
                constitution/10-narration-typography.md
              </code>
              , rendered against the same classes the mission chat uses.
            </p>
          </div>
          <Link
            to="/missions"
            className="text-xs text-accent/80 hover:text-accent underline-offset-4 hover:underline whitespace-nowrap"
          >
            ← Missions
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 sm:px-10 sm:py-14 space-y-14">
        {SAMPLES.map((s) => (
          <section key={s.id} className="space-y-4">
            <div className="space-y-1">
              <p className="font-sans text-[0.65rem] tracking-[0.35em] uppercase text-accent/70">
                {s.kind}
              </p>
              <p className="text-xs text-foreground/50 max-w-prose">{s.rule}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <pre className="rounded-md border border-foreground/10 bg-foreground/5 p-4 text-[0.75rem] leading-relaxed font-mono text-foreground/70 whitespace-pre-wrap break-words">
                {s.text}
              </pre>
              <div className="rounded-md border border-accent/15 bg-background/40 p-5">
                <CinematicText text={s.text} />
              </div>
            </div>
          </section>
        ))}

        <section className="space-y-4 pt-6 border-t border-foreground/10">
          <div className="space-y-1">
            <p className="font-sans text-[0.65rem] tracking-[0.35em] uppercase text-accent/70">
              Live editor
            </p>
            <p className="text-xs text-foreground/50 max-w-prose">
              Paste an opening, a Director turn, or a fragment. Use{" "}
              <code className="font-mono">*Name*</code> on its own line for a
              label, full <code className="font-mono">*…*</code> for a sensory
              beat, inline <code className="font-mono">*…*</code> for scraps,
              and end with{" "}
              <code className="font-mono">{`<<chips: "..." | "..." | "...">>`}</code>
              .
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <textarea
              value={editor}
              onChange={(e) => setEditor(e.target.value)}
              spellCheck={false}
              className="min-h-[240px] rounded-md border border-foreground/15 bg-foreground/5 p-4 font-mono text-[0.8rem] leading-relaxed text-foreground/85 focus:outline-none focus:ring-1 focus:ring-accent/60"
            />
            <div className="rounded-md border border-accent/20 bg-background/40 p-5 min-h-[240px]">
              <CinematicText text={editor} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// ── Renderer (mirror of CinematicText in src/routes/mission.$id.tsx) ──
function CinematicText({ text }: { text: string }) {
  const { text: body, chips } = extractChips(text);
  const blocks = body
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div>
      <div className="space-y-5 text-balance">
        {blocks.map((block, i) => {
          const lines = block
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

          const labelMatch = lines[0]?.match(/^\*([^*]{2,40})\*$/);
          if (labelMatch && lines.length > 1) {
            const name = labelMatch[1];
            const rest = lines.slice(1).join("\n");
            return (
              <div key={i}>
                <p className={CLASS_LABEL}>{name}</p>
                <p className={CLASS_DIALOGUE}>{renderInline(rest)}</p>
              </div>
            );
          }

          if (labelMatch && lines.length === 1) return null;

          const fullItalic = block.match(/^\*([\s\S]+)\*$/);
          if (fullItalic) {
            return (
              <p key={i} className={CLASS_SENSORY}>
                {fullItalic[1]}
              </p>
            );
          }

          return (
            <p key={i} className={CLASS_DIALOGUE}>
              {renderInline(block)}
            </p>
          );
        })}
      </div>
      {chips.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {chips.map((c, i) => (
            <button
              key={`${c}-${i}`}
              type="button"
              className="group rounded-full border border-foreground/20 bg-background/30 backdrop-blur-sm px-3.5 py-1.5 text-xs sm:text-[0.8rem] text-foreground/75 hover:text-foreground hover:border-accent/60 hover:bg-accent/10 transition-colors text-left"
            >
              <span className="text-accent/70 mr-2 group-hover:text-accent">
                ›
              </span>
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function renderInline(s: string) {
  const parts = s.split(/(\*[^*\n]+\*)/g);
  return parts.map((p, i) => {
    if (/^\*[^*\n]+\*$/.test(p)) {
      return (
        <em key={i} className={CLASS_INLINE_ITALIC}>
          {p.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

function extractChips(text: string): { text: string; chips: string[] } {
  const re = /<<\s*chips\s*:\s*([\s\S]*?)>>/i;
  const m = text.match(re);
  if (!m) return { text, chips: [] };
  const inner = m[1] ?? "";
  const chips = Array.from(inner.matchAll(/"([^"]+)"/g))
    .map((mm) => mm[1].trim())
    .filter(Boolean);
  return { text: text.replace(re, "").trimEnd(), chips };
}
