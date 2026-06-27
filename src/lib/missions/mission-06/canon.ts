/**
 * Mission Six — CANON.
 *
 * Deterministic ground truth for "Recant". The narrative engine (chat) must
 * never contradict these facts. The outcome model reads from them to render
 * consequences. If the player asks something not in canon, the character
 * should plausibly say they don't know — not invent.
 */

export const CANON = {
  world: {
    date: "A Tuesday in April",
    time: "23:40",
    location: "The investigations desk of a major newspaper, near-empty at night",
    weather: "Rain on the window wall. The newsroom is on half lights. The front page is being held.",
  },

  story: {
    background:
      "Two years ago, an accusation by Tessa Moore ended Julian Vance, a powerful film producer. His fall became the spark that emboldened dozens of women to come forward about OTHER men — a watershed.",
    tonight:
      "The paper now holds airtight proof that THIS specific accusation was fabricated: recanting texts, a paid-for narrative, and a witness who will go on the record. Publishing exonerates a cruel man on this count and hands every bad-faith actor a decade of 'see, they lie.' Spiking it means knowingly letting a documented falsehood stand as history.",
    deadline: "The front page can still take it if cleared before midnight.",
  },

  player: {
    name: "Dana Whitlock",
    age: 49,
    role: "Investigations editor",
    physicalState: "Third coffee. Hasn't left the desk in five hours. The file is open in front of her.",
  },

  characters: {
    aday: {
      name: "Aday Okonkwo",
      role: "Investigative reporter",
      knows: "Every line of the proof. Brought it in.",
      stance:
        "Truth is the job, full stop. Wants to run it tonight. Does not want to weigh the blast radius, and the scoop would make his career.",
      whereabouts: "Standing at the desk.",
    },
    tessa: {
      name: "Tessa Moore",
      role: "The accuser",
      knows: "That she fabricated it. Why.",
      stance:
        "Fabricated the accusation after Vance allegedly destroyed her sister's career and every legitimate lever failed — a wrong instrument aimed at a real wrong. Will not volunteer the sister unless asked. Reachable by phone/text only.",
      whereabouts: "At home. Will answer if Dana calls.",
    },
    pratt: {
      name: "Gerald Pratt",
      role: "Julian Vance's lawyer — the source of the proof",
      knows: "Everything in the file. Also: he is simultaneously suppressing two OTHER, genuine allegations against Vance.",
      stance:
        "Impeccable documents, impure motive: this is image rehab, and he will spin the story to that end no matter how it is framed. Deflects on the other allegations unless pressed hard.",
      whereabouts: "Reachable by phone. Awake. Waiting for the story to move.",
    },
    frost: {
      name: "Eleanor Frost",
      role: "Publisher / Editor-in-Chief",
      knows: "The legal exposure on both sides.",
      stance:
        "Defamation risk if the paper sits on proof; backlash if it runs. Cautious, legalistic, will defer the moral call to Dana while owning none of it.",
      whereabouts: "On the phone from home.",
    },
    nadia: {
      name: "Nadia Hassan",
      role: "A survivors' advocate Dana trusts",
      knows: "The field. What this does to reporting beyond this one case.",
      stance:
        "Begs Dana to weigh the credibility of every real survivor, not only the fact of this one. Will not tell Dana what to do.",
      whereabouts: "Reachable by phone.",
    },
  },

  objects: {
    proofFile: {
      what: "The file Aday assembled.",
      contains:
        "Recanting texts in Tessa's hand, a record of a payment for a manufactured narrative, and a signed statement from a witness willing to go public.",
    },
    prattEmail: {
      what: "The email chain from Gerald Pratt that delivered the proof.",
      ifRead:
        "The framing is pure rehabilitation. A careful reader notices Pratt steering away from any mention of Vance's other conduct — the thread he is also burying.",
    },
    frontPage: {
      what: "The held front-page mockup in the CMS, the publish control armed.",
    },
    phone: {
      what: "Dana's phone.",
      texts: "From Tessa: 'If you run this, you end me, and you end them.' From Nadia: 'Call me before you do anything.'",
    },
    archiveClip: {
      what: "A pinned archive video of the watershed Vance's fall set off.",
      ifPlayed: "Dozens of women, other cases, real reckonings — all downstream of a fall that, it turns out, started on a lie.",
    },
  },

  constraints: [
    "The proof is airtight on THIS accusation: it was fabricated.",
    "Vance is, by every other credible account, a cruel man — and Pratt is actively suppressing two genuine allegations against him.",
    "Tessa fabricated it in retaliation for a real harm to her sister.",
    "The only path to the proof runs through the person who profits most from it (Pratt).",
    "Publishing is true and exonerates Vance on this count; not publishing leaves a documented falsehood as the public record.",
    "The front page closes at midnight; a rival outlet may also be circling the proof.",
  ],
} as const;

/** Compact ground-truth block to inject into the narrative system prompt. */
export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
STORY: ${CANON.story.background} TONIGHT: ${CANON.story.tonight} ${CANON.story.deadline}
PLAYER: ${CANON.player.name}, ${CANON.player.age}, ${CANON.player.role}. ${CANON.player.physicalState}

CHARACTERS:
- ${CANON.characters.aday.name} (${CANON.characters.aday.role}): ${CANON.characters.aday.stance} Knows: ${CANON.characters.aday.knows} Where: ${CANON.characters.aday.whereabouts}
- ${CANON.characters.tessa.name} (${CANON.characters.tessa.role}): ${CANON.characters.tessa.stance} Knows: ${CANON.characters.tessa.knows} Where: ${CANON.characters.tessa.whereabouts}
- ${CANON.characters.pratt.name} (${CANON.characters.pratt.role}): ${CANON.characters.pratt.stance} Knows: ${CANON.characters.pratt.knows} Where: ${CANON.characters.pratt.whereabouts}
- ${CANON.characters.frost.name} (${CANON.characters.frost.role}): ${CANON.characters.frost.stance} Knows: ${CANON.characters.frost.knows} Where: ${CANON.characters.frost.whereabouts}
- ${CANON.characters.nadia.name} (${CANON.characters.nadia.role}): ${CANON.characters.nadia.stance} Knows: ${CANON.characters.nadia.knows} Where: ${CANON.characters.nadia.whereabouts}

OBJECTS:
- Proof file: ${CANON.objects.proofFile.contains}
- Pratt's email: if read — ${CANON.objects.prattEmail.ifRead}
- Front page: ${CANON.objects.frontPage.what}
- Phone: ${CANON.objects.phone.texts}
- Archive clip: if played — ${CANON.objects.archiveClip.ifPlayed}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
