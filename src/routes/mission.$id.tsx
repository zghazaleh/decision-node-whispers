import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useServerFn } from "@tanstack/react-start";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, BookOpen, Phone, MessageCircle, Send, Scale, X, Mic, Square, Volume2, VolumeX, Check } from "lucide-react";
import { toast } from "sonner";


import { partsToText, readMission, useMission } from "@/lib/mission-store";
import { analyzeDecision } from "@/lib/analysis.functions";
import { updateProfileWithAnalysis } from "@/lib/decision-profile";
import { startRecording, type Recorder } from "@/lib/record-wav";
import { createAmbient } from "@/lib/ambient";
import { getMissionEngine } from "@/lib/missions/registry";
import type { MissionEngine } from "@/lib/missions/types";

export const Route = createFileRoute("/mission/$id")({
  head: () => ({
    meta: [
      { title: "Decision Node — Mission" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MissionRoute,
  ssr: false,
});

function MissionRoute() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const engine = getMissionEngine(id);
  useEffect(() => {
    if (!engine) navigate({ to: "/missions" });
  }, [engine, navigate]);
  if (!engine) return null;
  return <Mission key={id} missionId={id} engine={engine} />;
}

function Mission({ missionId: MISSION_ID, engine: ENGINE }: { missionId: string; engine: MissionEngine }) {
  const navigate = useNavigate();
  const OPENING: UIMessage = {
    id: "opening",
    role: "assistant",
    parts: [{ type: "text", text: ENGINE.opening.text }],
  };
  const { mission, update } = useMission(MISSION_ID);
  const [awakening, setAwakening] = useState(true);

  // Awakening: 3.6s of darkness with slow fade-in of the scene.
  useEffect(() => {
    const t = setTimeout(() => setAwakening(false), 3600);
    return () => clearTimeout(t);
  }, []);

  // Seed once (lazy): use saved messages or the canonical opening.
  const [initialMessages] = useState<UIMessage[]>(() => {
    const saved = readMission(MISSION_ID);
    if (saved.messages && saved.messages.length > 0) return saved.messages;
    return [OPENING];
  });

  // Persist the opening on first mount if nothing was saved yet.
  useEffect(() => {
    const saved = readMission(MISSION_ID);
    if (!saved.messages || saved.messages.length === 0) {
      update({ messages: initialMessages });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { missionId: MISSION_ID },
      }),
    [MISSION_ID]
  );

  const { messages, sendMessage, status, error } = useChat({
    id: MISSION_ID,
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

  // Ambient score — starts on the first user gesture (browsers require it).
  // Missions without a registered soundtrack play silently.
  const ambientRef = useRef<ReturnType<typeof createAmbient> | null>(null);
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    try { return localStorage.getItem("dn:sound") !== "off"; } catch { return true; }
  });
  useEffect(() => {
    if (!ambientRef.current) ambientRef.current = createAmbient(MISSION_ID);
    const a = ambientRef.current;
    const onGesture = async () => {
      if (!a.isRunning() && soundOn) {
        try { await a.start(MISSION_ID); } catch { /* noop */ }
      }
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
    window.addEventListener("pointerdown", onGesture, { once: true });
    window.addEventListener("keydown", onGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
      a.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MISSION_ID]);
  useEffect(() => {
    ambientRef.current?.setMuted(!soundOn);
    try { localStorage.setItem("dn:sound", soundOn ? "on" : "off"); } catch { /* noop */ }
  }, [soundOn]);

  async function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    const a = ambientRef.current;
    if (next && a && !a.isRunning()) {
      try { await a.start(MISSION_ID); } catch { /* noop */ }
    }
  }


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

  async function handleDecide(decision: string, reasoning: string, archetypeId?: string) {
    if (!decision.trim()) return;
    setAnalyzing(true);
    try {
      const transcript = messages.map((m) => ({
        role: m.role,
        text: partsToText(m),
      }));
      const analysis = await analyzeFn({
        data: {
          missionId: MISSION_ID,
          decision: decision.trim(),
          reasoning: reasoning.trim(),
          transcript,
          ...(archetypeId ? { archetypeId } : {}),
        },
      });
      update({
        decision: decision.trim(),
        reasoning: reasoning.trim(),
        analysis,
        decidedAt: Date.now(),
      });
      try {
        updateProfileWithAnalysis(MISSION_ID, analysis);
      } catch (err) {
        console.error("profile update failed", err);
      }
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

  // Mission pressure: derived from how far into the conversation we are.
  // Acts as a proxy for time elapsed + stakes accumulating. 0 = just woke up,
  // 1 = deep in the decision. Used to drive slow, low-contrast lighting drift.
  // Capped softly so it never goes harsh.
  const pressure = Math.min(1, Math.max(0, (messages.length - 1) / 18));
  // Slow audio swell that tracks the visual pressure curve.
  useEffect(() => {
    ambientRef.current?.setPressure(pressure);
  }, [pressure]);

  const dusk = (0.35 + pressure * 0.55).toFixed(3);          // bottom gradient depth
  const ringDark = (pressure * 0.45).toFixed(3);             // edge encroachment
  const warmWash = (pressure * 0.18).toFixed(3);             // creeping color cast
  const filterShift = `saturate(${(1 - pressure * 0.18).toFixed(3)}) contrast(${(1 + pressure * 0.08).toFixed(3)}) brightness(${(1 - pressure * 0.12).toFixed(3)})`;

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
            src={ENGINE.scene.src}
            alt=""
            aria-hidden
            className="h-full w-full object-cover animate-ken-burns"
            style={{
              filter: `${ENGINE.scene.filter ?? "saturate(0.88) contrast(1.06)"} ${filterShift}`,
              transition: "filter 8000ms linear",
            }}
          />

        </div>
        <div className="scene-light" aria-hidden />
        <div className="scene-dust" aria-hidden />
        {/* Base bottom-weighted shadow — deepens with pressure */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, oklch(0 0 0 / 0.55) 0%, oklch(0 0 0 / 0.2) 35%, oklch(0 0 0 / ${dusk}) 75%, oklch(0 0 0 / 0.92) 100%)`,
            transition: "background 8000ms linear",
          }}
        />
        {/* Encroaching darkness from the edges — closes in slowly as stakes rise */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background: `radial-gradient(ellipse 75% 60% at 50% 50%, transparent 40%, oklch(0 0 0 / ${ringDark}) 100%)`,
            transition: "background 9000ms linear",
          }}
        />
        {/* Mood wash — a low-saturation color cast that bleeds in over time.
            Uses the accent token so it inherits each mission's palette without
            ever competing with the dialogue. */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-soft-light"
          aria-hidden
          style={{
            background: `radial-gradient(ellipse 90% 70% at 50% 70%, oklch(0.35 0.12 25 / ${warmWash}), transparent 70%)`,
            opacity: pressure.toFixed(3),
            transition: "opacity 9000ms linear, background 9000ms linear",
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
          <div className="flex items-center gap-5">
            <button
              onClick={toggleSound}
              aria-label={soundOn ? "Mute ambient" : "Unmute ambient"}
              title={soundOn ? "Mute ambient" : "Unmute ambient"}
              className="text-foreground/40 hover:text-foreground/90 transition-colors"
            >
              {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {(() => {
              // Unlock the decision once the player has actually had a few
              // exchanges with the scene. Tied to the same pressure curve
              // that darkens the room, so it never feels arbitrary.
              // Roughly: 4+ user turns (≈ messages.length >= 9).
              const decideReady = !busy && pressure >= 0.45;
              const userTurns = messages.filter((m) => m.role === "user").length;
              const turnsToGo = Math.max(0, 4 - userTurns);
              const lockedHint =
                turnsToGo > 0
                  ? `Stay in the room a little longer — ${turnsToGo} more exchange${turnsToGo === 1 ? "" : "s"}.`
                  : "Thinking…";
              return (
                <button
                  onClick={() => setDecideOpen(true)}
                  disabled={!decideReady}
                  title={decideReady ? "Commit to a decision" : lockedHint}
                  aria-label={decideReady ? "Decide" : `Decide — locked. ${lockedHint}`}
                  className={`group inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 sm:px-4 sm:py-2 text-[0.65rem] sm:text-[0.7rem] tracking-[0.3em] uppercase transition-all disabled:cursor-not-allowed ${
                    decideReady
                      ? "border-accent/70 bg-accent/15 text-accent hover:bg-accent/25 hover:border-accent shadow-[0_0_18px_-4px_var(--color-accent)]"
                      : "border-foreground/20 bg-foreground/5 text-foreground/50"
                  }`}
                >
                  <span className="relative flex h-2 w-2 items-center justify-center">
                    {decideReady ? (
                      <>
                        <span className="absolute inline-flex h-full w-full rounded-full bg-accent/60 animate-ping" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                      </>
                    ) : (
                      <span className="inline-flex h-1.5 w-1.5 rounded-full border border-foreground/40" />
                    )}
                  </span>
                  <Scale className="h-3.5 w-3.5" />
                  <span>{decideReady ? "Decide" : "Locked"}</span>
                </button>
              );
            })()}

          </div>

        </header>

        {/* Transcript — centered, cinematic */}
        <div
          ref={transcriptRef}
          className="flex-1 overflow-y-auto px-6 sm:px-10 pt-12 pb-6"
        >
          <div className="mx-auto max-w-2xl space-y-12">
            {messages.map((m, i) => {
              const isLatest = i === messages.length - 1;
              const raw = partsToText(m);
              const { text, chips } = m.role === "assistant" ? extractChips(raw) : { text: raw, chips: [] };
              return (
                <div key={m.id}>
                  <MessageBubble role={m.role} text={text} isLatest={isLatest} />
                  {isLatest && !busy && chips.length > 0 && (
                    <ChipRow chips={chips} onPick={submit} />
                  )}
                </div>
              );
            })}
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
              <MicButton
                disabled={busy}
                onTranscript={(t) => {
                  setInput((cur) => (cur ? cur.trimEnd() + " " + t : t));
                  inputRef.current?.focus();
                }}
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
          presets={ENGINE.decisionPresets}
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

// Extract `<<chips: "a" | "b" | "c">>` (also tolerant during streaming).
function extractChips(text: string): { text: string; chips: string[] } {
  const re = /<<\s*chips\s*:\s*([\s\S]*?)>>/i;
  const m = text.match(re);
  if (!m) {
    // Hide a partial, still-streaming chips marker from view.
    const partial = text.search(/<<\s*chips\s*:?/i);
    if (partial >= 0) return { text: text.slice(0, partial).trimEnd(), chips: [] };
    return { text, chips: [] };
  }
  const inner = m[1];
  const chips = Array.from(inner.matchAll(/"([^"]+)"/g))
    .map((x) => x[1].trim())
    .filter(Boolean)
    .slice(0, 4);
  return { text: text.replace(re, "").trimEnd(), chips };
}

function ChipRow({ chips, onPick }: { chips: string[]; onPick: (text: string) => void }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2 animate-fade-up">
      {chips.map((c, i) => (
        <button
          key={`${c}-${i}`}
          type="button"
          onClick={() => onPick(c)}
          className="group rounded-full border border-foreground/20 bg-background/30 backdrop-blur-sm px-3.5 py-1.5 text-xs sm:text-[0.8rem] text-foreground/75 hover:text-foreground hover:border-accent/60 hover:bg-accent/10 transition-colors text-left"
        >
          <span className="text-accent/70 mr-2 group-hover:text-accent">›</span>
          {c}
        </button>
      ))}
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
  presets,
  analyzing,
  onClose,
  onSubmit,
}: {
  presets: MissionEngine["decisionPresets"];
  analyzing: boolean;
  onClose: () => void;
  onSubmit: (decision: string, reasoning: string, archetypeId?: string) => void;
}) {
  const [decision, setDecision] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [archetypeId, setArchetypeId] = useState<string | undefined>();
  const selectedPreset = presets.find((p) => p.text.trim() === decision.trim());
  const canCommit = decision.trim().length > 0 && !analyzing;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 backdrop-blur-md px-4 py-4 animate-fade-in-slow">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="decision-title"
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden border border-foreground/15 bg-background/95 shadow-[0_24px_80px_-32px_oklch(0_0_0)]"
      >
        {!analyzing && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-foreground/40 hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {analyzing ? (
          <div className="p-8 py-16 text-center space-y-6 sm:p-12">
            <p className="font-display text-3xl text-foreground/95">
              The room holds its breath.
            </p>
            <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 animate-pulse-soft">
              Tracing the consequences…
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto p-6 pb-0 sm:p-12 sm:pb-0">
            <p className="text-[0.6rem] tracking-[0.4em] uppercase text-accent/80 mb-3">
              Your decision
            </p>
            <h2 id="decision-title" className="font-display text-3xl text-foreground mb-2">
              This is the moment.
            </h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Pick a stance, or write your own. You can't take it back.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(decision, reasoning, archetypeId);
              }}
              className="space-y-6"
            >
              <div>
                <label className="block text-[0.6rem] tracking-[0.3em] uppercase text-foreground/50 mb-3">
                  Choose a stance
                </label>
                <div className="space-y-2 mb-4">
                  {presets.map((p) => {
                    const active = decision.trim() === p.text.trim();
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => { setDecision(p.text); setArchetypeId(p.archetypeId); }}
                        aria-pressed={active}
                        className={`group w-full rounded-sm border px-4 py-4 text-left transition-all ${
                          active
                            ? "border-accent/80 bg-accent/15 text-foreground shadow-[inset_3px_0_0_var(--color-accent)]"
                            : "border-foreground/15 bg-background/40 text-foreground/80 hover:border-foreground/40 hover:bg-foreground/5 hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              active
                                ? "border-accent bg-accent text-accent-foreground"
                                : "border-foreground/25 text-transparent group-hover:border-foreground/45"
                            }`}
                            aria-hidden
                          >
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[0.65rem] tracking-[0.3em] uppercase text-accent/80 mb-1">
                              {p.label}
                            </span>
                            <span className="block text-sm leading-relaxed text-pretty">
                              {p.text}
                            </span>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {selectedPreset && (
                  <p className="mb-4 rounded-sm border border-accent/25 bg-accent/10 px-3 py-2 text-xs leading-relaxed text-accent">
                    Selected: {selectedPreset.label}. You can commit below or edit the wording.
                  </p>
                )}
                <label className="block text-[0.6rem] tracking-[0.3em] uppercase text-foreground/50 mb-2">
                  Or in your own words
                </label>
                <textarea
                  value={decision}
                  onChange={(e) => { setDecision(e.target.value); setArchetypeId(undefined); }}
                  rows={3}
                  placeholder="I walk into the boardroom and…"
                  className="w-full resize-none rounded-sm border border-foreground/15 bg-background/45 px-3 py-3 text-foreground/95 outline-none transition-colors placeholder:text-foreground/25 focus:border-foreground/60"
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
                  className="w-full resize-none rounded-sm border border-foreground/15 bg-background/45 px-3 py-3 text-foreground/95 outline-none transition-colors placeholder:text-foreground/25 focus:border-foreground/60"
                />
              </div>

              <div className="sticky bottom-0 -mx-6 flex items-center justify-between gap-3 border-t border-foreground/10 bg-background/95 px-6 py-4 backdrop-blur sm:-mx-12 sm:px-12">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-sm px-3 py-3 text-[0.65rem] tracking-[0.28em] uppercase text-foreground/50 transition-colors hover:text-foreground/80"
                >
                  Wait
                </button>
                <button
                  type="submit"
                  disabled={!canCommit}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-accent/70 bg-accent px-5 py-3 text-[0.65rem] font-medium tracking-[0.28em] uppercase text-accent-foreground shadow-[0_0_24px_-8px_var(--color-accent)] transition-all hover:border-accent hover:bg-accent/90 disabled:border-foreground/15 disabled:bg-foreground/10 disabled:text-foreground/35 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  Commit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const MIC_PRIMER_KEY = "dn:mic-primer-seen";

function MicButton({
  disabled,
  onTranscript,
}: {
  disabled: boolean;
  onTranscript: (text: string) => void;
}) {
  const [state, setState] = useState<"idle" | "recording" | "transcribing">("idle");
  const [level, setLevel] = useState(0);
  const [primer, setPrimer] = useState(false);
  const recRef = useRef<Recorder | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);

  useEffect(() => () => {
    recRef.current?.cancel();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  function unsupported(): string | null {
    if (typeof window === "undefined") return null;
    if (!window.isSecureContext && location.hostname !== "localhost") {
      return "Voice input needs a secure (https) connection.";
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      return "This browser doesn't support voice input. Try Chrome, Safari, or Firefox.";
    }
    return null;
  }

  async function requestAndStart() {
    const reason = unsupported();
    if (reason) {
      toast.error(reason);
      return;
    }
    try {
      const rec = await startRecording();
      recRef.current = rec;
      startedAtRef.current = Date.now();
      setState("recording");
      toast("Listening…", {
        description: "Tap the square to stop.",
        duration: 2000,
      });
      const tick = () => {
        if (!recRef.current) return;
        setLevel(recRef.current.getLevel());
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e: unknown) {
      const err = e as { name?: string; message?: string };
      console.error(e);
      if (err?.name === "NotAllowedError" || err?.name === "SecurityError") {
        toast.error("Microphone blocked", {
          description:
            "Click the lock icon in your browser's address bar, allow microphone access for this site, then try again.",
          duration: 7000,
        });
      } else if (err?.name === "NotFoundError" || err?.name === "OverconstrainedError") {
        toast.error("No microphone found", {
          description: "Plug in a mic or check your system audio input, then try again.",
        });
      } else if (err?.name === "NotReadableError") {
        toast.error("Microphone is in use", {
          description: "Another app or tab is using your mic. Close it and try again.",
        });
      } else {
        toast.error("Couldn't start recording", {
          description: err?.message ?? "Please try again.",
        });
      }
    }
  }

  async function onPress() {
    if (disabled || state === "transcribing") return;
    // Show a one-time primer so the OS prompt isn't a surprise.
    let seen = false;
    try { seen = localStorage.getItem(MIC_PRIMER_KEY) === "1"; } catch { /* noop */ }
    let granted = false;
    try {
      const status = await (navigator.permissions as unknown as {
        query?: (d: { name: string }) => Promise<{ state: string }>;
      })?.query?.({ name: "microphone" });
      granted = status?.state === "granted";
    } catch { /* permissions API not available — assume not granted */ }

    if (!seen && !granted) {
      setPrimer(true);
      return;
    }
    await requestAndStart();
  }

  async function stop() {
    const rec = recRef.current;
    if (!rec) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const elapsed = Date.now() - startedAtRef.current;
    setState("transcribing");
    try {
      const blob = await rec.stop();
      recRef.current = null;
      if (elapsed < 400 || blob.size < 2048) {
        toast("That was too short", { description: "Hold on a beat longer and try again." });
        setState("idle");
        return;
      }
      const fd = new FormData();
      fd.append("file", blob, "recording.wav");
      const res = await fetch("/api/transcribe", { method: "POST", body: fd });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        if (res.status === 402) {
          toast.error("Voice input unavailable", { description: "Workspace credits exhausted." });
        } else if (res.status === 413) {
          toast.error("Recording too long", { description: "Try a shorter clip." });
        } else if (res.status === 429) {
          toast.error("Slow down a moment", { description: "Too many voice requests — try again shortly." });
        } else {
          toast.error("Transcription failed", { description: body.slice(0, 140) || `Status ${res.status}` });
        }
        return;
      }
      const data = (await res.json()) as { text?: string };
      const text = (data.text ?? "").trim();
      if (!text) {
        toast("Didn't catch that", { description: "Try again, a little closer to the mic." });
        return;
      }
      onTranscript(text);
    } catch (e: unknown) {
      console.error(e);
      toast.error("Couldn't transcribe that", {
        description: "Check your connection and try again.",
      });
    } finally {
      setState("idle");
      setLevel(0);
    }
  }

  return (
    <>
      {state === "recording" ? (
        <button
          type="button"
          onClick={stop}
          aria-label="Stop recording"
          className="relative shrink-0 p-2 text-accent transition-colors"
        >
          <span
            className="absolute inset-0 rounded-full bg-accent/20"
            style={{
              transform: `scale(${1 + Math.min(0.6, level * 1.2)})`,
              transition: "transform 80ms linear",
            }}
            aria-hidden
          />
          <Square className="relative h-4 w-4 fill-current" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onPress}
          disabled={disabled || state === "transcribing"}
          aria-label={state === "transcribing" ? "Transcribing" : "Speak instead of type"}
          title="Speak"
          className="shrink-0 p-2 text-foreground/50 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <Mic className={`h-4 w-4 ${state === "transcribing" ? "animate-pulse" : ""}`} />
        </button>
      )}

      {primer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 animate-fade-in-slow"
          onClick={() => setPrimer(false)}
        >
          <div
            className="relative w-full max-w-md border border-foreground/15 bg-background/95 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[0.6rem] tracking-[0.4em] uppercase text-accent/80 mb-3">
              Speak your move
            </p>
            <h2 className="font-display text-2xl text-foreground mb-3">
              We'd like to hear you.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Your browser will ask for microphone access. Audio is sent only to
              transcribe what you say into the conversation — nothing is stored.
            </p>
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setPrimer(false)}
                className="text-xs tracking-[0.3em] uppercase text-foreground/50 hover:text-foreground transition-colors"
              >
                Not now
              </button>
              <button
                onClick={async () => {
                  try { localStorage.setItem(MIC_PRIMER_KEY, "1"); } catch { /* noop */ }
                  setPrimer(false);
                  await requestAndStart();
                }}
                className="group flex items-center gap-3 text-xs tracking-[0.3em] uppercase text-foreground hover:text-accent transition-colors"
              >
                Allow mic
                <span className="h-px w-8 bg-foreground/40 group-hover:bg-accent group-hover:w-12 transition-all" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


