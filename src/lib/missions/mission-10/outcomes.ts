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
        beat: "Before first light",
        consequence:
          "Ilya crosses, half-asleep, into the next-line marshals who will walk him the last ten kilometres to Anja. You and Tomas turn back with the unprocessed half of the column.",
      },
      {
        beat: "Month 1",
        consequence:
          "Anja's village is absorbed by the new militia. Ilya is moved twice — once to a school basement, once to a neighbour's cellar. He keeps. Tomas, with you, walks a great deal and speaks very little.",
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
        beat: "Before first light",
        consequence:
          "Tomas joins the next-line marshals and is walked toward Anja. You and Ilya turn back. Ilya does not understand. He understands.",
      },
      {
        beat: "Month 1",
        consequence:
          "The doctor is good. Ilya recovers. Tomas, on the far side, has begun translating for the families Anja is sharing a roof with, and is exposed to news from the front. He stops sleeping through the night.",
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
        beat: "Before first light",
        consequence:
          "The three of you step out of the line and back into the dark. Tomas takes Ilya's hand without being asked. Vasic the liaison watches you go and says nothing.",
      },
      {
        beat: "Month 1",
        consequence:
          "Ilya dies on the seventh day of the second week. The doctor says it would have been hard to save him anywhere. You hold Tomas's hand at the burial. He does not let go for a long time.",
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
        beat: "Before first light",
        consequence:
          "The boys cross. Tomas does not let go of Ilya's hand. You watch them disappear into the next-line marshals from the wrong side of the barrier. You do not cry where Halek can see.",
      },
      {
        beat: "Month 1",
        consequence:
          "You shelter in a partisan village south of Sevirin. The front moves; the village does not fall. Anja's village is absorbed by the new militia. She moves the boys to a neighbour's cellar. Two is harder to hide than one. They keep.",
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
        beat: "Before first light",
        consequence:
          "Petrov moves fast for a man in the dark. The forest swallows the floodlights within a minute. He hisses for quiet whenever Ilya coughs. The ground is uneven. You step where he steps.",
      },
      {
        beat: "Month 1",
        consequence:
          "You reach the far side at noon, not at dawn. Petrov's far-side contact is not at the meeting point — has not been, for two days. You find your own way to Anja's relay. She is not expecting you in this number. She manages.",
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
