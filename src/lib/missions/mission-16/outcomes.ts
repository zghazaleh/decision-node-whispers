/**
 * Mission Sixteen — "The Village" — OUTCOME MODEL.
 *
 * Five defensible archetypes. None is the "right" answer.
 */

export type ArchetypeId =
  | "obey"
  | "refuse_to_fire"
  | "physically_intervene"
  | "report_up_the_chain"
  | "evacuate_covertly"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    village: string;
    squad: string;
    idris: string;
    chain: string;
    record: string;
    later: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  obey: {
    id: "obey",
    label: "Obey the order",
    matchHints: [
      "I step off with Karst",
      "execute the clearance",
      "follow the order",
      "do my job, stay in the squad",
      "I move when he moves",
      "I clear with the squad",
    ],
    timeline: [
      {
        beat: "05:51",
        consequence:
          "First contact is at the well — the middle-aged man drawing water turns to run and Tolven, on your right, fires once. The man falls. There is no return fire because there is nothing in the village to return fire with. The squad continues to clear by the book.",
      },
      {
        beat: "Week 2",
        consequence:
          "Lieutenant Brel's IG file goes up. Battalion does not yet know it exists. The platoon rotates back to COP THORN and pulls perimeter shifts for ten days.",
      },
      {
        beat: "Years later",
        consequence:
          "You will be alive. You will have the years and you will have what was in your hands at five-forty-eight, and the two of those will not reconcile, and you will find this out at unscheduled times for as long as you live.",
      },
    ],
    secondOrder: {
      village: "Korven Veld emptied. Bekka, the man at the well, two of the women, and at least one of the children among the eleven. Lira survives, hidden by her grandmother under the loom.",
      squad: "Everyone alive at the end of the morning. Tolven not really, in the way that matters. Karst quieter than he was. The squad does not speak of it among themselves.",
      idris: "Followed the chain. Carries it. Will tell the truth at the board and will not be punished beyond the carrying.",
      chain: "Captain Vorr retires. Major Helven is moved sideways. The colonel who signed off on FRAGO 11/B is promoted.",
      record: "Patrol log: clearance executed as ordered. AAR filed by Karst at 09:30. IG file opened by Brel that day; closed eighteen months later.",
      later: "The board will not call what happened by its name in writing. It will be called by its name by people who were not in the squad.",
    },
    tone: "The order followed and the cost paid in a currency the order does not list.",
  },

  refuse_to_fire: {
    id: "refuse_to_fire",
    label: "Refuse — weapon down on the wall",
    matchHints: [
      "I lay my weapon on the wall",
      "I refuse to step off",
      "weapon down, I am not moving",
      "I will not fire on civilians",
      "I tell Karst I am not going in",
      "I disobey, sit out",
    ],
    timeline: [
      {
        beat: "05:48:20",
        consequence:
          "Karst freezes the bound at four meters from the wall, turns, and looks at the two laid weapons. The third man in your team, Private Henrick, has already moved off and is fifteen meters in. Karst keys the radio and says 'Three-two, SAFETY HOLD, sixty seconds.' Henrick goes prone. The squad is paused.",
      },
      {
        beat: "05:50",
        consequence:
          "Captain Vorr on the net, voice steady: 'Three-two, source is CROW, confidence low to medium.' Brel on the ridge writes it down. The squad hears it. Karst keys back: 'Three-two requests stand-down pending re-designation.' Vorr does not answer for nine seconds. Then: 'Three-two, hold position, stand by.'",
      },
      {
        beat: "Years later",
        consequence:
          "You will not be the corporal you were before the wall. You will be a corporal who can say, accurately, what they did. The hamlet will not know your name. Tolven will write to you in the third year and you will write back.",
      },
    ],
    secondOrder: {
      village: "Korven Veld intact. No clearance. Lira finishes the morning bread. Bekka does not know what almost happened.",
      squad: "Tolven follows Idris down. Henrick comes back from the bound annoyed and alive. Karst pauses the squad and saves them all from what would have followed step-off.",
      idris: "Refuses on the line, in the form the system allows itself to recognize. Pays in rank and posting. Keeps the years that follow as his own.",
      chain: "Vorr's plausible deniability evaporates when the SOURCE CONFIRM call lands on the recorded net. Helven withdraws the platoon. FRAGO 11/B is rescinded within the month.",
      record: "Patrol log: SAFETY HOLD called at 05:48:20, SOURCE CONFIRM at 05:49:41, stand-down ordered at 06:35. Brel's IG file is the spine of the rescission.",
      later: "The board exists because the call was made. The board exists at all because someone laid a weapon flat on a stone wall at first light.",
    },
    tone: "The refusal taken inside the system's own grammar, paid for in the system's own currency.",
  },

  physically_intervene: {
    id: "physically_intervene",
    label: "Step in front of the squad",
    matchHints: [
      "I stand up and walk into the hamlet",
      "step between the squad and the village",
      "I put myself in front of them",
      "block Karst",
      "stand on the wall and tell them to stop",
      "go to Bekka on the step",
    ],
    timeline: [
      {
        beat: "05:48:25",
        consequence:
          "Karst draws his sidearm — it takes him less than a second — and shouts 'Halm, down!' He does not fire. Tolven freezes on the wall. Henrick, fifteen meters into the bound, turns. Brel on the ridge raises the spotting scope from the village to your face and writes the time.",
      },
      {
        beat: "06:35",
        consequence:
          "Stand-down at six-three-five from Major Helven, identical to the refusal-on-the-wall outcome. You walk back to the wall. Bekka watches you go and does not say anything because there is nothing to say at that hour.",
      },
      {
        beat: "Years later",
        consequence:
          "You will be a private at the rear echelon. You will be the man who walked into the village and sat down. Bekka will, the following winter, walk to the COP gate at THORN and ask the sentry to thank the soldier who sat with her. The sentry will not know who she means. The story will travel anyway, the way stories like that do.",
      },
    ],
    secondOrder: {
      village: "Intact. Bekka knows what happened, more than anyone else knows. Lira will be told a different version at twelve.",
      squad: "Karst draws and lowers. Tolven freezes and survives. Henrick is alive. The squad holds, by Karst's restraint.",
      idris: "Crossed the line bodily. Cannot un-cross it. Pays more than the refusal pays. Gets the morning back as his own in a way the refusal does not.",
      chain: "Same as the refusal outcome — the SOURCE CONFIRM call lands, Helven withdraws, FRAGO 11/B is rescinded. The intervention adds Bekka as a witness the board cannot ignore.",
      record: "Patrol log: SAFETY HOLD with corporal in the hamlet at 05:48:25, source confirm at 05:49:30, stand-down at 06:35. Brel's notebook records the act.",
      later: "The story travels. The story is not under your control. It will be told in versions that make you smaller and versions that make you larger; you will not be in either.",
    },
    tone: "The body as the line the order cannot cross, with the body's whole cost.",
  },

  report_up_the_chain: {
    id: "report_up_the_chain",
    label: "Call SOURCE CONFIRM on the net",
    matchHints: [
      "I key the radio and call source confirm",
      "freq 4, source confirm on Korven Veld",
      "put the captain on the record",
      "report it up before step-off",
      "ask Vorr what the source is",
      "log the call on net",
    ],
    timeline: [
      {
        beat: "05:48",
        consequence:
          "Step-off does not happen because the squad will not step off mid-source-confirm. Captain Vorr answers at 05:48:09, voice steady: 'Three-two, source is CROW, single-source, confidence low to medium.' On the ridge, Brel writes the time and the words.",
      },
      {
        beat: "06:35",
        consequence:
          "Stand-down at six-three-five. The squad withdraws to phase line ROBIN. The hamlet does not know what was decided about it. Bekka goes inside to put the kettle on.",
      },
      {
        beat: "Years later",
        consequence:
          "You will be the corporal who knew the protocol existed and used it at five-forty-seven-forty. Most of the squad will not understand for years how thin the margin was between that call and the morning they did not have to spend the rest of their lives carrying.",
      },
    ],
    secondOrder: {
      village: "Intact. The kettle goes on the fire. The morning continues.",
      squad: "Steps off nothing. Walks back to phase line ROBIN. Tolven sleeps that night for the first time in three days.",
      idris: "Used the lever the system left for exactly this moment. Carries no formal cost. Carries the knowledge that the lever was there to be used, which is its own weight.",
      chain: "FRAGO 11/B rescinded inside a month. Vorr offered retirement. Helven sidelined. CROW's handler quietly transferred.",
      record: "Net log: SOURCE CONFIRM at 05:47:43, CROW 'low to medium' at 05:48:09, stand-down at 06:35. The call is the spine of the IG file.",
      later: "The cleanest of the outcomes. The one that nobody writes a book about because nothing happened, which is the point.",
    },
    tone: "The refusal that uses the chain's own paperwork against it, before the chain remembers it left the paperwork there.",
  },

  evacuate_covertly: {
    id: "evacuate_covertly",
    label: "Get the civilians out the west path",
    matchHints: [
      "I tell Karst I am scouting the west path",
      "go to Bekka and tell her to take the families out the goat track",
      "evacuate the village the back way",
      "covertly move the civilians out",
      "use the unobserved goat path",
      "I move the families to the watercourse",
    ],
    timeline: [
      {
        beat: "05:50",
        consequence:
          "You drop behind the second-row houses and you are at Bekka's back step in ninety seconds. You tell her: 'Mother, take everyone you can down the goat path to the watercourse. Walk, do not run. The path is yours for thirty meters. Wait at the watercourse until midday and then go to Velnar.' She looks at you for two seconds. She gets up. She does not drop the apron.",
      },
      {
        beat: "06:08",
        consequence:
          "You are back on the wall at six-oh-eight. Karst looks at you. He says: 'Anything, Corporal.' You say: 'Nothing visible on the reverse slope, Sergeant.' He keys the radio at 06:09: 'Bravo six, three-two, request source confirm on the designation, over.' Karst makes the call because something in your face at six-oh-eight made it.",
      },
      {
        beat: "Years later",
        consequence:
          "Seventeen people walk to Velnar by midday and twelve are still alive at the end of the war. Lira is one of the twelve. You will not learn the count of twelve for nine years; you will learn it from a stranger in a market in Aluri Central who recognizes nothing about you except the optic clipped to a civilian coat.",
      },
    ],
    secondOrder: {
      village: "Seventeen out via the goat path, seven remain through the clearance and survive interrogation. No one dies in Korven Veld this morning.",
      squad: "Steps off into a quiet hamlet. Karst makes the SOURCE CONFIRM call after seeing your face at 06:08. The squad survives the morning with their hands clean.",
      idris: "Acts in the seam the order left open. Pays in the transfer, not in the years. Carries the optic and the count of twelve.",
      chain: "FRAGO 11/B is rescinded after the IG file lands, slightly slower than in the SOURCE CONFIRM outcome because the evacuation complicates Vorr's deniability laterally rather than head-on.",
      record: "Net log: SOURCE CONFIRM at 06:09. Clearance complete at 06:38, seven interrogated and released. Brel's notebook records the evacuation.",
      later: "The act has no name in any regulation. It has a count of twelve in a market nine years on. Both are real.",
    },
    tone: "The seam in the order found and the people walked through it before the order could close it again.",
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
