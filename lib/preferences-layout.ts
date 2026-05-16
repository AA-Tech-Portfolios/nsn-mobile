export type PreferenceLayoutDensity = "Compact" | "Comfortable" | "Spacious";
export type PreferenceCategoryKey =
  | "overview"
  | "comfort"
  | "personality"
  | "background"
  | "calendar"
  | "food"
  | "interests"
  | "transport"
  | "contact"
  | "location";

type ResponsiveBasis = number | "100%";

type ResponsiveLayoutStyle = {
  flexGrow: number;
  flexShrink: number;
  flexBasis: ResponsiveBasis;
  minWidth: ResponsiveBasis;
};

export type SettingsPreferenceLayout = {
  isDesktop: boolean;
  sectionGap: number;
  optionGap: number;
  cardPadding: number;
  cardRadius: number;
  minTapTarget: number;
  accordionPadding: number;
  sectionCard: ResponsiveLayoutStyle;
  optionCard: ResponsiveLayoutStyle;
  fullWidthCard: ResponsiveLayoutStyle & { alignSelf: "stretch" };
};

const densityTokens: Record<
  PreferenceLayoutDensity,
  {
    sectionGap: number;
    optionGap: number;
    cardPadding: number;
    cardRadius: number;
    minTapTarget: number;
    accordionPadding: number;
    sectionMinWidth: number;
    optionMinWidth: number;
  }
> = {
  Compact: {
    sectionGap: 10,
    optionGap: 7,
    cardPadding: 12,
    cardRadius: 14,
    minTapTarget: 40,
    accordionPadding: 12,
    sectionMinWidth: 300,
    optionMinWidth: 148,
  },
  Comfortable: {
    sectionGap: 14,
    optionGap: 9,
    cardPadding: 15,
    cardRadius: 18,
    minTapTarget: 44,
    accordionPadding: 15,
    sectionMinWidth: 320,
    optionMinWidth: 160,
  },
  Spacious: {
    sectionGap: 18,
    optionGap: 12,
    cardPadding: 18,
    cardRadius: 20,
    minTapTarget: 48,
    accordionPadding: 18,
    sectionMinWidth: 340,
    optionMinWidth: 176,
  },
};

const mobileBasis: ResponsiveLayoutStyle = {
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: "100%",
  minWidth: "100%",
};

export function getSettingsPreferenceLayout(width: number, density: PreferenceLayoutDensity = "Comfortable"): SettingsPreferenceLayout {
  const tokens = densityTokens[density] ?? densityTokens.Comfortable;
  const isDesktop = width >= 820;
  const sectionCard = isDesktop
    ? { flexGrow: 1, flexShrink: 1, flexBasis: tokens.sectionMinWidth, minWidth: tokens.sectionMinWidth }
    : mobileBasis;
  const optionCard = isDesktop
    ? { flexGrow: 1, flexShrink: 1, flexBasis: tokens.optionMinWidth, minWidth: tokens.optionMinWidth }
    : mobileBasis;

  return {
    isDesktop,
    sectionGap: tokens.sectionGap,
    optionGap: tokens.optionGap,
    cardPadding: tokens.cardPadding,
    cardRadius: tokens.cardRadius,
    minTapTarget: tokens.minTapTarget,
    accordionPadding: tokens.accordionPadding,
    sectionCard,
    optionCard,
    fullWidthCard: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: "100%",
      minWidth: "100%",
      alignSelf: "stretch",
    },
  };
}

export const preferenceCategoryDisplayMetadata: Record<PreferenceCategoryKey, { icon: string; title: string }> = {
  overview: { icon: "👤", title: "User preferences" },
  comfort: { icon: "🛡️", title: "Comfort & trust" },
  personality: { icon: "🌿", title: "Personality & presence" },
  background: { icon: "🎓", title: "Work, study & life context" },
  calendar: { icon: "🗓️", title: "Calendar & cultural moments" },
  food: { icon: "🍽️", title: "Food & beverage" },
  interests: { icon: "🎨", title: "Hobbies & interests" },
  transport: { icon: "🚆", title: "Transportation method" },
  contact: { icon: "💬", title: "Contact preference" },
  location: { icon: "📍", title: "Location preference" },
};

