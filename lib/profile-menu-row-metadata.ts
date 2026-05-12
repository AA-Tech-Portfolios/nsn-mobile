export type ProfileMenuIcon =
  | "shield"
  | "life-context"
  | "calendar"
  | "food"
  | "interests"
  | "transport"
  | "contact"
  | "location"
  | "help";

export type UserPreferenceRowKey =
  | "comfort"
  | "background"
  | "calendar"
  | "food"
  | "interests"
  | "transport"
  | "contact"
  | "location";

export type UserPreferenceRowMetadata = {
  key: UserPreferenceRowKey;
  icon: ProfileMenuIcon;
  title: string;
  description: string;
  simpleDescription: string;
  badgeKind: "saved" | "count" | "summary" | "private";
  chevron: true;
};

export type UserPreferenceTextMode = "Simple" | "Detailed";

export const userPreferenceRowMetadata: UserPreferenceRowMetadata[] = [
  {
    key: "comfort",
    icon: "shield",
    title: "Comfort & trust",
    description: "Visibility, social energy, communication, group size, verification, and photo comfort.",
    simpleDescription: "Visibility, trust, and meeting comfort.",
    badgeKind: "saved",
    chevron: true,
  },
  {
    key: "background",
    icon: "life-context",
    title: "Work, study & life context",
    description: "Optional work, study, learning, and volunteering context with visibility controls.",
    simpleDescription: "Optional life context.",
    badgeKind: "count",
    chevron: true,
  },
  {
    key: "calendar",
    icon: "calendar",
    title: "Calendar & cultural moments",
    description: "Holidays, festivals, observances, and personal calendar seasons.",
    simpleDescription: "Dates and moments that matter to you.",
    badgeKind: "private",
    chevron: true,
  },
  {
    key: "food",
    icon: "food",
    title: "Food & beverage",
    description: "Cuisines, drinks, dietary needs, avoidances, and alcohol comfort.",
    simpleDescription: "Food, drinks, and dietary comfort.",
    badgeKind: "count",
    chevron: true,
  },
  {
    key: "interests",
    icon: "interests",
    title: "Hobbies & interests",
    description: "Activities, genres, local exploring, and comfort-aware tags.",
    simpleDescription: "Activities and easy conversation starters.",
    badgeKind: "count",
    chevron: true,
  },
  {
    key: "transport",
    icon: "transport",
    title: "Transportation Method",
    description: "Arrival comfort, route access, and travel pressure.",
    simpleDescription: "How getting there feels easiest.",
    badgeKind: "summary",
    chevron: true,
  },
  {
    key: "contact",
    icon: "contact",
    title: "Contact Preference",
    description: "How you prefer pre-meetup communication.",
    simpleDescription: "How you prefer to communicate.",
    badgeKind: "summary",
    chevron: true,
  },
  {
    key: "location",
    icon: "location",
    title: "Location Preference",
    description: "Local area, venue comfort, and location privacy.",
    simpleDescription: "Local area and venue comfort.",
    badgeKind: "summary",
    chevron: true,
  },
];

export function getUserPreferenceRowDescription(key: UserPreferenceRowKey, mode: UserPreferenceTextMode = "Detailed") {
  const row = userPreferenceRowMetadata.find((item) => item.key === key);

  if (!row) return "";

  return mode === "Simple" ? row.simpleDescription : row.description;
}

export const profileSupportRowMetadata = {
  key: "helpSupport",
  icon: "help" as const,
  title: "Help & Support",
  description: "Get help, send feedback, or suggest improvements.",
  badge: "Demo",
  chevron: true,
};
