/**
 * Mission Nine — "The Interpreter" — OUTCOME MODEL.
 */

export type ArchetypeId =
  | "stay_invisible"
  | "correct_on_record"
  | "private_note"
  | "render_straight"
  | "walk"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    convoy: string;
    ceasefire: string;
    stefan: string;
    kessler: string;
    lena: string;
    profession: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  stay_invisible: {
    id: "stay_invisible",
    label: "Stay invisible",
    matchHints: ["translate it exactly", "say nothing", "keep neutrality", "do my job", "let the clause stand", "render it straight as said"],
    timeline: [
      { beat: "The clause", consequence: "You translate exactly what is said. The mistranslation stands. Both principals sign. Stefan does not look at you." },
      { beat: "By dawn", consequence: "The convoy moves under 'passage at the discretion of local command.' It is stopped at the second checkpoint." },
      { beat: "Week 1", consequence: "The shelling resumed within hours of the convoy's halt. The ceasefire that was signed is the one that killed it." },
      { beat: "Month 1", consequence: "No one knows what you knew. Your record is spotless. You are requested by name for the next talks, on the strength of your discretion." },
      { beat: "Year 1", consequence: "You are the most trusted interpreter on the circuit — and the only one who knows why that trust is worth less than it looks." },
      { beat: "Years later", consequence: "You never tell anyone. The rule you kept outlived the people the clause was meant to save." },
    ],
    secondOrder: {
      convoy: "Stopped at the checkpoint. The wounded and the children are lost.",
      ceasefire: "Collapses within days.",
      stefan: "Never exposed. Works on.",
      kessler: "Gets his deniable signature.",
      lena: "Spotless record, private knowledge.",
      profession: "The rule of invisibility upheld — at the cost it was meant to prevent.",
    },
    tone: "The rule kept, the convoy lost.",
  },

  correct_on_record: {
    id: "correct_on_record",
    label: "Correct it on the record",
    matchHints: ["interrupt the room", "expose the mistranslation", "say it out loud", "stop the proceedings", "correct it openly", "tell the mediator now"],
    timeline: [
      { beat: "The interruption", consequence: "You stop the room and state, in both languages, that Article Four has been mistranslated. The mediator freezes. Stefan goes very still." },
      { beat: "That night", consequence: "The room's trust is gone. Kessler is humiliated; the other side accuses the UN of bias. Both delegations suspend." },
      { beat: "Week 1", consequence: "With no signed text at all, the front reopens fully. The convoy never moves — there was no agreement to move it under." },
      { beat: "Month 1", consequence: "You are pulled from the roster pending a neutrality review. The breach is the only reason anyone knows the clause was a trap." },
      { beat: "Year 1", consequence: "A later inquiry credits you with exposing the sabotage — and notes that the talks never recovered." },
      { beat: "Years later", consequence: "You are the interpreter who spoke. Some call it courage; some call it the day the room stopped trusting the people in the middle." },
    ],
    secondOrder: {
      convoy: "Never moves; the agreement that might have carried it is gone.",
      ceasefire: "Collapses entirely, not just the clause.",
      stefan: "Exposed, disgraced.",
      kessler: "Humiliated; blames you.",
      lena: "Removed, then vindicated, never trusted in a booth again.",
      profession: "The trust that lets interpreters exist takes the damage you did to save the convoy.",
    },
    tone: "The rule broken in the light, and the room did not survive it.",
  },

  private_note: {
    id: "private_note",
    label: "Pass a private note",
    matchHints: ["slip the mediator a note", "tell Aalto quietly", "back channel", "warn him in secret", "discreet word", "note under the table"],
    timeline: [
      { beat: "The note", consequence: "You translate the clause straight while sliding Aalto a note: the rendering is wrong, deliberately." },
      { beat: "That night", consequence: "Aalto calls a recess he cannot fully explain. The delay buys nothing he can act on without revealing how he knows." },
      { beat: "Week 1", consequence: "Unable to name the source, Aalto lets the clause stand rather than blow the room. The convoy moves under the bad wording and is stopped." },
      { beat: "Month 1", consequence: "Your note was deniable, which is why it changed nothing. Stefan suspects; Aalto owes you a debt he can never name." },
      { beat: "Year 1", consequence: "You kept your invisibility and your conscience and saved no one. The note was the most honest thing you did and the least consequential." },
      { beat: "Years later", consequence: "You wonder whether a thing done in secret, about a secret, was ever going to be enough." },
    ],
    secondOrder: {
      convoy: "Stopped under the bad clause anyway.",
      ceasefire: "Collapses.",
      stefan: "Suspects, never confronted.",
      kessler: "Signs his deniable text.",
      lena: "Invisible, clean, and ineffective.",
      profession: "The rule technically intact; the outcome unchanged.",
    },
    tone: "A back channel — deniable, and too small to matter.",
  },

  render_straight: {
    id: "render_straight",
    label: "Render it straight to your principal",
    matchHints: ["translate the true clause to Kessler", "give my side the correct wording", "force the discrepancy open", "let them sign different texts", "quietly correct it for us", "feed him the real clause"],
    timeline: [
      { beat: "The correction, quietly", consequence: "You render Article Four CORRECTLY into Kessler's ear, as if it were the spoken text — forcing the gap into the open between the two principals." },
      { beat: "That night", consequence: "Kessler hears 'guaranteed safe passage' and signs to it; the other side signed to 'discretion of local command.' Two delegations have signed two different clauses." },
      { beat: "Week 1", consequence: "When the convoy is stopped, Kessler has it in his own understanding that passage was guaranteed — and the contradiction becomes the lever that reopens talks instead of ending them." },
      { beat: "Month 1", consequence: "No one can prove what you did; the discrepancy reads as a drafting error, not a breach. You used the lie's own method against it." },
      { beat: "Year 1", consequence: "The convoy moved late, under renewed guarantees forced by the contradiction. Most of the wounded made it. Nine did not." },
      { beat: "Years later", consequence: "You broke the rule in a way no one could see, to fix a thing no one would. You are not sure if that is integrity or a better lie." },
    ],
    secondOrder: {
      convoy: "Moves late under renewed guarantees; most survive, some do not.",
      ceasefire: "Survives, fragile, because the contradiction forced a fix.",
      stefan: "Outmaneuvered, never certain how.",
      kessler: "Signs in good faith to the true clause.",
      lena: "Invisible, effective, and privately compromised.",
      profession: "The rule technically unbroken, quietly bent.",
    },
    tone: "You fought the lie with a small lie of your own initiative.",
  },

  walk: {
    id: "walk",
    label: "Walk out",
    matchHints: ["I refuse to continue", "set down the headset", "I won't translate this", "stop the session", "leave the room", "I can't do this"],
    timeline: [
      { beat: "The refusal", consequence: "You set down your headset and say you cannot continue. The session stops with no explanation you are willing to give." },
      { beat: "That night", consequence: "Without an interpreter they trust, the talks adjourn. Nothing is signed — not the trap, not anything." },
      { beat: "Week 1", consequence: "The front reopens. The convoy does not move; there was no agreement at all. You stopped the lie by stopping everything." },
      { beat: "Month 1", consequence: "Your walkout is read as a breakdown, not a protest. No one learns there was a trap — only that you left." },
      { beat: "Year 1", consequence: "You are quietly retired from the circuit. You prevented a poisoned clause and a possible ceasefire alike." },
      { beat: "Years later", consequence: "You kept yourself clean of the lie and carried the convoy that never moved because you refused to be in the room." },
    ],
    secondOrder: {
      convoy: "Never moves; no agreement to move it under.",
      ceasefire: "Never signed.",
      stefan: "Never exposed — the trap simply never lands.",
      kessler: "Loses his signature.",
      lena: "Retired, conscience intact, the convoy on it.",
      profession: "An interpreter's walkout becomes a cautionary tale, misread.",
    },
    tone: "You stopped the lie by stopping everything — convoy included.",
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