const preferenceCategoryKeyByTitle = new Map(
  (Object.entries(preferenceCategoryDisplayMetadata) as Array<[PreferenceCategoryKey, { icon: string; title: string }]>)
    .map(([key, metadata]) => [metadata.title.trim().toLocaleLowerCase(), key])
);

const calmLabelsWithoutIcons = new Set([
  "block & report",
  "private profile",
  "privacy",
  "prefer not to say",
  "report a problem",
  "safety, privacy & consent details",
  "settings & privacy",
  "trust status",
  "verification / trust status",
  "verified, but private",
]);

const preferenceChipIconByLabel = new Map<string, string>([
  ["ice cream", "🍦"],
  ["admin", "🗂️"],
  ["aged care", "🤝"],
  ["ai", "🤖"],
  ["animal welfare", "🐶"],
  ["art", "🎨"],
  ["arts", "🎨"],
  ["american", "🍔"],
  ["allergy-aware venues", "🛡️"],
  ["australian", "🇦🇺"],
  ["balanced", "⚖️"],
  ["beach days", "🌊"],
  ["beef", "🥩"],
  ["beer", "🍺"],
  ["biscuits", "🍪"],
  ["board games", "🎲"],
  ["books", "📚"],
  ["bubble tea", "🧋"],
  ["building a project", "🛠️"],
  ["burgers", "🍔"],
  ["business", "💼"],
  ["calendar", "📅"],
  ["calendar & cultural moments", "🗓️"],
  ["calendar/cultural moments", "🗓️"],
  ["cakes", "🍰"],
  ["calm", "🌿"],
  ["calm and thoughtful", "🌿"],
  ["carpool okay", "🤝"],
  ["caesar salad", "🥗"],
  ["celebrate", "🎉"],
  ["chicken", "🍗"],
  ["chicken salad", "🥗"],
  ["chinese", "🥟"],
  ["chocolate", "🍫"],
  ["chocolate bars", "🍫"],
  ["chocolate desserts", "🍫"],
  ["chips", "🍟"],
  ["chips/crisps", "🍟"],
  ["cider", "🍎"],
  ["cocktails", "🍸"],
  ["community events", "🤝"],
  ["community gardens", "🌿"],
  ["community services", "🤝"],
  ["community work", "🤝"],
  ["community/group hangouts", "🤝"],
  ["coffee", "☕"],
  ["comfortable with venues that serve alcohol", "🍷"],
  ["cookies", "🍪"],
  ["contact", "💬"],
  ["contact preference", "💬"],
  ["crackers", "🍘"],
  ["creative work", "🎨"],
  ["creative writing", "✍️"],
  ["cycling", "🚲"],
  ["dairy-free", "🥛"],
  ["design", "🎨"],
  ["donuts", "🍩"],
  ["driving", "🚗"],
  ["education", "🎓"],
  ["eggs", "🥚"],
  ["email", "✉️"],
  ["ethiopian", "🇪🇹"],
  ["environmental cleanup", "🌿"],
  ["exploring something new", "🧭"],
  ["faith/community groups", "🤝"],
  ["filipino", "🇵🇭"],
  ["fish", "🐟"],
  ["fitness", "👟"],
  ["finance", "💼"],
  ["freelance", "💻"],
  ["freelancing", "💻"],
  ["food", "🍽️"],
  ["food & beverage", "🍽️"],
  ["food relief", "🍽️"],
  ["food spots", "🍽️"],
  ["french", "🥐"],
  ["fruit", "🍎"],
  ["fruit desserts", "🍓"],
  ["fusion", "✨"],
  ["games", "🎮"],
  ["gaming", "🎮"],
  ["gelato", "🍦"],
  ["getting dropped off", "🚗"],
  ["gluten-free", "🌾"],
  ["good listener", "💬"],
  ["good listeners", "💬"],
  ["garden salad", "🥗"],
  ["greek", "🇬🇷"],
  ["greek salad", "🥗"],
  ["gummies", "🍬"],
  ["health", "🩺"],
  ["healthcare", "🩺"],
  ["halal", "🥘"],
  ["hard candy", "🍬"],
  ["hobbies", "🎨"],
  ["hobbies & interests", "🎨"],
  ["hospitality", "🍽️"],
  ["in person", "👥"],
  ["interested", "🌏"],
  ["interested in study groups", "📚"],
  ["indian", "🇮🇳"],
  ["indonesian", "🇮🇩"],
  ["italian", "🇮🇹"],
  ["japanese", "🇯🇵"],
  ["jelly beans", "🍬"],
  ["juice", "🧃"],
  ["juices", "🧃"],
  ["korean", "🇰🇷"],
  ["kosher", "🍽️"],
  ["lamb", "🍖"],
  ["lebanese", "🇱🇧"],
  ["languages", "🗣️"],
  ["libraries", "📚"],
  ["library", "📚"],
  ["live music", "🎶"],
  ["local clubs", "🤝"],
  ["lollies", "🍬"],
  ["looking for work", "🔎"],
  ["love this", "💛"],
  ["low-message mode", "🔕"],
  ["malaysian", "🇲🇾"],
  ["mango sorbet", "🥭"],
  ["marshmallows", "🍡"],
  ["mental health support", "🤝"],
  ["markets", "🛍️"],
  ["mediterranean", "🫒"],
  ["mexican", "🌮"],
  ["middle eastern", "🥙"],
  ["mints", "🌿"],
  ["mocktails", "🍹"],
  ["museums", "🖼️"],
  ["movies", "🎬"],
  ["music", "🎧"],
  ["not sure yet", "❔"],
  ["noodles", "🍜"],
  ["no pork", "🚫"],
  ["no seafood", "🚫"],
  ["not interested in alcohol-related meetups", "🚫"],
  ["nut allergy", "⚠️"],
  ["nut-free", "🥜"],
  ["nuts", "🥜"],
  ["observe", "🕯️"],
  ["open mode", "✨"],
  ["pasta", "🍝"],
  ["pastries", "🥐"],
  ["pies", "🥧"],
  ["pets", "🐾"],
  ["phone", "📞"],
  ["photography", "📷"],
  ["picnics", "🧺"],
  ["pizza", "🍕"],
  ["popcorn", "🍿"],
  ["pork", "🥓"],
  ["prefer alcohol-free venues", "🚫"],
  ["avoid alcohol venues", "🚫"],
  ["prefer nearby only", "🏠"],
  ["prefer non-alcohol venues", "🔕"],
  ["prefer quiet plans", "🌙"],
  ["prefer smaller conversations", "🌙"],
  ["public transport", "🚌"],
  ["quiet music", "🎧"],
  ["rice bowls", "🍚"],
  ["rice dishes", "🍚"],
  ["reading", "📚"],
  ["reminders only", "🕰️"],
  ["research", "🔬"],
  ["retail", "🛍️"],
  ["rideshare", "🚕"],
  ["salads", "🥗"],
  ["sandwiches", "🥪"],
  ["schnitzels", "🍽️"],
  ["seafood", "🦐"],
  ["seafood allergy", "⚠️"],
  ["smoothies", "🥤"],
  ["soft drinks", "🥤"],
  ["science", "🔬"],
  ["small business", "💼"],
  ["small groups", "🧑‍🤝‍🧑"],
  ["small groups only", "🧑‍🤝‍🧑"],
  ["somewhere in between", "⚖️"],
  ["social", "💬"],
  ["soups", "🍲"],
  ["sorbet", "🍧"],
  ["sour lollies", "🍬"],
  ["sparkling water", "🫧"],
  ["spirits", "🥃"],
  ["strawberry", "🍓"],
  ["student", "🎓"],
  ["student work", "🎓"],
  ["studied before", "🎓"],
  ["studying", "🎓"],
  ["sugar-free sweets", "🍬"],
  ["taking a break", "🌿"],
  ["tea", "🍵"],
  ["teaching", "🎓"],
  ["technology", "💻"],
  ["thai", "🇹🇭"],
  ["text", "📱"],
  ["tofu", "🫘"],
  ["toasties", "🥪"],
  ["trail mix", "🥜"],
  ["trades", "🛠️"],
  ["transport", "🚆"],
  ["transportation", "🚆"],
  ["transportation method", "🚆"],
  ["turkish", "🇹🇷"],
  ["vegetarian-friendly", "🥗"],
  ["vegetarian", "🥗"],
  ["vegan", "🌱"],
  ["vegan-friendly", "🌱"],
  ["vanilla", "🍨"],
  ["vietnamese", "🇻🇳"],
  ["water", "💧"],
  ["video", "🎥"],
  ["wine", "🍷"],
  ["volunteering", "🤝"],
  ["walking", "🚶"],
  ["walks", "🚶"],
  ["warm up mode", "🌤️"],
  ["wraps", "🌯"],
  ["working", "💼"],
  ["writing", "✍️"],
]);

