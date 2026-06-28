import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import {
  listGscSites,
  getTopPages,
  type TopPageRow,
} from "@/lib/gsc.functions";

export const Route = createFileRoute("/admin/gsc")({
  head: () => ({
    meta: [
      { title: "Search Console — Decision Nodes" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: GscPage,
});

type SortKey = "impressions" | "clicks" | "ctr" | "position";

function GscPage() {
  const fetchSites = useServerFn(listGscSites);
  const fetchPages = useServerFn(getTopPages);

  const sitesQ = useQuery({
    queryKey: ["gsc", "sites"],
    queryFn: () => fetchSites(),
  });

  const [siteUrl, setSiteUrl] = useState<string>("");
  const [days, setDays] = useState<number>(28);
  const [sortKey, setSortKey] = useState<SortKey>("impressions");

  const activeSite =
    siteUrl || sitesQ.data?.sites[0]?.siteUrl || "";

  const pagesQ = useQuery({
    queryKey: ["gsc", "pages", activeSite, days],
    queryFn: () => fetchPages({ data: { siteUrl: activeSite, days, rowLimit: 25 } }),
    enabled: Boolean(activeSite),
  });

  const sortedRows = useMemo(() => {
    const rows = pagesQ.data?.rows ?? [];
    return [...rows].sort((a, b) => {
      if (sortKey === "position") return a.position - b.position;
      return (b[sortKey] as number) - (a[sortKey] as number);
    });
  }, [pagesQ.data, sortKey]);

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Search Console — Top Landing Pages
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Impressions, clicks, CTR, and average position from Google Search
            Console.
          </p>
        </header>

        <section className="mb-6 flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-muted-foreground">
            Site
            <select
              className="min-w-[260px] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              value={activeSite}
              onChange={(e) => setSiteUrl(e.target.value)}
              disabled={sitesQ.isLoading || !sitesQ.data}
            >
              {(sitesQ.data?.sites ?? []).map((s) => (
                <option key={s.siteUrl} value={s.siteUrl}>
                  {s.siteUrl}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-muted-foreground">
            Range
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={28}>Last 28 days</option>
              <option value={90}>Last 90 days</option>
              <option value={180}>Last 6 months</option>
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs uppercase tracking-wide text-muted-foreground">
            Sort by
            <select
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              <option value="impressions">Impressions</option>
              <option value="clicks">Clicks</option>
              <option value="ctr">CTR</option>
              <option value="position">Avg. position</option>
            </select>
          </label>
        </section>

        {sitesQ.isError && (
          <ErrorBanner message={(sitesQ.error as Error).message} />
        )}
        {pagesQ.isError && (
          <ErrorBanner message={(pagesQ.error as Error).message} />
        )}

        {pagesQ.data && (
          <p className="mb-3 text-xs text-muted-foreground">
            {pagesQ.data.startDate} → {pagesQ.data.endDate} · {sortedRows.length} pages
          </p>
        )}

        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Page</th>
                <th className="px-4 py-3 text-right">Impressions</th>
                <th className="px-4 py-3 text-right">Clicks</th>
                <th className="px-4 py-3 text-right">CTR</th>
                <th className="px-4 py-3 text-right">Avg. position</th>
              </tr>
            </thead>
            <tbody>
              {pagesQ.isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Loading…
                  </td>
                </tr>
              )}
              {!pagesQ.isLoading && sortedRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No data for this site and range.
                  </td>
                </tr>
              )}
              {sortedRows.map((row) => (
                <Row key={row.page} row={row} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function Row({ row }: { row: TopPageRow }) {
  let pretty = row.page;
  try {
    const u = new URL(row.page);
    pretty = u.pathname + u.search;
  } catch {
    /* keep raw */
  }
  return (
    <tr className="border-t border-border">
      <td className="max-w-[420px] truncate px-4 py-3">
        <a
          href={row.page}
          target="_blank"
          rel="noreferrer"
          className="text-foreground hover:underline"
          title={row.page}
        >
          {pretty}
        </a>
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {row.impressions.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {row.clicks.toLocaleString()}
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {(row.ctr * 100).toFixed(2)}%
      </td>
      <td className="px-4 py-3 text-right tabular-nums">
        {row.position.toFixed(1)}
      </td>
    </tr>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
      {message}
    </div>
  );
}
