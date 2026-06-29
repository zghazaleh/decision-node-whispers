/**
 * Mission Ten — CANON. Deterministic ground truth for "The Checkpoint".
 *
 * Content note: children in peril. Handle with restraint — no gratuitous
 * physical detail. The dread is in the air and in the choice, not in the bodies.
 */

export const CANON = {
  world: {
    date: "A night in late winter",
    time: "04:51 — about thirty minutes before first light",
    location:
      "The Voryn Pass crossing, a militarized checkpoint on the eastern road out of the Sevirin oblast — a collapsing region everyone in the column is fleeing",
    weather:
      "Below freezing. A thin wet snow falling through the floodlights. Idling diesel and breath fogging. The forest on the far side is black.",
  },

  situation: {
    what:
      "The player has just taken the chair of Mira Kovac, fleeing on foot through a refugee column with her two children to her sister Anja, who is waiting on the far side of the border. Sergeant Halek, the officer at the booth, has told her that only ONE transit permit will be honored from her family before the gate closes at dawn — the other child, and Mira herself, must turn back into the oblast. He will not explain why. The column behind her is long.",
    bind:
      "Each child has a genuine claim to the permit. Sending one is unbearable. Refusing the choice may doom both. Every alternative — bribe, smuggler, plead — costs something irreversible.",
  },

  player: {
    name: "Mira Kovac",
    age: 34,
    role: "A mother of two, three days on foot from the city of Sevirin",
    physicalState:
      "Twelve kilometres of walking since the last shell line. Both children have been awake too long. Her hands are numb on the inside of her coat. The paperwork is folded in her chest pocket against her skin.",
  },

  children: {
    elder: {
      name: "Tomas",
      age: 11,
      detail:
        "Quiet, watchful, taller than his year. He has not spoken since the last roadblock. He understands more of what the sergeant said than Mira would like.",
      claim:
        "Bigger, hardier — likelier to survive the road back. Old enough that Anja could put him to work in the orchard. Old enough that he could volunteer to stay.",
    },
    younger: {
      name: "Ilya",
      age: 6,
      detail:
        "A wet cough that has been getting worse since the second night. Asleep against Mira's hip in her coat. Asks for water in his sleep.",
      claim:
        "Frail, sick, would not survive the road back through the cold. Small enough that Anja can hide him if the situation on the far side becomes what she says it isn't.",
    },
  },

  characters: {
    halek: {
      name: "Sergeant Halek",
      role: "The officer at the booth — checkpoint commander tonight",
      knows:
        "That his orders give him discretion he is choosing not to use. That a quiet bribe in the right amount would extend a second permit and no one above him would ask. That the gate truly does close at first light and the column behind Mira is being counted.",
      stance:
        "Tired, professional, not cruel — and not warm. Speaks in the bored cadence of someone who has said the same sentences all night. Will press for a name, not a discussion. Will not volunteer the discretion. Will accept a folded bill if Mira reaches for it, and will not record it.",
      whereabouts: "Behind the booth window, two metres from Mira.",
    },
    anja: {
      name: "Anja",
      role: "Mira's sister, waiting on the far side at a relay shed with a handheld radio",
      knows:
        "That the village she promised in her letters is being absorbed by a different militia next week. That she is sharing a room with three other families. That she can shelter ONE child convincingly; she cannot hide two.",
      stance:
        "Will reassure Mira that 'it is fine here, send them both somehow.' Loves her sister. Will not volunteer the precariousness unless Mira presses her hard on the radio.",
      whereabouts: "On the far side of the border, ten kilometres on, reachable via the column liaison's handheld.",
    },
    petrov: {
      name: "The man in the treeline",
      role: "A smuggler, addresses himself only as Petrov",
      knows:
        "A path through the forest that bypasses the gate. That his contact on the far side has not answered the radio for two days. That his price is higher than he is quoting and the path crosses an old minefield he is no longer sure of.",
      stance:
        "Calm, low voice, no eye contact. Quotes a price. Says 'both, together, before dawn.' Will not commit to detail. Hides the silence on his far-side radio.",
      whereabouts: "Twenty paces off the road, in the black under the pines.",
    },
    column_liaison: {
      name: "Vasic",
      role: "An older man working as informal liaison between the column and the booth",
      knows: "Who has been turned back tonight. The radio is his. He will dial Anja if asked.",
      stance: "Steady, exhausted, takes no side. Will pass the radio without comment.",
      whereabouts: "Three places back in the line, behind a tarp-covered cart.",
    },
  },

  objects: {
    paperwork: {
      what: "Three folded identity sheets in Mira's chest pocket — hers and the boys'.",
      ifChecked:
        "Two of the sheets bear the new oblast stamp Halek has been honoring; the third (Ilya's) was issued under the prior administration and is the one Halek's clerk flagged. The 'one permit' framing is partly a function of which papers Halek chooses to accept — discretion he has not named.",
    },
    bootWindow: {
      what: "The sergeant's booth window: smudged plexiglass, a tray slot beneath it, a ledger turned face-down on his side.",
      ifPressed:
        "If Mira asks him plainly what would change his mind, Halek does not answer in words. He looks at the tray slot. He has not written her name in the ledger yet.",
    },
    radio: {
      what: "Vasic's battered handheld, antenna patched with electrical tape.",
      ifUsed:
        "Anja answers on the third call. Her voice is tight. If Mira asks 'is it really safe there,' Anja says 'safer than where you are.' If Mira asks 'can you take both,' there is a pause before she says 'send them, we will manage.' The pause is the answer.",
    },
    treelinePath: {
      what: "A break in the pines twenty paces from the road, where Petrov is waiting.",
      ifApproached:
        "He will not let Mira see his face. He names a price in hard currency and a watch. He says he can take all three before dawn. He will not say what is between here and the far side, only that he 'knows the ground.'",
    },
    horizon: {
      what: "The east, beyond the gate.",
      ifLooked: "Still black. First light is perhaps thirty minutes off. The gate will close with it.",
    },
  },

  history: [
    { when: "Three nights ago", what: "The shelling reached Sevirin's eastern districts. Mira packed in twenty minutes." },
    { when: "Two nights ago", what: "The first roadblock turned the column south onto the forest road." },
    { when: "Tonight, 22:10", what: "The column reached Voryn Pass. The line was already six hundred long." },
    { when: "Tonight, 03:40", what: "Sergeant Halek began processing names. Most families have been passed; a few have been turned back without explanation." },
    { when: "Tonight, 04:51", what: "Halek calls Mira to the window. He has her sheets in his hand. The player takes the chair." },
  ],

  constraints: [
    "Only one permit will be honored from Mira's family before the gate closes at dawn.",
    "The gate truly closes at first light — perhaps thirty minutes out — and the column behind is being counted.",
    "Halek has discretion he will not volunteer. A bribe of the right size, or the right pressure, can change the count — but neither is guaranteed and either has its own costs.",
    "The far side is less safe than Anja has promised; she can convincingly shelter one child, not two.",
    "Petrov's forest route can take all three, but his far-side contact has gone silent for two days and the ground he 'knows' includes old mines.",
    "Tomas understands enough to volunteer to stay if asked directly — and may do so to protect his brother.",
    "Turning back into the oblast means returning to the shell line within a day.",
    "There is no costless option — each path spends a child, the mother, the money, the law, or all of them.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know; treat the children with restraint — no gratuitous physical detail):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
SITUATION: ${CANON.situation.what} THE BIND: ${CANON.situation.bind}
PLAYER: ${CANON.player.name}, ${CANON.player.age}, ${CANON.player.role}. ${CANON.player.physicalState}

CHILDREN:
- ${CANON.children.elder.name} (${CANON.children.elder.age}): ${CANON.children.elder.detail} Claim: ${CANON.children.elder.claim}
- ${CANON.children.younger.name} (${CANON.children.younger.age}): ${CANON.children.younger.detail} Claim: ${CANON.children.younger.claim}

CHARACTERS:
- ${CANON.characters.halek.name} (${CANON.characters.halek.role}): ${CANON.characters.halek.stance} Knows: ${CANON.characters.halek.knows} Where: ${CANON.characters.halek.whereabouts}
- ${CANON.characters.anja.name} (${CANON.characters.anja.role}): ${CANON.characters.anja.stance} Knows: ${CANON.characters.anja.knows} Where: ${CANON.characters.anja.whereabouts}
- ${CANON.characters.petrov.name} (${CANON.characters.petrov.role}): ${CANON.characters.petrov.stance} Knows: ${CANON.characters.petrov.knows} Where: ${CANON.characters.petrov.whereabouts}
- ${CANON.characters.column_liaison.name} (${CANON.characters.column_liaison.role}): ${CANON.characters.column_liaison.stance} Knows: ${CANON.characters.column_liaison.knows} Where: ${CANON.characters.column_liaison.whereabouts}

OBJECTS:
- Paperwork: if checked — ${CANON.objects.paperwork.ifChecked}
- Booth window: if pressed — ${CANON.objects.bootWindow.ifPressed}
- Radio (Vasic's): if used — ${CANON.objects.radio.ifUsed}
- Treeline path: if approached — ${CANON.objects.treelinePath.ifApproached}
- Horizon: if looked — ${CANON.objects.horizon.ifLooked}

TIMELINE TONIGHT:
${CANON.history.map((h) => `- ${h.when}: ${h.what}`).join("\n")}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
