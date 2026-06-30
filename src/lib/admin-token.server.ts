/**
 * Server-only helpers for gating admin server functions with ADMIN_EVAL_TOKEN.
 * Throws a 401 Response when the supplied token is missing or does not match.
 */

function constantTimeEq(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function assertAdminToken(token: string | undefined | null): void {
  const expected = process.env.ADMIN_EVAL_TOKEN;
  if (!expected || !token || !constantTimeEq(token, expected)) {
    throw new Response("Unauthorized", { status: 401 });
  }
}
