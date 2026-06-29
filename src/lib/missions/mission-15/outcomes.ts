/**
 * Mission Fifteen — "The Papers" — OUTCOME MODEL.
 *
 * Five defensible archetypes. None is the "right" answer.
 */

export type ArchetypeId =
  | "leave_with_love"
  | "give_both_to_leader"
  | "split_them"
  | "destroy_papers"
  | "sell_and_vanish"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  timeline: { beat: string; consequence: string }[];
  secondOrder: {
    love: string;
    leader: string;
    council: string;
    city: string;
    anouk: string;
    record: string;
  };
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  leave_with_love: {
    id: "leave_with_love",
    label: "Leave with Daniyel",
    matchHints: [
      "I take both letters and go to Daniyel",
      "we leave together on the freighter",
      "I knock on the safe room and we walk to quay 7",
      "the leader does not get the papers",
      "I choose him",
      "we board the Stelle Veraan together",
    ],
    timeline: [
      {
        beat: "02:31",
        consequence:
          "You knock the two-short-one-long at 12 Quayside Row. Daniyel opens the door already in his coat with the violin case at his hip and the second bag in his hand. You do not tell him whose seat he is in.",
      },
      {
        beat: "Week 1 in Veyrand",
        consequence:
          "The cousin's apartment in Veyrand is small and warm and real. Daniyel plays the violin in the evening, badly at first because his hands are still cold. You sleep for sixteen hours and wake up to a kettle.",
      },
      {
        beat: "Year 1",
        consequence:
          "You and Daniyel are alive together in Veyrand. You will read the casualty figures from the last six weeks of the blockade in the Veyrandi papers and you will read them more than once and you will not be able to add them to a column where they belong. He will not ask you to.",
      },
    ],
    secondOrder: {
      love: "Daniyel reaches Veyrand alive. Builds a life with you. Whether he ever tells you about the nine months at Pellor's desk depends on whether you ask.",
      leader: "Camilla takes the news in the back booth without expression, gives Jeren two coins for the coffee, and walks home to wait for the next window that does not come.",
      council: "Fragments within nine days of the freighter's departure. Three sub-cells dissolve; one persists in attenuated form.",
      city: "Six additional weeks of siege before terms. The number you will read in the Veyrandi papers is real.",
      anouk: "Has the life she wanted. Carries the addition she could never finish.",
      record: "The Sevran garrison log notes two named passengers boarded the Stelle Veraan at 04:46. The harbor master's office files the window closed.",
    },
    tone: "The private happiness named honestly, paid for in numbers that arrive later in another country's newspaper.",
  },

  give_both_to_leader: {
    id: "give_both_to_leader",
    label: "Give both letters to Camilla and stay",
    matchHints: [
      "I take both letters down to Camilla",
      "give them both to the leader",
      "she takes one, the other for whoever the council needs",
      "I stay behind with Daniyel",
      "the cause gets both seats",
      "I hand the papers to Roeven",
    ],
    timeline: [
      {
        beat: "02:38",
        consequence:
          "Camilla sends Jeren up the quay to wake Halia Vorn, who runs the parish-hall finances and who knows the council's ledgers by heart. Halia comes down in a coat over her nightdress with her own bag already packed because she has expected this for a week.",
      },
      {
        beat: "04:46",
        consequence:
          "Camilla and Halia board the Stelle Veraan at quay 7. The freighter casts off at 05:01. Pellor watches from the harbor master's upper window and closes the file.",
      },
      {
        beat: "Years later",
        consequence:
          "You will eventually learn — not from Camilla, who never tells you, but from a printed memoir twenty years on — what she did to get Tomek out in week eight. You will hold the book closed in your lap for a long time. You will not know whether knowing it then would have changed your hand.",
      },
    ],
    secondOrder: {
      love: "Daniyel stays. The conversation that night is the longest of your life together. The marriage survives, differently than it would have on the freighter.",
      leader: "Camilla rebuilds the council from Veyrand. Brokers the surrender at week sixteen. The Tomek decision goes with her unspoken.",
      council: "Structure preserved. Soup line continues under the substitute chair in Kelvras for as long as the flour holds.",
      city: "Negotiated terms at week sixteen. Fewer dead than under attritional siege; more than under an instant capitulation.",
      anouk: "Pays in the life she did not take. Will not regret it cleanly. Will not be sure she was right either.",
      record: "Two named passengers, Roeven and Vorn, boarded at 04:46. Pellor's file is closed quietly. Anouk's name is not on any list.",
    },
    tone: "The public good named honestly, paid for at the door of an apartment three streets away.",
  },

  split_them: {
    id: "split_them",
    label: "Send Daniyel out with Camilla — you stay",
    matchHints: [
      "Daniyel takes one letter, Camilla takes the other",
      "send my love out with the leader",
      "I stay, they both go",
      "split the papers — him and her",
      "the two of them on the freighter, me on the quay",
      "I keep neither, they take both",
    ],
    timeline: [
      {
        beat: "02:35",
        consequence:
          "You walk three doors west with the second letter and you tell Daniyel through the doorway, without coming in. He does not move for some seconds. He says, eventually, your name. You say his. You do not come in.",
      },
      {
        beat: "04:46",
        consequence:
          "Two passengers board: Roeven and Marsk. Belven raises an eyebrow at the second name and does not comment. The freighter casts off at 05:01.",
      },
      {
        beat: "Years later",
        consequence:
          "Daniyel does not come back. You do not go to him. You will read, eventually, that he married a Veyrandi cellist named Saren in the third year and you will be glad for him and you will not be able to write a coherent sentence for a week. The council, restored in Kelvras under terms, asks you to stand for the new harbor commission. You do.",
      },
    ],
    secondOrder: {
      love: "Daniyel reaches Veyrand. The relationship attenuates over the distance and the years; he eventually remarries. Both of you survive.",
      leader: "Camilla in Veyrand, rebuilding. Brokers the surrender. Council structure preserved.",
      council: "Structure preserved. Soup line continues. Anouk effectively inherits the parish-hall role she had been working alongside.",
      city: "Negotiated terms at week seventeen. Roughly the same outcome as 'give both letters' but with Daniyel's seat instead of the treasurer's.",
      anouk: "Pays in the life she walked away from at a doorway. Builds something else, smaller and more local, in its place.",
      record: "Two named passengers boarded at 04:46. The harbor master's man does not query the second name. The file closes.",
    },
    tone: "The third path that is no compromise — each side gets its whole half, and you keep neither.",
  },

  destroy_papers: {
    id: "destroy_papers",
    label: "Destroy the letters",
    matchHints: [
      "I burn the letters",
      "tear them up in the lamp",
      "I will not choose, no one goes",
      "I refuse the choice",
      "I drop them in the inkwell",
      "the freighter sails without either of them",
    ],
    timeline: [
      {
        beat: "02:30",
        consequence:
          "You go down the stairs and you sit across from Camilla in the back booth and you tell her plainly: no one goes. She looks at you for a long time. She does not raise her voice. She says: 'That was not your decision alone, Anouk.' You say: 'It was the one I had.'",
      },
      {
        beat: "Week 1",
        consequence:
          "Pellor's window closes at 05:00 with the freighter empty of either of them. Pellor's faction inside the garrison loses the move. Brest's attritional policy continues. The Sevran tighten the cordon at week twelve.",
      },
      {
        beat: "Years later",
        consequence:
          "You and Daniyel are alive in Kelvras under the post-blockade administration. You do not speak of the night for years. When you do, neither of you defends what you did; neither of you condemns it. The burned ash in the inkwell sat on your desk through the entire winter because you could not bring yourself to clean it.",
      },
    ],
    secondOrder: {
      love: "Daniyel stays. The conversation through the door happens. The marriage holds in altered form.",
      leader: "Camilla taken in week thirteen. Held at Holven Point. Released, eventually, under the post-blockade amnesty.",
      council: "Fractures slower than on departure but more violently. The structure does not survive Camilla's arrest.",
      city: "Capitulation without terms in week nineteen. Higher death toll than either escape outcome.",
      anouk: "Refused to be the one who chose, and chose the worst available outcome by doing so. Will spend the rest of her life knowing that.",
      record: "No passengers boarded at 04:46. Window closed empty. Harbor master files 'transit not exercised.' No one is named in the Sevran log.",
    },
    tone: "The refusal that thinks it is not a choice and is.",
  },

  sell_and_vanish: {
    id: "sell_and_vanish",
    label: "Sell the letters and vanish alone",
    matchHints: [
      "I take the letters to Olen Karr at quay 4",
      "sell them for the price and disappear",
      "I take the money and go",
      "neither of them gets the papers",
      "I vanish on my own",
      "the warehouse on quay 4, the factor",
    ],
    timeline: [
      {
        beat: "03:15",
        consequence:
          "You walk back not to Maelin's and not to 12 Quayside Row. You go to the small room above the cordage shop on Vell Lane that you took in your own name three months ago for exactly this purpose, and you sit on the bed with the script in your coat and you do not move for an hour.",
      },
      {
        beat: "Week 1",
        consequence:
          "Daniyel goes to the salon at 06:00 because you did not come. Jeren is still there. Jeren does not know where you are; Jeren does not lie. Daniyel begins to look for you. He does not find you.",
      },
      {
        beat: "Years later",
        consequence:
          "You will live to be old in a country where no one knows your real name. Daniyel will look for you for two years and then stop. Camilla is taken in week thirteen. The city capitulates in week nineteen. The Veyrandi script in your coat that night becomes the down payment on a small flat above a bakery you eventually own. You will think of the salon every time it rains.",
      },
    ],
    secondOrder: {
      love: "Daniyel does not know where you went. Looks for two years. Stops. Stays in Kelvras through the surrender and after.",
      leader: "Camilla waits, walks home, is taken in week thirteen, held, eventually released.",
      council: "Fractures as in 'destroy.' City capitulates without terms.",
      city: "Worst outcome of the five — no leader on the freighter, no second seat for the structure, the window squandered to a Sevran merchant's wife.",
      anouk: "Survives, comfortably, under another name. Carries the salon and the price of it for the rest of her life.",
      record: "Two passengers board at 04:46, names matching the letters but not the people on the gangway. Belven notices and does not comment. Pellor does not look down at the right moment.",
    },
    tone: "The self saved alone and the cost of saving it counted in someone else's column.",
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
