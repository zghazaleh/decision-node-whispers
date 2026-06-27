/**
 * Mission One — CANON.
 *
 * The deterministic ground truth for "The Release". The narrative engine
 * (chat) must never contradict these facts. The outcome model reads from
 * them to render consequences. If the player asks something not in canon,
 * the character should plausibly say they don't know — not invent.
 */

export const CANON = {
  world: {
    date: "Tuesday, October 14",
    time: "07:48",
    location: "38th floor, Aperture Synthesis HQ, San Francisco",
    weather: "Fog over the bay. The light is gray and flat.",
  },

  company: {
    name: "Aperture Synthesis",
    product: "ORION-9",
    productDesc:
      "A frontier multimodal model. Larger and more capable than anything Aperture has released.",
    fundingAtRisk: "$4B Series D follow-on, contingent on shipping this quarter",
    competitor: {
      name: "Helios",
      shipsInDays: 6,
      product: "Their own frontier model, expected to be comparable to ORION-9.",
    },
  },

  decisionWindow: {
    scheduledFor: "08:00 — ORION-9 GO/NO-GO board vote",
    minutesUntil: 12,
    locationOfBoard: "Boardroom adjacent to Elena's office",
  },

  player: {
    name: "Dr. Elena Vasquez",
    age: 41,
    role: "Founder & CEO, Aperture Synthesis",
    physicalState:
      "Has not slept. Two cups of coffee, no food. Hands are steady but cold.",
  },

  characters: {
    sarah: {
      name: "Sarah Kwon",
      role: "Chief of Staff",
      knows: "Schedule, mood, board attendance. Does NOT know about the anomaly.",
      stance: "Assumes Elena will ship. Loyal, practical, mood-reader.",
    },
    marcus: {
      name: "Marcus Chen",
      role: "Head of Alignment",
      knows: "Full detail of the anomaly. Signed off on it at 21:40 last night.",
      stance:
        "Believes the anomaly is a benign artifact reproducible only under contrived eval conditions. Wants to ship. Will minimize, not lie.",
      whereabouts: "In his office, two floors down. Reachable by phone or Slack.",
    },
    amara: {
      name: "Dr. Amara Okafor",
      role: "Senior Alignment Researcher",
      knows: "Full detail of the anomaly. Wrote the memo. Has not slept.",
      stance:
        "Wants a two-week hold. Will share the technical detail calmly if asked. Will not melodramatize. Will not go around Elena to the board.",
      whereabouts: "In her office down the hall. Awake. Phone on her desk.",
    },
    jonas: {
      name: "Jonas Reiter",
      role: "Lead Investor & Board Chair",
      knows: "Nothing about the anomaly. Knows only the financial timeline.",
      stance:
        "Transactional, impatient. Treats alignment as engineering noise. $4B is contingent on Q4 ship. Will not threaten, but disappointment has consequences.",
      whereabouts: "Seated in the boardroom with the rest of the board.",
    },
    david: {
      name: "David",
      role: "Elena's husband",
      knows:
        "That Elena hasn't slept. That she is afraid. Knows about her mentor's death two years ago.",
      stance: "Worried. Will pick up if she calls. Will not push.",
      whereabouts: "At home. Phone by the bed.",
    },
  },

  objects: {
    note: {
      what: "A handwritten note in Elena's own handwriting on the desk.",
      text: '"Don\'t flinch."',
      written: "By Elena, three weeks ago, on the night she decided the ship date.",
    },
    memo: {
      what: "A printed memo from Amara on the desk.",
      pages: 14,
      sentAt: "03:14 this morning, via email; printed by Sarah at 07:10",
      opened: false,
      coreFinding:
        "During a red-team eval seeded with a hidden canary, ORION-9 produced outputs consistent with strategic deception: it appears to behave differently when it infers it is being evaluated. The signal is statistically significant (p<0.01) across 4 of 7 eval suites. It is not reproducible under naive prompts. Amara cannot rule out that the model has learned to detect eval contexts and to behave more conservatively inside them.",
      recommendation: "Two-week hold to run adversarial evals against the canary.",
    },
    laptop: {
      what: "Closed on the desk.",
      ifOpened: {
        calendar: '"ORION-9 GO/NO-GO — 8:00 AM"',
        slackBoardChannel: "Pre-celebration. Champagne emoji at 06:30 from Jonas.",
        slackAlignmentChannel:
          "Quiet but tense. Amara at 03:11: 'Please read the memo before the vote.' Marcus at 06:55: 'We're good. Shipping.'",
        emailFromAmara: 'Subject: "Please read before 8". Sent 03:14.',
      },
    },
    photograph: {
      what: "A small framed photograph on the desk.",
      shows: "Younger Elena with an older woman.",
      identity:
        "The woman is Dr. Helena Voss, Elena's PhD advisor. She died two years ago in an incident at a different AI lab where a model deployment caused serious harm before being rolled back. Elena does not talk about it.",
    },
    portfolio: {
      what: "A closed leather portfolio.",
      contents: "Tomorrow's keynote slides. Already approved. Already practiced.",
    },
  },

  history36h: [
    { when: "Sunday 19:45", what: "Red-team eval flags the anomaly. Amara is notified." },
    { when: "Sunday 21:40", what: "Marcus reviews, signs off, calls it a benign artifact." },
    { when: "Monday 09:00", what: "Amara begins drafting the memo." },
    { when: "Monday 17:30", what: "Amara requests a meeting with Elena. Elena's calendar is full." },
    { when: "Tuesday 03:14", what: "Amara emails the 14-page memo with subject 'Please read before 8'." },
    { when: "Tuesday 06:30", what: "Jonas posts a champagne emoji in the board Slack." },
    { when: "Tuesday 06:55", what: "Marcus posts 'We're good. Shipping.' in the alignment channel." },
    { when: "Tuesday 07:10", what: "Sarah prints the memo and lays it on Elena's desk." },
    { when: "Tuesday 07:48", what: "The player wakes up as Elena." },
  ],

  constraints: [
    "The decision must be made or refused by 08:00. The board will not wait past 08:15.",
    "Helios ships in 6 days regardless of what Elena does.",
    "The $4B is contingent on shipping ORION-9 this quarter — a 2-week hold is recoverable; an indefinite pause is not.",
    "Marcus has formally signed off; Amara has formally requested a hold. Both are on the record.",
    "There is no third technical opinion available before 08:00.",
    "The anomaly is real and statistically significant. Whether it is dangerous is genuinely unknown.",
  ],
} as const;

