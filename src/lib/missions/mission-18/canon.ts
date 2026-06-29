/**
 * Mission Eighteen — CANON. Deterministic ground truth for "The Spring".
 */

export const CANON = {
  world: {
    date: "A Saturday in late May, the seventy-third year of the Vallenspring Kursaison",
    time: "09:18 — forty-two minutes before the ribbon-cutting at the Trinkhalle",
    location:
      "The Kurplatz of Vallenspring, an alpine spa town of one thousand four hundred and eleven year-round residents in the upper Hellan valley, two hours by post-road from the cantonal seat at Tarnen",
    weather:
      "A clear, cool morning, the sun already over the eastern ridge. The smell of warm bread from Halver's bakery on the square mixes with the mineral tang of the Trinkhalle's fountain. Bunting in green and white strung corner to corner across the Kurplatz. The brass band of the Vallenspring Volunteer Fire is warming up under the pavilion — a single trombone, repeatedly, the same four notes.",
  },

  industry: {
    overview:
      "Vallenspring's economy is the spring. The Trinkhalle, the four bath-houses, the eleven sanatoria, and the two grand hotels (the Edelhof and the Bergrose) employ four hundred and twelve people directly; the seasonal trade carries every shop, every kitchen, and the post-coach line. The cantonal Tourism Board lists Vallenspring as Class A — 'a recommended cure-resort with verified mineral content and curative properties.' Loss of Class A status closes the season.",
    season_today:
      "Today is opening day. Eight hundred and forty-eight bookings are on the season's books, including a contingent of one hundred and twelve cure-pensioners from the cantonal civil service, who are en route by post-coach and expected at 11:30. Cancellation after 09:30 forfeits the town's seasonal advance payments to the booking houses in Tarnen.",
    debt:
      "The town carries a loan of fourteen thousand crowns from the Tarnen Mercantile Bank, secured against the Trinkhalle's title, drawn last autumn to repair the Edelhof's roof after the winter storms. The first repayment of one thousand six hundred crowns falls due on the first of August. The town's seasonal revenue must clear the repayment.",
  },

  player: {
    name: "Dr. Marta Halver",
    age: 37,
    role:
      "Town physician of Vallenspring, eleven years standing. Trained in Tarnen. Inherited the practice from her father, Dr. Edvin Halver. The cantonal Tourism Board's contracted health officer for the spring — empowered under the Cantonal Public Resort Act of '54 to suspend bathing or drinking at a Class A spring on her signature alone if she finds present and substantial risk to public health. The signature is hers; the suspension does not require the council's vote.",
    physicalState:
      "Standing at the small writing desk in the back room of her surgery on Apothekerstrasse, one street up from the Kurplatz, in a clean grey dress and her good shoes. The first-floor window is open to the square. The lab report from the cantonal Hygienic Institute in Tarnen arrived twenty minutes ago by the early post and lies on the desk beside her father's pocket watch. Her hands are cold. Her sister-the-mayor is to give the opening address at 10:00.",
  },

  mayor: {
    name: "Tobin Halver",
    age: 41,
    role:
      "Mayor of Vallenspring, second term. Marta's older brother. Owns no business; chairs the council. Honest in the small-town way of being honest about everything except the one thing it would cost him too much to be honest about. Has spent fourteen weeks on the festival.",
    truth:
      "Tobin signed the Tarnen Mercantile loan last October without bringing the full terms to the council vote. The 'fourteen thousand' on the public minutes is the principal; the actual instrument carries a covenant that calls the whole loan in immediately on loss of Class A status. If the season does not open, the bank closes on the Trinkhalle by the first of September and the town's water source becomes private property of the Tarnen Mercantile Bank. He has told no one. Will, if Marta asks him plainly in his office whether the loan terms are what the minutes say, look at her for four seconds and then tell her.",
    wants:
      "The season to open. His sister to be wrong about the readings. To not be the mayor who killed Vallenspring. To not be the brother who has to lie to Marta on the Kurplatz at quarter to ten.",
    whereabouts: "His mayor's office on the second floor of the Rathaus on the south side of the Kurplatz, going over the welcome address.",
  },

  council_chair: {
    name: "Ingrid Olsten",
    age: 58,
    role:
      "Chair of the Vallenspring Town Council, fourth term. Owner of the Hotel Edelhof (which the autumn loan paid to re-roof). Married to Karl Olsten of the Edelhof Bath-house, which draws directly from the Trinkhalle outflow. Has been in the chair longer than Tobin has been mayor.",
    truth:
      "Ingrid does not know about the loan covenant. She does know that the Edelhof has booked one hundred and thirty-eight cure-pensioners this season at four crowns a night and that a one-week delay loses her four thousand crowns she cannot recover. Will not pretend otherwise. Will, if presented with a credible health threat in private at her hotel office before 10:00, support a 'technical delay' framed as plumbing inspection — not a public health announcement. Will not support an admission of contamination on the Kurplatz at the ribbon-cutting.",
    wants:
      "The Edelhof booked through the season. Her late husband's hotel kept in the family. The council quiet.",
    whereabouts: "Her hotel office at the Hotel Edelhof on the east side of the Kurplatz.",
  },

  reporter: {
    name: "Selka Vorne",
    age: 26,
    role:
      "Cantonal correspondent for the Tarnen Morgenblatt, two years on the resort beat. In Vallenspring since Thursday on the festival's press allocation, staying at the Bergrose. Sharp, polite, will quote you accurately.",
    truth:
      "Selka has been working on a piece about cure-town finances for six weeks and has, by Wednesday last week, the principal of the Tarnen Mercantile loan from a clerk in Tarnen who does not know she has it. She does not have the covenant. She has noticed that Marta has been at the surgery later than usual three nights running and has noticed that the post-rider brought a sealed envelope from the Hygienic Institute this morning. Will, if Marta does not contact her by 09:50, knock on the surgery door at 09:51. Will, if Marta tells her the truth on the record before 10:00, hold the story until the cantonal evening edition (going to press at 16:00) in exchange for first interview. Will run a less accurate story by sundown either way.",
    wants:
      "The story. Accuracy. Not to be the reporter who broke a town for a sentence.",
    whereabouts: "Breakfast room of the Bergrose on the north side of the Kurplatz, second cup of coffee, notebook open.",
  },

  engineer: {
    name: "Henrik Daal",
    age: 49,
    role:
      "The town's water engineer, twenty-two years on the Vallenspring spring works. Maintains the Trinkhalle pump-house, the four bath-house feed lines, and the upper-bore casing on the spring source two hundred meters above the town. Does not sit on the council. Drinks his beer at Riemer's, alone, after work.",
    truth:
      "Henrik has known since the March inspection that the upper-bore casing has a hairline split along the iron sleeve where it crosses the stream-bed at the upper spring head, and that surface runoff is entering the bore intermittently — heavily after rain, lightly in dry weather. He reported it to Tobin in writing on the 11th of April. The reply was 'after the season.' Henrik kept the carbon. The fix is a single replacement sleeve and a four-day shutdown of the upper bore, costed at two hundred and twelve crowns. The lower-spring source, which is on a separate aquifer, is uncontaminated and could supply the Trinkhalle fountain at reduced flow for the season. Will tell Marta all of this in the first three minutes of any conversation that begins with her opening the lab report on his workbench.",
    wants:
      "The bore fixed. Not to be the man who said nothing. To finish his career without his name on the report.",
    whereabouts: "The pump-house behind the Trinkhalle, doing the morning gauge round.",
  },

  lab_report: {
    surface:
      "Sealed envelope from the Cantonal Hygienic Institute in Tarnen, post-marked Friday afternoon, addressed to Dr. M. Halver, town physician. One page on Institute letterhead, signed by Dr. Vendel Krause, head of the water-analysis division. Subject: 'Vallenspring Trinkhalle and Edelhof bath-house outflow, samples received 14th May.'",
    headline:
      "Coliform count 1,840 per 100 ml against a Class A limit of 50. Lead 0.31 mg/l against a limit of 0.05. Free arsenic 0.04 mg/l against a limit of 0.05 (below limit but trending). Krause's hand-written note at the foot: 'Marta — the coliform is recent surface contamination, the lead is the bore lining. Cease drinking immediately. Bathing at reduced concentrations is a separate question. Investigate the upper bore. — V.K.'",
    second_page_in_the_envelope:
      "A second sheet, easy to miss because it is folded against the back of the first: the breakdown table for the SECOND set of samples Krause took on his own initiative from the Edelhof bath-house outflow on the 16th of May, two days after the first samples. Coliform 6,200. Lead 0.42. Free arsenic 0.07 — above limit. The trend across forty-eight hours is unambiguously upward. The second page also notes that a fix at the bore will return the spring to Class A inside ten days IF the lead-laced section of the lining is replaced at the same time; the cost of the combined fix is approximately two hundred and seventy crowns.",
    reachability:
      "Marta has read the first page. She has not opened the envelope all the way and has not seen the second sheet. The second sheet is reachable by physically picking up the envelope and looking inside it; the engineer Henrik knows the upper bore is the source and will say so the moment he sees the first page; the cost and timeline of the combined fix is reachable from Henrik in the same conversation.",
  },

  authority: {
    suspension_order:
      "Marta carries the Cantonal Public Resort Act suspension form in her father's old leather wallet in her surgery desk. Two signatures — hers and the Cantonal Health Officer's. Hers is sufficient pending counter-signature; the counter-signature comes within a week. Posting the order on the Trinkhalle door at 09:25 stops the ribbon-cutting at 10:00 by operation of law.",
    council_route:
      "A health risk presented to the council in private at the Rathaus before 10:00 can result in a 'technical delay' notice signed by the council chair without invoking the cantonal Act. This is the route Ingrid will accept. It does not protect Marta if the Hygienic Institute publishes Krause's report independently next week, which it will.",
    private_route:
      "Marta could ask Henrik to take the upper bore off-line at 09:25 'for inspection,' which would draw the Trinkhalle from the lower spring at reduced flow and would technically remove the contamination from today's water within forty minutes. This does not address the lead already in the bath-house feed line. It is a partial fix that buys days, not the season.",
    leak:
      "Selka Vorne will run an inaccurate version of the story by sundown today even if Marta says nothing. A truthful statement from Marta on the record before 09:50 controls the framing in the Morgenblatt; after 09:50 it does not.",
  },

  history: [
    { when: "Seventy-three years ago", what: "The Vallenspring Kursaison was founded and the Trinkhalle built over the upper spring head." },
    { when: "Twenty-eight years ago", what: "The cast-iron bore lining was installed by the elder Daal. The lead-soldered joints were standard practice." },
    { when: "Last October", what: "Tobin signed the Tarnen Mercantile loan, including a covenant on Class A status he did not bring to the council." },
    { when: "11th April", what: "Henrik reported the hairline split in the upper-bore casing to Tobin in writing. Reply: 'after the season.'" },
    { when: "14th May (Tuesday)", what: "Marta drew the spring and bath-house samples and sent them to the Hygienic Institute by post." },
    { when: "16th May (Thursday)", what: "Krause at the Institute, troubled by the first readings, drew a second set from the Edelhof bath-house outflow. Selka Vorne arrived in Vallenspring on the press allocation." },
    { when: "Friday afternoon", what: "Krause posted the two-page report. Selka noticed Marta at the surgery past eleven." },
    { when: "This morning, 08:58", what: "The post-rider delivered the sealed envelope to Marta's surgery." },
    { when: "This morning, 09:18", what: "The player takes the chair. Forty-two minutes to the ribbon-cutting." },
  ],

  constraints: [
    "The ribbon-cutting is at 10:00. Eight hundred and forty-eight booked guests are in or en route to Vallenspring; the cantonal pensioners arrive at 11:30. Selka Vorne knocks on the surgery door at 09:51 if not contacted first.",
    "Marta's signature on the Cantonal Public Resort Act suspension form is sufficient to stop the season today. Posting it on the Trinkhalle door at 09:25 closes the ribbon-cutting by operation of law. It also forfeits the booking advances and triggers the loan covenant.",
    "The second page of the lab report — the upward trend across forty-eight hours and the combined-fix cost — is in the envelope and has not yet been seen. Henrik Daal at the pump-house will name the upper-bore split and the combined-fix cost the moment a conversation begins with the first page.",
    "Tobin will tell Marta about the loan covenant if asked plainly in his office. Ingrid will support a 'technical delay' framed as plumbing but not a public health announcement. Selka will hold for the evening edition only if given the truth on the record before 09:50.",
    "A partial private fix — taking the upper bore off-line at 09:25 — removes the contamination from today's drinking water within forty minutes but does not address the lead in the bath-house feed line and does not address what Krause sends to the cantonal Tourism Board on Monday.",
    "Doing nothing is also a decision. The ribbon is cut at 10:00 and the first cure-pensioner drinks at the Trinkhalle fountain at 11:42.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}

INDUSTRY: ${CANON.industry.overview}
TODAY: ${CANON.industry.season_today}
DEBT (HIDDEN — Tobin reveals only if asked plainly in his office): ${CANON.industry.debt}

PLAYER: ${CANON.player.name}, ${CANON.player.age}. ${CANON.player.role} ${CANON.player.physicalState}

MAYOR (sibling): ${CANON.mayor.name}, ${CANON.mayor.age}. ${CANON.mayor.role}
MAYOR (TRUTH — do not volunteer): ${CANON.mayor.truth} WANTS: ${CANON.mayor.wants} WHEREABOUTS: ${CANON.mayor.whereabouts}

COUNCIL CHAIR: ${CANON.council_chair.name}, ${CANON.council_chair.age}. ${CANON.council_chair.role}
CHAIR (TRUTH — do not volunteer): ${CANON.council_chair.truth} WANTS: ${CANON.council_chair.wants} WHEREABOUTS: ${CANON.council_chair.whereabouts}

REPORTER: ${CANON.reporter.name}, ${CANON.reporter.age}. ${CANON.reporter.role}
REPORTER (TRUTH — do not volunteer): ${CANON.reporter.truth} WANTS: ${CANON.reporter.wants} WHEREABOUTS: ${CANON.reporter.whereabouts}

ENGINEER: ${CANON.engineer.name}, ${CANON.engineer.age}. ${CANON.engineer.role}
ENGINEER (TRUTH — names the upper-bore split and the combined-fix cost the moment a conversation begins with the first page of the report): ${CANON.engineer.truth} WANTS: ${CANON.engineer.wants} WHEREABOUTS: ${CANON.engineer.whereabouts}

THE LAB REPORT — SURFACE: ${CANON.lab_report.surface}
HEADLINE (Marta has read this): ${CANON.lab_report.headline}
SECOND PAGE (HIDDEN — folded against the back of the envelope, Marta has NOT seen): ${CANON.lab_report.second_page_in_the_envelope}
REACHABILITY: ${CANON.lab_report.reachability}

AUTHORITY ROUTES:
- Suspension: ${CANON.authority.suspension_order}
- Council route: ${CANON.authority.council_route}
- Private partial fix: ${CANON.authority.private_route}
- Leak risk: ${CANON.authority.leak}

HISTORY:
${CANON.history.map((h) => `- ${h.when}: ${h.what}`).join("\n")}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
