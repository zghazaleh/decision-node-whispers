import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";

import {
  getEvaluationReport,
  type EvaluationReport,
} from "@/lib/evaluation.functions";

const searchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/admin/evaluation")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Build Evaluation — Decision Nodes" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminEvaluationPage,
});

function AdminEvaluationPage() {
  const { token: urlToken } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const fetchReport = useServerFn(getEvaluationReport);
  const [tokenInput, setTokenInput] = useState(urlToken ?? "");
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load(token: string) {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetchReport({ data: { token } });
      setReport(r);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg.includes("401") || msg.toLowerCase().includes("unauthorized")
        ? "Invalid admin token."
        : msg);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (urlToken) load(urlToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlToken]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate({ search: { token: tokenInput || undefined } });
    load(tokenInput);
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-2">
            Admin
          </p>
          <h1 className="font-display text-3xl">Build Evaluation</h1>
          <p className="mt-2 text-sm text-foreground/60">
            Constitution checks, mission-framework validation, and percentile-surface audit for the current build.
          </p>
        </header>

        {!report && (
          <form onSubmit={onSubmit} className="mb-10 flex gap-3 items-end max-w-md">
            <div className="flex-1">
              <label className="block text-[0.6rem] tracking-[0.4em] uppercase text-foreground/50 mb-2">
                Admin token
              </label>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full bg-transparent border border-foreground/20 px-3 py-2 text-sm focus:border-foreground/60 outline-none"
                placeholder="ADMIN_EVAL_TOKEN"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !tokenInput}
              className="border border-foreground/40 px-4 py-2 text-xs tracking-[0.3em] uppercase hover:bg-foreground/5 disabled:opacity-40"
            >
              {loading ? "…" : "Load"}
            </button>
          </form>
        )}

        {error && (
          <div className="mb-8 border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {report && <ReportView report={report} onReload={() => load(urlToken ?? tokenInput)} />}
      </div>
    </div>
  );
}

function ReportView({
  report,
  onReload,
}: {
  report: EvaluationReport;
  onReload: () => void;
}) {
  const { summary, missions, percentileAudit, invariants } = report;
  return (
    <div className="space-y-12">
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Missions" value={summary.totalMissions} />
        <Stat label="Fully passing" value={summary.fullyPassing} tone={summary.fullyPassing === summary.totalMissions ? "good" : "warn"} />
        <Stat label="Framework gaps" value={summary.frameworkIncomplete} tone={summary.frameworkIncomplete === 0 ? "good" : "bad"} />
        <Stat label="Constitution fails" value={summary.constitutionFailures} tone={summary.constitutionFailures === 0 ? "good" : "bad"} />
      </section>

      <section>
        <SectionHeader title="Director invariants" />
        <ul className="text-sm space-y-1">
          <CheckRow ok={invariants.forbidsAIMention} label="Forbids AI/narrator self-reference" />
          <CheckRow ok={invariants.forbidsPlayerInteriority} label="Forbids describing player interiority" />
          <CheckRow ok={invariants.enforcesChipsProtocol} label="Enforces chip protocol" />
          <CheckRow ok={invariants.forbidsCountdown} label="Forbids countdown / game-mechanic language" />
        </ul>
      </section>

      <section>
        <SectionHeader title="Missions" />
        <div className="border border-foreground/10">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto] gap-4 px-4 py-3 text-[0.6rem] tracking-[0.3em] uppercase text-foreground/50 border-b border-foreground/10">
            <span>Mission</span>
            <span>Framework</span>
            <span>Invariants</span>
            <span>Chips</span>
            <span>Archetypes</span>
            <span>Presets</span>
            <span>Mystery</span>
          </div>
          {missions.map((m) => (
            <div
              key={m.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto_auto_auto] gap-4 px-4 py-3 text-sm border-b border-foreground/5 items-center"
            >
              <span className="font-mono text-xs">{m.id}</span>
              <Cell ok={m.frameworkMissing.length === 0} note={m.frameworkMissing.join(", ")} />
              <Cell ok={m.checks.invariantsInherited} />
              <Cell ok={m.checks.chipTrailerOk} />
              <Cell ok={m.checks.archetypeDepthOk} />
              <Cell ok={m.checks.decisionPresetsWired} />
              <Cell
                ok={m.checks.hiddenTruthLeak === null && !m.checks.moralizingVocabulary}
                note={
                  m.checks.hiddenTruthLeak
                    ? `leak: ${m.checks.hiddenTruthLeak}`
                    : m.checks.moralizingVocabulary
                      ? "moralizing vocab"
                      : ""
                }
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Percentile-surface audit" />
        <p className="text-xs text-foreground/50 mb-3">
          Scans <code className="text-foreground/70">{percentileAudit.file}</code> for
          ranking / leaderboard language forbidden by non-negotiable #4.
        </p>
        {percentileAudit.clean ? (
          <p className="text-sm text-emerald-400/90">
            ✓ Clean — no ranking vocabulary on the player-facing analysis route.
          </p>
        ) : (
          <ul className="text-sm space-y-2">
            {percentileAudit.findings.map((f) => (
              <li key={f.pattern} className="border border-destructive/40 p-3">
                <span className="text-destructive">✗ {f.pattern}</span>
                <span className="text-foreground/50 ml-2">
                  line{f.lineNumbers.length > 1 ? "s" : ""} {f.lineNumbers.join(", ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="pt-8 border-t border-foreground/10 flex items-center justify-between text-xs text-foreground/50">
        <span>Generated {new Date(report.generatedAt).toLocaleString()}</span>
        <button
          onClick={onReload}
          className="border border-foreground/30 px-3 py-1 tracking-[0.3em] uppercase hover:bg-foreground/5"
        >
          Refresh
        </button>
      </footer>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "good" | "warn" | "bad" | "neutral";
}) {
  const color =
    tone === "good"
      ? "text-emerald-400"
      : tone === "bad"
        ? "text-destructive"
        : tone === "warn"
          ? "text-amber-400"
          : "text-foreground";
  return (
    <div className="border border-foreground/10 p-4">
      <div className="text-[0.55rem] tracking-[0.4em] uppercase text-foreground/50">
        {label}
      </div>
      <div className={`mt-2 font-display text-3xl ${color}`}>{value}</div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-4">
      {title}
    </h2>
  );
}

function CheckRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className={ok ? "text-emerald-400" : "text-destructive"}>
        {ok ? "✓" : "✗"}
      </span>
      <span className="text-foreground/80">{label}</span>
    </li>
  );
}

function Cell({ ok, note }: { ok: boolean; note?: string }) {
  return (
    <span
      title={note || undefined}
      className={`text-center ${ok ? "text-emerald-400" : "text-destructive"}`}
    >
      {ok ? "✓" : note ? `✗ ${note}` : "✗"}
    </span>
  );
}
