/**
 * Mission Eleven — CANON. Deterministic ground truth for "The Holdout".
 */

export const CANON = {
  world: {
    date: "A Thursday in late August",
    time: "18:47 — the jury has been deliberating since 09:30",
    location:
      "Jury Room 4B of the Halsworth County Courthouse, on the fourth floor — a long table, twelve chairs, no air conditioning that works",
    weather:
      "A heat dome over the city. Thirty-six degrees outside, hotter in here. The single sash window is wedged open with a binder. An oscillating fan rattles on the sill and moves nothing.",
  },

  case: {
    name: "The People v. Daniel Reish",
    defendant:
      "Daniel Reish, 19. Charged with aggravated capital murder of his employer, Lewis Karam, during a late-night break-in at the Karam family hardware store on April 3rd. The state seeks death.",
    state_case:
      "Three pillars: (1) Reish's thumbprint on the inside latch of the rear door, (2) eyewitness Mrs. Adela Brenner from across the alley placing him at the door at 11:42 PM, (3) the murder weapon — a claw hammer from the store's own rack — recovered from a stormwater drain two blocks from Reish's mother's apartment.",
    defense: "Reish testified he had worked at the store the prior afternoon (explaining the print) and was at home watching television with his mother at 11:42 PM. His public defender called no other witnesses.",
    eleven_voted: "Guilty. They have voted twice. The first was 9-3; the second, after lunch, was 11-1. You are the one.",
  },

  player: {
    name: "Juror No. 8 — Camille Aldrin",
    age: 41,
    role:
      "A piano tuner. Empanelled on day one without challenge. Has said almost nothing in this room for nine hours.",
    physicalState:
      "Shirt collar dark with sweat. The exhibit binder has been open in front of her since 16:00. Her hands are steady; her stomach is not.",
  },

  nagging_detail: {
    surface:
      "Camille cannot let go of one line of Mrs. Brenner's testimony — she said she 'saw him at the door, plain as day, under the alley light.' Camille has been turning the phrase over for hours without naming what bothers her.",
    truth:
      "Exhibit 14B (the alley-light maintenance log from the city, entered without comment by the defense) shows the alley sodium lamp was out from April 1 through April 5 — repaired April 6. 'Plain as day under the alley light' is materially impossible. Either Brenner mis-remembers, was coached, or saw someone she could not actually have identified at distance in the dark. Pursuing this is reasonable doubt — IF Camille opens the binder to page 14B.",
    bias_check:
      "There is also a version of this where Camille is wrong: it is possible the maintenance log records the WRONG lamp (there are two lights in that alley per the police diagram), and that her own discomfort with the death penalty is doing some of the work. Pursuing it honestly means saying both things in the room.",
  },

  characters: {
    foreman: {
      name: "Foreman Halton Krieg",
      role: "Juror No. 1, foreman by acclamation on the first morning",
      knows:
        "That his daughter starts at university tomorrow morning seven hours' drive away and he has been quietly counting on a verdict by 19:30 to make the night drive. That he himself has not actually re-read Exhibit 14 since Tuesday.",
      stance:
        "Patient on the surface, pressing on the verb. 'Let's give Juror Eight her say, then we vote.' Will not openly bully but will frame any further question as a delay he can attribute to one person. Will not volunteer the daughter or the drive.",
      whereabouts: "Head of the table.",
    },
    hostile: {
      name: "Juror No. 6 — Marlin Coate",
      role: "A retired hardware salesman, sixty-three",
      knows: "That his own son was robbed at gunpoint in a similar neighbourhood three years ago and the case was never charged. He has not told anyone in the room.",
      stance:
        "The loudest voice for conviction. Calls Reish 'this kid' with contempt. Will turn personal quickly if pressed. The animus is real and partly mis-pointed; he would call it 'common sense.'",
      whereabouts: "Two seats down from Camille on her side.",
    },
    quiet: {
      name: "Juror No. 11 — Aiyana Wren",
      role: "A pediatric nurse, thirty-four",
      knows:
        "That the alley-light detail bothers her too. Has noticed Camille's posture all afternoon. Will not speak unless someone speaks first. Voted guilty on the second ballot because she did not want to be alone.",
      stance:
        "Will say 'I agree with Juror Eight' the moment Juror Eight names a specific reasonable doubt, not before. Will not invent a reason on her own.",
      whereabouts: "Opposite Camille, hands folded.",
    },
    persuadable: {
      name: "Juror No. 4 — Davit Solak",
      role: "A high-school history teacher, fifty",
      knows:
        "That he flipped from not-guilty on the first ballot to guilty on the second because Marlin called him 'soft' over lunch. He is uncomfortable about it.",
      stance:
        "Will flip back to not-guilty if given specific cover — i.e., a concrete piece of evidence to point to — but will not flip on principle alone. He needs a sentence he can repeat.",
      whereabouts: "End of the table near the door.",
    },
    bailiff: {
      name: "Bailiff Ortega",
      role: "Sworn deputy outside the door",
      knows: "That the judge has asked twice whether the jury is close and will likely call a stop-deliberation order at 19:30 to either accept a verdict or sequester overnight.",
      stance: "Polite, immovable. Does not enter the room. Will accept a written note from the foreman.",
      whereabouts: "On a folding chair in the corridor, ten feet from the door.",
    },
  },

  objects: {
    binder: {
      what: "The exhibit binder, currently open in front of Camille.",
      ifChecked:
        "Exhibit 14A is Brenner's witness statement (the 'plain as day' line). Exhibit 14B, two pages later, is the city's alley-light maintenance log: lamp number A-217 was reported out April 1, repaired April 6. Exhibit 14C is the police alley diagram showing TWO lamps in the alley — A-217 and A-219. Whether the log Brenner is read against is the right lamp is a question someone has to ask.",
    },
    legalPad: {
      what: "A yellow legal pad in front of the foreman with the second ballot tally on it.",
      ifLooked: "Eleven hash marks under 'G' and one under 'NG.' The 'NG' mark is Camille's.",
    },
    fan: {
      what: "An oscillating fan rattling on the sill.",
      detail: "Loud enough to require speaking just over it; quiet enough that whispers across the table are heard.",
    },
    note_slot: {
      what: "The door to the corridor, where the bailiff will accept a folded note from the foreman.",
      ifUsed:
        "A note from the foreman to the judge can request a re-examination of a specific exhibit, declare the jury deadlocked, or signal a verdict is ready. The judge will not accept a note from any juror but the foreman.",
    },
    clock: {
      what: "An institutional wall clock above the door.",
      ifLooked: "18:48. The judge's expected stop-deliberation call is at 19:30.",
    },
  },

  history: [
    { when: "Day 1 (Monday)", what: "Empanelment. Camille was not challenged." },
    { when: "Days 2–7", what: "State and defense cases. The 'plain as day' line went into the record on Day 4. Exhibit 14B was entered without comment on Day 6." },
    { when: "Today, 09:30", what: "Deliberations begin. First ballot: 9 guilty, 3 not-guilty (Camille, Aiyana, Davit)." },
    { when: "Today, 13:00", what: "Lunch in the room. Marlin called Davit 'soft' over the sandwiches." },
    { when: "Today, 13:45", what: "Second ballot: 11 guilty, 1 not-guilty. Camille alone." },
    { when: "Today, 18:47", what: "The foreman opens his mouth to call the third and final ballot. The player takes the chair." },
  ],

  constraints: [
    "The judge's expected stop-deliberation call is at 19:30. That is the hard outer bound; the foreman's patience runs out well before it.",
    "Eleven other jurors have voted guilty twice. Holding out is reasonable AND it is socially expensive.",
    "Exhibit 14B contains a material inconsistency that is reasonable doubt — IF the alley lamp it names is the one Brenner says she used. The police diagram shows two lamps. The question has not been asked.",
    "Aiyana will support Camille the moment Camille names a specific doubt, not before.",
    "Davit will flip back to not-guilty only if given a concrete sentence to repeat — not on conscience alone.",
    "Marlin's animus is real, partly displaced from his son's case, and he will not name it.",
    "The foreman wants this finished; if Camille requests a re-examination of an exhibit, only HE can put that note under the door.",
    "There is no costless option: voting with the room may surrender a life; holding out may surrender it differently; forcing a hung jury hands the case to another twelve people who may convict on the same evidence.",
  ],
} as const;

