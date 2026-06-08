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
    description: "Preview, photo, about, vibes, and quick profile edits.",
    helperCopy: "Profile is the social surface. Edits and visibility previews stay local-only in this alpha.",
  },
  {
    id: "preferences",
    icon: "sliders",
    title: "Preferences",
    description: "Privacy, comfort, interests, food, transport, contact, and local area preferences.",
    helperCopy: "Preferences are prototype hints only, saved locally without matching or ranking claims.",
  },
  {
    id: "appearanceLayout",
    icon: "layout",
    title: "Appearance & Layout",
    description: "Home, event, and profile display choices.",
    helperCopy: "Layout choices affect how this prototype looks on this device.",
  },
  {
    id: "safetySupport",
    icon: "shield",
    title: "Safety & Support",
    description: "Community guidelines, quiet exits, support links, and report-shaped demos.",
    helperCopy: "Support content is guidance only, with no live safety, host tracking, or backend review connected.",
  },
  {
    id: "appSettings",
    icon: "settings",
    title: "App Settings",
    description: "Language, privacy settings, alerts, walkthroughs, and prototype account controls.",
    helperCopy: "App settings are local-only controls unless a screen clearly says it opens an external resource.",
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
    description: "Controls Home density, event-card layout, preview images, and header control density.",
    previewCopy: "Changes are local-only and affect how meetup cards scan on this device.",
  },
  {
    key: "profileDetailLevel",
    icon: "person.fill",
    title: "Profile detail level",
    scope: "Profile",
    description: "Switches Profile between a simpler social preview and the fuller detailed view.",
    previewCopy: "Use Simple for a quieter profile, or Detailed when reviewing privacy and comfort cards.",
  },
  {
    key: "profileWidth",
    icon: "resize",
    title: "Profile width",
    scope: "Profile",
    description: "Chooses whether Profile stays centered or uses a wider dashboard-style layout.",
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
    description: "Privacy, profile visibility, social energy, communication, group size, photo comfort, and local-only meeting preferences.",
    simpleDescription: "Privacy, visibility, and meeting comfort.",
    badgeKind: "saved",
    chevron: true,
  },
  {
    key: "personality",
    groupId: "preferences",
    icon: "person.fill",
    title: "Personality & Presence",
    description: "Optional appearance, social style, and connection context for blurred profiles.",
    simpleDescription: "Optional human context.",
    badgeKind: "count",
    chevron: true,
  },
  {
    key: "background",
    groupId: "preferences",
    icon: "life-context",
    title: "Work, Study & Life Context",
    description: "Optional work, study, learning, and volunteering context with visibility controls.",
    simpleDescription: "Optional life context.",
    badgeKind: "count",
    chevron: true,
  },
  {
    key: "calendar",
    groupId: "preferences",
    icon: "calendar",
    title: "Calendar & Cultural Moments",
    description: "Holidays, festivals, observances, and personal calendar seasons.",
    simpleDescription: "Dates and moments that matter to you.",
    badgeKind: "private",
    chevron: true,
  },
  {
    key: "food",
    groupId: "preferences",
    icon: "food",
    title: "Food & Beverage",
    description: "Cuisines, drinks, dietary needs, avoidances, and alcohol comfort.",
    simpleDescription: "Food, drinks, and dietary comfort.",
    badgeKind: "count",
    chevron: true,
  },
  {
    key: "interests",
    groupId: "preferences",
    icon: "interests",
    title: "Hobbies & Interests",
    description: "Activities, genres, local exploring, and comfort-aware tags.",
    simpleDescription: "Activities and easy conversation starters.",
    badgeKind: "count",
    chevron: true,
  },
  {
    key: "transport",
    groupId: "preferences",
    icon: "transport",
    title: "Transportation Method",
    description: "Arrival comfort, route access, and travel pressure.",
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
  icon: "help" as const,
  title: "Help & Support",
  description: "Get help, send feedback, or suggest improvements.",
  badge: "Demo",
  chevron: true,
};

export const profileResourceSupportRowMetadata = {
  key: "supportResources",
  icon: "heart" as const,
  title: "Support & Resources",
  description: "Explore gentle community, accessibility, wellbeing, and practical life resources.",
  badge: "Demo",
  chevron: true,
};
