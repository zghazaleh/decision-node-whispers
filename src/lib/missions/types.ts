/**
 * Shared types for the mission engine. Each mission ships a module that
 * conforms to MissionEngine; the registry looks them up by id.
 */

export type ArchetypeBeat = { beat: string; consequence: string };

export type Archetype = {
  id: string;
  label: string;
  matchHints: string[];
  timeline: ArchetypeBeat[];
  secondOrder: Record<string, string>;
  tone: string;
};

export type DecisionPreset = {
  label: string;
  text: string;
  archetypeId: string;
};

export type MissionCanon = Record<string, unknown>;

export type MissionOpening = {
  /** Canonical first assistant message for this mission, in the same format
   * the chat narrative uses (italic character labels, chips on last line). */
  text: string;
};

export type MissionScene = {
  /** Imported image URL used as the cinematic background for this mission. */
  src: string;
  /** Optional CSS filter applied to the image (saturation / contrast / hue tint). */
  filter?: string;
  /** Optional semantic mood label — useful for debugging / future variants. */
  mood?: string;
};

/**
 * Per-mission tuning for the shared scene effects + ambient audio bed.
 * Every field is optional; sensible defaults live in mission.$id.tsx and ambient.ts.
 * Values are applied on top of the shared layers so missions feel distinct
 * without forking the rendering code.
 */
export type MissionAtmosphere = {
  /** CSS background for the .scene-haze layer (radial-gradients, low alpha). */
  hazeBackground?: string;
  /** CSS background for the .scene-pulse sweep (linear-gradient). */
  pulseBackground?: string;
  /** Seconds between pulse sweeps. Default 22. */
  pulseDuration?: number;
  /** Ken-Burns loop duration in seconds. Default 38. */
  kenBurnsDuration?: number;
  /** Multiplier on the scene-dust layer opacity (0..1.5). Default 1. */
  dustOpacityScale?: number;
  /** Chromatic-breathe loop duration in seconds. Default 18. */
  chromaBreatheDuration?: number;

  // ── Audio bed ────────────────────────────────────────────────────────
  /** Sub-pad fundamental in Hz. Default 55. */
  padFrequency?: number;
  /** Low-pass cutoff centre in Hz. Default 1600. */
  filterBaseHz?: number;
  /** LFO modulation depth in Hz. Default 280. Keep gentle — high depth pumps. */
  filterLfoDepthHz?: number;
  /** LFO rate in Hz. Default 0.05 (20s period). */
  lfoRateHz?: number;

};





export type MissionEngine = {
  id: string;
  /** Full system prompt used by the narrative chat for this mission. */
  systemPrompt: string;
  /** Canonical opening message rendered as the first assistant turn. */
  opening: MissionOpening;
  /** Cinematic background scene shown behind the dialogue. */
  scene: MissionScene;
  /** Optional per-mission tuning of the shared scene FX + audio bed. */
  atmosphere?: MissionAtmosphere;


  /** All archetypes for this mission, keyed by id. */
  archetypes: Record<string, Archetype>;
  /** Stable list of archetype ids (excluding the "unclassified" fallback). */
  archetypeIds: string[];
  /** Menu string handed to the Stage A classifier LLM. */
  archetypeMenuForClassifier: () => string;
  /** Look up an archetype by id, or null. */
  getArchetype: (id: string) => Archetype | null;
  /** Preset stances surfaced in the Decide modal. */
  decisionPresets: DecisionPreset[];
  /** Deterministic ground-truth facts for this mission. Shape is mission-specific. */
  canon: MissionCanon;
};
