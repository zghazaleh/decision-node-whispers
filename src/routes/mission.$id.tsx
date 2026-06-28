import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useServerFn } from "@tanstack/react-start";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Send, X, Check, Mic, Square } from "lucide-react";
import { startRecording, type Recorder } from "@/lib/record-wav";
import { toast } from "sonner";


import { clearMission, partsToText, readMission, useMission } from "@/lib/mission-store";
import { analyzeDecision } from "@/lib/analysis.functions";
import { updateProfileWithAnalysis } from "@/lib/decision-profile";
import { recordMissionPlay } from "@/lib/mission-stats.functions";

import { createAmbient } from "@/lib/ambient";
import { getMissionEngine } from "@/lib/missions/registry";
import { MISSIONS } from "@/lib/missions";
import type { MissionEngine } from "@/lib/missions/types";

export const Route = createFileRoute("/mission/$id")({
  head: () => ({
    meta: [
      { title: "Decision Nodes — Mission" },
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
  const recordPlayFn = useServerFn(recordMissionPlay);
  // Track when the decide modal first opens, so we can measure decision time
  // (deliberation inside the modal) separately from total investigation time.
  const decideOpenedAtRef = useRef<number | null>(null);

  // Ambient score — starts on the first user gesture (browsers require it).
  // Missions without a registered soundtrack play silently.
  const ambientRef = useRef<ReturnType<typeof createAmbient> | null>(null);
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    try { return localStorage.getItem("dn:sound") !== "off"; } catch { return true; }
  });
  useEffect(() => {
    if (!ambientRef.current) ambientRef.current = createAmbient(MISSION_ID);
    if (ENGINE.atmosphere) ambientRef.current.setAudioProfile(ENGINE.atmosphere);

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
  const userTurnsCount = messages.filter((m) => m.role === "user").length;
  const pressureForDecide = Math.min(1, Math.max(0, (messages.length - 1) / 18));
  const decideReady = !busy && pressureForDecide >= 0.45;
  const [decidePrefill, setDecidePrefill] = useState<string>("");

  // Natural-language decision triggers — opens the Decide modal pre-filled
  // instead of sending the line into the chat. Keeps the commit ritual intact
  // (reasoning, confidence) while letting the player initiate from the composer.
  function detectDecisionIntent(text: string): string | null {
    const t = text.trim();
    const patterns = [
      // Explicit decision verbs only — bare "pick/want/should/will" are too
      // common in normal investigative talk ("I pick up the memo…") to count.
      /^(?:i\s+(?:decide|commit|have\s+decided|choose|am\s+choosing|'?ll\s+(?:go\s+with|commit\s+to))\s+(?:to\s+)?)(.+)$/i,
      // Possessive declaration
      /^(?:my\s+(?:decision|choice|final\s+answer)\s+(?:is|:)\s*)(.+)$/i,
      // Collaborative explicit
      /^(?:let's\s+go\s+with\s+)(.+)$/i,
      // Imperative "go with X" (not "pick X up")
      /^(?:go\s+with\s+)(.+)$/i,
    ];
    for (const re of patterns) {
      const m = t.match(re);
      if (m && m[1].trim().length > 0) return m[1].trim();
    }
    return null;
  }

  function openDecideWith(prefill: string) {
    setDecidePrefill(prefill);
    setDecideOpen(true);
    decideOpenedAtRef.current = Date.now();
  }

  async function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const intent = detectDecisionIntent(trimmed);
    if (intent && decideReady) {
      setInput("");
      openDecideWith(intent);
      return;
    }
    if (intent && !decideReady) {
      // Advisory only — never swallow the player's message.
      const turnsToGo = Math.max(0, 4 - userTurnsCount);
      toast("Stay in the room a little longer.", {
        id: "decide-gate",
        description: turnsToGo > 0
          ? `${turnsToGo} more exchange${turnsToGo === 1 ? "" : "s"} before the decision opens. Sending as dialogue.`
          : "The decision opens shortly. Sending as dialogue.",
      });
    }
    setInput("");
    await sendMessage({ text: trimmed });
  }

  async function handleDecide(
    decision: string,
    reasoning: string,
    archetypeId?: string,
  ) {
    if (!decision.trim()) return;
    setAnalyzing(true);
    try {
      const transcript = messages.map((m) => ({
        role: m.role,
        text: partsToText(m),
      }));
      const analysisPayload = {
        missionId: MISSION_ID,
        decision: decision.trim(),
        reasoning: reasoning.trim(),
        transcript,
        ...(archetypeId ? { archetypeId } : {}),
      };
      let analysis;
      try {
        analysis = await analyzeFn({ data: analysisPayload });
      } catch (firstErr) {
        console.warn("analyze attempt 1 failed, retrying", firstErr);
        await new Promise((r) => setTimeout(r, 800));
        analysis = await analyzeFn({ data: analysisPayload });
      }
      update({
        decision: decision.trim(),
        reasoning: reasoning.trim(),
        analysis,
        decidedAt: Date.now(),
        ...(archetypeId ? { archetypeId } : {}),
      });
      try {
        updateProfileWithAnalysis(MISSION_ID, analysis);
      } catch (err) {
        console.error("profile update failed", err);
      }

      // Fire-and-forget community telemetry — no PII, only timings + counts.
      try {
        const now = Date.now();
        const investigationSeconds = mission.startedAt
          ? Math.max(0, Math.round((now - mission.startedAt) / 1000))
          : undefined;
        const decisionSeconds = decideOpenedAtRef.current
          ? Math.max(0, Math.round((now - decideOpenedAtRef.current) / 1000))
          : undefined;
        void recordPlayFn({
          data: {
            missionId: MISSION_ID,
            investigationSeconds,
            decisionSeconds,
            messageCount: messages.length,
            completed: true,
          },
        });
      } catch (err) {
        console.error("play telemetry failed", err);
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
  // Slow audio swell + low heartbeat synth that tracks the visual pressure curve.
  useEffect(() => {
    ambientRef.current?.setPressure(pressure);
    ambientRef.current?.setHeartbeat(pressure >= 0.6);
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
          className="absolute inset-0 animate-scene-sway animate-chroma-breathe"
          style={{
            transform: "translate3d(var(--px), var(--py), 0)",
            animationDuration: ENGINE.atmosphere?.chromaBreatheDuration
              ? `${ENGINE.atmosphere.chromaBreatheDuration}s`
              : undefined,
          }}

        >
          <img
            src={ENGINE.scene.src}
            alt=""
            aria-hidden
            className="h-full w-full object-cover animate-ken-burns"
            style={{
              filter: `${ENGINE.scene.filter ?? "saturate(0.88) contrast(1.06)"} ${filterShift}`,
              transition: "filter 8000ms linear",
              animationDuration: ENGINE.atmosphere?.kenBurnsDuration
                ? `${ENGINE.atmosphere.kenBurnsDuration}s`
                : undefined,
            }}
          />

        </div>
        <div
          className="scene-haze"
          aria-hidden
          style={{ background: ENGINE.atmosphere?.hazeBackground }}
        />
        <div className="scene-light" aria-hidden />
        <div
          className="scene-dust"
          aria-hidden
          style={{
            opacity:
              ENGINE.atmosphere?.dustOpacityScale !== undefined
                ? 0.5 * ENGINE.atmosphere.dustOpacityScale
                : undefined,
          }}
        />
        <div
          className="scene-pulse"
          aria-hidden
          style={{
            background: ENGINE.atmosphere?.pulseBackground,
            animationDuration: ENGINE.atmosphere?.pulseDuration
              ? `${ENGINE.atmosphere.pulseDuration}s`
              : undefined,
          }}
        />



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


      {/* Cinematic letterbox bars — animate in after awakening, deepen at peak pressure */}
      {!awakening && (
        <>
          <div
            className="letterbox-top"
            aria-hidden
            style={{ height: `calc(5vh + ${(pressure * 12).toFixed(1)}px)` }}
          />
          <div
            className="letterbox-bottom"
            aria-hidden
            style={{ height: `calc(5vh + ${(pressure * 12).toFixed(1)}px)` }}
          />
        </>
      )}

      {/* Heartbeat vignette — only at peak pressure */}
      {!awakening && pressure >= 0.6 && (
        <div className="heartbeat-vignette" aria-hidden style={{ opacity: Math.min(0.7, (pressure - 0.6) * 2.5) }} />
      )}




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
        {/* Reading scrim — an always-on soft dark band behind the text column,
            independent of the pressure gradient. Guarantees text contrast over
            bright regions of the scene photo (foggy windows, desk lamps, monitors)
            without darkening the cinematic frame. Centered on the dialogue
            column; falls off to transparent at the screen edges so the scene
            still breathes. Behind transcript/chips, above background layers. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 75% at 50% 52%, oklch(0 0 0 / 0.42) 0%, oklch(0 0 0 / 0.28) 45%, oklch(0 0 0 / 0.10) 72%, transparent 88%)",
          }}
        />

        {/* Top bar — minimal */}
        <header
          className="flex items-center justify-between px-6 sm:px-10"
          style={{ paddingTop: `calc(5vh + 1.25rem + env(safe-area-inset-top))` }}
        >
          <button
            onClick={() => navigate({ to: "/" })}
            className="text-[0.6rem] tracking-[0.4em] uppercase text-foreground/50 hover:text-foreground/90 transition-colors text-left"
            title="Back to Decision Nodes"
          >
            {MISSIONS.find((m) => m.id === MISSION_ID)?.codename ?? "Decision Nodes"}
          </button>

          <button
            onClick={() => {
              const ok = window.confirm(
                "Reset this mission? Your conversation, decision, and analysis will be cleared. You'll start from the opening again.",
              );
              if (!ok) return;
              clearMission(MISSION_ID);
              window.location.reload();
            }}
            className="text-[0.6rem] tracking-[0.4em] uppercase text-foreground/40 hover:text-foreground/80 transition-colors"
            title="Clear this mission and start over"
          >
            Reset
          </button>
        </header>

        {/* Transcript — centered, cinematic */}
        <div
          ref={transcriptRef}
          className="flex-1 overflow-y-auto px-6 sm:px-10 pt-12 pb-6"
        >
          <div
            className="mx-auto max-w-2xl space-y-12"
            aria-live="polite"
            aria-atomic="false"
            aria-relevant="additions text"
          >
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
        <div className="px-6 sm:px-10 pb-24 sm:pb-8" style={{ paddingBottom: "max(6rem, calc(env(safe-area-inset-bottom) + 5rem))" }}>
          <div className="mx-auto max-w-2xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-end gap-2 border-b border-foreground/20 focus-within:border-foreground/60 transition-colors py-2"
            >
              <MicButton
                disabled={busy}
                onTranscribed={(t) => setInput((prev) => (prev ? prev + " " + t : t))}
              />
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
                placeholder="Speak or act."
                disabled={busy}
                className="flex-1 resize-none bg-transparent text-foreground/95 placeholder:text-foreground/30 outline-none text-base font-sans leading-relaxed max-h-40 py-2"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                aria-label="Send"
                className="shrink-0 inline-flex items-center justify-center min-h-11 min-w-11 p-2 rounded-full text-foreground/50 hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Decide pill — fades in as the moment ripens */}
            <div className="mt-5 flex justify-center" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
              <button
                type="button"
                onClick={() => decideReady && openDecideWith("")}
                disabled={!decideReady}
                aria-disabled={!decideReady}
                title={decideReady
                  ? "Commit to a decision"
                  : "Stay in the moment — the decision opens as the pressure builds."}
                style={{ opacity: 0.15 + pressureForDecide * 0.85 }}
                className={`group inline-flex items-center gap-2 rounded-full border px-5 min-h-11 py-2.5 text-[0.65rem] font-medium tracking-[0.32em] uppercase transition-all duration-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  decideReady
                    ? "border-accent/70 bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent shadow-[0_0_24px_-8px_var(--color-accent)] cursor-pointer"
                    : "border-foreground/20 bg-transparent text-foreground/60 cursor-not-allowed"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full transition-colors ${decideReady ? "bg-accent animate-pulse-soft" : "bg-foreground/30"}`} />
                Decide
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Decide modal */}
      {decideOpen && (
        <DecideModal
          presets={ENGINE.decisionPresets}
          freeWritePlaceholder={ENGINE.decideFreeWritePlaceholder ?? "In your own words…"}
          analyzing={analyzing}
          initialDecision={decidePrefill}
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
 * Renders assistant text per the narration typography contract.
 * Canonical spec: constitution/10-narration-typography.md
 *
 * Five text kinds, no more:
 *   1. Character label   — *Name* on its own line above dialogue
 *   2. Dialogue          — non-italic line(s) following a label
 *   3. Sensory beat      — a full italic paragraph wrapped in *...*
 *   4. Inline italic     — *scrap* mid-sentence; renders in receded sans
 *   5. Chips line        — stripped earlier; never reaches this renderer
 *
 * Blocks are separated by \n\n. Single newlines inside a block are
 * preserved as soft wraps within the same speaker beat.
 */
const CLASS_LABEL =
  "font-sans text-[0.65rem] tracking-[0.35em] uppercase text-accent/80 mb-2";
const CLASS_DIALOGUE =
  "font-display text-2xl sm:text-3xl leading-snug text-foreground/95 text-pretty";
const CLASS_SENSORY =
  "font-sans text-sm italic text-foreground/55 leading-relaxed text-pretty max-w-prose";
const CLASS_INLINE_ITALIC =
  "not-italic font-sans text-base text-foreground/55";

function CinematicText({ text }: { text: string; blink?: boolean }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-5 text-balance">
      {blocks.map((block, i) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

        // Kind 1+2: character label + dialogue under it.
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

        // Bare *Name* with no dialogue under it — contract violation, drop it
        // silently rather than render a stray label.
        if (labelMatch && lines.length === 1) return null;

        // Kind 3: full-italic sensory beat (one or two sentences, max).
        const fullItalic = block.match(/^\*([\s\S]+)\*$/);
        if (fullItalic) {
          return (
            <p key={i} className={CLASS_SENSORY}>
              {fullItalic[1]}
            </p>
          );
        }

        // Fallback: unlabeled dialogue (rare — opening lines, or a Director
        // turn that returned without a label). Render with the same dialogue
        // class so weight stays consistent.
        return (
          <p key={i} className={CLASS_DIALOGUE}>
            {renderInline(block)}
          </p>
        );
      })}
    </div>
  );
}

/**
 * Inline italic scraps inside dialogue (kind 4).
 * The starred run is flipped to the *sans* face at body size so it visually
 * RECEDES against the surrounding display serif — a quoted scrap, a
 * remembered fragment, a line from a screen. Never emphasis.
 */
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
          className="group rounded-full border border-foreground/20 bg-background/30 backdrop-blur-sm px-3.5 py-2 min-h-11 text-xs sm:text-[0.8rem] text-foreground/75 hover:text-foreground hover:border-accent/60 hover:bg-accent/10 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="text-accent/70 mr-2 group-hover:text-accent">›</span>
          {c}
        </button>
      ))}

    </div>
  );
}



function DecideModal({
  presets,
  freeWritePlaceholder,
  analyzing,
  initialDecision,
  onClose,
  onSubmit,
}: {
  presets: MissionEngine["decisionPresets"];
  freeWritePlaceholder: string;
  analyzing: boolean;
  initialDecision?: string;
  onClose: () => void;
  onSubmit: (decision: string, reasoning: string, archetypeId?: string) => void;
}) {
  const [decision, setDecision] = useState(initialDecision ?? "");
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
              Analyzing...
            </p>
            <p className="text-xs tracking-[0.3em] uppercase text-foreground/40 animate-pulse-soft">
              Evaluating consequences...
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
              Select a position or write your own. This decision is final.
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
                  Select a position
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
                    Selected: {selectedPreset.label}. You may confirm or edit before committing.
                  </p>
                )}
                <label className="block text-[0.6rem] tracking-[0.3em] uppercase text-foreground/50 mb-2">
                  Or in your own words
                </label>
                <textarea
                  value={decision}
                  onChange={(e) => { setDecision(e.target.value); setArchetypeId(undefined); }}
                  rows={3}
                  placeholder={freeWritePlaceholder}
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
                  Cancel
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

function MicButton({
  disabled,
  onTranscribed,
}: {
  disabled?: boolean;
  onTranscribed: (text: string) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const recRef = useRef<Recorder | null>(null);

  async function start() {
    if (disabled || busy) return;
    try {
      const rec = await startRecording();
      recRef.current = rec;
      setRecording(true);
    } catch (e) {
      console.error("mic error", e);
      toast("Microphone unavailable.", { description: "Check browser permissions." });
    }
  }

  async function stop() {
    const rec = recRef.current;
    if (!rec) return;
    recRef.current = null;
    setRecording(false);
    setBusy(true);
    try {
      const blob = await rec.stop();
      if (blob.size < 1024) return;
      const fd = new FormData();
      fd.append("file", blob, "recording.wav");
      const res = await fetch("/api/transcribe", { method: "POST", body: fd });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const text = (data?.text ?? "").trim();
      if (text) onTranscribed(text);
    } catch (e) {
      console.error("transcribe error", e);
      toast("Couldn't catch that.", { description: "Try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={recording ? stop : start}
      disabled={disabled || busy}
      aria-label={recording ? "Stop recording" : "Record"}
      className={`shrink-0 inline-flex items-center justify-center min-h-11 min-w-11 p-2 rounded-full transition-colors disabled:opacity-20 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
        recording ? "text-accent animate-pulse-soft" : "text-foreground/50 hover:text-foreground"
      }`}
    >
      {recording ? <Square className="h-4 w-4 fill-current" /> : <Mic className="h-4 w-4" />}
    </button>

  );
}




