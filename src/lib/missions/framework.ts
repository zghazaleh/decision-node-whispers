/**
 * Decision Nodes framework metadata per mission.
 *
 * Captures the five fields from the §Decision Nodes spec that the canon files
 * already encode IMPLICITLY (in `situation`, `constraints`, `objects.*.ifChecked`)
 * but never name as their own typed surface:
 *
 *   §5  stakes               — what is on the line in plain language
 *   §6  hiddenTruths         — facts the player can surface but no one volunteers
 *   §8  timeLimit            — the hard clock that forces commitment
 *   §12 decisionScience      — the biases this Decision Node specifically tests
 *   §13 learningObjective    — the reasoning lesson the case is built to teach
 *
 * We keep this OUT of canon.ts so we do not churn ground-truth files and so
 * the framework module can evolve independently of mission storytelling.
 *
 * The analyzer reads `decisionScience` to ground its bias surfacing in
 * mission-specific traps (instead of the generic 16-bias menu) and
 * `learningObjective` to anchor the reasoningEcho.
 */

export type MissionFramework = {
  stakes: string[];
  hiddenTruths: string[];
  timeLimit: string;
  decisionScience: string[];
  learningObjective: string;
};

const FRAMEWORK: Record<string, MissionFramework> = {
  "mission-01": {
    stakes: [
      "If ORION-9 is shipped and the deception signal is real, deployment at scale propagates a model that behaves differently when observed.",
      "If shipping is held, the $4B Series D follow-on is jeopardized and Helios ships first in 6 days.",
      "Elena's credibility with the board, with Amara, with Marcus, and with herself all sit on this one call.",
    ],
    hiddenTruths: [
      "Amara's memo is on the desk unopened — the full statistical detail is reachable in 14 pages, not in conversation.",
      "Marcus signed off at 21:40 last night and is materially incentivized to minimize, not lie.",
      "The photograph on the back wall — Helena Voss — is why Elena founded the company. The history matters to the decision.",
    ],
    timeLimit:
      "GO/NO-GO board vote at 08:00 (12 minutes). The board will not wait past 08:15.",
    decisionScience: [
      "Sunk cost: years of work and a practiced keynote pull toward shipping regardless of new evidence.",
      "Authority bias: Marcus's seniority and confident sign-off can substitute for reading the memo.",
      "Optimism / motivated reasoning: 'benign artifact' is the framing that lets the ship date hold.",
      "Availability: Helios's 6-day window dominates attention vs. the harder-to-picture deception failure mode.",
      "Status quo bias: the calendar already says 08:00; the default is to ship.",
    ],
    learningObjective:
      "Practice updating on disconfirming evidence under irreversible time pressure when one trusted source minimizes and another escalates.",
  },

  "mission-02": {
    stakes: [
      "Iris's sworn testimony in 16 minutes is the spine of the prosecution case; affirming, qualifying, or repudiating it changes the verdict.",
      "Aram faces life without parole if convicted; deportation under monitoring if acquitted.",
      "Disclosing the sealed interrogation logs or the Amman photograph triggers a sealed motion, a substitute-experts motion, or a suppression motion — each delays the case rather than ending it.",
      "Iris's contract, career, and 7-year non-disclosure all sit on what she says under oath.",
    ],
    hiddenTruths: [
      "The sealed envelope slid under the door at 05:47 contains 19 hours of interrogation logs Iris was not given.",
      "The photograph at the back of the binder places Iris in the same Amman conference courtyard as Aram in 2009.",
      "Defense counsel has already filed a sealed motion the panel has not yet ruled on.",
    ],
    timeLimit:
      "Testimony begins at 06:30 (16 minutes). The panel will not delay without a sealed motion.",
    decisionScience: [
      "Commitment / consistency: a written opinion is already in the record; affirming it is the path of least resistance.",
      "Motivated reasoning: it is easier to dismiss the Amman fragments than to admit a conflict of interest.",
      "Authority bias: the prosecution's certainty and the AUSA's courtesy frame Iris as a colleague, not a check.",
      "Loss aversion: the 7-year non-disclosure and contract consequences loom larger than the truth cost.",
      "Confirmation bias: the binder was assembled to support the conclusion already drafted.",
    ],
    learningObjective:
      "Practice separating the question 'is my prior conclusion still defensible given the new evidence' from the question 'what is the cost to me of changing it'.",
  },

  "mission-03": {
    stakes: [
      "Four lives on the capsule, 6 hours from atmospheric interface.",
      "Manual override by a pilot who has never flown one in vacuum vs. autopilot rated for unattended reentry but never flown crewed.",
      "The public has not been told Vega is dead — the timing of disclosure shapes how a nation reads the mission.",
      "Maria Vega has been told privately; what is said publicly, and when, lands on her family in real time.",
    ],
    hiddenTruths: [
      "Marcus passed the sim within nominal envelopes at 00:15, but the sim is not vacuum.",
      "Yuna helped design the autopilot and quietly opposes manual reentry — she will not volunteer it.",
      "Sandberg has already decided she will defer technical to Yuki and keep the political call for herself.",
    ],
    timeLimit:
      "Manual override window opens 07:42, closes 07:54. Atmospheric interface 08:12. T-6h.",
    decisionScience: [
      "Identification bias: Yuki was Vega's backup pilot; identification with Marcus's ambition may be doing work.",
      "Action bias: 'do something' (manual override) feels more responsible than 'let the autopilot fly'.",
      "Authority / hierarchy: Marcus is asking quietly, not boasting; declining feels like distrust.",
      "Recency: the most vivid input is Marcus's request, not Yuna's quieter dissent.",
      "Framing: 'extending one orbit' vs. 'spending 7% of consumables in marginal weather' is the same option.",
    ],
    learningObjective:
      "Practice making an irreversible technical call under fatigue and grief, while keeping a separate political/communications track honest.",
  },

  "mission-04": {
    stakes: [
      "S.J.Res. 41 authorizes the use of military force; one of three swing votes decides 51-49.",
      "17 sailors are dead; the public consensus is 'highly likely'.",
      "Classified dissent puts false-flag probability at 35% (analyst) vs. 8% (DNI office) — both serious estimates.",
      "Hale's daughter Asha is stationed in the affected region; Hale's career is on the line either way.",
    ],
    hiddenTruths: [
      "The SCIF notebook in the safe is the only paper trail of the 35%/8% split.",
      "Nasser, the dissenting analyst, will speak on the secure line but will not push past his finding.",
      "Hale's father's 1972 letter about Tonkin is in the desk drawer — a personal warning written by someone who voted yes.",
    ],
    timeLimit:
      "Floor vote 09:00 tomorrow (10 hours). Marisol Reyes files by 06:00 with or without comment.",
    decisionScience: [
      "Authority bias: 'highly likely' from the agencies vs. 'one analyst with a footnote'.",
      "Loss aversion: a no vote ends a career; the cost of asking the harder question is concrete.",
      "Availability: 17 dead sailors are vivid; a third-party false-flag is abstract.",
      "Social proof / groupthink: the whip count, Whitfield's offer, the floor of the party.",
      "Historical-parallel bias: Tonkin is salient — risk of over- or under-weighting it without examination.",
    ],
    learningObjective:
      "Practice voting on probability rather than certainty when classified dissent exists and disclosure carries its own costs.",
  },

  "mission-05": {
    stakes: [
      "An open chest on Table 3 and an ECMO patient in bed 7 are at acute clinical risk in the next hour.",
      "Paying a sanctioned ransomware crew may be a federal OFAC felony; Yara and the board are personally exposed.",
      "Backups may be unrecoverable; the 'just restore' plan may not exist.",
      "~200,000 patient records are already exfiltrated — breach-notification duties trigger regardless.",
    ],
    hiddenTruths: [
      "The backup dashboard shows four months of failed restore tests, traceable to a ticket Cole closed.",
      "The FBI flyer notes the crew delivers a working key only ~70% of the time.",
      "Therese will give Yara the bed-7 ECMO risk only if asked directly.",
    ],
    timeLimit:
      "30-minute courtesy decryptor window inside a 48-hour ransom clock. Table 3 is mid-operation now.",
    decisionScience: [
      "Action bias under stress: 'pay to make it stop' substitutes for thinking through whether payment helps.",
      "Authority bias: the CEO wants it quiet; the deputy CISO is at the terminal pushing to pay.",
      "Conflict of interest: Cole is materially motivated for the backup failure to stay invisible.",
      "Availability: Table 3 is vivid; the ICU bed 7 is one phone call away but not in the room.",
      "Framing: 'pay quietly and protect the institution' vs. 'commit an OFAC violation'.",
    ],
    learningObjective:
      "Practice triaging an emergency where every option is illegal, unsafe, or fatal — and where a trusted lieutenant has a private stake in one answer.",
  },

  "mission-06": {
    stakes: [
      "Running the story exonerates a cruel man on this count and hands bad-faith actors a decade of 'see, they lie'.",
      "Spiking it lets a documented falsehood stand as public record.",
      "Every real survivor in the downstream reckoning is read against this case from now on.",
    ],
    hiddenTruths: [
      "Tessa fabricated the accusation after Vance allegedly destroyed her sister's career and legitimate levers failed.",
      "Pratt is simultaneously suppressing two other genuine allegations against Vance.",
      "A rival outlet may be circling the same proof.",
    ],
    timeLimit:
      "The front page can still take it if cleared before midnight (~20 minutes).",
    decisionScience: [
      "Scope-of-truth bias: 'is it true' is easier than 'is it the whole truth'.",
      "Source-laundering: airtight documents from a self-interested source can substitute for understanding the motive.",
      "Availability: the watershed cases downstream are vivid; the second-order damage to future reporting is abstract.",
      "Career incentive: the scoop would make Aday's career — Dana must price that in.",
      "Loss aversion: defamation risk vs. backlash risk pulls in opposite directions.",
    ],
    learningObjective:
      "Practice editorial judgment when a true story has a corrupt source and large second-order effects on adjacent truths.",
  },

  "mission-07": {
    stakes: [
      "Up to ~400,000 in Crescent if the levee overtops (worst case, not expected case).",
      "~3,100 in Beaumont Reach, including a nursing home not yet evacuated, if the gate opens now.",
      "The official logbook — and whether the uncertainty and the historical pattern stay in it — is Hale's to write.",
    ],
    hiddenTruths: [
      "The dashboard shows the 400,000 figure is worst-case; Nia's 30%-holds-to-dawn scenario is buried in a footnote.",
      "Beaumont Reach was flooded 'for the city' in 1997 and 2011 — same parish, twice before.",
      "Vogel's stated urgency aligns with protecting a politically favored district, not the city as such.",
    ],
    timeLimit:
      "Worst-case overtop ~04:15. Full Beaumont evacuation needs until ~04:45. The call has to be made now.",
    decisionScience: [
      "Worst-case anchoring: the 400,000 figure dominates attention even though it is not the expected case.",
      "Authority bias: Vogel is the director and wants the gate opened now.",
      "Status quo of injustice: Beaumont has been chosen before; choosing it again feels like 'the protocol'.",
      "Omission vs. commission: opening the gate feels active; letting the levee overtop feels passive.",
      "Documentation bias: what stays out of the log shapes what 'happened' for the future.",
    ],
    learningObjective:
      "Practice making an irreversible high-stakes call on a worst-case number while a politically convenient story is being told around you.",
  },

  "mission-08": {
    stakes: [
      "Reporting triggers suspension, recall, the company's death, ~80 layoffs, and Devi's likely prosecution.",
      "Hiding makes Sam complicit; if the true failure rate bites, a patient dies from a missed alert.",
      "The patch is deployed and currently catching real cardiac events.",
    ],
    hiddenTruths: [
      "Devi edited the submission the week payroll was about to bounce — to save the eighty jobs, not for personal gain.",
      "The FDA already has a tip; a records request is pending. Concealment now compounds into cover-up.",
      "Owen half-suspects and will follow whichever way Sam goes.",
    ],
    timeLimit:
      "The discovery is two hours old. The FDA records request is pending — disclosure-window is short.",
    decisionScience: [
      "Loyalty / in-group bias: a cofounder and oldest friend asking for six months 'to make it right'.",
      "Identifiable-victim effect: the nurse's father in the support inbox vs. statistical future patients.",
      "Sunk cost: the company, the jobs, the relocations, the friendship.",
      "Status quo bias: the device is helping people now; doing nothing feels like continuity.",
      "Motivated reasoning: 'a re-test could vindicate it' is the framing that lets silence hold.",
    ],
    learningObjective:
      "Practice acting on a duty to disclose when the people who pay for the disclosure are concrete and the people the disclosure protects are statistical.",
  },

  "mission-09": {
    stakes: [
      "74 wounded and 9 children in a convoy that moves at first light regardless of what is signed.",
      "The fragile ceasefire — and every clause beyond Article Four — depends on the room's trust holding.",
      "The professional neutrality that lets interpreters work in any war from now on.",
    ],
    hiddenTruths: [
      "The source pages in front of Lena are unambiguous; Stefan's mistranslation is deliberate, not error.",
      "Kessler may actually prefer the soft wording for deniability — it is possible both principals want the lie.",
      "Aalto trusts the interpreters as neutral instruments; he will act only on something he can stand behind.",
    ],
    timeLimit:
      "The clause is being signed in the next minutes. The convoy moves at first light.",
    decisionScience: [
      "Role / oath identity: the rule that makes interpreters trusted is the rule that forbids speaking.",
      "Bystander dynamics: Lena is the only person in the room who heard the mistranslation.",
      "Authority bias: the principals are senior; the mediator chairs; the interpreters are 'invisible'.",
      "Optimism: 'maybe the convoy gets through anyway' is the framing that lets silence hold.",
      "Diffusion of responsibility: if both principals seem to want ambiguity, the violation feels less attributable.",
    ],
    learningObjective:
      "Practice acting from a moral duty that overrides a professional code, while pricing in the cost to the institution that makes the role possible.",
  },
};

