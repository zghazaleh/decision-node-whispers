/**
 * Mission Seven — "Spillway" — OUTCOME MODEL.
 */

export type ArchetypeId =
  | "open_now"
  | "hold_for_dawn"
  | "timed_release"
  | "open_and_log"
  | "refuse"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    crescent: string;
    beaumont: string;
    nia: string;
    vogel: string;
    hale: string;
    record: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  open_now: {
    id: "open_now",
    label: "Open the gate now",
    matchHints: ["open it now", "open the spillway", "relieve the city", "flood the parish", "do it now", "open the gate"],
    timeline: [
      { beat: "Hour 1", consequence: "Crescent holds. Beaumont Reach is under eight feet. The nursing home got most — not all — of its residents out." },
      { beat: "Day 2", consequence: "Three Beaumont dead, all elderly. The city wakes dry and grateful and largely unaware of who paid." },
      { beat: "Year 1", consequence: "Beaumont Reach is on every future plan as the place that takes the water. The third time in living memory. The same families." },
    ],
    secondOrder: {
      crescent: "Spared, and mostly unaware of the trade that spared it.",
      beaumont: "Drowned a third time. Three dead.",
      nia: "Her 30% never enters the record.",
      vogel: "Protected, vindicated, his district dry.",
      hale: "Acted decisively on a worst case that may not have come.",
      record: "The pattern of who-pays hardens, unexamined, into policy.",
    },
    tone: "Decisive, and the same town pays again.",
  },

  hold_for_dawn: {
    id: "hold_for_dawn",
    label: "Hold for dawn",
    matchHints: ["hold the gate", "wait for dawn", "bet on the model", "give the levee a chance", "don't open yet", "thirty percent is enough"],
    timeline: [
      { beat: "Hour 1", consequence: "The levee groans. Crescent's low wards begin sandbagging in the dark. Beaumont keeps clearing." },
      { beat: "Day 2", consequence: "You are a hero in Beaumont and a reckless gambler in the city's editorials. Both are fair." },
      { beat: "Year 1", consequence: "The levee is reinforced because of how close it came. Your name is attached to the night the city nearly drowned and didn't." },
    ],
    secondOrder: {
      crescent: "Spared by inches; furious at the risk it never agreed to.",
      beaumont: "Spared entirely — the first time in memory.",
      nia: "Vindicated, and haunted by what her number nearly cost.",
      vogel: "Overruled. Never forgives it.",
      hale: "Won a bet no one should be asked to make.",
      record: "The near-miss funds the levee — and a rule against gambling like you did.",
    },
    tone: "You bet a city on a model, and the river blinked.",
  },

  timed_release: {
    id: "timed_release",
    label: "Open at 04:30",
    matchHints: ["give the sheriff time", "open at four thirty", "wait then open", "let them clear first", "split the difference", "delay the opening"],
    timeline: [
      { beat: "Hour 1", consequence: "Beaumont clears almost fully. The city's gauge keeps climbing while you wait." },
      { beat: "Day 2", consequence: "Crescent's east ward took water it would not have if you'd opened at 03:25. Two dead there. Beaumont: none." },
      { beat: "Year 1", consequence: "The timed release is studied as the humane option that cost the city the margin it did not know it needed." },
    ],
    secondOrder: {
      crescent: "Takes avoidable damage and two deaths in the east ward.",
      beaumont: "Evacuated in time. No dead.",
      nia: "Her window was real; the cost simply landed elsewhere.",
      vogel: "Furious that you negotiated with the clock.",
      hale: "Spared the parish's people by spending the city's margin.",
      record: "'Split the difference' enters the playbook as the option that halves no one's grief.",
    },
    tone: "A compromise that moved the grave, and did not empty it.",
  },

  open_and_log: {
    id: "open_and_log",
    label: "Open, and log the truth",
    matchHints: ["open but record it", "log the uncertainty", "put it on the record", "open and document", "refuse to bury it", "write it all down"],
    timeline: [
      { beat: "Hour 1", consequence: "Beaumont floods; the city holds. The immediate outcome is the same as a clean opening." },
      { beat: "Week 2", consequence: "Your logbook becomes the spine of the review Vogel meant to control. He is asked questions he planned not to face." },
      { beat: "Year 1", consequence: "Beaumont's third flood is the one that finally changes the plan — because someone wrote down that it was a choice, not an act of God." },
    ],
    secondOrder: {
      crescent: "Spared, exactly as in a clean opening.",
      beaumont: "Drowned a third time — but on the record as a decision.",
      nia: "Her number survives in the log.",
      vogel: "Exposed by the thing he told you to delete.",
      hale: "Did the deed and refused the cover.",
      record: "The honest record is what finally moves the policy.",
    },
    tone: "You did the hard thing, and refused to let it be remembered as no choice at all.",
  },

  refuse: {
    id: "refuse",
    label: "Refuse the switch",
    matchHints: ["I won't do it", "hand it to Vogel", "let him open it", "not my hand on the gate", "step back", "refuse to open it"],
    timeline: [
      { beat: "Hour 1", consequence: "Vogel opens it himself, three minutes later than you would have. Beaumont floods either way." },
      { beat: "Month 1", consequence: "Your refusal is noted as 'declining to act in role.' It changes nothing downstream and a great deal about you." },
      { beat: "Year 1", consequence: "The gate opened, the parish flooded, the city was spared, and your hands were clean of all of it." },
    ],
    secondOrder: {
      crescent: "Spared — by Vogel's hand instead of yours.",
      beaumont: "Drowned the same. Three dead.",
      nia: "Her number ignored, by someone else now.",
      vogel: "Makes the call, owns it, moves on.",
      hale: "Clean-handed, sidelined, changed.",
      record: "An abdication that altered nothing but the name on the log.",
    },
    tone: "You kept your hands clean of a thing that happened anyway.",
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
