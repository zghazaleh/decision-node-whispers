import type { UIMessage } from "ai";

const REDIRECT_BEAT = "*The room falls quiet. The decision here is still waiting.*";

export function textOf(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("")
    .trim();
}

/** Only public, authored opening actions may appear in the fallback. */
export function caseRedirect(opening: string): string {
  const chips = opening.match(/<<chips:[\s\S]*?>>\s*$/)?.[0].trim();
  if (!chips) throw new Error("Authored opening is missing actions");
  return `${REDIRECT_BEAT}\n\n${chips}`;
}

/** Preserve display history; derive a separate transcript for investigation and evidence. */
export function withoutRedirectedTurns(messages: UIMessage[], redirect: string): UIMessage[] {
  return withoutRedirectedExchanges(messages, redirect, textOf);
}

function withoutRedirectedExchanges<T extends { role: string }>(
  messages: T[],
  redirect: string,
  text: (message: T) => string,
): T[] {
  const accepted: T[] = [];
  for (const message of messages) {
    if (message.role === "assistant" && text(message).trim() === redirect) {
      if (accepted.at(-1)?.role === "user") accepted.pop();
      continue;
    }
    accepted.push(message);
  }
  return accepted;
}

export type TranscriptEntry = { role: string; text: string };

/** Also filter on the server, including transcripts submitted by older clients. */
export function withoutRedirectedTranscript(
  transcript: TranscriptEntry[],
  opening: string,
): TranscriptEntry[] {
  return withoutRedirectedExchanges(transcript, caseRedirect(opening), (message) => message.text);
}

export const MIN_INVESTIGATION_EXCHANGES = 5;

export function caseInvestigation(messages: UIMessage[], opening: string, responsePending = false) {
  const accepted = withoutRedirectedTurns(messages, caseRedirect(opening));
  const completedExchanges = accepted.filter(
    (message, index) =>
      !(responsePending && message === messages.at(-1)) &&
      message.role === "assistant" &&
      textOf(message).length > 0 &&
      accepted[index - 1]?.role === "user" &&
      textOf(accepted[index - 1]).length > 0,
  ).length;
  return {
    completedExchanges,
    decisionReady: completedExchanges >= MIN_INVESTIGATION_EXCHANGES,
    pressure: Math.min(1, completedExchanges / 9),
    transcript: accepted.map((message) => ({ role: message.role, text: textOf(message) })),
  };
}
