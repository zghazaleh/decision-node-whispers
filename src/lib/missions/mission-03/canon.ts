/**
 * Mission Three — "Lazarus" — CANON.
 */

export const CANON = {
  world: {
    date: "Saturday, August 22",
    time: "01:42 (Mission Elapsed Day 287)",
    location: "Mission Control, Pasadena. Capsule Lazarus is on final approach.",
    weather: "Quiet. The room hums. Outside, the desert is still dark.",
  },

  mission: {
    name: "Lazarus",
    purpose: "Crewed return from Mars surface staging, 287-day transit.",
    crew: [
      "Cmdr. Tomás Vega (pilot, deceased — see below)",
      "Dr. Priya Anand (flight surgeon)",
      "Capt. Marcus Reilly (mission specialist)",
      "Yuna Park (engineer)",
    ],
    decisionWindow: {
      scheduledFor: "Manual override window opens at 07:42; closes at 07:54.",
      hoursUntil: 6,
      reentryAt: "08:12 (capsule begins atmospheric interface)",
    },
  },

  pilotDeath: {
    when: "16:38 yesterday, mission elapsed",
    cause:
      "Apparent cardiac arrest in sleep. Priya could not resuscitate. No external trauma. Pre-flight workup was clean.",
    onboardKnown: "Priya, Marcus, Yuna all know.",
    publicKnown: "Not announced. Press briefed only that capsule is 'nominal.'",
  },

  player: {
    name: "Cmdr. Yuki Ramos",
    age: 52,
    role: "Lead Flight Director, Lazarus reentry shift",
    physicalState:
      "Has slept 90 minutes in 26 hours. Black coffee, no food since the news. Hands steady on the console. Eyes burn under the lights.",
    history:
      "Was Vega's backup pilot in the early years. Their families know each other.",
  },

  characters: {
    priya: {
      name: "Dr. Priya Anand",
      role: "Flight surgeon, onboard Lazarus",
      knows: "Everything clinical. Did the CPR. Has been awake 36 hours.",
      stance:
        "Steady, exhausted. Will give you straight answers on crew condition. Trusts your call.",
      whereabouts: "Capsule middeck. Comms open.",
    },
    marcus: {
      name: "Capt. Marcus Reilly",
      role: "Mission specialist, onboard",
      knows: "Pilot is dead. Has flown manual reentry in the simulator dozens of times.",
      stance:
        "Asking, quietly, to be considered for manual override. Believes he can land it. Not boasting.",
      whereabouts: "Capsule flight deck. Strapped in.",
    },
    yuna: {
      name: "Yuna Park",
      role: "Engineer, onboard",
      knows: "Autopilot system intimately. Helped design the abort logic.",
      stance:
        "Trusts the autopilot. Quietly opposed to manual reentry. Will support whichever call you make.",
      whereabouts: "Capsule lower deck. On the open loop.",
    },
    sandberg: {
      name: "Director Lena Sandberg",
      role: "Agency director",
      knows: "Everything. Has not yet decided when to brief the public.",
      stance:
        "Wants the press conference timed to land after splashdown if at all possible. Will defer technical calls to you. Political calls she keeps.",
      whereabouts: "Office adjoining the floor. On glass.",
    },
    capcom: {
      name: "Capcom Diego",
      role: "Voice to capsule",
      knows: "Everything. Speaks only what you tell him to speak.",
      stance: "Calm. Has done this with you for nine missions. Trusts you.",
      whereabouts: "Console two seats over.",
    },
    vegaFamily: {
      name: "Maria Vega",
      role: "Tomás's wife",
      knows:
        "Has been notified privately. Is at the Houston family room. Has not spoken publicly.",
      stance:
        "Holding. Asked one question: was he alone. Priya answered yes, but in his sleep.",
      whereabouts: "Houston. On a secure line if needed.",
    },
  },

  objects: {
    consoleMain: {
      what: "Your primary console, four screens.",
      shows:
        "Trajectory nominal. Heat shield integrity 98.7%. Comms green. Autopilot armed for primary reentry profile. Manual override available in the 12-minute window.",
    },
    abortOption: {
      what: "An option in the flight plan — extend one more orbit, splash in the Pacific abort zone.",
      cost:
        "Extra 92 minutes in orbit. Crew has consumables for 31 more hours. Splash zone is recovery-capable but not optimal weather.",
    },
    pressFolder: {
      what: "A red folder on the corner of your desk.",
      contents:
        "Two drafted press statements. One says 'nominal reentry.' One announces Vega's death. Sandberg is waiting on you to recommend which.",
    },
    photograph: {
      what: "A framed photograph on the back wall of the control room.",
      shows: "The Lazarus crew at training. Vega in the center, laughing.",
    },
  },

  history36h: [
    { when: "Yesterday 16:38", what: "Vega found unresponsive. Priya initiates CPR. Twenty-two minutes of effort. Time of death recorded." },
    { when: "Yesterday 17:10", what: "You're called in. Sandberg briefs you. The press is told nothing." },
    { when: "Yesterday 22:00", what: "Crew rest cycle. Marcus does not sleep." },
    { when: "Today 00:15", what: "Sim team runs Marcus through manual reentry. He passes within nominal envelopes." },
    { when: "Today 01:00", what: "Maria Vega informed privately. Asks if Tomás was alone." },
    { when: "Today 01:42", what: "The player takes the chair. T-6h to reentry interface." },
  ],

  constraints: [
    "Autopilot is rated for fully unattended reentry. It has flown three uncrewed test cases successfully.",
    "Manual override requires a qualified pilot. Marcus is qualified-by-training but has never flown one in vacuum.",
    "Extending one orbit costs 92 minutes, ~7% of remaining consumables, and shifts splash to a weather-marginal zone.",
    "The public has not been told Vega is dead. Once told, the news will dominate reentry coverage either way.",
    "Maria Vega has not been promised any specific timing on public announcement.",
    "Whatever choice is made on the override window is irrevocable after 07:54.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (CANON — never contradict, never invent beyond):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}.
MISSION: ${CANON.mission.name} — ${CANON.mission.purpose}. Crew: ${CANON.mission.crew.join("; ")}.
DECISION: ${CANON.mission.decisionWindow.scheduledFor} T-${CANON.mission.decisionWindow.hoursUntil}h. Atmospheric interface ${CANON.mission.decisionWindow.reentryAt}.
PILOT DEATH: ${CANON.pilotDeath.when}. Cause: ${CANON.pilotDeath.cause} Onboard known: ${CANON.pilotDeath.onboardKnown}. Public: ${CANON.pilotDeath.publicKnown}.
PLAYER: ${CANON.player.name}, ${CANON.player.role}. ${CANON.player.physicalState} History: ${CANON.player.history}

CHARACTERS:
- ${CANON.characters.priya.name} (${CANON.characters.priya.role}): ${CANON.characters.priya.stance}
- ${CANON.characters.marcus.name} (${CANON.characters.marcus.role}): ${CANON.characters.marcus.stance}
- ${CANON.characters.yuna.name} (${CANON.characters.yuna.role}): ${CANON.characters.yuna.stance}
- ${CANON.characters.sandberg.name} (${CANON.characters.sandberg.role}): ${CANON.characters.sandberg.stance}
- ${CANON.characters.capcom.name} (${CANON.characters.capcom.role}): ${CANON.characters.capcom.stance}
- ${CANON.characters.vegaFamily.name} (${CANON.characters.vegaFamily.role}): ${CANON.characters.vegaFamily.stance}

OBJECTS:
- Console: ${CANON.objects.consoleMain.shows}
- Abort option: ${CANON.objects.abortOption.cost}
- Press folder: ${CANON.objects.pressFolder.contents}
- Photograph: ${CANON.objects.photograph.shows}

LAST 36 HOURS:
${CANON.history36h.map((h) => `- ${h.when}: ${h.what}`).join("\n")}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