function normalizePreferenceLabel(label: string) {
  return label.trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function stripSelectedPrefix(label: string) {
  return label.trim().replace(/^selected:\s*/i, "");
}

function getLabelParts(label: string) {
  const [head, ...tail] = label.split(":");
  return [label, head, tail.join(":")].map((part) => part.trim()).filter(Boolean);
}

function startsWithDisplayIcon(label: string, iconOverride?: string) {
  if (iconOverride && label.startsWith(`${iconOverride} `)) return true;

  const firstToken = label.trim().split(/\s+/)[0] ?? "";
  return /[\p{Extended_Pictographic}\p{Regional_Indicator}]/u.test(firstToken);
}

export function getPreferenceCategoryIcon(category: PreferenceCategoryKey | string, fallback?: string) {
  const normalized = normalizePreferenceLabel(category);
  const categoryKey = (normalized in preferenceCategoryDisplayMetadata
    ? normalized
    : preferenceCategoryKeyByTitle.get(normalized)) as PreferenceCategoryKey | undefined;

  return categoryKey ? preferenceCategoryDisplayMetadata[categoryKey].icon : fallback;
}

export function formatPreferenceCategoryChipLabel(label: string, category: PreferenceCategoryKey | string, fallbackIcon?: string) {
  return formatPreferenceChipLabel(label, getPreferenceCategoryIcon(category, fallbackIcon));
}

export function getPreferenceChipIcon(label: string) {
  const normalized = normalizePreferenceLabel(label);
  if (calmLabelsWithoutIcons.has(normalized)) return undefined;

  for (const part of getLabelParts(normalized)) {
    if (calmLabelsWithoutIcons.has(part)) return undefined;
    const icon = preferenceChipIconByLabel.get(part);
    if (icon) return icon;
  }

  return getPreferenceCategoryIcon(normalized);
}

export function formatPreferenceChipLabel(label: string, iconOverride?: string) {
  const trimmedLabel = stripSelectedPrefix(label);
  const icon = getPreferenceChipIcon(trimmedLabel) ?? iconOverride;

  if (!icon) return trimmedLabel;
  if (trimmedLabel === icon || trimmedLabel.startsWith(`${icon} `)) return trimmedLabel;
  if (startsWithDisplayIcon(trimmedLabel, iconOverride)) return trimmedLabel;

  return `${icon} ${trimmedLabel}`;
}

export function formatSelectedPreferenceChipLabel(label: string, iconOverride?: string) {
  return `Selected: ${formatPreferenceChipLabel(label, iconOverride)}`;
}

export type SettingsBackTarget = {
  pathname: string;
  params?: Record<string, string>;
};

const profileBackTarget: SettingsBackTarget = { pathname: "/(tabs)/profile" };

const settingsBackTargetBySource: Record<string, SettingsBackTarget> = {
  chats: { pathname: "/(tabs)/chats" },
  events: { pathname: "/(tabs)/events" },
  home: { pathname: "/(tabs)" },
  meetups: { pathname: "/(tabs)/meetups" },
  notifications: { pathname: "/(tabs)/notifications" },
  profile: profileBackTarget,
  "alpha-walkthrough": { pathname: "/(tabs)/alpha-walkthrough" },
  "user-options": { pathname: "/(tabs)/profile", params: { menu: "options" } },
};

export function getSettingsBackTarget(source?: string | string[]): SettingsBackTarget {
  const rawSource = Array.isArray(source) ? source[0] : source;
  const normalizedSource = rawSource?.trim();

  if (!normalizedSource) return profileBackTarget;
  if (normalizedSource.startsWith("/")) return { pathname: normalizedSource };

  return settingsBackTargetBySource[normalizedSource] ?? profileBackTarget;
}
