import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getConstitutionStatus } from "@/lib/constitution.functions";

export function ConstitutionStatusBadge() {
  const fetchStatus = useServerFn(getConstitutionStatus);
  const { data } = useQuery({
    queryKey: ["constitution-status"],
    queryFn: () => fetchStatus(),
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const [open, setOpen] = useState(false);

  const githubOk = data?.githubConnected ?? false;
  const filesOk = data?.allFilesPresent ?? false;
  const allOk = githubOk && filesOk;

  return (
    <div className="relative z-50">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-sm border border-foreground/10 bg-background/80 px-3 py-1.5 backdrop-blur-sm text-[0.6rem] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Constitution sync status"
        aria-expanded={open}
      >
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            allOk ? "bg-emerald-500" : githubOk ? "bg-amber-500" : "bg-red-500"
          }`}
          aria-hidden
        />
        <span className="hidden sm:inline">
          {allOk ? "Synced" : githubOk ? "Files" : "GitHub"}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 border border-foreground/10 bg-background/95 backdrop-blur-md p-4 shadow-2xl">
          <h3 className="font-display text-sm text-foreground/90 mb-3">
            Constitution Sync Status
          </h3>

          <div className="space-y-3">
            <StatusRow
              label="GitHub"
              ok={githubOk}
              detail={
                githubOk
                  ? data?.githubRemoteUrl
                    ? data.githubRemoteUrl.replace(/^git@github\.com:/, "github.com/").replace(/\.git$/, "")
                    : "Connected"
                  : "Not connected"
              }
            />
            <StatusRow
              label="Files"
              ok={filesOk}
              detail={
                data
                  ? `${data.files.length} file${data.files.length === 1 ? "" : "s"}${
                      data.missingFiles.length ? ` · ${data.missingFiles.length} missing` : ""
                    }`
                  : "Checking…"
              }
            />
            {data?.lastGitCommitTime && (
              <p className="text-[0.55rem] tracking-[0.2em] uppercase text-muted-foreground/60">
                Last commit: {new Date(data.lastGitCommitTime).toLocaleString()}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Link
              to="/constitution"
              className="text-[0.6rem] tracking-[0.3em] uppercase text-accent hover:text-foreground transition-colors border-b border-accent/30 hover:border-foreground/50 pb-0.5"
              onClick={() => setOpen(false)}
            >
              View Details
            </Link>
            {!githubOk && (
              <span className="text-[0.55rem] tracking-[0.2em] uppercase text-red-400/80">
                Connect GitHub to sync
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusRow({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-center justify-between text-[0.65rem]">
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            ok ? "bg-emerald-500" : "bg-red-500"
          }`}
          aria-hidden
        />
        <span className="tracking-[0.2em] uppercase text-muted-foreground/80">{label}</span>
      </div>
      <span className="text-muted-foreground/60 truncate max-w-[140px]">{detail}</span>
    </div>
  );
}
