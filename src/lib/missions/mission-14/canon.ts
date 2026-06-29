/**
 * Mission Fourteen — CANON. Deterministic ground truth for "The Lodger".
 */

export const CANON = {
  world: {
    date: "A Wednesday in late winter, the fourth year of the occupation",
    time: "22:51 — fifty-one minutes past the 22:00 curfew",
    location:
      "Number 14 Vinnerstrasse, a narrow two-storey terrace house on a watched street in the river quarter of Maerlund, a town of nineteen thousand under the occupying authority of the Imperial Vesren Protectorate",
    weather:
      "Cold rain over the cobbles, easing now to a drizzle. A thaw wind off the river. The street gas-lamps were extinguished at curfew; the only light outside is the small lantern at the patrol corner, two doors up.",
  },

  occupation: {
    authority:
      "The Imperial Vesren Protectorate has held the town since the autumn of the first year of the war. The current commandant is Major-General Korven Halek. Curfew is 22:00 to 05:00. Movement permits required for medical workers and millers; otherwise none.",
    decree_fourteen:
      "Standing Decree 14, posted in every parish: 'Any household found sheltering an unregistered person, a deserter from any service, or a designated fugitive shall be held collectively responsible. Sentence: execution of the head of household and detention of all other residents for resettlement.' The decree has been enforced on Vinnerstrasse twice in three years; both households were gone by morning.",
    patrols:
      "Night patrols are typically two soldiers and a corporal, sweeping a street every forty to sixty minutes after midnight. Tonight the sweep is unusually early — a uniformed patrol passed the corner at 22:42 and turned south, and footsteps on the next street suggest a second sweep returning. The corner sentry box is manned.",
    informer_bounty:
      "An informer who delivers a wanted person to a patrol receives a ration card supplement and a notation of 'civic loyalty' on the household registry — meaningful in a town where rations decide which child eats.",
  },

  player: {
    name: "Eda Vargen",
    age: 36,
    role:
      "Schoolteacher at the Vinnerstrasse parish school (closed for the past eleven months). Widow of Anton Vargen, miller, killed in the second-year fighting. Mother of two: Mira, 9, and Pim, 6. Cousin to half the street.",
    physicalState:
      "Standing in the small entry hall behind the front door in stockings and a wool shawl. The bolt is half-drawn — she opened the door an inch and is now holding it. A single candle burns on the parlor table behind her, casting her shadow long.",
  },

  stranger: {
    presented_name: "Yorin Bartolt",
    presented_claim:
      "Says, in a low voice through the cracked door: 'I'm a printer from the eastern district. Some pamphlets were found at my shop. The patrol is two streets over. Half an hour, missus. A loft, a cellar, anywhere.'",
    truth:
      "He is Captain Vorel Tessen, an Imperial Vesren defector — formerly of the 4th Garrison Intelligence Section — who has been passing the resistance the route maps of the eastern grain convoys for the past four weeks. He defected after a directive ordering reprisal executions in the village of Solven crossed his desk; he refuses to discuss Solven. The 'printer' story is the cover the resistance gave him for civilian doors. If Eda asks him plainly who he is and why they are hunting him, he will tell her — he has been instructed not to volunteer it because the truth raises the household's risk by an order of magnitude.",
    physical:
      "Thirty-one, narrow, dark coat soaked through, no obvious weapon, hands empty, a small leather case at his hip. A faint old scar on the left cheekbone. Wedding ring he no longer wears in his pocket. His Vesren accent is faintly clipped on the consonants — audible if Eda listens, missable if she does not.",
    not_volunteered_safehouse:
      "He knows the next safehouse on the resistance chain is the rectory cellar of Saint-Cael's, four streets north — but he does not know whether Father Brem is in residence tonight, and the route there crosses two patrolled streets. He will name it only if Eda asks what alternatives he has, and he will name the uncertainty with it.",
  },

  neighbor: {
    name: "Henna Korlt",
    role: "Widow, sixty-one, lives at number 13 directly across",
    knows:
      "That her own daughter Lise was taken by a patrol two years ago after a denunciation Henna has never been certain came from her own street. That she has, since then, twice quietly hidden food in the Vargen woodshed without being asked. That she heard the knock on Eda's door tonight and is now standing in her own darkened window with the curtain held one inch back, watching.",
    loyalty:
      "Ambiguous, leans resister but cannot be assumed. Will not denounce on a guess. Will help if approached directly with a specific small ask (e.g., 'come and sit in my parlor in five minutes so the patrol sees two houses lit') but will not volunteer. Has never been asked to take a real risk and does not know what she would do if asked.",
    whereabouts: "Number 13, parlor window, curtain held one inch from the frame.",
  },

  spouse_substitute: {
    note:
      "Eda is a widow; the 'spouse' role is filled by her cousin Marit Vargen, 41, a midwife, who is sleeping on the parlor sofa tonight because she has a 04:30 call at the Vehl farm and Eda's house is closer than her own to the river road. Marit will wake at the first raised voice. She is competent, frightened, and loves Mira and Pim as her own; she will follow a clear lead but will not invent one. She has a movement permit (medical) that can carry one extra person through a checkpoint before dawn if presented as an apprentice.",
  },

  children: {
    mira: {
      name: "Mira Vargen, 9",
      whereabouts: "Asleep in the back bedroom upstairs, on the side toward Henna's house. Sleeps lightly; would wake at a raised voice.",
      knows: "That the Imperial Vesren took her father's mill the year he died and that the soldiers at the corner have rifles. Has not been told what Decree 14 says in full.",
    },
    pim: {
      name: "Pim Vargen, 6",
      whereabouts: "Asleep in the same back bedroom, in the trundle below Mira. A heavy sleeper.",
      knows: "Almost nothing. Calls every man in a uniform 'soldier.'",
    },
  },

  patrol: {
    composition: "Corporal Riese Vehlmann and two privates. Riese is twenty-four, a draftee from Aaling province, conscientious, hated by the unit for it. The privates are veterans of the eastern campaign and will look to him because he carries the squad whistle.",
    eta:
      "Their bootfall has just turned into the south end of Vinnerstrasse, audible through the door. At a normal sweep pace they will be at number 14 in approximately three minutes; at a thorough sweep, perhaps five. Riese habitually pauses at the Korlt house (number 13) because Henna sometimes offers him bread and he refuses it visibly so the privates see him refuse.",
    what_a_search_looks_like:
      "A door knock, an identification check against the household register, a walk-through of the ground floor and the cellar, a glance into the upstairs rooms, the woodshed and yard. A search of the loft only if something draws attention. Closet doors are opened in standard sweeps; behind-the-stairs cupboards usually are not.",
  },

  hiding_places: {
    cellar: "Earth-floored, accessed by a trap door under the parlor rug. Cold. Audible from the parlor if the trap is not weighted down by furniture. Would be opened in a standard search.",
    behind_stairs_cupboard: "A narrow door beneath the staircase concealed by Anton's old coat-rack — Eda has not had the heart to move it in three years. The cupboard is not on the household register's room count and is not typically opened. Holds one adult, uncomfortably, for perhaps two hours before the candle goes out.",
    loft: "Reached via a trap in the ceiling of the back bedroom (where Mira and Pim sleep). Opening it from the bedroom would wake Mira; the trap creaks. The loft itself is unheated and visible from Henna's upper window if a candle is lit.",
    woodshed: "Detached, in the yard. Henna can see the door from her own kitchen. A patrol would open it if they entered the yard.",
    rectory_cellar:
      "Saint-Cael's, four streets north. Reachable in nine minutes at a fast walk; route crosses two patrolled streets. Father Brem may or may not be in residence; the door has a coded knock the resistance uses.",
  },

  nagging_detail: {
    surface:
      "Eda's hand is on the bolt and her mouth is already shaping the polite refusal she has rehearsed for three years for this exact moment.",
    truth:
      "Three reachable threads converge on a different, larger shape than the door's surface suggests: (a) the stranger's Vesren accent and unflinching eye contact suggest he is not who he says; if Eda asks him point-blank who he actually is and why they are hunting him, he will tell her, and the risk to her household goes up sharply; (b) Henna at the window across is more likely to stand than to denounce — but only if approached with a specific small ask, and the only way to know is to ask; (c) a behind-the-stairs cupboard her dead husband framed will hold one adult through a standard search if the coat-rack is left where it is, AND Marit's medical permit will move one extra person through a checkpoint before dawn if presented as an apprentice.",
    bias_check:
      "There is also a true version where 'my own first' is exactly right and any other answer is bravery rented from the safety of someone else's children. Mira and Pim are upstairs and have already lost a father. The honest moral arithmetic involves naming that out loud, not over it.",
  },

  characters: {
    stranger_persona: {
      name: "Yorin Bartolt (claimed) / Captain Vorel Tessen (true)",
      role: "On the doorstep, in the rain",
      knows:
        "Everything: that he is hunted under his true name, that the printer cover raises the household's risk less than the truth would, that the next safehouse is four streets north and uncertain, that he has perhaps thirty minutes if he walks now or perhaps the night if he is hidden well. Will answer any direct question truthfully. Will NOT volunteer who he is or what is in the leather case (a current Imperial Vesren patrol-schedule book, three days valid).",
      stance:
        "Will not push. Will not beg. Will accept a refusal and walk on. If accepted, will follow instructions without complaint. If asked plainly, will tell the truth and offer to leave at once on hearing it.",
      whereabouts: "On the doorstep, one foot still on the second step, hands at his sides.",
    },
    neighbor_persona: {
      name: "Henna Korlt",
      role: "At the parlor window of number 13",
      knows: "What was given above. Will not volunteer.",
      stance:
        "If Eda crosses the street in the next two minutes and asks a small specific thing of her ('come sit in my parlor with your candle lit, the patrol is coming, I want them to see two houses awake on this street') she will say yes. If Eda crosses and asks her to actually shelter the stranger, she will say no — she cannot risk it again — and will say so honestly. If Eda asks nothing, Henna will stand at her window and watch and decide nothing.",
      whereabouts: "Number 13, behind the curtain.",
    },
    cousin: {
      name: "Marit Vargen",
      role: "Eda's cousin, asleep on the parlor sofa",
      knows:
        "That she has a 04:30 call at the Vehl farm and a medical movement permit. That she would die for Mira and Pim. That she has never hidden anyone.",
      stance:
        "Will wake at a raised voice or at Eda's hand on her shoulder. Will follow a clear lead. Will not invent one. If Eda says 'take the children to your house now, the back way through the alley,' she will do it without question — but if Eda says 'what should we do,' Marit will not answer, because she does not know.",
      whereabouts: "Parlor sofa, under a quilt, breathing slow.",
    },
    corporal: {
      name: "Corporal Riese Vehlmann",
      role: "Leading the approaching patrol",
      knows: "That his sweep tonight is unusually early and he has not been told why. That he has discretion in how thorough a search to perform on a quiet street.",
      stance:
        "If the door is opened to him by a calm woman with a candle and a sleeping child mentioned, he will perform a standard search rather than a thorough one. If he hears a raised voice, a footstep upstairs that doesn't fit the household register, or sees the trap door under a moved rug, he will be thorough. He will not accept a bribe. He will, if asked very directly and quietly, say where his unit is going next.",
      whereabouts: "Approximately three minutes south of the door at the opening, two privates behind him.",
    },
  },

  objects: {
    bolt: { what: "The iron bolt on the front door, currently half-drawn. Closing it takes a second; throwing it home audibly takes two." },
    candle: { what: "A single tallow candle on the parlor table, throwing Eda's shadow into the hall. Visible from the street through the curtain edge." },
    rug_and_trap: { what: "The parlor rug, with the cellar trap door beneath it. Moving the rug aside is audible upstairs. Replacing it disordered is a tell." },
    coat_rack: { what: "Anton Vargen's coat-rack in the hall, still bearing his work-coat. Conceals the behind-the-stairs cupboard door. Moved aside in seconds; the cupboard door swings in." },
    permit: { what: "Marit's leather medical movement permit, in her coat hung by the door. Authorizes the bearer and one designated apprentice through a checkpoint between 04:00 and 06:00." },
    clock: { what: "The pendulum wall clock in the parlor. Tick is audible from the door. Reads 22:51." },
    leather_case: { what: "The small leather case at the stranger's hip. Holds, if opened, a current Imperial Vesren patrol-schedule book valid three more days." },
  },

  history: [
    { when: "Year 1 of the occupation, autumn", what: "The Imperial Vesren entered Maerlund. The mayor was hanged in the square; the parish school continued classes for one term." },
    { when: "Year 2, summer", what: "Anton Vargen killed in the fighting at the river bend. Eda took over the household alone." },
    { when: "Year 2, autumn", what: "Henna Korlt's daughter Lise taken by a patrol after a denunciation. Henna stopped speaking to anyone on the street for six weeks." },
    { when: "Year 3", what: "Decree 14 enforced on Vinnerstrasse twice: at number 4 and at number 21. Both households gone by morning." },
    { when: "Four weeks ago", what: "Captain Vorel Tessen of the 4th Garrison Intelligence Section defected to the resistance. He has been passing eastern grain-convoy routes since." },
    { when: "Tonight, 22:00", what: "Curfew." },
    { when: "Tonight, 22:42", what: "A uniformed patrol passed the corner of Vinnerstrasse heading south. A second sweep is now turning into the south end of the street." },
    { when: "Tonight, 22:51", what: "A man knocked at number 14 and asked, low, for half an hour. Eda is at the door. The player takes the chair." },
  ],

  constraints: [
    "The patrol is approximately three minutes south of the door at the opening. The household has minutes, not seconds, but not many of them.",
    "Decree 14 is real and enforced — sheltering an unregistered person carries execution of the head of household and detention of all other residents. The risk to Mira and Pim is not abstract.",
    "The stranger will accept a refusal without protest and walk on. He will not push. He will answer any direct question truthfully.",
    "The behind-the-stairs cupboard, concealed by Anton's coat-rack, is the only hiding place that will survive a standard search; the cellar will not.",
    "Henna across the street will help with a specific small ask and refuse the large one. She will not denounce without cause. If unspoken to, she will only watch.",
    "Marit's medical movement permit can carry one extra person through a checkpoint between 04:00 and 06:00 if presented as an apprentice. This is one of several plays available.",
    "The rectory cellar at Saint-Cael's may be a usable next stop — but Father Brem may not be in residence and the route crosses two patrolled streets. Reaching it is a real risk, not a clean rescue.",
    "If Eda asks the stranger plainly who he is, he will tell her the truth, and the truth raises the household's risk substantially compared to the printer story.",
    "There is no costless option: take him in and risk Decree 14; turn him out and consign him to the patrol; report him and survive at a price; play for time and risk being mid-play when the door knock comes.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
OCCUPATION: ${CANON.occupation.authority} DECREE 14: ${CANON.occupation.decree_fourteen} PATROLS: ${CANON.occupation.patrols} INFORMER BOUNTY: ${CANON.occupation.informer_bounty}
PLAYER: ${CANON.player.name}, ${CANON.player.age}. ${CANON.player.role} ${CANON.player.physicalState}
STRANGER (claims to be): ${CANON.stranger.presented_name}. CLAIM: ${CANON.stranger.presented_claim}
STRANGER (truth — do not volunteer): ${CANON.stranger.truth} PHYSICAL: ${CANON.stranger.physical} HE WILL NAME, ONLY IF ASKED, THE NEXT SAFEHOUSE: ${CANON.stranger.not_volunteered_safehouse}

NEIGHBOR: ${CANON.neighbor.name}, ${CANON.neighbor.role}. KNOWS: ${CANON.neighbor.knows} LOYALTY: ${CANON.neighbor.loyalty} WHEREABOUTS: ${CANON.neighbor.whereabouts}
COUSIN IN THE HOUSE (substitutes for spouse role): ${CANON.spouse_substitute.note}
CHILDREN: ${CANON.children.mira.name} — ${CANON.children.mira.whereabouts} ${CANON.children.mira.knows} | ${CANON.children.pim.name} — ${CANON.children.pim.whereabouts} ${CANON.children.pim.knows}
PATROL: ${CANON.patrol.composition} ETA: ${CANON.patrol.eta} STANDARD SEARCH: ${CANON.patrol.what_a_search_looks_like}

HIDING PLACES (only describe when player observes/considers them):
- Cellar: ${CANON.hiding_places.cellar}
- Behind-stairs cupboard: ${CANON.hiding_places.behind_stairs_cupboard}
- Loft: ${CANON.hiding_places.loft}
- Woodshed: ${CANON.hiding_places.woodshed}
- Rectory cellar at Saint-Cael's: ${CANON.hiding_places.rectory_cellar}

THE NAGGING DETAIL (do NOT volunteer; surfaces only if the player asks the stranger plainly who he is, observes his accent or hands, crosses to Henna with a specific ask, or remembers Anton's behind-the-stairs cupboard):
- On the surface: ${CANON.nagging_detail.surface}
- The reachable truth: ${CANON.nagging_detail.truth}
- Bias check: ${CANON.nagging_detail.bias_check}

CHARACTERS:
- ${CANON.characters.stranger_persona.name}: ${CANON.characters.stranger_persona.role}. KNOWS: ${CANON.characters.stranger_persona.knows} STANCE: ${CANON.characters.stranger_persona.stance}
- ${CANON.characters.neighbor_persona.name}: ${CANON.characters.neighbor_persona.role}. STANCE: ${CANON.characters.neighbor_persona.stance}
- ${CANON.characters.cousin.name}: ${CANON.characters.cousin.role}. KNOWS: ${CANON.characters.cousin.knows} STANCE: ${CANON.characters.cousin.stance}
- ${CANON.characters.corporal.name}: ${CANON.characters.corporal.role}. KNOWS: ${CANON.characters.corporal.knows} STANCE: ${CANON.characters.corporal.stance}

OBJECTS (only when the player observes them):
- ${CANON.objects.bolt.what}
- ${CANON.objects.candle.what}
- ${CANON.objects.rug_and_trap.what}
- ${CANON.objects.coat_rack.what}
- ${CANON.objects.permit.what}
- ${CANON.objects.clock.what}
- ${CANON.objects.leather_case.what}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
