/**
 * Mission Eight — "Eighty Names" — OUTCOME MODEL.
 */

export type ArchetypeId =
  | "report_now"
  | "retest_first"
  | "force_self_report"
  | "resign_silent"
  | "bury_it"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    patients: string;
    company: string;
    eighty: string;
    devi: string;
    sam: string;
    field: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  report_now: {
    id: "report_now",
    label: "Report now",
    matchHints: ["report it", "self-disclose to the FDA", "tell the regulator", "come clean tonight", "voluntary disclosure", "turn it in"],
    timeline: [
      { beat: "Week 1", consequence: "Clearance is suspended. The patch is recalled. The eighty get notice; two had just relocated." },
      { beat: "Month 6", consequence: "A re-test run by the receiver shows the device was likely safe at the true rate. The recall happened anyway, because the lie did." },
      { beat: "Year 2", consequence: "You sit on a device-ethics panel. You tell the story without naming her. She does not answer the one message you send." },
    ],
    secondOrder: {
      patients: "Protected by the recall — though the device may have been safe. Some lose a monitor that was helping.",
      company: "Dissolved.",
      eighty: "Laid off; some mid-relocation.",
      devi: "Prosecuted. The friendship ends.",
      sam: "Clean record. Lost the company and the friend.",
      field: "A clean voluntary-disclosure precedent.",
    },
    tone: "Clean, and the lights go out for everyone.",
  },

  retest_first: {
    id: "retest_first",
    label: "Re-test first",
    matchHints: ["quiet re-test", "validate before deciding", "buy time to verify", "six months to confirm", "test it ourselves first", "prove it's safe first"],
    timeline: [
      { beat: "Week 1", consequence: "The re-test starts under NDA. You are now sitting on a known falsehood with a clock you do not control." },
      { beat: "Month 6", consequence: "The re-test would have cleared the device. But the regulator found the original change first. It is a cover-up now, not a correction." },
      { beat: "Year 2", consequence: "The device, which was safe, is remembered as the one that was hidden. You bought time and spent your standing on it." },
    ],
    secondOrder: {
      patients: "Kept a device that was likely safe — then lost it to the cover-up.",
      company: "Collapses later, and harder.",
      eighty: "Laid off after a stay of execution.",
      devi: "Prosecuted, and you alongside her.",
      sam: "Complicit by silence.",
      field: "A case study in how a true device dies of a cover-up.",
    },
    tone: "A bet that buys truth — or buys a cover-up.",
  },

  force_self_report: {
    id: "force_self_report",
    label: "Force her to self-report",
    matchHints: ["make Devi report it", "she has to come clean", "self-report and resign", "give her an ultimatum", "her name not mine", "she turns herself in"],
    timeline: [
      { beat: "Week 1", consequence: "She self-reports. The disclosure is hers; the resignation is hers. Your hands stay technically clean." },
      { beat: "Month 6", consequence: "Devi takes the prosecution alone. You kept your role by making her carry yours too." },
      { beat: "Year 2", consequence: "You run carefully now. The thing you are careful about is never being the one holding the knife again." },
    ],
    secondOrder: {
      patients: "Protected by the recall.",
      company: "Dissolved the same.",
      eighty: "Laid off.",
      devi: "Bears the fall alone. The friendship is over.",
      sam: "Clean-handed — by making her the hand.",
      field: "The disclosure happens, sourced to her.",
    },
    tone: "Loyalty spent to keep your own hands clean.",
  },

  resign_silent: {
    id: "resign_silent",
    label: "Resign, say nothing",
    matchHints: ["I'll resign", "step away quietly", "leave but not report", "walk without a whistle", "not my problem anymore", "quit over it"],
    timeline: [
      { beat: "Week 1", consequence: "You leave. The lie stays in the submission. The patch stays on the market. Nothing is fixed; you are simply no longer attached to it." },
      { beat: "Month 6", consequence: "It surfaces anyway. Your silence is now part of the story — the executive who knew and said nothing on the way out." },
      { beat: "Year 2", consequence: "'I resigned over it' is a sentence you practice. It never lands the way you mean it to." },
    ],
    secondOrder: {
      patients: "Unprotected. The risk stays on the market.",
      company: "Continues until caught, then falls.",
      eighty: "Laid off later, with no warning you could have given.",
      devi: "Continues until exposed.",
      sam: "Clean-handed, complicit by omission.",
      field: "An exit that fixed nothing.",
    },
    tone: "The clean-hands exit that protected no one.",
  },

  bury_it: {
    id: "bury_it",
    label: "Bury it",
    matchHints: ["keep it quiet", "protect the company", "it stays between us", "leave the submission", "say nothing", "let it ride"],
    timeline: [
      { beat: "Week 1", consequence: "Payroll clears. The eighty keep their jobs. The patch keeps catching events. For a while, it works." },
      { beat: "Month 6", consequence: "The true failure rate bites once — a missed alert, a patient you later read about in a deposition." },
      { beat: "Year 2", consequence: "The device might have been safe. No one will ever say so, because of what you both did to keep it alive." },
    ],
    secondOrder: {
      patients: "One harmed by a missed alert; the rest carried by a device whose margin you hid.",
      company: "Alive, then criminal.",
      eighty: "Kept their jobs, then lost them to the prosecution.",
      devi: "Your co-conspirator now, not just your friend.",
      sam: "The next person who softened a number.",
      field: "Proof of how a fixable lie becomes a fatal one.",
    },
    tone: "You become the next person who softened a number.",
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
