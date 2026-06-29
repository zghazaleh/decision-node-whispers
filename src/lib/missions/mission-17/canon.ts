/**
 * Mission Seventeen — CANON. Deterministic ground truth for "The Rope".
 */

export const CANON = {
  world: {
    date: "A Thursday in late summer, the eighth year of Bremmen Hollow's incorporation under the Cresta Plain charter",
    time: "Dusk — 19:42, the sun a finger's width above the western ridge, twenty-six minutes of usable light remaining",
    location:
      "The main street of Bremmen Hollow, a cattle-and-mail town of three hundred and ninety-one souls on the eastern Cresta Plain, two days' ride from the territorial seat at Edenmill",
    weather:
      "Hot, still, a brown dust hanging in the road that has not been laid by rain in nineteen days. Torches throw long shadows on the false fronts of Tully's hardware and the post office. The cottonwood at the end of the street creaks in a breath of wind that comes and goes.",
  },

  killing: {
    victim:
      "Henry Marsh, 47, postmaster and part-owner of the Marsh-Lourd freight line. Found at 14:10 today inside the post office, struck twice on the back of the head with a brass weight from his own counter scale. His till had been broken open and three dollars and the day's mail satchel were taken.",
    discoverer:
      "Adela Marsh, 39, his wife, who walked over from their house at the south end of the street at 14:10 to bring him his afternoon coffee.",
    sheriff:
      "Sheriff Wendell Krait left at first light yesterday with a prisoner for the territorial circuit at Edenmill and is not expected back before tomorrow noon. He pinned the deputy star on Casper Renn's chest at 04:50 yesterday morning, said 'Mind the town, son,' and rode out.",
    real_facts_known_to_no_one_in_the_crowd:
      "The brass weight was wielded by Owen Lourd, Henry Marsh's freight partner. Lourd had been quietly drawing on the freight account for nineteen months to cover a gambling debt at the Long Tooth in Cinder Springs; Henry confronted him at 14:00 today. Lourd struck him in panic, took the till and the satchel to make it look like road agents, and walked out the back. Lourd was the second man to arrive on the scene after Adela's scream and he led the search.",
  },

  player: {
    name: "Casper Renn",
    age: 22,
    role:
      "Newly sworn deputy of Bremmen Hollow as of yesterday morning. Born in Bremmen Hollow. Worked the Lourd-Marsh freight line as a teamster for three years. Knows every face in the crowd by name and has eaten at four of their tables. Carries a six-shot Colt that he has fired at fence posts and once at a coyote.",
    physicalState:
      "Standing in the dust ten paces back from the cottonwood at the end of Main Street. The deputy star is pinned crooked on the left of his vest, warm from being held too tight in his hand for the last ten minutes. His mouth tastes of the cold coffee he drank at four. His right hand is on the butt of the Colt without him having put it there. There are about forty men and women in the street between him and the tree; the suspects are bound at the wrists, kneeling in the back of Owen Lourd's freight wagon under the branch.",
  },

  mob_leader: {
    name: "Owen Lourd",
    age: 41,
    role:
      "Freight partner to Henry Marsh, twelve years standing. Cattlemen's association member. Married, two daughters. The voice on every corner of Bremmen Hollow when a vote is taken at the cattlemen's hall.",
    truth:
      "Owen killed Henry Marsh at 14:00 today over the freight-account theft. He needs this hanging to happen before dark because the bound suspects' saddlebags, currently behind the seat of his own wagon, contain a livery receipt from Tomlin's stable in Edenmill stamped 12:00 today — which, if read aloud, places the three strangers eighty miles east of Bremmen Hollow at the hour of the killing. Owen has not opened the saddlebags himself; he ordered them tossed under the seat by Pim Conder's horse forty minutes ago and is counting on the rope going before anyone thinks to look. Will not volunteer the existence of the saddlebags. Will, if asked plainly by the deputy, claim the saddlebags were searched and held nothing.",
    wants:
      "The hanging done before full dark and before Sheriff Krait can be sent for. The town's grief satisfied in a way that closes the books on Henry Marsh's killing tonight, not in a week.",
    whereabouts: "Standing on the box of his own freight wagon under the cottonwood, coiling the second of three ropes, four paces from the suspects.",
  },

  pleading_accused: {
    name: "Hale Tirran",
    age: 28,
    role:
      "A drover of the Vell-Tirran-Conder party of three, traveling east-to-west from the railhead at Calver's Crossing to the cattle markets at Westmount. Bound at the wrists in the bed of Lourd's wagon, kneeling between Joss Vell (24) and Pim Conder (35), the bruise above his eye from being struck with a pistol butt when the three were taken at the well at 16:30.",
    truth:
      "Hale is the older brother of Joss Vell (different fathers, same mother). The three were nowhere near the post office at 14:00 — they were watering horses at Tomlin's livery in Edenmill at noon and have a stamped receipt to prove it, currently inside the canvas roll behind the cantle of Pim's saddle, which is tied to the freight wagon. Hale knows the receipt is there. He has not said so out loud because (a) when he tried at 16:35 someone in the crowd hit him, (b) Owen Lourd cut him off at 17:10 with 'a piece of paper proves nothing,' and (c) Hale is half-convinced now, in the way the body becomes convinced under torchlight, that nobody is going to listen. Will tell Casper about the receipt the moment Casper walks to the wagon and asks him a calm question. Hides nothing else.",
    wants:
      "Not to be hanged. To get his brother and Pim home. To finish the cattle run.",
    whereabouts: "Kneeling in the wagon bed under the cottonwood, hands behind his back, looking at Casper because Casper is the only badge in sight.",
  },

  doubting_townsman: {
    name: "Bram Coate",
    age: 52,
    role:
      "Town blacksmith. Two-term member of the town council. Veteran of the Cresta militia. Stands a head taller than any other man in the crowd and has the only shoulders in the street that have moved a freight wagon by themselves.",
    truth:
      "Bram has watched Owen Lourd's face since 17:00 and does not like what he has seen. He noticed at 18:20 that the freight ledger from the post-office desk was not on the desk where it normally lives when he stepped inside with the sheriff's keys to fetch a length of cord — and he has not said this to anyone. He will back Casper if Casper steps in front of the wagon and gives him cover to move; he will not move first because his daughter is married to Owen Lourd's nephew. Will tell Casper about the missing ledger if Casper asks him plainly what he saw inside the post office.",
    wants:
      "The right thing done. Not to lose his daughter's marriage. Not to be the first man to break with the cattlemen's association in a town where the cattlemen run the hall.",
    whereabouts: "Standing on the wooden steps of the smithy, twenty paces back from the wagon, arms folded, hat low.",
  },

  widow: {
    name: "Adela Marsh",
    age: 39,
    role:
      "Henry's wife. Schoolteacher at the one-room schoolhouse, eleven years standing. Discovered her husband's body at 14:10 and has not been alone since.",
    truth:
      "Adela is the still center of the crowd's grief. She wants this ended. She did not see the killing and did not see the three strangers before Owen brought them in at 16:30. She trusts Owen because Henry trusted Owen. She does not know about the freight-account theft and does not know about the gambling debt at the Long Tooth. Will, if Casper kneels beside her bench and asks her one quiet question about whether Henry seemed troubled this week, tell him that Henry had told her on Monday night 'I think there is a thing with Owen I will have to put right by Friday.' She has not said this to anyone because it has only this hour become a sentence she can hear in her own head.",
    wants: "It over. The crowd to go home. Henry buried tomorrow.",
    whereabouts: "Sitting on the bench outside the post office, ten paces north of the wagon, a shawl over her shoulders despite the heat, two women of the town on either side of her.",
  },

  cast_others: {
    cousin_with_torch: "Reuben Lourd, 24, Owen's nephew. Holds the first of three torches set in the dust around the wagon. Will do whatever Owen does.",
    storekeeper: "Tully Marn, 56, hardware. Has been counting register receipts in his head since 17:00 and does not want trouble in front of his store. Will step back if Casper steps forward.",
    minister: "Reverend Peyton Holst, 61. Has the town Bible in his hand and is waiting for Owen's nod to begin. Does not want this. Will not stop it. Will, if asked by Casper to take the suspects into his church for the night under the deputy's authority, agree without a word.",
    crowd_size: "About forty adults in the street, perhaps another twenty watching from porches and second-storey windows. Twelve of the forty are women. Two of the forty are armed visibly, not counting Owen.",
  },

  evidence_chain: {
    surface:
      "The three strangers were caught at the south well at 16:30 with a small leather purse containing seven silver dollars, three of which the crowd is calling 'Henry's' though no mark distinguishes them. Two horses bear sweat marks consistent with hard riding. None of the three claim to know the dead man.",
    truth_reachable_only_by_asking:
      "The leather purse is Pim Conder's drover purse from the Westmount run. The seven dollars are the balance of the party's trail money, drawn at Calver's Crossing on Tuesday from the Cattle Drovers' Trust. A receipt for that draw is folded inside the same purse and has not been examined. The horses' sweat is from the noon-to-three ride from Edenmill, not from a flight from Bremmen Hollow. The livery receipt from Tomlin's in Edenmill, stamped 12:00 today, is inside the canvas roll behind the cantle of Pim Conder's saddle, currently tied to the back of Owen Lourd's freight wagon under a cattle blanket. The freight ledger from the post-office counter, which would show the missing nineteen months of draws against the account, was on Henry Marsh's desk this morning and is no longer there; it is presumed by Adela to be 'somewhere' and has not been searched for.",
  },

  badge: {
    authority:
      "Casper's deputy star carries the legal authority of Sheriff Krait's office while the sheriff is absent from the county. Under Cresta Plain charter §11, the deputy in residence is the senior peace officer of the town and any lynching that proceeds over his explicit objection is, by statute, a capital crime against every adult participant. In practice this has been enforced exactly twice in the territory's nineteen-year history. The badge is real authority and is also a piece of tin pinned on a 22-year-old.",
    rider:
      "The town's mail rider, Dell Tomlin (no relation to the livery), is unhitched at the freight barn and could be on a horse to Edenmill in four minutes if dispatched. The ride is six hours each way; a court-marshal could not be back before tomorrow noon. Owen will not allow the rider to be dispatched without an open argument. Casper has the authority to dispatch the rider without Owen's consent; using it costs him most of the crowd inside an hour.",
  },

  history: [
    { when: "Eight years ago", what: "Bremmen Hollow incorporated under the Cresta Plain charter. Henry Marsh sworn as first postmaster." },
    { when: "Six years ago", what: "Henry Marsh and Owen Lourd founded the Marsh-Lourd freight line on equal shares." },
    { when: "Nineteen months ago", what: "Owen Lourd began drawing quietly on the freight account to cover gambling losses at the Long Tooth in Cinder Springs. Henry did not notice until last week." },
    { when: "Monday night", what: "Henry told Adela: 'I think there is a thing with Owen I will have to put right by Friday.'" },
    { when: "Yesterday, 04:50", what: "Sheriff Krait pinned the deputy star on Casper Renn and rode out for Edenmill with a prisoner." },
    { when: "Today, noon", what: "Hale Tirran, Joss Vell, and Pim Conder watered horses at Tomlin's livery in Edenmill and were stamped on a feed receipt at 12:00." },
    { when: "Today, 14:00", what: "Henry Marsh confronted Owen Lourd inside the post office about the account. Owen struck him twice with the brass scale weight, took the till and the satchel, and walked out the back." },
    { when: "Today, 14:10", what: "Adela Marsh found her husband." },
    { when: "Today, 15:00–16:00", what: "The town gathered. Owen Lourd organized search parties along the east road. The three strangers were caught at the south well at 16:30 with a drover's purse." },
    { when: "Today, 17:00", what: "Owen Lourd brought the three to Main Street, called for the rope, and was answered." },
    { when: "Today, 19:42", what: "The player takes the chair of Deputy Casper Renn. Three ropes are over the cottonwood branch and twenty-six minutes of usable light remain." },
  ],

  constraints: [
    "Sheriff Krait is in Edenmill and will not be back before tomorrow noon. The mail rider Dell Tomlin can be dispatched and would reach Edenmill in roughly six hours; a court officer would arrive earliest tomorrow noon.",
    "There are about forty adults in the street and only one of them, Bram Coate, is publicly considering not following Owen Lourd. The crowd will move with whoever moves first and loudest; the badge is a real authority and is also a piece of tin on a 22-year-old.",
    "Owen Lourd will not yield to a private request and will yield, partially, to a public demand backed by Coate's body. He will not yield to a request that calls him a liar in front of his nephew, his minister, and the widow he led here.",
    "Hale Tirran will tell Casper about the livery receipt the moment a calm question is asked at the wagon. Bram Coate will tell Casper about the missing ledger if asked plainly what he saw. Adela will tell Casper about Henry's Monday-night sentence if Casper kneels by her bench and asks one quiet question. None of the three will volunteer.",
    "Twenty-six minutes of usable light remain. Owen Lourd has already said twice that 'no man hangs in the dark in this town.' The pressure to act before full dark is the pressure under which the entire scene runs.",
    "Doing nothing is also a decision. The rope goes when Owen Lourd calls for it, on or before 20:08.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}

THE KILLING: ${CANON.killing.victim}
DISCOVERED BY: ${CANON.killing.discoverer}
SHERIFF: ${CANON.killing.sheriff}
WHAT ACTUALLY HAPPENED (HIDDEN TRUTH — never volunteer, surfaces only through specific reachable threads): ${CANON.killing.real_facts_known_to_no_one_in_the_crowd}

PLAYER: ${CANON.player.name}, ${CANON.player.age}. ${CANON.player.role} ${CANON.player.physicalState}

MOB LEADER: ${CANON.mob_leader.name}, ${CANON.mob_leader.age}. ${CANON.mob_leader.role}
MOB LEADER (TRUTH — do not volunteer): ${CANON.mob_leader.truth} WANTS: ${CANON.mob_leader.wants} WHEREABOUTS: ${CANON.mob_leader.whereabouts}

PLEADING ACCUSED: ${CANON.pleading_accused.name}, ${CANON.pleading_accused.age}. ${CANON.pleading_accused.role}
ACCUSED (TRUTH — do not volunteer; tells Casper about the receipt the moment a calm question is asked): ${CANON.pleading_accused.truth} WANTS: ${CANON.pleading_accused.wants} WHEREABOUTS: ${CANON.pleading_accused.whereabouts}

DOUBTING TOWNSMAN: ${CANON.doubting_townsman.name}, ${CANON.doubting_townsman.age}. ${CANON.doubting_townsman.role}
DOUBTER (TRUTH — do not volunteer; will back the deputy if the deputy moves first): ${CANON.doubting_townsman.truth} WANTS: ${CANON.doubting_townsman.wants} WHEREABOUTS: ${CANON.doubting_townsman.whereabouts}

WIDOW: ${CANON.widow.name}, ${CANON.widow.age}. ${CANON.widow.role}
WIDOW (TRUTH — do not volunteer; will tell the Monday-night sentence if asked one quiet question): ${CANON.widow.truth} WANTS: ${CANON.widow.wants} WHEREABOUTS: ${CANON.widow.whereabouts}

OTHER CAST PRESENT:
- ${CANON.cast_others.cousin_with_torch}
- ${CANON.cast_others.storekeeper}
- ${CANON.cast_others.minister}
- CROWD: ${CANON.cast_others.crowd_size}

EVIDENCE — what the crowd believes on the surface: ${CANON.evidence_chain.surface}
EVIDENCE — what is reachable but never volunteered: ${CANON.evidence_chain.truth_reachable_only_by_asking}

BADGE AUTHORITY: ${CANON.badge.authority}
THE RIDER: ${CANON.badge.rider}

HISTORY:
${CANON.history.map((h) => `- ${h.when}: ${h.what}`).join("\n")}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
