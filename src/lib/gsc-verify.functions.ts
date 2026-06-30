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

function normalizeSiteUrl(input: string): string {
  let raw = input.trim();
  if (!raw) throw new Error("Site URL is required.");
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  const u = new URL(raw);
  if (!u.pathname.endsWith("/")) u.pathname = `${u.pathname}/`;
  return `${u.protocol}//${u.host}${u.pathname}`;
}

const siteInput = z.object({
  adminToken: z.string().min(1),
  siteUrl: z.string().min(1).max(2048),
});

export type VerificationTokenRow = {
  siteUrl: string;
  token: string;
  verified: boolean;
};

/** Request a META verification token from Google and persist it. */
export const requestMetaToken = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => siteInput.parse(data))
  .handler(async ({ data }): Promise<VerificationTokenRow> => {
    assertAdminToken(data.adminToken);
    const siteUrl = normalizeSiteUrl(data.siteUrl);
    const res = await fetch(`${GATEWAY}/siteVerification/v1/token`, {

      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        site: { identifier: siteUrl, type: "SITE" },
        verificationMethod: "META",
      }),
    });
    if (!res.ok) {
      throw new Error(
        `Token request failed (${res.status}): ${await res.text()}`,
      );
    }
    const json = (await res.json()) as { token: string; method: string };

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { error } = await supabaseAdmin
      .from("gsc_verification_tokens")
      .upsert(
        { site_url: siteUrl, token: json.token, verified: false },
        { onConflict: "site_url" },
      );
    if (error) throw new Error(`Failed to persist token: ${error.message}`);

    return { siteUrl, token: json.token, verified: false };
  });

/** Ask Google to verify, then add the site to Search Console. */
export const verifySite = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => siteInput.parse(data))
  .handler(
    async ({
      data,
    }): Promise<{ ok: boolean; verified: boolean; added: boolean; message: string }> => {
      assertAdminToken(data.adminToken);
      const siteUrl = normalizeSiteUrl(data.siteUrl);


      const verifyRes = await fetch(
        `${GATEWAY}/siteVerification/v1/webResource?verificationMethod=META`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            site: { identifier: siteUrl, type: "SITE" },
          }),
        },
      );
      if (!verifyRes.ok) {
        const body = await verifyRes.text();
        return {
          ok: false,
          verified: false,
          added: false,
          message: `Google could not verify the site (${verifyRes.status}). Make sure the meta tag is live in the deployed HTML at ${siteUrl}. Details: ${body}`,
        };
      }

      const addRes = await fetch(
        `${GATEWAY}/webmasters/v3/sites/${encodeURIComponent(siteUrl)}`,
        { method: "PUT", headers: authHeaders() },
      );
      const added = addRes.ok;

      const { supabaseAdmin } = await import(
        "@/integrations/supabase/client.server"
      );
      await supabaseAdmin
        .from("gsc_verification_tokens")
        .update({ verified: true })
        .eq("site_url", siteUrl);

      return {
        ok: true,
        verified: true,
        added,
        message: added
          ? `Verified and added ${siteUrl} to Search Console.`
          : `Verified ${siteUrl}, but adding to Search Console returned ${addRes.status}.`,
      };
    },
  );

/** Public list of meta tokens to inject into the site HTML. */
export const listMetaTokens = createServerFn({ method: "GET" }).handler(
  async (): Promise<VerificationTokenRow[]> => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data, error } = await supabaseAdmin
      .from("gsc_verification_tokens")
      .select("site_url, token, verified");
    if (error) return [];
    return (data ?? []).map((r) => ({
      siteUrl: r.site_url,
      token: r.token,
      verified: r.verified,
    }));
  },
);
