export const rareVisitorCatConfig = {
  storageKey: "nsn.rare-visitor-cat.last-seen.v1",
  probability: 0.02,
  cooldownDays: 7,
  animationDurationMs: 11000,
  reducedMotionDurationMs: 1500,
  messageProbability: 0.35,
  eligibleTabSegments: ["index", "meetups", "profile"] as const,
  excludedRouteSegments: [
    "onboarding",
    "oauth",
    "callback",
    "login",
    "support-guidance",
    "support-resources",
    "legal",
    "event",
    "events",
    "chats",
    "notifications",
    "settings",
    "alpha-walkthrough",
  ] as const,
  excludedRouteTerms: ["report", "safety", "rsvp", "confirmation", "confirm"] as const,
} as const;

export const rareVisitorCatMessages = [
  "Cat inspection complete.",
  "Rio approves of this meetup.",
  "The community has been deemed sufficiently cozy.",
  "No treats detected. Further investigation required.",
] as const;
