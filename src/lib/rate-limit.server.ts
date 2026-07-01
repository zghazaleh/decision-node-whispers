/**
 * Postgres-backed rate limiter. Uses the `check_rate_limit` SQL function
 * which is safe across distributed Cloudflare Worker instances (in-memory
 * counters would race). Fails OPEN on infra errors so a database blip
 * cannot lock every user out.
 */

export async function checkRateLimit(
  key: string,
  max: number,
  windowSeconds: number,
): Promise<boolean> {
  try {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );
    const { data, error } = await (supabaseAdmin as unknown as {
      rpc: (name: string, params: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
    }).rpc("check_rate_limit", {
      p_key: key,
      p_max: max,
      p_window_seconds: windowSeconds,
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.error("[rate-limit] rpc error", error);
      return true;
    }
    return data !== false;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[rate-limit] failed", err);
    return true;
  }
}

export function clientIpFromRequest(request: Request): string {
  const h = request.headers;
  return (
    h.get("cf-connecting-ip") ||
    h.get("x-real-ip") ||
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function sanitizeSessionId(raw: string | null | undefined): string {
  if (!raw) return "anon";
  const trimmed = String(raw).trim().slice(0, 96);
  return /^[a-zA-Z0-9._-]+$/.test(trimmed) ? trimmed : "anon";
}
