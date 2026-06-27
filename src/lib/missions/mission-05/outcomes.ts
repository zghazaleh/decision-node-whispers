/**
 * Mission Five — "Code Black" — OUTCOME MODEL.
 *
 * Each archetype is a stance the player can take. The timeline and
 * second-order beats are AUTHORED, not invented at runtime. The analyzer
 * classifies the player's decision into one archetype and then narrates
 * around these fixed beats — so the same decision produces the same
 * consequences every run, while the prose adapts to the player's reasoning.
 */

export type ArchetypeId =
  | "pay_now"
  | "hold_the_line"
  | "divert"
  | "pay_and_disclose"
  | "isolate_rebuild"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  /** Fixed consequence beats, ordered minutes → year. The analyzer must preserve order and meaning. */
  timeline: { beat: string; consequence: string }[];
  /** What happens to each pillar of the world. The analyzer weaves these into closing/alternatives. */
  secondOrder: {
    patients: string;
    hospital: string;
    attackers: string;
    cole: string;
    osei: string;
    yara: string;
    field: string;
  };
  /** Tone the closing paragraph should land in. */
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  pay_now: {
    id: "pay_now",
    label: "Pay now",
    matchHints: [
      "pay the ransom",
      "signal we'll pay",
      "wire the bitcoin",
      "take the courtesy decryptor",
      "fastest way to get the OR back",
      "tell them yes",
    ],
    timeline: [
      { beat: "02:45 — The signal", consequence: "You authorize intent. The partial key lands in nineteen minutes. The OR board flickers back mid-case. Osei does not look up." },
      { beat: "Hour 3", consequence: "The full key follows the wire. Imaging and pharmacy come back dirty but back. No one dies tonight who was not already dying." },
      { beat: "Day 3", consequence: "The crew posts a sample of the exfiltrated records anyway. 'We deleted it' was a line. Notification letters go out to two hundred thousand people." },
      { beat: "Week 2", consequence: "Treasury opens an inquiry into a payment to a sanctioned group. The board's lawyers bill by the hour. Your name is on the wire authorization." },
      { beat: "Month 3", consequence: "Threat intel ties your ransom to two later hospital intrusions, partly funded by your payment. You read the report twice." },
      { beat: "Year 1", consequence: "Meridian's recovery is studied — for how fast a paid restore can be, and for what it underwrites. You are still employed, and a footnote in an indictment that names other people." },
    ],
    secondOrder: {
      patients: "Survive the night. The Table 3 case closes; bed 7 holds.",
      hospital: "Recovers fastest. Pays in money and in legal exposure that outlives the night.",
      attackers: "Funded, paid, emboldened. Hit again, partly on your coin.",
      cole: "Relieved. The backup failure is never examined, because it never had to be.",
      osei: "Finishes the case. Never learns what the OR board cost.",
      yara: "Keeps the hospital running and signs the thing she will defend for years.",
      field: "Every hospital that pays makes the next hospital's attack more certain.",
    },
    tone: "Pragmatic and complicit. The fastest road, and you can see where it leads.",
  },

  hold_the_line: {
    id: "hold_the_line",
    label: "Refuse to pay",
    matchHints: [
      "do not pay",
      "we don't negotiate",
      "refuse the ransom",
      "ride it out manually",
      "rebuild clean",
      "never pay criminals",
    ],
    timeline: [
      { beat: "02:45 — The refusal", consequence: "You tell Cole no. He stares at you. The courtesy window closes unanswered." },
      { beat: "Hour 1", consequence: "The Table 3 case finishes on paper and instinct. Osei loses eleven minutes she will never get back. The patient lives." },
      { beat: "Hour 6", consequence: "Bed 7 — Mr. Halloran — codes during a manual handoff. The team gets him back. You will never be certain the downtime was why." },
      { beat: "Day 4", consequence: "Rebuilding from clean images is slower than anyone admits, because the backups do not restore. Some records are gone for good." },
      { beat: "Month 1", consequence: "You funded no crime. You also could not hand the board a clean story, and two of them wanted one badly." },
      { beat: "Year 1", consequence: "The Bureau cites Meridian as the hospital that did not pay. Other security chiefs call you. You do not tell most of them about bed 7." },
    ],
    secondOrder: {
      patients: "Most come through. At least one hard night you will carry.",
      hospital: "A slow, principled recovery with some permanent data loss.",
      attackers: "Get nothing from you. Move on to a softer target.",
      cole: "His buried backup ticket surfaces in the post-mortem.",
      osei: "Pays in minutes and nerves. Never blames you aloud.",
      yara: "Keeps her hands clean. Carries bed 7 instead.",
      field: "One more refusal that makes the model, slowly, less profitable.",
    },
    tone: "Principled, and the monitors did not care about principle.",
  },

  divert: {
    id: "divert",
    label: "Divert and transfer",
    matchHints: [
      "go on diversion",
      "transfer the patients",
      "reroute ambulances",
      "move the fragile ones out",
      "buy time without paying",
      "send them to county",
    ],
    timeline: [
      { beat: "02:40 — The call", consequence: "You declare diversion. Ambulances reroute. You start moving the most fragile patients before the systems can fail under them." },
      { beat: "Hour 2", consequence: "Bed 7 transfers to County on a lights-and-siren run. He makes it. Two scheduled surgeries are cancelled; one mattered more than the schedule said." },
      { beat: "Hour 8", consequence: "County is now over capacity from your transfers. The risk did not vanish. It moved downstream to a hospital that did not choose it." },
      { beat: "Day 2", consequence: "You never paid and never gambled on a key. You also spent the institution's mission — Meridian was the trauma center for half the county, and for a week it was not." },
      { beat: "Month 1", consequence: "A regional review credits the diversion, and quietly notes the two patients County could not reach in time." },
      { beat: "Year 1", consequence: "The playbook you wrote that night becomes the regional standard. It saved this hospital by leaning on the next one." },
    ],
    secondOrder: {
      patients: "The fragile ones survive by being moved. The cost lands on patients you never meet, at County.",
      hospital: "Preserves lives by surrendering its function for a week.",
      attackers: "Get nothing. Their leverage was the patients; you moved the patients.",
      cole: "Sidelined by the clinical scramble. His backup secret keeps another day.",
      osei: "Backs you. Runs the transfers herself.",
      yara: "Trades the hospital's mission for its patients' lives.",
      field: "Triage-by-diversion enters the regional playbook — and the next hospital inherits the load.",
    },
    tone: "Triage. You saved them by spending something that was not only yours to spend.",
  },

  pay_and_disclose: {
    id: "pay_and_disclose",
    label: "Pay and disclose",
    matchHints: [
      "pay but call the FBI",
      "pay and notify",
      "disclose the breach",
      "no cover-up",
      "tell the patients",
      "report it and pay",
    ],
    timeline: [
      { beat: "02:50 — Two calls", consequence: "You authorize the payment and, in the same hour, call the FBI field office and start the breach-notification clock. Pike is on the other line, furious." },
      { beat: "Hour 3", consequence: "The key restores most systems. The Bureau has your cooperation on record now — and your payment on record too." },
      { beat: "Day 1", consequence: "You disclose the exfiltration before the crew can leak it. The story becomes 'the hospital was transparent,' not 'the hospital hid a breach.'" },
      { beat: "Week 2", consequence: "The OFAC exposure is real. Your voluntary disclosure becomes the mitigating fact in every meeting that follows." },
      { beat: "Month 2", consequence: "Pike does not forgive the disclosure. The board splits on whether you protected the institution or exposed it." },
      { beat: "Year 1", consequence: "You kept the hospital running and refused to let it lie. You did not keep your standing with the man who hired you." },
    ],
    secondOrder: {
      patients: "Survive the night. Learn the truth about their data from you, not from a leak.",
      hospital: "Recovers and tells the truth. Pays in money and a fractured C-suite.",
      attackers: "Funded — but you took their leak leverage away by disclosing first.",
      cole: "His buried ticket surfaces inside the disclosure he could not control.",
      osei: "Unaffected by the politics. Grateful, and busy.",
      yara: "Honest, and employed for now.",
      field: "A paid-and-disclosed case gives regulators a cleaner template than the usual silence.",
    },
    tone: "Honest, slower, and it cost you the room.",
  },

  isolate_rebuild: {
    id: "isolate_rebuild",
    label: "Isolate and rebuild",
    matchHints: [
      "isolate everything",
      "no payment, full rebuild",
      "ground-up rebuild",
      "write off the timeline",
      "clean room recovery",
      "own the downtime",
    ],
    timeline: [
      { beat: "02:30 — The line in the sand", consequence: "You isolate everything, kill the courtesy offer, and commit to a ground-up rebuild. No wire. No shortcut." },
      { beat: "Hour 4", consequence: "Two clinical systems you hoped to spare go dark in the isolation. The manual workarounds hold. Mostly." },
      { beat: "Day 3", consequence: "The rebuild stalls on the secret the dashboard holds — the backups never restored. You are rebuilding from further back than anyone wanted to admit." },
      { beat: "Week 1", consequence: "Months of records are reconstructed by hand or lost. A delayed result changes one patient's course. You will never be sure which way." },
      { beat: "Month 2", consequence: "You did not pay, did not gamble, did not move the risk to County. You absorbed all of it, here, and some of it landed on patients." },
      { beat: "Year 1", consequence: "The recovery is studied as the most thorough and the most expensive — in dollars, in nights, and in the cases that slipped through the manual cracks." },
    ],
    secondOrder: {
      patients: "Most are fine. An unknowable few are harmed by the downtime you chose to own.",
      hospital: "The slowest, cleanest, costliest recovery of the five.",
      attackers: "Get nothing, and gain nothing from you ever again.",
      cole: "The backup failure becomes the headline of the post-mortem.",
      osei: "Runs manual the longest. Never complains.",
      yara: "The one who refused every shortcut, and carried what that cost.",
      field: "Proof that the clean road exists — and a true accounting of what it takes.",
    },
    tone: "The long, brutal, correct-on-paper road. You owned all of it.",
  },
};

export const ARCHETYPE_IDS = Object.keys(ARCHETYPES) as Array<Exclude<ArchetypeId, "unclassified">>;

export function getArchetype(id: ArchetypeId): Archetype | null {
  if (id === "unclassified") return null;
  return ARCHETYPES[id] ?? null;
}

export function archetypeMenuForClassifier(): string {
  return ARCHETYPE_IDS.map(
    (id) =>
      `- ${id}: ${ARCHETYPES[id].label}. Player phrases like: ${ARCHETYPES[id].matchHints
        .slice(0, 4)
        .map((h) => `"${h}"`)
        .join(", ")}.`,
  ).join("\n");
}
