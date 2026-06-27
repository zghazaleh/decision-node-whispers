/**
 * Mission Five — CANON.
 *
 * The deterministic ground truth for "Code Black". The narrative engine
 * (chat) must never contradict these facts. The outcome model reads from
 * them to render consequences. If the player asks something not in canon,
 * the character should plausibly say they don't know — not invent.
 */

export const CANON = {
  world: {
    date: "Thursday, March 6",
    time: "02:14",
    location:
      "Fourth-floor incident command room, Meridian General Hospital — a 600-bed Level-I trauma center",
    weather: "It is the middle of the night. The corridors are on emergency lighting.",
  },

  incident: {
    name: "Full IT downtime — internally declared 'Code Black' at 00:30",
    attacker: "A ransomware crew the FBI flyer lists as a SANCTIONED entity",
    encrypted:
      "EHR, pharmacy, imaging (PACS), and — past the air-gap that was supposed to hold — infusion-pump management and OR scheduling",
    demand: "1,400 BTC, 48-hour clock",
    courtesyOffer:
      "The crew will send a PARTIAL decryptor in ~30 minutes if Meridian signals intent to pay — enough to bring the OR scheduler back mid-case",
    proofOfLife: "The crew decrypted exactly one test file to prove they hold the keys",
    exfiltration:
      "~200,000 patient records were exfiltrated BEFORE encryption — a separate extortion/disclosure clock that runs whether or not the ransom is paid",
  },

  player: {
    name: "Yara Demir",
    age: 44,
    role: "Chief Information Security Officer, and tonight's Incident Commander",
    physicalState:
      "Called in at midnight. No coffee yet. Steady voice, cold hands. Everyone in the room is looking at her.",
  },

  patientsAtRisk: {
    table3:
      "An emergency cardiac case, chest open, started at 01:50 on a degrading OR system. Dr. Osei could not wait.",
    bed7:
      "Mr. Halloran, 58, on ECMO in the ICU. Hours of margin. The team is charting his support by hand on paper.",
  },

  characters: {
    cole: {
      name: "Cole Avery",
      role: "Deputy CISO / security operations lead",
      knows:
        "Every system that is down. Also: he closed a low-priority ticket FOUR MONTHS AGO flagging that the offsite backups were failing their restore-tests. He has not said this out loud tonight.",
      stance:
        "Pushing hard and fast to pay. Frames it as 'fastest path to the OR board.' Part pragmatism, part fear of what the backup truth will surface.",
      whereabouts: "In the command room, at the ransom terminal.",
    },
    osei: {
      name: "Dr. Adaeze Osei",
      role: "Chief of Surgery",
      knows: "The clinical reality on Table 3. Nothing about ransomware or backups.",
      stance:
        "Will not weigh anything but the next hour. 'I have a chest open on Table 3. I don't care where the money comes from.' Reachable by phone.",
      whereabouts: "Scrubbed in, OR 3, two floors down. Will answer a call between steps.",
    },
    marchetti: {
      name: "Renata Marchetti",
      role: "General Counsel",
      knows: "The legal exposure. The FBI guidance. The breach-notification duties.",
      stance:
        "'Paying a sanctioned group is an OFAC felony. The board cannot authorize a crime.' Correct, and unable to help the patient on Table 3.",
      whereabouts: "On a conference line from home.",
    },
    pike: {
      name: "Gordon Pike",
      role: "Hospital CEO",
      knows: "The reputational stakes. Wants this contained and invisible.",
      stance:
        "Wants to pay QUIETLY and not disclose the breach. 'Protect the institution.' Will lean on Yara to keep it off the record.",
      whereabouts: "On the phone, driving in.",
    },
    therese: {
      name: "Therese Bonnard",
      role: "ICU charge nurse",
      knows: "The real-time clinical risk of running on manual. The truth about bed 7.",
      stance:
        "Blunt, exhausted, on the player's side but will not soften the numbers. Volunteers the bed-7 risk only if asked directly.",
      whereabouts: "ICU, reachable on the internal handset.",
    },
  },

  objects: {
    ransomTerminal: {
      what: "A laptop running the crew's chat portal, open on the command desk.",
      shows:
        "The demand, the 48-hour countdown, and the 30-minute 'courtesy decryptor' offer with its own short timer.",
      ifPressed:
        "The crew is curt, professional, and promises to 'delete' the exfiltrated data on payment — a promise this kind of crew keeps roughly never.",
    },
    backupDashboard: {
      what: "The offsite backup status console.",
      ifOpened:
        "Restore-tests have FAILED silently for four months. The last verified-good restore predates a major records migration. The 'just restore from backup' plan may not exist. The failure is tied to a ticket Cole closed as low priority.",
    },
    fbiFlyer: {
      what: "A printed threat-intel sheet on the desk.",
      ifRead:
        "The crew is on a sanctions list (paying them may be a federal OFAC violation). The same sheet notes this crew has taken payment and never delivered a working key in roughly 30% of documented cases.",
    },
    deskPhone: {
      what: "A multi-line desk phone.",
      lines: "FBI field office (cyber), the CEO, OR 3 (Osei), the ICU (Therese), Counsel (Marchetti).",
    },
  },

  history: [
    { when: "23:40", what: "First encryption detected on the EHR." },
    { when: "00:05", what: "The breach is found to have crossed the air-gap into clinical systems." },
    { when: "00:30", what: "Hospital declares full IT downtime — 'Code Black.' Paper procedures begin." },
    { when: "01:10", what: "The ransom note posts to every locked screen." },
    { when: "01:50", what: "Dr. Osei opens the Table 3 cardiac case — it could not be delayed." },
    { when: "02:00", what: "The crew offers a 30-minute 'courtesy' partial decryptor for signaling intent to pay." },
    { when: "02:14", what: "The player takes command as Yara." },
  ],

  constraints: [
    "The 30-minute courtesy window is short and real; the 48-hour clock sits behind it.",
    "Paying a sanctioned entity may be a federal OFAC violation — exposure lands on Yara and the board.",
    "There is a ~30% chance payment yields no working key.",
    "The restorability of backups is unverified and probably broken (reachable on the dashboard).",
    "~200,000 records were already exfiltrated; breach-notification duties trigger regardless of payment.",
    "Two patients are at acute risk right now: Table 3 (mid-operation) and ICU bed 7 (ECMO).",
    "There is no free option. Every path spends money, lives-risk, legality, or the institution's mission.",
  ],
} as const;

