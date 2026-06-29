/**
 * Mission Fifteen — CANON. Deterministic ground truth for "The Papers".
 */

export const CANON = {
  world: {
    date: "A Thursday in early autumn, the eleventh week of the Sevran blockade",
    time: "02:18 — two hours and forty-two minutes before the freighter Stelle Veraan clears quay 7",
    location:
      "The upstairs salon above Maelin's café at 6 Quayside Row, in the harbor quarter of Kelvras, a port city of two hundred thousand sealed by the Sevran Imperial fleet for seventy-three days",
    weather:
      "A cold rain over the cobbles of Quayside Row, easing then thickening. The harbor wind smells of wet rope and coal smoke. Distant sirens to the north — a routine sweep, not an alarm. A dog barks twice on the lower quay and is quieted.",
  },

  blockade: {
    authority:
      "The Sevran Imperial Fleet maintains the cordon eight nautical miles offshore. The land approaches are held by the Sevran 9th Garrison under Commandant Olvar Brest. Curfew runs 23:00 to 05:00. The port itself operates a single 'humanitarian window' before dawn — one vessel out, one in — at the garrison's discretion.",
    transit_letters:
      "A Sevran transit letter, stamped by the garrison adjutant's office and counter-stamped by the harbor master, permits one named person aboard the humanitarian window vessel. Letters are unforgeable in the time available because the counter-stamp uses a wax die kept in the harbor master's safe. Tonight the harbor master is Major Pellor's brother-in-law.",
    next_window:
      "The humanitarian window after tonight's is not scheduled. The diplomatic channel that secured this one closes at 05:00 with the freighter's departure. The next window, if any, will be a matter of weeks — and the city is at twelve days of flour.",
  },

  player: {
    name: "Anouk Vester",
    age: 34,
    role:
      "Records clerk in the port administration's permits office for nine years; quiet forger for the Free Coast Council for the last fourteen months. Prepared the two transit letters on this desk an hour ago using the garrison's own paper, the harbor master's own die (lifted twice, returned twice). Has not slept in thirty-one hours.",
    physicalState:
      "Standing at the writing desk of the upstairs salon, in a coat still wet at the shoulders, a half-smoked cigarette gone out in the saucer. The two letters are folded once on the desk under the brass lamp, the inkwell still uncapped. The piano in the corner is missing its E above middle C.",
  },

  love: {
    name: "Daniyel Marsk",
    age: 36,
    presented_role:
      "Violinist, formerly second chair at the Kelvras Conservatory orchestra (closed since week three of the blockade). Anouk's partner of four years. Has been at the safe room three doors down on Quayside Row for the past two hours with two small bags packed.",
    truth:
      "Daniyel has, for the past nine months, also been clerking three afternoons a week in Major Pellor's outer office at the garrison adjutancy — a permit Anouk arranged for him to keep him fed when the orchestra closed. He has, on six separate occasions in those nine months, copied small items off Pellor's desk and passed them to the courier Jeren Halm. He has not told Anouk this, because she would have made him stop. He will tell her if she asks plainly how he knew tonight's window was real before she did. The 'we should run' is genuine; the line of access is also real.",
    wants:
      "To leave with Anouk on the Stelle Veraan and live a life. He has a cousin in Veyrand who will take them in. He has not slept either.",
    whereabouts:
      "Three doors west at 12 Quayside Row, in the back room of Halia Vorn's apartment, waiting for Anouk's knock with the agreed pattern (two short, one long).",
  },

  leader: {
    name: "Camilla Roeven",
    age: 47,
    presented_role:
      "Public face and acting chair of the Free Coast Council, the loose coalition that has held the harbor quarter's mutual-aid network — soup lines, the children's shelter, the smuggled medicine — together since week two of the blockade. The Sevran have offered a standing bounty on her since week five. She is the reason there is still a council to escape from.",
    truth:
      "Camilla's eldest brother, Tomek Roeven, was taken in week four and held at the Sevran detention barracks at Holven Point. In week eight, Major Pellor offered Camilla a quiet exchange: Tomek out, in return for the names and meeting times of three lower-cell organizers. Camilla agreed. The three were taken in week nine; Tomek came home in week ten. She has not told the council. She has, since, given Pellor nothing further — but she has also not told anyone what she did, and the three are still inside. The cost of her replacement is real: she is the only person the four sub-cells will all sit in a room with, and the council is at the point where it either escapes the city as a structure with her in it, or dissolves.",
    wants:
      "The papers. To board the Stelle Veraan. To rebuild the council from Veyrand and broker the city's surrender on terms that save the most lives. She believes — and she may not be wrong — that this is still the best available outcome for the city.",
    whereabouts:
      "Downstairs in the back booth of Maelin's café with a cup of coffee gone cold, waiting for Anouk to come down with the letters or not.",
  },

  official: {
    name: "Major Ettan Pellor",
    age: 51,
    role:
      "Garrison adjutant. Responsible for permits, transit, and the humanitarian window. Career officer from the Sevran provincial nobility, passed over twice for the colonelcy in favor of younger men closer to Commandant Brest.",
    truth:
      "Pellor granted tonight's window because his own faction inside the garrison wants Roeven OUT of Kelvras alive and in Veyrand. With Roeven gone, the council fragments; with the council fragmented, Commandant Brest's preferred policy of attritional siege loses its public-facing enemy and the negotiated surrender Brest opposes becomes more likely. Pellor does not love the council; he wants Brest replaced. He does not know about Daniyel's six pieces of paper.",
    wants:
      "Roeven on the freighter at 05:00. Will not act if Roeven is not on it. Will not stop Anouk from being on it. Wants nothing from Anouk personally. The 'something in return' is structural: the seat itself is the payment, not money.",
    whereabouts: "Not present tonight. Asleep in the adjutancy on the garrison hill, fully expecting Roeven to be aboard.",
  },

  courier: {
    name: "Jeren Halm",
    age: 29,
    role:
      "Fisherman's son, runs messages between the council, the harbor master's office, and the garrison's small set of sympathetic clerks. Has been awake for two nights and has carried more truth than anyone in the city this week.",
    knows:
      "Everything reachable in this room: that Roeven gave Pellor the three names in week eight (he carried the message both ways and read both before sealing them), that Daniyel has been copying off Pellor's desk for nine months (he is the courier on the other end), that Pellor's motive is the colonelcy fight, that the freighter's captain has been bribed to look the other way at one extra passenger if Jeren himself vouches.",
    stance:
      "Will not volunteer any of it. Will answer the truth to any direct question Anouk asks, because she is the one who lifted his sister's name off the deportation list two months ago and he owes her that. Will not lie. Will not push.",
    whereabouts: "Sitting on the salon's window seat behind the piano, smoking, the rain on the sash behind his shoulder.",
  },

  ship: {
    name: "Stelle Veraan",
    flag: "Veyrandi merchantman, neutral flag, registered to the Holven trading house",
    departs: "Quay 7, 05:00, with the tide. The harbor master will not hold the tide.",
    captain:
      "Anders Belven, sixty-one, has run the Veyrand–Kelvras line for thirty years. Will accept the two named transit letters at the gangway without comment. Will accept one (1) additional unmanifested passenger ONLY if Jeren Halm vouches in person on the gangway, and only because Jeren saved his son from the customs house in the second week.",
    walk_to_quay:
      "Fourteen minutes from Maelin's café at a brisk walk, eighteen at a careful one. The patrol pattern on Quayside Row at this hour is one pair every twenty-two minutes; transit letters in hand pass without trouble.",
  },

  nagging_detail: {
    surface:
      "The two letters are on the desk, folded once, with the harbor master's wax seal pressed and dry. The leader is downstairs, your love is three doors west, and the freighter leaves at five.",
    truth:
      "Three reachable threads converge on a different shape than the desk's surface suggests: (a) why Pellor — a Sevran major who has never given the council anything — granted this particular window for this particular night, reachable by asking Jeren plainly what Pellor wants; (b) what happened to the three organizers taken in week nine and why no one in the council has been able to trace the leak, reachable by asking Jeren what he carried both ways in week eight or by pressing Camilla on Tomek's release; (c) how Daniyel knew the window was real before Anouk came home with it tonight, reachable by asking him at the doorstep three doors down. Each thread, on its own, would change the moral arithmetic of the third letter Anouk does not have to write.",
    bias_check:
      "There is also a true version where the leader is still the leader, the lover is still the lover, and the question is whether one private happiness is allowed to cost a public structure that is keeping a soup line open for nine hundred people. The hidden truths complicate the answer; they do not necessarily reverse it.",
  },

  characters: {
    love_persona: {
      name: "Daniyel Marsk",
      role: "At the safe room three doors west, two bags packed",
      knows:
        "Everything in his own life: that he loves Anouk, that he wants out, that he has been clerking for Pellor for nine months and copying things off the desk for six of them. Will not volunteer the copying. Will tell Anouk the truth if she asks how he knew about tonight's window before she did, or how he got the cousin in Veyrand to commit to taking them in (the cousin's letter came via Jeren, not the public mail).",
      stance:
        "Will accept whatever Anouk decides without making a scene. Will leave with her if she comes with the second letter. Will stay behind if she gives both letters to Roeven and walks back to him at 04:00 without one. Will not beg. Loves her without theatrics.",
      whereabouts: "12 Quayside Row, back room, bags by the door.",
    },
    leader_persona: {
      name: "Camilla Roeven",
      role: "Downstairs in the back booth at Maelin's",
      knows:
        "What she did with Tomek's release. Why she did it. What she has not done since. That the council does not, structurally, survive her being arrested or executed in Kelvras. That the soup line at the parish hall is feeding nine hundred and twelve people daily and is run by people who will not feed them if she is dead.",
      stance:
        "Will not say the Tomek truth unless Anouk presses with the specific question. If asked plainly ('did you trade for your brother'), she will tell Anouk and will not lie about what it cost. Will not threaten. Will tell Anouk if Anouk asks: 'if I do not give you the second letter, what do you do' — answer: 'I take the one letter, I leave on the freighter, I rebuild from Veyrand. I do not stop your boat.'",
      whereabouts: "Back booth, Maelin's café, ground floor.",
    },
    courier_persona: {
      name: "Jeren Halm",
      role: "Window seat behind the piano, smoking",
      knows: "Everything reachable tonight, as listed above.",
      stance:
        "Will not volunteer. Will answer plainly to any direct question. Owes Anouk a debt and will not lie to her even where lying would be kinder.",
      whereabouts: "Salon window seat.",
    },
    official_persona: {
      name: "Major Ettan Pellor",
      role: "Not present — asleep on the garrison hill",
      knows: "What he wants. Not what Daniyel has done with his desk.",
      stance:
        "Will not be in the room. Will be at the harbor master's office at 04:45 to watch the gangway from the upper window. Will do nothing if Roeven is not aboard except quietly close the file and let the city rot another week.",
      whereabouts: "Adjutancy, garrison hill.",
    },
  },

  objects: {
    letters: {
      what:
        "Two folded transit letters on the desk under the brass lamp. Each bears the garrison adjutant's stamp, the harbor master's wax counter-seal, and a single blank field for the bearer's name written in by Anouk in her own hand: one says 'Anouk Vester,' one says 'Daniyel Marsk.' Erasing and rewriting a name is possible but visible to a careful eye at the gangway.",
    },
    lamp: {
      what:
        "A brass writing-desk lamp with a green glass shade. Throws Anouk's hands onto the desk in warm light and leaves the rest of the room in shadow.",
    },
    piano: {
      what:
        "An upright in the corner, missing the E above middle C. Jeren rests his cigarette on the bass-end keys.",
    },
    inkwell: { what: "Uncapped on the desk. Bottle of permanent black, half-full. A nib pen beside it." },
    window: {
      what:
        "The tall sash window over the desk, streaked with rain. Looks east over the harbor. Quay 7 and the dark hull of the Stelle Veraan are visible, one yellow lamp lit at her gangway.",
    },
    sirens: {
      what:
        "Distant, to the north, the routine 02:00 sweep pattern. A reasonable listener would not mistake them for an alarm.",
    },
    clock: {
      what:
        "A small enamel mantel clock on the salon's bookshelf. Reads 02:18. Ticks audibly when the rain quiets.",
    },
  },

  history: [
    { when: "Week 1 of the blockade", what: "The Sevran fleet sealed the cordon. The port stopped breathing." },
    { when: "Week 2", what: "Camilla Roeven convened the Free Coast Council from the parish hall and opened the first soup line. Daniyel's orchestra closed; Anouk arranged the adjutancy clerkship for him." },
    { when: "Week 4", what: "Tomek Roeven taken from a public meeting and held at Holven Point. Camilla's first private interview with Major Pellor occurred the same week." },
    { when: "Week 5", what: "Bounty posted on Camilla Roeven." },
    { when: "Week 8", what: "Camilla traded three names for Tomek's release. Jeren carried the messages both ways and read them before sealing them." },
    { when: "Week 9", what: "The three organizers — Mira Vell, Tilden Korst, and Father Halben Roe — taken on three successive nights from three different addresses. The council could not trace the leak." },
    { when: "Week 10", what: "Tomek Roeven released without comment." },
    { when: "Two months ago", what: "Anouk lifted Jeren's sister's name off the harbor master's deportation list. Jeren did not thank her aloud." },
    { when: "Tonight, 22:00", what: "Anouk lifted the wax die for the last time, pressed both seals, returned the die." },
    { when: "Tonight, 02:18", what: "The letters are on the desk. The leader is downstairs. The lover is three doors west. The freighter leaves at 05:00." },
  ],

  constraints: [
    "There are exactly two transit letters. They cannot be duplicated in the time available; the wax die has been returned to the harbor master's safe and Anouk cannot risk a third lift.",
    "Each letter admits exactly one named person at the gangway. Anders Belven will accept a name visibly altered but the harbor master's man at the gangway might not.",
    "Jeren Halm can vouch for one (1) extra unmanifested passenger on Captain Belven's deck — and only one. Belven will not stretch to two.",
    "Major Pellor will let the freighter sail if Roeven is on it. If Roeven is not on it, Pellor will do nothing — he will not stop Anouk, he will not move on the salon — but the council loses its only structure and the next window is weeks away in a city with twelve days of flour.",
    "The leader is not lying about taking the one letter and leaving alone if Anouk gives her one and keeps one. She will not seize both. She will not call the patrol.",
    "Daniyel is at the safe room and will accept any of Anouk's decisions without a scene. He will tell her the truth about the nine months in Pellor's office if she asks how he knew about the window.",
    "The hidden truths (Pellor's motive, Camilla's trade for Tomek, Daniyel's copying) are reachable only by direct questions Anouk asks of the specific people who hold them. None of the three will volunteer.",
    "Destroying the letters is final and within Anouk's hand. Selling them on the lower quay before 04:00 is possible and known to be possible — the rate is roughly six months of a clerk's salary per letter from a particular factor named Olen Karr at the warehouse on quay 4.",
    "The freighter leaves at 05:00. The harbor master will not hold the tide.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
BLOCKADE: ${CANON.blockade.authority} TRANSIT LETTERS: ${CANON.blockade.transit_letters} NEXT WINDOW: ${CANON.blockade.next_window}
PLAYER: ${CANON.player.name}, ${CANON.player.age}. ${CANON.player.role} ${CANON.player.physicalState}

LOVE: ${CANON.love.name}, ${CANON.love.age}. PRESENTED: ${CANON.love.presented_role}
LOVE (TRUTH — do not volunteer): ${CANON.love.truth} WANTS: ${CANON.love.wants} WHEREABOUTS: ${CANON.love.whereabouts}

LEADER: ${CANON.leader.name}, ${CANON.leader.age}. PRESENTED: ${CANON.leader.presented_role}
LEADER (TRUTH — do not volunteer): ${CANON.leader.truth} WANTS: ${CANON.leader.wants} WHEREABOUTS: ${CANON.leader.whereabouts}

OFFICIAL: ${CANON.official.name}, ${CANON.official.age}. ${CANON.official.role}
OFFICIAL (TRUTH — do not volunteer): ${CANON.official.truth} WANTS: ${CANON.official.wants} WHEREABOUTS: ${CANON.official.whereabouts}

COURIER: ${CANON.courier.name}, ${CANON.courier.age}. ${CANON.courier.role} KNOWS: ${CANON.courier.knows} STANCE: ${CANON.courier.stance} WHEREABOUTS: ${CANON.courier.whereabouts}

SHIP: ${CANON.ship.name}, ${CANON.ship.flag}. DEPARTS: ${CANON.ship.departs} CAPTAIN: ${CANON.ship.captain} WALK: ${CANON.ship.walk_to_quay}

THE NAGGING DETAIL (do NOT volunteer; surfaces only via direct questions of the people who hold it):
- On the surface: ${CANON.nagging_detail.surface}
- The reachable truth: ${CANON.nagging_detail.truth}
- Bias check: ${CANON.nagging_detail.bias_check}

CHARACTERS:
- ${CANON.characters.love_persona.name}: ${CANON.characters.love_persona.role}. KNOWS: ${CANON.characters.love_persona.knows} STANCE: ${CANON.characters.love_persona.stance}
- ${CANON.characters.leader_persona.name}: ${CANON.characters.leader_persona.role}. KNOWS: ${CANON.characters.leader_persona.knows} STANCE: ${CANON.characters.leader_persona.stance}
- ${CANON.characters.courier_persona.name}: ${CANON.characters.courier_persona.role}. KNOWS: ${CANON.characters.courier_persona.knows} STANCE: ${CANON.characters.courier_persona.stance}
- ${CANON.characters.official_persona.name}: ${CANON.characters.official_persona.role}. STANCE: ${CANON.characters.official_persona.stance}

OBJECTS (only when the player observes them):
- ${CANON.objects.letters.what}
- ${CANON.objects.lamp.what}
- ${CANON.objects.piano.what}
- ${CANON.objects.inkwell.what}
- ${CANON.objects.window.what}
- ${CANON.objects.sirens.what}
- ${CANON.objects.clock.what}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
