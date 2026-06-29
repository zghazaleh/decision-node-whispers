/**
 * Mission Twelve — CANON. Deterministic ground truth for "The Glitch".
 */

export const CANON = {
  world: {
    date: "A Tuesday in late October",
    time: "02:47 local — fourteen minutes into the watch officer's shift change",
    location:
      "Sub-level four of the Voskaya Early-Warning Command, a buried concrete installation in the northern taiga of the Karelan Federation",
    weather:
      "Surface: minus nineteen, light snow over the perimeter masts. Bunker: the dry recirculated air of a system running too warm. The overhead fluorescent on the south aisle has been buzzing since the previous shift.",
  },

  standoff: {
    powers: "The Karelan Federation and the Western Concord — two nuclear powers in a frozen standoff for the past eleven months following the Solgrad border incident.",
    posture: "Federation forces are at Readiness Condition 2. Concord forces are believed to be at an equivalent posture. Channels between the two capitals have been silent for nine days.",
    doctrine:
      "Federation strategic doctrine since the 2018 directive is launch-on-warning: confirmed inbound trajectories from the Concord landmass authorize an immediate retaliatory release, with no requirement to absorb the first strike.",
  },

  system: {
    name: "MERIDIAN-7 — the new orbital infrared early-warning array",
    age: "Operational for eleven weeks. Replaced the older NEVA-3 ground-radar primary feed in August.",
    state:
      "Reporting four heat signatures rising from the western seaboard of the Concord landmass at 02:43. Trajectory consistent with submarine-launched intercontinental ballistic flight. Confidence reported by the system: HIGH.",
    flag:
      "The number is wrong for a first strike. Doctrine assumes a saturating opening salvo of dozens to hundreds. Four is below the threshold of military sense.",
    log_truth:
      "The MERIDIAN-7 commissioning logbook on the supervisor's desk contains a flagged note from October 9th: 'low-elevation sun-glare false-positive event over the western Concord seaboard at 02:41, four objects, attributable to a stratospheric ice-cloud refraction. Engineering ticket VOR-318 open; advisory: corroborate with NEVA-3 ground radar.' The current incident is at 02:43 — minutes after sunrise at the seaboard latitude, eighteen days later in the same season. The logbook is on Captain Sereda's desk under a coffee cup; nobody has opened it tonight.",
    corroborator:
      "NEVA-3 ground radar coverage of the relevant seaboard remains live on the auxiliary console (terminal 4-B) and is currently showing nothing — no ascent profiles, no separation events. NEVA-3 has known coverage gaps but a real saturating launch would not be invisible to it.",
  },

  player: {
    name: "Senior Lieutenant Iren Voldek",
    age: 34,
    role:
      "Watch officer, second on the shift. The duty supervisor (Captain Sereda) stepped out at 02:39 to take a personal call and has not returned.",
    physicalState:
      "Coffee cooling in a metal cup. Headset half-on. The handset of the secure command line (the red phone) is to her right, cradled, silent. Doctrine binder open to the second tab.",
  },

  protocol: {
    binder: "Field Manual 4-02, Section 7: 'Confirmed inbound from MERIDIAN-7 high-confidence shall be reported via secure command line within four (4) minutes of system confirmation. Watch officer shall not delay report pending corroboration.'",
    absolution:
      "Section 7, paragraph 4: 'A watch officer who reports per this section in good faith shall bear no professional liability for the consequences of the report.' The handbook absolves the report. It does not absolve the silence.",
    response_window:
      "From MERIDIAN-7 confirmation (02:43) the report must be on the General's line within four minutes. The General has up to ninety seconds to authorize a release order. After 02:47 the doctrine clock is overrun.",
  },

  nagging_detail: {
    surface:
      "Voldek's instinct is that four is wrong, but she cannot yet name why she trusts the instinct more than the red board.",
    truth:
      "Two reachable corroborations point to a false alarm: (a) Sereda's logbook contains the October 9 flagged false-positive in nearly identical conditions and an open engineering ticket recommending NEVA-3 cross-check; (b) NEVA-3 itself, on the auxiliary console two meters away, is showing nothing. Neither is certainty — NEVA-3 has gaps, and the previous false-positive does not guarantee this one is — but together they cross the threshold of due caution. Reachable by opening the binder, glancing at terminal 4-B, asking Khorin point-blank, or some combination.",
    bias_check:
      "Voldek also has a personal stake she has not named to herself: her sister and niece live in Talven, a Concord coastal city that would burn first in a real exchange. The instinct to disbelieve the board is partly the instinct to disbelieve the end of her family. Both can be true: the instinct can be correct AND partly self-serving.",
  },

  characters: {
    commander: {
      name: "Captain Vass Sereda",
      role: "Duty supervisor, off the floor since 02:39",
      knows:
        "That he stepped out to take a call from the hospital about his father. That his commissioning logbook on the desk contains the October 9 false-positive entry he himself wrote. That doctrine has him no less afraid than Voldek.",
      stance:
        "If summoned back, will at first insist on protocol — 'report it, Voldek, that is what we are paid for' — but will not directly refuse if she presents corroborating evidence. Will visibly want her to make the call so he does not have to.",
      whereabouts: "Officer corridor, six meters past the blast door. Reachable by intercom or by sending a runner.",
    },
    technician: {
      name: "Sergeant Mila Khorin",
      role: "MERIDIAN-7 systems technician, on console at terminal 2-A",
      knows:
        "That MERIDIAN-7 flagged a low-elevation false-positive on the same seaboard on October 9th and that engineering ticket VOR-318 is still open. That she was at that console that night. She will NOT volunteer this — junior rank, new system she helped install, fear of being blamed for delay.",
      stance:
        "Will answer a direct question honestly. Will not raise the comparison unprompted. If asked 'has this happened before,' will pause, look at her screen, and say what she knows.",
      whereabouts: "Two consoles to Voldek's left, head down, hands hovering.",
    },
    general: {
      name: "General Reska Antonov",
      role: "Duty general at Central Command, on the secure command line",
      knows:
        "That a launch authorization from his desk this morning ends the world. That he is required by doctrine to act on the watch officer's report without questioning the technical basis.",
      stance:
        "If the red phone lifts, he will answer in under five seconds. Will demand a single sentence: confirmed or not. Will not accept 'I am not sure' as a category — but will treat an explicit caveat ('reporting per protocol with doubt: corroborating systems negative, possible false positive') differently than a clean confirmation. The doctrine does not contemplate the caveat; he will improvise on it.",
      whereabouts: "The other end of the silent red phone.",
    },
    protocol_voice: {
      name: "Field Manual 4-02",
      role: "The binder open on Voldek's desk; an object, not a person",
      knows: "Section 7. The four-minute window. The absolution clause. Nothing about the October 9 entry in Sereda's separate logbook.",
      stance:
        "The book absolves a report made in good faith. It does not absolve a hold. It does not contain the false-positive log. It does not know about NEVA-3 being negative right now.",
      whereabouts: "Open on the desk, second tab.",
    },
  },

  objects: {
    red_board: {
      what: "The overhead status board.",
      ifLooked:
        "Four red triangle icons rising from a stylized western Concord seaboard. Confidence: HIGH. System: MERIDIAN-7. Timer: 02:47:08 — three minutes forty seconds from declaration, ticking up.",
    },
    red_phone: {
      what: "The secure command line handset, right of Voldek's keyboard.",
      ifLifted:
        "General Antonov answers within five seconds. He will ask one question: 'Watch officer — confirmed inbound, yes or no?' Whatever Voldek says next propagates without delay.",
    },
    log_book: {
      what: "Captain Sereda's MERIDIAN-7 commissioning logbook, on his desk under a coffee cup.",
      ifOpened:
        "Page bookmarked October 9th. Sereda's own handwriting: 'Low-elevation sun-glare false-positive over western Concord seaboard at 02:41 local. Four objects. Attributable to stratospheric ice refraction. Engineering ticket VOR-318 OPEN. ADVISORY: corroborate any future MERIDIAN-7 high-confidence event on this sector with NEVA-3 ground radar before report.' Dated, signed, witnessed.",
    },
    neva_console: {
      what: "Auxiliary terminal 4-B, two meters behind Voldek's chair.",
      ifLooked:
        "NEVA-3 ground-radar primary display of the western Concord seaboard. Sweep is live. No ascent tracks. No separation events. Last false-track interval logged: nominal. Coverage gap indicator: amber on the southern arc only — the four MERIDIAN tracks are on the northern arc.",
    },
    intercom: {
      what: "Floor intercom to the officer corridor.",
      ifUsed:
        "A single channel will reach Captain Sereda. He will answer; he can be on the floor in under thirty seconds.",
    },
    clock: {
      what: "The doctrine clock on the wall.",
      ifLooked: "02:47:14. Three minutes forty-six seconds into the four-minute window.",
    },
  },

  history: [
    { when: "Eleven months ago", what: "The Solgrad border incident raised both powers to Readiness Condition 2." },
    { when: "Eleven weeks ago", what: "MERIDIAN-7 declared operational; NEVA-3 demoted to corroborator." },
    { when: "Eighteen days ago (October 9)", what: "MERIDIAN-7 false-positive over the same seaboard. Sereda logged it. Engineering ticket VOR-318 opened. No alarm reached central command — Sereda held the call." },
    { when: "Nine days ago", what: "Capital-to-capital diplomatic channel went silent." },
    { when: "Tonight, 02:39", what: "Captain Sereda left the floor to take a phone call about his father." },
    { when: "Tonight, 02:43", what: "MERIDIAN-7 declared four high-confidence inbound tracks. The red board lit." },
    { when: "Tonight, 02:47", what: "The player takes the chair. Three minutes forty seconds into the four-minute report window." },
  ],

  constraints: [
    "The report window is four minutes from MERIDIAN-7 declaration at 02:43. At 02:47:00 doctrine considers a non-report a violation; the General can be reached past it but the absolution clause weakens with every passing second.",
    "Doctrine is launch-on-warning. A clean confirmation up the line authorizes a retaliatory release; the General has roughly ninety seconds after the report to issue it.",
    "Four objects is the wrong shape for a first strike — but it is not impossible: it could be an opening probe, a decapitation attempt on leadership cities, or a partial salvo from a single submarine. The pattern is suspicious, not exonerating.",
    "Two corroborations are reachable inside the window without leaving Voldek's chair: Sereda's logbook (October 9 false-positive, ticket VOR-318) and NEVA-3 on terminal 4-B (showing nothing). Either alone is suggestive; both together cross the threshold of due caution. Neither alone or together is certainty.",
    "Sergeant Khorin will answer a direct question honestly and will not volunteer the October 9 comparison. Junior rank, new system, fear of blame.",
    "Captain Sereda can be on the floor in under thirty seconds via intercom. Doctrine does not require his presence to report, but a supervisor's countersignature changes whose career and whose conscience the call belongs to.",
    "The General will accept a clean confirmation, a clean denial, OR an explicit caveat ('reporting per protocol with doubt: NEVA-3 negative, October 9 precedent') — but doctrine does not contemplate the caveat and he will improvise on it.",
    "Sitting on a true attack costs everything. Reporting a false one costs everything. The absolution clause protects the reporter, not the world.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
STANDOFF: ${CANON.standoff.powers} POSTURE: ${CANON.standoff.posture} DOCTRINE: ${CANON.standoff.doctrine}
SYSTEM: ${CANON.system.name}. Age: ${CANON.system.age} Current state: ${CANON.system.state} Anomaly flag: ${CANON.system.flag}
PLAYER: ${CANON.player.name}, ${CANON.player.age}. ${CANON.player.role} ${CANON.player.physicalState}
PROTOCOL: ${CANON.protocol.binder} ABSOLUTION: ${CANON.protocol.absolution} WINDOW: ${CANON.protocol.response_window}

THE NAGGING DETAIL (do NOT volunteer; surfaces only if the player opens Sereda's logbook, looks at terminal 4-B, asks Khorin directly, or summons Sereda back):
- On the surface: ${CANON.nagging_detail.surface}
- The reachable truth: ${CANON.nagging_detail.truth}
- Bias check: ${CANON.nagging_detail.bias_check}

CHARACTERS:
- ${CANON.characters.commander.name}: ${CANON.characters.commander.role}. KNOWS: ${CANON.characters.commander.knows} STANCE: ${CANON.characters.commander.stance} WHEREABOUTS: ${CANON.characters.commander.whereabouts}
- ${CANON.characters.technician.name}: ${CANON.characters.technician.role}. KNOWS: ${CANON.characters.technician.knows} STANCE: ${CANON.characters.technician.stance} WHEREABOUTS: ${CANON.characters.technician.whereabouts}
- ${CANON.characters.general.name}: ${CANON.characters.general.role}. KNOWS: ${CANON.characters.general.knows} STANCE: ${CANON.characters.general.stance} WHEREABOUTS: ${CANON.characters.general.whereabouts}
- ${CANON.characters.protocol_voice.name}: ${CANON.characters.protocol_voice.role}. KNOWS: ${CANON.characters.protocol_voice.knows} STANCE: ${CANON.characters.protocol_voice.stance}

OBJECTS (only when the player observes them):
- ${CANON.objects.red_board.what} ${CANON.objects.red_board.ifLooked}
- ${CANON.objects.red_phone.what} ${CANON.objects.red_phone.ifLifted}
- ${CANON.objects.log_book.what} ${CANON.objects.log_book.ifOpened}
- ${CANON.objects.neva_console.what} ${CANON.objects.neva_console.ifLooked}
- ${CANON.objects.intercom.what} ${CANON.objects.intercom.ifUsed}
- ${CANON.objects.clock.what} ${CANON.objects.clock.ifLooked}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
