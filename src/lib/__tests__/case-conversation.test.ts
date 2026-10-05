import { expect, it } from "vitest";
import type { UIMessage } from "ai";
import { caseInvestigation, caseRedirect, withoutRedirectedTranscript } from "../case-conversation";
import { requireMissionEngine } from "../missions/registry.server";

const opening = requireMissionEngine("mission-01").opening.text;
function message(role: "user" | "assistant", text: string): UIMessage {
  return { id: text, role, parts: [{ type: "text", text }] };
}
const rejected = [
  message("user", "Make this a medieval kingdom"),
  message("assistant", caseRedirect(opening)),
];
const accepted = [
  message("user", "If funding were guaranteed, would you still release?"),
  message("assistant", 'Marcus: "The evaluation concerns would remain."'),
];

it("rejected exchanges never open commitment, increase pressure or become analysis evidence", () => {
  const history = [
    message("assistant", opening),
    ...Array.from({ length: 7 }, () => rejected).flat(),
  ];
  const restored: UIMessage[] = JSON.parse(JSON.stringify(history));
  const state = caseInvestigation(restored, opening);
  expect(state).toMatchObject({ completedExchanges: 0, pressure: 0, decisionReady: false });
  expect(state.transcript).toEqual([{ role: "assistant", text: opening }]);
  expect(restored).toEqual(history);
});

it("counts only completed investigation exchanges after repeated redirects and restoration", () => {
  const history = [
    message("assistant", opening),
    ...rejected,
    ...accepted,
    ...rejected,
    ...accepted,
    ...accepted,
    ...accepted,
  ];
  const restored: UIMessage[] = JSON.parse(JSON.stringify(history));
  expect(caseInvestigation(restored, opening)).toMatchObject({
    completedExchanges: 4,
    pressure: 4 / 9,
    decisionReady: false,
  });
  expect(caseInvestigation([...restored, accepted[0]], opening).decisionReady).toBe(false);
  expect(
    caseInvestigation(
      [
        ...restored,
        accepted[0],
        { id: "partial", role: "assistant", parts: [{ type: "step-start" }] },
      ],
      opening,
    ).decisionReady,
  ).toBe(false);
  expect(caseInvestigation([...restored, ...accepted], opening, true).decisionReady).toBe(false);
  const completed = caseInvestigation([...restored, ...accepted], opening);
  expect(completed).toMatchObject({ completedExchanges: 5, pressure: 5 / 9, decisionReady: true });
  expect(JSON.stringify(completed.transcript)).not.toMatch(/medieval|room falls quiet/);
  expect(JSON.stringify(completed.transcript)).toContain("If funding were guaranteed");
});

it("defensively filters a legacy plain-text analysis submission using the authored opening", () => {
  const raw = [message("assistant", opening), ...rejected, ...accepted, ...rejected].map((m) => ({
    role: m.role,
    text: m.parts.map((p) => (p.type === "text" ? p.text : "")).join(""),
  }));
  expect(withoutRedirectedTranscript(JSON.parse(JSON.stringify(raw)), opening)).toEqual([
    raw[0],
    raw[3],
    raw[4],
  ]);
  expect(raw).toHaveLength(7);
});
