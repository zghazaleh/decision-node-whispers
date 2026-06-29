/**
 * Mission Thirteen — "The Pursuit" — OUTCOME MODEL.
 *
 * Five defensible archetypes. None is the "right" answer.
 */

export type ArchetypeId =
  | "arrest_clean"
  | "release_clean"
  | "release_and_resign"
  | "arrest_and_advocate"
  | "look_away"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    fugitive: string;
    boy: string;
    maslek: string;
    superior: string;
    bureau: string;
    record: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  arrest_clean: {
    id: "arrest_clean",
    label: "Arrest him",
    matchHints: [
      "I cuff him",
      "I take him in",
      "arrest under file 24611",
      "I make the collar",
      "subject in custody",
      "the law is the law",
    ],
    timeline: [
      {
        beat: "23:14",
        consequence:
          "You reach for the cuffs. Roth offers his wrists without speaking. Pieter Solm watches without understanding. The iron closes with a sound the rain almost covers.",
      },
      {
        beat: "23:16",
        consequence:
          "Vord and Halse come down the stairs into the gaslight. You hand them the prisoner with the file number. You key the radio: 'Subject in custody.' Korst answers in three seconds.",
      },
      {
        beat: "Morning",
        consequence:
          "Chief-Inspector Korst manages the press notice personally before noon. The Vance file is closed in the seasonal report. The Magistrate's office quietly drops its inquiry into Korst's conduct that afternoon.",
      },
      {
        beat: "Week 1",
        consequence:
          "Halden Roth is arraigned under his old name. The barge-repair shop closes within nine days. His four employees scatter; one returns to the prison rolls within the year. The niece's term at Valdeck Technical lapses mid-semester.",
      },
      {
        beat: "Year 1",
        consequence:
          "Roth begins serving the eight outstanding years plus the five-year evasion enhancement. He is a model prisoner. Pieter Solm asks at the dock-master's hut who the man was; nobody will tell him.",
      },
      {
        beat: "Years later",
        consequence:
          "You complete a clean retirement at the rank of senior inspector with the largest closed file of your career. You read the oath at the closing ceremony of a younger man's class and the closing line catches in your throat in a way it did not used to.",
      },
    ],
    secondOrder: {
      fugitive: "Served fourteen years from the dock to release. Alive at fifty-eight. The rebuilt life ends.",
      boy: "Saved tonight, told nothing, remembers a stranger and a constable in the same circle of light.",
      maslek: "Held the line he was sworn to. Carries the boy's face and the file weight separately.",
      superior: "Got the closed file he needed. The bribe inquiry quietly faded.",
      bureau: "Cleared a flagship file on schedule. Used as a model in next year's training cycle.",
      record: "File 24611 closed under original offense line, never amended.",
    },
    tone: "The cleanness of a rule that does not bend.",
  },

  release_clean: {
    id: "release_clean",
    label: "Let him go",
    matchHints: [
      "I let him walk",
      "tell him to go",
      "I release him",
      "subject not located",
      "I never saw him clearly",
      "go now, don't run",
    ],
    timeline: [
      {
        beat: "23:14",
        consequence:
          "You lower the revolver to your side. You say one sentence — 'Get up, Mr. Roth. Walk north along the embankment, not south. Slowly.' He stands. The rain hits the cobbles. He goes.",
      },
      {
        beat: "23:16",
        consequence:
          "Vord and Halse arrive into the gaslight. You tell them the subject fled south before you could descend the stairs and direct the sweep accordingly. They go. You key the radio: 'Subject not located. Reorganizing.' Korst's silence on the line is a second long.",
      },
      {
        beat: "Morning",
        consequence:
          "Korst is at your desk at 08:30. He has questions. You answer them in your own voice. The file remains open under your name. Pieter Solm tells the dock-master his rescuer was 'a man with a beard who went up the stairs.'",
      },
      {
        beat: "Week 1",
        consequence:
          "Roth disappears from Halverin within thirty-six hours. The shop is sold for cost to a cousin. The four employees keep their jobs. The niece's tuition is paid through the term by a banker's draft in a name Maslek does not recognize.",
      },
      {
        beat: "Year 1",
        consequence:
          "You take a quiet reprimand and a lateral transfer to records. Korst stops mentioning the file. A bribe inquiry into Korst is reopened by the Magistrate's office in spring; you are asked to testify and do.",
      },
      {
        beat: "Years later",
        consequence:
          "You finish your service without a flagship case to your name. You eat dinner alone most nights. You do not know what became of Halden Roth and you have decided not to inquire.",
      },
    ],
    secondOrder: {
      fugitive: "Disappears in thirty-six hours. The rebuilt life continues somewhere it is not Halverin.",
      boy: "Remembers a stranger and an inspector who let him go home.",
      maslek: "Bent the rule that defined him. Carries the asymmetry of having been right by his own measure and wrong by the oath.",
      superior: "Loses the file he needed. The bribe inquiry survives him.",
      bureau: "An unclosed flagship file under a senior inspector's name. A small institutional embarrassment.",
      record: "File 24611 remains open. Inspector noted 'subject not located, sweep negative.'",
    },
    tone: "The mercy that costs the oath that asked for it.",
  },

  release_and_resign: {
    id: "release_and_resign",
    label: "Let him go and resign your post",
    matchHints: [
      "I let him go and resign",
      "I turn in my badge",
      "release him and step down",
      "I cannot serve and have done this",
      "my resignation by morning",
      "I release him; I quit",
    ],
    timeline: [
      {
        beat: "23:14",
        consequence:
          "You lower the revolver. You tell Roth to walk north. He goes. You stand in the gaslamp's circle until Vord and Halse arrive, and you tell them — by name, on the record — that you released Halden Roth, formerly Lior Vance, file 24611, of your own decision, and that you will report yourself in the morning.",
      },
      {
        beat: "23:16",
        consequence:
          "Vord writes it in her duty book in the rain. Halse stands with his mouth open. You key the radio: 'Korst, this is Maslek. Subject released by my hand. Resigning at first light. Out.' You set the radio down on the cobbles.",
      },
      {
        beat: "Morning",
        consequence:
          "Your written resignation is on Korst's desk at 06:00 with the file beneath it. The Bureau opens an internal inquiry the same day. Roth has already gone.",
      },
      {
        beat: "Week 1",
        consequence:
          "You are stripped of the inspector's title, the pension is partial, the city papers carry the resignation with two paragraphs of speculation. The Magistrate's office takes the moment to revisit Korst's bribe inquiry while a senior officer is publicly on record about institutional discretion.",
      },
      {
        beat: "Year 1",
        consequence:
          "You take work as a clerk in a barge-line counting-house. You no longer carry the oath in your mouth. You teach Pieter Solm — who has by now found his way to your door — to read a manifest sheet.",
      },
      {
        beat: "Years later",
        consequence:
          "You die at sixty-eight with no flagship case and a small attendance at the burial. One of the four men who kept his job at Roth's shop sends a wreath.",
      },
    ],
    secondOrder: {
      fugitive: "Disappears with a clean head start; the rebuilt life continues elsewhere.",
      boy: "Knows what was done and by whom. Will remember the resignation, not the rescue.",
      maslek: "Refuses to keep the badge that the act made hollow. Pays the full price of the choice in his own name.",
      superior: "Loses the file AND faces the publicity Maslek's resignation invites onto the bribe inquiry.",
      bureau: "Has a written record of a senior inspector's principled disobedience. Bad for morale; useful for reformers.",
      record: "File 24611 closed by Maslek's signed admission, not by capture. A precedent that will be cited.",
    },
    tone: "Paying for the mercy with the office that made it cost something.",
  },

  arrest_and_advocate: {
    id: "arrest_and_advocate",
    label: "Arrest him and testify to the rescue",
    matchHints: [
      "I cuff him but ask for leniency",
      "arrest and seek a lighter sentence",
      "take him in and testify for him",
      "I'll vouch at the hearing",
      "arrest, then advocate",
      "in custody but I'll speak for him",
    ],
    timeline: [
      {
        beat: "23:14",
        consequence:
          "You cuff him. You tell Pieter Solm his rescuer's name, in front of Roth, so the boy will remember it. You tell Roth, in front of the boy, that you will speak at the hearing.",
      },
      {
        beat: "23:16",
        consequence:
          "Vord and Halse take the prisoner. You write the rescue into the arrest report in your own hand at the gaslamp before you leave, dated and timed, with Pieter Solm's name and address. You key the radio: 'Subject in custody — rescue circumstances on the report.' Korst's pause this time is two seconds.",
      },
      {
        beat: "Morning",
        consequence:
          "Korst manages the press notice but the rescue paragraph is in the report and cannot be removed without surfacing. The shop is closed; the employees scatter. You file a formal letter to the sentencing magistrate within the week.",
      },
      {
        beat: "Hearing",
        consequence:
          "You testify to the rescue, to the eleven years of clean record, and — if you opened the file's margin tonight or asked Roth about the original crime — to what you learned about the famine year. The magistrate retains the original sentence but waives the five-year evasion enhancement. Roth serves the outstanding four.",
      },
      {
        beat: "Year 1",
        consequence:
          "Roth serves a reduced term. The shop reopens under his cousin's name and one employee. Pieter Solm visits him in the work-camp once. You receive a private censure from Korst for 'editorialising in an arrest report' that does not appear on your file.",
      },
      {
        beat: "Years later",
        consequence:
          "Roth is released at fifty-three rather than fifty-eight. He rebuilds smaller. You retire at rank, with the file closed and a margin notation in your own hand that the magistrate read aloud.",
      },
    ],
    secondOrder: {
      fugitive: "Serves four years instead of fourteen. Rebuilt life takes a real wound but does not end.",
      boy: "Knows the name. Visits. Will testify himself when asked.",
      maslek: "Keeps the oath AND speaks for the man it took. Pays a quiet career cost; carries the choice in working order.",
      superior: "Gets the closed file but cannot use it as cleanly. The bribe inquiry is not derailed.",
      bureau: "Has an arrest report on file that frames the prisoner alongside the rescue, in a senior inspector's hand.",
      record: "File 24611 closed by arrest. Hearing transcript includes the inspector's testimony; sentence enhancement waived.",
    },
    tone: "Using the office to soften what the office requires.",
  },

  look_away: {
    id: "look_away",
    label: "Look away and claim you never saw him",
    matchHints: [
      "I never saw his face",
      "I look away",
      "claim I couldn't tell in the rain",
      "deny it was him",
      "say the rescuer was a stranger",
      "lie about the identification",
    ],
    timeline: [
      {
        beat: "23:14",
        consequence:
          "You turn your face out of the gaslamp's circle, into the rain. You do not speak to Roth. He does not move. After perhaps four seconds you say, without turning, 'Go.' He goes. You wait the remaining seconds with the boy.",
      },
      {
        beat: "23:16",
        consequence:
          "Vord and Halse arrive. You tell them the rescuer was a stranger you could not identify in the dark and the rain and the spray. You key the radio: 'No identification possible. Subject of file separate matter — no lead.' Korst's silence is short.",
      },
      {
        beat: "Morning",
        consequence:
          "Korst questions you with the file open on his desk. You repeat the line. He does not believe you and cannot prove it. The file stays open.",
      },
      {
        beat: "Week 1",
        consequence:
          "Roth disappears; the shop closes more orderly than a sudden flight; the niece's tuition is paid by anonymous draft. Pieter Solm tells the dock-master the rescuer was 'a man — a man,' and trails off, because he overheard you turn your face.",
      },
      {
        beat: "Year 1",
        consequence:
          "You are passed over for a promotion that was already unlikely. You finish your service without incident and without distinction. The lie compounds in small ways: a younger inspector asks about the case and you have a story for him.",
      },
      {
        beat: "Years later",
        consequence:
          "You retire on schedule. The file is reassigned and quietly archived. You have kept the office and lost something else, and the boy on the dock — now a man — does not visit.",
      },
    ],
    secondOrder: {
      fugitive: "Disappears with a head start. Rebuilt life continues elsewhere.",
      boy: "Saw the turn of the face. Will not say so; will not forget.",
      maslek: "Kept the oath in writing and broke it under the writing. Carries the lie at the line of his own jaw.",
      superior: "Loses the file but the discretion is plausibly deniable; the bribe inquiry runs its course.",
      bureau: "Records an inconclusive sighting; nothing useful for either reform or pretense.",
      record: "File 24611 remains open under 'no identification possible.' Inspector's name on the line.",
    },
    tone: "Keeping the badge by keeping a quiet untruth.",
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
