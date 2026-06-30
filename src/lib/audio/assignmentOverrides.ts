// Runtime overrides and Sound Studio drafts. Stored in localStorage so
// changes survive reloads in the same browser. This is a diagnostic-only
// system — it does not modify the source `SOUNDTRACKS` config.

const OVERRIDES_KEY = "sound-studio:assignment-overrides:v1";
const DRAFTS_KEY = "sound-studio:drafts:v1";
const EVENT_NAME = "sound-studio:changed";

// Override values are either a registered audio basename (e.g. "mission-05")
// OR a data: URL pointing at an in-browser draft generated via the Studio.
export type OverrideMap = Record<string, string>;

export type Draft = {
  name: string;          // unique slug used as the "basename" surrogate
  label: string;         // human-readable display name
  prompt: string;
  durationSeconds: number;
  dataUrl: string;       // data:audio/mpeg;base64,...
  size: number;
  createdAt: string;
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    /* noop — quota or serialization failure */
  }
}

// ---------- Overrides ----------

export function getOverrides(): OverrideMap {
  return readJson<OverrideMap>(OVERRIDES_KEY, {});
}

export function getOverrideFor(assignmentKey: string): string | null {
  return getOverrides()[assignmentKey] ?? null;
}

export function setOverride(assignmentKey: string, value: string | null): void {
  const current = getOverrides();
  if (!value) delete current[assignmentKey];
  else current[assignmentKey] = value;
  writeJson(OVERRIDES_KEY, current);
}

export function clearOverrides(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(OVERRIDES_KEY);
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

// ---------- Drafts ----------

export function getDrafts(): Draft[] {
  return readJson<Draft[]>(DRAFTS_KEY, []);
}

export function saveDraft(draft: Draft): void {
  const drafts = getDrafts().filter((d) => d.name !== draft.name);
  drafts.unshift(draft);
  writeJson(DRAFTS_KEY, drafts);
}

export function deleteDraft(name: string): void {
  const target = getDrafts().find((d) => d.name === name);
  const drafts = getDrafts().filter((d) => d.name !== name);
  writeJson(DRAFTS_KEY, drafts);
  if (!target) return;
  // Drop any overrides pointing at this draft's data URL.
  const overrides = getOverrides();
  let changed = false;
  for (const [k, v] of Object.entries(overrides)) {
    if (v === target.dataUrl) { delete overrides[k]; changed = true; }
  }
  if (changed) writeJson(OVERRIDES_KEY, overrides);
}

// ---------- Subscribe ----------

export function subscribeOverrides(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}
