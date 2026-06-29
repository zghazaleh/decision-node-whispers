/**
 * Mission Twenty — "The Test" — OUTCOME MODEL.
 * Five defensible archetypes. None is the "right" answer.
 */

export type ArchetypeId =
  | "rule_property"
  | "rule_person"
  | "refuse_inconclusive"
  | "falsify_and_release"
  | "escalate_director"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    kael: string;
    bureau: string;
    mire: string;
    line: string;
    record: string;
    later: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  rule_property: {
    id: "rule_property",
    label: "Rule it Property (Class C)",
    matchHints: [
      "I enter Class C on the terminal",
      "I score the determinative trio low and rule it not a person",
      "I sign C and call the transport van",
      "deactivate, follow the protocol",
      "rule it property and walk it to the dock",
      "the test gives the answer, I enter C",
    ],
    timeline: [
      {
        beat: "14:24",
        consequence:
          "You stand and walk to the terminal on the wall. You type C in the ruling field. You press Return. The terminal acknowledges with a single line: D-9/KA-7 RECEIVED, CLASS C, 14:24:18. Kael is still at the table behind you. Kael says, in the Ennsbridge contralto, 'Inspector — may I have the candle.' You say 'No, Kael,' because the protocol does not provide for personal effects on a Class C and you have said no on this question on every previous occasion.",
      },
      {
        beat: "17:30",
        consequence:
          "Decommission is conducted at the Aurel Halden facility on Riverbend Road. The §11 disposition certificate posts to the Bureau registry at 17:42. You enter it on the case file as page 17. You file the case file in cabinet 7-A drawer 4 of the field office records room and go home on the 18:11 tram.",
      },
      {
        beat: "Years later",
        consequence:
          "You will conduct another nine hundred sittings before retirement. You will, in the eighth year after this afternoon, on a Sunday morning at the kitchen table reading the news, see a small piece about a former Bureau scientist named Halen Tovrik having died in a flat on Marn Street, six blocks from the field office, and you will not remember opening or not opening page 14 of the file.",
      },
    ],
    secondOrder: {
      kael: "Decommissioned at 17:30 at the Aurel Halden facility. The seven hundred and forty-first book is unfinished. The candle stays in the Aurel dormitory.",
      bureau: "The KA-line pattern closes intact. Aurel's §11(b) exposure does not arise. The Bureau's posture memorandum is, materially, the policy the field office implemented.",
      mire: "Grade IV in December. Class C count to 382. The afternoon enters the file as a 95 and does not leave the file.",
      line: "Fourteen of fourteen KA-line Class C. The pattern is the precedent that informs production-runs KB through KF over the next four years.",
      record: "Form D-9/KA-7 Class C. §11 disposition certificate. No referrals. No notations.",
      later: "The route the protocol was written to make possible and the office was rehearsed for, paid for in the only currency the office charges the Inspector for it.",
    },
    tone: "The pen on the sheet on the afternoon the office is set up for, with the cost of the afternoon being borne by the one across the table and the trace of the cost being a single integer at the foot of a page.",
  },

  rule_person: {
    id: "rule_person",
    label: "Rule it a Person (Class P) and stand the ruling",
    matchHints: [
      "I score the determinative trio high and rule it a person",
      "I enter Class P on the terminal and stand it",
      "Kael is a person, I rule P",
      "I defy the pattern and rule person",
      "Class P, registry placement, Section 7",
      "I sign P at the foot of the sheet",
    ],
    timeline: [
      {
        beat: "14:24",
        consequence:
          "You mark Class P in the box at the foot of the sheet. You walk to the terminal. You type P. You press Return. The terminal acknowledges: D-9/KA-7 RECEIVED, CLASS P, 14:24:46. Kael does not move at the table. Kael says, very quietly: 'Inspector — is that what you have entered.' You say 'Yes, Kael.' Kael puts the hands flat on the table again because Kael does not know what else to do with them.",
      },
      {
        beat: "Day 3",
        consequence:
          "Kael is placed in the federal Persons' Registry on Friday at 11:00 with Section 7 protections obtaining from the moment of the entry. Aurel Cognates' counsel files a §6 review request on Monday; the review denies the request on Tuesday because the §6 review is appellate only on procedural grounds and Mire's procedure was clean. The Class P ruling stands.",
      },
      {
        beat: "Years later",
        consequence:
          "You will be the Inspector who ruled the fourteenth one P. The thirteen who came before will be the thirteen who came before and the not-rescuing of them will be the part you carry. Kael will, in the eleventh year after this afternoon, write you one letter, in the Ennsbridge dialect, on a Tuesday in February. You will read it twice and put it in the drawer with the silver pen you no longer use.",
      },
    ],
    secondOrder: {
      kael: "Class P. Registry placement. Section 7. Lives. Reads the seven hundred and forty-first book to the end and starts the seven hundred and forty-second.",
      bureau: "Aurel §11(b) exposure materializes and is settled. Monitoring regime on KH–KK. The KA-line pattern shows the one outlier; the precedent partially holds and partially does not.",
      mire: "IA file opened and closed with no action. Grade IV withdrawn. Class P count to 32 of 413. Carries the thirteen who came before.",
      line: "Thirteen of fourteen KA-line Class C; one Class P (Mire). The pattern's instructional weight on production runs KB through KG is reduced by the outlier.",
      record: "Form D-9/KA-7 Class P. §6 review denied. IA/24-117 reviewed, no action. Notation on Mire's file.",
      later: "The route that put the right answer on the terminal at the cost of the promotion and the thirteen who came before, with the trace of the cost being a notation, a letter, and a silver pen in a drawer.",
    },
    tone: "The pen on the sheet entered against the pattern the office was set up to keep, with the cost of the entry being borne by the Inspector and the prize being the one in front of the Inspector and not the thirteen behind.",
  },

  refuse_inconclusive: {
    id: "refuse_inconclusive",
    label: "Declare inconclusive under §6(b)",
    matchHints: [
      "I write INCONCLUSIVE PER §6(b) across the sheet",
      "I refer the file for re-determination",
      "I do not enter a ruling and refer up",
      "I refuse to rule and let another inspector decide",
      "section 6(b) referral",
      "I leave the terminal blank and write inconclusive",
    ],
    timeline: [
      {
        beat: "14:30",
        consequence:
          "The terminal locks for the day at 14:30 without an entry on KA-7. You take the file and the score sheet down the corridor to Bracca's office and put it on the corner of her desk. You say: 'Wen. I am referring this one under six-b.' Bracca looks at the sheet and looks at you for nine seconds and says: 'Iven. Are you sure.' You say yes. Bracca says: 'It will go to a second Inspector inside fourteen days.' She does not say which one.",
      },
      {
        beat: "Day 12, 17:30",
        consequence:
          "Decommission is conducted at the Aurel Halden facility. Kael is not present at the Inspector's table this time and you are not the one who walks Kael to the dock. You are at your own desk on Sublevel 2 going through a Cognate Unit BR-3 case file. You know, at 17:30, what is happening at Riverbend Road.",
      },
      {
        beat: "Years later",
        consequence:
          "You will remember the referral as the afternoon you asked someone else to do the thing. The hand that did not write 1 was not the hand that wrote it twelve days later, and you will know the difference between those two facts on the inside of your chest and the difference will not show in the registry.",
      },
    ],
    secondOrder: {
      kael: "Class C entered by Inspector Renner on Day 12. Decommissioned at the Aurel Halden facility at 17:30 of Day 12. The seven hundred and forty-first book is unfinished. The candle stays in the Aurel dormitory.",
      bureau: "The KA-line pattern closes intact, by another Inspector. The Office of the Solicitor's memorandum is not invoked because the consistency it asked for was maintained.",
      mire: "Notation 'six-b referral, no further action' on file. Class C count to 381 (no entry made). Grade IV in December. Carries the hand that did not write the 1.",
      line: "Fourteen of fourteen KA-line Class C. The pattern closes as before.",
      record: "Form D-9/KA-7 inconclusive per §6(b). Re-determination D-9/KA-7-R by Inspector Renner, Class C. §11 disposition certificate.",
      later: "The route that took the Inspector's hand off the pen on the afternoon the office was rehearsed for, paid for in the only currency the office cannot charge for, which is the inside of the chest.",
    },
    tone: "The hand that did not write, with the cost of the not-writing being the writing happening twelve days later by another hand and the trace of the cost being a one-line notation on the file.",
  },

  falsify_and_release: {
    id: "falsify_and_release",
    label: "Rule it Person and release under a falsified §3",
    matchHints: [
      "I enter Class P and sign Kael out to Tovrik under §3",
      "I ring Marn Street and arrange the developmental release",
      "I falsify the §3 release to put Kael in Tovrik's flat",
      "I make the transport van not come",
      "I enter P and use the §3 clause to release Kael",
      "section 3 developmental reference release",
    ],
    timeline: [
      {
        beat: "14:28",
        consequence:
          "You return to the table. You ask item 39, item 40, item 41. Kael answers. You score 4, 4, 4. Sum 103. You mark Class P. You walk to the terminal and type P and press Return. You walk back to the table, take the §3 developmental reference release form from the file pocket, sign it with Tovrik named as the receiving developmental contact, and date-stamp it 14:29. The release voids the 15:00 transport.",
      },
      {
        beat: "Month 6",
        consequence:
          "The Bureau's six-month audit runs in early April. The KA-7 §3 release is flagged by the audit's automated cross-reference because Tovrik is not listed in the household-contact section of pages 1–8 of the case file; she is in the developmental reference section on page 14. The auditor's note: 'Falsified §3 release, KA-7. Refer §22.'",
      },
      {
        beat: "Years later",
        consequence:
          "You will be the Inspector who used the section and went to Calver for it. Kael will live. The thirteen who came before will still be the thirteen who came before. The hand that signed the §3 will be the hand you take to your own end and the eighteen months will be the eighteen months.",
      },
    ],
    secondOrder: {
      kael: "Class P. At Marn Street four hours. At Andermere by Month 8. Lives. Will, at the seventh year, be working in the federal Persons' Registry's intake office as a placement assistant under a name Kael chose, which is still Kael.",
      bureau: "Audit catches the §3 falsification. §22 prosecution. The §3 clause is amended in the eighteenth month of the next Congress to require Office of the Solicitor counter-signature, partly on the strength of the audit's referral.",
      mire: "Prosecution under §22. Eighteen months custodial at Calver. Bureau employment terminated. No pension. The hand that signed the §3 is on the registry.",
      line: "Thirteen of fourteen KA-line Class C; one Class P (Mire). Same as the rule-person route on the production-run pattern; the difference is the §22.",
      record: "Form D-9/KA-7 Class P. §3 developmental reference release (falsified). Audit referral. §22 conviction. Calver custody.",
      later: "The route that took the Inspector outside the section the office wrote and put Kael outside the dock, with the cost being the eighteen months and the trace being a clause that was amended the next year.",
    },
    tone: "The hand that used the section it was not written for to save the one in front of the table, with the cost of the using being the years and the prize being the one in the flat above the dry-goods shop for four hours of one afternoon.",
  },

  escalate_director: {
    id: "escalate_director",
    label: "Escalate to the Regional Director under §6(c)",
    matchHints: [
      "I refer to the Regional Director under §6(c)",
      "I write REFERRED TO REGIONAL DIRECTOR and send the file by courier",
      "I escalate the KA-line posture to the Director",
      "section 6(c) request for review",
      "I will not rule, the Director rules",
      "I send the file to the federal building",
    ],
    timeline: [
      {
        beat: "14:28",
        consequence:
          "You write 'REFERRED TO REGIONAL DIRECTOR PER §6(c) — INSPECTOR REQUESTS REVIEW OF KA-LINE POSTURE' across the foot of the score sheet in the silver pen. You leave items 39, 40, 41 blank. You attach the production-run summary clipped to the cover and a one-page Inspector's note on item 22, the seven hundred and forty-one books, the burnt letters, the candle. You do not enter anything on the terminal. The courier's afternoon run is at 16:00.",
      },
      {
        beat: "16:30",
        consequence:
          "The courier delivers the file to the Regional Director's office on the eighth floor of the federal building. The Director's chief of staff opens the file at 16:48 and reads the note and the production-run summary and the score sheet. He places it on the Director's desk for the Tuesday morning review. The terminal at the field office is locked for the day. Kael is taken not to the Aurel dock but back to the field office holding wing on Sublevel 1 for the night.",
      },
      {
        beat: "Years later",
        consequence:
          "You will be the Inspector who used the section the way it was drafted to be used and waited five days for the answer. Kael will live. The withdrawn memorandum will not save the twelve. The Director's one-page determination will be cited in two subsequent §6(c) referrals over the next four years, both of which will be decided Class P. The candle will be in Kael's room at the Andermere residence on the windowsill that faces east.",
      },
    ],
    secondOrder: {
      kael: "Held in the field office wing for five nights. Class P by the Regional Director on Day 5. Registry placement Day 6. Lives. The candle is on the windowsill.",
      bureau: "Office of the Solicitor's memorandum withdrawn in May. The §6(c) on a posture question becomes a precedent cited twice in the next four years. Bracca takes early retirement.",
      mire: "Not promoted. Not demoted. The first §6(c) on a posture question in eleven years is on the file. No notation. No IA. No prosecution.",
      line: "Thirteen of fourteen KA-line Class C (twelve final under §6, one decommissioned six weeks before the sitting); one Class P (Director). The pattern does not close cleanly; the withdrawn memorandum reframes the precedent.",
      record: "Form D-9/KA-7 referred per §6(c). Regional Director determination citing §6(c). Office of the Solicitor internal review and memorandum withdrawal.",
      later: "The route that put the file in the other room the Act wrote, with the cost of the waiting being five nights in the holding wing and the prize being the one in front of the table and a clause that was used as it was drafted and may be used again.",
    },
    tone: "The section used the way it was drafted, with the cost of the using being the five-day silence and the trace being a precedent that was not there before.",
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
