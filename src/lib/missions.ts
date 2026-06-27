export type MissionStatus = "available" | "classified" | "locked";

export type MissionMeta = {
  id: string;
  number: string; // displayed as "01", "02"...
  codename: string; // short codename / project name
  title: string;
  logline: string; // one-line hook (player-facing)
  status: MissionStatus;
  route?: string; // route to navigate to if available
  duration?: string; // estimated time
  tone?: string; // mood descriptor
};

export const MISSIONS: MissionMeta[] = [
  {
    id: "mission-01",
    number: "01",
    codename: "The Release",
    title: "The Release",
    logline:
      "Twelve minutes until the boardroom. The model is ready. The memo is not.",
    status: "available",
    duration: "20–40 min",
    tone: "Tense · Suspended",
  },
  {
    id: "mission-02",
    number: "02",
    codename: "Black Site",
    title: "Black Site",
    logline:
      "You are the prosecutor's last witness. You no longer remember which side you came in on.",
    status: "available",
    duration: "20–40 min",
    tone: "Claustrophobic · Cold",
  },
  {
    id: "mission-03",
    number: "03",
    codename: "Lazarus",
    title: "Lazarus",
    logline:
      "The capsule is six hours from re-entry. The pilot has been dead for nine.",
    status: "available",
    duration: "20–40 min",
    tone: "Vast · Quiet",
  },
  {
    id: "mission-04",
    number: "04",
    codename: "The Vote",
    title: "The Vote",
    logline:
      "A senator on the night of a war authorization.",
    status: "available",
    duration: "20–40 min",
    tone: "Civic · Heavy",
  },
];
