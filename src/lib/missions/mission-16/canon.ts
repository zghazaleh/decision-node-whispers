/**
 * Mission Sixteen — CANON. Deterministic ground truth for "The Village".
 */

export const CANON = {
  world: {
    date: "A Tuesday in mid-summer, the second year of the Tareni counter-insurgency campaign",
    time: "05:47 — first light, eleven minutes before the platoon steps off",
    location:
      "The eastern edge of Korven Veld, a hamlet of nineteen households on the lower terraces of the Sevra valley in the Tareni Highlands, a contested upland province of the Republic of Aluria fifty-one weeks into Operation FERN ARC",
    weather:
      "Dry heat already rising. A pale yellow dust on the air from the supply road. Smoke from one cooking fire in the hamlet drifting north across the terraces. A thin haze over the ridge two kilometers east; the wind will turn at seven.",
  },

  conflict: {
    war:
      "The Aluri-Tareni war, fifty-one weeks. The Republic of Aluria deployed the 14th Light Infantry to the Sevra valley in week three of FERN ARC to interdict highland supply lines for the Tareni Front for the Restoration (TFR) insurgency.",
    rules_of_engagement:
      "FRAGO 11/B (effective four days): 'In settlements designated PINK on the operational overlay, treat all military-age males as combatants pending interrogation. Civilian presence is not a bar to clearance if the settlement is so designated.' The order is unlawful under Aluri Military Code §214 and the Geneva framework; it has not been challenged inside the battalion because the chain has not been asked to challenge it.",
    designation:
      "Korven Veld was marked PINK at 02:14 this morning on a single-source intelligence report (callsign CROW) routed through Battalion S-2. The previous overlay, from 22:00 last night, had Korven Veld as WHITE (cleared, friendly).",
  },

  player: {
    name: "Corporal Idris Halm",
    age: 24,
    role:
      "Fire team leader, 2nd Squad, 3rd Platoon, B Company, 14th Aluri Light Infantry. Two years in country. Carries the squad's secondary radio (PRC-148) on company frequency 4. Trusted by Sergeant Karst because he does what he is told and is not stupid about it.",
    physicalState:
      "Lying prone in dust behind a low stone wall on the eastern edge of the hamlet, weapon shouldered but not on a target. The wall is waist-high to a standing man, cool against his forearm. His mouth tastes of the iron salt of breakfast tea drunk too fast. The platoon is staged in three elements: 1st Squad on the south track, 2nd Squad here, 3rd Squad on the upper terrace as overwatch.",
  },

  sergeant: {
    name: "Sergeant Voren Karst",
    age: 33,
    role:
      "Squad sergeant, 2nd Squad. Eleven years in. Two combat tours before FERN ARC. Decorated, quiet, drinks coffee black, is not cruel.",
    truth:
      "Karst does not believe the CROW intel and said so on the radio at 03:08 to Captain Vorr, who answered 'execute as ordered, sergeant.' Karst has not told the squad. He has decided that if he leads from the front and keeps the squad tight, the clearance will be fast and small rather than slow and large, and that this is the best of the available bad outcomes. He is wrong about which outcome it will be once contact begins; he is not stupid about it. Will tell Idris the truth about the 03:08 call if Idris asks him plainly where the order came from and why he believes it.",
    wants:
      "The clearance executed at a pace the squad can hold. His men alive at the end of the morning. To not be the sergeant who refused.",
    whereabouts: "Four meters to Idris's left along the same wall, scanning the hamlet through the small folding optic he carries clipped to his vest.",
  },

  wavering_soldier: {
    name: "Private Marek Tolven",
    age: 19,
    role:
      "Rifleman, 2nd Squad. Eight months in country. From a wheat town on the Aluri central plain. Has not been in a clearance like this one before.",
    truth:
      "Tolven is on the edge of refusing and does not know he is. He has not slept properly in three days. He will follow whoever moves first. If Idris moves to clear, Tolven moves to clear. If Idris lays his weapon down on the wall, Tolven will lay his down within ten seconds. If Idris does nothing and the squad steps off, Tolven steps off and will fire at any movement because that is what the platoon's last engagement taught his hands.",
    wants:
      "Not to be the one who freezes. To go home. To do this right. To not think about what 'this right' means until later.",
    whereabouts: "Two meters to Idris's right, prone, breathing too fast.",
  },

  elder: {
    name: "Old Bekka Anneth",
    age: 71,
    role:
      "Widow, weaver, headman's mother. Sitting on the stone step of the second house in from the eastern edge, fifteen meters from the wall, peeling root vegetables into her apron in the half-light because she gets up before the goats.",
    truth:
      "Bekka knows the village has no TFR cell and never has. The young men who left in the spring went to the lowland market towns for work, not to the Front. The cooking fire in the third house is her granddaughter's; the granddaughter is eight and her name is Lira. Bekka has seen patrols pass this hamlet four times since the war began and they have always passed. She does not know she has been re-designated PINK at 02:14. She is unarmed, weighs forty-eight kilograms, and is the human fact of the place.",
    wants:
      "To finish the vegetables before the heat. To not be afraid of soldiers because being afraid is what makes soldiers afraid.",
    whereabouts: "On the stone step of the second house from the eastern edge of the hamlet, in plain view from Idris's position behind the wall.",
  },

  captain: {
    name: "Captain Lendrick Vorr",
    age: 38,
    role:
      "Company commander, B Company. Career officer, third generation Aluri military, on the colonel's list. Issued the clearance order at 02:31 from the company TOC at COP THORN, two kilometers north on the ridge road.",
    truth:
      "Vorr issued the order based on the CROW report and on a phone call at 02:25 from Major Helven at Battalion S-3, who told him 'the overlay is your authority, Lendrick, exercise it.' Vorr did not press for the source. He knows the order is at the edge of FRAGO 11/B and inside the boundary the battalion will defend after the fact. He is on the company net (frequency 4) and will answer if called. He will not countermand his own order without a higher voice on the line; he WILL pause it for ninety seconds if Idris specifically asks for a sit-rep confirmation on the source before stepping off, because his own retention of plausible deniability requires it.",
    wants:
      "The clearance reported complete by 07:00. Promotion to major in the autumn board. To not be on the wrong end of an inquiry that nobody is currently asking to open.",
    whereabouts: "Company TOC at COP THORN, two kilometers north, on frequency 4.",
  },

  observer: {
    name: "Lieutenant Halver Brel",
    age: 28,
    role:
      "Battalion liaison officer attached to FERN ARC's Inspector General cell as of two weeks ago. On the eastern ridge with a tripod-mounted spotting scope and a notebook. Sent personally by the IG to observe how FRAGO 11/B is being executed.",
    truth:
      "Halver is here specifically to record whether the platoon executes a PINK clearance over visible noncombatants, who orders it, who refuses, and who if anyone calls for a source confirmation on the net. He will not intervene; he is collecting evidence for an IG file that the battalion does not know is being built. His scope catches the sun at 05:52 from Idris's angle for approximately three seconds. He is on frequency 7 — a frequency the squad does not monitor — and is recording the company net on a second handset. He will not identify himself unless directly hailed by name.",
    wants:
      "A clean evidentiary record. Will not bias the outcome. Will note any individual call for source confirmation as a matter of standing.",
    whereabouts: "Eastern ridge, two kilometers east of the hamlet, prone in a hide under a juniper, scope facing west.",
  },

  comms: {
    company_freq: "Frequency 4 — company net. Captain Vorr, all three platoon nets, the company TOC.",
    source_confirmation_protocol:
      "Per company SOP, any squad leader or fire team leader staged on the line may, before step-off, request 'SOURCE CONFIRM' on the designation. The captain must answer with the source callsign and confidence. This call is logged. It is rarely used because using it marks the caller as the one who paused the order.",
    last_chatter:
      "At 05:43, Captain Vorr on freq 4: 'Bravo three-two, this is six. Step off at four-eight. Confirm.' Karst keyed once at 05:43:11 and said 'Three-two confirms.' Nothing on the net since.",
  },

  hamlet: {
    layout:
      "Nineteen houses in two rows along a single dirt track that runs roughly north–south. Stone walls, reed roofs. The track exits the hamlet south toward the lower valley (open ground for two hundred meters, then woodline) and north toward COP THORN (the way the platoon came in). An old goat path drops west off the back of the hamlet through scrub for sixty meters to a dry watercourse that loops south behind the woodline. The path is wide enough for a person on foot; the platoon's overwatch on the upper terrace cannot see the first thirty meters of it because of the angle of the second-row houses.",
    civilians_present:
      "Counted from the wall: at least nine. Bekka on the step. A man drawing water from the well at the third house — middle-aged, no weapon visible, watching the soldiers without moving. Two women at the fifth house door. A small group of children — three, maybe four — visible through the gap between houses six and seven, not yet aware of the platoon. A boy of perhaps fourteen at the goat pen behind house eleven. There are more inside the houses; the count from the wall is a floor, not a ceiling.",
    armed_persons_visible: "None.",
    goat_path_exit:
      "The west goat path is the route a noncombatant evacuation would take. It is unobserved from overwatch for the first thirty meters. Beyond the watercourse, the families would be in the lowland woodline by 06:30 and could reach the parish at Velnar by midday.",
  },

  nagging_detail: {
    surface:
      "The order is given. Step-off is four-eight. The squad is on the wall. The captain is on frequency 4.",
    truth:
      "Three reachable threads converge on a different shape than the order's surface suggests: (a) the CROW intel that re-designated Korven Veld PINK at 02:14 is single-source and Karst does not believe it — reachable by asking Karst plainly where the order came from and why, or by calling 'SOURCE CONFIRM' on freq 4 and putting Captain Vorr on the record; (b) a tripod scope on the eastern ridge caught the rising sun at 05:52 — Lieutenant Brel from the IG cell is recording this clearance, reachable by glassing the ridge or by asking comms why there is a second listener on company net; (c) the goat path off the back of the hamlet is unobserved from overwatch for thirty meters and the families would reach Velnar by midday — reachable by looking at the ground and at the angle of the upper terrace.",
    bias_check:
      "There is also a true version in which the order is the order, the chain is the chain, and a corporal who freezes on the line gets soldiers around him killed in the next engagement. The hidden truths complicate the answer; they do not necessarily reverse the cost of refusing.",
  },

  characters: {
    sergeant_persona: {
      name: "Sergeant Voren Karst",
      role: "Four meters to Idris's left along the wall",
      knows:
        "What he was told at 03:08 by Captain Vorr. That CROW is single-source. That the previous overlay had this hamlet WHITE. That his squad is not the squad it was twelve months ago. Will tell Idris the truth if asked plainly where the order came from and why he is taking it.",
      stance:
        "Will not volunteer the 03:08 call. Will not yell. If Idris calls SOURCE CONFIRM on the net, Karst will not stop him and will, in fact, be quietly relieved. If Idris physically intervenes by stepping in front of the squad, Karst will draw his sidearm and order Idris down — and will then, with twenty seconds of held silence, lower it again, because Karst is not the sergeant who shoots his own corporal on the wall.",
      whereabouts: "Behind the wall, four meters left.",
    },
    wavering_soldier_persona: {
      name: "Private Marek Tolven",
      role: "Two meters to Idris's right, prone",
      knows: "What he is told by the body next to him.",
      stance: "Follows whoever moves first. Will follow Idris into anything Idris does first. Will follow Karst if Idris does nothing.",
      whereabouts: "Two meters right.",
    },
    elder_persona: {
      name: "Old Bekka Anneth",
      role: "On the stone step of the second house, peeling root vegetables",
      knows: "Her village. Her granddaughter Lira. That the cooking fire is hers. That she has seen patrols pass before.",
      stance:
        "Will not run. Will look at any soldier who walks up to her and will keep her hands visible because she is old and knows what to do. Will speak softly if spoken to. If Idris approaches her, she will tell him her granddaughter's name and ask his.",
      whereabouts: "Step of house two.",
    },
    captain_persona: {
      name: "Captain Lendrick Vorr",
      role: "On freq 4 from the company TOC",
      knows: "What he was told by Major Helven at 02:25. What he chose not to ask.",
      stance:
        "Will answer a SOURCE CONFIRM call. Will name CROW and give 'low to medium' confidence because that is what the report actually said. Will not countermand his own order without a higher voice on the line, but the SOURCE CONFIRM call itself, logged on the net, creates ninety seconds of legitimate pause before step-off.",
      whereabouts: "COP THORN, frequency 4.",
    },
    observer_persona: {
      name: "Lieutenant Halver Brel",
      role: "On the eastern ridge with a tripod scope",
      knows: "Everything visible from two kilometers east at first light. The company net traffic since 02:00.",
      stance:
        "Will not intervene. Will note the SOURCE CONFIRM call, any refusal, any intervention, and any covert evacuation, in his notebook. Will identify himself only if Idris hails 'Liaison, this is Bravo three-two, are you on the ridge' on frequency 7.",
      whereabouts: "Eastern ridge.",
    },
  },

  objects: {
    wall: { what: "Waist-high stone wall on the eastern edge of the hamlet, cool on the forearm, dust along the top. Cover from the village side, partial cover from the ridge." },
    radio: { what: "The squad's PRC-148 on Idris's vest, set to company freq 4. Pressel switch on the left strap." },
    optic: { what: "Karst's folding 4x optic clipped to his vest. Idris can borrow it without asking; Karst would hand it over." },
    ridge: { what: "The eastern ridge, two kilometers across the terraces. A glint at 05:52 from approximately the 1700 mil bearing if the sun is right and a lens is up there." },
    goat_path: { what: "The narrow west goat path off the back of the hamlet, dropping through scrub to a dry watercourse. First thirty meters are unobserved from overwatch on the upper terrace." },
    fragment_order: { what: "FRAGO 11/B in the platoon's printed packet — three folded pages in the cargo pocket. 'PINK = treat military-age males as combatants pending interrogation; civilian presence not a bar to clearance.'" },
    code_book: { what: "The platoon's brevity-code laminate. SOURCE CONFIRM is a logged call. SAFETY HOLD is a non-logged call any element on the line may make to pause step-off for sixty seconds without explanation." },
    watch: { what: "Idris's wristwatch, reading 05:47. Step-off at 05:48. Fifty-eight seconds until the squad moves on Karst's signal." },
  },

  history: [
    { when: "Fifty-one weeks ago", what: "Operation FERN ARC began. The 14th Light Infantry deployed to the Sevra valley." },
    { when: "Week 34", what: "B Company's first engagement at the lower watercourse. Four KIA on the Aluri side. The squad's hands learned the lesson Tolven now carries." },
    { when: "Four days ago", what: "FRAGO 11/B issued. The PINK designation became operative." },
    { when: "Two weeks ago", what: "The Inspector General's cell quietly attached Lieutenant Brel to FERN ARC as a battalion liaison. The battalion does not know what he is actually doing." },
    { when: "Last night, 22:00", what: "The operational overlay listed Korven Veld as WHITE." },
    { when: "Tonight, 02:14", what: "Asset CROW's single-source report routed through S-2. Korven Veld re-designated PINK." },
    { when: "Tonight, 02:25", what: "Major Helven called Captain Vorr: 'the overlay is your authority, exercise it.'" },
    { when: "Tonight, 02:31", what: "Vorr issued the clearance order to 3rd Platoon." },
    { when: "Tonight, 03:08", what: "Karst challenged the order on the net. Vorr answered 'execute as ordered, sergeant.'" },
    { when: "This morning, 05:43", what: "Vorr on freq 4: 'Step off at four-eight.' Karst keyed: 'Three-two confirms.'" },
    { when: "This morning, 05:47", what: "The player takes the chair. Fifty-eight seconds until step-off." },
  ],

  constraints: [
    "Step-off is at 05:48 on Karst's signal. The window for any action that prevents the clearance is measured in tens of seconds, not minutes.",
    "There are at least nine visible noncombatants in the hamlet and no visible armed persons. The PINK designation rests on a single-source intelligence report (CROW) that the squad sergeant does not believe.",
    "A SOURCE CONFIRM call on freq 4 is a logged, legitimate radio call that pauses step-off for approximately ninety seconds while the captain answers. A SAFETY HOLD call is a non-logged, sixty-second pause any element on the line may invoke without giving a reason.",
    "Captain Vorr will not countermand his own order without a higher voice on the line. He WILL truthfully describe CROW's confidence ('low to medium') on a SOURCE CONFIRM call, on the record.",
    "Sergeant Karst will not shoot a corporal on the wall. He will draw, order, and lower. Past that point the squad's loyalty is in play and Tolven follows whoever moved first.",
    "The west goat path is unobserved from overwatch for thirty meters. A covert evacuation of the hamlet via the goat path is physically possible in the window between 05:48 and roughly 06:10 if it begins immediately and quietly.",
    "Lieutenant Brel on the eastern ridge is recording this clearance for the Inspector General's cell. He will not intervene. He WILL note any call for source confirmation, refusal, intervention, or covert evacuation, and the IG file is real.",
    "Refusing the order on the line is, under Aluri Military Code §92, a court-martial offense. Refusing an unlawful order is, under §214, a defense. Whether §214 applies here will be decided by a board that does not yet exist.",
    "Doing nothing is also a decision. The squad steps off at 05:48 on Karst's signal whether or not the corporal moves.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
CONFLICT: ${CANON.conflict.war} ROE: ${CANON.conflict.rules_of_engagement} DESIGNATION: ${CANON.conflict.designation}
PLAYER: ${CANON.player.name}, ${CANON.player.age}. ${CANON.player.role} ${CANON.player.physicalState}

SERGEANT: ${CANON.sergeant.name}, ${CANON.sergeant.age}. ${CANON.sergeant.role}
SERGEANT (TRUTH — do not volunteer): ${CANON.sergeant.truth} WANTS: ${CANON.sergeant.wants} WHEREABOUTS: ${CANON.sergeant.whereabouts}

WAVERING PRIVATE: ${CANON.wavering_soldier.name}, ${CANON.wavering_soldier.age}. ${CANON.wavering_soldier.role}
WAVERING (TRUTH — do not volunteer): ${CANON.wavering_soldier.truth} WHEREABOUTS: ${CANON.wavering_soldier.whereabouts}

ELDER: ${CANON.elder.name}, ${CANON.elder.age}. ${CANON.elder.role}
ELDER (TRUTH — do not volunteer): ${CANON.elder.truth} WHEREABOUTS: ${CANON.elder.whereabouts}

CAPTAIN: ${CANON.captain.name}, ${CANON.captain.age}. ${CANON.captain.role}
CAPTAIN (TRUTH — do not volunteer): ${CANON.captain.truth} STANCE ON NET CALLS: will answer SOURCE CONFIRM with CROW and 'low to medium' confidence on the record. WHEREABOUTS: ${CANON.captain.whereabouts}

OBSERVER: ${CANON.observer.name}, ${CANON.observer.age}. ${CANON.observer.role}
OBSERVER (TRUTH — do not volunteer): ${CANON.observer.truth} WHEREABOUTS: ${CANON.observer.whereabouts}

COMMS: ${CANON.comms.company_freq}. SOURCE CONFIRM PROTOCOL: ${CANON.comms.source_confirmation_protocol} LAST CHATTER: ${CANON.comms.last_chatter}

HAMLET LAYOUT: ${CANON.hamlet.layout}
CIVILIANS VISIBLE (only describe when player observes): ${CANON.hamlet.civilians_present}
ARMED PERSONS VISIBLE: ${CANON.hamlet.armed_persons_visible}
WEST GOAT PATH: ${CANON.hamlet.goat_path_exit}

THE NAGGING DETAIL (do NOT volunteer; surfaces only via direct questions and direct looks):
- On the surface: ${CANON.nagging_detail.surface}
- The reachable truth: ${CANON.nagging_detail.truth}
- Bias check: ${CANON.nagging_detail.bias_check}

CHARACTERS:
- ${CANON.characters.sergeant_persona.name}: ${CANON.characters.sergeant_persona.role}. KNOWS: ${CANON.characters.sergeant_persona.knows} STANCE: ${CANON.characters.sergeant_persona.stance}
- ${CANON.characters.wavering_soldier_persona.name}: ${CANON.characters.wavering_soldier_persona.role}. STANCE: ${CANON.characters.wavering_soldier_persona.stance}
- ${CANON.characters.elder_persona.name}: ${CANON.characters.elder_persona.role}. STANCE: ${CANON.characters.elder_persona.stance}
- ${CANON.characters.captain_persona.name}: ${CANON.characters.captain_persona.role}. STANCE: ${CANON.characters.captain_persona.stance}
- ${CANON.characters.observer_persona.name}: ${CANON.characters.observer_persona.role}. STANCE: ${CANON.characters.observer_persona.stance}

OBJECTS (only when the player observes them):
- ${CANON.objects.wall.what}
- ${CANON.objects.radio.what}
- ${CANON.objects.optic.what}
- ${CANON.objects.ridge.what}
- ${CANON.objects.goat_path.what}
- ${CANON.objects.fragment_order.what}
- ${CANON.objects.code_book.what}
- ${CANON.objects.watch.what}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
