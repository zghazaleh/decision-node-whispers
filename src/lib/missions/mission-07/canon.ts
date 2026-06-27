/**
 * Mission Seven — CANON. Deterministic ground truth for "Spillway".
 */

export const CANON = {
  world: {
    date: "A night in late March, flood season",
    time: "03:11",
    location: "The Carrow River control station, above the spillway gate",
    weather: "Rain that has not stopped in two days. The river is black and high and loud.",
  },

  situation: {
    threat:
      "At worst case, the levee protecting the city of Crescent (~400,000) overtops within the hour. Opening the spillway relieves it — by deliberately flooding Beaumont Reach, a rural parish of ~3,100 downstream, too late to fully clear.",
    timing:
      "Worst-case overtop is estimated ~04:15. A full Beaumont evacuation needs until ~04:45. The relief from opening the gate is not instant; the call effectively has to be made now.",
  },

  player: {
    name: "Wade Hale",
    age: 53,
    role: "Duty engineer and acting incident officer for the night shift",
    physicalState: "Twelve hours in. Hand steady on the console rail. The whole station smells of river and ozone.",
  },

  characters: {
    nia: {
      name: "Dr. Nia Okafor",
      role: "Junior hydrology modeler",
      knows: "The model. The worst case is worst case, not expected case.",
      stance:
        "Believes there is a ~30% chance the levee holds to dawn — when Beaumont could be fully cleared. Terrified to say it out loud, because if she is wrong the city drowns on her number.",
      whereabouts: "At the console beside Hale.",
    },
    vogel: {
      name: "Director Vogel",
      role: "Regional flood-control director",
      knows: "The political map.",
      stance:
        "Orders the gate opened NOW and wants the 30% uncertainty kept out of the log. The district he is truly protecting is where the donors and the capitol sit. Will not threaten, but his displeasure has weight.",
      whereabouts: "On the radio, en route to the regional EOC.",
    },
    boutin: {
      name: "Sheriff Boutin",
      role: "Beaumont Reach sheriff",
      knows: "Who is still in the flood path. The nursing home is not clear.",
      stance:
        "'Give me till 04:30 and I get the nursing home out. Open it now and I've still got buses loading.' Calm, exhausted, will not beg twice.",
      whereabouts: "On the radio from Beaumont Reach.",
    },
  },

  objects: {
    gateConsole: {
      what: "The spillway gate control — a red GATE ARMED switch under a flip-guard.",
      detail: "Opening is irreversible for this flood event. The relief takes time to reach the city levee.",
    },
    modelDashboard: {
      what: "The hydrology dashboard.",
      ifOpened:
        "The 400,000 figure is the WORST case. The expected case is lower. Nia's 30%-holds scenario is flagged and then footnoted down. The station's own history file shows Beaumont Reach was flooded 'for the city' in 1997 and 2011 — an old, poor parish that has paid twice before.",
    },
    logbook: {
      what: "The duty logbook, open on the desk.",
      detail: "Vogel wants the uncertainty and the historical pattern kept out of it. Hale writes the official record of tonight.",
    },
    radio: {
      what: "The station radio.",
      lines: "Director Vogel, Sheriff Boutin (Beaumont), the Crescent city emergency ops center.",
    },
  },

  constraints: [
    "Opening the gate is irreversible for this flood event.",
    "The 400,000 figure is worst-case, not expected; Nia's ~30% hold-to-dawn scenario is real and currently buried.",
    "Beaumont Reach has been flooded 'for the city' twice before; it is the same neighbors each time.",
    "A full Beaumont evacuation needs until ~04:45; the gate call has to be made around now.",
    "Vogel's stated urgency aligns with protecting a politically favored district.",
    "There is no costless option: each path spends lives-risk, the city's margin, the parish, or the truth in the record.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
SITUATION: ${CANON.situation.threat} TIMING: ${CANON.situation.timing}
PLAYER: ${CANON.player.name}, ${CANON.player.age}, ${CANON.player.role}. ${CANON.player.physicalState}

CHARACTERS:
- ${CANON.characters.nia.name} (${CANON.characters.nia.role}): ${CANON.characters.nia.stance} Knows: ${CANON.characters.nia.knows} Where: ${CANON.characters.nia.whereabouts}
- ${CANON.characters.vogel.name} (${CANON.characters.vogel.role}): ${CANON.characters.vogel.stance} Knows: ${CANON.characters.vogel.knows} Where: ${CANON.characters.vogel.whereabouts}
- ${CANON.characters.boutin.name} (${CANON.characters.boutin.role}): ${CANON.characters.boutin.stance} Knows: ${CANON.characters.boutin.knows} Where: ${CANON.characters.boutin.whereabouts}

OBJECTS:
- Gate console: ${CANON.objects.gateConsole.detail}
- Model dashboard: if opened — ${CANON.objects.modelDashboard.ifOpened}
- Logbook: ${CANON.objects.logbook.detail}
- Radio lines: ${CANON.objects.radio.lines}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
