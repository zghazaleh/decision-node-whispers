import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useServerFn } from "@tanstack/react-start";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, BookOpen, Phone, MessageCircle, Send, Scale, X } from "lucide-react";

import sceneOffice from "@/assets/scene-office.jpg";
import { partsToText, readMission, useMission } from "@/lib/mission-store";
import { analyzeDecision } from "@/lib/analysis.functions";

export const Route = createFileRoute("/mission")({
  head: () => ({
    meta: [
      { title: "Decision Node — Mission" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Mission,
  ssr: false,
});

// The canonical opening — deterministic per the system prompt.
const OPENING: UIMessage = {
  id: "opening",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: `*Sarah Kwon*\n"Dr. Vasquez?"\n\n"They're seated. Jonas asked if you wanted coffee before. I said you didn't. Was that right?"`,
    },
  ],
};

function Mission() {
  const navigate = useNavigate();
  const { mission, update } = useMission();
  const [awakening, setAwakening] = useState(true);

  // Awakening: 3.6s of darkness with slow fade-in of the scene.
  useEffect(() => {
    const t = setTimeout(() => setAwakening(false), 3600);
    return () => clearTimeout(t);
  }, []);

  // Seed once (lazy): use saved messages or the canonical opening.
  const [initialMessages] = useState<UIMessage[]>(() => {
    const saved = readMission();
    if (saved.messages && saved.messages.length > 0) return saved.messages;
    return [OPENING];
  });

  // Persist the opening on first mount if nothing was saved yet.
  useEffect(() => {
    const saved = readMission();
    if (!saved.messages || saved.messages.length === 0) {
      update({ messages: initialMessages });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  );

  const { messages, sendMessage, status, error } = useChat({
    id: "mission-01",
    messages: initialMessages,
    transport,
  });

  // Persist every message change to localStorage.
  useEffect(() => {
    if (messages.length === 0) return;
    update({ messages });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const [input, setInput] = useState("");
  const [decideOpen, setDecideOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const analyzeFn = useServerFn(analyzeDecision);

  const transcriptRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    transcriptRef.current?.scrollTo({
      top: transcriptRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!awakening) inputRef.current?.focus();
  }, [awakening, status]);

  const busy = status === "submitted" || status === "streaming";

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    await sendMessage({ text: trimmed });
  }

  async function handleDecide(decision: string, reasoning: string) {
    if (!decision.trim()) return;
    setAnalyzing(true);
    try {
      const transcript = messages.map((m) => ({
        role: m.role,
        text: partsToText(m),
      }));
      const analysis = await analyzeFn({
        data: { decision: decision.trim(), reasoning: reasoning.trim(), transcript },
      });
      update({
        decision: decision.trim(),
        reasoning: reasoning.trim(),
        analysis,
        decidedAt: Date.now(),
      });
      setDecideOpen(false);
      // Small dramatic pause before transition.
      setTimeout(() => navigate({ to: "/analysis" }), 600);
    } catch (e) {
      console.error(e);
      setAnalyzing(false);
      alert("The signal broke for a moment. Please try again.");
    }
  }

  // Pointer-driven parallax: subtle camera drift toward the cursor.
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    let raf = 0;
    let tx = 0, ty = 0;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;  // -1..1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        tx += (nx * 14 - tx) * 0.08;
        ty += (ny * 10 - ty) * 0.08;
        el.style.setProperty("--px", `${tx.toFixed(2)}px`);
        el.style.setProperty("--py", `${ty.toFixed(2)}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <main className="relative h-[100dvh] w-screen overflow-hidden bg-black text-foreground">
      {/* Cinematic background */}
      <div
        ref={sceneRef}
        className={`absolute inset-0 transition-opacity duration-[3000ms] ease-out ${
          awakening ? "opacity-0" : "opacity-100"
        }`}
        style={{ ["--px" as never]: "0px", ["--py" as never]: "0px" }}
      >
        <div
          className="absolute inset-0 animate-scene-sway"
          style={{ transform: "translate3d(var(--px), var(--py), 0)" }}
        >
          <img
            src={sceneOffice}
            alt=""
            aria-hidden
            className="h-full w-full object-cover animate-ken-burns"
            style={{ filter: "saturate(0.88) contrast(1.06)" }}
          />
        </div>
        <div className="scene-light" aria-hidden />
        <div className="scene-dust" aria-hidden />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, oklch(0 0 0 / 0.55) 0%, oklch(0 0 0 / 0.2) 35%, oklch(0 0 0 / 0.6) 75%, oklch(0 0 0 / 0.92) 100%)",
          }}
        />
        <div className="film-grain" aria-hidden />
        <div className="vignette" aria-hidden />
      </div>


      {/* Awakening overlay — pure black with subtle horizontal slits "eyelids opening" */}
      {awakening && (
        <div className="absolute inset-0 z-50 bg-black">
          <div
            className="absolute inset-x-0 top-0 bg-black transition-all duration-[2400ms] ease-out"
            style={{ height: "50%", animation: "eyelid-up 3.6s ease-out forwards" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 bg-black transition-all duration-[2400ms] ease-out"
            style={{ height: "50%", animation: "eyelid-down 3.6s ease-out forwards" }}
          />
          <style>{`
            @keyframes eyelid-up {
              0%, 30% { transform: translateY(0); }
              100% { transform: translateY(-100%); }
            }
            @keyframes eyelid-down {
              0%, 30% { transform: translateY(0); }
              100% { transform: translateY(100%); }
            }
          `}</style>
        </div>
      )}

      {/* Foreground: dialogue + input */}
      <div
        className={`relative z-10 flex h-full flex-col transition-opacity duration-[2000ms] ${
          awakening ? "opacity-0" : "opacity-100"
        }`}
        style={{ transitionDelay: awakening ? "0s" : "1.4s" }}
      >
        {/* Top bar — minimal */}
        <header className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <button
            onClick={() => navigate({ to: "/" })}
            className="text-[0.6rem] tracking-[0.4em] uppercase text-foreground/50 hover:text-foreground/90 transition-colors"
          >
            Decision Node
          </button>
          <button
            onClick={() => setDecideOpen(true)}
            disabled={busy || messages.length < 2}
            className="group flex items-center gap-3 text-[0.65rem] tracking-[0.35em] uppercase text-foreground/60 hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Scale className="h-3.5 w-3.5" />
            Decide
          </button>
        </header>

        {/* Transcript — centered, cinematic */}
        <div
          ref={transcriptRef}
          className="flex-1 overflow-y-auto px-6 sm:px-10 pt-12 pb-6"
        >
          <div className="mx-auto max-w-2xl space-y-12">
            {messages.map((m, i) => (
              <MessageBubble
                key={m.id}
                role={m.role}
                text={partsToText(m)}
                isLatest={i === messages.length - 1}
              />
            ))}
            {status === "submitted" && <ThinkingIndicator />}
            {error && (
              <p className="text-center text-xs text-destructive-foreground/80 italic">
                The line went quiet. Try again.
              </p>
            )}
          </div>
        </div>

        {/* Composer */}
        <div className="px-6 sm:px-10 pb-8 sm:pb-10">
          <div className="mx-auto max-w-2xl">
            <QuickActions
              disabled={busy}
              onAction={(prefix) => {
                setInput((cur) => (cur ? cur : prefix));
                inputRef.current?.focus();
              }}
            />

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="mt-4 flex items-end gap-3 border-b border-foreground/20 focus-within:border-foreground/60 transition-colors py-2"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(input);
                  }
                }}
                rows={1}
                placeholder="Say something. Or do something."
                disabled={busy}
                className="flex-1 resize-none bg-transparent text-foreground/95 placeholder:text-foreground/30 outline-none text-base font-sans leading-relaxed max-h-40"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                aria-label="Send"
                className="shrink-0 p-2 text-foreground/50 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Decide modal */}
      {decideOpen && (
        <DecideModal
          analyzing={analyzing}
          onClose={() => !analyzing && setDecideOpen(false)}
          onSubmit={handleDecide}
        />
      )}
    </main>
  );
}

// ─── Components ──────────────────────────────────────────────────────────

function MessageBubble({
  role,
  text,
  isLatest,
}: {
  role: string;
  text: string;
  isLatest: boolean;
}) {
  if (role === "user") {
    return (
      <div className="animate-fade-up text-right">
        <p className="inline-block max-w-md text-foreground/70 italic text-base leading-relaxed text-pretty">
          {text}
        </p>
      </div>
    );
  }
  return (
    <div className="animate-fade-up">
      <CinematicText text={text} blink={isLatest} />
    </div>
  );
}

/**
 * Renders assistant text per the narrative format:
 *   - Lines wrapped in *...* are italicized.
 *   - A standalone *Name* line becomes a small character label.
 *   - Quoted lines become primary dialogue.
 *   - Standalone italic paragraphs become sensory beats.
 */
function CinematicText({ text }: { text: string; blink?: boolean }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-4 text-balance">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        // Character label pattern: first line is exactly *Name Name*
        const labelMatch = lines[0].match(/^\*([^*]{2,40})\*$/);
        if (labelMatch && lines.length > 1) {
          const name = labelMatch[1];
          const rest = lines.slice(1).join("\n");
          return (
            <div key={i}>
              <p className="text-[0.65rem] tracking-[0.35em] uppercase text-accent/80 mb-2">
                {name}
              </p>
              <p className="font-display text-2xl sm:text-3xl leading-snug text-foreground/95 text-pretty">
                {renderInline(rest)}
              </p>
            </div>
          );
        }
        // Pure italic sensory beat
        const fullItalic = block.match(/^\*([\s\S]+)\*$/);
        if (fullItalic) {
          return (
            <p
              key={i}
              className="font-sans text-sm italic text-foreground/55 leading-relaxed text-pretty"
            >
              {fullItalic[1]}
            </p>
          );
        }
        return (
          <p
            key={i}
            className="font-display text-2xl sm:text-3xl leading-snug text-foreground/90 text-pretty"
          >
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}

function renderInline(s: string) {
  // Split on *...* preserving order. Render starred segments as italic.
  const parts = s.split(/(\*[^*\n]+\*)/g);
  return parts.map((p, i) => {
    if (/^\*[^*\n]+\*$/.test(p)) {
      return (
        <em key={i} className="not-italic text-foreground/55 text-base font-sans">
          {p.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{p}</span>;
  });
}

function ThinkingIndicator() {
  return (
    <div className="flex items-center justify-start gap-2 text-foreground/40">
      <span className="h-1 w-1 rounded-full bg-foreground/50 animate-pulse-soft" />
      <span
        className="h-1 w-1 rounded-full bg-foreground/50 animate-pulse-soft"
        style={{ animationDelay: "0.2s" }}
      />
      <span
        className="h-1 w-1 rounded-full bg-foreground/50 animate-pulse-soft"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
}

function QuickActions({
  disabled,
  onAction,
}: {
  disabled: boolean;
  onAction: (prefix: string) => void;
}) {
  const actions = [
    { icon: MessageCircle, label: "Ask", prefix: "" },
    { icon: Eye, label: "Observe", prefix: "I look around. " },
    { icon: BookOpen, label: "Read", prefix: "I pick up the " },
    { icon: Phone, label: "Call", prefix: "I reach for the phone and call " },
  ];
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.6rem] tracking-[0.35em] uppercase text-foreground/40">
      {actions.map(({ icon: Icon, label, prefix }) => (
        <button
          key={label}
          type="button"
          disabled={disabled}
          onClick={() => onAction(prefix)}
          className="flex items-center gap-2 hover:text-foreground/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </div>
  );
}

function DecideModal({
  analyzing,
  onClose,
  onSubmit,
}: {
  analyzing: boolean;
  onClose: () => void;
  onSubmit: (decision: string, reasoning: string) => void;
}) {
  const [decision, setDecision] = useState("");
  const [reasoning, setReasoning] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-fade-in-slow">
      <div className="relative w-full max-w-xl border border-foreground/15 bg-background/95 p-8 sm:p-12">
        {!analyzing && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-foreground/40 hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {analyzing ? (
          <div className="py-12 text-center space-y-6">
            <p className="font-display text-3xl text-foreground/95">
              The room holds its breath.
            </p>
            <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 animate-pulse-soft">
              Tracing the consequences…
            </p>
          </div>
        ) : (
          <>
            <p className="text-[0.6rem] tracking-[0.4em] uppercase text-accent/80 mb-3">
              Your decision
            </p>
            <h2 className="font-display text-3xl text-foreground mb-2">
              This is the moment.
            </h2>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              You can't take it back. State what you do — out loud, to the room, to the
              board, to whoever needs to hear it.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(decision, reasoning);
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-[0.6rem] tracking-[0.3em] uppercase text-foreground/50 mb-2">
                  What you do
                </label>
                <textarea
                  autoFocus
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  rows={3}
                  placeholder="I walk into the boardroom and…"
                  className="w-full resize-none bg-transparent border-b border-foreground/20 focus:border-foreground/60 outline-none py-2 text-foreground/95 placeholder:text-foreground/25 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[0.6rem] tracking-[0.3em] uppercase text-foreground/50 mb-2">
                  Why (optional)
                </label>
                <textarea
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  rows={3}
                  placeholder="Because…"
                  className="w-full resize-none bg-transparent border-b border-foreground/20 focus:border-foreground/60 outline-none py-2 text-foreground/95 placeholder:text-foreground/25 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-6 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[0.65rem] tracking-[0.35em] uppercase text-foreground/40 hover:text-foreground/80 transition-colors"
                >
                  Wait
                </button>
                <button
                  type="submit"
                  disabled={!decision.trim()}
                  className="group flex items-center gap-3 text-[0.65rem] tracking-[0.35em] uppercase text-foreground/80 hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Commit
                  <span className="h-px w-8 bg-foreground/30 group-hover:bg-accent group-hover:w-12 transition-all" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
