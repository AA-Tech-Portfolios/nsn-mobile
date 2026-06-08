export type PreferenceLayoutDensity = "Compact" | "Comfortable" | "Spacious";
export type EmojiDisplayMode =
  | "Full emoji display"
  | "Reduced emojis"
  | "Minimal icons only"
  | "Text-first mode";
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
  overview: { icon: "👤", title: "User Preferences" },
  comfort: { icon: "🛡️", title: "Comfort & Trust" },
  personality: { icon: "🌿", title: "Personality & Presence" },
  background: { icon: "🎓", title: "Work, Study & Life Context" },
  calendar: { icon: "🗓️", title: "Calendar & Cultural Moments" },
  food: { icon: "🍽️", title: "Food & Beverage" },
  interests: { icon: "🎨", title: "Hobbies & Interests" },
  transport: { icon: "🚆", title: "Transportation Method" },
  contact: { icon: "💬", title: "Contact Preference" },
  location: { icon: "📍", title: "Location Preference" },
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
  "readiness preview",
  "readiness preview private",
]);

export const emojiDisplayModeOptions: EmojiDisplayMode[] = [
  "Full emoji display",
  "Reduced emojis",
  "Minimal icons only",
  "Text-first mode",
];

const emojiDisplayModeSet = new Set<string>(emojiDisplayModeOptions);

export function normalizeEmojiDisplayMode(value?: string | null): EmojiDisplayMode {
  return value && emojiDisplayModeSet.has(value) ? value as EmojiDisplayMode : "Full emoji display";
}

