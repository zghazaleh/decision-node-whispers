/**
 * Client-safe server functions for reading per-mission data that mission
 * pages need before/during play. The full mission engine (systemPrompt,
 * canon, archetype outcome timelines) lives ONLY in
 * `src/lib/missions/registry.server.ts` and MUST NOT be imported at module
 * scope here — do the dynamic import inside every handler body so nothing
 * from the registry leaks into the client bundle.
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type {
  MissionAtmosphere,
  MissionOpening,
  MissionScene,
  DecisionPreset,
} from "@/lib/missions/types";

const MissionIdInput = z.object({ missionId: z.string().min(1).max(64) });

export type MissionShell = {
  opening: MissionOpening;
  scene: MissionScene;
  atmosphere?: MissionAtmosphere;
  decisionPresets: DecisionPreset[];
  decideFreeWritePlaceholder?: string;
  archetypeLabels: Record<string, string>;
};

export const getMissionShell = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => MissionIdInput.parse(d))
  .handler(async ({ data }): Promise<MissionShell | null> => {
    const { getMissionEngine } = await import(
      "@/lib/missions/registry.server"
    );
    const engine = getMissionEngine(data.missionId);
    if (!engine) return null;
    const labels: Record<string, string> = {};
    for (const id of engine.archetypeIds) {
      const arc = engine.getArchetype(id);
      if (arc) labels[id] = arc.label;
    }
    return {
      opening: engine.opening,
      scene: engine.scene,
      atmosphere: engine.atmosphere,
      decisionPresets: engine.decisionPresets,
      decideFreeWritePlaceholder: engine.decideFreeWritePlaceholder,
      archetypeLabels: labels,
    };
  });

export type ArchetypeReveal = {
  label: string;
  timeline: Array<{ beat: string; consequence: string }>;
  secondOrder: Record<string, string>;
  tone: string;
};

const ArchetypeInput = z.object({
  missionId: z.string().min(1).max(64),
  archetypeId: z.string().min(1).max(64),
});

export const getArchetypeReveal = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ArchetypeInput.parse(d))
  .handler(async ({ data }): Promise<ArchetypeReveal | null> => {
    const { getMissionEngine } = await import(
      "@/lib/missions/registry.server"
    );
    const engine = getMissionEngine(data.missionId);
    if (!engine) return null;
    const arc = engine.getArchetype(data.archetypeId);
    if (!arc) return null;
    return {
      label: arc.label,
      timeline: arc.timeline.map((t) => ({ beat: t.beat, consequence: t.consequence })),
      secondOrder: { ...arc.secondOrder },
      tone: arc.tone,
    };
  });

export const getArchetypeLabels = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => MissionIdInput.parse(d))
  .handler(async ({ data }): Promise<Record<string, string>> => {
    const { getMissionEngine } = await import(
      "@/lib/missions/registry.server"
    );
    const engine = getMissionEngine(data.missionId);
    if (!engine) return {};
    const out: Record<string, string> = {};
    for (const id of engine.archetypeIds) {
      const arc = engine.getArchetype(id);
      if (arc) out[id] = arc.label;
    }
    return out;
  });
