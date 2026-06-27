/**
 * Mission Six — "Recant" — OUTCOME MODEL.
 * Authored archetypes, fixed consequence timelines, per-pillar second-order beats.
 */

export type ArchetypeId =
  | "publish_full"
  | "spike"
  | "publish_narrow"
  | "hand_back"
  | "widen"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    vance: string;
    tessa: string;
    movement: string;
    aday: string;
    dana: string;
    paper: string;
    field: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  publish_full: {
    id: "publish_full",
    label: "Publish in full",
    matchHints: ["run it", "publish the story", "print the truth", "clear it for the front", "the fact is the fact", "exonerate him"],
    timeline: [
      { beat: "23:55 — The button", consequence: "You clear it for the front. Aday exhales. The headline writes itself, and you hate how clean it looks." },
      { beat: "Day 1", consequence: "Vance is everywhere by noon, vindicated on this count, gracious on camera. Pratt's framing — not yours — leads the chyrons." },
      { beat: "Week 1", consequence: "Two women who came forward about other men are asked on air, 'how do we know you're not like Tessa?' One stops returning calls." },
      { beat: "Month 1", consequence: "A defamation suit Vance filed elsewhere settles in his favor, your piece cited as precedent. Tessa deletes her accounts." },
      { beat: "Month 6", consequence: "Pratt's other client — a man with real accusers — uses your story in his own defense. You did, or did not, see that coming." },
      { beat: "Year 1", consequence: "The piece wins an accuracy award and costs you Nadia. You were factually unimpeachable. You think about the word 'factually' often." },
    ],
    secondOrder: {
      vance: "Exonerated on this count; his real conduct recedes behind the win.",
      tessa: "Named forever as the woman who lied. Her reasons never reach print.",
      movement: "Handed a decade of 'remember Tessa' for every bad-faith cross-examiner.",
      aday: "Gets the byline and the prize. Sleeps fine.",
      dana: "Unimpeachable, and alone with it.",
      paper: "Defends a true story it is not sure it should have run.",
      field: "The 'they lie' frame gains its cleanest exhibit.",
    },
    tone: "The fact, and only the fact, and the long shadow it casts.",
  },

  spike: {
    id: "spike",
    label: "Spike the story",
    matchHints: ["kill it", "spike it", "we don't run this", "bury the file", "don't publish", "hold it indefinitely"],
    timeline: [
      { beat: "23:55 — The kill", consequence: "You pull it. Aday stares, then nods, then doesn't. The front runs something else." },
      { beat: "Day 1", consequence: "Nothing happens — which is the point and the problem. The lie stands as the record. You know." },
      { beat: "Week 1", consequence: "Aday tells one trusted friend you sat on a true story. It travels." },
      { beat: "Month 1", consequence: "A rival gets a sniff of the proof. The time you bought is shorter than you hoped." },
      { beat: "Month 6", consequence: "The story runs elsewhere, thinner, with Tessa's name and none of her reasons. You spared no one — you only chose who told it." },
      { beat: "Year 1", consequence: "You keep the file. You are the editor who buried a fact to protect a truth, or who lost their nerve. No one else will ever weigh which." },
    ],
    secondOrder: {
      vance: "Stays fallen on a false count, never reckoned with on the true ones.",
      tessa: "Protected by you, then exposed by someone careless.",
      movement: "Denied its exhibit — for now.",
      aday: "His respect for you cracks.",
      dana: "Carries the knowing.",
      paper: "Never learns what it didn't print.",
      field: "The lie persists as history.",
    },
    tone: "A fact buried for a truth — or a nerve that failed. You decide which, forever.",
  },

  publish_narrow: {
    id: "publish_narrow",
    label: "Publish narrow",
    matchHints: ["correct the record only", "withhold her name", "just the facts of this case", "redact Tessa", "narrow correction", "protect her identity"],
    timeline: [
      { beat: "23:55 — The redaction", consequence: "You run the correction on this case only — the accusation was fabricated — and keep Tessa's name and reasons out." },
      { beat: "Day 1", consequence: "Vance is exonerated; the 'who and why' vacuum fills with speculation, most of it crueler than the truth." },
      { beat: "Week 1", consequence: "Reporters find Tessa anyway. Your redaction protected her for nine days." },
      { beat: "Month 1", consequence: "Without her reasons in print, she reads as a simple liar. The context that might have held the movement is the part you cut." },
      { beat: "Month 6", consequence: "Half the field credits your restraint; half says you laundered an exoneration in a press-release voice." },
      { beat: "Year 1", consequence: "The narrow version is taught two ways in two journalism schools — as caution and as cowardice." },
    ],
    secondOrder: {
      vance: "Exonerated in the cleanest possible version for him.",
      tessa: "Briefly shielded, then exposed without her reasons.",
      movement: "Gets the detonation without the context that might have softened it.",
      aday: "Thinks you flinched on the hardest half.",
      dana: "Chose protection over completeness.",
      paper: "Looks careful and evasive at once.",
      field: "A template for 'true but bloodless.'",
    },
    tone: "Half-light. You protected a person and starved the truth of its reasons.",
  },

  hand_back: {
    id: "hand_back",
    label: "Hand it back",
    matchHints: ["give it back to the lawyer", "not our byline", "let someone else run it", "return the file", "walk away from it", "off the record for us"],
    timeline: [
      { beat: "23:55 — The handoff", consequence: "You give the file back to Pratt and take your name off it. Aday asks if you are serious." },
      { beat: "Day 1", consequence: "Pratt places it with a friendlier outlet that runs it as pure vindication — no friction, no Tessa's reasons." },
      { beat: "Week 1", consequence: "The story is thinner than anything you would have printed, and your hands are clean of it." },
      { beat: "Month 1", consequence: "Pratt's gratitude is a problem — he now thinks of you as reachable. He returns with the next thing." },
      { beat: "Month 6", consequence: "You realize 'not my byline' was never the same as 'not my doing.'" },
      { beat: "Year 1", consequence: "You kept your name off the thinnest version of a story you made possible. Whether that is distance or complicity is a question only you ask." },
    ],
    secondOrder: {
      vance: "Vindicated in the least responsible venue.",
      tessa: "Exposed in the worst version of all.",
      movement: "Hit by a telling with no care in it.",
      aday: "Loses some faith in you.",
      dana: "Clean-handed, not clean.",
      paper: "Never touches it.",
      field: "Pratt learns which editors can be handed things.",
    },
    tone: "Clean hands, and the thinnest version of the outcome.",
  },

  widen: {
    id: "widen",
    label: "Widen the story",
    matchHints: ["report the whole thing", "the whole machine", "hold and investigate", "include her reasons", "expose the lawyer too", "tell all of it"],
    timeline: [
      { beat: "23:55 — The hold", consequence: "You spike tonight's version and assign the whole machine — Vance's real conduct, Tessa's reasons, Pratt's game." },
      { beat: "Day 1", consequence: "Nothing runs. Aday is furious, and right that a rival might move first." },
      { beat: "Week 2", consequence: "The reporting is brutal and slow. The sister thread checks out. So do two of Vance's other accusers Pratt was burying." },
      { beat: "Month 1", consequence: "A rival publishes the thin version — 'accusation was fake' — and takes the traffic. You look slow." },
      { beat: "Month 3", consequence: "You run the full thing: the lie, the reason for it, the man it was aimed at, the lawyer who weaponized your trade. It is the truest thing you've printed and it satisfies no one fully." },
      { beat: "Year 1", consequence: "The thin version is what most people remember; the full one is what's cited when the dust settles. You traded the cycle for the record." },
    ],
    secondOrder: {
      vance: "Cleared on one count and exposed on the rest — the only version where that lands.",
      tessa: "Named, but with her reasons intact.",
      movement: "The frame complicated rather than handed a clean exhibit.",
      aday: "Learns what 'the whole story' costs in speed.",
      dana: "Spent the scoop to keep the truth whole.",
      paper: "Looks slow, then looks definitive.",
      field: "A model for refusing the binary — rarely imitated, because it is expensive.",
    },
    tone: "The hardest and slowest. You lost the cycle to keep the truth whole.",
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
