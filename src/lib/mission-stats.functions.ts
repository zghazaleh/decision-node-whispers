import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

function publicClient() {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
}

export type MissionStats = {
  plays: number;
  completionRate: number | null; // 0..1
  avgDecisionSeconds: number | null;
  avgInvestigationSeconds: number | null;
  difficultyRating: number | null; // 1..5
  // Percentile your investigation time falls in, only set for individual lookups
  yourInvestigationPercentile?: number;
};

const PerMissionStats = z.record(
  z.object({
    plays: z.number(),
    completionRate: z.number().nullable(),
    avgDecisionSeconds: z.number().nullable(),
    avgInvestigationSeconds: z.number().nullable(),
    difficultyRating: z.number().nullable(),
  }),
);

export const getAllMissionStats = createServerFn({ method: "GET" }).handler(
  async (): Promise<z.infer<typeof PerMissionStats>> => {
    const supabase = publicClient();
    const { data, error } = await supabase
      .from("mission_plays")
      .select("mission_id, decision_seconds, investigation_seconds, difficulty_rating, completed");

    if (error) return {};

    const grouped = new Map<
      string,
      { rows: typeof data; }
    >();
    for (const row of data ?? []) {
      const arr = grouped.get(row.mission_id) ?? { rows: [] };
      arr.rows.push(row);
      grouped.set(row.mission_id, arr);
    }

    const out: Record<string, MissionStats> = {};
    for (const [mid, { rows }] of grouped) {
      const completed = rows.filter((r) => r.completed);
      const decisions = completed
        .map((r) => r.decision_seconds)
        .filter((v): v is number => typeof v === "number");
      const investigations = completed
        .map((r) => r.investigation_seconds)
        .filter((v): v is number => typeof v === "number");
      const ratings = rows
        .map((r) => r.difficulty_rating)
        .filter((v): v is number => typeof v === "number");
      out[mid] = {
        plays: rows.length,
        completionRate: rows.length ? completed.length / rows.length : null,
        avgDecisionSeconds: decisions.length
          ? Math.round(decisions.reduce((a, b) => a + b, 0) / decisions.length)
          : null,
        avgInvestigationSeconds: investigations.length
          ? Math.round(investigations.reduce((a, b) => a + b, 0) / investigations.length)
          : null,
        difficultyRating: ratings.length
          ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
          : null,
      };
    }
    return out;
  },
);

const RecordInput = z.object({
  missionId: z.string().min(3).max(64),
  decisionSeconds: z.number().int().min(0).max(86400).optional(),
  investigationSeconds: z.number().int().min(0).max(86400).optional(),
  messageCount: z.number().int().min(0).max(500).optional(),
  difficultyRating: z.number().int().min(1).max(5).optional(),
  archetypeId: z.string().min(1).max(64).optional(),
  completed: z.boolean().default(true),
});

export const recordMissionPlay = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RecordInput.parse(input))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { error } = await supabase.from("mission_plays").insert({
      mission_id: data.missionId,
      decision_seconds: data.decisionSeconds ?? null,
      investigation_seconds: data.investigationSeconds ?? null,
      message_count: data.messageCount ?? null,
      difficulty_rating: data.difficultyRating ?? null,
      archetype_id: data.archetypeId ?? null,
      completed: data.completed,
    });
    if (error) return { ok: false as const, error: error.message };
    return { ok: true as const };
  });

const BreakdownInput = z.object({
  missionId: z.string().min(3).max(64),
});

export type ArchetypeBreakdown = {
  totalPlays: number;
  counts: Array<{ archetypeId: string; count: number; percent: number }>;
};

export const getMissionArchetypeBreakdown = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => BreakdownInput.parse(input))
  .handler(async ({ data }): Promise<ArchetypeBreakdown> => {
    const supabase = publicClient();
    const { data: rows, error } = await supabase
      .from("mission_plays")
      .select("archetype_id, completed")
      .eq("mission_id", data.missionId);

    if (error || !rows) return { totalPlays: 0, counts: [] };

    const tally = new Map<string, number>();
    for (const row of rows) {
      if (!row.completed) continue;
      const id = row.archetype_id;
      if (!id) continue;
      tally.set(id, (tally.get(id) ?? 0) + 1);
    }
    const total = Array.from(tally.values()).reduce((a, b) => a + b, 0);
    const counts = Array.from(tally.entries())
      .map(([archetypeId, count]) => ({
        archetypeId,
        count,
        percent: total ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return { totalPlays: total, counts };
  });

const PercentileInput = z.object({
  missionId: z.string().min(3).max(64),
  investigationSeconds: z.number().int().min(0).max(86400),
  decisionSeconds: z.number().int().min(0).max(86400).optional(),
});

export type MissionPercentile = {
  plays: number;
  investigationPercentile: number | null; // 0..100, "you investigated longer than X% of players"
  decisionPercentile: number | null;
  avgInvestigationSeconds: number | null;
  avgDecisionSeconds: number | null;
};

export const getMissionPercentile = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PercentileInput.parse(input))
  .handler(async ({ data }): Promise<MissionPercentile> => {
    const supabase = publicClient();
    const { data: rows, error } = await supabase
      .from("mission_plays")
      .select("investigation_seconds, decision_seconds, completed")
      .eq("mission_id", data.missionId);

    if (error || !rows || rows.length === 0) {
      return {
        plays: 0,
        investigationPercentile: null,
        decisionPercentile: null,
        avgInvestigationSeconds: null,
        avgDecisionSeconds: null,
      };
    }

    const inv = rows
      .map((r) => r.investigation_seconds)
      .filter((v): v is number => typeof v === "number");
    const dec = rows
      .map((r) => r.decision_seconds)
      .filter((v): v is number => typeof v === "number");

    const percentile = (arr: number[], v: number) => {
      if (arr.length === 0) return null;
      const below = arr.filter((x) => x < v).length;
      return Math.round((below / arr.length) * 100);
    };

    return {
      plays: rows.length,
      investigationPercentile: percentile(inv, data.investigationSeconds),
      decisionPercentile:
        typeof data.decisionSeconds === "number" ? percentile(dec, data.decisionSeconds) : null,
      avgInvestigationSeconds: inv.length
        ? Math.round(inv.reduce((a, b) => a + b, 0) / inv.length)
        : null,
      avgDecisionSeconds: dec.length
        ? Math.round(dec.reduce((a, b) => a + b, 0) / dec.length)
        : null,
    };
  });
