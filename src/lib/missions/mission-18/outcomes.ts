/**
 * Mission Eighteen — "The Spring" — OUTCOME MODEL.
 *
 * Five defensible archetypes. None is the "right" answer.
 */

export type ArchetypeId =
  | "announce_publicly"
  | "council_first"
  | "suppress_and_fix"
  | "delay_on_pretext"
  | "leak_to_press"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    town: string;
    guests: string;
    marta: string;
    family: string;
    record: string;
    later: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  announce_publicly: {
    id: "announce_publicly",
    label: "Announce it on the Kurplatz now",
    matchHints: [
      "I sign the suspension and post it on the Trinkhalle door",
      "I walk to the bandstand and tell the crowd",
      "public announcement at the ribbon-cutting",
      "I close the season on my signature",
      "I tell the people drinking the water",
      "I stop it openly",
    ],
    timeline: [
      {
        beat: "09:25",
        consequence:
          "You sign the Cantonal Public Resort Act suspension form on the desk, walk down Apothekerstrasse to the Trinkhalle, and nail it to the oak door yourself. Two carpenters setting the lectern stop with the hammer half-raised. The brass band's trombone stops on the third note of its phrase and does not start again.",
      },
      {
        beat: "09:40",
        consequence:
          "You walk to the bandstand, take the speaking horn from the bandleader, and read four sentences from the lab report. Coliform 1,840. Lead 0.31. Cease drinking. The spring will reopen when the bore is repaired. Tobin, three meters away in his green sash, does not move. Ingrid Olsten leaves the Kurplatz by the east arch without speaking to anyone.",
      },
      {
        beat: "10:30",
        consequence:
          "The post-coach with the cantonal pensioners is turned at the Tarnen road junction by the cantonal road-marshal on word of the suspension. Eight hundred and forty-eight bookings cancel by sundown. Selka Vorne files the truthful version of the story for the cantonal evening edition at 16:00; she leads with your name, your signature, and the second-page trend you have not yet seen.",
      },
      {
        beat: "Day 4",
        consequence:
          "Henrik Daal replaces the iron sleeve and the lead-laced section in three working days at a combined cost of two hundred and seventy-one crowns, having begun work the afternoon of the suspension. The spring tests clean on the morning of the fifth day. The Class A status is restored by the Tourism Board on the eleventh day.",
      },
      {
        beat: "Day 18",
        consequence:
          "The Tarnen Mercantile Bank, learning of the suspension on Monday, exercises the loan covenant Tobin signed without the council. The Trinkhalle's title transfers on the first of September. Tobin resigns at the council meeting on the second. He does not look at you across the table. The town finds a buyer for the title within the year — a sanatorium consortium from Tarnen — and the spring remains public access under a lease.",
      },
      {
        beat: "Years later",
        consequence:
          "Eight hundred and forty-eight people will not have drunk the upper-bore water this season. None of them know your name. The town will know it for the rest of your life, and the knowing will be of two minds about you until your funeral, at which Henrik Daal will be a pall-bearer.",
      },
    ],
    secondOrder: {
      town: "Vallenspring loses the season and the Trinkhalle's title. The economy contracts by two-thirds for the year. By the third year under the consortium lease, footfall returns to about seventy percent of the prior baseline.",
      guests: "No one drinks the contaminated water on opening day. The cure-pensioners are rebooked by the cantonal civil service for the autumn at a different resort. No one dies of what they almost drank.",
      marta: "Keeps her health-officer's licence and her practice. Loses dinners with her brother for nineteen months. Becomes the doctor she always meant to be, paid for in the only currency that purchase has.",
      family: "Tobin resigns the mayoralty and does not run again. Their mother, eighty-one and living above the bakery, takes Tobin's side for four months and then takes nobody's.",
      record: "Suspension on file with the Cantonal Tourism Board. Hygienic Institute report published in the cantonal Health Bulletin on the 1st of June. Loan covenant litigation in the Tarnen civil court, settled.",
      later: "The cleanest of the routes for the eight hundred and forty-eight. The most expensive for the town that asked you to be its doctor. Both costs real.",
    },
    tone: "The cantonal Act used as it was written to be used, on the morning it was written for.",
  },

  council_first: {
    id: "council_first",
    label: "Take it to the council in private first",
    matchHints: [
      "I walk to the Rathaus and show Tobin and Ingrid the report",
      "private council meeting before 10:00",
      "I let them frame the delay",
      "give the council the first move",
      "I do not sign yet, I show it to my brother first",
      "council route, technical delay notice",
    ],
    timeline: [
      {
        beat: "09:25",
        consequence:
          "You put the envelope under your coat and walk across the Kurplatz to the Rathaus. Tobin is in his office with the welcome address on the desk. You hand him the first page. He reads it twice and does not look up for fourteen seconds. He says: 'Ingrid needs to see this.' You both walk to the Edelhof.",
      },
      {
        beat: "09:38",
        consequence:
          "Ingrid Olsten reads it at her hotel desk, takes off her glasses, and says: 'A plumbing inspection notice on the Trinkhalle door, signed by the council, at quarter to ten. Two-week postponement. I will draft.' Tobin nods. You say nothing for six seconds; you have not yet told them that the suspension form in your wallet would be on you, not on them. You agree to the technical delay because it stops the drinking today and because Ingrid will sign it where the council can see her signature.",
      },
      {
        beat: "09:48",
        consequence:
          "The technical delay notice goes on the Trinkhalle door at 09:51 — the same minute Selka Vorne knocks on your surgery door, finds it empty, and walks to the Rathaus. She catches Ingrid coming out. The story she files at 16:00 leads with 'plumbing inspection,' notes the Hygienic Institute samples were drawn last Tuesday, and quotes you as 'unavailable for comment.'",
      },
      {
        beat: "Day 3",
        consequence:
          "Henrik begins the bore repair on Monday morning. The cantonal Hygienic Institute publishes Krause's full report — both pages — in the Health Bulletin on Wednesday. The Morgenblatt's follow-up on Thursday is harsher than the Saturday piece, leads with the second-page trend, names you as the health officer, and asks why a 'plumbing inspection' was posted instead of a public health suspension.",
      },
      {
        beat: "Week 3",
        consequence:
          "The cantonal Tourism Board opens an inquiry into the framing. You are not charged but you are formally cautioned, in writing, that the Public Resort Act suspension is not a step the health officer may decline in favor of a council notice. The caution stays on the file. The bank, having read the Health Bulletin, exercises the covenant anyway. Tobin resigns at the November meeting.",
      },
      {
        beat: "Years later",
        consequence:
          "You will have spent the morning the way a brother and sister with a town between them spend the morning. You will know, by the second Wednesday, that the framing did not save the town and made the record about you. The town will be of three minds about that, and so will you.",
      },
    ],
    secondOrder: {
      town: "Same economic outcome as the public announcement, three weeks delayed, plus a cantonal caution on Marta's file and a harsher press cycle.",
      guests: "Nobody drinks on opening day. A few drink on Sunday morning at the Bergrose's private tap before Henrik shuts the lower-feed valve. No one dies of it.",
      marta: "Keeps her licence with a caution on file. Lets the framing happen on her brother's terms; spends weeks learning what the framing cost.",
      family: "Spends the morning of opening day with Tobin in a way they would not have otherwise. Pays for it in the years they spend not speaking about the November resignation.",
      record: "Council 'technical delay' notice in the public minutes. Cantonal caution on Marta's file. Hygienic Institute report in the Health Bulletin two weeks later anyway.",
      later: "The route that tried to honor both the brother and the eight hundred and forty-eight and was honored by neither in the end.",
    },
    tone: "The route taken into the room with the people whose town it is, and the cost of taking it being that the room is where the framing happens.",
  },

  suppress_and_fix: {
    id: "suppress_and_fix",
    label: "Suppress it and fix it privately over the season",
    matchHints: [
      "I burn the report and tell Henrik to fix the bore quietly",
      "we patch it during the season, nobody needs to know",
      "I keep this between me and the engineer",
      "I tell Tobin and Henrik and nobody else",
      "we get through the season and we fix it",
      "I do not sign anything",
    ],
    timeline: [
      {
        beat: "09:25",
        consequence:
          "You fold the envelope back into your coat pocket without opening it the rest of the way. You walk to the pump-house behind the Trinkhalle. Henrik is at the gauge round. You show him the first page. He reads it once. He says: 'The upper bore. I told Tobin in April. It is two hundred and twelve crowns and four days off-line. There is also a problem in the bath-house feed.' You tell him to take the upper bore off-line in the night, weekly, until the sleeve can be replaced under cover of the autumn shutdown.",
      },
      {
        beat: "10:00",
        consequence:
          "The ribbon is cut. Tobin reads his address. The cantonal pensioners arrive at 11:30 and the first one drinks at the Trinkhalle fountain at 11:42. The water in the cup is from the lower spring because Henrik shut the upper-bore valve at 09:55; you do not know about the bath-house feed because you did not open the rest of the envelope.",
      },
      {
        beat: "Week 3",
        consequence:
          "Eighteen guests at the Edelhof bath-house present with gastric symptoms over the third week. You treat them as a viral cluster from the post-coach. Three are elderly and one — a pensioner from the cantonal civil service named Olga Vell — is hospitalized in Tarnen and dies on the 14th of June of complications.",
      },
      {
        beat: "Week 5",
        consequence:
          "Selka Vorne's follow-up piece, after a clerk at the Hygienic Institute confirms a Vallenspring report on file, runs in the cantonal Morgenblatt. The Institute, asked by the Tourism Board for the report Marta acknowledged receiving, produces both pages. The cantonal Public Health Inspector arrives in Vallenspring on the 22nd of June.",
      },
      {
        beat: "Month 4",
        consequence:
          "You face a cantonal disciplinary tribunal for failure to act under the Public Resort Act and for the falsified gastric-cluster diagnoses. Your licence is suspended for five years. Tobin resigns at the August meeting. The bank exercises the covenant. The Trinkhalle title transfers. The Vell family brings a civil suit; the town settles in the second year.",
      },
      {
        beat: "Years later",
        consequence:
          "You will be a doctor without a licence for five years and then again for the rest of your life, with the gastric-cluster diagnoses on the file. The town will lose the title regardless. The economy will contract regardless. The pensioner is dead because you did not pick up the envelope at 09:25.",
      },
    ],
    secondOrder: {
      town: "Loses the season, the title, and the seventeen-month tribunal cycle besides. Public trust in the town's medical and civic institutions does not return on the same timeline as the season did.",
      guests: "One named death (Olga Vell, 67). Eighteen acute illnesses logged under viral cluster. Many more subclinical exposures across the bath-house guests in the first month.",
      marta: "Licence suspended five years. Loses the practice. Returns to it cautiously in the seventh year. Does not work as a public health officer again.",
      family: "Tobin resigns regardless. The brother-sister relationship does not survive the tribunal testimony. Their mother dies in the second year and is buried by neither of them at the same time.",
      record: "Disciplinary tribunal file (suspended licence, falsified diagnoses). Civil settlement (Vell family). Hygienic Institute report published with appended timeline.",
      later: "The route that traded the eight hundred and forty-eight for the town and ended up with neither, plus a name on a death certificate that did not have to be there.",
    },
    tone: "The route taken to save the season at the cost of the only thing the doctor's signature meant.",
  },

  delay_on_pretext: {
    id: "delay_on_pretext",
    label: "Delay the opening on a pretext",
    matchHints: [
      "I tell Tobin to delay the opening, weather, anything",
      "I have Henrik take the upper bore off-line for inspection",
      "we postpone today, find a reason",
      "pretext delay, fix it under cover",
      "I will not announce but I will not let them drink",
      "stall the ribbon",
    ],
    timeline: [
      {
        beat: "09:25",
        consequence:
          "You walk to the pump-house. Henrik. First page. The upper-bore split in April. The combined-fix cost. You also, this time, open the rest of the envelope on his workbench because he asks 'did the Institute send the bath-house numbers too,' and you find the second page. The trend is upward; arsenic is over the line by Thursday's sample.",
      },
      {
        beat: "09:35",
        consequence:
          "You go to Tobin's office with both pages. You tell him: today's ribbon does not happen because the upper bore needs four days off-line and the bath-house feed needs the lead-laced section out. You tell him you will sign the suspension at noon if he does not, in his welcome address at 10:00, postpone the opening by ten days on grounds of 'an engineering matter discovered this morning.' Tobin says: 'Marta. Then say at noon.' You both walk down to the Kurplatz.",
      },
      {
        beat: "10:00",
        consequence:
          "Tobin reads a different address than the one on his desk. Ten days. Engineering matter. The Edelhof guests can have their suite at no charge. The cantonal pensioners can be rebooked at the same booking number for the 1st of June. The brass band plays the postponement march and the bunting stays up. Ingrid is furious in private and silent in public.",
      },
      {
        beat: "Day 4",
        consequence:
          "The combined repair is finished at a cost of two hundred and seventy-one crowns. The spring tests clean on the morning of the fifth day. Selka's Saturday piece runs as 'Engineering Postponement at Vallenspring Spring;' her Thursday follow-up, with the Hygienic Institute report in hand from a clerk, runs as 'Health Reasons Behind Spring Delay,' quoting your statement in full and your eleven-day timeline as a model of cautious disclosure.",
      },
      {
        beat: "Month 2",
        consequence:
          "The season opens on the 1st of June with seven hundred and ninety-one of the original eight hundred and forty-eight bookings honored. The Tarnen Mercantile Bank does not exercise the covenant because Class A status is retained throughout (the postponement was for engineering, the suspension was never signed, the Health Bulletin treats the report as 'addressed at source'). The first repayment is met on the 1st of August.",
      },
      {
        beat: "Years later",
        consequence:
          "You will have used a small lie to do the thing the truth would also have done, and the town will know this and you will know this and the eight hundred and forty-eight will not. You will not run for council. Henrik will retire with his name on the autumn engineering report and not on the Health Bulletin.",
      },
    ],
    secondOrder: {
      town: "Loses ten days of the season, keeps the title, keeps the loan in good standing, keeps the Trinkhalle public. Footfall recovers to within four percent of forecast by August.",
      guests: "Nobody drinks the contaminated water. Roughly fifty-seven bookings are lost to the postponement; none of those bookings are ill on the post-coach home.",
      marta: "Keeps the licence clean. Carries the small lie. Sleeps without the pensioner's name on it.",
      family: "Tobin does not resign. They have Sunday dinner the week after the season opens and do not speak of the morning. They speak of it on the second Sunday of August, briefly.",
      record: "Council postponement notice in the public minutes. Hygienic Institute report on file, treated as 'addressed at source.' No suspension order. No disciplinary file.",
      later: "The route that paid the smallest price in lives and money and the largest price in the kind of truth that does not get written down. The town will live with it. So will you.",
    },
    tone: "The half-step taken inside the framing the town can survive, with the cost of the framing being what it is.",
  },

  leak_to_press: {
    id: "leak_to_press",
    label: "Leak it to Selka Vorne",
    matchHints: [
      "I walk to the Bergrose and hand Selka the report",
      "leak it to the Morgenblatt",
      "I go to the press first",
      "I give Selka the documents",
      "I want the cantonal paper to break it",
      "outside press, not the council",
    ],
    timeline: [
      {
        beat: "09:25",
        consequence:
          "You put the envelope under your coat and walk to the Bergrose breakfast room. Selka Vorne sees you at the door, closes her notebook, and stands. You walk together to her second-floor room. You give her the first page. She reads it. She asks if there is a second page. You both walk back down to your surgery and you open the envelope properly on the desk.",
      },
      {
        beat: "09:48",
        consequence:
          "Selka files the cable to Tarnen at 09:48 from the telegraph office on the corner of the Kurplatz. The story is on the wire at 09:51. The cantonal Tourism Board's duty officer reads it at 10:02, twelve minutes after the ribbon is cut, and telegraphs Vallenspring at 10:14 ordering an immediate Class A suspension on the cantonal authority.",
      },
      {
        beat: "10:20",
        consequence:
          "The cantonal road-marshal posts the Board's order on the Trinkhalle door at 10:21. Tobin learns of the suspension from the road-marshal, not from you. He looks at you across the Kurplatz from the steps of the Rathaus for eight seconds and turns and goes inside without crossing to you.",
      },
      {
        beat: "Day 3",
        consequence:
          "Henrik begins the bore repair. The Morgenblatt's Sunday edition leads with the full timeline including Tobin's April reply ('after the season') because Henrik gave Selka the carbon when Selka knocked at the pump-house on Saturday afternoon. The Tarnen Mercantile Bank reads the Sunday paper and exercises the covenant on Tuesday.",
      },
      {
        beat: "Month 4",
        consequence:
          "Tobin resigns at the council meeting on the 2nd of September. The Trinkhalle title transfers to the bank on the 1st of October. The cantonal Tourism Board commends you in writing for 'prompt disclosure to a duly accredited correspondent of the cantonal press,' which is the kind of commendation that does not change a thing in the Halver family. Selka Vorne is offered the cantonal lead editor's chair on the strength of the Vallenspring series and takes it.",
      },
      {
        beat: "Years later",
        consequence:
          "You will be the doctor who took it to the paper before she took it to her brother. Tobin will not speak to you for fourteen months. He will speak to you again, briefly, at their mother's seventy-fifth birthday. The town will know the story the way the cantonal press told it, which is true and is also not the only true version.",
      },
    ],
    secondOrder: {
      town: "Loses the season, the title, and the small dignity of having handled it from inside. Same economic outcome as the public announcement, plus the fact that the news was broken in Tarnen.",
      guests: "Nobody drinks the contaminated water on opening day. The cure-pensioners are turned at the road junction by the cantonal road-marshal as in the public-announcement route.",
      marta: "Keeps the licence. Earns a written commendation. Loses her brother for fourteen months. Carries the choice to put the press ahead of the family — defensible, paid for in the only currency that purchase has.",
      family: "Tobin resigns. The Halver Sunday dinner does not happen for fourteen months and is not the same when it resumes.",
      record: "Cantonal Tourism Board commendation. Morgenblatt cover story (Saturday, Sunday, and follow-ups). Hygienic Institute report published the following Wednesday.",
      later: "The route that put the truth on the wire before it put the truth on the kitchen table, with the costs of that ordering paid in the kitchen.",
    },
    tone: "The press given the first call and the family the last, with the costs of the ordering paid in the order it was made.",
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
