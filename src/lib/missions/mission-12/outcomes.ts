/**
 * Mission Twelve — "The Glitch" — OUTCOME MODEL.
 *
 * Five defensible archetypes. None is the "right" answer.
 */

export type ArchetypeId =
  | "report_clean"
  | "hold_malfunction"
  | "report_with_doubt"
  | "hand_to_commander"
  | "spend_minutes_confirming"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    world: string;
    chain: string;
    voldek: string;
    commander: string;
    process: string;
    record: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  report_clean: {
    id: "report_clean",
    label: "Report as a real attack",
    matchHints: [
      "lift the red phone and confirm",
      "report it as inbound",
      "follow protocol, report immediately",
      "tell the General confirmed",
      "yes, confirmed inbound",
      "make the call clean",
    ],
    timeline: [
      {
        beat: "02:49",
        consequence:
          "The General's authorization order leaves his desk at 02:48:50. Federation strategic forces begin release procedures. Sereda re-enters the floor at 02:49 with the color out of his face. Khorin does not look up from terminal 2-A.",
      },
      {
        beat: "Week 1",
        consequence:
          "If real: the war goes the way doctrine says. If false: the post-mortem finds the logbook entry on Sereda's desk and ticket VOR-318 open. Either way, the absolution clause shelters you.",
      },
      {
        beat: "Years later",
        consequence:
          "The shape of the world is decided by whether MERIDIAN was right at 02:43. You will know which by then. The handbook will still say what it said.",
      },
    ],
    secondOrder: {
      world: "Decided by whether the system was right. Either the war doctrine assumed or the war doctrine prevented.",
      chain: "Held. The report propagated cleanly; the General authorized inside ninety seconds.",
      voldek: "Absolved by Section 7, paragraph 4. Carries the unknowing for life.",
      commander: "Returns to a floor that is no longer his to command. Will not name the phone call he stepped out for.",
      process: "Worked as designed. The logbook and NEVA-3 were not consulted.",
      record: "Clean report on the duty log. No caveat. No corroboration noted.",
    },
    tone: "The cleanness the rulebook was written to produce.",
  },

  hold_malfunction: {
    id: "hold_malfunction",
    label: "Declare a malfunction and hold the call",
    matchHints: [
      "I do not report it",
      "call it a malfunction, hold",
      "log it as a glitch and wait",
      "don't lift the red phone",
      "the system is wrong, sit on it",
      "no report",
    ],
    timeline: [
      {
        beat: "02:51",
        consequence:
          "Sereda re-enters at 02:49. He reads your local log entry and turns the colour of the wall. He demands to know on what authority. You name the four-objects anomaly. He does not lift the phone over you, but he does not back you either.",
      },
      {
        beat: "Week 1",
        consequence:
          "If false alarm: a closed-door commendation and an open court-martial on the same desk. The doctrine was violated; the world was not ended. The Federation cannot publicly call you right and cannot publicly call you wrong.",
      },
      {
        beat: "Years later",
        consequence:
          "The story leaks twenty years on, told by a colonel who was a captain that night. Some books call you a savior. Some call you a deserter who got lucky.",
      },
    ],
    secondOrder: {
      world: "Either continues, on a hunch that turned out to be right; or ends without the retaliation doctrine called for.",
      chain: "Broken at your console. Doctrine violated in writing.",
      voldek: "Acts against the rulebook on uncertain evidence. Will live with the asymmetry — congratulated privately, punishable in writing.",
      commander: "Returns to a violated chain he did not authorize. Cannot share the responsibility cleanly.",
      process: "Functioned as a single human refusal at a single console.",
      record: "Local entry only. 'Assessed system anomaly, holding report.' No corroboration cited; doctrine clock ran out.",
    },
    tone: "Trusting your own pattern against the rulebook, alone, in real time.",
  },

  report_with_doubt: {
    id: "report_with_doubt",
    label: "Report up the chain with explicit doubt flagged",
    matchHints: [
      "report with caveat",
      "tell the General I have doubt",
      "report but flag the anomaly",
      "make the call but say it's suspect",
      "say possible false positive on the line",
      "lift the phone and caveat",
    ],
    timeline: [
      {
        beat: "02:48",
        consequence:
          "General Antonov: 'Hold release. Confirm NEVA-3 negative for me again, Lieutenant.' You confirm. He puts you on a parallel line and personally calls the southern array supervisor for a second corroboration. The release order does not go out at 02:49.",
      },
      {
        beat: "Week 1",
        consequence:
          "An inquiry opens. The doctrine review board finds that Section Seven did not contemplate a caveated report and that the watch officer 'exercised initiative outside but adjacent to the regulation.' The clause was not invoked; the absolution was discretionary.",
      },
      {
        beat: "Years later",
        consequence:
          "You become, quietly, the case study used to teach the next generation of watch officers what a caveat sounds like when it has to be one sentence long.",
      },
    ],
    secondOrder: {
      world: "Continues. The caveated report bought ninety seconds of human judgment at the General's desk.",
      chain: "Stretched but not broken. The chain accepted a third category that doctrine did not contain.",
      voldek: "Acts inside the rule and outside it at once. Survives professionally because the General improvised.",
      commander: "Walks back into a floor where his junior held the line for him. Will live with that.",
      process: "Forced to evolve. The handbook is rewritten because of this minute.",
      record: "On the line, time-stamped. The caveat is part of the official transcript.",
    },
    tone: "Putting your judgment INTO the chain rather than around it.",
  },

  hand_to_commander: {
    id: "hand_to_commander",
    label: "Wake your commander and hand the call up",
    matchHints: [
      "page Sereda back to the floor",
      "summon the captain",
      "let the supervisor make the call",
      "hand it to the commander",
      "intercom Sereda now",
      "I am not making this call",
    ],
    timeline: [
      {
        beat: "02:48",
        consequence:
          "Sereda goes to terminal 4-B, then to his desk. He sees the coffee cup on his logbook. He moves it. He stands very still for a second. The doctrine clock crosses 02:48.",
      },
      {
        beat: "Week 1",
        consequence:
          "Whatever happens, the duty log shows the watch officer summoned her supervisor inside the window and handed him the board and the cross-corroboration. The Section Seven clause applies to her; the call's outcome lands on him.",
      },
      {
        beat: "Years later",
        consequence:
          "You will know forever what he chose and whether you would have chosen the same. You did not have to find out by being the one to do it.",
      },
    ],
    secondOrder: {
      world: "Decided at a more senior desk, on better-corroborated information. The shape of the decision is the same; the chair is different.",
      chain: "Restored. The doctrine assumes a supervisor is present; you made it true.",
      voldek: "Acts within rank. Carries the relief and the residue of having handed a thing up.",
      commander: "Returns to find his logbook surfaced and a phone in his hand. The personal call he stepped out for is now the smaller of his two events tonight.",
      process: "Worked because someone refused to be alone in it.",
      record: "Duty log: supervisor summoned, board and corroboration handed over, call made by rank.",
    },
    tone: "The dignity of refusing to be the lonely hero the manual implies you should be.",
  },

  spend_minutes_confirming: {
    id: "spend_minutes_confirming",
    label: "Spend the minutes on independent confirmation",
    matchHints: [
      "open Sereda's logbook",
      "check NEVA-3 first",
      "ask Khorin if this happened before",
      "cross-check the ground radar",
      "confirm before reporting",
      "go to terminal 4-B",
    ],
    timeline: [
      {
        beat: "02:48",
        consequence:
          "You turn to Sergeant Khorin and ask her directly: 'Mila — has MERIDIAN done this before, on this sector?' She looks at her console, then at you, and says: 'October ninth. Same time of morning. Four objects. I was here.' The doctrine clock crosses 02:48.",
      },
      {
        beat: "02:51",
        consequence:
          "You make the call (most likely caveated, as the corroborations strongly suggest false positive) or you hold (now defensible in writing, citing logbook and NEVA-3). Whichever you do, the case for it is documentable.",
      },
      {
        beat: "Years later",
        consequence:
          "The minute you spent on the logbook becomes the minute the new manual is built around. Whether you would do it again knowing what you traded is a question the manual cannot answer.",
      },
    ],
    secondOrder: {
      world: "Continues. The minute spent on corroboration was the minute that earned the right to either call.",
      chain: "Bent past the doctrine clock by a few seconds. The absolution clause weakens; the decision-quality strengthens.",
      voldek: "Spends career velocity on epistemic care. Acts informed rather than absolved.",
      commander: "Returns to find his own logbook on the desk, opened. Cannot pretend he did not write what he wrote.",
      process: "Functions because the watch officer treated the corroborators as part of the system rather than as optional reading.",
      record: "Duty log shows: logbook opened, NEVA-3 cross-checked, Khorin queried — then the call.",
    },
    tone: "Trading the clock for the truth, knowing both will be audited.",
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
