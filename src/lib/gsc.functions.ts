import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { assertAdminToken } from "./admin-token.server";

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";

function authHeaders() {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const connKey = process.env.GOOGLE_SEARCH_CONSOLE_API_KEY;
  if (!lovableKey || !connKey) {
    throw new Error(
      "Google Search Console connection is missing. Reconnect from project settings.",
    );
  }
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": connKey,
    "Content-Type": "application/json",
  };
}

export type GscSite = { siteUrl: string; permissionLevel: string };

const sitesInput = z.object({ adminToken: z.string().min(1) });

export const listGscSites = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => sitesInput.parse(data))
  .handler(async ({ data }): Promise<{ sites: GscSite[] }> => {
    assertAdminToken(data.adminToken);
    const res = await fetch(`${GATEWAY}/webmasters/v3/sites`, {
      headers: authHeaders(),
    });
    if (!res.ok) {
      throw new Error(`GSC sites failed (${res.status}): ${await res.text()}`);
    }
    const json = (await res.json()) as { siteEntry?: GscSite[] };
    return { sites: json.siteEntry ?? [] };
  });

export type TopPageRow = {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

const inputSchema = z.object({
  adminToken: z.string().min(1),
  siteUrl: z.string().min(1).max(2048),
  days: z.number().int().min(1).max(480).default(28),
  rowLimit: z.number().int().min(1).max(1000).default(25),
});

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export const getTopPages = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<{ rows: TopPageRow[]; startDate: string; endDate: string }> => {
    assertAdminToken(data.adminToken);
    const endDate = isoDaysAgo(1); // GSC data lags ~1-3 days
    const startDate = isoDaysAgo(data.days);
    const sitePath = encodeURIComponent(data.siteUrl);
    const res = await fetch(
      `${GATEWAY}/webmasters/v3/sites/${sitePath}/searchAnalytics/query`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions: ["page"],
          rowLimit: data.rowLimit,
        }),
      },
    );
    if (!res.ok) {
      throw new Error(`GSC query failed (${res.status}): ${await res.text()}`);
    }
    const json = (await res.json()) as {
      rows?: Array<{
        keys: string[];
        clicks: number;
        impressions: number;
        ctr: number;
        position: number;
      }>;
    };
    const rows: TopPageRow[] = (json.rows ?? []).map((r) => ({
      page: r.keys[0],
      clicks: r.clicks,
      impressions: r.impressions,
      ctr: r.ctr,
      position: r.position,
    }));
    return { rows, startDate, endDate };
  });
