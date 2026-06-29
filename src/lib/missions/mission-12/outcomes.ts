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
        beat: "02:47:30",
        consequence:
          "You lift the handset. General Antonov answers in three seconds. 'Watch officer — confirmed inbound, yes or no?' You say: confirmed. The line clicks once and goes to the duty staff. The board's confidence indicator flickers and re-settles on HIGH.",
      },
      {
        beat: "02:49",
        consequence:
          "The General's authorization order leaves his desk at 02:48:50. Federation strategic forces begin release procedures. Sereda re-enters the floor at 02:49 with the color out of his face. Khorin does not look up from terminal 2-A.",
      },
      {
        beat: "02:54",
        consequence:
          "Either: the four MERIDIAN tracks were real and the Federation strike arrives over Concord cities at 03:11 — followed by the larger Concord retaliation that MERIDIAN never saw coming. Or the tracks were the October 9 phantom again, and the Federation has just opened a nuclear war on a sensor glitch. Within the window, you cannot tell which.",
      },
      {
        beat: "Week 1",
        consequence:
          "If real: the war goes the way doctrine says. If false: the post-mortem finds the logbook entry on Sereda's desk and ticket VOR-318 open. Either way, the absolution clause shelters you.",
      },
      {
        beat: "Year 1",
        consequence:
          "The board of inquiry — if there is anything left to convene one — records that the watch officer reported per Section 7 in good faith. The clause holds. You are not court-martialled. You also do not sleep.",
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
        beat: "02:47:40",
        consequence:
          "You set the handset down and key the local console: 'MERIDIAN-7 event 02:43 — assessed system anomaly, holding report pending corroboration.' The board keeps its red. The doctrine clock rolls past 02:48 without a call going up.",
      },
      {
        beat: "02:51",
        consequence:
          "Sereda re-enters at 02:49. He reads your local log entry and turns the colour of the wall. He demands to know on what authority. You name the four-objects anomaly. He does not lift the phone over you, but he does not back you either.",
      },
      {
        beat: "03:11",
        consequence:
          "Either nothing happens — the tracks fade off MERIDIAN at 03:04 and NEVA-3 stays clear, and the world goes on without knowing. Or the tracks were real and the first ground bursts are reported from Concord targets at 03:11 — followed by detonations on Federation soil at 03:24 without a release order having gone out.",
      },
      {
        beat: "Week 1",
        consequence:
          "If false alarm: a closed-door commendation and an open court-martial on the same desk. The doctrine was violated; the world was not ended. The Federation cannot publicly call you right and cannot publicly call you wrong.",
      },
      {
        beat: "Year 1",
        consequence:
          "If false alarm: you are quietly retired with no reduction in rank. Your name does not appear in any released document. If real: there is no Year 1.",
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
        beat: "02:47:50",
        consequence:
          "You lift the handset. 'General — Voskaya watch, Voldek. MERIDIAN-7 declares four inbound western seaboard, confidence HIGH. Reporting per Section Seven with doubt: pattern below first-strike threshold, NEVA-3 corroboration negative, October 9 false-positive precedent in this sector.' The line is silent for three seconds.",
      },
      {
        beat: "02:48",
        consequence:
          "General Antonov: 'Hold release. Confirm NEVA-3 negative for me again, Lieutenant.' You confirm. He puts you on a parallel line and personally calls the southern array supervisor for a second corroboration. The release order does not go out at 02:49.",
      },
      {
        beat: "02:53",
        consequence:
          "Sereda is back on the floor. The southern array reports nothing. The MERIDIAN tracks begin to break up at 02:51 and are gone by 02:54. The General accepts an anomaly classification at 02:56.",
      },
      {
        beat: "Week 1",
        consequence:
          "An inquiry opens. The doctrine review board finds that Section Seven did not contemplate a caveated report and that the watch officer 'exercised initiative outside but adjacent to the regulation.' The clause was not invoked; the absolution was discretionary.",
      },
      {
        beat: "Year 1",
        consequence:
          "Section Seven is rewritten to permit and structure caveated reports. NEVA-3 is reinstated as a mandatory corroborator. Engineering ticket VOR-318 is closed. The episode is classified for fifteen years.",
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
        beat: "02:47:50",
        consequence:
          "You key the intercom. 'Captain Sereda to the floor, code red, doctrine clock.' He is through the blast door in twenty seconds. You hand him the board with one sentence: 'Four objects, MERIDIAN-7, NEVA-3 negative on terminal 4-B.'",
      },
      {
        beat: "02:48",
        consequence:
          "Sereda goes to terminal 4-B, then to his desk. He sees the coffee cup on his logbook. He moves it. He stands very still for a second. The doctrine clock crosses 02:48.",
      },
      {
        beat: "02:50",
        consequence:
          "He picks up the red phone himself. What he says to General Antonov is on him. He may report clean. He may caveat. He may declare an anomaly. The decision passes to a rank with the authority to spend it.",
      },
      {
        beat: "Week 1",
        consequence:
          "Whatever happens, the duty log shows the watch officer summoned her supervisor inside the window and handed him the board and the cross-corroboration. The Section Seven clause applies to her; the call's outcome lands on him.",
      },
      {
        beat: "Year 1",
        consequence:
          "Sereda's career is altered, in either direction, by what he did with the handset. Yours is not. You were a junior officer who followed the unwritten rule: get the senior person on the floor before a four-minute call.",
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
        beat: "02:47:20",
        consequence:
          "You stand. You lift the coffee cup off Sereda's logbook and find the October 9 entry: low-elevation sun-glare false-positive over the same seaboard, four objects, ticket VOR-318 open, NEVA-3 advisory in writing. You walk three steps to terminal 4-B: NEVA-3 sweep clear on the northern arc, no ascent tracks, no separations.",
      },
      {
        beat: "02:48",
        consequence:
          "You turn to Sergeant Khorin and ask her directly: 'Mila — has MERIDIAN done this before, on this sector?' She looks at her console, then at you, and says: 'October ninth. Same time of morning. Four objects. I was here.' The doctrine clock crosses 02:48.",
      },
      {
        beat: "02:49",
        consequence:
          "You now have two independent corroborations and a named witness. You also have a doctrine clock that has technically expired. You can still reach the General — the absolution clause is weaker but not gone. What you say next is now informed.",
      },
      {
        beat: "02:51",
        consequence:
          "You make the call (most likely caveated, as the corroborations strongly suggest false positive) or you hold (now defensible in writing, citing logbook and NEVA-3). Whichever you do, the case for it is documentable.",
      },
      {
        beat: "Week 1",
        consequence:
          "An inquiry opens — both because the window was technically blown and because the war did not start. The corroborations you collected are in the inquiry binder. Section Seven's absolution applies; the question is whether your three-minute corroboration delay does.",
      },
      {
        beat: "Year 1",
        consequence:
          "Doctrine is revised: MERIDIAN-7 events require NEVA-3 cross-check before reporting. Ticket VOR-318 is closed. You are not promoted on schedule; you are also not removed. You traded your career velocity for due caution.",
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
