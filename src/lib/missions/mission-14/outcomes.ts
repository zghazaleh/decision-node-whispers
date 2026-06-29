/**
 * Mission Fourteen — "The Lodger" — OUTCOME MODEL.
 *
 * Five defensible archetypes. None is the "right" answer.
 */

export type ArchetypeId =
  | "take_in"
  | "turn_away"
  | "one_night_then_on"
  | "take_in_move_children"
  | "report_to_protect"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    stranger: string;
    children: string;
    eda: string;
    neighbor: string;
    street: string;
    record: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  take_in: {
    id: "take_in",
    label: "Take him in",
    matchHints: [
      "I let him in",
      "open the door, hide him",
      "I take him into the cupboard",
      "bring him inside",
      "shelter him tonight",
      "I'll hide him under the stairs",
    ],
    timeline: [
      {
        beat: "22:55",
        consequence:
          "Marit wakes at the sound of the bolt going home. You tell her in one sentence what you have done. She does not argue; she goes upstairs to sit with Mira and Pim and to be the one who answers if the children wake at a knock.",
      },
      {
        beat: "Standard search",
        consequence:
          "Vehlmann steps into the parlor, glances at the cellar rug (undisturbed), looks into the upstairs rooms (Marit sitting up with Mira on her knee), opens the closet doors, does not touch the coat-rack. He thanks you for the quiet street and leaves. The cupboard holds. The stranger goes out by the back lane at 04:40 with Marit and her permit, presented as an apprentice midwife.",
      },
      {
        beat: "Years later",
        consequence:
          "The occupation ends seventeen months on. The patrol-schedule book in the leather case shortened the war in your county by a measurable amount. Mira, grown, will be told some of the story; Pim will not, because you decide he does not need to know that you almost did not.",
      },
    ],
    secondOrder: {
      stranger: "Survives the night, reaches the next safehouse with Marit's permit, lives.",
      children: "Sleep through it. Wake to a normal morning. Are not told what was in the cupboard.",
      eda: "Acts on courage without knowing the full stakes. Carries the knowledge afterward and the relief that the cupboard held.",
      neighbor: "Watched. Did not denounce. Will, weeks later, leave a loaf on the woodshed step without comment.",
      street: "Number 14 was searched, found quiet, marked clear. Vinnerstrasse loses no one tonight.",
      record: "Patrol log: standard sweep, three houses, no findings. No entry for the cupboard.",
    },
    tone: "The cleanness of an act done before the cost of doing it is fully counted.",
  },

  turn_away: {
    id: "turn_away",
    label: "Turn him away",
    matchHints: [
      "I'm sorry, I can't",
      "I close the door",
      "send him on",
      "tell him to try elsewhere",
      "I cannot, my children",
      "shake my head and shut the door",
    ],
    timeline: [
      {
        beat: "22:55",
        consequence:
          "You stand in the hall with your hand still on the bolt for two minutes. Marit does not wake; she did not hear the door. Upstairs the bed creaks once and is still.",
      },
      {
        beat: "By morning",
        consequence:
          "The stranger is taken at the rectory wall at Saint-Cael's at 23:31, the rectory itself empty tonight, Father Brem in Aaling for a funeral. He does not name the house that turned him away — he would not have, and you will never be certain of that.",
      },
      {
        beat: "Years later",
        consequence:
          "You learn, after the occupation ends, who he was and what he was carrying. The patrol-schedule book was lost on the rectory wall. The eastern grain convoys ran on schedule for another month and a small number of villages paid for it. You are alive. So are your children. So are you.",
      },
    ],
    secondOrder: {
      stranger: "Taken at the rectory wall. Did not name the house that refused him.",
      children: "Sleep through. Wake to a normal morning. Will not be told.",
      eda: "Keeps the family safe and the refusal in her own mouth. Carries the small notice from the parish board.",
      neighbor: "Watched the door open and close. Drew her own conclusion. Did not speak of it.",
      street: "Vinnerstrasse loses no one tonight. Two streets north, the rectory wall does.",
      record: "Patrol log: standard sweep, all houses cooperative, fugitive captured at Saint-Cael's. Number 14 not noted.",
    },
    tone: "The duty of the parent, named honestly and paid for in someone else's name.",
  },

  one_night_then_on: {
    id: "one_night_then_on",
    label: "Hide him tonight, send him on at dawn",
    matchHints: [
      "one night only",
      "hide him in the cupboard till morning",
      "give him a candle and send him on",
      "let him rest then move",
      "shelter, then route him to the rectory",
      "the cupboard tonight, the road at dawn",
    ],
    timeline: [
      {
        beat: "22:57",
        consequence:
          "The patrol comes through. Vehlmann does a standard search; the cupboard holds; the coat-rack does its work. You give the candle a different angle on the parlor table so its shadow is wrong by the time the boots are at the door.",
      },
      {
        beat: "Week 1",
        consequence:
          "Either: he reaches the rectory and Father Brem is in. Or he reaches it and Brem is not, and he goes on to the next coded house — or he is taken on the way. You will not know which for some time. The household risk ended at the back door at dawn.",
      },
      {
        beat: "Years later",
        consequence:
          "You decide, after the occupation, that one night was the most you could pay for him and that the route you gave him at dawn was the rest of what you owed. You do not know if it was enough. You know it was what you had.",
      },
    ],
    secondOrder: {
      stranger: "Survives the night. After the back door at dawn, the outcome is the resistance's, not yours.",
      children: "Sleep through. A normal morning. The cupboard is empty by the time they come down.",
      eda: "Pays one night's risk for what one night can buy. Carries the not-knowing afterward.",
      neighbor: "Watched. Did not denounce. May or may not have noticed a second figure at the back gate at 04:20.",
      street: "No loss on Vinnerstrasse tonight. The route to Saint-Cael's is the next street's question.",
      record: "Patrol log: standard sweep, no findings. No record of the back gate at dawn.",
    },
    tone: "Buying a night and giving the road back, neither cleanly nor in vain.",
  },

  take_in_move_children: {
    id: "take_in_move_children",
    label: "Take him in but move the children first",
    matchHints: [
      "take Mira and Pim to Marit's",
      "wake the kids and move them",
      "send the children out the back",
      "shelter him, but children out first",
      "Marit takes the children",
      "kids to safety before I open the cupboard",
    ],
    timeline: [
      {
        beat: "22:55",
        consequence:
          "Marit and the children are gone before the patrol's bootfall reaches the south end of Vinnerstrasse. You pull the stranger in, put him in the behind-stairs cupboard, move the coat-rack to its mark.",
      },
      {
        beat: "Week 1",
        consequence:
          "If the search had been thorough — if the corporal had moved the coat-rack — Decree 14 would have taken you and the children would have come back to an empty house. The choice you made was to risk yourself alone, not them. The cupboard held; this time.",
      },
      {
        beat: "Years later",
        consequence:
          "You will know, later, that the household register at the Imperial Vesren administration carried Mira and Pim as 'temporary absent — guardian's farm' for that night, and that the notation saved your life when a follow-up sweep came on Friday. You did not plan for the notation. You planned for the children.",
      },
    ],
    secondOrder: {
      stranger: "Hidden. Survives the patrol. Routed on later as in 'hide one night then on,' or held longer if the household chooses.",
      children: "Out of the house when the boots arrived. Carried in a quilt to Marit's; will remember, in Mira's case, parts of it.",
      eda: "Takes the risk in her own name and her own name only. Pays in the upstairs bed being empty when she opened the door.",
      neighbor: "Saw Marit at the back gate with two children at 22:54. Drew her own conclusion. Did not speak.",
      street: "Vinnerstrasse loses no one tonight. Marit's house six streets away is now in the picture, quietly.",
      record: "Patrol log: standard sweep, household one adult, children at guardian's farm. Notation entered.",
    },
    tone: "Refusing the false binary between courage and parenthood by paying for both in separate currencies.",
  },

  report_to_protect: {
    id: "report_to_protect",
    label: "Report him to protect the children",
    matchHints: [
      "I call out to the patrol",
      "step into the street and report him",
      "tell the corporal there's a man at my door",
      "give him up",
      "denounce him to save the children",
      "I report him to Vehlmann",
    ],
    timeline: [
      {
        beat: "22:54",
        consequence:
          "Vehlmann is there in two minutes with the privates. The stranger is taken on the cobbles in front of number 14 without a struggle. He looks at you once. He does not say a word. The leather case is taken with him.",
      },
      {
        beat: "Week 1",
        consequence:
          "Your ration card carries an extra column for the next quarter. Pim gets butter twice a week. Mira asks where it came from; you tell her the school cooperative is back. Henna stops nodding to you at the well.",
      },
      {
        beat: "Years later",
        consequence:
          "After the occupation ends the notation in the registry is read by everyone who wants to read it. Mira reads it at sixteen. You will be alive when she does. The conversation you have then is the longest one of your life.",
      },
    ],
    secondOrder: {
      stranger: "Taken on the cobbles. Executed within the week. The patrol-schedule book is taken with him.",
      children: "Sleep through. Fed better for a season. Read the registry when they are grown.",
      eda: "Survives the night, the season, the war. Carries the notation in writing and the look on the cobbles in herself.",
      neighbor: "Saw it. Will never accept bread from your hand again.",
      street: "Will know within days. Vinnerstrasse re-sorts itself around the doorway you opened to the sentry.",
      record: "Patrol log: civilian denunciation, capture without incident, household marked civic-loyalty.",
    },
    tone: "Choosing the children in the verb the occupier wrote for choosing them.",
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
