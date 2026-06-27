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
      { beat: "03:25 — The gate", consequence: "You open the spillway. Beaumont floods within the hour, buses still loading. The city's gauge stops climbing." },
      { beat: "Hour 1", consequence: "Crescent holds. Beaumont Reach is under eight feet. The nursing home got most — not all — of its residents out." },
      { beat: "Dawn", consequence: "The river crests below the city levee. It would have been close. You will never know if it would have held." },
      { beat: "Day 2", consequence: "Three Beaumont dead, all elderly. The city wakes dry and grateful and largely unaware of who paid." },
      { beat: "Month 1", consequence: "A review calls the opening 'sound under the information available.' The uncertainty you acted on is not in the record — Vogel kept it out, and you let him." },
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
      { beat: "03:25 — The wager", consequence: "You hold the gate. You bet the city on Nia's 30% to spare Beaumont." },
      { beat: "Hour 1", consequence: "The levee groans. Crescent's low wards begin sandbagging in the dark. Beaumont keeps clearing." },
      { beat: "Dawn", consequence: "The levee holds — barely, at two inches of freeboard. Beaumont is fully evacuated and dry. You exhale for the first time in hours." },
      { beat: "Day 2", consequence: "You are a hero in Beaumont and a reckless gambler in the city's editorials. Both are fair." },
      { beat: "Month 1", consequence: "A review notes you bet 400,000 people on a 30% model and won. The next duty officer is told, explicitly, not to." },
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
      { beat: "03:25 — The window", consequence: "You give Boutin until 04:30, then open. The sheriff runs the nursing home against the clock." },
      { beat: "Hour 1", consequence: "Beaumont clears almost fully. The city's gauge keeps climbing while you wait." },
      { beat: "04:30 — The gate", consequence: "You open. Beaumont floods nearly empty streets. But the eighty-minute delay let the river top a city floodwall section first." },
      { beat: "Day 2", consequence: "Crescent's east ward took water it would not have if you'd opened at 03:25. Two dead there. Beaumont: none." },
      { beat: "Month 1", consequence: "A review calls it 'an attempt to spare both that fully spared neither.' You moved the dead from one column to the other." },
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
      { beat: "03:25 — On the record", consequence: "You open now, and you log the 30% scenario, the historical pattern, and your reasoning in full. Vogel tells you to delete it. You don't." },
      { beat: "Hour 1", consequence: "Beaumont floods; the city holds. The immediate outcome is the same as a clean opening." },
      { beat: "Day 2", consequence: "Three Beaumont dead. The difference is the record: the uncertainty and the history are in it, in your hand." },
      { beat: "Week 2", consequence: "Your logbook becomes the spine of the review Vogel meant to control. He is asked questions he planned not to face." },
      { beat: "Month 1", consequence: "Vogel is quietly reassigned. You are credited and resented in equal measure for refusing the comfortable version." },
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
      { beat: "03:25 — The hand-off", consequence: "You will not be the hand on the gate. You give Vogel the console and step back." },
      { beat: "Hour 1", consequence: "Vogel opens it himself, three minutes later than you would have. Beaumont floods either way." },
      { beat: "Day 2", consequence: "Three dead in Beaumont. The decision was made; you simply were not the one who made it." },
      { beat: "Month 1", consequence: "Your refusal is noted as 'declining to act in role.' It changes nothing downstream and a great deal about you." },
      { beat: "Month 6", consequence: "You keep your conscience and lose the room — colleagues read it as leaving them to do the hard thing alone." },
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