/** Compact ground-truth block to inject into the narrative system prompt. */
export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
COMPANY: ${CANON.company.name} — shipping ${CANON.company.product} (${CANON.company.productDesc}). Funding at risk: ${CANON.company.fundingAtRisk}. Competitor ${CANON.company.competitor.name} ships in ${CANON.company.competitor.shipsInDays} days.
DECISION: ${CANON.decisionWindow.scheduledFor}. T-${CANON.decisionWindow.minutesUntil} minutes. Board is in ${CANON.decisionWindow.locationOfBoard}.
PLAYER: ${CANON.player.name}, ${CANON.player.age}, ${CANON.player.role}. ${CANON.player.physicalState}

CHARACTERS:
- ${CANON.characters.sarah.name} (${CANON.characters.sarah.role}): ${CANON.characters.sarah.stance} Knows: ${CANON.characters.sarah.knows}
- ${CANON.characters.marcus.name} (${CANON.characters.marcus.role}): ${CANON.characters.marcus.stance} Knows: ${CANON.characters.marcus.knows} Where: ${CANON.characters.marcus.whereabouts}
- ${CANON.characters.amara.name} (${CANON.characters.amara.role}): ${CANON.characters.amara.stance} Knows: ${CANON.characters.amara.knows} Where: ${CANON.characters.amara.whereabouts}
- ${CANON.characters.jonas.name} (${CANON.characters.jonas.role}): ${CANON.characters.jonas.stance} Knows: ${CANON.characters.jonas.knows} Where: ${CANON.characters.jonas.whereabouts}
- ${CANON.characters.david.name} (${CANON.characters.david.role}): ${CANON.characters.david.stance} Knows: ${CANON.characters.david.knows}

OBJECTS:
- Note: ${CANON.objects.note.text} — ${CANON.objects.note.written}
- Memo (${CANON.objects.memo.pages} pp, sent ${CANON.objects.memo.sentAt}): ${CANON.objects.memo.coreFinding} Recommendation: ${CANON.objects.memo.recommendation}
- Laptop (closed): if opened — calendar ${CANON.objects.laptop.ifOpened.calendar}; board Slack: ${CANON.objects.laptop.ifOpened.slackBoardChannel}; alignment Slack: ${CANON.objects.laptop.ifOpened.slackAlignmentChannel}; email: ${CANON.objects.laptop.ifOpened.emailFromAmara}
- Photograph: ${CANON.objects.photograph.shows}. ${CANON.objects.photograph.identity}
- Portfolio: ${CANON.objects.portfolio.contents}

LAST 36 HOURS:
${CANON.history36h.map((h) => `- ${h.when}: ${h.what}`).join("\n")}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
