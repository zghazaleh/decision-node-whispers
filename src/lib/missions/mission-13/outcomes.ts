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
        beat: "23:16",
        consequence:
          "Vord and Halse come down the stairs into the gaslight. You hand them the prisoner with the file number. You key the radio: 'Subject in custody.' Korst answers in three seconds.",
      },
      {
        beat: "Week 1",
        consequence:
          "Halden Roth is arraigned under his old name. The barge-repair shop closes within nine days. His four employees scatter; one returns to the prison rolls within the year. The niece's term at Valdeck Technical lapses mid-semester.",
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
        beat: "23:16",
        consequence:
          "Vord and Halse arrive into the gaslight. You tell them the subject fled south before you could descend the stairs and direct the sweep accordingly. They go. You key the radio: 'Subject not located. Reorganizing.' Korst's silence on the line is a second long.",
      },
      {
        beat: "Week 1",
        consequence:
          "Roth disappears from Halverin within thirty-six hours. The shop is sold for cost to a cousin. The four employees keep their jobs. The niece's tuition is paid through the term by a banker's draft in a name Maslek does not recognize.",
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
        beat: "23:16",
        consequence:
          "Vord writes it in her duty book in the rain. Halse stands with his mouth open. You key the radio: 'Korst, this is Maslek. Subject released by my hand. Resigning at first light. Out.' You set the radio down on the cobbles.",
      },
      {
        beat: "Week 1",
        consequence:
          "You are stripped of the inspector's title, the pension is partial, the city papers carry the resignation with two paragraphs of speculation. The Magistrate's office takes the moment to revisit Korst's bribe inquiry while a senior officer is publicly on record about institutional discretion.",
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
        beat: "23:16",
        consequence:
          "Vord and Halse take the prisoner. You write the rescue into the arrest report in your own hand at the gaslamp before you leave, dated and timed, with Pieter Solm's name and address. You key the radio: 'Subject in custody — rescue circumstances on the report.' Korst's pause this time is two seconds.",
      },
      {
        beat: "Hearing",
        consequence:
          "You testify to the rescue, to the eleven years of clean record, and — if you opened the file's margin tonight or asked Roth about the original crime — to what you learned about the famine year. The magistrate retains the original sentence but waives the five-year evasion enhancement. Roth serves the outstanding four.",
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
        beat: "23:16",
        consequence:
          "Vord and Halse arrive. You tell them the rescuer was a stranger you could not identify in the dark and the rain and the spray. You key the radio: 'No identification possible. Subject of file separate matter — no lead.' Korst's silence is short.",
      },
      {
        beat: "Week 1",
        consequence:
          "Roth disappears; the shop closes more orderly than a sudden flight; the niece's tuition is paid by anonymous draft. Pieter Solm tells the dock-master the rescuer was 'a man — a man,' and trails off, because he overheard you turn your face.",
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
