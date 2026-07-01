import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  listMetaTokens,
  requestMetaToken,
  verifySite,
  type VerificationTokenRow,
} from "@/lib/gsc-verify.functions";

const TOKEN_KEY = "dn-admin-token";

export const Route = createFileRoute("/admin/gsc-verify")({
  head: () => ({
    meta: [
      { title: "Verify Search Console Property — Decision Nodes" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: GscVerifyPage,
});

function GscVerifyPage() {
  const qc = useQueryClient();
  const fetchTokens = useServerFn(listMetaTokens);
  const fetchRequest = useServerFn(requestMetaToken);
  const fetchVerify = useServerFn(verifySite);

  const [adminToken, setAdminToken] = useState<string>("");
  const [tokenInput, setTokenInput] = useState<string>("");
  const [domain, setDomain] = useState("decision-nodes.com");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = sessionStorage.getItem(TOKEN_KEY) ?? "";
      setAdminToken(t);
      setTokenInput(t);
    }
  }, []);

  const tokensQ = useQuery({
    queryKey: ["gsc", "tokens", adminToken],
    queryFn: () => fetchTokens({ data: { adminToken } }),
    enabled: Boolean(adminToken),
  });

  const requestMut = useMutation({
    mutationFn: (siteUrl: string) =>
      fetchRequest({ data: { adminToken, siteUrl } }),
    onSuccess: () => {
      setStatus("Token issued. Republish the site, then click Verify.");
      qc.invalidateQueries({ queryKey: ["gsc", "tokens"] });
    },
    onError: (err: Error) => setStatus(err.message),
  });

  const verifyMut = useMutation({
    mutationFn: (siteUrl: string) =>
      fetchVerify({ data: { adminToken, siteUrl } }),
    onSuccess: (res) => {
      setStatus(res.message);
      qc.invalidateQueries({ queryKey: ["gsc", "tokens"] });
      qc.invalidateQueries({ queryKey: ["gsc", "sites"] });
    },
    onError: (err: Error) => setStatus(err.message),
  });

  function submitToken(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem(TOKEN_KEY, tokenInput);
    setAdminToken(tokenInput);
  }

  if (!adminToken) {
    return (
      <main className="min-h-screen bg-background text-foreground px-6 py-10">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-semibold mb-4">Verify Search Console</h1>
          <form onSubmit={submitToken} className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-wide text-muted-foreground">
              Admin token
            </label>
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ADMIN_EVAL_TOKEN"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={!tokenInput}
              className="rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-40"
            >
              Continue
            </button>
          </form>
        </div>
      </main>
    );
  }



  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Verify a Search Console Property
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Issues a Google site-verification meta tag, stores it so it gets
            injected into the site's <code>&lt;head&gt;</code>, then asks
            Google to verify and adds the property to Search Console.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            <Link to="/admin/gsc" className="underline">
              ← Back to top pages
            </Link>
          </p>
        </header>

        <section className="mb-8 rounded-lg border border-border p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            1 · Request token
          </h2>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-1 flex-col gap-1 text-xs uppercase tracking-wide text-muted-foreground">
              Domain or URL
              <input
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="decision-nodes.com"
              />
            </label>
            <button
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
              disabled={requestMut.isPending || !domain.trim()}
              onClick={() => requestMut.mutate(domain)}
            >
              {requestMut.isPending ? "Requesting…" : "Request token"}
            </button>
          </div>
        </section>

        <section className="mb-8 rounded-lg border border-border p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            2 · Properties
          </h2>
          {tokensQ.isLoading && (
            <p className="text-sm text-muted-foreground">Loading…</p>
          )}
          {tokensQ.data && tokensQ.data.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No tokens yet — request one above.
            </p>
          )}
          <ul className="space-y-4">
            {(tokensQ.data ?? []).map((row) => (
              <TokenCard
                key={row.siteUrl}
                row={row}
                pending={
                  verifyMut.isPending && verifyMut.variables === row.siteUrl
                }
                onVerify={() => verifyMut.mutate(row.siteUrl)}
              />
            ))}
          </ul>
        </section>

        {status && (
          <div className="rounded-md border border-border bg-muted/40 px-4 py-3 text-sm">
            {status}
          </div>
        )}

        <section className="mt-8 text-xs leading-relaxed text-muted-foreground">
          <p className="mb-2 font-semibold uppercase tracking-wide">
            How it works
          </p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Click <b>Request token</b>. Google issues a meta tag value.</li>
            <li>
              The tag is stored in the database and injected into the root{" "}
              <code>&lt;head&gt;</code> on every page.
            </li>
            <li>
              <b>Republish the site</b> so the meta tag is in the deployed
              HTML.
            </li>
            <li>
              Click <b>Verify</b>. Google fetches the live page, confirms the
              tag, and the property is added to Search Console.
            </li>
          </ol>
        </section>
      </div>
    </main>
  );
}

function TokenCard({
  row,
  pending,
  onVerify,
}: {
  row: VerificationTokenRow;
  pending: boolean;
  onVerify: () => void;
}) {
  const snippet = `<meta name="google-site-verification" content="${row.token}" />`;
  return (
    <li className="rounded-md border border-border bg-muted/20 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="font-mono text-sm">{row.siteUrl}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {row.verified ? "Verified ✓" : "Pending verification"}
          </div>
        </div>
        <button
          className="rounded-md border border-foreground px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-foreground disabled:opacity-50"
          disabled={pending}
          onClick={onVerify}
        >
          {pending ? "Verifying…" : row.verified ? "Re-verify" : "Verify"}
        </button>
      </div>
      <pre className="mt-3 overflow-x-auto rounded bg-background px-3 py-2 text-xs">
        {snippet}
      </pre>
    </li>
  );
}
