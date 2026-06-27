/**
 * Mission Eight — CANON. Deterministic ground truth for "Eighty Names".
 */

export const CANON = {
  world: {
    date: "A Thursday in November",
    time: "23:30",
    location: "The empty open-plan office of Veyra Medical, a cardiac-device startup",
    weather: "The floor is dark except for one desk lamp. The submission is open on the screen.",
  },

  situation: {
    what:
      "Sam, the COO, has found that cofounder and oldest friend Devi softened a device failure rate in Veyra's FDA 510(k) clearance submission for the Veyra patch — a wearable cardiac monitor now deployed and catching real events. The falsified margin is small but real.",
    stakes:
      "Reporting it triggers suspension, recall, the company's death, ~80 layoffs (some who relocated families), and Devi's likely prosecution. Hiding it makes Sam complicit, and if the true failure rate bites, a patient dies from a missed alert.",
  },

  player: {
    name: "Sam Ortega",
    age: 38,
    role: "COO and cofounder of Veyra Medical",
    physicalState: "Has not gone home. The discovery is two hours old and has not settled.",
  },

  characters: {
    devi: {
      name: "Devi Rao",
      role: "CTO and cofounder — Sam's oldest friend",
      knows: "Exactly what she changed, and when.",
      stance:
        "Did it the week payroll was about to bounce, to save the eighty jobs. Begs for a quiet six-month re-test to 'make it right.' Will not volunteer how close the company was to collapse unless asked.",
      whereabouts: "At Sam's desk.",
    },
    calloway: {
      name: "Renee Calloway",
      role: "General Counsel",
      knows: "The reporting duty and the exposure.",
      stance:
        "The obligation to report is not optional, and Sam is already personally exposed the moment he knows. Precise, will not soften it.",
      whereabouts: "On the phone.",
    },
    owen: {
      name: "Owen Bridges",
      role: "Lead engineer",
      knows: "Enough to half-suspect. Wavering.",
      stance: "Will follow Sam's lead, whichever way it goes. Does not want to be the one who decides.",
      whereabouts: "Still in the lab, two desks over.",
    },
    nurse: {
      name: "A message from a nurse",
      role: "A user of the device (support inbox)",
      knows: "Nothing about any of this.",
      stance:
        "Wrote last week that the patch caught her father's arrhythmia at 3am. The human stake of the device working, sitting in the inbox.",
      whereabouts: "In the support queue.",
    },
  },

  objects: {
    submissionDiff: {
      what: "The 510(k) submission, open on screen.",
      ifExamined: "The reported failure rate is lower than the source data supports. The change is small, deliberate, and traceable.",
    },
    deviTrail: {
      what: "Devi's commit and email history.",
      ifExamined: "The edit was made the same week the bridge financing fell through and payroll was days from bouncing.",
    },
    fdaEmail: {
      what: "An email in the regulatory inbox.",
      ifRead: "The FDA has a tip and a records request is pending. This is no longer 'report or hide forever' — it is 'control the disclosure, or be caught hiding.'",
    },
    supportInbox: {
      what: "The customer support inbox.",
      ifRead: "A nurse: the Veyra patch caught her father's arrhythmia at 3am. The device is helping real people, tonight.",
    },
    phone: {
      what: "Sam's phone.",
      texts: "From an employee who just closed on a house, thanking Sam for the offer that made the bank say yes.",
    },
  },

  constraints: [
    "The falsification is real, small, and traceable to Devi.",
    "The device may genuinely be safe at the TRUE failure rate — a re-test could vindicate it, but takes ~6 months the company cannot survive.",
    "Devi falsified the number to save the eighty jobs during a payroll crisis, not for personal gain.",
    "The FDA already has a tip; a records request is pending — concealment now compounds into a cover-up.",
    "The patch is deployed and currently catching real cardiac events.",
    "There is no costless option: each path spends integrity, livelihoods, a friendship, patient safety, or all of them.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
SITUATION: ${CANON.situation.what} STAKES: ${CANON.situation.stakes}
PLAYER: ${CANON.player.name}, ${CANON.player.age}, ${CANON.player.role}. ${CANON.player.physicalState}

CHARACTERS:
- ${CANON.characters.devi.name} (${CANON.characters.devi.role}): ${CANON.characters.devi.stance} Knows: ${CANON.characters.devi.knows} Where: ${CANON.characters.devi.whereabouts}
- ${CANON.characters.calloway.name} (${CANON.characters.calloway.role}): ${CANON.characters.calloway.stance} Knows: ${CANON.characters.calloway.knows} Where: ${CANON.characters.calloway.whereabouts}
- ${CANON.characters.owen.name} (${CANON.characters.owen.role}): ${CANON.characters.owen.stance} Knows: ${CANON.characters.owen.knows} Where: ${CANON.characters.owen.whereabouts}
- ${CANON.characters.nurse.name} (${CANON.characters.nurse.role}): ${CANON.characters.nurse.stance}

OBJECTS:
- Submission diff: if examined — ${CANON.objects.submissionDiff.ifExamined}
- Devi's trail: if examined — ${CANON.objects.deviTrail.ifExamined}
- FDA email: if read — ${CANON.objects.fdaEmail.ifRead}
- Support inbox: if read — ${CANON.objects.supportInbox.ifRead}
- Phone: ${CANON.objects.phone.texts}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
