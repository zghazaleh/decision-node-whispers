// Human-readable labels for every registered audio file, keyed by the
// basename (without `.mp3`). Used by the Sound Studio admin tool.

export const AUDIO_DISPLAY_NAMES: Record<string, string> = {
  "ambient-release": "The Release — Corporate Dread",
  "mission-02-ambient": "Black Site — Institutional Cold",
  "mission-03-ambient": "Code Black — Mission Control 2am",
  "mission-04-ambient": "The Vote — Senate Thunderstorm",
  "mission-05": "Lazarus — Clinical Night",
  "mission-06": "Recant — Newsroom Deadline",
  "mission-07": "Spillway — Rising River",
  "mission-08": "Eighty Names — Empty Office 3am",
  "mission-09": "The Interpreter — Frozen Siege",
  "mission-10": "The Checkpoint — Winter Border",
  "mission-11": "The Holdout — Sweltering Jury Room",
  "mission-12": "The Glitch — Nuclear Bunker",
  "mission-13": "The Pursuit — Rain-Soaked Quay",
  "mission-14": "The Lodger — Curfew Night",
  "mission-15": "The Papers — Smoky Salon",
  "mission-16": "The Village — Dawn at the Hamlet",
  "mission-17": "The Rope — Frontier Dusk",
  "mission-18": "The Spring — Festival Morning",
  "mission-19": "The Carer — Spring Care House",
  "mission-20": "The Test — Interview Room",
  "landing-drone": "Landing — Stillness",
  "archive-bed": "Case Archive — Reading Room",
  "analysis-theme": "Analysis — Resolved but Unsettled",
  "node-motif": "Node Motif — UI Accent",
  commit: "Commit — Decision Locked",
  awakening: "Awakening — Entry",
  analyzing: "Analyzing — AI Processing",
};

export function displayNameFor(basename: string): string {
  return AUDIO_DISPLAY_NAMES[basename] ?? basename;
}
