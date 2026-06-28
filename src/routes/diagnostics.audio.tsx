// In-app audio diagnostics. Surfaces the live state of the audio engine:
// recently failed asset URLs with their cooldown countdown, and a rolling
// log of switchTo / playOneShot attempts with success/failure outcomes.
// Intentionally noindex — this is an operator tool, not a player surface.

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { audio, type AudioAttempt } from "@/lib/audio/director";
import {
  AUDIO_FAILURE_TTL_MS,
  clearAudioFailures,
  getAudioFailures,
  getSimulateFailures,
  setSimulateFailures,
  subscribeAudioFailures,
  subscribeSimulateFailures,
  type SimulateFailuresMode,
} from "@/lib/ambient";

export const Route = createFileRoute("/diagnostics/audio")({
  head: () => ({
    meta: [
      { title: "Audio Diagnostics — Decision Nodes" },
      { name: "robots", content: "noindex" },
      {
        name: "description",
        content:
          "Internal: live state of audio beds, SFX, failed URLs, and cooldown timers.",
      },
    ],
  }),
  component: AudioDiagnosticsPage,
});

type Failure = ReturnType<typeof getAudioFailures>[number];

function AudioDiagnosticsPage() {
  const [attempts, setAttempts] = useState<AudioAttempt[]>(() => audio.recentAttempts());
  const [failures, setFailures] = useState<Failure[]>(() => getAudioFailures());
  const [, setTick] = useState(0);

  const [simulate, setSimulate] = useState<SimulateFailuresMode>(() => getSimulateFailures());

  // Refresh on attempt mutations + failure events.
  useEffect(() => {
    const refresh = () => {
      setAttempts(audio.recentAttempts());
      setFailures(getAudioFailures());
    };
    const unsubAttempts = audio.subscribe(refresh);
    const unsubFailures = subscribeAudioFailures(refresh);
    const unsubSim = subscribeSimulateFailures((m) => setSimulate(m));
    return () => { unsubAttempts(); unsubFailures(); unsubSim(); };
  }, []);

  // Re-render every second so cooldown countdowns tick and expired failures
  // drop off the visible list.
  useEffect(() => {
    const id = window.setInterval(() => {
      setFailures(getAudioFailures());
      setTick((n) => n + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-4xl space-y-12">
        <header className="space-y-2">
          <p className="text-[10px] tracking-[0.28em] uppercase text-foreground/50">
            Diagnostics
          </p>
          <h1 className="font-display text-3xl sm:text-4xl">Audio engine</h1>
          <p className="text-sm text-foreground/60">
            Live view of the audio director. Failure cooldown:{" "}
            <span className="text-foreground/80">
              {Math.round(AUDIO_FAILURE_TTL_MS / 1000)}s
            </span>
            . Current screen:{" "}
            <span className="text-foreground/80">
              {audio.currentScreen() ?? "—"}
            </span>
            . Muted:{" "}
            <span className="text-foreground/80">{String(audio.isMuted())}</span>.
            Ignited:{" "}
            <span className="text-foreground/80">{String(audio.isIgnited())}</span>.
          </p>
        </header>

        <section className="space-y-3 rounded-md border border-amber-400/20 bg-amber-400/[0.03] p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs tracking-[0.24em] uppercase text-amber-300/80">
              Simulate failures (dev)
            </h2>
            <span className="text-[11px] text-foreground/40">
              persisted to localStorage
            </span>
          </div>
          <p className="text-xs text-foreground/55">
            Forces audio assets to throw at load time so you can verify the
            bed/sfx fallback chains, the on-screen failure indicator, and the
            cooldown cache without breaking real CDN URLs. Navigate between
            missions / analysis with this enabled to exercise every transition.
          </p>
          <fieldset className="flex flex-wrap gap-2 pt-1">
            <legend className="sr-only">Failure simulation mode</legend>
            {(["off", "beds", "sfx", "all"] as const).map((mode) => {
              const active = simulate === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setSimulateFailures(mode)}
                  aria-pressed={active}
                  className={
                    "px-3 py-1.5 rounded text-[11px] tracking-[0.18em] uppercase transition-colors border " +
                    (active
                      ? "border-amber-400/60 bg-amber-400/15 text-amber-200"
                      : "border-foreground/15 text-foreground/60 hover:text-foreground/90 hover:border-foreground/30")
                  }
                >
                  {mode === "off" ? "off" : `fail ${mode}`}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => { clearAudioFailures(); setFailures(getAudioFailures()); }}
              className="ml-auto px-3 py-1.5 rounded text-[11px] tracking-[0.18em] uppercase border border-foreground/15 text-foreground/60 hover:text-foreground/90 hover:border-foreground/30 transition-colors"
            >
              Clear cooldowns
            </button>
          </fieldset>
          {simulate !== "off" && (
            <p className="text-[11px] text-amber-200/80">
              Active: every {simulate === "all" ? "bed and one-shot" : simulate === "beds" ? "bed (mission / archive / landing / analysis)" : "sfx + motif one-shot"} will fail. Cached buffers from before the toggle was set still play — clear cooldowns and reload to start clean.
            </p>
          )}
        </section>



        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs tracking-[0.24em] uppercase text-foreground/70">
              Failed URLs
            </h2>
            <span className="text-[11px] text-foreground/40">
              {failures.length} active
            </span>
          </div>
          {failures.length === 0 ? (
            <p className="text-sm text-foreground/40 italic">
              No failures in the cooldown window.
            </p>
          ) : (
            <ul className="divide-y divide-foreground/10 rounded-md border border-foreground/10">
              {failures.map((f) => (
                <li key={f.url} className="px-4 py-3 text-xs flex flex-col gap-1">
                  <code className="break-all text-foreground/80">{f.url}</code>
                  <div className="flex gap-4 text-foreground/50">
                    <span>failed {formatAgo(f.failedAt)}</span>
                    <span>
                      cooldown{" "}
                      <span className="text-amber-400/80">
                        {Math.ceil(f.cooldownMs / 1000)}s
                      </span>{" "}
                      remaining
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs tracking-[0.24em] uppercase text-foreground/70">
              Recent attempts
            </h2>
            <span className="text-[11px] text-foreground/40">
              {attempts.length} logged
            </span>
          </div>
          {attempts.length === 0 ? (
            <p className="text-sm text-foreground/40 italic">
              No switchTo or playOneShot calls yet this session.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-md border border-foreground/10">
              <table className="w-full text-xs">
                <thead className="text-foreground/50 text-[10px] uppercase tracking-[0.16em]">
                  <tr className="border-b border-foreground/10">
                    <th className="text-left font-normal px-3 py-2">When</th>
                    <th className="text-left font-normal px-3 py-2">Kind</th>
                    <th className="text-left font-normal px-3 py-2">Target</th>
                    <th className="text-left font-normal px-3 py-2">Result</th>
                    <th className="text-right font-normal px-3 py-2">Took</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((a) => (
                    <tr key={a.id} className="border-b border-foreground/5 last:border-0">
                      <td className="px-3 py-2 text-foreground/60 whitespace-nowrap">
                        {formatAgo(a.at)}
                      </td>
                      <td className="px-3 py-2 text-foreground/70">{a.kind}</td>
                      <td className="px-3 py-2">
                        <div className="text-foreground/80">{a.label}</div>
                        {a.url && (
                          <code className="text-[10px] text-foreground/40 break-all">
                            {a.url}
                          </code>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <ResultPill ok={a.ok} />
                      </td>
                      <td className="px-3 py-2 text-right text-foreground/50 whitespace-nowrap">
                        {a.durationMs != null ? `${a.durationMs}ms` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ResultPill({ ok }: { ok?: boolean }) {
  if (ok === undefined) {
    return (
      <span className="inline-flex items-center gap-1 text-foreground/50">
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/40 animate-pulse" />
        pending
      </span>
    );
  }
  if (ok) {
    return (
      <span className="inline-flex items-center gap-1 text-emerald-400/90">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        ok
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-amber-400/90">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      failed
    </span>
  );
}

function formatAgo(at: number): string {
  const s = Math.max(0, Math.round((Date.now() - at) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}m ${rem}s ago`;
}
