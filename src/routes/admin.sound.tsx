// Sound Studio — creative tool for managing experience audio.

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useServerFn } from "@tanstack/react-start";
import { SOUNDTRACKS, getSoundtrack, type Soundtrack } from "@/lib/soundtracks";
import { displayNameFor } from "@/lib/audio/displayNames";
import {
  getOverrides,
  setOverride,
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
      { title: "Sound Studio" },
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

type Sound = {
  key: string;                  // basename, or `draft:<name>`
  kind: "asset" | "draft";
  displayName: string;
  url: string;
  assignmentValue: string;      // basename or data: URL
  draftName?: string;
};

const pointers = import.meta.glob<AssetMeta>(
  "/src/assets/audio/*.mp3.asset.json",
  { eager: true, import: "default" },
);

type Experience = { key: string; label: string };

function buildExperiences(): Experience[] {
  const list: Experience[] = [
    { key: "__landing__", label: "Landing" },
    { key: "__archive__", label: "Case Archive" },
    { key: "__analysis__", label: "Analysis" },
  ];
  for (let i = 1; i <= 20; i++) {
    const id = `mission-${String(i).padStart(2, "0")}`;
    list.push({ key: id, label: `Mission ${String(i).padStart(2, "0")}` });
  }
  return list;
}

function buildSounds(drafts: Draft[]): Sound[] {
  const sounds: Sound[] = [];
  for (const [path, meta] of Object.entries(pointers)) {
    const base = path.replace("/src/assets/audio/", "").replace(".mp3.asset.json", "");
    sounds.push({
      key: base,
      kind: "asset",
      displayName: displayNameFor(base),
      url: meta.url,
      assignmentValue: base,
    });
  }
  for (const d of drafts) {
    sounds.push({
      key: `draft:${d.name}`,
      kind: "draft",
      displayName: d.label,
      url: d.dataUrl,
      assignmentValue: d.dataUrl,
      draftName: d.name,
    });
  }
  sounds.sort((a, b) => a.displayName.localeCompare(b.displayName));
  return sounds;
}

function effectiveAssignment(expKey: string, overrides: OverrideMap): string | null {
  const override = overrides[expKey];
  if (override) return override;
  const track = (SOUNDTRACKS as Record<string, Soundtrack | null>)[expKey];
  if (!track?.url) return null;
  for (const [path, meta] of Object.entries(pointers)) {
    if (meta.url === track.url) {
      return path.replace("/src/assets/audio/", "").replace(".mp3.asset.json", "");
    }
  }
  return null;
}

const EMPTY_OVERRIDES: OverrideMap = Object.freeze({}) as OverrideMap;
const EMPTY_DRAFTS: Draft[] = Object.freeze([]) as unknown as Draft[];
const getServerOverrides = () => EMPTY_OVERRIDES;
const getServerDrafts = () => EMPTY_DRAFTS;

function useOverrides(): OverrideMap {
  return useSyncExternalStore(subscribeOverrides, getOverrides, getServerOverrides);
}
function useDrafts(): Draft[] {
  return useSyncExternalStore(subscribeOverrides, getDrafts, getServerDrafts);
}

const TOKEN_KEY = "dn-admin-token";

function SoundStudio() {
  // Admin token gate — mirrors the /admin/evaluation and /admin/gsc pattern
  // so the paid ElevenLabs endpoint isn't reachable without the token.
  const [tokenInput, setTokenInput] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [tokenError, setTokenError] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = sessionStorage.getItem(TOKEN_KEY) ?? "";
    if (stored) {
      setAdminToken(stored);
      setTokenInput(stored);
    }
  }, []);

  const drafts = useDrafts();
  const overrides = useOverrides();
  const sounds = useMemo(() => buildSounds(drafts), [drafts]);
  const experiences = useMemo(buildExperiences, []);

  const soundByValue = useMemo(() => {
    const m = new Map<string, Sound>();
    for (const s of sounds) m.set(s.assignmentValue, s);
    return m;
  }, [sounds]);

  // ----- single shared audio player -----
  const [volume, setVolume] = useState(0.8);
  const [playingKey, setPlayingKey] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Keep effects in sync when overrides change so audio engine sees mapping.
  useEffect(() => {
    for (const exp of experiences) getSoundtrack(exp.key);
  }, [overrides, experiences]);

  const play = async (key: string, url: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.addEventListener("ended", () => setPlayingKey(null));
    }
    const el = audioRef.current;
    if (playingKey === key) {
      el.pause();
      el.currentTime = 0;
      setPlayingKey(null);
      return;
    }
    el.pause();
    el.src = url;
    try {
      await el.play();
      setPlayingKey(key);
    } catch {
      setPlayingKey(null);
    }
  };

  // ----- Generate -----
  const generate = useServerFn(generateAmbientBed);
  const [prompt, setPrompt] = useState("");
  const [draftLabel, setDraftLabel] = useState("");
  const [duration, setDuration] = useState(12);
  const [genStatus, setGenStatus] = useState<"idle" | "generating" | "ready" | "error">("idle");
  const [genError, setGenError] = useState<string | null>(null);
  const [genPreview, setGenPreview] = useState<{ dataUrl: string; size: number } | null>(null);

  const doGenerate = async () => {
    if (!adminToken) {
      setGenError("Enter an admin token first.");
      setGenStatus("error");
      return;
    }
    if (prompt.trim().length < 3) {
      setGenError("Describe the sound in a few words first.");
      setGenStatus("error");
      return;
    }
    setGenError(null);
    setGenStatus("generating");
    setGenPreview(null);
    try {
      const result = await generate({
        data: { token: adminToken, prompt: prompt.trim(), durationSeconds: duration },
      });
      const dataUrl = `data:${result.mimeType};base64,${result.base64}`;
      setGenPreview({ dataUrl, size: result.size });
      setGenStatus("ready");
    } catch (e) {
      const msg = (e as Error).message ?? String(e);
      if (msg.includes("401") || msg.toLowerCase().includes("unauthorized")) {
        setTokenError("Invalid admin token.");
        setAdminToken("");
        if (typeof window !== "undefined") sessionStorage.removeItem(TOKEN_KEY);
      }
      setGenError(msg);
      setGenStatus("error");
    }
  };

  function submitToken(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window !== "undefined" && tokenInput) {
      sessionStorage.setItem(TOKEN_KEY, tokenInput);
    }
    setAdminToken(tokenInput);
    setTokenError(null);
  }

  if (!adminToken) {
    return (
      <div className="min-h-screen bg-background text-foreground px-6 py-12">
        <div className="max-w-md mx-auto">
          <p className="text-[0.6rem] tracking-[0.5em] uppercase text-accent/80 mb-2">Admin</p>
          <h1 className="font-display text-3xl mb-2">Sound Studio</h1>
          <p className="text-sm text-foreground/60 mb-8">
            Locked. Enter your admin token to generate paid ElevenLabs beds.
          </p>
          <form onSubmit={submitToken} className="flex gap-3 items-end">
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ADMIN_EVAL_TOKEN"
              autoFocus
              className="flex-1 bg-transparent border border-foreground/20 px-3 py-2 text-sm focus:border-foreground/60 outline-none"
            />
            <button
              type="submit"
              disabled={!tokenInput}
              className="border border-foreground/40 px-4 py-2 text-xs tracking-[0.3em] uppercase hover:bg-foreground/5 disabled:opacity-40"
            >
              Unlock
            </button>
          </form>
          {tokenError && (
            <p className="mt-4 text-sm text-destructive">{tokenError}</p>
          )}
        </div>
      </div>
    );
  }

  const slugify = (s: string) =>
    s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);

  const saveGenerated = (): string | null => {
    if (!genPreview) return null;
    const baseSlug = slugify(draftLabel || prompt) || `draft-${Date.now()}`;
    const existing = new Set(getDrafts().map((d) => d.name));
    let name = baseSlug;
    let i = 2;
    while (existing.has(name)) name = `${baseSlug}-${i++}`;
    saveDraft({
      name,
      label: draftLabel.trim() || prompt.trim().slice(0, 60),
      prompt: prompt.trim(),
      durationSeconds: duration,
      dataUrl: genPreview.dataUrl,
      size: genPreview.size,
      createdAt: new Date().toISOString(),
    });
    return genPreview.dataUrl;
  };

  const resetGenerator = () => {
    setGenPreview(null);
    setGenStatus("idle");
    setPrompt("");
    setDraftLabel("");
  };

  const assignGeneratedTo = (expKey: string) => {
    if (!genPreview || !expKey) return;
    const value = saveGenerated() ?? genPreview.dataUrl;
    setOverride(expKey, value);
    resetGenerator();
  };

  const justSave = () => {
    if (saveGenerated()) resetGenerator();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10 space-y-12">

        {/* Header */}
        <header className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-foreground/55 hover:text-foreground/90"
          >
            ← Back to Decision Nodes
          </Link>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display text-3xl sm:text-4xl">Sound Studio</h1>
            <label className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-foreground/55">
              Volume
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-48 accent-foreground/80"
              />
              <span className="tabular-nums text-foreground/70 w-8 text-right">
                {Math.round(volume * 100)}
              </span>
            </label>
          </div>
        </header>

        {/* Generate */}
        <section className="space-y-4 rounded-lg border border-foreground/15 bg-foreground/[0.02] p-6">
          <div>
            <h2 className="font-display text-xl">Generate new sound</h2>
            <p className="mt-1 text-sm text-foreground/55">
              Describe a mood or scene. We'll create an ambient bed you can preview and assign.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_120px_auto]">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Frozen checkpoint, wind, diesel engine idle, quiet dread…"
              className="rounded border border-foreground/20 bg-background px-3 py-2.5 text-sm text-foreground/90 placeholder:text-foreground/35 focus:border-foreground/50 focus:outline-none"
            />
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="rounded border border-foreground/20 bg-background px-3 py-2.5 text-sm text-foreground/85"
            >
              {[5, 8, 12, 16, 20, 22].map((d) => (
                <option key={d} value={d}>{d} seconds</option>
              ))}
            </select>
            <button
              type="button"
              onClick={doGenerate}
              disabled={genStatus === "generating"}
              className="rounded bg-foreground px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-background hover:bg-foreground/85 disabled:opacity-50"
            >
              {genStatus === "generating" ? "Generating…" : "Generate"}
            </button>
          </div>

          {genError && (
            <div className="rounded border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
              {genError}
            </div>
          )}

          {genPreview && (
            <div className="space-y-3 rounded border border-foreground/15 bg-background/60 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => play("__gen__", genPreview.dataUrl)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/30 text-foreground/85 hover:border-foreground/60"
                  aria-label="Preview"
                >
                  {playingKey === "__gen__" ? "■" : "▶"}
                </button>
                <span className="text-sm text-foreground/75">Preview ready</span>
              </div>
              <input
                type="text"
                value={draftLabel}
                onChange={(e) => setDraftLabel(e.target.value)}
                placeholder="Name this sound (optional)"
                className="w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground/85 placeholder:text-foreground/35"
              />
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value=""
                  onChange={(e) => {
                    assignGeneratedTo(e.target.value);
                    e.currentTarget.value = "";
                  }}
                  className="flex-1 min-w-[200px] rounded border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground/85"
                >
                  <option value="">Assign to experience…</option>
                  {experiences.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={justSave}
                  className="rounded border border-foreground/25 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-foreground/80 hover:border-foreground/50"
                >
                  Save to library
                </button>
                <button
                  type="button"
                  onClick={resetGenerator}
                  className="rounded px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-foreground/45 hover:text-foreground/80"
                >
                  Discard
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Experiences */}
        <section className="space-y-4">
          <h2 className="font-display text-xl">Experiences</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {experiences.map((exp) => {
              const assigned = effectiveAssignment(exp.key, overrides);
              const sound = assigned ? soundByValue.get(assigned) : null;
              const soundName = sound?.displayName
                ?? (assigned?.startsWith("data:") ? "Custom draft" : "—");
              const playKey = `exp:${exp.key}`;
              const url = sound?.url ?? (assigned?.startsWith("data:") ? assigned : null);
              return (
                <ExperienceCard
                  key={exp.key}
                  exp={exp}
                  soundName={soundName}
                  url={url}
                  playing={playingKey === playKey}
                  onPlay={() => url && play(playKey, url)}
                  sounds={sounds}
                  currentValue={assigned}
                  onChange={(value) => setOverride(exp.key, value)}
                />
              );
            })}
          </div>
        </section>

        {/* Library */}
        <section className="space-y-4">
          <h2 className="font-display text-xl">Sound library</h2>
          <p className="text-sm text-foreground/55">
            {sounds.length} sound{sounds.length === 1 ? "" : "s"} available.
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {sounds.map((s) => {
              const playKey = `lib:${s.key}`;
              return (
                <div
                  key={s.key}
                  className="flex items-center gap-3 rounded border border-foreground/10 bg-foreground/[0.02] px-3 py-2.5"
                >
                  <button
                    type="button"
                    onClick={() => play(playKey, s.url)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-foreground/25 text-foreground/80 hover:border-foreground/60"
                    aria-label={playingKey === playKey ? "Stop" : "Play"}
                  >
                    {playingKey === playKey ? "■" : "▶"}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-foreground/85">{s.displayName}</div>
                    {s.kind === "draft" && (
                      <div className="text-[10px] uppercase tracking-[0.18em] text-sky-300/80">
                        draft
                      </div>
                    )}
                  </div>
                  {s.kind === "draft" && s.draftName && (
                    <button
                      type="button"
                      onClick={() => deleteDraft(s.draftName!)}
                      className="text-[10px] uppercase tracking-[0.18em] text-foreground/35 hover:text-red-300"
                      aria-label="Delete"
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function ExperienceCard({
  exp,
  soundName,
  url,
  playing,
  onPlay,
  sounds,
  currentValue,
  onChange,
}: {
  exp: Experience;
  soundName: string;
  url: string | null;
  playing: boolean;
  onPlay: () => void;
  sounds: Sound[];
  currentValue: string | null;
  onChange: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-4">
      <div className="text-[10px] uppercase tracking-[0.22em] text-foreground/45">
        {exp.label}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={onPlay}
          disabled={!url}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/25 text-foreground/80 hover:border-foreground/60 disabled:opacity-30"
          aria-label={playing ? "Stop" : "Play"}
        >
          {playing ? "■" : "▶"}
        </button>
        <div className="min-w-0 flex-1 truncate text-sm text-foreground/90">
          {soundName}
        </div>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="rounded border border-foreground/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground/70 hover:border-foreground/50"
        >
          {editing ? "Close" : "Change"}
        </button>
      </div>
      {editing && (
        <select
          value={currentValue ?? ""}
          onChange={(e) => {
            onChange(e.target.value);
            setEditing(false);
          }}
          className="mt-3 w-full rounded border border-foreground/20 bg-background px-3 py-2 text-sm text-foreground/85"
        >
          <option value="" disabled>Choose a sound…</option>
          {sounds.map((s) => (
            <option key={s.key} value={s.assignmentValue}>
              {s.displayName}{s.kind === "draft" ? " (draft)" : ""}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
