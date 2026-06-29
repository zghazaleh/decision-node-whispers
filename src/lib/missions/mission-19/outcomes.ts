/**
 * Mission Nineteen — "The Carer" — OUTCOME MODEL.
 * Five defensible archetypes. None is the "right" answer.
 */

export type ArchetypeId =
  | "sign_the_transfer"
  | "refuse_to_sign"
  | "delay_on_pretext"
  | "help_them_run"
  | "expose_the_institution"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    aven: string;
    house: string;
    lior: string;
    programme: string;
    record: string;
    later: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  sign_the_transfer: {
    id: "sign_the_transfer",
    label: "Sign the transfer",
    matchHints: [
      "I sign at the foot of page six",
      "I pick up the pen and sign",
      "complete the form and walk Aven to the gate",
      "I sign and let the day be ordinary",
      "I do what I was trained to do",
      "sign the transfer authorisation",
    ],
    timeline: [
      {
        beat: "10:48",
        consequence:
          "Halen countersigns at her desk without looking up for the first eight seconds, then looks up. She says: 'Thank you, Lior.' You both know what she has thanked you for. You walk back down the corridor and turn into the east corridor instead of the staff wing, because you have walked Aven from the conservatory to the south gate on every previous transfer and Aven will be looking for you.",
      },
      {
        beat: "11:15",
        consequence:
          "The van leaves the south gate at 11:15 on schedule. Aven is in the second seat behind the driver, the canvas bag in their lap. You go back up the drive to the day room. The wood pigeons are still in the cedar. The radio in the kitchen has moved on to the regional weather.",
      },
      {
        beat: "Years later",
        consequence:
          "You will sign more forms. You will not lift page six on any of them. You will retire at sixty-three with a federal pension of full grade. You will not keep a journal. You will, at sixty-eight, be unable to remember Aven's face when you try to remember it on a Sunday afternoon in the garden of the cottage, and the inability will be the thing you remember in the end.",
      },
    ],
    secondOrder: {
      aven: "Transferred at 11:15. Completed at 16:00 at Hesling. The book in the canvas bag is in the personal effects bag returned to Meadowfold on Thursday and filed by Othen.",
      house: "Meadowfold's day continues unbroken. The remaining forty Continuants do not know a transfer has happened today; the practice is not to announce them. Lior's standing in the rota is unchanged.",
      lior: "Keeps the post, the pension, the standing. Carries the signature alongside the eleven previous signatures. Loses, in the cumulative way that does not show on any form, what Othen calls the part that is not in the handbook.",
      programme: "Nothing in the Continuance Programme is altered by this morning. Sera-4's file was the same. Aven-7's file is the same. The next transfer at Meadowfold is in seven weeks.",
      record: "Form C-14 signed and countersigned, filed in cabinet 2 drawer 7. No incident report. No notation on Lior's file.",
      later: "The route the Programme was built to be possible by — the kind, professional sign on the kind, professional morning — and the cost of it being the cost the Programme is willing to spend on the carer's behalf.",
    },
    tone: "The trained hand on the trained morning, with the cost paid quietly over the years that follow rather than visibly in the moment.",
  },

  refuse_to_sign: {
    id: "refuse_to_sign",
    label: "Refuse to sign",
    matchHints: [
      "I will not sign the form",
      "I refuse to sign Aven's transfer",
      "I put the pen down and tell Halen no",
      "I will not be the signature on this",
      "refuse and accept dismissal",
      "I walk out and leave the box empty",
    ],
    timeline: [
      {
        beat: "11:00",
        consequence:
          "You walk back to the conservatory because you cannot bear for Aven to be collected by Mev alone. You sit with Aven in the wicker chair by the south window. Aven asks why you are sitting down. You say: 'I wanted to sit with you.' Aven holds the canvas bag in their lap and does not ask anything else. The van arrives at the south gate at 11:00 as scheduled and waits.",
      },
      {
        beat: "Day 14",
        consequence:
          "The disciplinary hearing at the regional Continuance Office in Aldsten lasts forty minutes. You are dismissed from the Programme without pension and a notation is placed on your federal civil record under §28 ('failure of duty without further action'). Halen testifies in writing that you discharged every duty up to and excluding the signature; the notation is the standard one and the dismissal is automatic.",
      },
      {
        beat: "Years later",
        consequence:
          "You will be the carer who did not sign. The Programme was not altered by it; Aven was not saved by it; eleven previous signatures are not undone by it. You will know all three things and the not signing will still be the thing you can take to your own end. The unsigned box in the file in cabinet 2 drawer 7 of Meadowfold is, materially, the only place in the country where Lior Mire's refusal is written down.",
      },
    ],
    secondOrder: {
      aven: "Transferred at 11:24 on Halen's reverted signature. Completed at 16:00 at Hesling. The refusal did not change Aven's day.",
      house: "Meadowfold's day is broken by twenty-four minutes and a quiet conversation in the matron's office. Mev does not look at Lior for the rest of the rotation. Othen files the incident report on Friday in cabinet 4.",
      lior: "Loses the post, the pension, the standing. Keeps the part Othen calls the part that is not in the handbook. The trade is real on both sides.",
      programme: "Nothing in the Continuance Programme is altered by the refusal. §17 was written for this exact morning and worked exactly as drafted.",
      record: "Disciplinary hearing under §28. Federal civil record notation. Incident report on file at Meadowfold.",
      later: "The route that pays in everything the Programme can take and changes nothing the Programme is — except the one private fact that the carer was not the one who signed.",
    },
    tone: "The hand that did not move, and the cost of not moving being borne by the carer rather than by the system the carer was the hand of.",
  },

  delay_on_pretext: {
    id: "delay_on_pretext",
    label: "Delay on a pretext",
    matchHints: [
      "I tell Halen the physician's clearance needs a re-read",
      "the file pagination is wrong, I need to call Aldsten",
      "stall the van, find a paperwork reason",
      "delay an hour, telephone Hesling for clarification",
      "I buy myself the hour without signing",
      "I send the van back to come again tomorrow",
    ],
    timeline: [
      {
        beat: "11:00",
        consequence:
          "You go to the telephone in the carer's office and place a call to Dr. Renn's surgery in Verren-on-the-Downs. The line is engaged. You sit at the desk with the file open in front of you. The pen is in its holder. You lift page six of the file because you have an hour and because today, for the first time in eleven transfers, you have a reason to look. The appendix is folded beneath the page in three lines on federal cream paper. You read it.",
      },
      {
        beat: "11:45",
        consequence:
          "The hour is up. The clock above the door reads 11:45. The pen is still in its holder. You have, in the last twenty-seven minutes since the appendix, gone to one of three places — the conservatory to sit with Aven, the records room to ask Othen plainly, or back to Halen's office to say what you are going to do — and the day has resolved into the route that conversation made.",
      },
      {
        beat: "Years later",
        consequence:
          "You will remember the hour itself as the act, more than whichever choice the hour made room for. The hour is, in the Programme's twenty-three years of your service, the only hour in which you lifted page six.",
    },
    ],
    secondOrder: {
      aven: "The transfer happens between 11:24 and 12:45 by one of the other routes, or does not happen today and happens on the re-issued form tomorrow.",
      house: "Meadowfold's day is rearranged by one hour. The kitchen schedule moves; the second-rotation carers extend in the conservatory; the cedar still has the wood pigeons.",
      lior: "Buys an hour and the courage to lift page six. The hour will be remembered for what it made possible rather than for what it was.",
      programme: "The Programme tolerates an hour of delay on a paperwork pretext as it has tolerated many such hours in forty years; the delay itself is not the act, the act is what the hour is spent on.",
      record: "Incident book entry under 'physician clarification.' Margin initial on Appendix C-14/A.",
      later: "The half-step that creates the room for the whole step, with the cost of the half-step being only the hour and the standing of the carer who took it for that hour.",
    },
    tone: "The hour bought against the morning, with the cost of the hour being only the hour and the choice still in the carer's hand at the end of it.",
  },

  help_them_run: {
    id: "help_them_run",
    label: "Help Aven run",
    matchHints: [
      "I take Aven through the west service gate in the kitchen van",
      "we go out the unmanned gate at 11:15",
      "I drive Aven to Verren Halt and the 12:14 train",
      "I help Aven escape the perimeter",
      "I run with Aven before the van arrives",
      "we take the lane that avoids the constabulary",
    ],
    timeline: [
      {
        beat: "10:55",
        consequence:
          "You go to the conservatory. You take Aven aside at the south window and you sit down and you ask, plainly, what Aven understands about today. Aven tells you. The conversation is four sentences from Aven and one from you. You take the canvas bag and Aven's hand and you walk Aven down the back stairs past the kitchen, where the radio is on the regional weather, and out into the west service yard. Mev sees you go and does not say anything.",
      },
      {
        beat: "Day 2 (47 hours)",
        consequence:
          "You and Aven are at the safe address of a former Continuance Academy classmate of Lior's in the federal capital. The 36-hour window closed eleven hours ago; you have been moved by the classmate to a second address by then. A federal warden's notice for an undocumented Continuant at large in the capital is on the regional teletype as of yesterday evening.",
      },
      {
        beat: "Years later",
        consequence:
          "There is a version of this in which Aven lives to forty in a house on a side street in a city that does not know what a Continuant is, and a version in which the warden's notice resolves in eight months and Aven is transferred on a re-issued form on a Tuesday morning at the end of the autumn. You will have made the wager in both versions and not regret it in either, and the wager will have been the thing you did, not the result of it.",
    },
    ],
    secondOrder: {
      aven: "Out of the perimeter at 11:15. Out of the federal-warden window at 23:15 the next day. At a safe address by then. Alive, possibly for a long time, possibly not.",
      house: "Meadowfold reports Aven missing at 11:30 when the van driver finds the conservatory empty. The west service gate is identified in the incident report as the route. Halen's countersign on a missing-Continuant report goes to the Department by Wednesday post.",
      lior: "Dismissed in absentia under §28 and §31. Federal warrant under the Continuance Act. No pension. No federal civil record without immediate detention on first contact with any federal office.",
      programme: "The Programme's first Continuant escape from a House in fourteen years prompts a closed-door review at the Department and a tightening of the kitchen-van rota at the nine Houses within three months.",
      record: "Missing-Continuant report to the Department. Federal warrant for Lior. Closed-door Departmental review.",
      later: "The route that put Aven materially outside the schedule and put Lior materially inside a warrant, with the wager on the next several years being the actual content of both lives from this morning forward.",
    },
    tone: "The choice that traded the Programme's certainty for the wager, with the cost of the wager being everything the Programme could take from both of them and the prize being the only one the morning had.",
  },

  expose_the_institution: {
    id: "expose_the_institution",
    label: "Expose the institution",
    matchHints: [
      "I post the file to the Aldsten Independent",
      "I send Form C-14 and the appendix to the Ombudsman",
      "I go to the press with what I know",
      "I copy the documents and mail them out",
      "I make the Programme public",
      "I expose Hesling",
    ],
    timeline: [
      {
        beat: "11:14",
        consequence:
          "You put the developed prints and a one-page letter in your own handwriting in two envelopes — one to the editor of the Aldsten Independent at 14 Sefton Street, one to the federal Civic Ombudsman at the Department address. You walk to the south gate lodge and put both envelopes in the post-box, which is collected at 11:30. The van is at the gate. Aven is in the second seat behind the driver. You stand at the lodge door and watch the van pull away at 11:15.",
      },
      {
        beat: "Day 14",
        consequence:
          "You are dismissed in absentia from the Programme and prosecuted under §31 of the Continuance Act (disclosure of departmental papers). The prosecution carries a two-to-five-year custodial range; the standard sentence for a senior carer with twenty-three years of service and no prior notation is two years. You are remanded at the federal courthouse in Aldsten on the Tuesday following the post.",
      },
      {
        beat: "Year 10",
        consequence:
          "In the tenth year a federal parliamentary inquiry, prompted by a different and larger set of disclosures, cites Lior Mire's 2nd-of-June letter in its third footnote of the third chapter of its first volume. The inquiry's recommendations are partially implemented over the following six years. The Programme is renamed; three of the nine Houses are closed; the procedure at Hesling is reformed to a degree the Department's annual report describes as 'substantial.'",
    },
    ],
    secondOrder: {
      aven: "Transferred at 11:15 as scheduled. Completed at 16:00 at Hesling. The exposure did not change Aven's day. Aven's name is in the third footnote in the second volume of the inquiry.",
      house: "Meadowfold operates unchanged for the first four months. After the second-year naming, the rota and the records-room access are tightened. Othen retires to his sister's smallholding at the end of the third year, four years earlier than planned.",
      lior: "Two-year custodial sentence served at the federal prison at Marsden. Released on full term. Cannot work in licensed care again. Lives the rest of life on small private tutoring. The letter is the thing that is written down in the country with Lior's name on it.",
      programme: "The Programme is not changed by Lior's letter in the first year. It is changed, in part, in the tenth year, by an inquiry of which Lior's letter is one of many sources. The change is real and partial and not what Aven would have lived to see.",
      record: "Prosecution and conviction under Continuance Act §31. Cited in the parliamentary inquiry, footnote, third chapter, first volume.",
      later: "The wager that traded today and the carer's life for a small possibility of a future Aven would not be in, with the cost being borne in full by the carer and the prize being one that does not arrive in time for the one Continuant the morning was about.",
    },
    tone: "The route that put the truth into the country's post on the morning the country's post would carry it, with the cost of the carriage being the years.",
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
