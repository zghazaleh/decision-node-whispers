import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ScoresSchema = z.record(z.string(), z.number());

const DecisionProfilePayload = z.object({
  scores: ScoresSchema,
  emergingPattern: z.string(),
  missionsCompleted: z.number().int().nonnegative(),
});

const ContributionSchema = z.object({
  missionId: z.string().min(1).max(64),
  at: z.number(),
  scores: ScoresSchema,
  signals: z.array(z.string()).default([]),
  notes: z.record(z.string(), z.string()).optional(),
  source: z.enum(["model", "heuristic"]).optional(),
});

const SavedMissionPayload = z.object({
  missionId: z.string().min(1).max(64),
  messages: z.array(z.any()),
  startedAt: z.number(),
  decision: z.string().optional(),
  reasoning: z.string().optional(),
  analysis: z.any().optional(),
  decidedAt: z.number().optional(),
  archetypeId: z.string().optional(),
  confidence: z.number().optional(),
});

/** Load everything the client needs to rehydrate state for the signed-in user. */
export const loadUserData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [profileRes, contribsRes, missionsRes] = await Promise.all([
      supabase
        .from("decision_profiles")
        .select("scores, emerging_pattern, missions_completed")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("mission_contributions")
        .select("mission_id, scores, signals, notes, source, at")
        .eq("user_id", userId)
        .order("at", { ascending: true }),
      supabase
        .from("saved_missions")
        .select(
          "mission_id, messages, decision, reasoning, analysis, archetype_id, confidence, started_at, decided_at",
        )
        .eq("user_id", userId),
    ]);

    if (profileRes.error) throw profileRes.error;
    if (contribsRes.error) throw contribsRes.error;
    if (missionsRes.error) throw missionsRes.error;

    return {
      profile: profileRes.data
        ? {
            scores: profileRes.data.scores as Record<string, number>,
            emergingPattern: profileRes.data.emerging_pattern,
            missionsCompleted: profileRes.data.missions_completed,
          }
        : null,
      contributions: (contribsRes.data ?? []).map((c) => ({
        missionId: c.mission_id,
        scores: c.scores as Record<string, number>,
        signals: (c.signals as string[] | null) ?? [],
        notes: (c.notes as Record<string, string> | null) ?? undefined,
        source: (c.source as "model" | "heuristic" | null) ?? undefined,
        at: new Date(c.at as string).getTime(),
      })),
      missions: (missionsRes.data ?? []).map((m) => ({
        missionId: m.mission_id,
        messages: (m.messages as unknown[]) ?? [],
        decision: m.decision ?? undefined,
        reasoning: m.reasoning ?? undefined,
        analysis: m.analysis ?? undefined,
        archetypeId: m.archetype_id ?? undefined,
        confidence: m.confidence ?? undefined,
        startedAt: new Date(m.started_at as string).getTime(),
        decidedAt: m.decided_at ? new Date(m.decided_at as string).getTime() : undefined,
      })),
    };
  });

/** Upsert the rolling decision-profile aggregate. */
export const saveDecisionProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => DecisionProfilePayload.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("decision_profiles").upsert(
      {
        user_id: context.userId,
        scores: data.scores,
        emerging_pattern: data.emergingPattern,
        missions_completed: data.missionsCompleted,
      },
      { onConflict: "user_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

/** Upsert one per-mission contribution (de-dupes on user_id + mission_id). */
export const saveMissionContribution = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ContributionSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("mission_contributions").upsert(
      {
        user_id: context.userId,
        mission_id: data.missionId,
        scores: data.scores,
        signals: data.signals,
        notes: data.notes ?? null,
        source: data.source ?? null,
        at: new Date(data.at).toISOString(),
      },
      { onConflict: "user_id,mission_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

/** Upsert a saved mission transcript / state. */
export const saveSavedMission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => SavedMissionPayload.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("saved_missions").upsert(
      {
        user_id: context.userId,
        mission_id: data.missionId,
        messages: data.messages,
        decision: data.decision ?? null,
        reasoning: data.reasoning ?? null,
        analysis: data.analysis ?? null,
        archetype_id: data.archetypeId ?? null,
        confidence: data.confidence ?? null,
        started_at: new Date(data.startedAt).toISOString(),
        decided_at: data.decidedAt ? new Date(data.decidedAt).toISOString() : null,
      },
      { onConflict: "user_id,mission_id" },
    );
    if (error) throw error;
    return { ok: true };
  });

export const deleteSavedMission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ missionId: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("saved_missions")
      .delete()
      .eq("user_id", context.userId)
      .eq("mission_id", data.missionId);
    if (error) throw error;
    return { ok: true };
  });
