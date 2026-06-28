export type MissionStatus = "available" | "classified" | "locked";

export type MissionMeta = {
  id: string;
  number: string; // displayed as "01", "02"...
  codename: string;
  title: string;
  logline: string; // narrative hook — first line of the scene
  status: MissionStatus;
  route?: string;
  duration?: string;
  tone?: string;
  // Archival metadata — feels like a case file
  location?: string;
  year?: string;
  category?: string;
  /** Single primary theme tag for Reading Room filtering. */
  theme?: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  // Reserved for future creator-published cases
  creator?: string;
  version?: string;
};

export const MISSIONS: MissionMeta[] = [
  {
    id: "mission-01",
    number: "01",
    codename: "The Release",
    title: "The Release",
    logline:
      "Twelve minutes before the boardroom. The model is ready. The memo is not.",
    status: "available",
    duration: "20–40 min",
    tone: "Tense · Suspended",
    location: "San Francisco",
    year: "2024",
    category: "Corporate",
    theme: "Disclosure",
    difficulty: 3,
    creator: "House Edition",
    version: "v1.0",
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
    location: "Undisclosed",
    year: "2019",
    category: "Legal",
    theme: "Complicity",
    difficulty: 4,
    creator: "House Edition",
    version: "v1.0",
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
    location: "Low Earth Orbit",
    year: "2031",
    category: "Aerospace",
    theme: "Sacrifice",
    difficulty: 5,
    creator: "House Edition",
    version: "v1.0",
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
    location: "Washington, D.C.",
    year: "2003",
    category: "Civic",
    theme: "Authority",
    difficulty: 4,
    creator: "House Edition",
    version: "v1.0",
  },
  {
    id: "mission-05",
    number: "05",
    codename: "Code Black",
    title: "Code Black",
    logline:
      "Pay the people who did this, or watch the monitors. You have until the next alarm.",
    status: "available",
    duration: "20–40 min",
    tone: "Clinical · Under siege",
    location: "Meridian General Hospital",
    year: "2025",
    category: "Crisis",
    theme: "Coercion",
    difficulty: 4,
    creator: "House Edition",
    version: "v1.0",
  },
  {
    id: "mission-06",
    number: "06",
    codename: "Recant",
    title: "Recant",
    logline:
      "The front page is being held. The accusation that started a reckoning was a lie. You have until midnight.",
    status: "available",
    duration: "20–40 min",
    tone: "Moral · After hours",
    location: "Newsroom, investigations desk",
    year: "Present day",
    category: "Ethics",
    theme: "Truth",
    difficulty: 5,
    creator: "House Edition",
    version: "v1.0",
  },
  {
    id: "mission-07",
    number: "07",
    codename: "Spillway",
    title: "Spillway",
    logline:
      "Open the gate and the parish drowns by dawn. Hold it and the city might. The call is yours, now.",
    status: "available",
    duration: "20–40 min",
    tone: "Procedural · 3 a.m. dread",
    location: "Carrow River control station",
    year: "Flood season",
    category: "Crisis",
    theme: "Triage",
    difficulty: 5,
    creator: "House Edition",
    version: "v1.0",
  },
  {
    id: "mission-08",
    number: "08",
    codename: "Eighty Names",
    title: "Eighty Names",
    logline:
      "Your oldest friend softened the number. The device is in the field. The records request is pending.",
    status: "available",
    duration: "20–40 min",
    tone: "Intimate · Late-night thriller",
    location: "Veyra Medical, empty office",
    year: "Present day",
    category: "Ethics",
    theme: "Loyalty",
    difficulty: 5,
    creator: "House Edition",
    version: "v1.0",
  },
  {
    id: "mission-09",
    number: "09",
    codename: "The Interpreter",
    title: "The Interpreter",
    logline:
      "The other side's interpreter softened the clause. The convoy moves at first light. You alone heard it.",
    status: "available",
    duration: "20–40 min",
    tone: "Hushed · Political thriller",
    location: "Besieged city, ceasefire room",
    year: "1995",
    category: "Ethics",
    theme: "Witness",
    difficulty: 5,
    creator: "House Edition",
    version: "v1.0",
  },
];
