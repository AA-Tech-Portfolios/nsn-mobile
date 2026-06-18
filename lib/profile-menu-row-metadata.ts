export type ProfileMenuIcon =
  | "shield"
  | "person.fill"
  | "settings"
  | "sliders"
  | "layout"
  | "life-context"
  | "calendar"
  | "food"
  | "interests"
  | "transport"
  | "contact"
  | "location"
  | "help"
  | "guide"
  | "heart";

export type ProfileOptionGroupId =
  | "profile"
  | "preferences"
  | "appearanceLayout"
  | "safetySupport"
  | "appSettings";

export type ProfileOptionGroupMetadata = {
  id: ProfileOptionGroupId;
  icon: ProfileMenuIcon;
  title: string;
  description: string;
  helperCopy: string;
};

export const profileOptionGroups: ProfileOptionGroupMetadata[] = [
  {
    id: "profile",
    icon: "person.fill",
    title: "Profile",
    description: "Preview, photo, about, vibes, and quick edits.",
    helperCopy: "Profile edits and visibility previews stay local-only in this alpha.",
  },
  {
    id: "preferences",
    icon: "sliders",
    title: "Preferences",
    description: "Privacy, comfort, food, transport, contact, and local area.",
    helperCopy: "Preferences are local-only prototype hints, not matching or ranking rules.",
  },
  {
    id: "appearanceLayout",
    icon: "layout",
    title: "Appearance & Layout",
    description: "Home, event, and profile display choices.",
    helperCopy: "Display choices affect Home, event cards, and Profile locally on this device.",
  },
  {
    id: "safetySupport",
    icon: "shield",
    title: "Safety & Support",
    description: "Guidelines, quiet exits, support links, and report demos.",
    helperCopy: "Support content is guidance only; it does not create live safety or host tracking.",
  },
  {
    id: "appSettings",
    icon: "sliders",
    title: "App Settings",
    description: "Language, alerts, walkthroughs, privacy, and account controls.",
    helperCopy: "App settings stay local-only unless a screen clearly opens an external resource.",
  },
];

export type AppearanceLayoutControlKey = "homeEventCards" | "profileDetailLevel" | "profileWidth";

export type AppearanceLayoutControlMetadata = {
  key: AppearanceLayoutControlKey;
  icon: ProfileMenuIcon | "resize";
  title: string;
  scope: string;
  description: string;
  previewCopy: string;
};

export const appearanceLayoutControlMetadata: AppearanceLayoutControlMetadata[] = [
  {
    key: "homeEventCards",
    icon: "layout",
    title: "Home & event cards",
    scope: "Home and Event Details",
    description: "Controls Home density, event-card layout, preview images, and header control spacing.",
    previewCopy: "Local-only changes that affect how Home and meetup cards scan on this device.",
  },
  {
    key: "profileDetailLevel",
    icon: "person.fill",
    title: "Profile detail level",
    scope: "Profile",
    description: "Switches Profile between a simpler preview and fuller detail.",
    previewCopy: "Use Simple for quiet scanning, or Detailed to review privacy and comfort cards.",
  },
  {
    key: "profileWidth",
    icon: "resize",
    title: "Profile width",
    scope: "Profile",
    description: "Chooses a centered or wider Profile layout.",
    previewCopy: "Width is a local-only display preference for this device.",
  },
];

export type UserPreferenceRowKey =
  | "comfort"
  | "personality"
  | "background"
  | "calendar"
  | "food"
  | "interests"
  | "transport"
  | "contact"
  | "location";

export type UserPreferenceRowMetadata = {
  key: UserPreferenceRowKey;
  groupId: "preferences";
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
    groupId: "preferences",
    icon: "shield",
    title: "Privacy & Comfort",
    description: "Privacy, visibility, social energy, communication, group size, and photo comfort.",
    simpleDescription: "Privacy, visibility, and meeting comfort.",
    badgeKind: "saved",
    chevron: true,
  },
  {
    key: "personality",
    groupId: "preferences",
    icon: "person.fill",
    title: "Personality & Presence",
    description: "Optional appearance, social style, and profile context.",
    simpleDescription: "Optional human context.",
    badgeKind: "count",
    chevron: true,
  },
  {
    key: "background",
    groupId: "preferences",
    icon: "life-context",
    title: "Work, Study & Life Context",
    description: "Optional work, study, learning, and volunteering context.",
    simpleDescription: "Optional life context.",
    badgeKind: "count",
    chevron: true,
  },
  {
    key: "calendar",
    groupId: "preferences",
    icon: "calendar",
    title: "Calendar & Cultural Moments",
    description: "Holidays, observances, and personal calendar moments.",
    simpleDescription: "Dates and moments that matter to you.",
    badgeKind: "private",
    chevron: true,
  },
  {
    key: "food",
    groupId: "preferences",
    icon: "food",
    title: "Food & Beverage",
    description: "Food, drinks, dietary needs, avoidances, and alcohol comfort.",
    simpleDescription: "Food, drinks, and dietary comfort.",
    badgeKind: "count",
    chevron: true,
  },
  {
    key: "interests",
    groupId: "preferences",
    icon: "interests",
    title: "Hobbies & Interests",
    description: "Activities, genres, local exploring, and comfort tags.",
    simpleDescription: "Activities and easy conversation starters.",
    badgeKind: "count",
    chevron: true,
  },
  {
    key: "transport",
    groupId: "preferences",
    icon: "transport",
    title: "Transportation Method",
    description: "Arrival comfort, route access, and travel ease.",
    simpleDescription: "How getting there feels easiest.",
    badgeKind: "summary",
    chevron: true,
  },
  {
    key: "contact",
    groupId: "preferences",
    icon: "contact",
    title: "Contact Preference",
    description: "How you prefer pre-meetup communication.",
    simpleDescription: "How you prefer to communicate.",
    badgeKind: "summary",
    chevron: true,
  },
  {
    key: "location",
    groupId: "preferences",
    icon: "location",
    title: "Location Preference",
    description: "Local area, venue comfort, and location privacy.",
    simpleDescription: "Local area and venue comfort.",
    badgeKind: "summary",
    chevron: true,
  },
];

export type UserPreferenceRowSortMode = "Grouped" | "Alphabetical";

export function getUserPreferenceRows(sortMode: UserPreferenceRowSortMode = "Grouped") {
  if (sortMode === "Alphabetical") {
    return [...userPreferenceRowMetadata].sort((left, right) => left.title.localeCompare(right.title));
  }

  return userPreferenceRowMetadata;
}

export function getUserPreferenceRowDescription(key: UserPreferenceRowKey, mode: UserPreferenceTextMode = "Detailed") {
  const row = userPreferenceRowMetadata.find((item) => item.key === key);

  if (!row) return "";

  return mode === "Simple" ? row.simpleDescription : row.description;
}

export const profileSupportRowMetadata = {
  key: "helpSupport",
  icon: "guide" as const,
  title: "Help & Support",
  description: "Help, feedback, and low-pressure support.",
  badge: "Demo",
  chevron: true,
};

export const profileResourceSupportRowMetadata = {
  key: "supportResources",
  icon: "heart" as const,
  title: "Support & Resources",
  description: "Community, accessibility, wellbeing, and practical resources.",
  badge: "Demo",
  chevron: true,
};

export const profileAppInfoDedication = {
  title: "In loving memory",
  copy:
    "In loving memory of my grandmother.\n\nHer kindness, compassion, and unwavering support helped shape the values behind NSN: care, belonging, and meaningful human connection.",
  placement: "appInfoBottom",
} as const;
