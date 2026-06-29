import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getConstitutionStatus } from "@/lib/constitution.functions";
import { FileText, CheckCircle2, XCircle, Github } from "lucide-react";

export const Route = createFileRoute("/constitution")({
  head: () => ({
    meta: [
      { title: "Constitution — Decision Nodes" },
      {
        name: "description",
        content:
          "Live sync status for the Decision Nodes constitution: GitHub connection, file archive, and the canonical authoring rules behind every mission.",
      },
      { property: "og:title", content: "Constitution — Decision Nodes" },
      {
        property: "og:description",
        content:
          "Live sync status for the Decision Nodes constitution: GitHub connection, file archive, and the canonical authoring rules behind every mission.",
      },
      { property: "og:url", content: "https://decision-nodes.com/constitution" },
    ],
    links: [{ rel: "canonical", href: "https://decision-nodes.com/constitution" }],
  }),
  component: ConstitutionPage,
});

function ConstitutionPage() {
  const fetchStatus = useServerFn(getConstitutionStatus);
  const { data, isLoading } = useQuery({
    queryKey: ["constitution-status"],
    queryFn: () => fetchStatus(),
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const githubOk = data?.githubConnected ?? false;
  const filesOk = data?.allFilesPresent ?? false;

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="starfield animate-drift" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 35%, oklch(0.78 0.10 80 / 0.06), transparent 70%)",
        }}
        aria-hidden
      />
      <div className="vignette" aria-hidden />
      <div className="film-grain" aria-hidden />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-16 sm:px-10 sm:py-24">
        <header className="mb-12 flex items-start justify-between">
          <Link
            to="/"
            className="text-[0.6rem] tracking-[0.4em] uppercase text-muted-foreground hover:text-foreground/90 transition-colors"
          >
            ← Decision Nodes
          </Link>
        </header>

        <div className="mb-16 max-w-xl animate-fade-up">
          <p className="text-[0.65rem] tracking-[0.5em] uppercase text-muted-foreground mb-6">
            System Status
          </p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[0.95] text-foreground/95 text-balance">
            Constitution
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground text-pretty">
            Live status of the project constitution files and GitHub sync.
          </p>
        </div>

        {/* Status cards */}
        <div className="mb-16 grid gap-4 sm:grid-cols-2">
          <div className="border border-foreground/10 bg-foreground/[0.015] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Github className="h-4 w-4 text-muted-foreground/60" aria-hidden />
              <h2 className="text-[0.65rem] tracking-[0.4em] uppercase text-muted-foreground">
                GitHub Connection
              </h2>
            </div>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Checking…</p>
            ) : githubOk ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden />
                <span className="text-sm text-foreground/80">Connected</span>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5" aria-hidden />
                <div>
                  <p className="text-sm text-foreground/80">Not connected</p>
                  <p className="mt-1 text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground/60">
                    Open the + menu → GitHub → Connect project
                  </p>
                </div>
              </div>
            )}
            {data?.githubRemoteUrl && (
              <p className="mt-3 text-[0.6rem] tracking-[0.2em] text-muted-foreground/50 break-all">
                {data.githubRemoteUrl}
              </p>
            )}
          </div>

          <div className="border border-foreground/10 bg-foreground/[0.015] p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-4 w-4 text-muted-foreground/60" aria-hidden />
              <h2 className="text-[0.65rem] tracking-[0.4em] uppercase text-muted-foreground">
                File Integrity
              </h2>
            </div>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Checking…</p>
            ) : filesOk ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden />
                <span className="text-sm text-foreground/80">
                  All {data?.files.length ?? 0} files present
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 text-red-500 mt-0.5" aria-hidden />
                <div>
                  <p className="text-sm text-foreground/80">
                    {data?.missingFiles.length ?? 0} file(s) missing
                  </p>
                  {data?.missingFiles.map((f) => (
                    <p
                      key={f}
                      className="mt-1 text-[0.6rem] tracking-[0.2em] text-red-400/80"
                    >
                      {f}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* File list */}
        <h2 className="text-[0.65rem] tracking-[0.5em] uppercase text-muted-foreground mb-6">
          File Archive
        </h2>
        <ul className="space-y-2">
          {isLoading ? (
            <li className="text-sm text-muted-foreground">Loading files…</li>
          ) : (
            data?.files.map((file, i) => (
              <li
                key={file.name}
                className="animate-fade-up flex items-center justify-between border border-foreground/10 bg-foreground/[0.015] px-4 py-3"
                style={{ animationDelay: `${0.1 + i * 0.05}s` }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" aria-hidden />
                  <span className="text-sm text-foreground/80 truncate">{file.name}</span>
                </div>
                <div className="flex items-center gap-4 text-[0.6rem] tracking-[0.2em] uppercase text-muted-foreground/60 shrink-0 ml-4">
                  <span className="tabular-nums hidden sm:inline">{formatBytes(file.size)}</span>
                  <span className="tabular-nums">{formatDate(file.modifiedAt)}</span>
                </div>
              </li>
            ))
          )}
        </ul>

        {data?.lastGitCommit && (
          <footer className="mt-12 text-[0.55rem] tracking-[0.3em] uppercase text-muted-foreground/40">
            Last commit {data.lastGitCommit.slice(0, 8)} ·{" "}
            {data.lastGitCommitTime
              ? new Date(data.lastGitCommitTime).toLocaleString()
              : "—"}
          </footer>
        )}
      </section>
    </main>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
