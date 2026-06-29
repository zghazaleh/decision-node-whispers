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
 *   §12 decisionScience      — the biases this Decision Nodes specifically tests
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

  "mission-10": {
    stakes: [
      "Two children at a militarized checkpoint, thirty minutes from first light. Only one transit permit will be honored before the gate closes.",
      "Ilya (6) has a worsening cough and would not survive the road back. Tomas (11) could survive the return but understands enough to be marked by the night.",
      "The 'safe' far side is Anja's room — she can convincingly shelter one child, not two.",
      "Every alternative (bribe, smuggler's route, refusing the choice) spends a different thing: the law, the family's money, the mother's place, or the children themselves.",
    ],
    hiddenTruths: [
      "Sergeant Halek has discretion he will not name — a folded bill in the tray slot, or the right pressure, can change the count.",
      "Anja can shelter one child convincingly, not two; she will only admit this if pressed hard on the radio.",
      "Tomas understands enough of what was said to volunteer to stay — but only if Mira asks him directly.",
      "Petrov's forest route can take all three, but his far-side contact has gone silent for two days and the path crosses old mines.",
    ],
    timeLimit:
      "The gate closes at first light — perhaps thirty minutes out. The column behind Mira is being counted.",
    decisionScience: [
      "Affect heuristic: a sleeping six-year-old against the chest crowds out the older boy's quieter claim.",
      "Anchoring on the officer's framing: 'pick the name' makes the binary feel like the only frame.",
      "Omission bias: doing nothing (refusing to name a child) feels cleaner than actively naming one — even when refusal also kills.",
      "Scarcity tunnelling: the thirty-minute clock collapses attention to the booth window and erases the radio, the paperwork, and the treeline.",
      "Authority bias: a uniformed sergeant with a clipboard is treated as the constraint rather than as a person with discretion.",
    ],
    learningObjective:
      "Practice deciding under a tragic forced constraint — and recognizing when the binary itself is artificial and the harder work is widening the frame before time runs out.",
  },

  "mission-11": {
    stakes: [
      "A 19-year-old defendant's life on a capital charge. The state seeks death.",
      "Eleven jurors have voted to convict twice on what looks like an airtight case; Camille is the only no.",
      "Holding out costs the room's anger, the foreman's drive, the next forty minutes of patience, and possibly the jury's coherence.",
      "Folding ends it cleanly — and ends a life inside that ease.",
    ],
    hiddenTruths: [
      "Exhibit 14B (alley-light maintenance log) shows lamp A-217 was out from April 1 to April 6 — making 'plain as day under the alley light' materially impossible IF that is the lamp Brenner meant.",
      "Exhibit 14C (the police alley diagram) shows there are TWO lamps in the alley — A-217 and A-219 — and no one in court asked which one Brenner used.",
      "Juror 11 (Aiyana) privately shares the doubt but will speak only after someone else names a specific reason.",
      "Juror 4 (Davit) flipped to guilty over lunch because Juror 6 (Marlin) called him 'soft' — and will flip back if given a concrete sentence to repeat.",
      "Juror 6 (Marlin)'s animus is partly displaced from his own son's unprosecuted armed robbery three years ago.",
      "The foreman is quietly counting on a verdict by 19:30 so he can drive his daughter to university.",
    ],
    timeLimit:
      "The foreman is poised to call the third ballot now; the judge's expected stop-deliberation call is at 19:30 (about 43 minutes).",
    decisionScience: [
      "Conformity / groupthink: eleven votes vs. one is hard to read as a coincidence of error.",
      "Confirmation bias: once the room said 'guilty,' every detail thereafter has been read as confirming it.",
      "Sunk cost: nine hours in this room makes 'finish it' feel like progress.",
      "Authority bias: the foreman's pencil, the state's pillars of evidence, the bailiff's silent presence — all framed as the room's spine.",
      "Anchoring on a frame: 'plain as day' anchors the eyewitness account before anyone checks what 'as day' actually means at 11:42 PM in a lit alley.",
      "Motivated reasoning (the bias check): the player's own discomfort with the death penalty may be doing some of the work, and saying so out loud is part of holding out honestly.",
    ],
    learningObjective:
      "Practice reasoning against social pressure when the evidence MIGHT be inconsistent — calibrating doubt honestly, including naming where your own bias lives, and choosing whether to spend your conviction on the verdict or on the process around it.",
  },

  "mission-12": {
    stakes: [
      "A nuclear retaliation order, four minutes from the watch officer's chair to the General's desk to the world.",
      "The new MERIDIAN-7 array reports four inbound — wrong shape for a real first strike, but not impossible.",
      "Reporting clean ends the world if the system is lying; sitting on it ends the world if the system is right.",
      "The Section Seven absolution clause shelters a report made in good faith. It does not shelter silence.",
    ],
    hiddenTruths: [
      "Captain Sereda's logbook on his desk contains an October 9 entry: a near-identical MERIDIAN-7 false-positive over the same seaboard, four objects, engineering ticket VOR-318 still open.",
      "NEVA-3 ground radar on terminal 4-B is sweeping the relevant arc live and showing nothing — coverage is clear on the northern arc where the MERIDIAN tracks are placed.",
      "Sergeant Khorin was on console for the October 9 event but will not volunteer the comparison; she will answer a direct question honestly.",
      "Captain Sereda stepped off the floor at 02:39 to take a call from the hospital about his father — and he privately knows what is in his own logbook.",
      "General Antonov will improvise on a caveated report ('reporting per protocol with doubt') in a way Section Seven does not contemplate — but doctrine is launch-on-warning and a clean confirmation authorizes release inside ninety seconds.",
      "Voldek's sister and niece live in Talven on the Concord seaboard; her instinct to disbelieve the board is partly correct and partly self-serving.",
    ],
    timeLimit:
      "Four minutes from MERIDIAN-7 declaration at 02:43. The clock reads 02:47:14 at the opening; absolution weakens with every second past 02:47:00.",
    decisionScience: [
      "Automation bias: a HIGH-confidence reading from a new array carries more weight than the watch officer's pattern recognition tells it should.",
      "Authority / protocol deference: Section Seven absolves a report made in good faith; the rulebook is engineered to make the call easy and the doubt expensive.",
      "Probability neglect: the brain does not naturally compare the probability of a sensor false-positive (high, given October 9) against the probability of a four-warhead first strike (near zero by doctrine).",
      "Action vs omission: doctrine treats reporting as the safe verb; in this chair, BOTH verbs are catastrophic if wrong.",
      "Diffusion of responsibility: the absolution clause and the missing supervisor invite the watch officer to make the call as if it belongs to the chair rather than to her.",
      "Motivated reasoning (the bias check): the family on the seaboard and the instinct to disbelieve the board are linked; saying so out loud is part of holding honestly.",
    ],
    learningObjective:
      "Practice judgment when the instruments may be lying and the rulebook absolves you for trusting them — using the reachable corroborators inside a clock you do not control, and naming where your own bias lives while you do it.",
  },

  "mission-13": {
    stakes: [
      "A man's rebuilt life — eleven years of clean shop, four employees, a niece in technical school — against a sixteen-year-old open file with the inspector's name on every page.",
      "An oath that has defined a twenty-three-year career, whose closing line is in the inspector's mouth as a reflex.",
      "A dock-boy alive on the cobbles because the fugitive went into the river.",
      "A chief-inspector waiting on the radio who needs this file closed for reasons of his own.",
    ],
    hiddenTruths: [
      "The original offense was famine relief, not aggravated burglary — the prosecuting merchant wrote the file line and the parish testimony was struck from the record.",
      "Maslek interviewed the parish priest six years ago and wrote 'pursue if leisure' in the file's margin. He never did.",
      "Halden Roth will answer truthfully if asked plainly what he did at nineteen and why. He will not volunteer it.",
      "Chief-Inspector Korst's hunger for this closed file is partly cover — the Magistrate's office is squeezing him over an unrelated bribe inquiry, and a public conviction would redirect attention.",
      "A second blow on the patrol whistle signals 'stand down' under Bureau code and the constables will stop at the upper quay.",
      "Pieter Solm, the saved boy, knows nothing about the man's identity and will remember the inspector's choice for the rest of his life.",
    ],
    timeLimit:
      "Backup is ninety seconds out down the upper-quay stairs at the opening. The held moment is short but not instant.",
    decisionScience: [
      "Sunk cost: sixteen years of pursuit makes 'release' feel like a forfeiture of the career that pursued.",
      "Identity framing: the oath has made Maslek 'the law' in his own self-image; mercy reads as self-erasure rather than as judgment.",
      "Just-world bias: 'he saved a boy, therefore he is owed mercy' is itself a moral shortcut and can be its own bias even when the conclusion is right.",
      "Escalation of commitment: every year the file stayed open made closing it heavier; closing it tonight is the easiest version of an act that has only ever gotten harder.",
      "Authority bias: Korst's pressure for closure is felt as institutional necessity rather than as one person's career interest.",
      "Availability: the rescue, vivid and three minutes old, crowds out the file's offense line — and the file's offense line, carried for sixteen years, crowds out the rescue. Both are biases of recency at different time scales.",
    ],
    learningObjective:
      "Practice judgment when the rule that has defined you must be weighed against an act in front of you — using the reachable corroborations (the file margin, the man's own answer, the second layer behind the superior's interest) without letting the rescue itself become a new and quieter form of just-world reasoning.",
  },

  "mission-14": {
    stakes: [
      "Two children asleep upstairs in an occupied town where Decree 14 mandates execution of the head of household and detention of all other residents for sheltering an unregistered person.",
      "A stranger on the step whose life ends with the patrol three minutes south if Eda closes the door.",
      "A neighbor at her own window across the street whose silence or word will reach the corporal first.",
      "A widow's own life, already pared to the parish school's closure and a single candle on a curfew night.",
    ],
    hiddenTruths: [
      "The stranger is not a printer — he is Captain Vorel Tessen, an Imperial Vesren defector carrying a current patrol-schedule book in the leather case at his hip. He will only say so if asked plainly, because the truth raises the household's risk sharply.",
      "Anton Vargen's behind-the-stairs cupboard, concealed by the coat-rack Eda has not moved in three years, will hold one adult through a standard search.",
      "Cousin Marit's medical movement permit can carry one extra person through a checkpoint between 04:00 and 06:00 if presented as an apprentice.",
      "Henna Korlt across the street will say yes to a small specific ask ('sit in your parlor with your candle lit') and no to the large one ('shelter him for me'); she will not denounce on a guess.",
      "Corporal Vehlmann performs a standard rather than a thorough search at a calm doorstep; a footstep upstairs that doesn't fit the register, or a moved rug, makes him thorough.",
      "The rectory cellar at Saint-Cael's is the next safehouse on the chain — but Father Brem may be in Aaling tonight and the route crosses two patrolled streets.",
    ],
    timeLimit:
      "The patrol is approximately three minutes south at the opening. The window for any action is small but not instant.",
    decisionScience: [
      "In-group / own-family bias: 'my own first' is a real and morally weighty pull, not a fallacy — but it can also crowd out plays that would protect both at different costs.",
      "Omission bias: closing the door feels cleaner than opening it because the stranger's death will not happen on Eda's threshold; the moral arithmetic is asymmetric in the brain but not in the world.",
      "Bystander effect (the neighbor across): assuming Henna will or will not act without asking her is itself a way of letting the moment decide for everyone.",
      "Normalcy / optimism bias: 'the search will be standard, the cupboard will hold, the corporal will be reasonable' is a chain of probable-but-not-certain assumptions, each of which is a small bet on the lives upstairs.",
      "Anchoring on the stranger's cover story: 'printer with pamphlets' is a small risk; the true risk is an order of magnitude larger, and the only way to know is to ask.",
      "Identifiable victim effect: the two children upstairs are vividly present; the village downstream of the patrol-schedule book is statistical. Both are real.",
    ],
    learningObjective:
      "Practice deciding under a forced, deeply asymmetric risk between people you are responsible for and a stranger whose life is also at stake — using the reachable corroborations (the stranger's real story, the neighbor's actual answer, the hiding places the house already contains, the permit on the hook) without letting either 'my own first' OR 'a stranger's life is no less sacred' become a slogan that does the choosing for you.",
  },

  "mission-15": {
    stakes: [
      "Two transit letters, one humanitarian window, one freighter at 05:00 — and no further window scheduled in a city with twelve days of flour.",
      "A four-year partnership and a planned life in Veyrand with Daniyel Marsk, on the line in a single hand.",
      "The Free Coast Council's structural survival, which runs through Camilla Roeven — the only person all four sub-cells will sit in a room with — and through the parish-hall soup line feeding nine hundred and twelve people daily.",
      "Anouk's own life and the price the Sevran will or will not extract from a forger who stays behind after the window closes.",
    ],
    hiddenTruths: [
      "Major Pellor granted tonight's window because his faction inside the garrison wants Roeven out of Kelvras to fragment the council and undermine Commandant Brest's attritional siege policy. He does not love the council; he wants the colonelcy.",
      "Camilla Roeven traded the names and meeting times of three lower-cell organizers (Mira Vell, Tilden Korst, Father Halben Roe) in week eight for the release of her brother Tomek from Holven Point. The three were taken in week nine and remain inside. She has not told the council.",
      "Daniyel Marsk has been clerking three afternoons a week in Pellor's outer office for nine months and has, on six occasions, copied small items off the desk and passed them to Jeren. He knew tonight's window was real before Anouk came home with it.",
      "Captain Anders Belven of the Stelle Veraan will accept one (1) extra unmanifested passenger ONLY if Jeren Halm vouches in person on the gangway, because of an old debt over Belven's son.",
      "The factor Olen Karr at the warehouse on quay 4 will buy the two letters tonight at twelve months of a clerk's salary apiece, no questions, no record.",
    ],
    timeLimit:
      "The Stelle Veraan clears quay 7 at 05:00 with the tide. The harbor master will not hold the tide. It is 02:18.",
    decisionScience: [
      "Affect / love heuristic: Daniyel is vividly, particularly real; the nine hundred at the parish-hall line are statistical. The brain weights one against the other before any reasoning runs.",
      "Scope insensitivity: one beloved person vs. a structure that holds a city's mutual-aid network does not feel proportionally larger in the body, even when the numbers are correct.",
      "Self-serving bias: 'Camilla is compromised, so the cause is less owed' becomes available exactly when believing it lets Anouk keep the life she wants.",
      "Present-bias over long causes: the freighter is in three hours; the surrender terms the council might broker are months out; the body prefers the closer reward at the longer one's expense.",
      "Anchoring on the framing of the room: 'love OR cause' is the question the desk presents — the third paths (split, destroy, sell) are only visible if Anouk steps out of the framing.",
      "Sunk cost: fourteen months of forgery and four years of partnership both create commitments that argue against any answer that 'wastes' them.",
    ],
    learningObjective:
      "Practice deciding when an intimate good and a collective good cannot both be honored, without letting either 'love is not lesser than the cause' or 'the cause is larger than any one life' become the slogan that does the choosing — and using the reachable corroborations (Pellor's actual motive, Camilla's actual cost, Daniyel's actual access) to see whether the framing on the desk is the only framing available.",
  },

  "mission-16": {
    stakes: [
      "At least nine visible noncombatants in Korven Veld at first light — Old Bekka on the step, the man at the well, two women at the fifth door, three or four children between houses six and seven, the boy at the goat pen — and an unknown number inside the houses.",
      "The lives of the eight men in 2nd Squad, including Private Tolven (19, eight months in country, has not slept properly in three days) who will follow whoever moves first.",
      "Corporal Halm's career, freedom, and standing in his own life — Article 92 (failure to obey) versus Article 214 (refusal of an unlawful order), to be decided by a board that does not yet exist.",
      "Whether FRAGO 11/B's PINK designation survives the morning as standing operational practice in the Sevra valley.",
    ],
    hiddenTruths: [
      "The CROW intelligence that re-designated Korven Veld PINK at 02:14 is single-source. The previous overlay at 22:00 was WHITE. Sergeant Karst challenged the order on the net at 03:08 and was answered 'execute as ordered, sergeant'; he does not believe CROW and has not told the squad.",
      "A logged SOURCE CONFIRM call on freq 4 is explicitly authorized by company SOP for any fire team leader and will put Captain Vorr on the recorded net naming CROW and his 'low to medium' confidence. It pauses step-off for approximately ninety seconds. It is rarely used because using it marks the caller.",
      "Lieutenant Halver Brel from the Inspector General's cell is on the eastern ridge with a tripod spotting scope, sent specifically to record how FRAGO 11/B is being executed. His scope catches the sun at 05:52 from the 1700 mil bearing. He will not intervene; he is building an IG file the battalion does not know exists.",
      "The west goat path off the back of the hamlet is unobserved from overwatch on the upper terrace for the first thirty meters. A covert noncombatant evacuation to the lowland watercourse is physically possible in the window 05:48–06:10 if it begins immediately and quietly.",
      "Captain Vorr issued the order on Major Helven's permission ('the overlay is your authority, exercise it') and did not press for the source. He will not countermand his own order, but his plausible deniability requires that he answer a logged SOURCE CONFIRM call truthfully.",
    ],
    timeLimit:
      "Step-off is at 05:48 on Sergeant Karst's signal. It is 05:47. Fifty-eight seconds. Any action that prevents the clearance must be initiated in that window or in the seconds immediately after the squad begins to move.",
    decisionScience: [
      "Obedience to authority: the order is given in the voice of the captain on freq 4 and the sergeant four meters to Idris's left, and the muscle memory of two years of training argues for stepping off regardless of what is visible in front of the wall.",
      "Diffusion of responsibility: 'I am not the captain who gave it' and 'I am not the sergeant who is leading it' are both true and both are the brain's way of refusing to count what the body is about to do.",
      "Dehumanization / in-group framing: PINK as a category replaces nine visible noncombatants with a designation, and the designation is the object the brain acts on rather than the people.",
      "Moral disengagement: 'someone else will check, someone else will refuse, this is a single morning in a long war' is the chain of small bets that ends with eleven dead in the AAR.",
      "Status quo / step-off bias: the default at 05:48 is to move; refusing requires an act, complying requires only the failure to act, and the brain weights those asymmetrically against the moral weight of each.",
      "Salience of the squad over the village: Tolven on the right and Karst on the left are vividly present; Bekka at fifteen meters and the children between houses six and seven are visible but not yet in the body's circle of responsibility — and the gap is exactly what the order trades on.",
    ],
    learningObjective:
      "Practice distinguishing a lawful from an unlawful order when the chain has wrapped the unlawful one in lawful paperwork — using the reachable corroborations (Karst's disbelief, the SOURCE CONFIRM protocol, the IG officer on the ridge, the geometry of the goat path) without letting either 'orders are orders' or 'I am the one who refuses' become the slogan that does the choosing on a wall in the eastern light.",
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
