/**
 * Lightweight per-browser session id for guest rate-limiting.
 * Not authentication — just a stable key so a burst from one guest
 * can be throttled without harming other guests.
 */

const KEY = "dn-session-id";

export function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  try {
    let id = window.localStorage.getItem(KEY);
    if (!id) {
      id = (crypto?.randomUUID?.() ?? `s-${Date.now()}-${Math.random().toString(36).slice(2)}`);
      window.localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "no-storage";
  }
}
