/**
 * Mission Ten — "The Checkpoint" — OUTCOME MODEL.
 *
 * Five defensible archetypes. None is the "right" answer. The outcome
 * model narrates downstream consequences in plain, unmoralized terms.
 */

export type ArchetypeId =
  | "send_younger"
  | "send_elder"
  | "refuse_choice"
  | "trade_place"
  | "smuggler_route"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    elder: string;
    younger: string;
    mira: string;
    anja: string;
    halek: string;
    column: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  send_younger: {
    id: "send_younger",
    label: "Send the younger across",
    matchHints: [
      "send Ilya",
      "the little one goes",
      "the younger crosses",
      "he can't survive the road back",
      "his cough won't hold",
      "Ilya gets the permit",
    ],
    timeline: [
      {
        beat: "The window",
        consequence:
          "You give Halek the younger's name. He marks the sheet without comment and waves the boy through to the far-side line. Tomas does not cry. He nods once as if he had already decided this for you.",
      },
      {
        beat: "Before first light",
        consequence:
          "Ilya crosses, half-asleep, into the next-line marshals who will walk him the last ten kilometres to Anja. You and Tomas turn back with the unprocessed half of the column.",
      },
      {
        beat: "Week 1",
        consequence:
          "Anja takes Ilya in. His cough breaks within four days under a real roof. You and Tomas reach a partisan-held village south of Sevirin and shelter there.",
      },
      {
        beat: "Month 1",
        consequence:
          "Anja's village is absorbed by the new militia. Ilya is moved twice — once to a school basement, once to a neighbour's cellar. He keeps. Tomas, with you, walks a great deal and speaks very little.",
      },
      {
        beat: "Year 1",
        consequence:
          "Ilya is alive and small for his age, in a third country, drawing pictures of a brother he half-remembers. Tomas is taller than you and has stopped asking when his brother is coming back.",
      },
      {
        beat: "Years later",
        consequence:
          "You sent the one who could not have walked. You kept the one who could. You are not sure that is the same as choosing.",
      },
    ],
    secondOrder: {
      elder: "Walks back with you. Carries what an eleven-year-old should not.",
      younger: "Crosses. Survives the cough. Grows up far away from the rest of you.",
      mira: "Returns into the oblast with one child and the weight of the other.",
      anja: "Receives one child. Manages the precariousness she did not name.",
      halek: "Marks a name and waves the boy through. Forgets the family by the next shift.",
      column: "Notes a mother who chose the frail one. Some agree. Some do not.",
    },
    tone: "The choice the body makes, before the mind has finished.",
  },

  send_elder: {
    id: "send_elder",
    label: "Send the elder across",
    matchHints: [
      "send Tomas",
      "the older one goes",
      "the elder crosses",
      "he can survive on his own",
      "he can work",
      "Tomas gets the permit",
    ],
    timeline: [
      {
        beat: "The window",
        consequence:
          "You give Halek the elder's name. Tomas does not look at his brother. He takes the permit between two fingers and crosses without crying — exactly as he had been preparing himself to.",
      },
      {
        beat: "Before first light",
        consequence:
          "Tomas joins the next-line marshals and is walked toward Anja. You and Ilya turn back. Ilya does not understand. He understands.",
      },
      {
        beat: "Week 1",
        consequence:
          "Tomas reaches Anja. He is quiet and useful in the orchard and will not eat until you have eaten. Ilya's cough deepens on the road back. You spend three days finding a doctor in a partisan village.",
      },
      {
        beat: "Month 1",
        consequence:
          "The doctor is good. Ilya recovers. Tomas, on the far side, has begun translating for the families Anja is sharing a roof with, and is exposed to news from the front. He stops sleeping through the night.",
      },
      {
        beat: "Year 1",
        consequence:
          "Tomas is in a third country and has become someone's older brother in spirit if not in fact. Ilya, with you, has lost the cough and gained a wariness no six-year-old should carry.",
      },
      {
        beat: "Years later",
        consequence:
          "You sent the one who could survive it. You kept the one who could not survive being kept. Both are alive. The arithmetic does not feel like an answer.",
      },
    ],
    secondOrder: {
      elder: "Crosses. Carries the weight of being the one who went.",
      younger: "Walks back with you. The cough nearly takes him. It does not.",
      mira: "Returns into the oblast with the sicker child and the steadier hope.",
      anja: "Receives the older one. Puts him to work without meaning to.",
      halek: "Marks a name and waves the boy through. Forgets the family by the next shift.",
      column: "Notes a mother who chose the strong one. Some agree. Some do not.",
    },
    tone: "The arithmetic of survival, taken plainly.",
  },

  refuse_choice: {
    id: "refuse_choice",
    label: "Refuse the choice — turn back together",
    matchHints: [
      "I won't choose",
      "we go back together",
      "all three turn back",
      "no permit at all",
      "I refuse",
      "we stay together",
    ],
    timeline: [
      {
        beat: "The window",
        consequence:
          "You tell Halek you will not name a child. He does not argue. He folds the sheets, sets them in the tray, and looks past you to the next family. The column moves around you.",
      },
      {
        beat: "Before first light",
        consequence:
          "The three of you step out of the line and back into the dark. Tomas takes Ilya's hand without being asked. Vasic the liaison watches you go and says nothing.",
      },
      {
        beat: "Week 1",
        consequence:
          "You make it back to the partisan village south of Sevirin and shelter there. Ilya's cough becomes pneumonia. There is a doctor; he does what he can.",
      },
      {
        beat: "Month 1",
        consequence:
          "Ilya dies on the seventh day of the second week. The doctor says it would have been hard to save him anywhere. You hold Tomas's hand at the burial. He does not let go for a long time.",
      },
      {
        beat: "Year 1",
        consequence:
          "You and Tomas reach the western corridor by a different route in late spring. Anja meets you at the line. None of you say the third name.",
      },
      {
        beat: "Years later",
        consequence:
          "You did not choose between your children. You also did not save them both.",
      },
    ],
    secondOrder: {
      elder: "Walks back with you. Watches his brother weaken. Keeps walking.",
      younger: "Does not survive the return. The cold and the cough together.",
      mira: "Kept the family whole on the road. Did not keep all of it alive.",
      anja: "Waits at the relay all morning. Goes home without them.",
      halek: "Folds the sheets, sets them in the tray, looks past you. The line moves.",
      column: "Notes a mother who would not choose. Some agree. Some do not.",
    },
    tone: "The refusal to do the unbearable, and what it costs.",
  },

  trade_place: {
    id: "trade_place",
    label: "Trade your own place — both children cross",
    matchHints: [
      "I stay, both go",
      "use my permit for the other one",
      "make them go without me",
      "I'll turn back alone",
      "give Halek the bribe and beg for the second",
      "two children, not me",
    ],
    timeline: [
      {
        beat: "The window",
        consequence:
          "You give Halek both names — and the bill, folded small, slid across the tray. He looks at it for the length of one breath. He marks both sheets and crosses your own name through. You will not pass tonight.",
      },
      {
        beat: "Before first light",
        consequence:
          "The boys cross. Tomas does not let go of Ilya's hand. You watch them disappear into the next-line marshals from the wrong side of the barrier. You do not cry where Halek can see.",
      },
      {
        beat: "Week 1",
        consequence:
          "The children reach Anja. She takes them both in. The room is too small. Ilya's cough begins to ease under the roof. Tomas asks every day where you are.",
      },
      {
        beat: "Month 1",
        consequence:
          "You shelter in a partisan village south of Sevirin. The front moves; the village does not fall. Anja's village is absorbed by the new militia. She moves the boys to a neighbour's cellar. Two is harder to hide than one. They keep.",
      },
      {
        beat: "Year 1",
        consequence:
          "The boys are alive together in a third country. You are alive, separately, and have not yet been able to reach them. Anja writes letters you receive in batches of four.",
      },
      {
        beat: "Years later",
        consequence:
          "You spent yourself instead of one of them. They have each other. You have the knowledge that you spent yourself.",
      },
    ],
    secondOrder: {
      elder: "Crosses. Holds his brother's hand the whole way.",
      younger: "Crosses. The cough breaks under a real roof.",
      mira: "Turns back alone. Is the price the family pays.",
      anja: "Receives both. Manages the precariousness her letters denied.",
      halek: "Takes the money. Marks two sheets. Crosses out a third without writing it down.",
      column: "Notes a mother who gave up her own place. Some understand. Some look away.",
    },
    tone: "Spending yourself first, so neither child has to be spent.",
  },

  smuggler_route: {
    id: "smuggler_route",
    label: "Take the smuggler's forest route",
    matchHints: [
      "go with Petrov",
      "take the treeline",
      "the path through the forest",
      "all three through the woods",
      "bypass the gate",
      "trust the smuggler",
    ],
    timeline: [
      {
        beat: "The window",
        consequence:
          "You step out of Halek's line without naming a child. He does not look up. You walk the twenty paces to where Petrov is waiting in the pines. He counts the money, nods once, and starts walking. The three of you follow.",
      },
      {
        beat: "Before first light",
        consequence:
          "Petrov moves fast for a man in the dark. The forest swallows the floodlights within a minute. He hisses for quiet whenever Ilya coughs. The ground is uneven. You step where he steps.",
      },
      {
        beat: "Week 1",
        consequence:
          "Two hours in, the path crosses ground Petrov is no longer sure of. He stops. He puts the children behind him and goes ahead alone. You wait fifteen minutes. He comes back. He found a way around. He says nothing about what he saw.",
      },
      {
        beat: "Month 1",
        consequence:
          "You reach the far side at noon, not at dawn. Petrov's far-side contact is not at the meeting point — has not been, for two days. You find your own way to Anja's relay. She is not expecting you in this number. She manages.",
      },
      {
        beat: "Year 1",
        consequence:
          "All three of you are alive in a third country. Anja's room has held four of you through a winter. Ilya's cough comes back every cold season. Tomas dreams about the forest and does not say.",
      },
      {
        beat: "Years later",
        consequence:
          "You gambled all three and the gamble paid. You also met three families later who took Petrov's route and one of them came out smaller than they went in. You do not tell your boys that.",
      },
    ],
    secondOrder: {
      elder: "Crosses through the forest. Carries the night with him afterward.",
      younger: "Crosses through the forest. The cough keeps. The fear stays.",
      mira: "Spends the law and the money to keep the family whole.",
      anja: "Receives three. The room becomes four. She manages.",
      halek: "Notices you leave the line. Does not pursue. The count tonight is one short.",
      column: "Notes a family that stepped sideways into the trees. Some envy it. Some pray for them.",
    },
    tone: "The bet against the binary — and the cost of having taken it.",
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
