/**
 * Mission Eleven — "The Holdout" — OUTCOME MODEL.
 *
 * Five defensible archetypes. None is the "right" answer.
 */

export type ArchetypeId =
  | "fold_with_room"
  | "hold_not_guilty"
  | "force_hung"
  | "demand_reexamination"
  | "turn_one_first"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    defendant: string;
    room: string;
    camille: string;
    foreman: string;
    process: string;
    record: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  fold_with_room: {
    id: "fold_with_room",
    label: "Vote with the room",
    matchHints: [
      "I change my vote to guilty",
      "I fold",
      "vote with the eleven",
      "go along with the verdict",
      "I was wrong to hold out",
      "guilty, finalize it",
    ],
    timeline: [
      {
        beat: "That evening",
        consequence:
          "The verdict is read at 19:11. Reish does not move. His mother makes a sound that the bailiff is trained to ignore. The foreman is on the road by 19:40.",
      },
      {
        beat: "Month 1",
        consequence:
          "A small newspaper feature interviews the foreman, who calls the deliberation 'thorough.' You read it twice. You do not call anyone.",
      },
      {
        beat: "Years later",
        consequence:
          "You learn, six years on, that the appeal succeeded and the case was retried. You were right to have wondered. You did not wonder out loud.",
      },
    ],
    secondOrder: {
      defendant: "Convicted at the trial level. Death sentence. Appeals begin.",
      room: "Reaches consensus on schedule. Goes home.",
      camille: "Carries the private knowledge of the detail she did not name.",
      foreman: "Makes his drive. Tells his daughter it was 'a difficult case.'",
      process: "Concludes cleanly. The inconsistency in 14B never enters the trial record from the box.",
      record: "Twelve guilty votes. No question asked of the alley lamp.",
    },
    tone: "The quietest way a life can be decided.",
  },

  hold_not_guilty: {
    id: "hold_not_guilty",
    label: "Hold out as not-guilty without explaining",
    matchHints: [
      "I vote not guilty again",
      "I won't change my vote",
      "I refuse to convict",
      "stay not guilty without saying why",
      "I just have doubt",
      "I'm not voting guilty, that's all",
    ],
    timeline: [
      {
        beat: "That evening",
        consequence:
          "An hour of pressure. Marlin asks what specifically. You will not name it because you have not finished thinking about it. The foreman writes a note to the judge at 19:34: deadlocked, 11–1.",
      },
      {
        beat: "Month 1",
        consequence:
          "Twelve different people are empanelled for the retrial. The 14B detail is still in the record; whether anyone notices it is again a matter of luck.",
      },
      {
        beat: "Years later",
        consequence:
          "You held the line and could not say what for. The honest version of you is not sure that was integrity. It was at least a refusal.",
      },
    ],
    secondOrder: {
      defendant: "Mistrial, then re-tried, then convicted. A delay; perhaps not more than that.",
      room: "Hung. Goes home unresolved and angry.",
      camille: "Held without naming. Carries the unspoken reason.",
      foreman: "Writes the deadlock note. Misses the drive.",
      process: "Forced to restart. Twelve new jurors get the same evidence.",
      record: "11–1 deadlock. The detail still un-asked.",
    },
    tone: "The dignity and the inadequacy of a silent no.",
  },

  force_hung: {
    id: "force_hung",
    label: "Openly force a hung jury",
    matchHints: [
      "I want to hang the jury",
      "make it a mistrial",
      "I'll never agree",
      "tell the foreman we're deadlocked",
      "I'm not moving, ever",
      "let the state retry it",
    ],
    timeline: [
      {
        beat: "That evening",
        consequence:
          "Marlin demands you state a reason on the record. You say you decline to. The note goes under the door at 19:21. The judge accepts the deadlock at 19:45.",
      },
      {
        beat: "Month 1",
        consequence:
          "The retrial is scheduled. The defense's new public defender — different from the first — re-examines the 14B exhibits because the appellate clerks pointed at them. The alley-lamp question is finally asked aloud in open court.",
      },
      {
        beat: "Years later",
        consequence:
          "You bought the question time to be asked by someone else, in a forum where asking it counts. You also poisoned the well in your own city for the next holdout.",
      },
    ],
    secondOrder: {
      defendant: "Mistrial; retried; convicted of a lesser charge; alive.",
      room: "Hung loudly. Marlin will never forgive you in particular.",
      camille: "Named publicly as the holdout. Carries the visibility.",
      foreman: "Writes the deadlock note. Privately relieved. Will not say.",
      process: "Restarts under new counsel; the detail is finally asked aloud.",
      record: "11–1 deadlock, on the record, under your name.",
    },
    tone: "Spending your name to buy the case a second look.",
  },

  demand_reexamination: {
    id: "demand_reexamination",
    label: "Demand re-examination of the alley-light exhibit",
    matchHints: [
      "send a note to the judge",
      "ask the foreman to request 14B",
      "re-read the exhibit",
      "I want to see the maintenance log again",
      "request the alley diagram",
      "let's check exhibit fourteen",
    ],
    timeline: [
      {
        beat: "That evening",
        consequence:
          "The foreman scowls and writes the note. The bailiff takes it. The judge reads the three exhibits back in open court at 19:34. The room hears, in sequence: 'plain as day under the alley light,' the log showing lamp A-217 was out, and the diagram showing two lamps in the alley.",
      },
      {
        beat: "Week 1",
        consequence:
          "Three more hours. The room divides further. At 22:50 the judge accepts a deadlock at 7–5. Mistrial. Re-prosecution announced; the alley-light question is now in the record from the jury box.",
      },
      {
        beat: "Years later",
        consequence:
          "You used the process the way it is supposed to be used and did not pretend to be sure of more than you were. Marlin still tells people you ruined the case.",
      },
    ],
    secondOrder: {
      defendant: "Hung, retried, convicted of the lesser charge; alive.",
      room: "Splits 8–4, then 7–5. Hung honestly.",
      camille: "Named the doubt and the bias check. Earned the room's anger and Aiyana's voice.",
      foreman: "Writes the note he did not want to write.",
      process: "The detail enters the trial record from the box, asked aloud.",
      record: "Re-examination on file. A clean reason for the deadlock.",
    },
    tone: "Using the procedure rather than your name.",
  },

  turn_one_first: {
    id: "turn_one_first",
    label: "Turn one juror first, then the room",
    matchHints: [
      "talk to Davit privately",
      "give Davit cover to flip",
      "pull Aiyana in first",
      "work one juror at a time",
      "build a second not-guilty",
      "convince Davit then call the vote",
    ],
    timeline: [
      {
        beat: "That evening",
        consequence:
          "Davit repeats the sentence. Marlin attacks him personally; the attack costs Marlin one more juror, who flips on the principle of not being talked to that way. The next ballot is 8–4.",
      },
      {
        beat: "Week 1",
        consequence:
          "Mistrial. Re-prosecution announced. Reish is remanded. Your room broke evenly; the next jury will not have your room's history.",
      },
      {
        beat: "Years later",
        consequence:
          "You did not change a verdict by being right. You changed it by giving four other people a sentence each could survive saying.",
      },
    ],
    secondOrder: {
      defendant: "Hung 6–6, retried, convicted of the lesser charge; alive.",
      room: "Moves from 11–1 to 6–6 over two hours. Goes home with the question on its tongue.",
      camille: "Did not stand alone. Built a coalition by handing out sentences.",
      foreman: "Writes the deadlock note when no one is in a hurry anymore.",
      process: "Functions because four people were given cover, not pressure.",
      record: "A balanced deadlock that reads, in the appellate brief, as honest disagreement.",
    },
    tone: "The arithmetic of cover, used to move a room.",
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
