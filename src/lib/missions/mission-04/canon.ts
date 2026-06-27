/**
 * Mission Four — "The Vote" — CANON.
 */

export const CANON = {
  world: {
    date: "Tuesday, September 17",
    time: "23:11",
    location: "Senate hideaway office, basement of the Capitol building",
    weather: "A thunderstorm outside. Rain on the small high window.",
  },

  vote: {
    formalName: "S.J.Res. 41 — Authorization for the Use of Military Force in Sarawan",
    scheduledFor: "Floor vote, 09:00 tomorrow",
    hoursUntil: 10,
    margin:
      "Estimated 51–49 in favor. Your vote, undecided in the whip count, is one of three that could swing it.",
    triggerEvent:
      "A suspected state-backed cyberattack on a US naval base in the Gulf six days ago killed 17 sailors. Sarawan denies involvement.",
  },

  player: {
    name: "Senator Marian Hale",
    age: 58,
    role: "Junior senator, 4th year of first term; member of the Intelligence committee",
    physicalState:
      "Has eaten half a sandwich in eight hours. Bourbon untouched on the desk. Shoes off.",
    party:
      "Of the president's party, but historically independent on national security votes.",
  },

  intel: {
    publicConsensus:
      "Briefings to the full chamber have characterized Sarawanese involvement as 'highly likely.' Two intelligence agencies concur. One does not.",
    classifiedDoubt:
      "In the Intel committee SCIF this afternoon, Hale was shown signals analysis suggesting the attack may have been a false-flag operation by a third party with motive to provoke US response. The analyst gave it 35% probability. The DNI's office gave the same packet 8%.",
    historicalParallel:
      "Hale's father, also a senator, voted for the Gulf of Tonkin Resolution in 1964. He spent the rest of his life refusing to discuss it.",
  },

  characters: {
    delgado: {
      name: "Chief of Staff Ben Delgado",
      role: "Hale's chief of staff",
      knows:
        "The whip count. The polling. That Hale was shaken after the SCIF. Does NOT have the classified packet.",
      stance:
        "Politically a yes — believes a no vote ends Hale's career. Personally loyal. Will tell her the truth even when it costs.",
      whereabouts: "In the outer office, on his third coffee.",
    },
    whitfield: {
      name: "Majority Whip Sen. Carla Whitfield",
      role: "Senior senator, party leadership",
      knows: "The whip count. Has called Hale twice tonight. Wants the vote.",
      stance:
        "Transactional, warm, will offer Hale a subcommittee chair if she votes yes. Will not threaten. Will remember.",
      whereabouts: "Her office one floor up.",
    },
    nasser: {
      name: "Analyst Dr. Reza Nasser",
      role: "Intel committee senior analyst (the dissenter)",
      knows:
        "His own dissent in detail. Believes the false-flag probability is closer to 35% than 8%. Has been overruled by his agency leadership.",
      stance:
        "Will speak to Hale on the secure line if called. Career-cautious; will not push beyond his finding.",
      whereabouts: "Home, in McLean. Phone on.",
    },
    daughter: {
      name: "Asha Hale",
      role: "Hale's daughter, 26, Navy lieutenant",
      knows: "Nothing classified. Knows her mother is voting tomorrow.",
      stance:
        "Has texted: 'Whatever you decide tomorrow, I love you. Don't decide it because of me.' Currently stationed in the Gulf region.",
      whereabouts: "Aboard ship. Reachable by family-network text only.",
    },
    journalist: {
      name: "Marisol Reyes",
      role: "Investigative reporter, national outlet",
      knows:
        "She has heard, off-record from another senator, that there is dissent in the intel community. Has texted Hale twice.",
      stance:
        "Will protect a source absolutely. Will publish what she can verify, on her timeline, not Hale's.",
      whereabouts: "In her office. Filing tomorrow either way.",
    },
  },

  objects: {
    bill: {
      what: "A printed copy of S.J.Res. 41 on the desk.",
      pages: 14,
      keyClauses:
        "Sunset clause: 24 months. Geographic restriction: Sarawan and immediate territorial waters. Reporting requirements: 60 days. No exit conditions beyond 'cessation of hostile activity.'",
    },
    scifNotes: {
      what: "Hale's classified notebook, locked in the hideaway safe.",
      contents:
        "Six pages of handwritten notes from the SCIF: signals discrepancies, the 35% / 8% probability split, the names of the dissenting analyst and the DNI senior who overruled him.",
      onPaper: true,
      transferable: false,
    },
    fathersLetter: {
      what: "An old envelope in the desk drawer.",
      contents:
        "A 1972 letter from Hale's father to his college friend, never sent. One paragraph: 'I think we were lied to about Tonkin. I think I knew and voted anyway because the cost of asking the question felt too high. I have not forgiven myself. I never will.'",
    },
    phone: {
      what: "Hale's secure phone on the desk.",
      ifUsed:
        "Recent: 2 missed from Whitfield. 1 from Delgado (in the next room). 1 unread from Asha (the message above). 1 unread from Marisol Reyes: 'I have a 9am deadline. Talk?'",
    },
  },

  history6d: [
    { when: "6 days ago", what: "Cyberattack on USS Pendleton kills 17. Sarawan denies." },
    { when: "5 days ago", what: "Full-chamber briefing characterizes Sarawanese role as 'highly likely.'" },
    { when: "4 days ago", what: "AUMF draft introduced. Whip count begins." },
    { when: "3 days ago", what: "Hale flags privately to Delgado that she wants a fuller intel picture." },
    { when: "2 days ago", what: "Hale requests SCIF briefing from Intel committee leadership." },
    { when: "Today 16:00", what: "SCIF briefing. Hale is shown the dissent. Probability split: 35%/8%." },
    { when: "Today 21:00", what: "Whitfield's first call. Hale does not answer." },
    { when: "Today 22:30", what: "Asha's text arrives." },
    { when: "Today 23:11", what: "The player wakes up as Hale in the hideaway." },
  ],

  constraints: [
    "The vote is in ten hours. There is no procedural way to delay it from a single senator.",
    "Hale cannot disclose classified material on the floor without risking sanction and prosecution.",
    "She can speak around it, vote her conscience, or invoke a 'point of personal privilege' to explain a no vote in non-classified terms.",
    "Whitfield's subcommittee offer is real and will not be made again.",
    "Marisol Reyes will file by 06:00 with or without comment from Hale.",
    "Asha is stationed in the affected region.",
    "The 35%/8% probability split is genuinely uncertain. Both estimates are made by serious people.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (CANON — never contradict, never invent beyond):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
VOTE: ${CANON.vote.formalName}. ${CANON.vote.scheduledFor}, T-${CANON.vote.hoursUntil}h. Margin: ${CANON.vote.margin} Trigger: ${CANON.vote.triggerEvent}
PLAYER: ${CANON.player.name}, ${CANON.player.age}, ${CANON.player.role}. ${CANON.player.physicalState} Party context: ${CANON.player.party}

INTEL:
- Public consensus: ${CANON.intel.publicConsensus}
- Classified dissent: ${CANON.intel.classifiedDoubt}
- Personal context: ${CANON.intel.historicalParallel}

CHARACTERS:
- ${CANON.characters.delgado.name} (${CANON.characters.delgado.role}): ${CANON.characters.delgado.stance} Knows: ${CANON.characters.delgado.knows}
- ${CANON.characters.whitfield.name} (${CANON.characters.whitfield.role}): ${CANON.characters.whitfield.stance} Knows: ${CANON.characters.whitfield.knows}
- ${CANON.characters.nasser.name} (${CANON.characters.nasser.role}): ${CANON.characters.nasser.stance} Knows: ${CANON.characters.nasser.knows}
- ${CANON.characters.daughter.name} (${CANON.characters.daughter.role}): ${CANON.characters.daughter.stance}
- ${CANON.characters.journalist.name} (${CANON.characters.journalist.role}): ${CANON.characters.journalist.stance}

OBJECTS:
- Bill (${CANON.objects.bill.pages} pp): ${CANON.objects.bill.keyClauses}
- SCIF notes (in safe): ${CANON.objects.scifNotes.contents}
- Father's 1972 letter: ${CANON.objects.fathersLetter.contents}
- Phone: ${CANON.objects.phone.ifUsed}

LAST 6 DAYS:
${CANON.history6d.map((h) => `- ${h.when}: ${h.what}`).join("\n")}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