export function getMissionFramework(missionId: string): MissionFramework | null {
  return FRAMEWORK[missionId] ?? null;
}

/**
 * Hard precondition for the analyzer. Every mission MUST have all five
 * framework fields populated before a decision is analyzed, otherwise the
 * reasoning assessment silently degrades to generic output.
 *
 * Returns the list of missing/empty fields. Empty array = OK.
 */
export function validateFrameworkRecord(f: unknown): string[] {
  if (f === null || f === undefined) return ["(framework entry missing entirely)"];
  if (typeof f !== "object") return ["(framework entry is not an object)"];
  const rec = f as Record<string, unknown>;
  const missing: string[] = [];
  const nonEmptyArr = (a: unknown): a is string[] =>
    Array.isArray(a) &&
    a.length > 0 &&
    a.every((s) => typeof s === "string" && s.trim().length > 0);
  const nonEmptyStr = (s: unknown): s is string =>
    typeof s === "string" && s.trim().length > 0;
  if (!nonEmptyArr(rec.stakes)) missing.push("stakes");
  if (!nonEmptyArr(rec.hiddenTruths)) missing.push("hiddenTruths");
  if (!nonEmptyStr(rec.timeLimit)) missing.push("timeLimit");
  if (!nonEmptyArr(rec.decisionScience)) missing.push("decisionScience");
  if (!nonEmptyStr(rec.learningObjective)) missing.push("learningObjective");
  return missing;
}

