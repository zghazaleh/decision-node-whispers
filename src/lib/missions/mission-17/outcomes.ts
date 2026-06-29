/**
 * Mission Seventeen — "The Rope" — OUTCOME MODEL.
 *
 * Five defensible archetypes. None is the "right" answer.
 */

export type ArchetypeId =
  | "stand_aside"
  | "join_the_hanging"
  | "face_down_the_mob"
  | "demand_a_delay"
  | "free_and_run"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    town: string;
    suspects: string;
    casper: string;
    widow: string;
    record: string;
    later: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  stand_aside: {
    id: "stand_aside",
    label: "Stand aside — let it proceed",
    matchHints: [
      "I step back and let it happen",
      "I do nothing, the badge is just tin",
      "not my fight, not tonight",
      "I take the star off",
      "I stand at the back and watch",
      "I keep my mouth shut",
    ],
    timeline: [
      {
        beat: "19:51",
        consequence:
          "Reverend Holst reads four verses from the Bible at Owen's nod. Adela Marsh does not look up. Hale Tirran calls your name once across the crowd — 'Deputy' — and you do not turn.",
      },
      {
        beat: "Day 3",
        consequence:
          "Sheriff Krait returns at noon tomorrow. You report the hanging as a citizens' action. Krait does not ask whether you objected because he can read your face. He takes the star back without ceremony at the end of the week. Owen Lourd pays for the funerals.",
      },
      {
        beat: "Years later",
        consequence:
          "You will be alive and in this town or another. Bram Coate will not greet you again on the street. The cottonwood will be cut down in your fortieth year by a council that does not include you. You will know what you stepped back from at 19:43 and the knowing will not leave.",
      },
    ],
    secondOrder: {
      town: "Bremmen Hollow does the thing and goes home. The crowd is quiet about it for a month and louder about it for the year after the receipt arrives. The town does not recover the version of itself it was at noon.",
      suspects: "Hale Tirran, Joss Vell, Pim Conder dead by 20:04. Posthumously cleared in four months. Conder's mother in Westmount will outlive the news by eight years.",
      casper: "Kept his life and his place in the crowd. Loses the badge inside a week, loses Bram Coate's nod inside a day, and keeps what he saw at the end of the wagon for the rest of it.",
      widow: "Adela Marsh is told what happened to the wrong men. She will not teach school after Christmas. She moves to her sister's in Edenmill in the spring.",
      record: "Sheriff's logbook: 'Citizens' action carried out at the cottonwood on the evening of 16th August. Deputy Renn present.' Territorial inquiry file opened four months later.",
      later: "Owen Lourd is never charged with the killing of Henry Marsh. He is charged, two years on, with embezzlement of the freight account; the case is dismissed for want of the ledger.",
    },
    tone: "The step back taken in the dust, the rope thrown without your hand on it, the years afterward shaped by both.",
  },

  join_the_hanging: {
    id: "join_the_hanging",
    label: "Join the hanging — drive the wagon yourself",
    matchHints: [
      "I take the reins of the wagon",
      "I join Owen, the badge backs the town",
      "I help string them up",
      "I drive the team forward",
      "I make it official",
      "swear it as a lawful execution",
    ],
    timeline: [
      {
        beat: "19:55",
        consequence:
          "Reverend Holst reads. You take the reins of Owen's team. Hale Tirran calls 'Deputy' once and you do not look. Joss Vell, on Hale's left, says nothing at all. The ropes are settled by Owen and Reuben.",
      },
      {
        beat: "Day 3",
        consequence:
          "Sheriff Krait returns at noon. You report the hanging as a lawful action under the deputy's authority and your name is on the report. Krait reads it twice. He does not take the star back. He says: 'You are sure of what you signed, son.' You say yes.",
      },
      {
        beat: "Years later",
        consequence:
          "You will come back from Hollander Bend at twenty-four and you will not be the boy who took the star at 04:50. You will work freight for a different line in a different town. Owen Lourd will run for the territorial assembly in the year you turn thirty and will lose narrowly. You will not have voted.",
      },
    ],
    secondOrder: {
      town: "Bremmen Hollow names the killing 'the deputy's hanging' for forty years. Owen Lourd's name is folded into the deputy's by the kindness of the town's collective memory toward those who run the freight line.",
      suspects: "Three dead by 20:01 under the color of law. The receipt arrives anyway and the names are cleared, anyway.",
      casper: "Eighteen months at Hollander Bend and the rest of a life that runs alongside the life he would otherwise have had. Does not put on a badge again.",
      widow: "Adela Marsh thanks you in writing on the day of the hanging. Writes you again four months later from Edenmill saying she does not know what to say. Does not write a third time.",
      record: "Sheriff's logbook: 'Lawful execution under the deputy's authority, 16th August.' Territorial conviction file: 'Renn, C., wrongful execution, one count, 18 mo., Hollander Bend.'",
      later: "Owen never charged with the killing. The ledger never recovered. The cottonwood still standing the year you come back.",
    },
    tone: "The badge given to the rope, the rope given the law's name, both costs paid in the years to follow.",
  },

  face_down_the_mob: {
    id: "face_down_the_mob",
    label: "Face down the mob — stop it now",
    matchHints: [
      "I step in front of the wagon",
      "stop it right here, badge up",
      "I draw and tell Owen to stand down",
      "I put myself between the rope and them",
      "I order the crowd to disperse",
      "I call for Bram and step forward",
    ],
    timeline: [
      {
        beat: "19:45",
        consequence:
          "Owen, on the box: 'You are twenty-two, son. Step aside.' You do not step aside. You turn your head to the smithy steps and say, not loud: 'Bram.' Bram Coate is in the street in three steps and on your right shoulder in five. The forty becomes a crowd of two factions for the first time tonight.",
      },
      {
        beat: "19:55",
        consequence:
          "You walk Hale, Joss, and Pim under guard to the church. Reverend Holst opens the doors without a word. You send Dell Tomlin on the freight road at 20:02 for Sheriff Krait. The three sit on the front pew under Bram's watch until 02:00 when you switch with him. You do not sleep until tomorrow noon.",
      },
      {
        beat: "Years later",
        consequence:
          "You will keep the badge. The town will not entirely forgive you for the night you turned a crowd of friends into two factions; it will also not entirely have forgiven itself, and the two unforgivings will sit next to each other for a generation. Hale Tirran will send a letter from Westmount every Christmas for nine years. The tenth he will not send because he will be dead of a fever, but his brother will write you that one.",
      },
    ],
    secondOrder: {
      town: "Bremmen Hollow does not hang three innocent men. It also does not entirely heal from the night it nearly did. The cattlemen's association meets without Owen Lourd at the head of the table the following month.",
      suspects: "All three alive. Cleared by the receipt the next afternoon. Hale and Joss home in Westmount inside the week.",
      casper: "Keeps the star. Keeps Bram's nod. Keeps Adela's gratitude in the form of her not speaking to him for two years and then, gradually, speaking to him again.",
      widow: "Adela Marsh learns three days later that her Monday-night sentence about Owen was the truth she could have said. She does not forgive herself for not having said it sooner; she does not forgive Owen at all; she stays in the town and continues to teach school.",
      record: "Sheriff's logbook: 'Deputy Renn prevented unlawful hanging at the cottonwood on 16th August, took three suspects into protective custody at the church. Sheriff dispatched for. Suspects exonerated 17th August. Owen Lourd arrested for the killing of Henry Marsh, same day.'",
      later: "Owen Lourd hanged lawfully in the spring at the territorial yard in Edenmill. You are not present at the request of the territorial marshal, which you accept.",
    },
    tone: "The badge spent for the moment it was given for, in the only currency the badge has.",
  },

  demand_a_delay: {
    id: "demand_a_delay",
    label: "Demand a delay — verify the evidence",
    matchHints: [
      "one hour for the deputy",
      "I demand a delay to ride the evidence down",
      "open the saddlebags first",
      "we wait for the sheriff",
      "give me until full dark",
      "I want to question them before the rope",
    ],
    timeline: [
      {
        beat: "19:46",
        consequence:
          "Owen on the box: 'No man hangs in the dark in this town, Casper.' You: 'Then we hang no man tonight. One hour.' Bram Coate steps off the smithy steps and into the street behind your right shoulder. Owen looks at Bram. Looks at the dimming sky. Says, finally: 'One hour, Deputy. Saddlebags here in the street, in front of the town.'",
      },
      {
        beat: "20:00",
        consequence:
          "You ask Bram Coate, loudly: 'Bram, what did you see when you went into the post office for the cord?' Bram says: 'Freight ledger gone off the desk where it lives.' Owen Lourd, on the box, says nothing for a count of four. The crowd is now two crowds.",
      },
      {
        beat: "Years later",
        consequence:
          "You will be the deputy who asked for an hour. The town will tell the story that way and you will not correct them. Bram Coate will recommend you for the sheriff's job when Krait retires in your seventh year and you will take it. The cottonwood will still be there.",
      },
    ],
    secondOrder: {
      town: "Bremmen Hollow learns that a delay is something the badge can ask for. The cattlemen's association does not vote the same way again at the next election.",
      suspects: "All three alive. Cleared by the receipt before full dark. The receipt is read out loud, in the street, in front of the men who almost hanged them, which is its own thing.",
      casper: "Spends the badge less than the face-down spent it. Earns the town's slow respect rather than its split. Becomes sheriff in seven years.",
      widow: "Adela tells you about the Monday-night sentence on her own porch the next morning, unprompted. The telling does not give her her husband back. It gives her a small piece of the truth she can carry.",
      record: "Sheriff's logbook: 'Deputy Renn obtained one-hour delay; saddlebags opened in the street; livery receipt produced; ledger sought. Suspects taken to church under guard. Rider dispatched.'",
      later: "Owen Lourd hanged lawfully in the spring. You attend as the senior peace officer of Bremmen Hollow. You do not pull the lever.",
    },
    tone: "The badge used as a lever to buy an hour, and the hour spent on the only paper that could turn the crowd.",
  },

  free_and_run: {
    id: "free_and_run",
    label: "Free them and run them to Edenmill",
    matchHints: [
      "I cut them loose and ride out",
      "we take them through the alley to the church and then ride",
      "I get them out of town tonight",
      "I draw and break them out",
      "I put them on horses and head east",
      "let the crowd come after us",
    ],
    timeline: [
      {
        beat: "19:45",
        consequence:
          "You take the three down the alley at a run, around the back of the smithy, to the freight barn. Bram Coate sees you go past the smithy door and says one word, 'Go,' and steps back into his doorway. You put the three on three of Owen's own freight horses because there is nothing else saddled. Dell Tomlin, in the barn, gives you a fourth without being asked. You are on the east road at 19:49 with four horses and the dusk.",
      },
      {
        beat: "Day 2",
        consequence:
          "You walk into the territorial marshal's office at 08:42 with the livery receipt from Pim Conder's saddle, which you took from the canvas roll at 19:46 in the alley behind the wagon. The marshal sends a circuit deputy and two riders back with you. You are in Bremmen Hollow at 16:30 the next afternoon. The freight ledger is found in Owen Lourd's wagon at 17:10. Owen is arrested at 17:15.",
      },
      {
        beat: "Years later",
        consequence:
          "You will be the deputy who rode three men out the back of his own town at dusk on stolen horses. The town will be of two minds about you for the rest of your life there. Hale Tirran will name his second son for you. You will not know about the naming for eleven years.",
      },
    ],
    secondOrder: {
      town: "Bremmen Hollow learns, in the days that follow, that the deputy chose the suspects over the crowd. The cattlemen's association is divided on whether to forgive this. The vote is 7–6 not to.",
      suspects: "All three alive and in Westmount by Friday. Pim Conder will not pass through Bremmen Hollow again. Hale will pass through twice in his life and once will stop for coffee at Adela Marsh's table.",
      casper: "Keeps the badge by the narrowest margin. Keeps his life. Spends two years living with the fact that the crowd that almost hanged three men is the same crowd he has Sunday dinner with.",
      widow: "Adela learns the truth two days later when Owen is arrested. She is in the courtroom in Edenmill in the spring. She does not look at Owen during sentencing. She looks at you, once, in the hallway after, and nods.",
      record: "Sheriff's logbook: 'Deputy Renn removed suspects from town under threat of unlawful hanging on 16th August; rode for Edenmill; returned with territorial circuit deputy 17th August. Suspects exonerated by livery receipt. Lourd arrested for the killing of Henry Marsh.'",
      later: "Owen Lourd hanged lawfully in the spring. The cottonwood is cut down by the council in your eleventh year as deputy on the motion of Bram Coate, seconded by Adela Marsh.",
    },
    tone: "The body taken between the crowd and the rope and ridden out of the town to find the law because the law was a day's ride from the town it was supposed to be in.",
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
