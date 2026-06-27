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

export type MissionEngine = {
  id: string;
  /** Full system prompt used by the narrative chat for this mission. */
  systemPrompt: string;
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
