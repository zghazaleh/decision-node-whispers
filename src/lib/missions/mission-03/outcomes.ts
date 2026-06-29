/**
 * Mission Three — "Lazarus" — OUTCOME MODEL.
 */

export type ArchetypeId =
  | "trust_autopilot"
  | "manual_override"
  | "extend_orbit"
  | "announce_now"
  | "withhold_until_safe"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    crew: string;
    capsule: string;
    agency: string;
    family: string;
    yuki: string;
    program: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  trust_autopilot: {
    id: "trust_autopilot",
    label: "Trust the autopilot",
    matchHints: [
      "let the autopilot fly",
      "no manual override",
      "trust the system",
      "primary profile",
      "don't intervene",
      "fully automated reentry",
    ],
    timeline: [
      { beat: "08:12 — Interface", consequence: "Heat shield bites the atmosphere. Comms blackout for four minutes. The room does not breathe." },
      { beat: "08:34 — Splashdown", consequence: "Soft. On target. Recovery is on the capsule in eleven minutes. Sandberg's hand finds your shoulder." },
      { beat: "Year 1", consequence: "The autopilot is recertified as the new baseline. Manual reentry by qualified crew remains procedurally available; the bar to use it is now higher." },
    ],
    secondOrder: {
      crew: "All three return alive and well. Marcus takes the decision personally for a few months; eventually does not.",
      capsule: "Lands within 1.4 km of the recovery target. The vehicle is reusable.",
      agency: "Vindicated. The story is grief and competence in roughly equal measure.",
      family: "Maria Vega releases a short statement that thanks you by name.",
      yuki: "Sleeps for fourteen hours. Wakes up to a thousand emails. Does not open most of them.",
      program: "Lazarus becomes the template for the next four return missions.",
    },
    tone: "Quiet, deeply tired, slightly grateful. The decision of someone who chose to let the machine do its job.",
  },

  manual_override: {
    id: "manual_override",
    label: "Authorize manual override (Marcus flies)",
    matchHints: [
      "give Marcus the stick",
      "manual override",
      "let Marcus fly it",
      "trust the pilot",
      "authorize manual",
      "human in the loop",
    ],
    timeline: [
      { beat: "08:12 — Interface", consequence: "Marcus flies a slightly hotter profile than the autopilot would have. Heat shield holds. Comms blackout. Four minutes." },
      { beat: "08:35 — Splashdown", consequence: "On target, 600 meters from the recovery vessel. Marcus's voice on the loop says only, 'For Tomás.' The room exhales." },
      { beat: "Year 1", consequence: "Manual reentry retains its place in the procedure book. A small culture war within the program — autopilot purists vs. human-in-the-loop — continues for two years and resolves in compromise." },
    ],
    secondOrder: {
      crew: "All return alive. Marcus's grief has a thing to carry it.",
      capsule: "Lands closer to recovery than the autopilot baseline. Engineering judgment is mixed on whether that was meaningful.",
      agency: "Story becomes 'crew brings their pilot home.' Coverage is enormous.",
      family: "Maria Vega calls Marcus that evening. They speak for an hour.",
      yuki: "Knows the override was not technically required. Decides it was correct anyway. Does not say that to engineering.",
      program: "Becomes more permissive of manual intervention. A future incident will, indirectly, be made worse by this.",
    },
    tone: "Bone-tired and slightly defiant. A decision that honored a person before it solved a problem.",
  },

  extend_orbit: {
    id: "extend_orbit",
    label: "Extend one orbit before reentry",
    matchHints: [
      "one more orbit",
      "extend the orbit",
      "wave off",
      "more time on the problem",
      "delay the burn",
      "abort pacific",
    ],
    timeline: [
      { beat: "08:00 — Reorientation", consequence: "Engineering and flight surgery run a joint review. Nothing new is found. Marcus stays on the stick standby. Priya monitors crew load." },
      { beat: "09:38 — Splashdown", consequence: "Soft but rough. Recovery is on the capsule in 19 minutes; the swell delays vessel arrival." },
      { beat: "Year 1", consequence: "Internal review finds the extra orbit cost nothing technical and bought no new safety margin. The procedure for 'extend on doubt' is rewritten with a tighter threshold." },
    ],
    secondOrder: {
      crew: "All return alive. Slight extra fatigue, no clinical issue.",
      capsule: "Lands well, in worse water. Recovery is delayed by 30 minutes.",
      agency: "Story is more complicated, slightly less generous. Sandberg defends the call publicly without enthusiasm.",
      family: "Maria Vega is not consulted on the delay. Does not hold it against you.",
      yuki: "Pays the cost of buying time you did not need. Sleeps for ten hours. The next mission's flight director uses the case as a cautionary example, kindly.",
      program: "Procedural threshold for waving off a primary reentry tightens. The freedom you used is somewhat narrowed for the next director.",
    },
    tone: "Steady and slightly stiff. A decision for which the cost was small and the lesson was real.",
  },

  announce_now: {
    id: "announce_now",
    label: "Announce Vega's death now",
    matchHints: [
      "announce the death",
      "tell the press now",
      "go public before reentry",
      "release the statement",
      "be honest about Tomás",
      "no surprise after splashdown",
    ],
    timeline: [
      { beat: "06:00 — Media at the gates", consequence: "Coverage is enormous and grief-shaped. Some outlets question whether crew should be flying any reentry profile after such a loss. The agency holds its line." },
      { beat: "08:34 — Splashdown", consequence: "Soft. On target. Crew steps out into a kind of public mourning that is hard to describe to anyone who was not in it." },
      { beat: "Year 1", consequence: "Transparency under uncertainty becomes part of agency doctrine. A future director will quote you on it without knowing they are quoting you." },
    ],
    secondOrder: {
      crew: "Lands to a world that already knows. The first hour after splashdown is harder than it would have been; the years are easier.",
      capsule: "Performs nominally on the primary profile.",
      agency: "Briefly loses control of the narrative; ends with more credibility than it began.",
      family: "Maria Vega is on the inside of the news, not the outside.",
      yuki: "Pays in the short term in coverage volume. Gains in the long term in a profession that increasingly distrusts late disclosure.",
      program: "Sets a precedent that survives the next administration. The first time it is invoked again is a different story.",
    },
    tone: "Open and exposed. The decision of someone who chose honesty over choreography.",
  },

  withhold_until_safe: {
    id: "withhold_until_safe",
    label: "Withhold news until after splashdown",
    matchHints: [
      "wait to announce",
      "after splashdown",
      "no public release yet",
      "hold the statement",
      "manage the timing",
      "let them land first",
    ],
    timeline: [
      { beat: "08:12 — Interface", consequence: "Comms blackout. The press watches a nominal-looking reentry." },
      { beat: "10:45 — The release", consequence: "The world learns of Vega's death after the rest of the crew is safe. Coverage is grateful and angry in roughly equal parts." },
      { beat: "Year 1", consequence: "Late-disclosure doctrine is quietly disavowed. Your name is associated with both the safe landing and the timing decision, in that order, for years." },
    ],
    secondOrder: {
      crew: "Lands without the world's grief on top of them. Marcus thanks you privately for that.",
      capsule: "Performs nominally.",
      agency: "Splits internally. Some think you protected the mission; some think you mortgaged its credibility.",
      family: "Maria Vega says nothing publicly. Privately, she stops returning your calls for a year.",
      yuki: "Becomes the person the next disclosure question is asked of. Almost always answers it differently than this time.",
      program: "Develops a written timing policy that would forbid this decision today.",
    },
    tone: "Practical and slightly haunted. A decision whose cost arrived in installments.",
  },
};

export const ARCHETYPE_IDS = Object.keys(ARCHETYPES) as Array<Exclude<ArchetypeId, "unclassified">>;

export function getArchetype(id: ArchetypeId): Archetype | null {
  if (id === "unclassified") return null;
  return ARCHETYPES[id] ?? null;
}

export function archetypeMenuForClassifier(): string {
  return ARCHETYPE_IDS.map(
    (id) =>
      `- ${id}: ${ARCHETYPES[id].label}. Player phrases like: ${ARCHETYPES[id].matchHints
        .slice(0, 4)
        .map((h) => `"${h}"`)
        .join(", ")}.`,
  ).join("\n");
}
