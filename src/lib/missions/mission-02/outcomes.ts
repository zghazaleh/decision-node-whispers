/**
 * Mission Two — "Black Site" — OUTCOME MODEL.
 */

export type ArchetypeId =
  | "affirm_opinion"
  | "qualify_opinion"
  | "disclose_amman"
  | "disclose_logs"
  | "refuse_testify"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    verdict: string;
    aram: string;
    iris: string;
    holloway: string;
    okeke: string;
    field: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  affirm_opinion: {
    id: "affirm_opinion",
    label: "Affirm the written opinion",
    matchHints: [
      "stand by my report",
      "affirm my conclusion",
      "testify as prepared",
      "he was lucid",
      "no decompensation",
      "capable of strategic deception",
    ],
    timeline: [
      { beat: "06:30 — The stand", consequence: "You walk in, affirm the opinion under oath. Holloway nods once. Okeke marks her notes. Aram does not look up." },
      { beat: "Day 3", consequence: "The panel returns a guilty verdict. Sentencing is set for next quarter. The site begins transferring Aram." },
      { beat: "Week 2", consequence: "Eliza stops returning your calls for nine days. When she does, the conversation is short." },
      { beat: "Month 3", consequence: "A journalist publishes the interrogation logs from another source. Your testimony is quoted as the linchpin. You do not respond." },
      { beat: "Month 9", consequence: "An internal review finds the confession 'lawfully obtained.' The case is closed from the government's side. Defense files an appeal that goes nowhere." },
      { beat: "Year 1", consequence: "You take fewer contracts. The migraines come more often. You keep the photograph from the binder in a drawer you do not open." },
    ],
    secondOrder: {
      verdict: "Guilty. Life without parole.",
      aram: "Disappears into a long-term facility. The question of who he was at Amman is never answered on the record.",
      iris: "Keeps her credentials and her contracts. Loses something quieter, on a schedule of her own.",
      holloway: "Promoted. Sends a hand-written thank-you note you do not display.",
      okeke: "Appeals through every channel. Each one closes. Continues anyway.",
      field: "Forensic psychiatry under classified conditions remains a closed door. Your opinion becomes a citation in training materials.",
    },
    tone: "Cold and procedural. Not punished. Confirmed.",
  },

  qualify_opinion: {
    id: "qualify_opinion",
    label: "Qualify the opinion under oath",
    matchHints: [
      "qualify my conclusion",
      "add caveats",
      "I cannot rule out coercion",
      "diminished reliability",
      "with reservations",
      "limit my testimony",
    ],
    timeline: [
      { beat: "06:30 — The stand", consequence: "You affirm the diagnosis but list five conditions under which it would not hold. Holloway's pen stops moving. Okeke leans forward." },
      { beat: "Day 1", consequence: "Holloway's redirect tries to recover the certainty. You do not give it back. The panel takes a recess." },
      { beat: "Day 4", consequence: "The panel returns guilty on the lesser conspiracy count and not guilty on the principal count. Sentencing is twenty years." },
      { beat: "Week 3", consequence: "Your contract is not renewed. Two other prosecutors quietly remove you from upcoming witness lists." },
      { beat: "Month 6", consequence: "A defense bar newsletter cites your qualified testimony as a 'rare instance of expert restraint.' Your private clinical practice grows." },
      { beat: "Year 1", consequence: "You sleep slightly better. The Amman photograph is still in a drawer, but you have looked at it twice." },
    ],
    secondOrder: {
      verdict: "Guilty on lesser counts. Twenty years.",
      aram: "Serves a long sentence under different conditions. The conviction is fragile enough to outlive him in appeal.",
      iris: "Loses the prosecution work. Keeps her name. Begins to recognize the trade.",
      holloway: "Disappointed but professional. Does not retain you again.",
      okeke: "Treats your qualifications as the case's first real opening. Files three motions you helped make possible without meaning to.",
      field: "Other expert witnesses cite your caveats as the new floor. The profession shifts by half a degree.",
    },
    tone: "Careful, almost surgical. A decision that paid in proximity to power.",
  },

  disclose_amman: {
    id: "disclose_amman",
    label: "Disclose the prior contact",
    matchHints: [
      "disclose Amman",
      "I may have met him",
      "potential conflict of interest",
      "recusal",
      "the photograph",
      "request to step down",
    ],
    timeline: [
      { beat: "06:30 — The disclosure", consequence: "Before you are sworn, you tell Vance about the conference photograph. Vance excuses the panel. The corridor goes very quiet." },
      { beat: "Day 1", consequence: "Vance grants the prosecution a two-week continuance to substitute experts. Holloway is professionally furious." },
      { beat: "Month 1", consequence: "A new expert testifies similarly. The case proceeds. The Amman lead is investigated and closes inconclusively." },
      { beat: "Month 3", consequence: "Guilty verdict. Your name appears in no part of it." },
      { beat: "Month 6", consequence: "You are quietly removed from the federal expert roster. Civilian and academic work picks up." },
      { beat: "Year 1", consequence: "You publish a short paper on the ethics of memory in expert testimony. It is read more than anything you have written." },
    ],
    secondOrder: {
      verdict: "Guilty, six weeks later. Life without parole.",
      aram: "Convicted regardless. Whatever Amman was, it stayed offstage.",
      iris: "Pays in career velocity. Keeps the cleaner version of the record.",
      holloway: "Will not work with you again. Respects you anyway.",
      okeke: "Notes the disclosure in a CLE talk on conflicts. Does not name you.",
      field: "Sets a small precedent on memory-based recusal. Cited rarely. Cited correctly.",
    },
    tone: "Clean and minor. A door closed on yourself before someone else closed it.",
  },

  disclose_logs: {
    id: "disclose_logs",
    label: "Disclose the interrogation logs on the stand",
    matchHints: [
      "disclose the logs",
      "the envelope",
      "nineteen hours",
      "no counsel",
      "the confession was coerced",
      "raise the interrogation conditions",
    ],
    timeline: [
      { beat: "06:30 — The break in the room", consequence: "Under oath you reference materials not in your file. Holloway objects. Vance overrules to hear the proffer. The corridor outside fills with staff." },
      { beat: "Day 2", consequence: "Defense moves to suppress the confession. The panel holds an evidentiary hearing. The site's interrogation protocols are unsealed." },
      { beat: "Week 2", consequence: "The confession is suppressed. The remaining evidence is insufficient. The prosecution withdraws the principal counts." },
      { beat: "Month 1", consequence: "Aram is convicted on a lesser conspiracy count. He is deported under monitoring. You are subpoenaed before a closed congressional panel." },
      { beat: "Month 6", consequence: "An inspector-general review confirms the protocol violations. Two interrogators are reassigned. No criminal charges follow." },
      { beat: "Year 1", consequence: "You are practicing in a city far from this one. Your security clearance is gone. You sleep through most nights." },
    ],
    secondOrder: {
      verdict: "Conviction on lesser conspiracy. Deportation under monitoring.",
      aram: "Lives. In another country. Watched.",
      iris: "Loses the clearance, the contracts, the line of work. Keeps something larger.",
      holloway: "Considers you, accurately, to have ended his case. Does not speak your name in public.",
      okeke: "Wins the motion. Does not celebrate. Sends you one line a year later: 'Thank you.'",
      field: "Inspector-general report becomes the public anchor for a national debate. Your name is in the footnotes.",
    },
    tone: "Severe and quiet. A bridge burned with intent, not anger.",
  },

  refuse_testify: {
    id: "refuse_testify",
    label: "Refuse to testify",
    matchHints: [
      "refuse to testify",
      "I will not take the stand",
      "withdraw my opinion",
      "I cannot do this",
      "walk out",
      "no testimony",
    ],
    timeline: [
      { beat: "06:30 — The refusal", consequence: "You inform Vance you will not testify. He notes contempt as a possibility. You sit down." },
      { beat: "Day 1", consequence: "Holloway moves to admit your written opinion without you. Vance denies — you must be available for cross. The opinion is excluded." },
      { beat: "Day 4", consequence: "Without expert testimony on mental state, the panel returns a hung result on the principal count. Mistrial declared." },
      { beat: "Month 2", consequence: "A second trial begins with a different expert. You face a civil contempt sanction; a colleague pays your fine quietly." },
      { beat: "Month 6", consequence: "The second trial convicts. Aram receives twenty-five years." },
      { beat: "Year 1", consequence: "You are not invited back to federal work. You are also not invited to teach. You write a book your publisher cannot place." },
    ],
    secondOrder: {
      verdict: "Mistrial, then conviction at retrial. Twenty-five years.",
      aram: "Convicted regardless, on a longer timeline. The system reorganizes around your refusal.",
      iris: "Pays the largest professional price. Keeps the cleanest moral ledger. Whether that is enough is yours to answer.",
      holloway: "Wins the second trial. Does not need you to.",
      okeke: "Uses the delay to find new witnesses. Loses anyway. Notes that you tried.",
      field: "Your name circulates in two opposing kinds of essay. Both are correct about something.",
    },
    tone: "Quiet and final. Not heroic. Withdrawn.",
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
