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
    difficulty: 5,
    creator: "House Edition",
    version: "v1.0",
  },
];
