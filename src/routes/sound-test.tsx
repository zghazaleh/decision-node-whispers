import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MISSIONS } from "@/lib/missions";
import { createAmbient, type Ambient } from "@/lib/ambient";
import { requireMissionEngine } from "@/lib/missions/registry";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/sound-test")({
  head: () => ({
    meta: [
      { title: "Sound Test — Decision Nodes" },
      { name: "description", content: "Audition mission ambient beds back-to-back." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SoundTestPage,
});

function SoundTestPage() {
  const ambientRef = useRef<Ambient | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [pressure, setPressure] = useState(0);

  useEffect(() => {
    const a = createAmbient(null);
    ambientRef.current = a;
    return () => {
      a.stop();
      ambientRef.current = null;
    };
  }, []);

  async function play(missionId: string) {
    const a = ambientRef.current;
    if (!a) return;
    try {
      const engine = requireMissionEngine(missionId);
      if (engine.atmosphere) {
        a.setAudioProfile({
          padFrequency: engine.atmosphere.padFrequency,
          filterBaseHz: engine.atmosphere.filterBaseHz,
          filterLfoDepthHz: engine.atmosphere.filterLfoDepthHz,
          lfoRateHz: engine.atmosphere.lfoRateHz,
        });
      }
    } catch {
      /* no atmosphere — fine */
    }
    if (!a.isRunning()) {
      await a.start(missionId);
    } else {
      await a.switchTo(missionId, 1400);
    }
    setPlaying(missionId);
  }

  function stop() {
    ambientRef.current?.stop();
    setPlaying(null);
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Sound Test</h1>
          <p className="text-sm text-muted-foreground">
            Audition each mission's ambient bed. Click another mission to cross-fade. Adjust
            pressure to hear how the bed lifts under stakes.
          </p>
        </header>

        <section className="space-y-3">
          {MISSIONS.map((m) => {
            const active = playing === m.id;
            return (
              <div
                key={m.id}
                className={`flex items-center justify-between gap-4 rounded-md border p-4 transition-colors ${
                  active ? "border-primary bg-primary/5" : "border-border"
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground tabular-nums">
                    {m.number} · {m.tone}
                  </div>
                  <div className="font-medium truncate">{m.codename}</div>
                </div>
                <Button
                  variant={active ? "secondary" : "default"}
                  size="sm"
                  onClick={() => play(m.id)}
                >
                  {active ? "Playing" : "Play"}
                </Button>
              </div>
            );
          })}
        </section>

        <section className="space-y-3 border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Pressure</div>
              <div className="text-xs text-muted-foreground">
                Lifts music gain and pad swell. {Math.round(pressure * 100)}%
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={stop} disabled={!playing}>
              Stop
            </Button>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={pressure * 100}
            onChange={(e) => {
              const v = Number(e.target.value) / 100;
              setPressure(v);
              ambientRef.current?.setPressure(v);
            }}
            className="w-full"
          />
        </section>
      </div>
    </main>
  );
}
