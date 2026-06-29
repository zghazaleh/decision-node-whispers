/**
 * Mission Four — "The Vote" — OUTCOME MODEL.
 */

export type ArchetypeId =
  | "vote_yes"
  | "vote_no_quiet"
  | "vote_no_personal_privilege"
  | "abstain"
  | "leak_dissent"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    bill: string;
    sarawan: string;
    hale: string;
    party: string;
    asha: string;
    nasser: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  vote_yes: {
    id: "vote_yes",
    label: "Vote yes",
    matchHints: [
      "vote yes",
      "vote for the AUMF",
      "support the authorization",
      "vote with the party",
      "trust the consensus",
      "back the president",
    ],
    timeline: [
      { beat: "Day 3", consequence: "First strikes against Sarawanese targets. Initial coverage frames the action as proportional and overdue." },
      { beat: "Month 6", consequence: "An allied intel service publishes evidence consistent with a third-party false flag. The administration disputes it. Coverage divides." },
      { beat: "Year 4", consequence: "You are re-elected with the chair Whitfield promised. You give the speech your father did not. It does not say what you wanted it to say." },
    ],
    secondOrder: {
      bill: "Passes. Renewed at sunset.",
      sarawan: "Multiple campaigns over 18+ months. Civilian casualties in three figures.",
      hale: "Career secure. Subcommittee chair delivered. The drawer with her father's letter does not get opened again.",
      party: "Holds the caucus. Rewards Hale visibly.",
      asha: "Redeployed nearer the operation. Survives. Does not text her mother for six months.",
      nasser: "Quietly retires within the year.",
    },
    tone: "Composed. Not punished. Confirmed. The decision of someone who chose the consensus and paid for it in installments.",
  },

  vote_no_quiet: {
    id: "vote_no_quiet",
    label: "Vote no, without explanation",
    matchHints: [
      "vote no",
      "vote against",
      "no vote",
      "vote nay",
      "without explanation",
      "without comment",
    ],
    timeline: [
      { beat: "Day 1", consequence: "Your office line lights up. Editorials in your home state call your vote unprincipled because unexplained." },
      { beat: "Month 6", consequence: "The false-flag theory surfaces publicly. Some commentators reread your no vote as prescient. Most do not." },
      { beat: "Year 4", consequence: "You serve out your term. You do not run again. You write the speech you would have given on the floor, and you do not publish it." },
    ],
    secondOrder: {
      bill: "Passes anyway, by one vote.",
      sarawan: "Same trajectory as the yes outcome, minus your participation.",
      hale: "Career damaged. Conscience intact. Whether that trade is paid for or not depends on the year you ask.",
      party: "Treats you as a problem to be managed. Eventually moves on.",
      asha: "Texts: 'Thanks for not deciding it because of me.' Means it.",
      nasser: "Reads about your vote. Keeps his job. Does not reach out.",
    },
    tone: "Quiet and slightly opaque. The decision of someone who spent the cost without buying anyone the explanation.",
  },

  vote_no_personal_privilege: {
    id: "vote_no_personal_privilege",
    label: "Vote no and explain on the floor",
    matchHints: [
      "personal privilege",
      "explain my vote",
      "speak on the floor",
      "vote no and speak",
      "give a floor speech",
      "explain in unclassified terms",
    ],
    timeline: [
      { beat: "Day 1", consequence: "The clip circulates. Coverage is sharply split. Whitfield is icy. Two colleagues call you privately to thank you." },
      { beat: "Month 3", consequence: "The false-flag theory gains traction in academic and journalistic circles. Your speech is anthologized in a textbook on congressional oversight." },
      { beat: "Year 6", consequence: "You serve another term. You do not get a committee chair. You get something else." },
    ],
    secondOrder: {
      bill: "Passes 51–49 anyway.",
      sarawan: "Same trajectory. The political conversation around it is different from week one.",
      hale: "Pays in chairs and influence. Gains in voice and durability.",
      party: "Treats you as inconvenient and necessary. Stops offering inducements. Stops trying to discipline.",
      asha: "Calls. Cries. Says: 'Now I know who you are.'",
      nasser: "Writes you a one-line note: 'Thank you for the work I could not do.'",
    },
    tone: "Open and exposed. The decision of someone who chose to be seen choosing.",
  },

  abstain: {
    id: "abstain",
    label: "Abstain (vote present)",
    matchHints: [
      "abstain",
      "vote present",
      "no vote",
      "withhold my vote",
      "not participate",
      "decline to vote",
    ],
    timeline: [
      { beat: "Day 1", consequence: "Editorials in your home state are uniformly bad. Whitfield does not call." },
      { beat: "Year 2", consequence: "You are challenged in the primary. You lose by 4 points." },
      { beat: "Year 6", consequence: "Whether the abstention was prudent caution or moral evasion is the question you no longer settle in your own mind." },
    ],
    secondOrder: {
      bill: "Passes. Sunset renews on schedule.",
      sarawan: "Same trajectory.",
      hale: "Loses the seat. Keeps a kind of quiet. The drawer with her father's letter gets opened twice a year.",
      party: "Forgets you within a cycle.",
      asha: "Visits more often than before.",
      nasser: "Does not register the abstention.",
    },
    tone: "Muffled and ambivalent. The decision of someone who could not bring themselves to be the answer.",
  },

  leak_dissent: {
    id: "leak_dissent",
    label: "Leak the classified dissent to a journalist",
    matchHints: [
      "leak to Marisol",
      "give the journalist the file",
      "leak the dissent",
      "go to the press",
      "publish the SCIF",
      "background the reporter",
    ],
    timeline: [
      { beat: "06:30 — The story", consequence: "The piece runs. The 35%/8% split is in print, attributed to 'multiple congressional sources familiar.' The vote is in three hours." },
      { beat: "Day 3", consequence: "The Department of Justice opens a leak investigation. Your name is among those examined. Marisol does not name you. She will not." },
      { beat: "Year 2", consequence: "You lose the primary. Marisol's source remains protected. The false-flag theory is now part of the historical record." },
    ],
    secondOrder: {
      bill: "Passes by a tighter margin, with a different narrative attached.",
      sarawan: "Same trajectory militarily. Politically different from year one.",
      hale: "Loses career and party standing. Becomes a category — 'leaker' or 'whistleblower' — depending on who is asked.",
      party: "Treats you as a betrayal. Some members privately disagree. None say so on the record.",
      asha: "Doesn't text for two weeks. Then does. Says only: 'Whatever it cost you, you weren't quiet about it.'",
      nasser: "Resigns within a month, not in protest, in fatigue. Sends you nothing.",
    },
    tone: "Severe and irreversible. Not heroic. Chosen with eyes open.",
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