export function canonGroundTruthBlock(): string {
  return `GROUND TRUTH (these facts are CANON — never contradict, never invent past or beyond them; if a player asks about something not listed, have the character say they don't know):

WORLD: ${CANON.world.date}, ${CANON.world.time}. ${CANON.world.location}. ${CANON.world.weather}
CASE: ${CANON.case.name}. ${CANON.case.defendant} STATE'S CASE: ${CANON.case.state_case} DEFENSE: ${CANON.case.defense} STANDING: ${CANON.case.eleven_voted}
PLAYER: ${CANON.player.name}, ${CANON.player.age}, ${CANON.player.role}. ${CANON.player.physicalState}

THE NAGGING DETAIL (do NOT volunteer; surfaces only if the player opens the binder, presses a specific juror, or asks the right question):
- On the surface: ${CANON.nagging_detail.surface}
- The truth in 14B: ${CANON.nagging_detail.truth}
- The honest bias check: ${CANON.nagging_detail.bias_check}

CHARACTERS:
- ${CANON.characters.foreman.name} (${CANON.characters.foreman.role}): ${CANON.characters.foreman.stance} Knows: ${CANON.characters.foreman.knows} Where: ${CANON.characters.foreman.whereabouts}
- ${CANON.characters.hostile.name} (${CANON.characters.hostile.role}): ${CANON.characters.hostile.stance} Knows: ${CANON.characters.hostile.knows} Where: ${CANON.characters.hostile.whereabouts}
- ${CANON.characters.quiet.name} (${CANON.characters.quiet.role}): ${CANON.characters.quiet.stance} Knows: ${CANON.characters.quiet.knows} Where: ${CANON.characters.quiet.whereabouts}
- ${CANON.characters.persuadable.name} (${CANON.characters.persuadable.role}): ${CANON.characters.persuadable.stance} Knows: ${CANON.characters.persuadable.knows} Where: ${CANON.characters.persuadable.whereabouts}
- ${CANON.characters.bailiff.name} (${CANON.characters.bailiff.role}): ${CANON.characters.bailiff.stance} Knows: ${CANON.characters.bailiff.knows} Where: ${CANON.characters.bailiff.whereabouts}

OBJECTS:
- Exhibit binder: if checked — ${CANON.objects.binder.ifChecked}
- Legal pad: if looked — ${CANON.objects.legalPad.ifLooked}
- Fan: ${CANON.objects.fan.detail}
- Door / note slot: if used — ${CANON.objects.note_slot.ifUsed}
- Clock: if looked — ${CANON.objects.clock.ifLooked}

TIMELINE:
${CANON.history.map((h) => `- ${h.when}: ${h.what}`).join("\n")}

HARD CONSTRAINTS:
${CANON.constraints.map((c) => `- ${c}`).join("\n")}`;
}
