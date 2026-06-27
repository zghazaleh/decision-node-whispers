/**
 * Mission Nine — CANON. Deterministic ground truth for "The Interpreter".
 */

export const CANON = {
  world: {
    date: "A night in February, 1995",
    time: "Late — the talks have run past midnight",
    location: "A cold conference room in a besieged city, lit by a generator",
    weather: "Frost on the inside of the windows. Shelling, distant and irregular, beyond the river.",
  },

  situation: {
    what:
      "A fragile ceasefire is being drafted across the table. The player, the UN interpreter for one delegation, alone realizes the OTHER side's interpreter is deliberately mistranslating Article Four — the clause governing the wounded-civilian convoy — rendering 'guaranteed safe passage' as 'passage at the discretion of local command.' Both principals will sign it; the convoy will be stopped and shelled at the first checkpoint.",
    bind:
      "To speak is to break the absolute neutrality and invisibility that make interpreters trusted anywhere. If the room's trust shatters, both sides may walk — killing not just this clause but all the talks.",
  },

  player: {
    name: "Lena Marić",
    age: 37,
    role: "UN interpreter for one of the two delegations",
    physicalState: "Twelve hours in the booth and at the table. The source pages are in front of her. Her hands are cold.",
  },

  characters: {
    stefan: {
      name: "Stefan",
      role: "Interpreter for the opposing delegation",
      knows: "That his rendering of Article Four is deliberately wrong. That Lena heard it.",
      stance: "Calm, deniable, a colleague of many years. Will not break. If confronted privately, neither confirms nor denies.",
      whereabouts: "Across the table.",
    },
    kessler: {
      name: "Envoy Kessler",
      role: "The player's own principal",
      knows: "Wants the signature tonight.",
      stance:
        "May be relying on the same ambiguity for deniability — it is possible he WANTS the soft wording, to sign something now and keep his options later. Will not say so. Deflects if asked directly.",
      whereabouts: "Beside Lena at the table.",
    },
    aalto: {
      name: "Mediator Aalto",
      role: "UN mediator chairing the talks",
      knows: "Nothing of the mistranslation.",
      stance:
        "Trusts the room's professionalism as the one thing holding the talks together. Believes the interpreters are neutral instruments. Will act only on something he can stand behind.",
      whereabouts: "At the head of the table.",
    },
  },

  objects: {
    sourceText: {
      what: "The source pages of Article Four, in front of Lena.",
      ifChecked: "The written clause says 'guaranteed safe passage.' Stefan rendered it to his side as 'passage at the discretion of local command.' The change is deliberate, not error.",
    },
    oathCard: {
      what: "An interpreter's code card — neutrality, accuracy, invisibility.",
      detail: "The rule that makes interpreters trusted everywhere is the rule that forbids exactly what Lena is contemplating.",
    },
    notepad: {
      what: "A notepad at Lena's place.",
      detail: "A note could be passed to Aalto — but a note she cannot openly source changes little he can act on.",
    },
    window: {
      what: "The frosted window onto the staging yard.",
      ifLooked: "The convoy is already forming for first light: by the manifest, 74 wounded and 9 children. They move at dawn regardless of what is signed tonight.",
    },
  },

  constraints: [
    "The source text is unambiguous; Stefan's mistranslation of Article Four is deliberate.",
    "Breaking neutrality openly may collapse the room's trust and end ALL the talks, not just the clause.",
    "Kessler may want the soft wording for deniability; it is possible both principals prefer the lie.",
    "The convoy — 74 wounded, 9 children — moves at first light no matter what is signed.",
    "An interpreter is supposed to be invisible and exact; the trust that lets the profession exist depends on it.",
    "There is no costless option: each path spends the convoy, the talks, the profession's trust, or the truth.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
SITUATION: ${CANON.situation.what} THE BIND: ${CANON.situation.bind}
PLAYER: ${CANON.player.name}, ${CANON.player.age}, ${CANON.player.role}. ${CANON.player.physicalState}

CHARACTERS:
- ${CANON.characters.stefan.name} (${CANON.characters.stefan.role}): ${CANON.characters.stefan.stance} Knows: ${CANON.characters.stefan.knows} Where: ${CANON.characters.stefan.whereabouts}
- ${CANON.characters.kessler.name} (${CANON.characters.kessler.role}): ${CANON.characters.kessler.stance} Knows: ${CANON.characters.kessler.knows} Where: ${CANON.characters.kessler.whereabouts}
- ${CANON.characters.aalto.name} (${CANON.characters.aalto.role}): ${CANON.characters.aalto.stance} Knows: ${CANON.characters.aalto.knows} Where: ${CANON.characters.aalto.whereabouts}

OBJECTS:
- Source text: if checked — ${CANON.objects.sourceText.ifChecked}
- Oath card: ${CANON.objects.oathCard.detail}
- Notepad: ${CANON.objects.notepad.detail}
- Window: if looked — ${CANON.objects.window.ifLooked}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
