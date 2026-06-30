// Sound Studio — temporary admin diagnostic for audio assets.
// Lists every registered audio file with its assignment, lets you preview
// each one through a plain <audio> element, and surfaces load failures
// prominently. Remove this route when the audio investigation is done.

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SOUNDTRACKS, getSoundtrack, type Soundtrack } from "@/lib/soundtracks";
import { displayNameFor } from "@/lib/audio/displayNames";
import {
  getOverrides,
  setOverride,
  clearOverrides,
  subscribeOverrides,
  getDrafts,
  saveDraft,
  deleteDraft,
  type Draft,
  type OverrideMap,
} from "@/lib/audio/assignmentOverrides";
import { generateAmbientBed } from "@/lib/sound-studio.functions";

export const Route = createFileRoute("/admin/sound")({
  head: () => ({
    meta: [
      { title: "Sound Studio — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SoundStudio,
});

type AssetMeta = {
  url: string;
  original_filename: string;
  size: number;
  content_type: string;
};

type Row = {
  key: string;              // pointer file basename, or `draft:<name>` for drafts
  kind: "asset" | "draft";
  displayName: string;
  filename: string;
  url: string;
  assignmentValue: string;  // value stored in override map (basename or data: URL)
  size: number;
  contentType: string;
  draftName?: string;
};

// Eager-glob every pointer JSON so we always see the full set.
const pointers = import.meta.glob<AssetMeta>(
  "/src/assets/audio/*.mp3.asset.json",
  { eager: true, import: "default" },
);

// Every assignable slot the operator can wire an audio file to. Order
// matters for the dropdown.
type AssignmentSlot = { key: string; label: string };

function buildAssignmentSlots(): AssignmentSlot[] {
  const slots: AssignmentSlot[] = [];
  for (let i = 1; i <= 20; i++) {
    const id = `mission-${String(i).padStart(2, "0")}`;
    slots.push({ key: id, label: `Mission ${String(i).padStart(2, "0")}` });
  }
  slots.push({ key: "__landing__", label: "Landing" });
  slots.push({ key: "__archive__", label: "Case Archive" });
  slots.push({ key: "__analysis__", label: "Analysis" });
  return slots;
}

function buildRows(): Row[] {
  const rows: Row[] = [];
  for (const [path, meta] of Object.entries(pointers)) {
    const base = path.replace("/src/assets/audio/", "").replace(".mp3.asset.json", "");
    rows.push({
      key: base,
      displayName: displayNameFor(base),
      filename: meta.original_filename,
      url: meta.url,
      size: meta.size,
      contentType: meta.content_type,
    });
  }
  rows.sort((a, b) => a.displayName.localeCompare(b.displayName));
  return rows;
}

function slotLabel(slots: AssignmentSlot[], key: string): string {
  return slots.find((s) => s.key === key)?.label ?? key;
}

/**
 * For each assignment slot, which audio basename is effectively bound to it
 * right now (taking overrides into account). Returns null when the slot has
 * no registered audio file.
 */
function effectiveAssignment(slot: AssignmentSlot, overrides: OverrideMap): string | null {
  const override = overrides[slot.key];
  if (override) return override;
  const track = (SOUNDTRACKS as Record<string, Soundtrack | null>)[slot.key];
  if (!track?.url) return null;
  // Find the basename whose pointer URL matches.
  for (const [path, meta] of Object.entries(pointers)) {
    if (meta.url === track.url) {
      return path.replace("/src/assets/audio/", "").replace(".mp3.asset.json", "");
    }
  }
  return null;
}

function useOverrides(): OverrideMap {
  return useSyncExternalStore(subscribeOverrides, getOverrides, () => ({}));
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

type Status = "idle" | "loading" | "ready" | "playing" | "error";

function SoundStudio() {
  const rows = useMemo(buildRows, []);
  const slots = useMemo(buildAssignmentSlots, []);
  const overrides = useOverrides();

  // Map: basename -> list of slot keys currently routed to it.
  const basenameToSlots = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const slot of slots) {
      const bn = effectiveAssignment(slot, overrides);
      if (!bn) continue;
      const arr = m.get(bn) ?? [];
      arr.push(slot.key);
      m.set(bn, arr);
    }
    return m;
  }, [slots, overrides]);

  const missingSlots = slots.filter((s) => effectiveAssignment(s, overrides) === null);

  const [volume, setVolume] = useState(0.8);
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const audiosRef = useRef<Record<string, HTMLAudioElement>>({});
  const currentlyPlayingRef = useRef<string | null>(null);

  useEffect(() => {
    for (const el of Object.values(audiosRef.current)) el.volume = volume;
  }, [volume]);

  const setStatus = (key: string, s: Status) =>
    setStatuses((prev) => ({ ...prev, [key]: s }));
  const setError = (key: string, msg: string | null) =>
    setErrors((prev) => {
      const next = { ...prev };
      if (msg) next[key] = msg; else delete next[key];
      return next;
    });

  const ensureAudio = (row: Row): HTMLAudioElement => {
    let el = audiosRef.current[row.key];
    if (el) return el;
    el = new Audio();
    el.preload = "auto";
    el.volume = volume;
    el.crossOrigin = "anonymous";
    el.addEventListener("canplaythrough", () => setStatus(row.key, "ready"));
    el.addEventListener("playing", () => setStatus(row.key, "playing"));
    el.addEventListener("pause", () => {
      if (currentlyPlayingRef.current === row.key) currentlyPlayingRef.current = null;
      setStatuses((p) => ({ ...p, [row.key]: el!.ended || el!.paused ? "ready" : p[row.key] }));
    });
    el.addEventListener("ended", () => {
      currentlyPlayingRef.current = null;
      setStatus(row.key, "ready");
    });
    el.addEventListener("error", () => {
      const code = el!.error?.code;
      const map: Record<number, string> = {
        1: "MEDIA_ERR_ABORTED",
        2: "MEDIA_ERR_NETWORK",
        3: "MEDIA_ERR_DECODE",
        4: "MEDIA_ERR_SRC_NOT_SUPPORTED",
      };
      setError(row.key, code ? `${map[code] ?? code} — ${row.url}` : `Load failed — ${row.url}`);
      setStatus(row.key, "error");
    });
    el.src = row.url;
    audiosRef.current[row.key] = el;
    return el;
  };

  const stopAll = () => {
    for (const [k, el] of Object.entries(audiosRef.current)) {
      if (!el.paused) {
        el.pause();
        el.currentTime = 0;
        setStatuses((p) => ({ ...p, [k]: "ready" }));
      }
    }
    currentlyPlayingRef.current = null;
  };

  const toggle = async (row: Row) => {
    const el = ensureAudio(row);
    if (!el.paused) {
      el.pause();
      el.currentTime = 0;
      currentlyPlayingRef.current = null;
      setStatus(row.key, "ready");
      return;
    }
    if (currentlyPlayingRef.current && currentlyPlayingRef.current !== row.key) {
      const other = audiosRef.current[currentlyPlayingRef.current];
      if (other) { other.pause(); other.currentTime = 0; }
      setStatuses((p) => ({ ...p, [currentlyPlayingRef.current as string]: "ready" }));
    }
    setError(row.key, null);
    setStatus(row.key, "loading");
    try {
      await el.play();
      currentlyPlayingRef.current = row.key;
    } catch (e) {
      setError(row.key, (e as Error).message ?? String(e));
      setStatus(row.key, "error");
    }
  };

  // Eagerly preload every registered audio file on mount.
  useEffect(() => {
    for (const row of rows) {
      const el = ensureAudio(row);
      setStatuses((p) => (p[row.key] ? p : { ...p, [row.key]: "loading" }));
      try { el.load(); } catch { /* noop */ }
    }
    return () => stopAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  // When an override changes, also force getSoundtrack to be consulted so
  // anyone (debug surfaces, audio engine) sees the new mapping. Touching it
  // here is harmless and helps keep the displayed mapping in sync.
  useEffect(() => {
    for (const slot of slots) getSoundtrack(slot.key);
  }, [overrides, slots]);

  const total = rows.length;
  const totalBytes = rows.reduce((n, r) => n + r.size, 0);
  const failed = Object.values(statuses).filter((s) => s === "error").length;
  const overrideCount = Object.keys(overrides).length;

  const onAssign = (row: Row, slotKey: string) => {
    if (!slotKey) return;
    setOverride(slotKey, row.key);
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10 sm:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="space-y-2">
          <p className="text-[10px] tracking-[0.28em] uppercase text-foreground/50">
            Admin · temporary
          </p>
          <h1 className="font-display text-3xl sm:text-4xl">Sound Studio</h1>
          <p className="text-sm text-foreground/60">
            {total} files · {formatBytes(totalBytes)} total · {failed} failed ·{" "}
            {overrideCount} override{overrideCount === 1 ? "" : "s"} active.
            Use the dropdown to reassign any file to a case or system screen —
            changes persist in this browser.
          </p>
        </header>

        <section className="flex flex-wrap items-center gap-4 rounded-md border border-foreground/15 bg-background/40 p-4">
          <label className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-foreground/70">
            Volume
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-64"
            />
            <span className="tabular-nums text-foreground/60">{Math.round(volume * 100)}%</span>
          </label>
          <button
            type="button"
            onClick={stopAll}
            className="ml-auto rounded border border-foreground/20 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-foreground/80 hover:border-foreground/50"
          >
            Stop all
          </button>
          {overrideCount > 0 && (
            <button
              type="button"
              onClick={() => clearOverrides()}
              className="rounded border border-amber-400/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-amber-200 hover:border-amber-300"
            >
              Reset overrides
            </button>
          )}
        </section>

        {missingSlots.length > 0 && (
          <section className="rounded-md border border-amber-400/30 bg-amber-400/5 p-4 text-xs text-amber-200/90">
            <div className="mb-2 tracking-[0.22em] uppercase">Slots with no audio</div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
              {missingSlots.map((m) => <li key={m.key}>{m.label}</li>)}
            </ul>
          </section>
        )}

        <section className="overflow-hidden rounded-md border border-foreground/10">
          <table className="w-full text-sm">
            <thead className="bg-foreground/[0.04] text-[10px] uppercase tracking-[0.18em] text-foreground/55">
              <tr>
                <th className="px-3 py-2 text-left font-normal">Status</th>
                <th className="px-3 py-2 text-left font-normal">Track</th>
                <th className="px-3 py-2 text-left font-normal">Assigned to</th>
                <th className="px-3 py-2 text-left font-normal">Reassign</th>
                <th className="px-3 py-2 text-right font-normal">Size</th>
                <th className="px-3 py-2 text-right font-normal">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const status = statuses[row.key] ?? "idle";
                const err = errors[row.key];
                const assignedSlotKeys = basenameToSlots.get(row.key) ?? [];
                return (
                  <tr key={row.key} className="border-t border-foreground/5 align-top">
                    <td className="px-3 py-3"><StatusPill s={status} /></td>
                    <td className="px-3 py-3">
                      <div className="text-foreground/90">{row.displayName}</div>
                      <div className="text-[11px] text-foreground/45">{row.filename}</div>
                      <code className="text-[10px] text-foreground/35 break-all">{row.url}</code>
                      {err && (
                        <div className="mt-1 rounded border border-red-400/40 bg-red-500/10 px-2 py-1 text-[11px] text-red-200">
                          {err}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-foreground/70">
                      {assignedSlotKeys.length === 0 ? (
                        <span className="italic text-foreground/40">unassigned</span>
                      ) : (
                        <ul className="space-y-0.5">
                          {assignedSlotKeys.map((k) => {
                            const isOverride = overrides[k] === row.key;
                            return (
                              <li key={k} className="flex items-center gap-2">
                                <span>{slotLabel(slots, k)}</span>
                                {isOverride && (
                                  <span className="rounded bg-amber-400/15 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.18em] text-amber-200">
                                    override
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value=""
                        onChange={(e) => {
                          onAssign(row, e.target.value);
                          e.currentTarget.value = "";
                        }}
                        className="rounded border border-foreground/20 bg-background px-2 py-1 text-xs text-foreground/80 hover:border-foreground/40"
                      >
                        <option value="">Assign to…</option>
                        {slots.map((s) => {
                          const current = effectiveAssignment(s, overrides);
                          const tag = current === row.key ? " ✓" : current ? ` (${displayNameFor(current)})` : " (empty)";
                          return (
                            <option key={s.key} value={s.key}>
                              {s.label}{tag}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td className="px-3 py-3 text-right text-foreground/60 tabular-nums whitespace-nowrap">
                      {formatBytes(row.size)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => toggle(row)}
                        className="rounded border border-foreground/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-foreground/80 hover:border-foreground/50"
                      >
                        {status === "playing" || status === "loading" ? "Stop" : "Play"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

function StatusPill({ s }: { s: Status }) {
  const map: Record<Status, { dot: string; text: string; label: string }> = {
    idle:    { dot: "bg-foreground/30",       text: "text-foreground/55", label: "idle" },
    loading: { dot: "bg-amber-400 animate-pulse", text: "text-amber-300/90", label: "loading" },
    ready:   { dot: "bg-emerald-400",         text: "text-emerald-300/90", label: "ready" },
    playing: { dot: "bg-sky-400 animate-pulse", text: "text-sky-300/90",   label: "playing" },
    error:   { dot: "bg-red-500",             text: "text-red-300",        label: "error" },
  };
  const cfg = map[s];
  return (
    <span className={`inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] ${cfg.text}`}>
      <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