const preferenceChipIconByLabel = new Map<string, string>([
  ["ice cream", "🍦"],
  ["admin", "🗂️"],
  ["aged care", "🤝"],
  ["ai", "🤖"],
  ["animal welfare", "🐶"],
  ["approaching people can feel hard", "🌿"],
  ["aquariums", "🐠"],
  ["aquarium visit", "🐠"],
  ["art", "🎨"],
  ["arts", "🎨"],
  ["arcades", "🕹️"],
  ["arcade outing", "🕹️"],
  ["american", "🍔"],
  ["accessibility details coming later", "🛠️"],
  ["allergy-aware venues", "🛡️"],
  ["australian", "🇦🇺"],
  ["balanced", "⚖️"],
  ["beach days", "🌊"],
  ["beach walk", "🌊"],
  ["beef", "🥩"],
  ["beer", "🍺"],
  ["biscuits", "🍪"],
  ["board games", "🎲"],
  ["books", "📚"],
  ["bookstore browsing", "📚"],
  ["bubble tea", "🧋"],
  ["bubble tea meetup", "🧋"],
  ["bring earbuds/headphones if helpful", "🎧"],
  ["busy/noisy places can feel draining", "🔕"],
  ["building a project", "🛠️"],
  ["burgers", "🍔"],
  ["business", "💼"],
  ["calendar", "📅"],
  ["calendar & cultural moments", "🗓️"],
  ["calendar/cultural moments", "🗓️"],
  ["cakes", "🍰"],
  ["calm", "🌿"],
  ["calm & quiet", "🌿"],
  ["calm and thoughtful", "🌿"],
  ["calm around animals", "🐾"],
  ["calm gathering", "🌿"],
  ["calm meetup alternative nearby", "🌿"],
  ["calm seating area", "🪑"],
  ["carpool okay", "🤝"],
  ["casual dining", "🍽️"],
  ["casual social", "💬"],
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
  ["café meetup", "☕"],
  ["comfortable with expressive/social energy", "✨"],
  ["comfortable with venues that serve alcohol", "🍷"],
  ["conversation-heavy", "💬"],
  ["conversation-light", "🕯️"],
  ["cookies", "🍪"],
  ["contact", "💬"],
  ["contact preference", "💬"],
  ["crackers", "🍘"],
  ["crowd-sensitive", "🌿"],
  ["creative hobbies", "🎨"],
  ["creative work", "🎨"],
  ["creative writing", "✍️"],
  ["cycling", "🚲"],
  ["dairy-free", "🥛"],
  ["design", "🎨"],
  ["dessert meetup", "🍦"],
  ["donuts", "🍩"],
  ["driving", "🚗"],
  ["education", "🎓"],
  ["eggs", "🥚"],
  ["email", "✉️"],
  ["ethiopian", "🇪🇹"],
  ["environmental cleanup", "🌿"],
  ["easy step-out/reset nearby", "🚪"],
  ["exercise consistency can be difficult", "🚶"],
  ["exploring something new", "🧭"],
  ["explorative/day out", "🧭"],
  ["faith/community groups", "🤝"],
  ["family-friendly language preferred", "💬"],
  ["filipino", "🇵🇭"],
  ["fish", "🐟"],
  ["fitness", "👟"],
  ["finance", "💼"],
  ["freelance", "💻"],
  ["freelancing", "💻"],
  ["food", "🍽️"],
  ["food & beverage", "🍽️"],
  ["food court meetup", "🍽️"],
  ["food-focused", "🍽️"],
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
  ["group lunch/dinner", "🍽️"],
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
  ["i overthink social situations sometimes", "💬"],
  ["i prefer gentle pacing", "🌿"],
  ["i recharge alone sometimes", "🕯️"],
  ["i warm up slowly socially", "🌿"],
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
  ["native english speaker", "💬"],
  ["fluent english", "💬"],
  ["advanced english", "🌿"],
  ["still learning english", "🌱"],
  ["prefer simple english", "📝"],
  ["comfortable with slower conversation", "🌿"],
  ["happy to help others practise english", "🤝"],
  ["prefer multilingual-friendly meetups", "🌐"],
  ["lower-pressure participation", "🌿"],
  ["lower sensory stimulation", "🌿"],
  ["low-noise venue", "🔕"],
  ["lower-noise alternative nearby", "🔕"],
  ["loud environment possible", "🔊"],
  ["large crowds okay", "👥"],
  ["large groups can feel overwhelming", "👥"],
  ["lego/building sets", "🧱"],
  ["lego/building hobby meetup", "🧱"],
  ["malaysian", "🇲🇾"],
  ["mango sorbet", "🥭"],
  ["marshmallows", "🍡"],
  ["mental health support", "🤝"],
  ["markets", "🛍️"],
  ["night market visit", "🛍️"],
  ["mediterranean", "🫒"],
  ["mexican", "🌮"],
  ["middle eastern", "🥙"],
  ["mints", "🌿"],
  ["mocktails", "🍹"],
  ["mild fragrances okay", "🌿"],
  ["motivation can fluctuate", "🌊"],
  ["museums", "🖼️"],
  ["movies", "🎬"],
  ["music", "🎧"],
  ["not sure yet", "❔"],
  ["noodles", "🍜"],
  ["no pork", "🚫"],
  ["no seafood", "🚫"],
  ["noise-sensitive friendly", "🌿"],
  ["nearby parking", "🅿️"],
  ["nearby transport", "🚉"],
  ["not interested in alcohol-related meetups", "🚫"],
  ["nut allergy", "⚠️"],
  ["nut-free", "🥜"],
  ["nuts", "🥜"],
  ["observe", "🕯️"],
  ["okay with casual swearing", "💬"],
  ["open mode", "✨"],
  ["outdoor airflow", "🍃"],
  ["outdoor animal exposure possible", "🐾"],
  ["outdoor smoking okay", "🌳"],
  ["pasta", "🍝"],
  ["pastries", "🥐"],
  ["pies", "🥧"],
  ["pets", "🐾"],
  ["pet-friendly meetup", "🐾"],
  ["pet-free meetup", "🚫"],
  ["phone", "📞"],
  ["photography", "📷"],
  ["picnics", "🧺"],
  ["picnic gathering", "🧺"],
  ["pizza", "🍕"],
  ["popcorn", "🍿"],
  ["pork", "🥓"],
  ["public restroom access", "🚻"],
  ["prefer alcohol-free venues", "🚫"],
  ["avoid alcohol venues", "🚫"],
  ["prefer calmer language", "💬"],
  ["prefer fresh-air/open venues", "🍃"],
  ["prefer fresh-air spaces", "🍃"],
  ["prefer low-scent environments", "🍃"],
  ["prefer lower-intensity conversations", "🌿"],
  ["prefer animal-free indoor spaces", "🏠"],
  ["prefer nearby only", "🏠"],
  ["prefer non-alcohol venues", "🔕"],
  ["prefer quiet plans", "🌙"],
  ["prefer smaller conversations", "🌙"],
  ["public transport", "🚌"],
  ["public event nearby", "📍"],
  ["quiet cafes", "☕"],
  ["quiet cafés", "☕"],
  ["quiet corners available", "🌿"],
  ["quiet music", "🎧"],
  ["quiet recharge nearby", "🌿"],
  ["quiet recharge space nearby", "🌿"],
  ["quiet reset areas nearby", "🌿"],
  ["rice bowls", "🍚"],
  ["rice dishes", "🍚"],
  ["reading", "📚"],
  ["reminders only", "🕰️"],
  ["research", "🔬"],
  ["retail", "🛍️"],
  ["shopping centre hangout", "🛍️"],
  ["rideshare", "🚕"],
  ["salads", "🥗"],
  ["sandwiches", "🥪"],
  ["schnitzels", "🍽️"],
  ["seafood", "🦐"],
  ["seafood allergy", "⚠️"],
  ["smoothies", "🥤"],
  ["sleep schedules can vary", "🕰️"],
  ["soft drinks", "🥤"],
  ["science", "🔬"],
  ["small business", "💼"],
  ["small celebrations", "🎉"],
  ["small groups", "🧑‍🤝‍🧑"],
  ["small groups only", "🧑‍🤝‍🧑"],
  ["small groups preferred", "🧑‍🤝‍🧑"],
  ["smaller subgroup available", "🧑‍🤝‍🧑"],
  ["smoke-free meetup preferred", "🌿"],
  ["somewhere in between", "⚖️"],
  ["social", "💬"],
  ["sensitive to cigarette smoke", "🌬️"],
  ["sensitive to pets/allergies", "⚠️"],
  ["sensitive to strong perfumes/colognes", "🌿"],
  ["sensitive to vape smoke", "🌬️"],
  ["seating available", "🪑"],
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
  ["step-free access", "♿"],
  ["strong fragrances uncomfortable", "🌬️"],
  ["strong smells possible", "🌬️"],
  ["sugar-free sweets", "🍬"],
  ["taking a break", "🌿"],
  ["tea", "🍵"],
  ["teaching", "🎓"],
  ["technology", "💻"],
  ["theme parks", "🎢"],
  ["theme park outing", "🎢"],
  ["indoor backup available", "🏠"],
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
  ["water parks", "🌊"],
  ["water park outing", "🌊"],
  ["water nearby", "💧"],
  ["wheelchair-accessible routes", "♿"],
  ["video", "🎥"],
  ["wine", "🍷"],
  ["volunteering", "🤝"],
  ["walking", "🚶"],
  ["walks", "🚶"],
  ["window shopping", "🛍️"],
  ["flexible pacing", "↔️"],
  ["flexible pacing welcome", "↔️"],
  ["flexible social pacing", "↔️"],
  ["fireworks/event noise possible", "🎆"],
  ["energetic/social vibe", "✨"],
  ["high-energy social vibe", "✨"],
  ["join at your own pace", "🌿"],
  ["join/leave flexibly", "🚪"],
  ["leave whenever you need", "🚪"],
  ["loud music possible", "🎶"],
  ["pool party", "🏊"],
  ["chill alternative meetup", "🌿"],
  ["close-friends vibe", "🤝"],
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

function stripDisplayIcon(label: string) {
  return label.trim().replace(/^[\p{Extended_Pictographic}\p{Regional_Indicator}\uFE0F\u200D]+\s*/u, "");
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

export function formatPreferenceCategoryChipLabel(
  label: string,
  category: PreferenceCategoryKey | string,
  fallbackIcon?: string,
  emojiDisplayMode: EmojiDisplayMode = "Full emoji display"
) {
  return formatPreferenceChipLabel(label, getPreferenceCategoryIcon(category, fallbackIcon), emojiDisplayMode, true);
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

export function formatPreferenceChipLabel(
  label: string,
  iconOverride?: string,
  emojiDisplayMode: EmojiDisplayMode = "Full emoji display",
  preserveContextIcon = false
) {
  const mode = normalizeEmojiDisplayMode(emojiDisplayMode);
  const rawLabel = stripSelectedPrefix(label);
  if (mode === "Full emoji display" && startsWithDisplayIcon(rawLabel, iconOverride)) return rawLabel;

  const trimmedLabel = stripDisplayIcon(rawLabel);
  if (mode === "Text-first mode" || mode === "Minimal icons only") return trimmedLabel;
  if (mode === "Reduced emojis" && !preserveContextIcon) return trimmedLabel;

  const icon = getPreferenceChipIcon(trimmedLabel) ?? iconOverride;

  if (!icon) return trimmedLabel;
  if (trimmedLabel === icon || trimmedLabel.startsWith(`${icon} `)) return trimmedLabel;
  if (startsWithDisplayIcon(trimmedLabel, iconOverride)) return trimmedLabel;

  return `${icon} ${trimmedLabel}`;
}

export function formatSelectedPreferenceChipLabel(
  label: string,
  iconOverride?: string,
  emojiDisplayMode: EmojiDisplayMode = "Full emoji display",
  preserveContextIcon = false
) {
  return `Selected: ${formatPreferenceChipLabel(label, iconOverride, emojiDisplayMode, preserveContextIcon)}`;
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
  comfortTrust: { pathname: "/(tabs)/profile", params: { menu: "comfortTrust" } },
  display: { pathname: "/(tabs)/profile", params: { menu: "display" } },
  preferences: { pathname: "/(tabs)/profile", params: { menu: "preferences" } },
};

export function getSettingsBackTarget(source?: string | string[]): SettingsBackTarget {
  const rawSource = Array.isArray(source) ? source[0] : source;
  const normalizedSource = rawSource?.trim();

  if (!normalizedSource) return profileBackTarget;
  if (normalizedSource.startsWith("/")) return { pathname: normalizedSource };

  return settingsBackTargetBySource[normalizedSource] ?? profileBackTarget;
}
