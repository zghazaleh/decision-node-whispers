// Runtime overrides for the soundtrack assignment table, edited via the
// Sound Studio admin tool. Maps an assignment key (mission id like
// "mission-05" or screen key like "__landing__") to a different audio
// basename (e.g. "mission-10"). Persisted in localStorage so the change
// survives reloads in the same browser. This is a diagnostic-only knob —
// it does not modify the source `SOUNDTRACKS` config.

const STORAGE_KEY = "sound-studio:assignment-overrides:v1";
const EVENT_NAME = "sound-studio:overrides-changed";

export type OverrideMap = Record<string, string>;

function read(): OverrideMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") return parsed as OverrideMap;
  } catch {
    /* noop */
  }
  return {};
}

export function getOverrides(): OverrideMap {
  return read();
}

export function getOverrideFor(assignmentKey: string): string | null {
  return read()[assignmentKey] ?? null;
}

export function setOverride(assignmentKey: string, audioBasename: string | null): void {
  if (typeof window === "undefined") return;
  const current = read();
  if (audioBasename == null || audioBasename === "") {
    delete current[assignmentKey];
  } else {
    current[assignmentKey] = audioBasename;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    /* noop */
  }
}

export function clearOverrides(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

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