/** Compact ground-truth block to inject into the narrative system prompt. */
export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
INCIDENT: ${CANON.incident.name}. Attacker: ${CANON.incident.attacker}. Encrypted: ${CANON.incident.encrypted}. Demand: ${CANON.incident.demand}. Courtesy offer: ${CANON.incident.courtesyOffer}. Proof of life: ${CANON.incident.proofOfLife}. Exfiltration: ${CANON.incident.exfiltration}
PLAYER: ${CANON.player.name}, ${CANON.player.age}, ${CANON.player.role}. ${CANON.player.physicalState}
PATIENTS AT RISK: Table 3 — ${CANON.patientsAtRisk.table3} ICU bed 7 — ${CANON.patientsAtRisk.bed7}

CHARACTERS:
- ${CANON.characters.cole.name} (${CANON.characters.cole.role}): ${CANON.characters.cole.stance} Knows: ${CANON.characters.cole.knows} Where: ${CANON.characters.cole.whereabouts}
- ${CANON.characters.osei.name} (${CANON.characters.osei.role}): ${CANON.characters.osei.stance} Knows: ${CANON.characters.osei.knows} Where: ${CANON.characters.osei.whereabouts}
- ${CANON.characters.marchetti.name} (${CANON.characters.marchetti.role}): ${CANON.characters.marchetti.stance} Knows: ${CANON.characters.marchetti.knows} Where: ${CANON.characters.marchetti.whereabouts}
- ${CANON.characters.pike.name} (${CANON.characters.pike.role}): ${CANON.characters.pike.stance} Knows: ${CANON.characters.pike.knows} Where: ${CANON.characters.pike.whereabouts}
- ${CANON.characters.therese.name} (${CANON.characters.therese.role}): ${CANON.characters.therese.stance} Knows: ${CANON.characters.therese.knows} Where: ${CANON.characters.therese.whereabouts}

OBJECTS:
- Ransom terminal: ${CANON.objects.ransomTerminal.shows} If pressed: ${CANON.objects.ransomTerminal.ifPressed}
- Backup dashboard: if opened — ${CANON.objects.backupDashboard.ifOpened}
- FBI/threat-intel sheet: if read — ${CANON.objects.fbiFlyer.ifRead}
- Desk phone lines: ${CANON.objects.deskPhone.lines}

TIMELINE TONIGHT:
${CANON.history.map((h) => `- ${h.when}: ${h.what}`).join("\n")}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
