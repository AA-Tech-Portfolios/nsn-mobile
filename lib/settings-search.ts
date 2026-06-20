export type SettingsSectionJumpId =
  | "settingsView"
  | "batteryPerformance"
  | "generalPrivacy"
  | "profileVisibility"
  | "trustFoundations"
  | "profilePreview"
  | "nameDisplay"
  | "photoBlur"
  | "gender"
  | "notifications"
  | "locationDiscovery"
  | "regionalFormats"
  | "legalPrivacy"
  | "safetyContact"
  | "accessibility"
  | "appearance"
  | "language"
  | "generalSettings";

export type SettingsSearchResult = {
  id: SettingsSectionJumpId;
  label: string;
  description: string;
  aliases: string[];
};

export const settingsSearchItems: SettingsSearchResult[] = [
  {
    id: "settingsView",
    label: "View",
    description: "Settings view, basic mode, advanced mode, and layout density.",
    aliases: ["settings", "view", "mode", "basic", "advanced", "layout"],
  },
  {
    id: "batteryPerformance",
    label: "Battery",
    description: "Battery saver, low light mode, power, and performance controls.",
    aliases: ["battery", "performance", "power", "low light", "brightness"],
  },
  {
    id: "generalPrivacy",
    label: "Privacy",
    description: "Private profile, Soft Reveal, profile blur, and visibility basics.",
    aliases: ["privacy", "private", "visibility", "blur", "soft reveal"],
  },
  {
    id: "profileVisibility",
    label: "Visibility",
    description: "Show or hide profile fields like age, suburb, interests, and gender.",
    aliases: ["visibility", "show age", "age", "preferred age", "suburb", "profile fields"],
  },
  {
    id: "trustFoundations",
    label: "Readiness",
    description: "Readiness, verification preview, contact comfort, photo, and recording choices.",
    aliases: [
      "readiness",
      "verification",
      "verified",
      "photo",
      "recording",
      "video",
      "screenshots",
      "comfort",
      "contact",
    ],
  },
  {
    id: "profilePreview",
    label: "Preview",
    description: "Profile preview card and visible profile summary.",
    aliases: ["preview", "profile preview", "card"],
  },
  {
    id: "nameDisplay",
    label: "Names",
    description: "First, middle, and last name display settings.",
    aliases: ["name", "nickname", "middle name", "last name"],
  },
  {
    id: "photoBlur",
    label: "Photo blur",
    description: "Profile photo blur and photo visibility settings.",
    aliases: ["photo", "picture", "image", "blur"],
  },
  {
    id: "gender",
    label: "Gender",
    description: "Optional gender display settings.",
    aliases: ["gender"],
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Meetup reminders, chat notifications, weather alerts, and snooze.",
    aliases: ["notifications", "alerts", "reminders", "snooze", "chat"],
  },
  {
    id: "locationDiscovery",
    label: "Location",
    description: "Suburb, local area, approximate location, and distance settings.",
    aliases: ["location", "suburb", "local area", "distance", "nearby"],
  },
  {
    id: "regionalFormats",
    label: "Formats",
    description: "Time, date, units, temperature, distance, and currency formats.",
    aliases: ["formats", "time", "date", "units", "temperature", "currency"],
  },
  {
    id: "legalPrivacy",
    label: "Legal & Privacy",
    description: "Prototype privacy, terms, consent, legal, and data notes.",
    aliases: ["legal", "privacy", "terms", "consent", "data"],
  },
  {
    id: "safetyContact",
    label: "Safety",
    description: "Safety, support, check-ins, message requests, and account contact controls.",
    aliases: ["safety", "support", "message", "contact", "check-in"],
  },
  {
    id: "accessibility",
    label: "Accessibility",
    description: "Larger text, contrast, motion, and screen reader settings.",
    aliases: ["accessibility", "larger text", "contrast", "motion", "screen reader"],
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Theme, palette, day/night, card outlines, and visual style.",
    aliases: ["appearance", "theme", "palette", "day", "night", "visual"],
  },
  {
    id: "language",
    label: "Language",
    description: "App language and translation language settings.",
    aliases: ["language", "translation", "locale"],
  },
  {
    id: "generalSettings",
    label: "Prototype account",
    description:
      "Open onboarding, alpha walkthrough, tiny tutorials, reset defaults, and account pause.",
    aliases: [
      "prototype account",
      "account",
      "onboarding",
      "restart onboarding",
      "open onboarding",
      "tour",
      "walkthrough",
      "tiny tutorials",
      "tutorials",
      "reset",
      "defaults",
    ],
  },
];

const normalizeSettingsSearch = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, " ");

const scoreSettingsSearchResult = (item: SettingsSearchResult, query: string) => {
  const label = normalizeSettingsSearch(item.label);
  const description = normalizeSettingsSearch(item.description);
  const aliases = item.aliases.map(normalizeSettingsSearch);

  if (label === query) return 0;
  if (label.startsWith(query)) return 1;
  if (label.includes(query)) return 2;
  if (aliases.some((alias) => alias === query)) return 3;
  if (aliases.some((alias) => alias.startsWith(query))) return 4;
  if (aliases.some((alias) => alias.includes(query))) return 5;
  if (description.includes(query)) return 6;
  return null;
};

export function getSettingsSearchResults(query: string, limit = 8) {
  const normalizedQuery = normalizeSettingsSearch(query);
  if (!normalizedQuery) return [];

  return settingsSearchItems
    .map((item, index) => ({
      item,
      index,
      score: scoreSettingsSearchResult(item, normalizedQuery),
    }))
    .filter(
      (result): result is { item: SettingsSearchResult; index: number; score: number } =>
        result.score !== null,
    )
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .slice(0, limit)
    .map((result) => result.item);
}
