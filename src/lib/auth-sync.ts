import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  loadUserData,
  saveDecisionProfile,
  saveMissionContribution,
  saveSavedMission,
} from "@/lib/user-data.functions";
import {
  readProfile,
  type DecisionProfile,
  type MissionContribution,
} from "@/lib/decision-profile";
import { readMission, writeMission, type SavedMission } from "@/lib/mission-store";
import { toast } from "sonner";
import type { User } from "@supabase/supabase-js";

const PROFILE_KEY = "decision-node:profile";
const MISSION_PREFIX = "decision-node:mission:";
const SYNC_FLAG = "decision-node:synced-for";

let currentUserId: string | null = null;

export function getCurrentUserId() {
  return currentUserId;
}

/** Fire-and-forget mirror of profile writes to DB. */
export function syncProfileToDB(profile: DecisionProfile, latest?: MissionContribution) {
  if (!currentUserId) return;
  void saveDecisionProfile({
    data: {
      scores: profile.scores,
      emergingPattern: profile.emergingPattern,
      missionsCompleted: profile.missionsCompleted,
    },
  }).catch((err) => console.warn("[sync] profile", err));
  if (latest) {
    void saveMissionContribution({
      data: {
        missionId: latest.missionId,
        at: latest.at,
        scores: latest.scores,
        signals: latest.signals,
        notes: latest.notes,
        source: latest.source,
      },
    }).catch((err) => console.warn("[sync] contribution", err));
  }
}

/** Fire-and-forget mirror of mission state writes to DB. */
export function syncMissionToDB(m: SavedMission) {
  if (!currentUserId) return;
  void saveSavedMission({
    data: {
      missionId: m.missionId,
      messages: m.messages as unknown as any[],
      startedAt: m.startedAt,
      decision: m.decision,
      reasoning: m.reasoning,
      analysis: m.analysis as any,
      decidedAt: m.decidedAt,
      archetypeId: m.archetypeId,
      confidence: m.confidence,
    },
  }).catch((err) => console.warn("[sync] mission", err));
}

function listLocalMissions(): SavedMission[] {
  if (typeof window === "undefined") return [];
  const out: SavedMission[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (!k || !k.startsWith(MISSION_PREFIX)) continue;
    try {
      const raw = window.localStorage.getItem(k);
      if (raw) out.push(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }
  return out;
}

function localHasData(): boolean {
  if (typeof window === "undefined") return false;
  if (window.localStorage.getItem(PROFILE_KEY)) return true;
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(MISSION_PREFIX)) return true;
  }
  return false;
}

function applyRemote(data: Awaited<ReturnType<typeof loadUserData>>) {
  if (typeof window === "undefined") return;
  if (data.profile && (data.profile.missionsCompleted > 0 || data.contributions.length > 0)) {
    const profile: DecisionProfile = {
      version: 1,
      missionsCompleted: data.profile.missionsCompleted,
      contributions: data.contributions as MissionContribution[],
      scores: data.profile.scores as DecisionProfile["scores"],
      emergingPattern: data.profile.emergingPattern,
    };
    window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }
  for (const m of data.missions) {
    const mission: SavedMission = {
      missionId: m.missionId,
      messages: (m.messages as any) ?? [],
      startedAt: m.startedAt,
      decision: m.decision,
      reasoning: m.reasoning,
      analysis: m.analysis as any,
      decidedAt: m.decidedAt,
      archetypeId: m.archetypeId,
      confidence: m.confidence,
    };
    window.localStorage.setItem(MISSION_PREFIX + m.missionId, JSON.stringify(mission));
  }
}

async function pushLocalToDB() {
  const profile = readProfile();
  if (profile.missionsCompleted > 0 || profile.contributions.length > 0) {
    await saveDecisionProfile({
      data: {
        scores: profile.scores,
        emergingPattern: profile.emergingPattern,
        missionsCompleted: profile.missionsCompleted,
      },
    });
    for (const c of profile.contributions) {
      await saveMissionContribution({
        data: {
          missionId: c.missionId,
          at: c.at,
          scores: c.scores,
          signals: c.signals,
          notes: c.notes,
          source: c.source,
        },
      });
    }
  }
  for (const m of listLocalMissions()) {
    if (!m.missionId) continue;
    await saveSavedMission({
      data: {
        missionId: m.missionId,
        messages: m.messages as unknown as any[],
        startedAt: m.startedAt,
        decision: m.decision,
        reasoning: m.reasoning,
        analysis: m.analysis as any,
        decidedAt: m.decidedAt,
        archetypeId: m.archetypeId,
        confidence: m.confidence,
      },
    });
  }
}

function clearLocal() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PROFILE_KEY);
  const keys: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(MISSION_PREFIX)) keys.push(k);
  }
  keys.forEach((k) => window.localStorage.removeItem(k));
}

async function onSignedIn(user: User) {
  currentUserId = user.id;
  const syncedFor = window.localStorage.getItem(SYNC_FLAG);
  try {
    const remote = await loadUserData();
    const hasRemote =
      (remote.profile && remote.profile.missionsCompleted > 0) ||
      remote.contributions.length > 0 ||
      remote.missions.length > 0;
    const hasLocal = localHasData();

    // First sign-in for this account on this device, and local has progress.
    if (syncedFor !== user.id && hasLocal && !hasRemote) {
      toast("Keep your local progress?", {
        description:
          "We found a Decision Profile on this device. Upload it to your account, or start fresh?",
        duration: Infinity,
        action: {
          label: "Upload",
          onClick: async () => {
            try {
              await pushLocalToDB();
              toast.success("Profile synced to your account.");
            } catch {
              toast.error("Sync failed.");
            }
          },
        },
        cancel: {
          label: "Start fresh",
          onClick: () => {
            clearLocal();
            toast.success("Started fresh on this device.");
            // notify listeners that local was cleared
            window.dispatchEvent(new Event("decision-node:profile-changed"));
          },
        },
      });
    } else if (hasRemote) {
      applyRemote(remote);
      window.dispatchEvent(new Event("decision-node:profile-changed"));
    }
    window.localStorage.setItem(SYNC_FLAG, user.id);
  } catch (err) {
    console.warn("[auth-sync] load failed", err);
  }
}

function onSignedOut() {
  currentUserId = null;
  // Keep localStorage so anonymous play continues seamlessly.
}

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUser(data.user);
        currentUserId = data.user?.id ?? null;
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (event === "SIGNED_IN" && u) void onSignedIn(u);
      if (event === "SIGNED_OUT") onSignedOut();
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  return user;
}
