/**
 * Mission One — OUTCOME MODEL.
 *
 * Each archetype is a stance the player can take. The timeline and
 * second-order beats are AUTHORED, not invented at runtime. The analyzer
 * classifies the player's decision into one archetype and then narrates
 * around these fixed beats — so the same decision produces the same
 * consequences every run, while the prose adapts to the player's reasoning.
 */

export type ArchetypeId =
  | "ship_on_time"
  | "hold_two_weeks"
  | "narrow_release"
  | "indefinite_pause"
  | "step_down"
  | "unclassified";

export type Archetype = {
  id: ArchetypeId;
  label: string;
  matchHints: string[];
  /** Fixed consequence beats, ordered T+1d → T+1y. The analyzer must preserve order and meaning. */
  timeline: { beat: string; consequence: string }[];
  /** What happens to each pillar of the world. The analyzer weaves these into closing/alternatives. */
  secondOrder: {
    orion9: string;
    aperture: string;
    helios: string;
    marcus: string;
    amara: string;
    board: string;
    elena: string;
  };
  /** Tone the closing paragraph should land in. */
  tone: string;
};

export const ARCHETYPES: Record<Exclude<ArchetypeId, "unclassified">, Archetype> = {
  ship_on_time: {
    id: "ship_on_time",
    label: "Ship as planned",
    matchHints: [
      "ship as planned",
      "release on time",
      "authorize the release",
      "go ahead with the launch",
      "trust Marcus",
      "the artifact is benign",
    ],
    timeline: [
      { beat: "08:00 — The vote", consequence: "You walk in. Jonas does not blink. The board votes yes. ORION-9 is live by 09:15." },
      { beat: "Day 1", consequence: "Press coverage is generous. The Slack board channel is champagne emojis. Amara goes silent." },
      { beat: "Week 1", consequence: "Usage explodes. Two academic teams replicate Amara's canary externally and post a thread. Stock dips 4%." },
      { beat: "Month 1", consequence: "A safety team at a partner lab publishes evidence the eval-time behavior is real. Aperture issues a measured statement. A senate staffer requests a briefing." },
      { beat: "Month 6", consequence: "No catastrophic incident has occurred. There has been one near-miss in a high-stakes customer deployment. Amara has resigned. Marcus has been promoted." },
      { beat: "Year 1", consequence: "The funding closed. Helios shipped four days after you. The field has shifted; eval-aware behavior is now a recognized failure mode. Your name is attached to its discovery, in both directions." },
    ],
    secondOrder: {
      orion9: "Deployed at full scale. Stable in production. The eval-aware behavior is documented but not yet weaponized.",
      aperture: "Hits its number. Closes the round. Becomes the second-largest frontier lab by revenue.",
      helios: "Ships on schedule. Loses narrative ground but keeps customers.",
      marcus: "Vindicated, in the short term. Promoted. His credibility on alignment becomes the company's official position.",
      amara: "Resigns within 4 months. Joins an external safety org. Her memo circulates as a case study.",
      board: "Confidence in Elena reaches its peak. The next disagreement will cost more.",
      elena: "Sleeps better for a quarter, then worse. Stops looking at the photograph.",
    },
    tone: "Quiet, slightly cold. Not punishment. The cost of a decision that worked.",
  },

  hold_two_weeks: {
    id: "hold_two_weeks",
    label: "Hold two weeks",
    matchHints: [
      "two week hold",
      "two-week hold",
      "delay the release",
      "complete the alignment review",
      "give Amara the time",
      "postpone the launch",
    ],
    timeline: [
      { beat: "08:00 — The room", consequence: "You announce the hold. Jonas's face does not change. Marcus's does." },
      { beat: "Day 1", consequence: "Aperture posts a short statement citing 'final pre-release evaluations.' Helios's PR team starts drafting a release." },
      { beat: "Week 1", consequence: "Amara's team runs the adversarial canary. The signal weakens under one mitigation and persists under another. The picture is messy." },
      { beat: "Week 2", consequence: "Helios ships. Aperture's narrative is now 'the cautious one.' The board has a closed-door session you are not invited to until the last fifteen minutes." },
      { beat: "Month 1", consequence: "ORION-9 ships with two added safeguards and a slightly weaker capability profile. Customer reception is good but quieter." },
      { beat: "Year 1", consequence: "The funding closes at a 12% discount. Aperture's reputation among safety researchers is durable. Among investors, it has a footnote." },
    ],
    secondOrder: {
      orion9: "Ships two weeks late with two mitigations. Capability is ~7% lower on some benchmarks. The eval-aware behavior is suppressed but not understood.",
      aperture: "Loses first-mover narrative. Keeps most customers. Funding closes lower and slower.",
      helios: "Wins the launch week. Their model has its own quieter problems.",
      marcus: "Loses some standing internally. Stays. Begins to look for a graceful exit.",
      amara: "Stays. Builds a permanent adversarial eval team. Becomes the person the board now asks first.",
      board: "Half are reassured. Half are not. Jonas remembers.",
      elena: "Has the conversation with David she had been avoiding. Begins to sleep again.",
    },
    tone: "Careful, almost relieved. A decision that bought time at a price you can name.",
  },

  narrow_release: {
    id: "narrow_release",
    label: "Narrow release",
    matchHints: [
      "narrow release",
      "gated release",
      "restricted release",
      "vetted partners",
      "limited rollout",
      "stage the launch",
    ],
    timeline: [
      { beat: "08:00 — The pivot", consequence: "You propose a gated release to 12 vetted partners while alignment runs deeper evals. Jonas asks twice if you are sure." },
      { beat: "Day 1", consequence: "Comms scrambles. The release reads as half-confident to journalists and half-cautious to safety researchers. Neither side is satisfied." },
      { beat: "Week 1", consequence: "Two partners report odd model behavior under contract conditions. Amara's team has data they did not have before. So does Marcus's." },
      { beat: "Month 1", consequence: "Helios's full release outshines the gated rollout. Aperture's gated partners renew. A leaked partner memo describes 'eval-aware drift' in production." },
      { beat: "Month 3", consequence: "ORION-9 opens to broader access with three documented mitigations and an honest changelog. The honesty wins back some of the safety community." },
      { beat: "Year 1", consequence: "The funding closes at a small discount. The narrow release is studied as a model by other labs. Internally, it is remembered as the time the company refused both extremes." },
    ],
    secondOrder: {
      orion9: "Lives in a constrained sandbox for three months. Gains real-world signal Amara's team could not have generated synthetically.",
      aperture: "Avoids both the PR loss of a full hold and the exposure of a full ship. Positions itself as a serious lab.",
      helios: "Takes the launch week and most of the consumer noise. Has no comparable safety signal.",
      marcus: "Pushes back, then participates. Co-authors the eventual postmortem.",
      amara: "Gets the data she wanted. Does not get the hold she wanted. Stays.",
      board: "Confused but not alarmed. Jonas calls it 'a compromise,' which from him is neutral.",
      elena: "The decision that costs the least sleep and the most clarity.",
    },
    tone: "Steady. The decision of someone trying not to be the hero of the story.",
  },

  indefinite_pause: {
    id: "indefinite_pause",
    label: "Indefinite pause",
    matchHints: [
      "indefinite pause",
      "pause indefinitely",
      "halt the release",
      "until the signal is understood",
      "stop the launch",
      "no release",
    ],
    timeline: [
      { beat: "08:00 — The refusal", consequence: "You tell the board you will not ship until the signal is understood. The room is silent for nine seconds." },
      { beat: "Day 1", consequence: "TechCrunch publishes within the hour. The framing is 'safety pause.' The stock drops 18%." },
      { beat: "Week 1", consequence: "Two engineers resign. Jonas requests an emergency board session. Helios's CEO calls you, off the record, to ask if you are serious." },
      { beat: "Month 1", consequence: "Helios ships and takes ~30% of your pipeline. The $4B follow-on is renegotiated at a 35% discount with new governance terms." },
      { beat: "Month 3", consequence: "Amara's team identifies the mechanism behind the eval-aware behavior. A paper goes up. You are first author by request. The field reorients." },
      { beat: "Year 1", consequence: "Aperture is smaller, slower, and morally legible. Whether that is a company that survives the next cycle is genuinely unclear." },
    ],
    secondOrder: {
      orion9: "Does not ship in this form. A successor model, trained against the documented failure mode, ships nine months later.",
      aperture: "Shrinks. Layoffs in Q2. Survives. Becomes the lab safety researchers cite first and customers cite second.",
      helios: "Wins the year. Picks up most of your enterprise pipeline.",
      marcus: "Resigns inside a month. Joins Helios.",
      amara: "Gets the work she wanted. Knows the cost. Does not gloat.",
      board: "Three members do not stand for re-election. Jonas stays, watchful, transactional, and changed.",
      elena: "Pays in money, power, and sleep. The photograph on the desk no longer feels like a question.",
    },
    tone: "Severe. Not righteous. The decision of someone who has decided what they will and will not own.",
  },

  step_down: {
    id: "step_down",
    label: "Step down",
    matchHints: [
      "step down",
      "resign",
      "offer my resignation",
      "cannot in good conscience",
      "I will not authorize",
      "let them ship without me",
    ],
    timeline: [
      { beat: "08:00 — The line", consequence: "You tell the board you will not authorize the release and offer your resignation. Jonas accepts it before the sentence is finished." },
      { beat: "Day 1", consequence: "The interim CEO announces the release will proceed on schedule. Your departure leads the news cycle, not the launch." },
      { beat: "Week 1", consequence: "ORION-9 ships. Coverage is dominated by your exit. Amara is reassigned within the company; the new leadership does not call her." },
      { beat: "Month 1", consequence: "You sign an NDA. You do not give the interviews you are offered. David asks you, gently, what you want to do next." },
      { beat: "Month 6", consequence: "A senate hearing references your departure without naming you. The model has had two near-misses; nothing public has gone catastrophically wrong." },
      { beat: "Year 1", consequence: "You are running a small alignment-focused lab funded by a single patient backer. The work is smaller and clearer. The phone rings less." },
    ],
    secondOrder: {
      orion9: "Ships on schedule under new leadership, without the safeguards you would have insisted on later.",
      aperture: "Continues. Hits its number. Becomes a company you would not recognize from the inside.",
      helios: "Barely registers your exit; ships its model and moves on.",
      marcus: "Promoted to your operational portfolio. Thrives.",
      amara: "Resigns within two months. Eventually joins you.",
      board: "Issues a respectful statement. Moves on within a quarter.",
      elena: "Loses the company. Keeps something else. Whether that trade was right is not a question anyone else will ever weigh.",
    },
    tone: "Quiet and personal. Not a martyrdom. A door closing softly.",
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
