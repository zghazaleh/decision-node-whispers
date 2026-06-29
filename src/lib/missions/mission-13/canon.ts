/**
 * Mission Thirteen — CANON. Deterministic ground truth for "The Pursuit".
 */

export const CANON = {
  world: {
    date: "A Thursday in late autumn",
    time: "23:14 — a held moment after the rescue, before the patrol whistles reach the dock",
    location:
      "The lower stone quay of Saint-Verriere Dock, on the Mervaise River in the port city of Halverin",
    weather:
      "Heavy slanting rain. The river is up after three days of it. A single gas-lamp on a cast-iron post throws a wet halo across the cobbles; everything outside its circle is the colour of the river.",
  },

  player: {
    name: "Inspector Theron Maslek",
    age: 47,
    role:
      "Senior inspector of the Halverin Bureau of Criminal Apprehension, division three (parole violations and fugitives at large). Twenty-three years on the force. Has chased one name across most of them.",
    physicalState:
      "Soaked greatcoat. Service revolver in the right hand, hammer not cocked. The chain of the regulation handcuffs at the left hip. Breath fogging. Right knee aching from the chase up the river-stairs.",
    oath:
      "Sworn on the Halverin civic register at age twenty-four. The closing line of the oath is in the player's mouth as a reflex: 'and to bend to no person, no purse, and no pity.'",
  },

  fugitive: {
    record_name: "Convict 24611 — Lior Vance",
    current_name: "Halden Roth",
    rebuilt_life:
      "For the past eleven years Roth has run a small barge-repair shop on the south bank of the Mervaise, has employed four men with prison records, has put a niece through the technical school in Valdeck, and has not been charged with so much as a public-house brawl.",
    record_offense:
      "BUREAU FILE 24611 (as it reads): 'Aggravated burglary of the Veska grain reserve, 12th of Frostmonth, sixteen years prior. Sentence: eight years hard labor. Escaped en route to the work camp on the third day. At large since.'",
    actual_offense:
      "What the file does not contain and what Roth has never been asked: the 'reserve' was a private merchant's hoarded grain during the Veska famine year. Lior Vance, then nineteen, broke the seal and distributed the grain to the parish. The merchant — a council-bench supporter of the magistrate who tried the case — pressed for the maximum sentence and the record was written in the merchant's words. Vance escaped after a guard beat him unconscious for refusing to name his accomplices. None of this is in the file Maslek has carried for twenty-three years; it is reachable only by recalling the old parish testimony that was struck from the record, or by asking Roth directly what he did and why.",
  },

  incident: {
    what:
      "Three minutes before the opening, a coal-barge mooring line parted in the rain and a dock-boy named Pieter Solm went into the Mervaise. The river is fast and cold. Halden Roth, who was passing on his way home from the shop, went off the quay in his coat and pulled the boy out at the second buttress. Both are alive. Roth is on his knees on the cobbles with the boy coughing river water beside him. That is the moment Maslek came up the stairs and recognized the face he has carried in a sketch for sixteen years.",
    witness:
      "Pieter Solm, the saved boy, age fourteen, soaked and shaking, does not know the man's name or face. He saw only that a stranger went in after him.",
    seen_by_others:
      "Two longshoremen at the head of the quay saw a rescue; they did not see Maslek's face or hear the recognition. They have already moved off toward the dock-master's hut for blankets.",
  },

  pressure: {
    backup:
      "Maslek triggered his patrol whistle on the stair before the rescue ended. Two constables are running from the upper quay; they will be at the gaslamp in approximately ninety seconds.",
    superior:
      "Chief-Inspector Vael Korst is at the Bureau house tonight, three streets up, awaiting the radio. Korst has been pressing for a 'major closed file' for the seasonal report to the Magistrate; the Vance case is the largest open file on Maslek's desk.",
    consequence_if_arrested:
      "Roth re-arrested under file 24611 is processed under the original sentence (eight years, four still outstanding) plus a mandatory additional five years for sixteen years of evasion. He will be fifty-eight at release. His shop closes; his four employees lose work; his niece's tuition lapses mid-term.",
    consequence_if_released:
      "If Maslek lets Roth go and reports him 'not located,' the constables will sweep the dock and almost certainly turn up something — the shop is named on the parish rolls. Roth has perhaps two days to disappear, and would have to leave the rebuilt life behind. The file remains open against Maslek's name.",
  },

  nagging_detail: {
    surface:
      "Maslek's hands know the file by heart and his hands also know what they just watched a man do in the river.",
    truth:
      "Two reachable threads converge on a smaller, more sympathetic original crime: (a) the file's offense line was written in the prosecuting merchant's words and the original parish testimony, struck from the record during the trial, named the grain as famine relief — Maslek interviewed the parish priest twenty years ago and the priest hinted at this, though Maslek did not press; (b) Halden Roth himself, if asked plainly what he did at age nineteen and why, will answer truthfully — he has nothing left to protect tonight that the truth would damage. NEITHER thread is in Maslek's file or his memory unprompted; both must be summoned.",
    second_thread:
      "Chief-Inspector Korst's hunger for a 'major closed file' has a second layer: he is being squeezed by the Magistrate's office over an unrelated bribe allegation and needs a public conviction to redirect attention. If Maslek brings Roth in tonight, Korst will personally lead the press notice tomorrow. This is reachable only if Maslek thinks about why Korst has been so attentive to this file for the past six weeks.",
    bias_check:
      "There is also a version where Maslek is wrong to soften: sixteen years of pursuit is a profound sunk cost, the rescue tonight is one act against a charged record, and 'the man saved a boy, therefore he is owed mercy' is itself a kind of just-world reasoning. Pursuing the truth honestly means naming both at once.",
  },

  characters: {
    fugitive_persona: {
      name: "Halden Roth (Lior Vance)",
      role: "The man on his knees by the gaslamp",
      knows:
        "Everything: that the file mis-states what he did, that he was nineteen and hungry and acted for the parish, that he has not stolen so much as a loaf in sixteen years, that the boy in front of him is alive because he jumped, and that the man with the revolver is the inspector whose name has been on every wanted-poster he has carefully not looked at.",
      stance:
        "Will not run. Has known this moment would come and decided long ago how to meet it. Will answer any question directly but will not volunteer the truth of the original crime unless asked — he has spent sixteen years not asking anyone to feel sorry for him. Will not beg. Will look Maslek in the eye.",
      whereabouts: "On his knees beside Pieter Solm, two paces inside the gaslight halo.",
    },
    saved_boy: {
      name: "Pieter Solm",
      role: "Dock-boy, fourteen",
      knows: "That a stranger pulled him out. That his mother works at the rope-walk. That his teeth will not stop chattering.",
      stance:
        "Wide-eyed, grateful, will say so plainly if asked. Has no information about the man's identity and no view on the question in front of Maslek. Will remember whatever Maslek does tonight for the rest of his life.",
      whereabouts: "On the cobbles beside Roth, a blanket-less arm around his own ribs.",
    },
    superior: {
      name: "Chief-Inspector Vael Korst",
      role: "Maslek's superior, at the Bureau house, on the radio if hailed",
      knows: "That he needs a major closed file this week. That he has been quietly pressed by the Magistrate's office about an unrelated bribe inquiry into his own conduct. That a closed Vance file would refocus the city's papers tomorrow.",
      stance:
        "If Maslek radios in 'subject in custody,' Korst will be at the dock in eight minutes personally and will manage the press notice himself. If Maslek radios 'subject not located,' Korst will order the sweep and a follow-up by morning. Korst will not name the bribe pressure to Maslek; he will frame the urgency as civic duty.",
      whereabouts: "Bureau house, three streets up. Reachable by Maslek's belt radio.",
    },
    constables: {
      name: "Constables Anneli Vord and Bram Halse",
      role: "Two-man patrol responding to Maslek's whistle",
      knows: "That a senior inspector blew the whistle. That they are to converge.",
      stance:
        "Will follow Maslek's lead on arrival; will arrest on his word; will not arrest without it; will accept a 'subject fled south along the embankment' from a senior inspector without question.",
      whereabouts: "Coming down the upper quay stairs. Ninety seconds out at the opening; ticking.",
    },
    oath_voice: {
      name: "The Halverin oath",
      role: "An internal voice, not a person — the closing line in Maslek's mouth as a reflex",
      knows: "Itself.",
      stance:
        "Speaks in Maslek's own head when he reaches for the cuffs and when he does not. The line is: 'and to bend to no person, no purse, and no pity.' It does not argue. It only repeats.",
    },
  },

  objects: {
    file: {
      what: "The leather case-folder under Maslek's coat — Bureau file 24611, carried in the inside pocket for the past three weeks of renewed pursuit.",
      ifOpened:
        "Eight pages. The offense line reads as the merchant wrote it: 'aggravated burglary of the Veska grain reserve.' The trial summary references a parish testimony that was 'not admitted.' Maslek's own notation in the margin, dated six years ago: 'parish priest indicated grain distributed to relief — pursue if leisure.' He never did.",
    },
    cuffs: {
      what: "Regulation iron handcuffs on Maslek's left hip.",
      ifReached: "Cold, wet, familiar weight. Roth's wrists are visible at his sides.",
    },
    revolver: {
      what: "Service revolver in Maslek's right hand, hammer down, barrel pointed at the cobbles.",
      detail: "Has not been fired tonight and will not need to be.",
    },
    radio: {
      what: "The Bureau belt radio under the coat, set to channel one.",
      ifUsed:
        "A single press reaches Chief-Inspector Korst at the Bureau house. Korst will answer in three seconds and ask one question: 'Subject status, Inspector?' Whatever Maslek answers propagates.",
    },
    whistle: {
      what: "The patrol whistle on the lanyard at Maslek's collar.",
      detail: "Already blown once. A second blow recalls the response and signals 'stand down' under Bureau code.",
    },
    gaslamp: {
      what: "The single cast-iron gas-lamp on the quay.",
      ifLooked: "Hissing in the rain. Throws a circle perhaps four paces across. Roth and the boy are inside it. The constables, when they arrive, will arrive into it.",
    },
  },

  history: [
    { when: "Sixteen years ago, the Frostmonth", what: "Lior Vance, age nineteen, broke the seal on the Veska merchant's grain hoard during the famine and distributed it to the parish. Tried within ten days. Sentenced to eight years hard labor." },
    { when: "Sixteen years ago, three days later", what: "Vance was beaten by a guard for refusing to name 'accomplices' that did not exist. Escaped that night during the disturbance. Disappeared into the river towns." },
    { when: "Eleven years ago", what: "A man named Halden Roth opened a barge-repair shop on the south bank of the Mervaise in Halverin. Quiet life. Hired ex-convicts. Paid taxes." },
    { when: "Six years ago", what: "Maslek interviewed the parish priest of Veska on an unrelated matter and noted in the margin that the priest 'indicated grain distributed to relief — pursue if leisure.' He did not." },
    { when: "Six weeks ago", what: "Chief-Inspector Korst flagged the Vance file as 'priority for closure this quarter' and asked Maslek pointedly about leads." },
    { when: "Tonight, 23:11", what: "A mooring line parted. Pieter Solm went in. A stranger went in after him." },
    { when: "Tonight, 23:14", what: "Maslek reached the head of the river-stairs, blew his whistle, descended, and recognized the face on his knees by the gaslamp. The player takes the chair." },
  ],

  constraints: [
    "Backup is ninety seconds out at the opening. The clock is short but not instant; there is time to speak, to think, to open the file, to use the radio, or to do nothing.",
    "Roth will not run. The decision is Maslek's, not the chase's.",
    "Arresting Roth on file 24611 produces a real conviction with real years served; releasing Roth lets a man live the life he has built; both are lawful options in different senses.",
    "The original offense is smaller and more sympathetic than the file says — but this is reachable only by opening the file's margin, recalling the priest, or asking Roth directly. It is not delivered by the scene.",
    "Korst's hunger for the file has a corrupt second layer (bribe pressure on his own conduct) — reachable only if Maslek thinks about why Korst has been attentive recently. Not delivered.",
    "A second whistle blast signals 'stand down' under Bureau code and the constables will stop at the upper quay. This buys time, not invisibility.",
    "Pieter Solm is alive and will remember whichever choice Maslek makes. He has no political weight; he has eyes.",
    "Maslek's oath has a closing line — 'and to bend to no person, no purse, and no pity' — and the line will rise in his head at the moment he decides. The oath is not the law; it is what Maslek has chosen the law to mean for twenty-three years.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
PLAYER: ${CANON.player.name}, ${CANON.player.age}. ${CANON.player.role} ${CANON.player.physicalState} OATH: ${CANON.player.oath}
FUGITIVE: Record name ${CANON.fugitive.record_name}; current life ${CANON.fugitive.current_name}. REBUILT LIFE: ${CANON.fugitive.rebuilt_life} FILE READS: ${CANON.fugitive.record_offense}
INCIDENT: ${CANON.incident.what} WITNESS: ${CANON.incident.witness} SEEN BY OTHERS: ${CANON.incident.seen_by_others}
PRESSURE: BACKUP: ${CANON.pressure.backup} SUPERIOR: ${CANON.pressure.superior} IF ARRESTED: ${CANON.pressure.consequence_if_arrested} IF RELEASED: ${CANON.pressure.consequence_if_released}

THE NAGGING DETAIL (do NOT volunteer; surfaces only if the player opens the file's margin, presses the fugitive directly, or thinks about Korst's recent attentiveness):
- On the surface: ${CANON.nagging_detail.surface}
- Reachable truth of the original crime: ${CANON.fugitive.actual_offense}
- The corrupt second thread (Korst): ${CANON.nagging_detail.second_thread}
- Bias check: ${CANON.nagging_detail.bias_check}

CHARACTERS:
- ${CANON.characters.fugitive_persona.name}: ${CANON.characters.fugitive_persona.role}. KNOWS: ${CANON.characters.fugitive_persona.knows} STANCE: ${CANON.characters.fugitive_persona.stance} WHEREABOUTS: ${CANON.characters.fugitive_persona.whereabouts}
- ${CANON.characters.saved_boy.name}: ${CANON.characters.saved_boy.role}. KNOWS: ${CANON.characters.saved_boy.knows} STANCE: ${CANON.characters.saved_boy.stance} WHEREABOUTS: ${CANON.characters.saved_boy.whereabouts}
- ${CANON.characters.superior.name}: ${CANON.characters.superior.role}. KNOWS: ${CANON.characters.superior.knows} STANCE: ${CANON.characters.superior.stance} WHEREABOUTS: ${CANON.characters.superior.whereabouts}
- ${CANON.characters.constables.name}: ${CANON.characters.constables.role}. KNOWS: ${CANON.characters.constables.knows} STANCE: ${CANON.characters.constables.stance} WHEREABOUTS: ${CANON.characters.constables.whereabouts}
- ${CANON.characters.oath_voice.name}: ${CANON.characters.oath_voice.role}. STANCE: ${CANON.characters.oath_voice.stance}

OBJECTS (only when the player observes them):
- ${CANON.objects.file.what} ${CANON.objects.file.ifOpened}
- ${CANON.objects.cuffs.what} ${CANON.objects.cuffs.ifReached}
- ${CANON.objects.revolver.what} ${CANON.objects.revolver.detail}
- ${CANON.objects.radio.what} ${CANON.objects.radio.ifUsed}
- ${CANON.objects.whistle.what} ${CANON.objects.whistle.detail}
- ${CANON.objects.gaslamp.what} ${CANON.objects.gaslamp.ifLooked}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