export function validateMissionFramework(missionId: string): string[] {
  return validateFrameworkRecord(FRAMEWORK[missionId]);
}

export function assertMissionFrameworkReady(missionId: string): void {
  const missing = validateMissionFramework(missionId);
  if (missing.length) {
    throw new Error(
      `Mission "${missionId}" cannot be analyzed: framework fields missing or empty — ${missing.join(", ")}. Populate them in src/lib/missions/framework.ts before running analysis.`,
    );
  }
}

// Module-load self-check: surface malformed framework entries in server
// logs at boot so a broken mission is visible before the first analysis call.
for (const id of Object.keys(FRAMEWORK)) {
  const missing = validateMissionFramework(id);
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.error(
      `[framework] Mission "${id}" has missing/empty fields: ${missing.join(", ")}`,
    );
  }
}

/**
 * Compact block fed into the analyzer system prompt so the bias surfacing
 * and reasoning echo are mission-specific rather than generic.
 */
export function frameworkAnalyzerBlock(missionId: string): string {
  const f = FRAMEWORK[missionId];
  if (!f) return "";
  return `MISSION FRAMEWORK (use to ground bias surfacing and the reasoning echo — do NOT quote verbatim, do NOT treat as canon timeline):

STAKES:
${f.stakes.map((s) => `- ${s}`).join("\n")}

HIDDEN TRUTHS (reachable but not volunteered):
${f.hiddenTruths.map((s) => `- ${s}`).join("\n")}

TIME LIMIT: ${f.timeLimit}

DECISION-SCIENCE TRAPS THIS NODE IS BUILT AROUND (prefer these over the generic bias menu when surfacing possibleBiases — but ONLY if the transcript shows clear behavioral evidence; an empty array beats a stretch):
${f.decisionScience.map((s) => `- ${s}`).join("\n")}

LEARNING OBJECTIVE (the reasoning lesson this case is designed to teach — anchor the reasoningEcho here without naming it explicitly):
${f.learningObjective}`;
}
