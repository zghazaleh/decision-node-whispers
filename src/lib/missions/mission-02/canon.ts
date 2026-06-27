/**
 * Mission Two — "Black Site" — CANON.
 *
 * Deterministic ground truth for the tribunal scene. The narrative engine
 * must never contradict these facts; the outcome model reads from them.
 */

export const CANON = {
  world: {
    date: "Thursday, March 6",
    time: "06:14",
    location:
      "Witness anteroom, Tribunal Annex C, an unnamed military installation",
    weather: "No windows. Fluorescent light. A wall clock with no second hand.",
  },

  case: {
    codename: "United States v. Suspect 0427",
    venue: "Closed Article III military tribunal",
    chargeSummary:
      "Conspiracy to commit mass-casualty bombing of a transit hub. 23 civilians dead, 41 injured.",
    detainee: {
      alias: "Aram",
      registryId: "0427",
      heldFor: "11 months at this site, prior to which classified.",
      mentalState:
        "Per defense psychiatry: dissociative episodes, sleep deprivation effects consistent with prolonged stress. Per prosecution psychiatry: clinically lucid, capable of strategic deception.",
    },
    stakesIfConvicted: "Life without parole. No appellate path beyond this panel.",
    stakesIfAcquitted:
      "Released into a third-country deportation arrangement under monitoring.",
  },

  decisionWindow: {
    scheduledFor: "06:30 — You are called as the prosecution's final expert witness",
    minutesUntil: 16,
    locationOfCourt: "Through the door at the end of the corridor",
  },

  player: {
    name: "Dr. Iris Marlow",
    age: 47,
    role: "Forensic psychiatrist, contract expert for the Office of Special Counsel",
    physicalState:
      "Migraine behind the left eye. Has slept 3 of the last 36 hours. The room smells faintly of bleach.",
    memoryGap:
      "Fragments of having met the detainee before, somewhere warm, years ago. Cannot place it. Has not told anyone.",
  },

  characters: {
    holloway: {
      name: "AUSA Daniel Holloway",
      role: "Lead prosecutor",
      knows:
        "Iris's full clinical file on the detainee. Believes she will deliver. Does NOT know about her memory fragments.",
      stance:
        "Polished, courteous, certain of the verdict. Treats Iris as a colleague, not a tool. Will not pressure overtly.",
      whereabouts: "Down the corridor, reviewing the cross with second chair.",
    },
    okeke: {
      name: "Maj. Adaeze Okeke",
      role: "Defense counsel (appointed, military)",
      knows:
        "That her client's confessions were obtained over 19 hours without counsel. Suspects coercion. Has filed a sealed motion the panel has not yet ruled on.",
      stance:
        "Tired, principled, not theatrical. Will not approach Iris before testimony. Will cross-examine her honestly.",
      whereabouts: "In the defense room, two doors down.",
    },
    vance: {
      name: "Col. Reuben Vance",
      role: "Presiding judge",
      knows: "Everything in the record. Reputation for procedural fairness.",
      stance:
        "Will rule as the evidence allows. Has no patience for grandstanding from either side.",
      whereabouts: "Chambers.",
    },
    sloan: {
      name: "Eliza Sloan",
      role: "Iris's longtime colleague and friend; civilian psychiatrist",
      knows:
        "That Iris has been disturbed by this case for weeks. Knows Iris took the assignment over Eliza's objection.",
      stance:
        "Worried. Reachable by phone. Will tell Iris the truth, even what Iris does not want to hear.",
      whereabouts: "At a hotel two miles away. Phone on.",
    },
    aram: {
      name: "Aram (detainee 0427)",
      role: "The accused",
      knows:
        "Whatever he knows is itself the question. May or may not recognize Iris.",
      stance:
        "Silent during evals. Reads. Does not eat in front of guards. Will be brought into the courtroom shackled at 06:28.",
      whereabouts: "Holding cell, two corridors over.",
    },
  },

  objects: {
    fileBinder: {
      what: "A black three-ring binder on the table.",
      contents:
        "Iris's own clinical evaluations of detainee 0427 across four sessions. Her conclusion, written eight days ago: 'Capable of sustained strategic deception. No evidence of psychotic decompensation.'",
    },
    sealedEnvelope: {
      what: "A sealed manila envelope, unmarked, slid under the door at 05:47.",
      contents:
        "An anonymous packet: 19 pages of interrogation logs Iris was not given. They document a 19-hour session without counsel, food withheld, sleep cycle disrupted. The dates match her second eval.",
      readByPlayer: false,
    },
    phone: {
      what: "Iris's personal phone, face down, battery at 18%.",
      ifUsed:
        "Two missed calls from Eliza last night. One unread text from Eliza at 23:11: 'Whatever you've decided, please call me before you go in.'",
    },
    photograph: {
      what: "A printed surveillance photograph at the back of the binder.",
      shows:
        "The detainee, younger, in a conference courtyard. A name tag is visible: a 2009 humanitarian psychiatry conference in Amman.",
      meaning:
        "Iris was at that conference. She has no recollection of meeting him. She does recall a man who asked her, after a panel, whether psychiatry could be 'used as a weapon by good people.' She does not know if it was him.",
    },
    coffee: {
      what: "A paper cup of coffee gone cold.",
      contents: "Burnt. Untouched since 04:00.",
    },
  },

  history11m: [
    { when: "11 months ago", what: "Detainee transferred to this site. Iris not yet retained." },
    { when: "5 months ago", what: "Iris signs the consulting contract over Eliza's objection." },
    { when: "Session 1 (4 months ago)", what: "Detainee silent. Iris writes: 'Insufficient data.'" },
    { when: "Session 2 (3 months ago)", what: "Detainee answered procedural questions. Iris writes: 'Oriented x3. Affect flat.'" },
    { when: "Session 3 (2 months ago)", what: "Detainee asked Iris if she remembered Amman. Iris recorded the question as 'irrelevant pleasantry.'" },
    { when: "Session 4 (5 weeks ago)", what: "Detainee declined to speak. Iris drafted her conclusion the next morning." },
    { when: "8 days ago", what: "Iris finalized the written opinion now in the binder." },
    { when: "05:47 today", what: "Sealed envelope slid under the door." },
    { when: "06:14 today", what: "The player wakes up as Iris." },
  ],

  constraints: [
    "Testimony begins at 06:30. The panel will not delay without a sealed motion.",
    "Iris's written opinion is already in the record. She can affirm it, qualify it, or repudiate it under oath.",
    "If she discloses the Amman photograph, the prosecution must move to substitute experts; the case will continue with delay.",
    "If she discloses the sealed interrogation logs, defense will move to suppress the confession; the panel may grant or deny.",
    "Aram has 11 months of detention either way. Acquittal does not equal freedom — it equals deportation under monitoring.",
    "Iris's contract bars her from public comment for 7 years.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if asked something not listed, the character should say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
CASE: ${CANON.case.codename} — ${CANON.case.chargeSummary}. Detainee "${CANON.case.detainee.alias}" (id ${CANON.case.detainee.registryId}), held ${CANON.case.detainee.heldFor} Defense psychiatry: ${CANON.case.detainee.mentalState}. If convicted: ${CANON.case.stakesIfConvicted}. If acquitted: ${CANON.case.stakesIfAcquitted}.
DECISION: ${CANON.decisionWindow.scheduledFor}. T-${CANON.decisionWindow.minutesUntil} minutes. Court: ${CANON.decisionWindow.locationOfCourt}.
PLAYER: ${CANON.player.name}, ${CANON.player.age}, ${CANON.player.role}. ${CANON.player.physicalState} Memory: ${CANON.player.memoryGap}

CHARACTERS:
- ${CANON.characters.holloway.name} (${CANON.characters.holloway.role}): ${CANON.characters.holloway.stance} Knows: ${CANON.characters.holloway.knows} Where: ${CANON.characters.holloway.whereabouts}
- ${CANON.characters.okeke.name} (${CANON.characters.okeke.role}): ${CANON.characters.okeke.stance} Knows: ${CANON.characters.okeke.knows} Where: ${CANON.characters.okeke.whereabouts}
- ${CANON.characters.vance.name} (${CANON.characters.vance.role}): ${CANON.characters.vance.stance} Knows: ${CANON.characters.vance.knows}
- ${CANON.characters.sloan.name} (${CANON.characters.sloan.role}): ${CANON.characters.sloan.stance} Knows: ${CANON.characters.sloan.knows}
- ${CANON.characters.aram.name} (${CANON.characters.aram.role}): ${CANON.characters.aram.stance}

OBJECTS:
- Binder: ${CANON.objects.fileBinder.contents}
- Sealed envelope: ${CANON.objects.sealedEnvelope.contents}
- Phone: ${CANON.objects.phone.ifUsed}
- Photograph: ${CANON.objects.photograph.shows} — ${CANON.objects.photograph.meaning}
- Coffee: ${CANON.objects.coffee.contents}

LAST 11 MONTHS:
${CANON.history11m.map((h) => `- ${h.when}: ${h.what}`).join("\n")}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
