import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import {
  defaultComfortPreferences,
  type EventMembership,
  type PostEventFeedback,
  type SafetyReport,
  type SavedPlace,
  type SoftHelloComfortPreference,
  type SoftHelloVerificationLevel,
} from "./softhello-mvp";
import type { NoiseLevel } from "./nsn-data";
import { getBrandTheme, normalizeBrandThemeId, type BrandThemeId } from "./brand-theme";
import {
  defaultSkyThemeId,
  getSkyTheme,
  normalizeSkyThemeId,
  type SkyThemeId,
} from "./sky-themes";
import {
  defaultCalendarMomentStates,
  defaultCalendarMomentVisibility,
  defaultCustomCalendarMoments,
  normalizeCalendarMomentStates,
  normalizeCalendarMomentVisibility,
  normalizeCustomCalendarMoments,
  type CalendarMomentStates,
  type CalendarMomentVisibility,
  type CustomCalendarMoment,
} from "./preferences/calendar-moments";
import {
  defaultFoodBeveragePreferenceIds,
  normalizeFoodBeveragePreferenceIds,
} from "./preferences/food-preferences";
import {
  clearAllLocalPrototypeData as clearStoredLocalPrototypeData,
  SOFTHELLO_ONBOARDING_STORAGE_KEY,
} from "./local-prototype-storage";
import {
  defaultInterestComfortTagsByInterest,
  defaultInterestPreferenceIds,
  normalizeInterestComfortTagsByInterest,
  normalizeInterestPreferenceIds,
} from "./preferences/interests";
import { normalizeEmojiDisplayMode, type EmojiDisplayMode } from "./preferences-layout";
import {
  normalizePersonalityPresenceChoice,
  normalizePersonalityPresenceList,
  normalizePersonalityPresencePromptResponses,
  personalityPresenceAccessoriesOptions,
  personalityPresenceComfortAroundOptions,
  personalityPresenceConnectionOptions,
  personalityPresenceEyeOptions,
  personalityPresenceFacialHairOptions,
  personalityPresenceGroomingOptions,
  personalityPresenceHairCueOptions,
  personalityPresenceHairOptions,
  personalityPresencePersonalStyleOptions,
  personalityPresencePresentationOptions,
  personalityPresenceSocialStyleOptions,
  personalityPresenceStyleOptions,
  personalityPresenceVoicePresenceOptions,
  type PersonalityPresenceAccessories,
  type PersonalityPresenceComfortAround,
  type PersonalityPresenceConnectionPreference,
  type PersonalityPresenceEyes,
  type PersonalityPresenceFacialHair,
  type PersonalityPresenceGrooming,
  type PersonalityPresenceHair,
  type PersonalityPresenceHairCue,
  type PersonalityPresencePersonalStyle,
  type PersonalityPresencePresentation,
  type PersonalityPresencePromptResponse,
  type PersonalityPresenceSocialStyle,
  type PersonalityPresenceStyle,
  type PersonalityPresenceVoicePresence,
} from "./preferences/personality-presence";
import type { SoftRevealPace } from "./soft-reveal";
import {
  defaultExternalLinksPreference,
  normalizeExternalLinksPreference,
  type ExternalLinksPreference,
} from "./external-links";

export type AppPaletteId = "midnight" | "ocean" | "forest" | "sunset" | "lavender";

export type AppPalette = {
  id: AppPaletteId;
  label: string;
  description: string;
  swatches: string[];
};

export const appPalettes: AppPalette[] = [
  {
    id: "midnight",
    label: "Midnight NSN",
    description: "Dusk navy, slate blue, and restrained harbour-light accents.",
    swatches: ["#0B1626", "#0F1B2C", "#536C9E", "#7CAAC9", "#C7B07A"],
  },
  {
    id: "ocean",
    label: "Ocean Calm",
    description: "Blue, aqua, and soft sky tones.",
    swatches: ["#0B2234", "#173A55", "#4F79A8", "#7CAAC9", "#E6EDF1"],
  },
  {
    id: "forest",
    label: "Forest Social",
    description: "Evergreen surfaces with warm friendly highlights.",
    swatches: ["#071B14", "#123326", "#2F8F5B", "#72D67E", "#C7B07A"],
  },
  {
    id: "sunset",
    label: "Sunset Warm",
    description: "Warm coral and gold accents for a softer mood.",
    swatches: ["#211018", "#3A1D2A", "#FF6B6B", "#F7C85B", "#FFECE2"],
  },
  {
    id: "lavender",
    label: "Lavender Quiet",
    description: "Soft purple accents for a calmer social feel.",
    swatches: ["#130F2A", "#231B45", "#7C6CFF", "#B8A7FF", "#F0ECFF"],
  },
];

export const getLanguageBase = (language: string) => language.replace(/\s+\([^)]+\)$/, "");

export const DEFAULT_NSN_LANGUAGE = "English (Australia)";

export type NsnLanguageSupportStatus =
  | "Alpha active"
  | "Partially translated"
  | "Needs community review"
  | "Coming later";

export type NsnLanguageOption = {
  label: string;
  nativeName: string;
  flag: string;
  code: string;
  status: NsnLanguageSupportStatus;
  selectable: boolean;
  translationBase?: string;
  note: string;
};

export const nsnLocalLanguageOptions = [
  {
    label: "English (Australia)",
    nativeName: "English · Australia",
    flag: "🇦🇺",
    code: "en-AU",
    status: "Alpha active",
    selectable: true,
    translationBase: "English",
    note: "Primary Sydney/North Shore alpha language.",
  },
  {
    label: "Hebrew",
    nativeName: "עברית",
    flag: "🇮🇱",
    code: "he",
    status: "Partially translated",
    selectable: true,
    translationBase: "Hebrew",
    note: "Visible for alpha testing; needs continued community review.",
  },
  {
    label: "Chinese (Simplified)",
    nativeName: "简体中文",
    flag: "🇨🇳",
    code: "zh-Hans",
    status: "Partially translated",
    selectable: true,
    translationBase: "Chinese",
    note: "Uses the current Simplified Chinese strings where available.",
  },
  {
    label: "Chinese (Traditional)",
    nativeName: "繁體中文",
    flag: "🌐",
    code: "zh-Hant",
    status: "Partially translated",
    selectable: true,
    translationBase: "English",
    note: "Visible for staging; falls back to English until Traditional Chinese copy is reviewed.",
  },
  {
    label: "Korean",
    nativeName: "한국어",
    flag: "🇰🇷",
    code: "ko",
    status: "Partially translated",
    selectable: true,
    translationBase: "Korean",
    note: "Visible for alpha testing; needs continued community review.",
  },
  {
    label: "Japanese",
    nativeName: "日本語",
    flag: "🇯🇵",
    code: "ja",
    status: "Partially translated",
    selectable: true,
    translationBase: "Japanese",
    note: "Visible for alpha testing; needs continued community review.",
  },
] as const;

export type NsnLocalLanguage = (typeof nsnLocalLanguageOptions)[number]["label"];

export const nsnPlannedLocalCommunityLanguageOptions = [
  {
    label: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    code: "hi",
    status: "Needs community review",
    selectable: false,
    note: "Planned for Sydney community review after alpha.",
  },
  {
    label: "Arabic",
    nativeName: "العربية",
    flag: "🌐",
    code: "ar",
    status: "Needs community review",
    selectable: false,
    note: "Planned for local community review; not fully translated.",
  },
  {
    label: "Vietnamese",
    nativeName: "Tiếng Việt",
    flag: "🇻🇳",
    code: "vi",
    status: "Needs community review",
    selectable: false,
    note: "Planned for local community review; not fully translated.",
  },
  {
    label: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
    flag: "🌐",
    code: "pa",
    status: "Needs community review",
    selectable: false,
    note: "Planned for local community review; not fully translated.",
  },
  {
    label: "Persian / Farsi",
    nativeName: "فارسی",
    flag: "🌐",
    code: "fa",
    status: "Needs community review",
    selectable: false,
    note: "Planned for local community review; not fully translated.",
  },
  {
    label: "Filipino / Tagalog",
    nativeName: "Filipino / Tagalog",
    flag: "🇵🇭",
    code: "fil",
    status: "Needs community review",
    selectable: false,
    note: "Planned for local community review; not fully translated.",
  },
  {
    label: "Indonesian",
    nativeName: "Bahasa Indonesia",
    flag: "🇮🇩",
    code: "id",
    status: "Needs community review",
    selectable: false,
    note: "Planned for local community review; not fully translated.",
  },
  {
    label: "Malay / Bahasa Melayu",
    nativeName: "Bahasa Melayu",
    flag: "🌐",
    code: "ms",
    status: "Needs community review",
    selectable: false,
    note: "Planned for local community review; not fully translated.",
  },
] as const;

export const nsnPlannedGlobalLanguageOptions = [
  {
    label: "Spanish",
    nativeName: "Español",
    flag: "🌐",
    code: "es",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
  {
    label: "French",
    nativeName: "Français",
    flag: "🌐",
    code: "fr",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
  {
    label: "German",
    nativeName: "Deutsch",
    flag: "🌐",
    code: "de",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
  {
    label: "Portuguese",
    nativeName: "Português",
    flag: "🌐",
    code: "pt",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
  {
    label: "Italian",
    nativeName: "Italiano",
    flag: "🌐",
    code: "it",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
  {
    label: "Dutch",
    nativeName: "Nederlands",
    flag: "🌐",
    code: "nl",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
  {
    label: "Greek",
    nativeName: "Ελληνικά",
    flag: "🌐",
    code: "el",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
  {
    label: "Turkish",
    nativeName: "Türkçe",
    flag: "🌐",
    code: "tr",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
  {
    label: "Russian",
    nativeName: "Русский",
    flag: "🌐",
    code: "ru",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
  {
    label: "Ukrainian",
    nativeName: "Українська",
    flag: "🌐",
    code: "uk",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
  {
    label: "Swedish",
    nativeName: "Svenska",
    flag: "🌐",
    code: "sv",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
  {
    label: "Danish",
    nativeName: "Dansk",
    flag: "🌐",
    code: "da",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
  {
    label: "Norwegian",
    nativeName: "Norsk",
    flag: "🌐",
    code: "no",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
  {
    label: "Finnish",
    nativeName: "Suomi",
    flag: "🌐",
    code: "fi",
    status: "Coming later",
    selectable: false,
    note: "Future SoftHello/global expansion candidate.",
  },
] as const;

const supportedLanguageLabels = new Set<string>(
  nsnLocalLanguageOptions.map((language) => language.label),
);

export function normalizeNsnLanguage(language?: string | null): NsnLocalLanguage {
  if (!language) return DEFAULT_NSN_LANGUAGE;

  if (supportedLanguageLabels.has(language)) {
    return language as NsnLocalLanguage;
  }

  const baseLanguage = getLanguageBase(language);

  if (language === "English (AU)" || baseLanguage === "English") return DEFAULT_NSN_LANGUAGE;
  if (
    language === "Chinese (Traditional)" ||
    language === "Chinese (Taiwan)" ||
    language === "Chinese (Hong Kong)" ||
    language === "Traditional Chinese"
  )
    return "Chinese (Traditional)";
  if (baseLanguage === "Chinese") return "Chinese (Simplified)";
  if (baseLanguage === "Hebrew") return "Hebrew";
  if (baseLanguage === "Korean") return "Korean";
  if (baseLanguage === "Japanese") return "Japanese";

  return DEFAULT_NSN_LANGUAGE;
}

export function getTranslationLanguageBase(language: string) {
  const normalizedLanguage = normalizeNsnLanguage(language);
  const languageOption = nsnLocalLanguageOptions.find(
    (option) => option.label === normalizedLanguage,
  );

  return languageOption?.translationBase ?? getLanguageBase(normalizedLanguage);
}

const ONBOARDING_STORAGE_KEY = SOFTHELLO_ONBOARDING_STORAGE_KEY;
const MIN_ADULT_AGE = 18;
const MAX_PROFILE_AGE = 95;
const MAX_PREFERRED_AGE_SPAN = 35;

const normalizeAdultAge = (value: number | null | undefined) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return Math.min(MAX_PROFILE_AGE, Math.max(MIN_ADULT_AGE, Math.round(value)));
};

const normalizePreferredAge = (value: number | undefined, fallback: number) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  return Math.min(MAX_PROFILE_AGE, Math.max(MIN_ADULT_AGE, Math.round(value)));
};

const normalizePreferredAgeRange = (minValue?: number, maxValue?: number) => {
  const min = normalizePreferredAge(minValue, 25);
  const max = Math.max(min, normalizePreferredAge(maxValue, 40));

  return { min, max: Math.min(MAX_PROFILE_AGE, min + MAX_PREFERRED_AGE_SPAN, max) };
};

const normalizeNameDisplayMode = (
  value: unknown,
  fallback: ProfileNameDisplayMode = "Hidden",
): ProfileNameDisplayMode =>
  value === "Initial" || value === "Full" || value === "Hidden" ? value : fallback;

export type SoftHelloIntent = "Friends" | "Dating" | "Both" | "Exploring";
export type SoftHelloVisibility = "Blurred" | "Visible";
export type NsnComfortMode = "Comfort Mode" | "Warm Up Mode" | "Open Mode";
export type NsnBlurLevel = "Soft blur" | "Medium blur" | "Strong blur";
export type ProfileShortcutLayout = "Clean" | "Expanded";
export type ProfileWidthPreference = "Contained" | "Wide";
export type NoiseLevelPreference = "Any" | NoiseLevel;
export type TransportationMethod =
  | "Driving"
  | "Public transport"
  | "Walking"
  | "Cycling"
  | "Rideshare"
  | "Getting dropped off"
  | "Not sure yet";
export type ContactPreference = "In person" | "Text" | "Email" | "Phone" | "Video";
export type FriendshipStylePreference =
  | "Casual friendships"
  | "Deeper friendships"
  | "Activity-based friendships"
  | "Small familiar circle"
  | "Open to gradual connection"
  | "Conversation-focused"
  | "Shared hobbies first";
export type DatingStylePreference =
  | "Friendship-first dating"
  | "Slow-burn connection"
  | "Casual dating"
  | "Long-term relationship open"
  | "Exploring without pressure"
  | "Prefer getting to know people slowly";
export type MeetupRhythmPreference =
  | "One-time meetup"
  | "Weekly"
  | "Fortnightly"
  | "Monthly"
  | "Occasional/random"
  | "Seasonal/special events";
export type AvailabilityTimingPreference =
  | "Weekdays"
  | "Weekends"
  | "Daytime"
  | "Evenings"
  | "Late-night friendly"
  | "Flexible schedule";
export type SocialDurationPreference =
  | "Quick meetup (30-45 mins)"
  | "About an hour"
  | "1-2 hours"
  | "Several hours okay"
  | "Half-day outing"
  | "Flexible timing"
  | "Leave anytime";
export type LanguageComfortPreference =
  | "Native English speaker"
  | "Fluent English"
  | "Advanced English"
  | "Still learning English"
  | "Prefer simple English"
  | "Comfortable with slower conversation"
  | "Happy to help others practise English"
  | "Prefer multilingual-friendly meetups"
  | "Prefer not to say";
export type TransportationPreference =
  | "Walking"
  | "Public transport"
  | "Train"
  | "Metro"
  | "Bus"
  | "Ferry"
  | "Light rail"
  | "Driving"
  | "Parking needed"
  | "Rideshare / taxi"
  | "Cycling"
  | "Carpool okay"
  | "Prefer nearby only"
  | "Avoid long travel"
  | "Step-free / accessible routes preferred"
  | "Short trips only"
  | "Comfortable travelling at night"
  | "Prefer daytime travel"
  | "Prefer well-lit routes"
  | "Prefer close to public transport";
export type MeetupContactPreference =
  | "In-app chat"
  | "Details only"
  | "Low-message mode"
  | "Chat before meetup"
  | "Group chat okay"
  | "Direct messages okay"
  | "Voice call okay"
  | "No voice calls"
  | "Reminders only"
  | "Prefer clear plans"
  | "Prefer short messages"
  | "Okay with check-ins"
  | "Slow replies are okay"
  | "Reply when I can"
  | "Same-day messages okay"
  | "Prefer planning ahead"
  | "Last-minute plans okay"
  | "No pressure to reply quickly";
export type LocationComfortPreference =
  | "Near my selected suburb"
  | "North Shore preferred"
  | "Sydney CBD okay"
  | "Northern Beaches okay"
  | "Inner West okay"
  | "Close to public transport"
  | "Parking nearby"
  | "Indoor venues"
  | "Outdoor venues"
  | "Quiet venues"
  | "Well-lit areas"
  | "Familiar places"
  | "Easy exit / easy to leave"
  | "Avoid crowded venues"
  | "Avoid loud bars"
  | "Prefer smoke-free venues"
  | "Sensitive to cigarette smoke"
  | "Sensitive to vape smoke"
  | "Outdoor smoking okay"
  | "Prefer fresh-air/open venues"
  | "Smoke-free meetup preferred"
  | "Sensitive to strong perfumes/colognes"
  | "Prefer low-scent environments"
  | "Mild fragrances okay"
  | "Strong fragrances uncomfortable"
  | "Prefer fresh-air spaces"
  | "Prefer lighter conversation first"
  | "Okay discussing deeper topics later"
  | "Prefer avoiding politics initially"
  | "Prefer avoiding religion debates"
  | "Avoid personal questioning early on"
  | "Prefer gradual familiarity"
  | "Sensitive to sarcasm-heavy humour"
  | "Prefer calmer humour"
  | "Comfortable with playful banter"
  | "Prefer respectful language"
  | "Family-friendly tone preferred"
  | "Quiet/shared-activity focused"
  | "Debate-friendly (optional/specialized events only)"
  | "Prefer calmer language"
  | "Family-friendly language preferred"
  | "Okay with casual swearing"
  | "Prefer lower-intensity conversations"
  | "Comfortable with expressive/social energy"
  | "Calm atmosphere"
  | "Light/social conversation"
  | "Deeper discussion welcome"
  | "Humour-friendly"
  | "Quiet/shared activity"
  | "Family-friendly tone"
  | "Flexible conversation pacing"
  | "Public restroom access"
  | "Step-free access"
  | "Seating available"
  | "Quiet seating areas"
  | "Nearby transport"
  | "Nearby parking"
  | "Indoor backup available"
  | "Water nearby"
  | "Wheelchair-accessible routes"
  | "Low-noise venue"
  | "Loud environment possible"
  | "Bring earbuds/headphones if helpful"
  | "Noise-sensitive friendly"
  | "Quiet recharge nearby"
  | "Lower-noise alternative nearby"
  | "Accessibility details coming later"
  | "Prefer daytime locations"
  | "Comfortable with evening locations"
  | "Do not show exact location"
  | "Share suburb only"
  | "Share region only"
  | "Ask before sharing location";
export type SocialEnergyPreference = "Calm" | "Balanced" | "Social" | "Lively";
export type CommunicationPreference =
  | "Chat before meetup"
  | "Details only"
  | "Voice okay"
  | "In-person first"
  | "Low-message mode"
  | "Reminders only";
export type GroupSizePreference =
  | "1:1"
  | "2-3 people"
  | "4-6 people"
  | "Small groups only"
  | "Flexible";
export type PhotoRecordingComfortPreference =
  | "Ask me first"
  | "No photos of me"
  | "Group photos are okay"
  | "Venue/event photos are okay"
  | "No videos please"
  | "No public posting without permission"
  | "Prefer no screenshots of chats/profile";
export type PhysicalContactComfortPreference =
  | "No physical contact"
  | "Ask first"
  | "Handshake okay"
  | "Hugs only if I offer"
  | "Prefer personal space";
export type BackgroundVisibilityPreference =
  | "Private"
  | "Shared preview visibility only"
  | "Visible on profile preview"
  | "Ask me first"
  | "Prefer not to say";
export type BackgroundStudyStatusPreference =
  | "Currently studying"
  | "Studied before"
  | "Self-study / online learning"
  | "Interested in study groups"
  | "Prefer not to say";
export type BackgroundStudyAreaPreference =
  | "Technology"
  | "Design"
  | "Psychology"
  | "Business"
  | "Health"
  | "Education"
  | "Arts"
  | "Trades"
  | "Languages"
  | "Science"
  | "Writing"
  | "Other";
export type BackgroundWorkPreference =
  | "Technology"
  | "Hospitality"
  | "Retail"
  | "Healthcare"
  | "Education"
  | "Creative work"
  | "Trades"
  | "Admin"
  | "Finance"
  | "Community services"
  | "Freelance"
  | "Student work"
  | "Not currently working"
  | "Prefer not to say";
export type BackgroundWorkRhythmPreference =
  | "Weekdays"
  | "Weekends"
  | "Shift work"
  | "Remote/hybrid"
  | "Flexible"
  | "Prefer not to say";
export type BackgroundCommunityPreference =
  | "Animal welfare"
  | "Environmental cleanup"
  | "Community events"
  | "Food relief"
  | "Mental health support"
  | "Youth support"
  | "Aged care"
  | "Disability support"
  | "Local clubs"
  | "Faith/community groups"
  | "Community gardens"
  | "Prefer not to say";
export type LifeContextCurrentStatePreference =
  | "Working"
  | "Studying"
  | "Volunteering"
  | "Freelancing"
  | "Looking for work"
  | "Taking a break"
  | "Caring responsibilities"
  | "Retired"
  | "Building a project"
  | "Exploring something new"
  | "Prefer not to say";
export type LifeContextFieldPreference =
  | "Technology"
  | "Design"
  | "Hospitality"
  | "Retail"
  | "Healthcare"
  | "Education"
  | "Creative work"
  | "Trades"
  | "Finance"
  | "Community services"
  | "Admin"
  | "Research"
  | "Media"
  | "Business"
  | "Science"
  | "Student"
  | "Other"
  | "Prefer not to say";
export type LifeContextLearningPreference =
  | "Coding"
  | "Design"
  | "Psychology"
  | "Languages"
  | "Small business"
  | "Creative writing"
  | "Community work"
  | "Music"
  | "Art"
  | "Health"
  | "Teaching"
  | "AI"
  | "Science"
  | "History"
  | "Volunteering";
export type LifeComfortPreference =
  | "Approaching people can feel hard"
  | "I warm up slowly socially"
  | "Large groups can feel overwhelming"
  | "Sleep schedules can vary"
  | "Motivation can fluctuate"
  | "Exercise consistency can be difficult"
  | "I recharge alone sometimes"
  | "Busy/noisy places can feel draining"
  | "I overthink social situations sometimes"
  | "I prefer gentle pacing"
  | "Prefer not to say";
export type ProfileGender = "Not specified" | "Male" | "Female" | "Other";
export type ProfileNameDisplayMode = "Hidden" | "Initial" | "Full";
export type SettingsPrivacyMode = "Basic" | "Advanced";
export type UserPreferenceTextMode = "Simple" | "Detailed";
export type AccountPauseTimeline = "A few days" | "One week" | "One month" | "Until I return";
export type LowLightLevel = "Gentle" | "Medium" | "Deep";
export type NotificationSnoozePreset =
  | "1 hour"
  | "Tonight"
  | "24 hours"
  | "Until I turn it back on";
export type HomeViewMode = "Essential" | "Comfortable";
export type HomeEventLayout = "List" | "Map";
export type HomeLayoutDensity = "Compact" | "Comfortable" | "Spacious";
export type HomeHeaderControlsDensity = "Compact" | "Comfortable" | "Spacious";
export type HomeCardLayout =
  | "Vertical list"
  | "Horizontal cards"
  | "Boxed grid"
  | "Layered cards"
  | "Magazine";
export type HomeEventVisualMode = "Emoji/Icon" | "Preview image";
export type DateFormatPreference =
  | "Device / locale"
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "YYYY/MM/DD"
  | "YY/MM/DD"
  | "DD.MM.YYYY"
  | "DD-MM-YYYY"
  | "YYYY-MM-DD";
export type TimeFormatPreference = "Device / locale" | "12-hour clock" | "24-hour clock";
export type ClockDisplayStyle = "Digital" | "Analog";
export type TemperatureUnitPreference = "Device / locale" | "Celsius" | "Fahrenheit";
export type DistanceUnitPreference = "Device / locale" | "Kilometres" | "Miles";
export type CurrencyDisplayPreference = "Device / locale" | "AUD" | "USD" | "EUR" | "GBP";
export type DayNightModePreference =
  | "Manual toggle"
  | "Follow system/device time"
  | "Follow selected suburb/local time";
export type CardOutlineStyle = "Minimal" | "Standard" | "Strong";
export type HomeVisibleSections = {
  weather: boolean;
  map: boolean;
  noiseGuide: boolean;
  search: boolean;
  recommendedEvents: boolean;
  dayEvents: boolean;
  nightEvents: boolean;
};
export type HomeSectionOrderKey = keyof HomeVisibleSections;

export const socialEnergyOptions: SocialEnergyPreference[] = [
  "Calm",
  "Balanced",
  "Social",
  "Lively",
];
export const communicationPreferenceOptions: CommunicationPreference[] = [
  "Chat before meetup",
  "Details only",
  "Voice okay",
  "In-person first",
  "Low-message mode",
  "Reminders only",
];
export const groupSizePreferenceOptions: GroupSizePreference[] = [
  "1:1",
  "2-3 people",
  "4-6 people",
  "Small groups only",
  "Flexible",
];
export const photoRecordingComfortOptions: PhotoRecordingComfortPreference[] = [
  "Ask me first",
  "No photos of me",
  "Group photos are okay",
  "Venue/event photos are okay",
  "No videos please",
  "No public posting without permission",
  "Prefer no screenshots of chats/profile",
];
export const defaultPhotoRecordingComfortPreferences: PhotoRecordingComfortPreference[] = [
  "Ask me first",
  "No public posting without permission",
  "Prefer no screenshots of chats/profile",
];
export const physicalContactComfortOptions: PhysicalContactComfortPreference[] = [
  "No physical contact",
  "Ask first",
  "Handshake okay",
  "Hugs only if I offer",
  "Prefer personal space",
];
export const defaultPhysicalContactComfortPreferences: PhysicalContactComfortPreference[] = [
  "Ask first",
  "Prefer personal space",
];
export const backgroundVisibilityOptions: BackgroundVisibilityPreference[] = [
  "Private",
  "Shared preview visibility only",
  "Visible on profile preview",
  "Ask me first",
  "Prefer not to say",
];
export const backgroundStudyStatusOptions: BackgroundStudyStatusPreference[] = [
  "Currently studying",
  "Studied before",
  "Self-study / online learning",
  "Interested in study groups",
  "Prefer not to say",
];
export const backgroundStudyAreaOptions: BackgroundStudyAreaPreference[] = [
  "Technology",
  "Design",
  "Psychology",
  "Business",
  "Health",
  "Education",
  "Arts",
  "Trades",
  "Languages",
  "Science",
  "Writing",
  "Other",
];
export const backgroundWorkOptions: BackgroundWorkPreference[] = [
  "Technology",
  "Hospitality",
  "Retail",
  "Healthcare",
  "Education",
  "Creative work",
  "Trades",
  "Admin",
  "Finance",
  "Community services",
  "Freelance",
  "Student work",
  "Not currently working",
  "Prefer not to say",
];
export const backgroundWorkRhythmOptions: BackgroundWorkRhythmPreference[] = [
  "Weekdays",
  "Weekends",
  "Shift work",
  "Remote/hybrid",
  "Flexible",
  "Prefer not to say",
];
export const backgroundCommunityOptions: BackgroundCommunityPreference[] = [
  "Animal welfare",
  "Environmental cleanup",
  "Community events",
  "Food relief",
  "Mental health support",
  "Youth support",
  "Aged care",
  "Disability support",
  "Local clubs",
  "Faith/community groups",
  "Community gardens",
  "Prefer not to say",
];
export const lifeContextCurrentStateOptions: LifeContextCurrentStatePreference[] = [
  "Working",
  "Studying",
  "Volunteering",
  "Freelancing",
  "Looking for work",
  "Taking a break",
  "Caring responsibilities",
  "Retired",
  "Building a project",
  "Exploring something new",
  "Prefer not to say",
];
export const lifeContextFieldOptions: LifeContextFieldPreference[] = [
  "Technology",
  "Design",
  "Hospitality",
  "Retail",
  "Healthcare",
  "Education",
  "Creative work",
  "Trades",
  "Finance",
  "Community services",
  "Admin",
  "Research",
  "Media",
  "Business",
  "Science",
  "Student",
  "Other",
  "Prefer not to say",
];
export const lifeContextLearningOptions: LifeContextLearningPreference[] = [
  "Coding",
  "Design",
  "Psychology",
  "Languages",
  "Small business",
  "Creative writing",
  "Community work",
  "Music",
  "Art",
  "Health",
  "Teaching",
  "AI",
  "Science",
  "History",
  "Volunteering",
];
export const lifeComfortOptions: LifeComfortPreference[] = [
  "Approaching people can feel hard",
  "I warm up slowly socially",
  "Large groups can feel overwhelming",
  "Sleep schedules can vary",
  "Motivation can fluctuate",
  "Exercise consistency can be difficult",
  "I recharge alone sometimes",
  "Busy/noisy places can feel draining",
  "I overthink social situations sometimes",
  "I prefer gentle pacing",
  "Prefer not to say",
];

export type DietaryPreference =
  | "No preference"
  | "Vegetarian"
  | "Vegan"
  | "Halal"
  | "Kosher"
  | "Gluten-free"
  | "Dairy-free"
  | "Nut allergy"
  | "Seafood allergy"
  | "Prefer non-alcohol venues";

export const defaultHomeVisibleSections: HomeVisibleSections = {
  weather: true,
  map: true,
  noiseGuide: false,
  search: false,
  recommendedEvents: true,
  dayEvents: true,
  nightEvents: true,
};

export const defaultHomeSectionOrder: HomeSectionOrderKey[] = [
  "recommendedEvents",
  "dayEvents",
  "nightEvents",
  "weather",
  "map",
  "search",
  "noiseGuide",
];

const previousHomeSectionOrders: HomeSectionOrderKey[][] = [
  ["weather", "recommendedEvents", "dayEvents", "nightEvents", "map", "search", "noiseGuide"],
  ["weather", "map", "recommendedEvents", "dayEvents", "nightEvents", "search", "noiseGuide"],
];

const getFirstHomeEventSectionIndex = (order: HomeSectionOrderKey[]) => {
  const indexes = (["recommendedEvents", "dayEvents", "nightEvents"] as const)
    .map((key) => order.indexOf(key))
    .filter((index) => index >= 0);

  return indexes.length > 0 ? Math.min(...indexes) : -1;
};

export const transportationPreferenceOptions: TransportationPreference[] = [
  "Walking",
  "Public transport",
  "Train",
  "Metro",
  "Bus",
  "Ferry",
  "Light rail",
  "Driving",
  "Parking needed",
  "Rideshare / taxi",
  "Cycling",
  "Carpool okay",
  "Prefer nearby only",
  "Avoid long travel",
  "Step-free / accessible routes preferred",
  "Short trips only",
  "Comfortable travelling at night",
  "Prefer daytime travel",
  "Prefer well-lit routes",
  "Prefer close to public transport",
];
export const defaultTransportationPreferences: TransportationPreference[] = [
  "Public transport",
  "Walking",
  "Prefer nearby only",
];
export const friendshipStyleOptions: FriendshipStylePreference[] = [
  "Casual friendships",
  "Deeper friendships",
  "Activity-based friendships",
  "Small familiar circle",
  "Open to gradual connection",
  "Conversation-focused",
  "Shared hobbies first",
];
export const datingStyleOptions: DatingStylePreference[] = [
  "Friendship-first dating",
  "Slow-burn connection",
  "Casual dating",
  "Long-term relationship open",
  "Exploring without pressure",
  "Prefer getting to know people slowly",
];
export const meetupRhythmOptions: MeetupRhythmPreference[] = [
  "One-time meetup",
  "Weekly",
  "Fortnightly",
  "Monthly",
  "Occasional/random",
  "Seasonal/special events",
];
export const availabilityTimingOptions: AvailabilityTimingPreference[] = [
  "Weekdays",
  "Weekends",
  "Daytime",
  "Evenings",
  "Late-night friendly",
  "Flexible schedule",
];
export const socialDurationOptions: SocialDurationPreference[] = [
  "Quick meetup (30-45 mins)",
  "About an hour",
  "1-2 hours",
  "Several hours okay",
  "Half-day outing",
  "Flexible timing",
  "Leave anytime",
];
export const languageComfortOptions: LanguageComfortPreference[] = [
  "Native English speaker",
  "Fluent English",
  "Advanced English",
  "Still learning English",
  "Prefer simple English",
  "Comfortable with slower conversation",
  "Happy to help others practise English",
  "Prefer multilingual-friendly meetups",
  "Prefer not to say",
];
export const meetupContactPreferenceOptions: MeetupContactPreference[] = [
  "In-app chat",
  "Details only",
  "Low-message mode",
  "Chat before meetup",
  "Group chat okay",
  "Direct messages okay",
  "Voice call okay",
  "No voice calls",
  "Reminders only",
  "Prefer clear plans",
  "Prefer short messages",
  "Okay with check-ins",
  "Slow replies are okay",
  "Reply when I can",
  "Same-day messages okay",
  "Prefer planning ahead",
  "Last-minute plans okay",
  "No pressure to reply quickly",
];
export const defaultMeetupContactPreferences: MeetupContactPreference[] = [
  "Details only",
  "Low-message mode",
  "Reminders only",
];
export const locationComfortPreferenceOptions: LocationComfortPreference[] = [
  "Near my selected suburb",
  "North Shore preferred",
  "Sydney CBD okay",
  "Northern Beaches okay",
  "Inner West okay",
  "Close to public transport",
  "Parking nearby",
  "Indoor venues",
  "Outdoor venues",
  "Quiet venues",
  "Well-lit areas",
  "Familiar places",
  "Easy exit / easy to leave",
  "Avoid crowded venues",
  "Avoid loud bars",
  "Prefer smoke-free venues",
  "Sensitive to cigarette smoke",
  "Sensitive to vape smoke",
  "Outdoor smoking okay",
  "Prefer fresh-air/open venues",
  "Smoke-free meetup preferred",
  "Sensitive to strong perfumes/colognes",
  "Prefer low-scent environments",
  "Mild fragrances okay",
  "Strong fragrances uncomfortable",
  "Prefer fresh-air spaces",
  "Prefer lighter conversation first",
  "Okay discussing deeper topics later",
  "Prefer avoiding politics initially",
  "Prefer avoiding religion debates",
  "Avoid personal questioning early on",
  "Prefer gradual familiarity",
  "Sensitive to sarcasm-heavy humour",
  "Prefer calmer humour",
  "Comfortable with playful banter",
  "Prefer respectful language",
  "Family-friendly tone preferred",
  "Quiet/shared-activity focused",
  "Debate-friendly (optional/specialized events only)",
  "Prefer calmer language",
  "Family-friendly language preferred",
  "Okay with casual swearing",
  "Prefer lower-intensity conversations",
  "Comfortable with expressive/social energy",
  "Calm atmosphere",
  "Light/social conversation",
  "Deeper discussion welcome",
  "Humour-friendly",
  "Quiet/shared activity",
  "Family-friendly tone",
  "Flexible conversation pacing",
  "Public restroom access",
  "Step-free access",
  "Seating available",
  "Quiet seating areas",
  "Nearby transport",
  "Nearby parking",
  "Indoor backup available",
  "Water nearby",
  "Wheelchair-accessible routes",
  "Low-noise venue",
  "Loud environment possible",
  "Bring earbuds/headphones if helpful",
  "Noise-sensitive friendly",
  "Quiet recharge nearby",
  "Lower-noise alternative nearby",
  "Accessibility details coming later",
  "Prefer daytime locations",
  "Comfortable with evening locations",
  "Do not show exact location",
  "Share suburb only",
  "Share region only",
  "Ask before sharing location",
];
export const defaultLocationComfortPreferences: LocationComfortPreference[] = [
  "North Shore preferred",
  "Quiet venues",
  "Share suburb only",
];

const normalizeHomeVisibleSections = (
  value?: Partial<HomeVisibleSections> | null,
): HomeVisibleSections => ({
  ...defaultHomeVisibleSections,
  ...(value ?? {}),
});

const normalizeHomeSectionOrder = (value?: HomeSectionOrderKey[] | null): HomeSectionOrderKey[] => {
  if (!value?.length) {
    return [...defaultHomeSectionOrder];
  }

  const sectionKeys = Object.keys(defaultHomeVisibleSections) as HomeSectionOrderKey[];
  const validKeys = new Set(sectionKeys);
  const ordered = value.filter((key): key is HomeSectionOrderKey => validKeys.has(key));

  if (
    ordered.length > 0 &&
    previousHomeSectionOrders.some(
      (previousOrder) =>
        previousOrder.length === ordered.length &&
        previousOrder.every((key, index) => ordered[index] === key),
    )
  ) {
    return [...defaultHomeSectionOrder];
  }

  const firstEventSectionIndex = getFirstHomeEventSectionIndex(ordered);
  const weatherIndex = ordered.indexOf("weather");
  const mapIndex = ordered.indexOf("map");
  const supportingSectionBeforeEvents =
    firstEventSectionIndex >= 0 &&
    ((weatherIndex >= 0 && weatherIndex < firstEventSectionIndex) ||
      (mapIndex >= 0 && mapIndex < firstEventSectionIndex));

  if (supportingSectionBeforeEvents) {
    return [...defaultHomeSectionOrder];
  }

  const normalizedOrder = [...ordered];

  sectionKeys
    .filter((key) => !normalizedOrder.includes(key))
    .forEach((key) => {
      if (key === "map") {
        const weatherIndex = normalizedOrder.indexOf("weather");
        const eventIndex = Math.max(
          normalizedOrder.indexOf("recommendedEvents"),
          normalizedOrder.indexOf("dayEvents"),
          normalizedOrder.indexOf("nightEvents"),
        );
        normalizedOrder.splice(
          Math.max(weatherIndex, eventIndex) >= 0 ? Math.max(weatherIndex, eventIndex) + 1 : normalizedOrder.length,
          0,
          key,
        );
        return;
      }

      normalizedOrder.push(key);
    });

  return normalizedOrder;
};

const normalizeHomeEventVisualMode = (value?: HomeEventVisualMode | null): HomeEventVisualMode =>
  value === "Emoji/Icon" ? "Emoji/Icon" : "Preview image";

const normalizeHomeHeaderControlsDensity = (
  value?: HomeHeaderControlsDensity | null,
): HomeHeaderControlsDensity =>
  value === "Compact" || value === "Spacious" ? value : "Comfortable";

const normalizeDateFormatPreference = (
  value?: DateFormatPreference | null,
): DateFormatPreference =>
  value === "DD/MM/YYYY" ||
  value === "MM/DD/YYYY" ||
  value === "YYYY/MM/DD" ||
  value === "YY/MM/DD" ||
  value === "DD.MM.YYYY" ||
  value === "DD-MM-YYYY" ||
  value === "YYYY-MM-DD"
    ? value
    : "Device / locale";

const normalizeTimeFormatPreference = (
  value?: TimeFormatPreference | null,
): TimeFormatPreference =>
  value === "12-hour clock" || value === "24-hour clock" ? value : "Device / locale";

const normalizeClockDisplayStyle = (value?: ClockDisplayStyle | null): ClockDisplayStyle =>
  value === "Analog" ? "Analog" : "Digital";

const normalizeTemperatureUnitPreference = (
  value?: TemperatureUnitPreference | null,
): TemperatureUnitPreference =>
  value === "Celsius" || value === "Fahrenheit" ? value : "Device / locale";

const normalizeDistanceUnitPreference = (
  value?: DistanceUnitPreference | null,
): DistanceUnitPreference =>
  value === "Kilometres" || value === "Miles" ? value : "Device / locale";

const normalizeCurrencyDisplayPreference = (
  value?: CurrencyDisplayPreference | null,
): CurrencyDisplayPreference =>
  value === "AUD" || value === "USD" || value === "EUR" || value === "GBP"
    ? value
    : "Device / locale";

const normalizeDayNightModePreference = (
  value?: DayNightModePreference | null,
): DayNightModePreference =>
  value === "Follow system/device time" || value === "Follow selected suburb/local time"
    ? value
    : "Manual toggle";

const normalizeCardOutlineStyle = (value?: CardOutlineStyle | null): CardOutlineStyle =>
  value === "Minimal" || value === "Standard" ? value : "Strong";

const normalizeSocialEnergyPreference = (
  value?: SocialEnergyPreference | null,
): SocialEnergyPreference => (value && socialEnergyOptions.includes(value) ? value : "Calm");

const normalizeCommunicationPreferences = (
  value?: CommunicationPreference[] | null,
): CommunicationPreference[] => {
  const filtered = (value ?? []).filter((preference): preference is CommunicationPreference =>
    communicationPreferenceOptions.includes(preference),
  );
  return filtered.length ? filtered : ["Low-message mode", "Details only"];
};

const normalizeGroupSizePreference = (value?: GroupSizePreference | null): GroupSizePreference =>
  value && groupSizePreferenceOptions.includes(value) ? value : "Small groups only";

const normalizePhotoRecordingComfortPreferences = (
  value?: PhotoRecordingComfortPreference[] | null,
): PhotoRecordingComfortPreference[] => {
  const filtered = (value ?? []).filter(
    (preference): preference is PhotoRecordingComfortPreference =>
      photoRecordingComfortOptions.includes(preference),
  );
  return filtered.length ? filtered : defaultPhotoRecordingComfortPreferences;
};

const normalizePhysicalContactComfortPreferences = (
  value?: PhysicalContactComfortPreference[] | null,
): PhysicalContactComfortPreference[] => {
  const filtered = (value ?? []).filter(
    (preference): preference is PhysicalContactComfortPreference =>
      physicalContactComfortOptions.includes(preference),
  );
  return filtered.length ? filtered : defaultPhysicalContactComfortPreferences;
};

const normalizeBackgroundVisibilityPreference = (
  value?: BackgroundVisibilityPreference | null,
): BackgroundVisibilityPreference =>
  value && backgroundVisibilityOptions.includes(value) ? value : "Private";

const normalizeBackgroundPreferenceList = <T extends string>(
  value: T[] | null | undefined,
  options: T[],
): T[] => {
  const filtered = Array.from(
    new Set((value ?? []).filter((preference): preference is T => options.includes(preference))),
  );
  return filtered.includes("Prefer not to say" as T) ? (["Prefer not to say"] as T[]) : filtered;
};

export const normalizeLanguageComfortPreferences = (
  value?: LanguageComfortPreference[] | null,
): LanguageComfortPreference[] => normalizeBackgroundPreferenceList(value, languageComfortOptions);

const normalizeSelectablePreferenceList = <T extends string>(
  value: T[] | null | undefined,
  options: T[],
  fallback: T[],
): T[] => {
  const filtered = Array.from(
    new Set((value ?? []).filter((preference): preference is T => options.includes(preference))),
  );
  return filtered.length ? filtered : fallback;
};

const meetupContactConflicts: Array<readonly MeetupContactPreference[]> = [
  ["Voice call okay", "No voice calls"],
  [
    "Details only",
    "Chat before meetup",
    "Group chat okay",
    "Direct messages okay",
    "Voice call okay",
  ],
  [
    "Reminders only",
    "Chat before meetup",
    "Group chat okay",
    "Direct messages okay",
    "Voice call okay",
  ],
  ["Prefer planning ahead", "Last-minute plans okay"],
];

export const normalizeMeetupContactPreferences = (
  value?: MeetupContactPreference[] | null,
): MeetupContactPreference[] => {
  const normalized: MeetupContactPreference[] = [];

  for (const preference of value ?? []) {
    if (!meetupContactPreferenceOptions.includes(preference)) continue;

    const conflicts = new Set(
      meetupContactConflicts
        .filter((group) => group.includes(preference))
        .flatMap((group) => group)
        .filter((item) => item !== preference),
    );
    const nextPreferences = conflicts.size
      ? normalized.filter((item) => !conflicts.has(item))
      : normalized;

    if (!nextPreferences.includes(preference)) {
      nextPreferences.push(preference);
    }

    normalized.splice(0, normalized.length, ...nextPreferences);
  }

  return normalized.length ? normalized : defaultMeetupContactPreferences;
};

export const toggleMeetupContactPreferenceSelection = (
  current: MeetupContactPreference[],
  preference: MeetupContactPreference,
): MeetupContactPreference[] => {
  const nextPreferences = current.includes(preference)
    ? current.filter((item) => item !== preference)
    : [...current, preference];

  return normalizeMeetupContactPreferences(nextPreferences);
};

const normalizeLifeContextUpdatedAt = (value?: string | null) => {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? value : null;
};

export const getLifeContextFreshnessLabel = (updatedAt?: string | null, now = new Date()) => {
  const normalized = normalizeLifeContextUpdatedAt(updatedAt);

  if (!normalized) {
    return { label: "Not updated yet", stale: false };
  }

  const updatedDate = new Date(normalized);
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.max(0, Math.floor((now.getTime() - updatedDate.getTime()) / dayMs));

  if (diffDays < 45) {
    return {
      label: `Current as of ${new Intl.DateTimeFormat("en-AU", { month: "long", year: "numeric" }).format(updatedDate)}`,
      stale: false,
    };
  }

  if (diffDays < 180) {
    const months = Math.max(1, Math.floor(diffDays / 30));
    return {
      label: `Last updated ${months} month${months === 1 ? "" : "s"} ago`,
      stale: false,
    };
  }

  return { label: "May be outdated", stale: true };
};

export type OnboardingSnapshot = {
  hasCompletedOnboarding: boolean;
  accountPaused?: boolean;
  accountPauseTimeline?: AccountPauseTimeline;
  ageConfirmed: boolean;
  age?: number | null;
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  suburb: string;
  intent: SoftHelloIntent;
  displayName: string;
  middleName?: string;
  lastName?: string;
  gender?: ProfileGender;
  middleNameDisplay?: ProfileNameDisplayMode;
  lastNameDisplay?: ProfileNameDisplayMode;
  showMiddleName?: boolean;
  showLastName?: boolean;
  showAge?: boolean;
  showPreferredAgeRange?: boolean;
  showGender?: boolean;
  profilePhotoUri: string | null;
  contactEmail?: string;
  contactPhone?: string;
  identitySelfieUri?: string | null;
  hasIdentityDocument?: boolean;
  visibilityPreference: SoftHelloVisibility;
  comfortMode?: NsnComfortMode;
  privateProfile?: boolean;
  blurProfilePhoto?: boolean;
  blurLevel?: NsnBlurLevel;
  softRevealSuggestions?: boolean;
  softRevealPace?: SoftRevealPace;
  preferSoftRevealPeople?: boolean;
  warmUpLowerBlur?: boolean;
  showSuburbArea?: boolean;
  showInterests?: boolean;
  showComfortPreferences?: boolean;
  minimalProfileView?: boolean;
  comfortPreferences: SoftHelloComfortPreference[];
  verificationLevel: SoftHelloVerificationLevel;
  eventMemberships: EventMembership[];
  blockedUserIds: string[];
  safetyReports: SafetyReport[];
  postEventFeedback: PostEventFeedback[];
  savedPlaces: SavedPlace[];
  pinnedEventIds: string[];
  hiddenEventIds: string[];
  noiseLevelPreference?: NoiseLevelPreference;
  contactPreferences?: ContactPreference[];
  friendshipStylePreferences?: FriendshipStylePreference[];
  datingStylePreferences?: DatingStylePreference[];
  meetupRhythmPreferences?: MeetupRhythmPreference[];
  availabilityTimingPreferences?: AvailabilityTimingPreference[];
  socialDurationPreferences?: SocialDurationPreference[];
  languageComfortPreferences?: LanguageComfortPreference[];
  transportationPreferences?: TransportationPreference[];
  meetupContactPreferences?: MeetupContactPreference[];
  locationComfortPreferences?: LocationComfortPreference[];
  socialEnergyPreference?: SocialEnergyPreference;
  communicationPreferences?: CommunicationPreference[];
  groupSizePreference?: GroupSizePreference;
  photoRecordingComfortPreferences?: PhotoRecordingComfortPreference[];
  physicalContactComfortPreferences?: PhysicalContactComfortPreference[];
  backgroundStudyStatuses?: BackgroundStudyStatusPreference[];
  backgroundStudyAreas?: BackgroundStudyAreaPreference[];
  backgroundStudyVisibility?: BackgroundVisibilityPreference;
  backgroundWorkPreferences?: BackgroundWorkPreference[];
  backgroundWorkRhythms?: BackgroundWorkRhythmPreference[];
  backgroundWorkVisibility?: BackgroundVisibilityPreference;
  backgroundCommunityPreferences?: BackgroundCommunityPreference[];
  backgroundCommunityVisibility?: BackgroundVisibilityPreference;
  lifeContextCurrentStates?: LifeContextCurrentStatePreference[];
  lifeContextCurrentVisibility?: BackgroundVisibilityPreference;
  lifeContextFields?: LifeContextFieldPreference[];
  lifeContextFieldVisibility?: BackgroundVisibilityPreference;
  lifeContextLearningInterests?: LifeContextLearningPreference[];
  lifeContextLearningVisibility?: BackgroundVisibilityPreference;
  lifeComfortPreferences?: LifeComfortPreference[];
  lifeComfortVisibility?: BackgroundVisibilityPreference;
  lifeContextLastUpdatedAt?: string | null;
  verifiedButPrivate?: boolean;
  personalityPresenceHair?: PersonalityPresenceHair | null;
  personalityPresenceHairCues?: PersonalityPresenceHairCue[];
  personalityPresenceEyes?: PersonalityPresenceEyes | null;
  personalityPresenceFacialHair?: PersonalityPresenceFacialHair | null;
  personalityPresenceStyle?: PersonalityPresenceStyle | null;
  personalityPresencePresentation?: PersonalityPresencePresentation | null;
  personalityPresencePersonalStyles?: PersonalityPresencePersonalStyle[];
  personalityPresenceAccessories?: PersonalityPresenceAccessories[];
  personalityPresenceGrooming?: PersonalityPresenceGrooming[];
  personalityPresenceVoicePresence?: PersonalityPresenceVoicePresence[];
  personalityPresenceSocialStyles?: PersonalityPresenceSocialStyle[];
  personalityPresenceConnectionPreferences?: PersonalityPresenceConnectionPreference[];
  personalityPresenceComfortAround?: PersonalityPresenceComfortAround[];
  personalityPresencePromptResponses?: PersonalityPresencePromptResponse[];
  showPersonalityPresenceOnProfile?: boolean;
  showPersonalityPresencePromptsOnProfile?: boolean;
  calendarMomentStates?: CalendarMomentStates;
  calendarMomentVisibility?: CalendarMomentVisibility;
  customCalendarMoments?: CustomCalendarMoment[];
  transportationMethod: TransportationMethod;
  dietaryPreferences: DietaryPreference[];
  foodBeveragePreferenceIds?: string[];
  hobbiesInterests: string[];
  interestPreferenceIds?: string[];
  interestComfortTagsByInterest?: Record<string, string[]>;
  profileShortcutLayout?: ProfileShortcutLayout;
  profileWidthPreference?: ProfileWidthPreference;
  settingsPrivacyMode?: SettingsPrivacyMode;
  userPreferenceTextMode?: UserPreferenceTextMode;
  emojiDisplayMode?: EmojiDisplayMode;
  showProfileControlsShortcut?: boolean;
  showAlertsSettingsShortcut?: boolean;
  externalLinks?: ExternalLinksPreference;
  batterySaver?: boolean;
  lowLightMode?: boolean;
  lowLightLevel?: LowLightLevel;
  homeViewMode?: HomeViewMode;
  homeNearbyOnly?: boolean;
  homeSmallGroupsOnly?: boolean;
  homeWeatherSafeOnly?: boolean;
  homeEventLayout?: HomeEventLayout;
  homeLayoutDensity?: HomeLayoutDensity;
  homeFitToScreen?: boolean;
  homeHeaderControlsDensity?: HomeHeaderControlsDensity;
  homeCardLayout?: HomeCardLayout;
  homeEventVisualMode?: HomeEventVisualMode;
  homeVisibleSections?: HomeVisibleSections;
  homeSectionOrder?: HomeSectionOrderKey[];
  suggestNightModeInEvenings?: boolean;
  notificationSnoozed?: boolean;
  notificationSnoozePreset?: NotificationSnoozePreset;
  timezone?: TimezoneSetting;
  timeContextMode?: TimeContextMode;
  dateFormatPreference?: DateFormatPreference;
  showWeekday?: boolean;
  timeFormatPreference?: TimeFormatPreference;
  clockDisplayStyle?: ClockDisplayStyle;
  showDigitalTimeWithAnalog?: boolean;
  temperatureUnitPreference?: TemperatureUnitPreference;
  distanceUnitPreference?: DistanceUnitPreference;
  currencyDisplayPreference?: CurrencyDisplayPreference;
  dayNightModePreference?: DayNightModePreference;
  cardOutlineStyle?: CardOutlineStyle;
  appLanguage?: string;
  translationLanguage?: string;
  brandThemeId?: BrandThemeId;
  skyThemeId?: SkyThemeId;
};

export type TimezoneSetting = {
  id: string;
  label: string;
  city: string;
  country: string;
  timeZone: string;
  latitude: number;
  longitude: number;
};

export type TimeContextMode =
  | "Automatic device time"
  | "Use selected suburb/local area"
  | "Manual city/suburb override";

export type WeatherSnapshot = {
  temperature: number | null;
  rainChance: number | null;
  category: "unknown" | "clear" | "warm" | "showers" | "rain";
};

export type LiveWeatherAlert = {
  icon: string;
  title: string;
  copy: string;
  tone: string;
  changed: boolean;
  action: "home" | "settings";
};

export const defaultNsnTimezone: TimezoneSetting = {
  id: "sydney-north-shore",
  label: "Sydney North Shore",
  city: "Sydney",
  country: "NSW, Australia",
  timeZone: "Australia/Sydney",
  latitude: -33.75,
  longitude: 151.15,
};

export const australianLocalAreas: TimezoneSetting[] = [
  defaultNsnTimezone,
  {
    id: "newcastle",
    label: "Newcastle",
    city: "Newcastle",
    country: "NSW, Australia",
    timeZone: "Australia/Sydney",
    latitude: -32.9283,
    longitude: 151.7817,
  },
  {
    id: "wollongong",
    label: "Wollongong",
    city: "Wollongong",
    country: "NSW, Australia",
    timeZone: "Australia/Sydney",
    latitude: -34.4278,
    longitude: 150.8931,
  },
  {
    id: "canberra",
    label: "Canberra",
    city: "Canberra",
    country: "ACT, Australia",
    timeZone: "Australia/Sydney",
    latitude: -35.2809,
    longitude: 149.13,
  },
  {
    id: "melbourne",
    label: "Melbourne",
    city: "Melbourne",
    country: "VIC, Australia",
    timeZone: "Australia/Melbourne",
    latitude: -37.8136,
    longitude: 144.9631,
  },
  {
    id: "adelaide",
    label: "Adelaide",
    city: "Adelaide",
    country: "SA, Australia",
    timeZone: "Australia/Adelaide",
    latitude: -34.9285,
    longitude: 138.6007,
  },
  {
    id: "brisbane",
    label: "Brisbane",
    city: "Brisbane",
    country: "QLD, Australia",
    timeZone: "Australia/Brisbane",
    latitude: -27.4698,
    longitude: 153.0251,
  },
  {
    id: "gold-coast",
    label: "Gold Coast",
    city: "Gold Coast",
    country: "QLD, Australia",
    timeZone: "Australia/Brisbane",
    latitude: -28.0167,
    longitude: 153.4,
  },
  {
    id: "cairns",
    label: "Cairns",
    city: "Cairns",
    country: "QLD, Australia",
    timeZone: "Australia/Brisbane",
    latitude: -16.9186,
    longitude: 145.7781,
  },
  {
    id: "darwin",
    label: "Darwin",
    city: "Darwin",
    country: "NT, Australia",
    timeZone: "Australia/Darwin",
    latitude: -12.4634,
    longitude: 130.8456,
  },
  {
    id: "hobart",
    label: "Hobart",
    city: "Hobart",
    country: "TAS, Australia",
    timeZone: "Australia/Hobart",
    latitude: -42.8821,
    longitude: 147.3272,
  },
  {
    id: "perth",
    label: "Perth",
    city: "Perth",
    country: "WA, Australia",
    timeZone: "Australia/Perth",
    latitude: -31.9523,
    longitude: 115.8613,
  },
];

const normalizeTimezoneSetting = (value?: TimezoneSetting | null) => {
  if (!value) return defaultNsnTimezone;
  return australianLocalAreas.find((area) => area.id === value.id) ?? value;
};

const normalizeTimeContextMode = (value?: TimeContextMode | null): TimeContextMode =>
  value === "Automatic device time" || value === "Manual city/suburb override"
    ? value
    : "Use selected suburb/local area";

const getDefaultSydneyNightMode = () => {
  const now = new Date();
  const timeZone = defaultNsnTimezone.timeZone;
  const hour = Number(
    new Intl.DateTimeFormat("en-AU", {
      hour: "numeric",
      hour12: false,
      timeZone,
    }).format(now),
  );
  const timeZoneName =
    new Intl.DateTimeFormat("en-AU", {
      timeZone,
      timeZoneName: "short",
    })
      .formatToParts(now)
      .find((part) => part.type === "timeZoneName")?.value ?? "";
  const month = Number(
    new Intl.DateTimeFormat("en-AU", { month: "numeric", timeZone }).format(now),
  );
  const isDaylightSaving = /DT|Daylight/i.test(timeZoneName) || month >= 10 || month <= 3;
  const nightStartHour = isDaylightSaving ? 19 : 18;

  return hour >= nightStartHour || hour < 6;
};

const getWeatherCategory = (
  temperature: number | null,
  rainChance: number | null,
): WeatherSnapshot["category"] => {
  if (temperature === null || rainChance === null) return "unknown";
  if (rainChance >= 70) return "rain";
  if (rainChance >= 35) return "showers";
  if (temperature >= 28) return "warm";
  return "clear";
};

const didWeatherChange = (previous: WeatherSnapshot | null, next: WeatherSnapshot) => {
  if (!previous) return false;
  if (previous.category !== next.category) return true;
  if (
    previous.rainChance !== null &&
    next.rainChance !== null &&
    Math.abs(previous.rainChance - next.rainChance) >= 15
  )
    return true;
  return (
    previous.temperature !== null &&
    next.temperature !== null &&
    Math.abs(previous.temperature - next.temperature) >= 3
  );
};

const getDistanceKm = (
  from: Pick<TimezoneSetting, "latitude" | "longitude">,
  to: Pick<TimezoneSetting, "latitude" | "longitude">,
) => {
  const radiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLatitude = toRadians(to.latitude - from.latitude);
  const deltaLongitude = toRadians(to.longitude - from.longitude);
  const startLatitude = toRadians(from.latitude);
  const endLatitude = toRadians(to.latitude);
  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(deltaLongitude / 2) ** 2;

  return 2 * radiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const findNearestAustralianLocalArea = (latitude: number, longitude: number) =>
  australianLocalAreas.reduce((nearest, area) => {
    const nearestDistance = getDistanceKm({ latitude, longitude }, nearest);
    const areaDistance = getDistanceKm({ latitude, longitude }, area);

    return areaDistance < nearestDistance ? area : nearest;
  }, australianLocalAreas[0]);

type AppSettings = {
  isOnboardingLoaded: boolean;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
  accountPaused: boolean;
  setAccountPaused: (value: boolean) => void;
  accountPauseTimeline: AccountPauseTimeline;
  setAccountPauseTimeline: (value: AccountPauseTimeline) => void;
  ageConfirmed: boolean;
  setAgeConfirmed: (value: boolean) => void;
  age: number | null;
  setAge: (value: number | null) => void;
  preferredAgeMin: number;
  setPreferredAgeMin: (value: number) => void;
  preferredAgeMax: number;
  setPreferredAgeMax: (value: number) => void;
  suburb: string;
  setSuburb: (value: string) => void;
  intent: SoftHelloIntent;
  setIntent: (value: SoftHelloIntent) => void;
  displayName: string;
  setDisplayName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  middleName: string;
  setMiddleName: (value: string) => void;
  gender: ProfileGender;
  setGender: (value: ProfileGender) => void;
  middleNameDisplay: ProfileNameDisplayMode;
  setMiddleNameDisplay: (value: ProfileNameDisplayMode) => void;
  lastNameDisplay: ProfileNameDisplayMode;
  setLastNameDisplay: (value: ProfileNameDisplayMode) => void;
  showMiddleName: boolean;
  setShowMiddleName: (value: boolean) => void;
  showLastName: boolean;
  setShowLastName: (value: boolean) => void;
  showAge: boolean;
  setShowAge: (value: boolean) => void;
  showPreferredAgeRange: boolean;
  setShowPreferredAgeRange: (value: boolean) => void;
  showGender: boolean;
  setShowGender: (value: boolean) => void;
  profilePhotoUri: string | null;
  setProfilePhotoUri: (value: string | null) => void;
  contactEmail: string;
  setContactEmail: (value: string) => void;
  contactPhone: string;
  setContactPhone: (value: string) => void;
  identitySelfieUri: string | null;
  setIdentitySelfieUri: (value: string | null) => void;
  hasIdentityDocument: boolean;
  setHasIdentityDocument: (value: boolean) => void;
  visibilityPreference: SoftHelloVisibility;
  setVisibilityPreference: (value: SoftHelloVisibility) => void;
  comfortMode: NsnComfortMode;
  setComfortMode: (value: NsnComfortMode) => void;
  privateProfile: boolean;
  setPrivateProfile: (value: boolean) => void;
  blurLevel: NsnBlurLevel;
  setBlurLevel: (value: NsnBlurLevel) => void;
  softRevealSuggestions: boolean;
  setSoftRevealSuggestions: (value: boolean) => void;
  softRevealPace: SoftRevealPace;
  setSoftRevealPace: (value: SoftRevealPace) => void;
  preferSoftRevealPeople: boolean;
  setPreferSoftRevealPeople: (value: boolean) => void;
  warmUpLowerBlur: boolean;
  setWarmUpLowerBlur: (value: boolean) => void;
  showSuburbArea: boolean;
  setShowSuburbArea: (value: boolean) => void;
  showInterests: boolean;
  setShowInterests: (value: boolean) => void;
  showComfortPreferences: boolean;
  setShowComfortPreferences: (value: boolean) => void;
  minimalProfileView: boolean;
  setMinimalProfileView: (value: boolean) => void;
  comfortPreferences: SoftHelloComfortPreference[];
  setComfortPreferences: (value: SoftHelloComfortPreference[]) => void;
  verificationLevel: SoftHelloVerificationLevel;
  setVerificationLevel: (value: SoftHelloVerificationLevel) => void;
  eventMemberships: EventMembership[];
  setEventMemberships: (value: EventMembership[]) => void;
  blockedUserIds: string[];
  setBlockedUserIds: (value: string[]) => void;
  safetyReports: SafetyReport[];
  setSafetyReports: (value: SafetyReport[]) => void;
  postEventFeedback: PostEventFeedback[];
  setPostEventFeedback: (value: PostEventFeedback[]) => void;
  savedPlaces: SavedPlace[];
  setSavedPlaces: (value: SavedPlace[]) => void;
  pinnedEventIds: string[];
  setPinnedEventIds: (value: string[]) => void;
  hiddenEventIds: string[];
  setHiddenEventIds: (value: string[]) => void;
  noiseLevelPreference: NoiseLevelPreference;
  setNoiseLevelPreference: (value: NoiseLevelPreference) => void;
  transportationMethod: TransportationMethod;
  setTransportationMethod: (value: TransportationMethod) => void;
  contactPreferences: ContactPreference[];
  setContactPreferences: (value: ContactPreference[]) => void;
  friendshipStylePreferences: FriendshipStylePreference[];
  setFriendshipStylePreferences: (value: FriendshipStylePreference[]) => void;
  datingStylePreferences: DatingStylePreference[];
  setDatingStylePreferences: (value: DatingStylePreference[]) => void;
  meetupRhythmPreferences: MeetupRhythmPreference[];
  setMeetupRhythmPreferences: (value: MeetupRhythmPreference[]) => void;
  availabilityTimingPreferences: AvailabilityTimingPreference[];
  setAvailabilityTimingPreferences: (value: AvailabilityTimingPreference[]) => void;
  socialDurationPreferences: SocialDurationPreference[];
  setSocialDurationPreferences: (value: SocialDurationPreference[]) => void;
  languageComfortPreferences: LanguageComfortPreference[];
  setLanguageComfortPreferences: (value: LanguageComfortPreference[]) => void;
  transportationPreferences: TransportationPreference[];
  setTransportationPreferences: (value: TransportationPreference[]) => void;
  meetupContactPreferences: MeetupContactPreference[];
  setMeetupContactPreferences: (value: MeetupContactPreference[]) => void;
  locationComfortPreferences: LocationComfortPreference[];
  setLocationComfortPreferences: (value: LocationComfortPreference[]) => void;
  socialEnergyPreference: SocialEnergyPreference;
  setSocialEnergyPreference: (value: SocialEnergyPreference) => void;
  communicationPreferences: CommunicationPreference[];
  setCommunicationPreferences: (value: CommunicationPreference[]) => void;
  groupSizePreference: GroupSizePreference;
  setGroupSizePreference: (value: GroupSizePreference) => void;
  photoRecordingComfortPreferences: PhotoRecordingComfortPreference[];
  setPhotoRecordingComfortPreferences: (value: PhotoRecordingComfortPreference[]) => void;
  physicalContactComfortPreferences: PhysicalContactComfortPreference[];
  setPhysicalContactComfortPreferences: (value: PhysicalContactComfortPreference[]) => void;
  backgroundStudyStatuses: BackgroundStudyStatusPreference[];
  setBackgroundStudyStatuses: (value: BackgroundStudyStatusPreference[]) => void;
  backgroundStudyAreas: BackgroundStudyAreaPreference[];
  setBackgroundStudyAreas: (value: BackgroundStudyAreaPreference[]) => void;
  backgroundStudyVisibility: BackgroundVisibilityPreference;
  setBackgroundStudyVisibility: (value: BackgroundVisibilityPreference) => void;
  backgroundWorkPreferences: BackgroundWorkPreference[];
  setBackgroundWorkPreferences: (value: BackgroundWorkPreference[]) => void;
  backgroundWorkRhythms: BackgroundWorkRhythmPreference[];
  setBackgroundWorkRhythms: (value: BackgroundWorkRhythmPreference[]) => void;
  backgroundWorkVisibility: BackgroundVisibilityPreference;
  setBackgroundWorkVisibility: (value: BackgroundVisibilityPreference) => void;
  backgroundCommunityPreferences: BackgroundCommunityPreference[];
  setBackgroundCommunityPreferences: (value: BackgroundCommunityPreference[]) => void;
  backgroundCommunityVisibility: BackgroundVisibilityPreference;
  setBackgroundCommunityVisibility: (value: BackgroundVisibilityPreference) => void;
  lifeContextCurrentStates: LifeContextCurrentStatePreference[];
  setLifeContextCurrentStates: (value: LifeContextCurrentStatePreference[]) => void;
  lifeContextCurrentVisibility: BackgroundVisibilityPreference;
  setLifeContextCurrentVisibility: (value: BackgroundVisibilityPreference) => void;
  lifeContextFields: LifeContextFieldPreference[];
  setLifeContextFields: (value: LifeContextFieldPreference[]) => void;
  lifeContextFieldVisibility: BackgroundVisibilityPreference;
  setLifeContextFieldVisibility: (value: BackgroundVisibilityPreference) => void;
  lifeContextLearningInterests: LifeContextLearningPreference[];
  setLifeContextLearningInterests: (value: LifeContextLearningPreference[]) => void;
  lifeContextLearningVisibility: BackgroundVisibilityPreference;
  setLifeContextLearningVisibility: (value: BackgroundVisibilityPreference) => void;
  lifeComfortPreferences: LifeComfortPreference[];
  setLifeComfortPreferences: (value: LifeComfortPreference[]) => void;
  lifeComfortVisibility: BackgroundVisibilityPreference;
  setLifeComfortVisibility: (value: BackgroundVisibilityPreference) => void;
  lifeContextLastUpdatedAt: string | null;
  setLifeContextLastUpdatedAt: (value: string | null) => void;
  verifiedButPrivate: boolean;
  setVerifiedButPrivate: (value: boolean) => void;
  personalityPresenceHair: PersonalityPresenceHair | null;
  setPersonalityPresenceHair: (value: PersonalityPresenceHair | null) => void;
  personalityPresenceHairCues: PersonalityPresenceHairCue[];
  setPersonalityPresenceHairCues: (value: PersonalityPresenceHairCue[]) => void;
  personalityPresenceEyes: PersonalityPresenceEyes | null;
  setPersonalityPresenceEyes: (value: PersonalityPresenceEyes | null) => void;
  personalityPresenceFacialHair: PersonalityPresenceFacialHair | null;
  setPersonalityPresenceFacialHair: (value: PersonalityPresenceFacialHair | null) => void;
  personalityPresenceStyle: PersonalityPresenceStyle | null;
  setPersonalityPresenceStyle: (value: PersonalityPresenceStyle | null) => void;
  personalityPresencePresentation: PersonalityPresencePresentation | null;
  setPersonalityPresencePresentation: (value: PersonalityPresencePresentation | null) => void;
  personalityPresencePersonalStyles: PersonalityPresencePersonalStyle[];
  setPersonalityPresencePersonalStyles: (value: PersonalityPresencePersonalStyle[]) => void;
  personalityPresenceAccessories: PersonalityPresenceAccessories[];
  setPersonalityPresenceAccessories: (value: PersonalityPresenceAccessories[]) => void;
  personalityPresenceGrooming: PersonalityPresenceGrooming[];
  setPersonalityPresenceGrooming: (value: PersonalityPresenceGrooming[]) => void;
  personalityPresenceVoicePresence: PersonalityPresenceVoicePresence[];
  setPersonalityPresenceVoicePresence: (value: PersonalityPresenceVoicePresence[]) => void;
  personalityPresenceSocialStyles: PersonalityPresenceSocialStyle[];
  setPersonalityPresenceSocialStyles: (value: PersonalityPresenceSocialStyle[]) => void;
  personalityPresenceConnectionPreferences: PersonalityPresenceConnectionPreference[];
  setPersonalityPresenceConnectionPreferences: (
    value: PersonalityPresenceConnectionPreference[],
  ) => void;
  personalityPresenceComfortAround: PersonalityPresenceComfortAround[];
  setPersonalityPresenceComfortAround: (value: PersonalityPresenceComfortAround[]) => void;
  personalityPresencePromptResponses: PersonalityPresencePromptResponse[];
  setPersonalityPresencePromptResponses: (value: PersonalityPresencePromptResponse[]) => void;
  showPersonalityPresenceOnProfile: boolean;
  setShowPersonalityPresenceOnProfile: (value: boolean) => void;
  showPersonalityPresencePromptsOnProfile: boolean;
  setShowPersonalityPresencePromptsOnProfile: (value: boolean) => void;
  calendarMomentStates: CalendarMomentStates;
  setCalendarMomentStates: (value: CalendarMomentStates) => void;
  calendarMomentVisibility: CalendarMomentVisibility;
  setCalendarMomentVisibility: (value: CalendarMomentVisibility) => void;
  customCalendarMoments: CustomCalendarMoment[];
  setCustomCalendarMoments: (value: CustomCalendarMoment[]) => void;
  dietaryPreferences: DietaryPreference[];
  setDietaryPreferences: (value: DietaryPreference[]) => void;
  foodBeveragePreferenceIds: string[];
  setFoodBeveragePreferenceIds: (value: string[]) => void;
  hobbiesInterests: string[];
  setHobbiesInterests: (value: string[]) => void;
  interestPreferenceIds: string[];
  setInterestPreferenceIds: (value: string[]) => void;
  interestComfortTagsByInterest: Record<string, string[]>;
  setInterestComfortTagsByInterest: (value: Record<string, string[]>) => void;
  profileShortcutLayout: ProfileShortcutLayout;
  setProfileShortcutLayout: (value: ProfileShortcutLayout) => void;
  profileWidthPreference: ProfileWidthPreference;
  setProfileWidthPreference: (value: ProfileWidthPreference) => void;
  settingsPrivacyMode: SettingsPrivacyMode;
  setSettingsPrivacyMode: (value: SettingsPrivacyMode) => void;
  userPreferenceTextMode: UserPreferenceTextMode;
  setUserPreferenceTextMode: (value: UserPreferenceTextMode) => void;
  emojiDisplayMode: EmojiDisplayMode;
  setEmojiDisplayMode: (value: EmojiDisplayMode) => void;
  showProfileControlsShortcut: boolean;
  setShowProfileControlsShortcut: (value: boolean) => void;
  showAlertsSettingsShortcut: boolean;
  setShowAlertsSettingsShortcut: (value: boolean) => void;
  externalLinks: ExternalLinksPreference;
  setExternalLinks: (value: ExternalLinksPreference) => void;
  batterySaver: boolean;
  setBatterySaver: (value: boolean) => void;
  lowLightMode: boolean;
  setLowLightMode: (value: boolean) => void;
  lowLightLevel: LowLightLevel;
  setLowLightLevel: (value: LowLightLevel) => void;
  homeViewMode: HomeViewMode;
  setHomeViewMode: (value: HomeViewMode) => void;
  homeNearbyOnly: boolean;
  setHomeNearbyOnly: (value: boolean) => void;
  homeSmallGroupsOnly: boolean;
  setHomeSmallGroupsOnly: (value: boolean) => void;
  homeWeatherSafeOnly: boolean;
  setHomeWeatherSafeOnly: (value: boolean) => void;
  homeEventLayout: HomeEventLayout;
  setHomeEventLayout: (value: HomeEventLayout) => void;
  homeLayoutDensity: HomeLayoutDensity;
  setHomeLayoutDensity: (value: HomeLayoutDensity) => void;
  homeFitToScreen: boolean;
  setHomeFitToScreen: (value: boolean) => void;
  homeHeaderControlsDensity: HomeHeaderControlsDensity;
  setHomeHeaderControlsDensity: (value: HomeHeaderControlsDensity) => void;
  homeCardLayout: HomeCardLayout;
  setHomeCardLayout: (value: HomeCardLayout) => void;
  homeEventVisualMode: HomeEventVisualMode;
  setHomeEventVisualMode: (value: HomeEventVisualMode) => void;
  homeVisibleSections: HomeVisibleSections;
  setHomeVisibleSections: (value: HomeVisibleSections) => void;
  homeSectionOrder: HomeSectionOrderKey[];
  setHomeSectionOrder: (value: HomeSectionOrderKey[]) => void;
  completeOnboarding: (
    snapshot: Omit<OnboardingSnapshot, "hasCompletedOnboarding">,
  ) => Promise<void>;
  saveSoftHelloMvpState: (
    snapshot?: Partial<Omit<OnboardingSnapshot, "hasCompletedOnboarding">>,
  ) => Promise<void>;
  resetOnboarding: () => Promise<void>;
  clearAllLocalPrototypeData: () => Promise<void>;
  isNightMode: boolean;
  setIsNightMode: (value: boolean) => void;
  blurProfilePhoto: boolean;
  setBlurProfilePhoto: (value: boolean) => void;
  largerText: boolean;
  setLargerText: (value: boolean) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (value: boolean) => void;
  screenReaderHints: boolean;
  setScreenReaderHints: (value: boolean) => void;
  largerTouchTargets: boolean;
  setLargerTouchTargets: (value: boolean) => void;
  reduceTransparency: boolean;
  setReduceTransparency: (value: boolean) => void;
  boldText: boolean;
  setBoldText: (value: boolean) => void;
  simplifiedInterface: boolean;
  setSimplifiedInterface: (value: boolean) => void;
  slowerTransitions: boolean;
  setSlowerTransitions: (value: boolean) => void;
  meetupReminders: boolean;
  setMeetupReminders: (value: boolean) => void;
  weatherAlerts: boolean;
  setWeatherAlerts: (value: boolean) => void;
  suggestNightModeInEvenings: boolean;
  setSuggestNightModeInEvenings: (value: boolean) => void;
  chatNotifications: boolean;
  setChatNotifications: (value: boolean) => void;
  quietNotifications: boolean;
  setQuietNotifications: (value: boolean) => void;
  notificationSnoozed: boolean;
  setNotificationSnoozed: (value: boolean) => void;
  notificationSnoozePreset: NotificationSnoozePreset;
  setNotificationSnoozePreset: (value: NotificationSnoozePreset) => void;
  useApproximateLocation: boolean;
  setUseApproximateLocation: (value: boolean) => void;
  showDistanceInMeetups: boolean;
  setShowDistanceInMeetups: (value: boolean) => void;
  allowMessageRequests: boolean;
  setAllowMessageRequests: (value: boolean) => void;
  safetyCheckIns: boolean;
  setSafetyCheckIns: (value: boolean) => void;
  appLanguage: string;
  setAppLanguage: (value: string) => void;
  translationLanguage: string;
  setTranslationLanguage: (value: string) => void;
  appPalette: AppPalette;
  setAppPalette: (value: AppPalette) => void;
  brandThemeId: BrandThemeId;
  setBrandThemeId: (value: BrandThemeId) => void;
  brandTheme: ReturnType<typeof getBrandTheme>;
  skyThemeId: SkyThemeId;
  setSkyThemeId: (value: SkyThemeId) => void;
  skyTheme: ReturnType<typeof getSkyTheme>;
  softSurfaces: boolean;
  setSoftSurfaces: (value: boolean) => void;
  clearBorders: boolean;
  setClearBorders: (value: boolean) => void;
  timezone: TimezoneSetting;
  setTimezone: (value: TimezoneSetting) => void;
  timeContextMode: TimeContextMode;
  setTimeContextMode: (value: TimeContextMode) => void;
  dateFormatPreference: DateFormatPreference;
  setDateFormatPreference: (value: DateFormatPreference) => void;
  showWeekday: boolean;
  setShowWeekday: (value: boolean) => void;
  timeFormatPreference: TimeFormatPreference;
  setTimeFormatPreference: (value: TimeFormatPreference) => void;
  clockDisplayStyle: ClockDisplayStyle;
  setClockDisplayStyle: (value: ClockDisplayStyle) => void;
  showDigitalTimeWithAnalog: boolean;
  setShowDigitalTimeWithAnalog: (value: boolean) => void;
  temperatureUnitPreference: TemperatureUnitPreference;
  setTemperatureUnitPreference: (value: TemperatureUnitPreference) => void;
  distanceUnitPreference: DistanceUnitPreference;
  setDistanceUnitPreference: (value: DistanceUnitPreference) => void;
  currencyDisplayPreference: CurrencyDisplayPreference;
  setCurrencyDisplayPreference: (value: CurrencyDisplayPreference) => void;
  dayNightModePreference: DayNightModePreference;
  setDayNightModePreference: (value: DayNightModePreference) => void;
  cardOutlineStyle: CardOutlineStyle;
  setCardOutlineStyle: (value: CardOutlineStyle) => void;
  weather: WeatherSnapshot;
  liveWeatherAlert: LiveWeatherAlert | null;
};

const AppSettingsContext = createContext<AppSettings | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [isOnboardingLoaded, setIsOnboardingLoaded] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [accountPaused, setAccountPaused] = useState(false);
  const [accountPauseTimeline, setAccountPauseTimeline] =
    useState<AccountPauseTimeline>("Until I return");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  const [preferredAgeMin, setPreferredAgeMin] = useState(25);
  const [preferredAgeMax, setPreferredAgeMax] = useState(40);
  const [suburb, setSuburb] = useState("");
  const [intent, setIntent] = useState<SoftHelloIntent>("Exploring");
  const [displayName, setDisplayName] = useState("NSN Tester");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<ProfileGender>("Not specified");
  const [middleNameDisplay, setMiddleNameDisplay] = useState<ProfileNameDisplayMode>("Hidden");
  const [lastNameDisplay, setLastNameDisplay] = useState<ProfileNameDisplayMode>("Hidden");
  const [showMiddleName, setShowMiddleName] = useState(false);
  const [showLastName, setShowLastName] = useState(false);
  const [showAge, setShowAge] = useState(false);
  const [showPreferredAgeRange, setShowPreferredAgeRange] = useState(false);
  const [showGender, setShowGender] = useState(false);
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [identitySelfieUri, setIdentitySelfieUri] = useState<string | null>(null);
  const [hasIdentityDocument, setHasIdentityDocument] = useState(false);
  const [visibilityPreference, setVisibilityPreference] = useState<SoftHelloVisibility>("Blurred");
  const [comfortMode, setComfortMode] = useState<NsnComfortMode>("Comfort Mode");
  const [privateProfile, setPrivateProfile] = useState(false);
  const [blurLevel, setBlurLevel] = useState<NsnBlurLevel>("Medium blur");
  const [softRevealSuggestions, setSoftRevealSuggestions] = useState(true);
  const [softRevealPace, setSoftRevealPace] = useState<SoftRevealPace>("Gradual reveal");
  const [preferSoftRevealPeople, setPreferSoftRevealPeople] = useState(false);
  const [warmUpLowerBlur, setWarmUpLowerBlur] = useState(true);
  const [showSuburbArea, setShowSuburbArea] = useState(false);
  const [showInterests, setShowInterests] = useState(false);
  const [showComfortPreferences, setShowComfortPreferences] = useState(false);
  const [minimalProfileView, setMinimalProfileView] = useState(false);
  const [comfortPreferences, setComfortPreferences] =
    useState<SoftHelloComfortPreference[]>(defaultComfortPreferences);
  const [verificationLevel, setVerificationLevel] =
    useState<SoftHelloVerificationLevel>("Readiness not reviewed");
  const [eventMemberships, setEventMemberships] = useState<EventMembership[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [safetyReports, setSafetyReports] = useState<SafetyReport[]>([]);
  const [postEventFeedback, setPostEventFeedback] = useState<PostEventFeedback[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [pinnedEventIds, setPinnedEventIds] = useState<string[]>([]);
  const [hiddenEventIds, setHiddenEventIds] = useState<string[]>([]);
  const [noiseLevelPreference, setNoiseLevelPreference] = useState<NoiseLevelPreference>("Any");
  const [contactPreferences, setContactPreferences] = useState<ContactPreference[]>(["Text"]);
  const [friendshipStylePreferences, setFriendshipStylePreferences] = useState<
    FriendshipStylePreference[]
  >([]);
  const [datingStylePreferences, setDatingStylePreferences] = useState<DatingStylePreference[]>([]);
  const [meetupRhythmPreferences, setMeetupRhythmPreferences] = useState<MeetupRhythmPreference[]>(
    [],
  );
  const [availabilityTimingPreferences, setAvailabilityTimingPreferences] = useState<
    AvailabilityTimingPreference[]
  >([]);
  const [socialDurationPreferences, setSocialDurationPreferences] = useState<
    SocialDurationPreference[]
  >([]);
  const [languageComfortPreferences, setLanguageComfortPreferences] = useState<
    LanguageComfortPreference[]
  >([]);
  const [socialEnergyPreference, setSocialEnergyPreference] =
    useState<SocialEnergyPreference>("Calm");
  const [communicationPreferences, setCommunicationPreferences] = useState<
    CommunicationPreference[]
  >(["Low-message mode", "Details only"]);
  const [groupSizePreference, setGroupSizePreference] =
    useState<GroupSizePreference>("Small groups only");
  const [photoRecordingComfortPreferences, setPhotoRecordingComfortPreferences] = useState<
    PhotoRecordingComfortPreference[]
  >(defaultPhotoRecordingComfortPreferences);
  const [physicalContactComfortPreferences, setPhysicalContactComfortPreferences] = useState<
    PhysicalContactComfortPreference[]
  >(defaultPhysicalContactComfortPreferences);
  const [backgroundStudyStatuses, setBackgroundStudyStatuses] = useState<
    BackgroundStudyStatusPreference[]
  >([]);
  const [backgroundStudyAreas, setBackgroundStudyAreas] = useState<BackgroundStudyAreaPreference[]>(
    [],
  );
  const [backgroundStudyVisibility, setBackgroundStudyVisibility] =
    useState<BackgroundVisibilityPreference>("Private");
  const [backgroundWorkPreferences, setBackgroundWorkPreferences] = useState<
    BackgroundWorkPreference[]
  >([]);
  const [backgroundWorkRhythms, setBackgroundWorkRhythms] = useState<
    BackgroundWorkRhythmPreference[]
  >([]);
  const [backgroundWorkVisibility, setBackgroundWorkVisibility] =
    useState<BackgroundVisibilityPreference>("Private");
  const [backgroundCommunityPreferences, setBackgroundCommunityPreferences] = useState<
    BackgroundCommunityPreference[]
  >([]);
  const [backgroundCommunityVisibility, setBackgroundCommunityVisibility] =
    useState<BackgroundVisibilityPreference>("Private");
  const [lifeContextCurrentStates, setLifeContextCurrentStates] = useState<
    LifeContextCurrentStatePreference[]
  >([]);
  const [lifeContextCurrentVisibility, setLifeContextCurrentVisibility] =
    useState<BackgroundVisibilityPreference>("Private");
  const [lifeContextFields, setLifeContextFields] = useState<LifeContextFieldPreference[]>([]);
  const [lifeContextFieldVisibility, setLifeContextFieldVisibility] =
    useState<BackgroundVisibilityPreference>("Private");
  const [lifeContextLearningInterests, setLifeContextLearningInterests] = useState<
    LifeContextLearningPreference[]
  >([]);
  const [lifeContextLearningVisibility, setLifeContextLearningVisibility] =
    useState<BackgroundVisibilityPreference>("Shared preview visibility only");
  const [lifeComfortPreferences, setLifeComfortPreferences] = useState<LifeComfortPreference[]>([]);
  const [lifeComfortVisibility, setLifeComfortVisibility] =
    useState<BackgroundVisibilityPreference>("Private");
  const [lifeContextLastUpdatedAt, setLifeContextLastUpdatedAt] = useState<string | null>(null);
  const [verifiedButPrivate, setVerifiedButPrivate] = useState(true);
  const [personalityPresenceHair, setPersonalityPresenceHair] =
    useState<PersonalityPresenceHair | null>(null);
  const [personalityPresenceHairCues, setPersonalityPresenceHairCues] = useState<
    PersonalityPresenceHairCue[]
  >([]);
  const [personalityPresenceEyes, setPersonalityPresenceEyes] =
    useState<PersonalityPresenceEyes | null>(null);
  const [personalityPresenceFacialHair, setPersonalityPresenceFacialHair] =
    useState<PersonalityPresenceFacialHair | null>(null);
  const [personalityPresenceStyle, setPersonalityPresenceStyle] =
    useState<PersonalityPresenceStyle | null>(null);
  const [personalityPresencePresentation, setPersonalityPresencePresentation] =
    useState<PersonalityPresencePresentation | null>(null);
  const [personalityPresencePersonalStyles, setPersonalityPresencePersonalStyles] = useState<
    PersonalityPresencePersonalStyle[]
  >([]);
  const [personalityPresenceAccessories, setPersonalityPresenceAccessories] = useState<
    PersonalityPresenceAccessories[]
  >([]);
  const [personalityPresenceGrooming, setPersonalityPresenceGrooming] = useState<
    PersonalityPresenceGrooming[]
  >([]);
  const [personalityPresenceVoicePresence, setPersonalityPresenceVoicePresence] = useState<
    PersonalityPresenceVoicePresence[]
  >([]);
  const [personalityPresenceSocialStyles, setPersonalityPresenceSocialStyles] = useState<
    PersonalityPresenceSocialStyle[]
  >([]);
  const [personalityPresenceConnectionPreferences, setPersonalityPresenceConnectionPreferences] =
    useState<PersonalityPresenceConnectionPreference[]>([]);
  const [personalityPresenceComfortAround, setPersonalityPresenceComfortAround] = useState<
    PersonalityPresenceComfortAround[]
  >([]);
  const [personalityPresencePromptResponses, setPersonalityPresencePromptResponses] = useState<
    PersonalityPresencePromptResponse[]
  >([]);
  const [showPersonalityPresenceOnProfile, setShowPersonalityPresenceOnProfile] = useState(false);
  const [showPersonalityPresencePromptsOnProfile, setShowPersonalityPresencePromptsOnProfile] =
    useState(false);
  const [calendarMomentStates, setCalendarMomentStates] = useState<CalendarMomentStates>(
    defaultCalendarMomentStates,
  );
  const [calendarMomentVisibility, setCalendarMomentVisibility] =
    useState<CalendarMomentVisibility>(defaultCalendarMomentVisibility);
  const [customCalendarMoments, setCustomCalendarMoments] = useState<CustomCalendarMoment[]>(
    defaultCustomCalendarMoments,
  );
  const [transportationMethod, setTransportationMethod] =
    useState<TransportationMethod>("Public transport");
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>([
    "No preference",
  ]);
  const [transportationPreferences, setTransportationPreferences] = useState<
    TransportationPreference[]
  >(defaultTransportationPreferences);
  const [meetupContactPreferences, setMeetupContactPreferences] = useState<
    MeetupContactPreference[]
  >(defaultMeetupContactPreferences);
  const [locationComfortPreferences, setLocationComfortPreferences] = useState<
    LocationComfortPreference[]
  >(defaultLocationComfortPreferences);
  const [foodBeveragePreferenceIds, setFoodBeveragePreferenceIds] = useState<string[]>(
    defaultFoodBeveragePreferenceIds,
  );
  const [hobbiesInterests, setHobbiesInterests] = useState<string[]>(["Coffee", "Movies", "Walks"]);
  const [interestPreferenceIds, setInterestPreferenceIds] = useState<string[]>(
    defaultInterestPreferenceIds,
  );
  const [interestComfortTagsByInterest, setInterestComfortTagsByInterest] = useState<
    Record<string, string[]>
  >(defaultInterestComfortTagsByInterest);
  const [profileShortcutLayout, setProfileShortcutLayout] =
    useState<ProfileShortcutLayout>("Clean");
  const [profileWidthPreference, setProfileWidthPreference] =
    useState<ProfileWidthPreference>("Contained");
  const [settingsPrivacyMode, setSettingsPrivacyMode] = useState<SettingsPrivacyMode>("Basic");
  const [userPreferenceTextMode, setUserPreferenceTextMode] =
    useState<UserPreferenceTextMode>("Simple");
  const [emojiDisplayMode, setEmojiDisplayMode] = useState<EmojiDisplayMode>("Full emoji display");
  const [showProfileControlsShortcut, setShowProfileControlsShortcut] = useState(true);
  const [showAlertsSettingsShortcut, setShowAlertsSettingsShortcut] = useState(true);
  const [externalLinks, setExternalLinks] = useState<ExternalLinksPreference>(
    defaultExternalLinksPreference,
  );
  const [batterySaver, setBatterySaver] = useState(false);
  const [lowLightMode, setLowLightMode] = useState(false);
  const [lowLightLevel, setLowLightLevel] = useState<LowLightLevel>("Medium");
  const [homeViewMode, setHomeViewMode] = useState<HomeViewMode>("Essential");
  const [homeNearbyOnly, setHomeNearbyOnly] = useState(false);
  const [homeSmallGroupsOnly, setHomeSmallGroupsOnly] = useState(false);
  const [homeWeatherSafeOnly, setHomeWeatherSafeOnly] = useState(false);
  const [homeEventLayout, setHomeEventLayout] = useState<HomeEventLayout>("List");
  const [homeLayoutDensity, setHomeLayoutDensity] = useState<HomeLayoutDensity>("Compact");
  const [homeFitToScreen, setHomeFitToScreen] = useState(false);
  const [homeHeaderControlsDensity, setHomeHeaderControlsDensity] =
    useState<HomeHeaderControlsDensity>("Comfortable");
  const [homeCardLayout, setHomeCardLayout] = useState<HomeCardLayout>("Vertical list");
  const [homeEventVisualMode, setHomeEventVisualMode] =
    useState<HomeEventVisualMode>("Preview image");
  const [homeVisibleSections, setHomeVisibleSections] = useState<HomeVisibleSections>(
    defaultHomeVisibleSections,
  );
  const [homeSectionOrder, setHomeSectionOrder] =
    useState<HomeSectionOrderKey[]>(defaultHomeSectionOrder);
  const [isNightMode, setIsNightMode] = useState(() => getDefaultSydneyNightMode());
  const [blurProfilePhoto, setBlurProfilePhoto] = useState(true);
  const [largerText, setLargerText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReaderHints, setScreenReaderHints] = useState(true);
  const [largerTouchTargets, setLargerTouchTargets] = useState(false);
  const [reduceTransparency, setReduceTransparency] = useState(false);
  const [boldText, setBoldText] = useState(false);
  const [simplifiedInterface, setSimplifiedInterface] = useState(false);
  const [slowerTransitions, setSlowerTransitions] = useState(false);
  const [meetupReminders, setMeetupReminders] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [suggestNightModeInEvenings, setSuggestNightModeInEvenings] = useState(false);
  const [chatNotifications, setChatNotifications] = useState(true);
  const [quietNotifications, setQuietNotifications] = useState(false);
  const [notificationSnoozed, setNotificationSnoozed] = useState(false);
  const [notificationSnoozePreset, setNotificationSnoozePreset] =
    useState<NotificationSnoozePreset>("Tonight");
  const [useApproximateLocation, setUseApproximateLocation] = useState(true);
  const [showDistanceInMeetups, setShowDistanceInMeetups] = useState(true);
  const [allowMessageRequests, setAllowMessageRequests] = useState(false);
  const [safetyCheckIns, setSafetyCheckIns] = useState(true);
  const [appLanguage, setAppLanguageState] = useState<NsnLocalLanguage>(DEFAULT_NSN_LANGUAGE);
  const [translationLanguage, setTranslationLanguageState] =
    useState<NsnLocalLanguage>(DEFAULT_NSN_LANGUAGE);
  const [appPalette, setAppPalette] = useState<AppPalette>(appPalettes[0]);
  const [brandThemeId, setBrandThemeIdState] = useState<BrandThemeId>("nsn");
  const [skyThemeId, setSkyThemeIdState] = useState<SkyThemeId>(defaultSkyThemeId);
  const [softSurfaces, setSoftSurfaces] = useState(false);
  const [clearBorders, setClearBorders] = useState(false);
  const [timezone, setTimezone] = useState<TimezoneSetting>(defaultNsnTimezone);
  const [timeContextMode, setTimeContextMode] = useState<TimeContextMode>(
    "Use selected suburb/local area",
  );
  const [dateFormatPreference, setDateFormatPreference] =
    useState<DateFormatPreference>("Device / locale");
  const [showWeekday, setShowWeekday] = useState(true);
  const [timeFormatPreference, setTimeFormatPreference] =
    useState<TimeFormatPreference>("Device / locale");
  const [clockDisplayStyle, setClockDisplayStyle] = useState<ClockDisplayStyle>("Digital");
  const [showDigitalTimeWithAnalog, setShowDigitalTimeWithAnalog] = useState(false);
  const [temperatureUnitPreference, setTemperatureUnitPreference] =
    useState<TemperatureUnitPreference>("Device / locale");
  const [distanceUnitPreference, setDistanceUnitPreference] =
    useState<DistanceUnitPreference>("Device / locale");
  const [currencyDisplayPreference, setCurrencyDisplayPreference] =
    useState<CurrencyDisplayPreference>("Device / locale");
  const [dayNightModePreference, setDayNightModePreference] = useState<DayNightModePreference>(
    "Follow selected suburb/local time",
  );
  const [cardOutlineStyle, setCardOutlineStyle] = useState<CardOutlineStyle>("Strong");
  const [weather, setWeather] = useState<WeatherSnapshot>({
    temperature: null,
    rainChance: null,
    category: "unknown",
  });
  const [liveWeatherAlert, setLiveWeatherAlert] = useState<LiveWeatherAlert | null>(null);
  const previousWeather = useRef<WeatherSnapshot | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOnboarding() {
      try {
        const storedValue = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);

        if (!storedValue || !isMounted) {
          return;
        }

        const snapshot = JSON.parse(storedValue) as OnboardingSnapshot;
        setHasCompletedOnboarding(Boolean(snapshot.hasCompletedOnboarding));
        setAccountPaused(Boolean(snapshot.accountPaused));
        setAccountPauseTimeline(snapshot.accountPauseTimeline ?? "Until I return");
        setAgeConfirmed(Boolean(snapshot.ageConfirmed));
        const storedAgeRange = normalizePreferredAgeRange(
          snapshot.preferredAgeMin,
          snapshot.preferredAgeMax,
        );
        setAge(normalizeAdultAge(snapshot.age));
        setPreferredAgeMin(storedAgeRange.min);
        setPreferredAgeMax(storedAgeRange.max);
        setSuburb(snapshot.suburb ?? "");
        setIntent(snapshot.intent ?? "Exploring");
        setDisplayName(snapshot.displayName || "NSN Tester");
        setMiddleName(snapshot.middleName ?? "");
        setLastName(snapshot.lastName ?? "");
        setGender(snapshot.gender ?? "Not specified");
        const storedMiddleNameDisplay = normalizeNameDisplayMode(
          snapshot.middleNameDisplay,
          snapshot.showMiddleName ? "Full" : "Hidden",
        );
        const storedLastNameDisplay = normalizeNameDisplayMode(
          snapshot.lastNameDisplay,
          snapshot.showLastName ? "Full" : "Hidden",
        );
        setMiddleNameDisplay(storedMiddleNameDisplay);
        setLastNameDisplay(storedLastNameDisplay);
        setShowMiddleName(storedMiddleNameDisplay !== "Hidden");
        setShowLastName(storedLastNameDisplay !== "Hidden");
        setShowAge(Boolean(snapshot.showAge));
        setShowPreferredAgeRange(Boolean(snapshot.showPreferredAgeRange));
        setShowGender(Boolean(snapshot.showGender));
        setProfilePhotoUri(snapshot.profilePhotoUri ?? null);
        setContactEmail(snapshot.contactEmail ?? "");
        setContactPhone(snapshot.contactPhone ?? "");
        setIdentitySelfieUri(snapshot.identitySelfieUri ?? null);
        setHasIdentityDocument(Boolean(snapshot.hasIdentityDocument));
        setVisibilityPreference(snapshot.visibilityPreference ?? "Blurred");
        setComfortMode(snapshot.comfortMode ?? "Comfort Mode");
        setPrivateProfile(Boolean(snapshot.privateProfile));
        setBlurLevel(snapshot.blurLevel ?? "Medium blur");
        setSoftRevealSuggestions(snapshot.softRevealSuggestions ?? true);
        setSoftRevealPace(snapshot.softRevealPace ?? "Gradual reveal");
        setPreferSoftRevealPeople(Boolean(snapshot.preferSoftRevealPeople));
        setWarmUpLowerBlur(snapshot.warmUpLowerBlur ?? true);
        setShowSuburbArea(snapshot.showSuburbArea ?? true);
        setShowInterests(snapshot.showInterests ?? true);
        setShowComfortPreferences(snapshot.showComfortPreferences ?? true);
        setMinimalProfileView(Boolean(snapshot.minimalProfileView));
        setComfortPreferences(
          snapshot.comfortPreferences?.length
            ? snapshot.comfortPreferences
            : defaultComfortPreferences,
        );
        setVerificationLevel(snapshot.verificationLevel ?? "Readiness not reviewed");
        setEventMemberships(snapshot.eventMemberships ?? []);
        setBlockedUserIds(snapshot.blockedUserIds ?? []);
        setSafetyReports(snapshot.safetyReports ?? []);
        setPostEventFeedback(snapshot.postEventFeedback ?? []);
        setSavedPlaces(snapshot.savedPlaces ?? []);
        setPinnedEventIds(snapshot.pinnedEventIds ?? []);
        setHiddenEventIds(snapshot.hiddenEventIds ?? []);
        setNoiseLevelPreference(snapshot.noiseLevelPreference ?? "Any");
        setContactPreferences(
          snapshot.contactPreferences?.length ? snapshot.contactPreferences : ["Text"],
        );
        setFriendshipStylePreferences(
          normalizeBackgroundPreferenceList(
            snapshot.friendshipStylePreferences,
            friendshipStyleOptions,
          ),
        );
        setDatingStylePreferences(
          normalizeBackgroundPreferenceList(snapshot.datingStylePreferences, datingStyleOptions),
        );
        setMeetupRhythmPreferences(
          normalizeBackgroundPreferenceList(snapshot.meetupRhythmPreferences, meetupRhythmOptions),
        );
        setAvailabilityTimingPreferences(
          normalizeBackgroundPreferenceList(
            snapshot.availabilityTimingPreferences,
            availabilityTimingOptions,
          ),
        );
        setSocialDurationPreferences(
          normalizeBackgroundPreferenceList(
            snapshot.socialDurationPreferences,
            socialDurationOptions,
          ),
        );
        setLanguageComfortPreferences(
          normalizeLanguageComfortPreferences(snapshot.languageComfortPreferences),
        );
        setSocialEnergyPreference(normalizeSocialEnergyPreference(snapshot.socialEnergyPreference));
        setCommunicationPreferences(
          normalizeCommunicationPreferences(snapshot.communicationPreferences),
        );
        setGroupSizePreference(normalizeGroupSizePreference(snapshot.groupSizePreference));
        setPhotoRecordingComfortPreferences(
          normalizePhotoRecordingComfortPreferences(snapshot.photoRecordingComfortPreferences),
        );
        setPhysicalContactComfortPreferences(
          normalizePhysicalContactComfortPreferences(snapshot.physicalContactComfortPreferences),
        );
        setBackgroundStudyStatuses(
          normalizeBackgroundPreferenceList(
            snapshot.backgroundStudyStatuses,
            backgroundStudyStatusOptions,
          ),
        );
        setBackgroundStudyAreas(
          normalizeBackgroundPreferenceList(
            snapshot.backgroundStudyAreas,
            backgroundStudyAreaOptions,
          ),
        );
        setBackgroundStudyVisibility(
          normalizeBackgroundVisibilityPreference(snapshot.backgroundStudyVisibility),
        );
        setBackgroundWorkPreferences(
          normalizeBackgroundPreferenceList(
            snapshot.backgroundWorkPreferences,
            backgroundWorkOptions,
          ),
        );
        setBackgroundWorkRhythms(
          normalizeBackgroundPreferenceList(
            snapshot.backgroundWorkRhythms,
            backgroundWorkRhythmOptions,
          ),
        );
        setBackgroundWorkVisibility(
          normalizeBackgroundVisibilityPreference(snapshot.backgroundWorkVisibility),
        );
        setBackgroundCommunityPreferences(
          normalizeBackgroundPreferenceList(
            snapshot.backgroundCommunityPreferences,
            backgroundCommunityOptions,
          ),
        );
        setBackgroundCommunityVisibility(
          normalizeBackgroundVisibilityPreference(snapshot.backgroundCommunityVisibility),
        );
        setLifeContextCurrentStates(
          normalizeBackgroundPreferenceList(
            snapshot.lifeContextCurrentStates,
            lifeContextCurrentStateOptions,
          ),
        );
        setLifeContextCurrentVisibility(
          normalizeBackgroundVisibilityPreference(snapshot.lifeContextCurrentVisibility),
        );
        setLifeContextFields(
          normalizeBackgroundPreferenceList(snapshot.lifeContextFields, lifeContextFieldOptions),
        );
        setLifeContextFieldVisibility(
          normalizeBackgroundVisibilityPreference(snapshot.lifeContextFieldVisibility),
        );
        setLifeContextLearningInterests(
          normalizeBackgroundPreferenceList(
            snapshot.lifeContextLearningInterests,
            lifeContextLearningOptions,
          ),
        );
        setLifeContextLearningVisibility(
          normalizeBackgroundVisibilityPreference(
            snapshot.lifeContextLearningVisibility ?? "Shared preview visibility only",
          ),
        );
        setLifeComfortPreferences(
          normalizeBackgroundPreferenceList(snapshot.lifeComfortPreferences, lifeComfortOptions),
        );
        setLifeComfortVisibility(
          normalizeBackgroundVisibilityPreference(snapshot.lifeComfortVisibility),
        );
        setLifeContextLastUpdatedAt(
          normalizeLifeContextUpdatedAt(snapshot.lifeContextLastUpdatedAt),
        );
        setVerifiedButPrivate(snapshot.verifiedButPrivate ?? true);
        setPersonalityPresenceHair(
          normalizePersonalityPresenceChoice(
            snapshot.personalityPresenceHair,
            personalityPresenceHairOptions,
          ),
        );
        setPersonalityPresenceHairCues(
          normalizePersonalityPresenceList(
            snapshot.personalityPresenceHairCues,
            personalityPresenceHairCueOptions,
          ),
        );
        setPersonalityPresenceEyes(
          normalizePersonalityPresenceChoice(
            snapshot.personalityPresenceEyes,
            personalityPresenceEyeOptions,
          ),
        );
        setPersonalityPresenceFacialHair(
          normalizePersonalityPresenceChoice(
            snapshot.personalityPresenceFacialHair,
            personalityPresenceFacialHairOptions,
          ),
        );
        setPersonalityPresenceStyle(
          normalizePersonalityPresenceChoice(
            snapshot.personalityPresenceStyle,
            personalityPresenceStyleOptions,
          ),
        );
        setPersonalityPresencePresentation(
          normalizePersonalityPresenceChoice(
            snapshot.personalityPresencePresentation,
            personalityPresencePresentationOptions,
          ),
        );
        setPersonalityPresencePersonalStyles(
          normalizePersonalityPresenceList(
            snapshot.personalityPresencePersonalStyles,
            personalityPresencePersonalStyleOptions,
          ),
        );
        setPersonalityPresenceAccessories(
          normalizePersonalityPresenceList(
            snapshot.personalityPresenceAccessories,
            personalityPresenceAccessoriesOptions,
          ),
        );
        setPersonalityPresenceGrooming(
          normalizePersonalityPresenceList(
            snapshot.personalityPresenceGrooming,
            personalityPresenceGroomingOptions,
          ),
        );
        setPersonalityPresenceVoicePresence(
          normalizePersonalityPresenceList(
            snapshot.personalityPresenceVoicePresence,
            personalityPresenceVoicePresenceOptions,
          ),
        );
        setPersonalityPresenceSocialStyles(
          normalizePersonalityPresenceList(
            snapshot.personalityPresenceSocialStyles,
            personalityPresenceSocialStyleOptions,
          ),
        );
        setPersonalityPresenceConnectionPreferences(
          normalizePersonalityPresenceList(
            snapshot.personalityPresenceConnectionPreferences,
            personalityPresenceConnectionOptions,
          ),
        );
        setPersonalityPresenceComfortAround(
          normalizePersonalityPresenceList(
            snapshot.personalityPresenceComfortAround,
            personalityPresenceComfortAroundOptions,
          ),
        );
        setPersonalityPresencePromptResponses(
          normalizePersonalityPresencePromptResponses(snapshot.personalityPresencePromptResponses),
        );
        setShowPersonalityPresenceOnProfile(Boolean(snapshot.showPersonalityPresenceOnProfile));
        setShowPersonalityPresencePromptsOnProfile(
          Boolean(snapshot.showPersonalityPresencePromptsOnProfile),
        );
        setCalendarMomentStates(normalizeCalendarMomentStates(snapshot.calendarMomentStates));
        setCalendarMomentVisibility(
          normalizeCalendarMomentVisibility(snapshot.calendarMomentVisibility),
        );
        setCustomCalendarMoments(normalizeCustomCalendarMoments(snapshot.customCalendarMoments));
        setTransportationMethod(snapshot.transportationMethod ?? "Public transport");
        setTransportationPreferences(
          normalizeSelectablePreferenceList(
            snapshot.transportationPreferences,
            transportationPreferenceOptions,
            defaultTransportationPreferences,
          ),
        );
        setMeetupContactPreferences(
          normalizeMeetupContactPreferences(snapshot.meetupContactPreferences),
        );
        setLocationComfortPreferences(
          normalizeSelectablePreferenceList(
            snapshot.locationComfortPreferences,
            locationComfortPreferenceOptions,
            defaultLocationComfortPreferences,
          ),
        );
        setDietaryPreferences(
          snapshot.dietaryPreferences?.length ? snapshot.dietaryPreferences : ["No preference"],
        );
        setFoodBeveragePreferenceIds(
          normalizeFoodBeveragePreferenceIds(snapshot.foodBeveragePreferenceIds),
        );
        setHobbiesInterests(
          snapshot.hobbiesInterests?.length
            ? snapshot.hobbiesInterests
            : ["Coffee", "Movies", "Walks"],
        );
        const storedInterestPreferenceIds = normalizeInterestPreferenceIds(
          snapshot.interestPreferenceIds,
        );
        setInterestPreferenceIds(storedInterestPreferenceIds);
        setInterestComfortTagsByInterest(
          normalizeInterestComfortTagsByInterest(
            snapshot.interestComfortTagsByInterest,
            storedInterestPreferenceIds,
          ),
        );
        setProfileShortcutLayout(snapshot.profileShortcutLayout ?? "Clean");
        setProfileWidthPreference(snapshot.profileWidthPreference ?? "Contained");
        setSettingsPrivacyMode(snapshot.settingsPrivacyMode ?? "Basic");
        setUserPreferenceTextMode(snapshot.userPreferenceTextMode ?? "Simple");
        setEmojiDisplayMode(normalizeEmojiDisplayMode(snapshot.emojiDisplayMode));
        setShowProfileControlsShortcut(snapshot.showProfileControlsShortcut ?? true);
        setShowAlertsSettingsShortcut(snapshot.showAlertsSettingsShortcut ?? true);
        setExternalLinks(normalizeExternalLinksPreference(snapshot.externalLinks));
        setBatterySaver(Boolean(snapshot.batterySaver));
        setLowLightMode(Boolean(snapshot.lowLightMode));
        setLowLightLevel(snapshot.lowLightLevel ?? "Medium");
        setHomeViewMode(snapshot.homeViewMode ?? "Essential");
        setHomeNearbyOnly(Boolean(snapshot.homeNearbyOnly));
        setHomeSmallGroupsOnly(Boolean(snapshot.homeSmallGroupsOnly));
        setHomeWeatherSafeOnly(Boolean(snapshot.homeWeatherSafeOnly));
        setHomeEventLayout(snapshot.homeEventLayout ?? "List");
        setHomeLayoutDensity(snapshot.homeLayoutDensity ?? "Compact");
        setHomeFitToScreen(Boolean(snapshot.homeFitToScreen));
        setHomeHeaderControlsDensity(
          normalizeHomeHeaderControlsDensity(snapshot.homeHeaderControlsDensity),
        );
        setHomeCardLayout(snapshot.homeCardLayout ?? "Vertical list");
        setHomeEventVisualMode(normalizeHomeEventVisualMode(snapshot.homeEventVisualMode));
        setHomeVisibleSections(normalizeHomeVisibleSections(snapshot.homeVisibleSections));
        setHomeSectionOrder(normalizeHomeSectionOrder(snapshot.homeSectionOrder));
        setSuggestNightModeInEvenings(Boolean(snapshot.suggestNightModeInEvenings));
        setNotificationSnoozed(Boolean(snapshot.notificationSnoozed));
        setNotificationSnoozePreset(snapshot.notificationSnoozePreset ?? "Tonight");
        setAppLanguageState(normalizeNsnLanguage(snapshot.appLanguage));
        setTranslationLanguageState(normalizeNsnLanguage(snapshot.translationLanguage));
        setBrandThemeIdState(normalizeBrandThemeId(snapshot.brandThemeId));
        setSkyThemeIdState(normalizeSkyThemeId(snapshot.skyThemeId));
        setTimezone(normalizeTimezoneSetting(snapshot.timezone));
        setTimeContextMode(normalizeTimeContextMode(snapshot.timeContextMode));
        setDateFormatPreference(normalizeDateFormatPreference(snapshot.dateFormatPreference));
        setShowWeekday(snapshot.showWeekday ?? true);
        setTimeFormatPreference(normalizeTimeFormatPreference(snapshot.timeFormatPreference));
        setClockDisplayStyle(normalizeClockDisplayStyle(snapshot.clockDisplayStyle));
        setShowDigitalTimeWithAnalog(Boolean(snapshot.showDigitalTimeWithAnalog));
        setTemperatureUnitPreference(
          normalizeTemperatureUnitPreference(snapshot.temperatureUnitPreference),
        );
        setDistanceUnitPreference(normalizeDistanceUnitPreference(snapshot.distanceUnitPreference));
        setCurrencyDisplayPreference(
          normalizeCurrencyDisplayPreference(snapshot.currencyDisplayPreference),
        );
        setDayNightModePreference(
          snapshot.dayNightModePreference
            ? normalizeDayNightModePreference(snapshot.dayNightModePreference)
            : "Follow selected suburb/local time",
        );
        setCardOutlineStyle(normalizeCardOutlineStyle(snapshot.cardOutlineStyle));
        setBlurProfilePhoto(
          snapshot.blurProfilePhoto ?? (snapshot.visibilityPreference ?? "Blurred") === "Blurred",
        );
      } catch (error) {
        console.warn("NSN onboarding could not load:", error);
      } finally {
        if (isMounted) {
          setIsOnboardingLoaded(true);
        }
      }
    }

    loadOnboarding();

    return () => {
      isMounted = false;
    };
  }, []);

  const completeOnboarding = async (
    snapshot: Omit<OnboardingSnapshot, "hasCompletedOnboarding">,
  ) => {
    setAgeConfirmed(snapshot.ageConfirmed);
    const nextAgeRange = normalizePreferredAgeRange(
      snapshot.preferredAgeMin,
      snapshot.preferredAgeMax,
    );
    const nextAge = normalizeAdultAge(snapshot.age);
    setAge(nextAge);
    setPreferredAgeMin(nextAgeRange.min);
    setPreferredAgeMax(nextAgeRange.max);
    setSuburb(snapshot.suburb);
    setIntent(snapshot.intent);
    setDisplayName(snapshot.displayName);
    setMiddleName(snapshot.middleName ?? "");
    setLastName(snapshot.lastName ?? "");
    setGender(snapshot.gender ?? "Not specified");
    const nextMiddleNameDisplay = normalizeNameDisplayMode(
      snapshot.middleNameDisplay,
      snapshot.showMiddleName ? "Full" : "Hidden",
    );
    const nextLastNameDisplay = normalizeNameDisplayMode(
      snapshot.lastNameDisplay,
      snapshot.showLastName ? "Full" : "Hidden",
    );
    setMiddleNameDisplay(nextMiddleNameDisplay);
    setLastNameDisplay(nextLastNameDisplay);
    setShowMiddleName(nextMiddleNameDisplay !== "Hidden");
    setShowLastName(nextLastNameDisplay !== "Hidden");
    setShowAge(Boolean(snapshot.showAge));
    setShowPreferredAgeRange(Boolean(snapshot.showPreferredAgeRange));
    setShowGender(Boolean(snapshot.showGender));
    setProfilePhotoUri(snapshot.profilePhotoUri);
    setContactEmail(snapshot.contactEmail ?? "");
    setContactPhone(snapshot.contactPhone ?? "");
    setIdentitySelfieUri(snapshot.identitySelfieUri ?? null);
    setHasIdentityDocument(Boolean(snapshot.hasIdentityDocument));
    setVisibilityPreference(snapshot.visibilityPreference);
    setComfortMode(snapshot.comfortMode ?? "Comfort Mode");
    setPrivateProfile(Boolean(snapshot.privateProfile));
    setBlurLevel(snapshot.blurLevel ?? "Medium blur");
    setSoftRevealSuggestions(snapshot.softRevealSuggestions ?? true);
    setSoftRevealPace(snapshot.softRevealPace ?? "Gradual reveal");
    setPreferSoftRevealPeople(Boolean(snapshot.preferSoftRevealPeople));
    setWarmUpLowerBlur(snapshot.warmUpLowerBlur ?? true);
    setShowSuburbArea(snapshot.showSuburbArea ?? true);
    setShowInterests(snapshot.showInterests ?? true);
    setShowComfortPreferences(snapshot.showComfortPreferences ?? true);
    setMinimalProfileView(Boolean(snapshot.minimalProfileView));
    setComfortPreferences(snapshot.comfortPreferences);
    setVerificationLevel(snapshot.verificationLevel);
    setEventMemberships(snapshot.eventMemberships);
    setBlockedUserIds(snapshot.blockedUserIds);
    setSafetyReports(snapshot.safetyReports);
    setPostEventFeedback(snapshot.postEventFeedback);
    setSavedPlaces(snapshot.savedPlaces);
    setPinnedEventIds(snapshot.pinnedEventIds);
    setHiddenEventIds(snapshot.hiddenEventIds);
    setNoiseLevelPreference(snapshot.noiseLevelPreference ?? "Any");
    setContactPreferences(
      snapshot.contactPreferences?.length ? snapshot.contactPreferences : ["Text"],
    );
    const nextSocialEnergyPreference = normalizeSocialEnergyPreference(
      snapshot.socialEnergyPreference,
    );
    const nextCommunicationPreferences = normalizeCommunicationPreferences(
      snapshot.communicationPreferences,
    );
    const nextGroupSizePreference = normalizeGroupSizePreference(snapshot.groupSizePreference);
    const nextPhotoRecordingComfortPreferences = normalizePhotoRecordingComfortPreferences(
      snapshot.photoRecordingComfortPreferences,
    );
    const nextPhysicalContactComfortPreferences = normalizePhysicalContactComfortPreferences(
      snapshot.physicalContactComfortPreferences,
    );
    const nextBackgroundStudyStatuses = normalizeBackgroundPreferenceList(
      snapshot.backgroundStudyStatuses,
      backgroundStudyStatusOptions,
    );
    const nextBackgroundStudyAreas = normalizeBackgroundPreferenceList(
      snapshot.backgroundStudyAreas,
      backgroundStudyAreaOptions,
    );
    const nextBackgroundStudyVisibility = normalizeBackgroundVisibilityPreference(
      snapshot.backgroundStudyVisibility,
    );
    const nextBackgroundWorkPreferences = normalizeBackgroundPreferenceList(
      snapshot.backgroundWorkPreferences,
      backgroundWorkOptions,
    );
    const nextBackgroundWorkRhythms = normalizeBackgroundPreferenceList(
      snapshot.backgroundWorkRhythms,
      backgroundWorkRhythmOptions,
    );
    const nextBackgroundWorkVisibility = normalizeBackgroundVisibilityPreference(
      snapshot.backgroundWorkVisibility,
    );
    const nextBackgroundCommunityPreferences = normalizeBackgroundPreferenceList(
      snapshot.backgroundCommunityPreferences,
      backgroundCommunityOptions,
    );
    const nextBackgroundCommunityVisibility = normalizeBackgroundVisibilityPreference(
      snapshot.backgroundCommunityVisibility,
    );
    const nextLifeContextCurrentStates = normalizeBackgroundPreferenceList(
      snapshot.lifeContextCurrentStates,
      lifeContextCurrentStateOptions,
    );
    const nextLifeContextCurrentVisibility = normalizeBackgroundVisibilityPreference(
      snapshot.lifeContextCurrentVisibility,
    );
    const nextLifeContextFields = normalizeBackgroundPreferenceList(
      snapshot.lifeContextFields,
      lifeContextFieldOptions,
    );
    const nextLifeContextFieldVisibility = normalizeBackgroundVisibilityPreference(
      snapshot.lifeContextFieldVisibility,
    );
    const nextLifeContextLearningInterests = normalizeBackgroundPreferenceList(
      snapshot.lifeContextLearningInterests,
      lifeContextLearningOptions,
    );
    const nextLifeContextLearningVisibility = normalizeBackgroundVisibilityPreference(
      snapshot.lifeContextLearningVisibility ?? "Shared preview visibility only",
    );
    const nextLifeComfortPreferences = normalizeBackgroundPreferenceList(
      snapshot.lifeComfortPreferences,
      lifeComfortOptions,
    );
    const nextLifeComfortVisibility = normalizeBackgroundVisibilityPreference(
      snapshot.lifeComfortVisibility,
    );
    const nextFriendshipStylePreferences = normalizeBackgroundPreferenceList(
      snapshot.friendshipStylePreferences,
      friendshipStyleOptions,
    );
    const nextDatingStylePreferences = normalizeBackgroundPreferenceList(
      snapshot.datingStylePreferences,
      datingStyleOptions,
    );
    const nextMeetupRhythmPreferences = normalizeBackgroundPreferenceList(
      snapshot.meetupRhythmPreferences,
      meetupRhythmOptions,
    );
    const nextAvailabilityTimingPreferences = normalizeBackgroundPreferenceList(
      snapshot.availabilityTimingPreferences,
      availabilityTimingOptions,
    );
    const nextSocialDurationPreferences = normalizeBackgroundPreferenceList(
      snapshot.socialDurationPreferences,
      socialDurationOptions,
    );
    const nextLanguageComfortPreferences = normalizeLanguageComfortPreferences(
      snapshot.languageComfortPreferences,
    );
    const nextLifeContextLastUpdatedAt =
      normalizeLifeContextUpdatedAt(snapshot.lifeContextLastUpdatedAt) ??
      (nextLifeContextCurrentStates.length ||
      nextLifeContextFields.length ||
      nextLifeContextLearningInterests.length
        ? new Date().toISOString()
        : null);
    const nextCalendarMomentStates = normalizeCalendarMomentStates(snapshot.calendarMomentStates);
    const nextCalendarMomentVisibility = normalizeCalendarMomentVisibility(
      snapshot.calendarMomentVisibility,
    );
    const nextCustomCalendarMoments = normalizeCustomCalendarMoments(
      snapshot.customCalendarMoments,
    );
    const nextPersonalityPresenceHair = normalizePersonalityPresenceChoice(
      snapshot.personalityPresenceHair,
      personalityPresenceHairOptions,
    );
    const nextPersonalityPresenceHairCues = normalizePersonalityPresenceList(
      snapshot.personalityPresenceHairCues,
      personalityPresenceHairCueOptions,
    );
    const nextPersonalityPresenceEyes = normalizePersonalityPresenceChoice(
      snapshot.personalityPresenceEyes,
      personalityPresenceEyeOptions,
    );
    const nextPersonalityPresenceFacialHair = normalizePersonalityPresenceChoice(
      snapshot.personalityPresenceFacialHair,
      personalityPresenceFacialHairOptions,
    );
    const nextPersonalityPresenceStyle = normalizePersonalityPresenceChoice(
      snapshot.personalityPresenceStyle,
      personalityPresenceStyleOptions,
    );
    const nextPersonalityPresencePresentation = normalizePersonalityPresenceChoice(
      snapshot.personalityPresencePresentation,
      personalityPresencePresentationOptions,
    );
    const nextPersonalityPresencePersonalStyles = normalizePersonalityPresenceList(
      snapshot.personalityPresencePersonalStyles,
      personalityPresencePersonalStyleOptions,
    );
    const nextPersonalityPresenceAccessories = normalizePersonalityPresenceList(
      snapshot.personalityPresenceAccessories,
      personalityPresenceAccessoriesOptions,
    );
    const nextPersonalityPresenceGrooming = normalizePersonalityPresenceList(
      snapshot.personalityPresenceGrooming,
      personalityPresenceGroomingOptions,
    );
    const nextPersonalityPresenceVoicePresence = normalizePersonalityPresenceList(
      snapshot.personalityPresenceVoicePresence,
      personalityPresenceVoicePresenceOptions,
    );
    const nextPersonalityPresenceSocialStyles = normalizePersonalityPresenceList(
      snapshot.personalityPresenceSocialStyles,
      personalityPresenceSocialStyleOptions,
    );
    const nextPersonalityPresenceConnectionPreferences = normalizePersonalityPresenceList(
      snapshot.personalityPresenceConnectionPreferences,
      personalityPresenceConnectionOptions,
    );
    const nextPersonalityPresenceComfortAround = normalizePersonalityPresenceList(
      snapshot.personalityPresenceComfortAround,
      personalityPresenceComfortAroundOptions,
    );
    const nextPersonalityPresencePromptResponses = normalizePersonalityPresencePromptResponses(
      snapshot.personalityPresencePromptResponses,
    );
    setSocialEnergyPreference(nextSocialEnergyPreference);
    setCommunicationPreferences(nextCommunicationPreferences);
    setGroupSizePreference(nextGroupSizePreference);
    setPhotoRecordingComfortPreferences(nextPhotoRecordingComfortPreferences);
    setPhysicalContactComfortPreferences(nextPhysicalContactComfortPreferences);
    setBackgroundStudyStatuses(nextBackgroundStudyStatuses);
    setBackgroundStudyAreas(nextBackgroundStudyAreas);
    setBackgroundStudyVisibility(nextBackgroundStudyVisibility);
    setBackgroundWorkPreferences(nextBackgroundWorkPreferences);
    setBackgroundWorkRhythms(nextBackgroundWorkRhythms);
    setBackgroundWorkVisibility(nextBackgroundWorkVisibility);
    setBackgroundCommunityPreferences(nextBackgroundCommunityPreferences);
    setBackgroundCommunityVisibility(nextBackgroundCommunityVisibility);
    setLifeContextCurrentStates(nextLifeContextCurrentStates);
    setLifeContextCurrentVisibility(nextLifeContextCurrentVisibility);
    setLifeContextFields(nextLifeContextFields);
    setLifeContextFieldVisibility(nextLifeContextFieldVisibility);
    setLifeContextLearningInterests(nextLifeContextLearningInterests);
    setLifeContextLearningVisibility(nextLifeContextLearningVisibility);
    setLifeComfortPreferences(nextLifeComfortPreferences);
    setLifeComfortVisibility(nextLifeComfortVisibility);
    setFriendshipStylePreferences(nextFriendshipStylePreferences);
    setDatingStylePreferences(nextDatingStylePreferences);
    setMeetupRhythmPreferences(nextMeetupRhythmPreferences);
    setAvailabilityTimingPreferences(nextAvailabilityTimingPreferences);
    setSocialDurationPreferences(nextSocialDurationPreferences);
    setLanguageComfortPreferences(nextLanguageComfortPreferences);
    setLifeContextLastUpdatedAt(nextLifeContextLastUpdatedAt);
    setPersonalityPresenceHair(nextPersonalityPresenceHair);
    setPersonalityPresenceHairCues(nextPersonalityPresenceHairCues);
    setPersonalityPresenceEyes(nextPersonalityPresenceEyes);
    setPersonalityPresenceFacialHair(nextPersonalityPresenceFacialHair);
    setPersonalityPresenceStyle(nextPersonalityPresenceStyle);
    setPersonalityPresencePresentation(nextPersonalityPresencePresentation);
    setPersonalityPresencePersonalStyles(nextPersonalityPresencePersonalStyles);
    setPersonalityPresenceAccessories(nextPersonalityPresenceAccessories);
    setPersonalityPresenceGrooming(nextPersonalityPresenceGrooming);
    setPersonalityPresenceVoicePresence(nextPersonalityPresenceVoicePresence);
    setPersonalityPresenceSocialStyles(nextPersonalityPresenceSocialStyles);
    setPersonalityPresenceConnectionPreferences(nextPersonalityPresenceConnectionPreferences);
    setPersonalityPresenceComfortAround(nextPersonalityPresenceComfortAround);
    setPersonalityPresencePromptResponses(nextPersonalityPresencePromptResponses);
    setShowPersonalityPresenceOnProfile(Boolean(snapshot.showPersonalityPresenceOnProfile));
    setShowPersonalityPresencePromptsOnProfile(
      Boolean(snapshot.showPersonalityPresencePromptsOnProfile),
    );
    setCalendarMomentStates(nextCalendarMomentStates);
    setCalendarMomentVisibility(nextCalendarMomentVisibility);
    setCustomCalendarMoments(nextCustomCalendarMoments);
    setVerifiedButPrivate(snapshot.verifiedButPrivate ?? true);
    setTransportationMethod(snapshot.transportationMethod);
    const nextTransportationPreferences = normalizeSelectablePreferenceList(
      snapshot.transportationPreferences,
      transportationPreferenceOptions,
      defaultTransportationPreferences,
    );
    const nextMeetupContactPreferences = normalizeMeetupContactPreferences(
      snapshot.meetupContactPreferences,
    );
    const nextLocationComfortPreferences = normalizeSelectablePreferenceList(
      snapshot.locationComfortPreferences,
      locationComfortPreferenceOptions,
      defaultLocationComfortPreferences,
    );
    setTransportationPreferences(nextTransportationPreferences);
    setMeetupContactPreferences(nextMeetupContactPreferences);
    setLocationComfortPreferences(nextLocationComfortPreferences);
    setDietaryPreferences(snapshot.dietaryPreferences);
    const nextFoodBeveragePreferenceIds = normalizeFoodBeveragePreferenceIds(
      snapshot.foodBeveragePreferenceIds,
    );
    setFoodBeveragePreferenceIds(nextFoodBeveragePreferenceIds);
    setHobbiesInterests(snapshot.hobbiesInterests);
    const nextInterestPreferenceIds = normalizeInterestPreferenceIds(
      snapshot.interestPreferenceIds,
    );
    const nextInterestComfortTagsByInterest = normalizeInterestComfortTagsByInterest(
      snapshot.interestComfortTagsByInterest,
      nextInterestPreferenceIds,
    );
    setInterestPreferenceIds(nextInterestPreferenceIds);
    setInterestComfortTagsByInterest(nextInterestComfortTagsByInterest);
    setProfileShortcutLayout(snapshot.profileShortcutLayout ?? "Clean");
    setProfileWidthPreference(snapshot.profileWidthPreference ?? "Contained");
    setSettingsPrivacyMode(snapshot.settingsPrivacyMode ?? "Basic");
    setUserPreferenceTextMode(snapshot.userPreferenceTextMode ?? "Simple");
    setEmojiDisplayMode(normalizeEmojiDisplayMode(snapshot.emojiDisplayMode));
    setShowProfileControlsShortcut(snapshot.showProfileControlsShortcut ?? true);
    setShowAlertsSettingsShortcut(snapshot.showAlertsSettingsShortcut ?? true);
    setExternalLinks(normalizeExternalLinksPreference(snapshot.externalLinks));
    setBatterySaver(Boolean(snapshot.batterySaver));
    setLowLightMode(Boolean(snapshot.lowLightMode));
    setLowLightLevel(snapshot.lowLightLevel ?? "Medium");
    setHomeViewMode(snapshot.homeViewMode ?? "Essential");
    setHomeNearbyOnly(Boolean(snapshot.homeNearbyOnly));
    setHomeSmallGroupsOnly(Boolean(snapshot.homeSmallGroupsOnly));
    setHomeWeatherSafeOnly(Boolean(snapshot.homeWeatherSafeOnly));
    setHomeEventLayout(snapshot.homeEventLayout ?? "List");
    setHomeLayoutDensity(snapshot.homeLayoutDensity ?? "Compact");
    setHomeFitToScreen(Boolean(snapshot.homeFitToScreen));
    setHomeHeaderControlsDensity(
      normalizeHomeHeaderControlsDensity(snapshot.homeHeaderControlsDensity),
    );
    setHomeCardLayout(snapshot.homeCardLayout ?? "Vertical list");
    setHomeEventVisualMode(normalizeHomeEventVisualMode(snapshot.homeEventVisualMode));
    setHomeVisibleSections(normalizeHomeVisibleSections(snapshot.homeVisibleSections));
    setHomeSectionOrder(normalizeHomeSectionOrder(snapshot.homeSectionOrder));
    setSuggestNightModeInEvenings(Boolean(snapshot.suggestNightModeInEvenings));
    setNotificationSnoozed(Boolean(snapshot.notificationSnoozed));
    setNotificationSnoozePreset(snapshot.notificationSnoozePreset ?? "Tonight");
    setAppLanguageState(normalizeNsnLanguage(snapshot.appLanguage));
    setTranslationLanguageState(normalizeNsnLanguage(snapshot.translationLanguage));
    setBrandThemeIdState(normalizeBrandThemeId(snapshot.brandThemeId));
    setSkyThemeIdState(normalizeSkyThemeId(snapshot.skyThemeId));
    setTimezone(normalizeTimezoneSetting(snapshot.timezone));
    setTimeContextMode(normalizeTimeContextMode(snapshot.timeContextMode));
    setDateFormatPreference(normalizeDateFormatPreference(snapshot.dateFormatPreference));
    setShowWeekday(snapshot.showWeekday ?? true);
    setTimeFormatPreference(normalizeTimeFormatPreference(snapshot.timeFormatPreference));
    setClockDisplayStyle(normalizeClockDisplayStyle(snapshot.clockDisplayStyle));
    setShowDigitalTimeWithAnalog(Boolean(snapshot.showDigitalTimeWithAnalog));
    setTemperatureUnitPreference(
      normalizeTemperatureUnitPreference(snapshot.temperatureUnitPreference),
    );
    setDistanceUnitPreference(normalizeDistanceUnitPreference(snapshot.distanceUnitPreference));
    setCurrencyDisplayPreference(
      normalizeCurrencyDisplayPreference(snapshot.currencyDisplayPreference),
    );
    setDayNightModePreference(
      snapshot.dayNightModePreference
        ? normalizeDayNightModePreference(snapshot.dayNightModePreference)
        : "Follow selected suburb/local time",
    );
    setCardOutlineStyle(normalizeCardOutlineStyle(snapshot.cardOutlineStyle));
    setBlurProfilePhoto(snapshot.blurProfilePhoto ?? snapshot.visibilityPreference === "Blurred");
    setHasCompletedOnboarding(true);

    try {
      await AsyncStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({
          ...snapshot,
          age: nextAge,
          preferredAgeMin: nextAgeRange.min,
          preferredAgeMax: nextAgeRange.max,
          appLanguage: normalizeNsnLanguage(snapshot.appLanguage),
          translationLanguage: normalizeNsnLanguage(snapshot.translationLanguage),
          skyThemeId: normalizeSkyThemeId(snapshot.skyThemeId),
          homeHeaderControlsDensity: normalizeHomeHeaderControlsDensity(
            snapshot.homeHeaderControlsDensity,
          ),
          homeEventVisualMode: normalizeHomeEventVisualMode(snapshot.homeEventVisualMode),
          homeVisibleSections: normalizeHomeVisibleSections(snapshot.homeVisibleSections),
          homeSectionOrder: normalizeHomeSectionOrder(snapshot.homeSectionOrder),
          timezone: normalizeTimezoneSetting(snapshot.timezone),
          timeContextMode: normalizeTimeContextMode(snapshot.timeContextMode),
          dateFormatPreference: normalizeDateFormatPreference(snapshot.dateFormatPreference),
          socialEnergyPreference: nextSocialEnergyPreference,
          communicationPreferences: nextCommunicationPreferences,
          groupSizePreference: nextGroupSizePreference,
          photoRecordingComfortPreferences: nextPhotoRecordingComfortPreferences,
          physicalContactComfortPreferences: nextPhysicalContactComfortPreferences,
          backgroundStudyStatuses: nextBackgroundStudyStatuses,
          backgroundStudyAreas: nextBackgroundStudyAreas,
          backgroundStudyVisibility: nextBackgroundStudyVisibility,
          backgroundWorkPreferences: nextBackgroundWorkPreferences,
          backgroundWorkRhythms: nextBackgroundWorkRhythms,
          backgroundWorkVisibility: nextBackgroundWorkVisibility,
          backgroundCommunityPreferences: nextBackgroundCommunityPreferences,
          backgroundCommunityVisibility: nextBackgroundCommunityVisibility,
          lifeContextCurrentStates: nextLifeContextCurrentStates,
          lifeContextCurrentVisibility: nextLifeContextCurrentVisibility,
          lifeContextFields: nextLifeContextFields,
          lifeContextFieldVisibility: nextLifeContextFieldVisibility,
          lifeContextLearningInterests: nextLifeContextLearningInterests,
          lifeContextLearningVisibility: nextLifeContextLearningVisibility,
          lifeComfortPreferences: nextLifeComfortPreferences,
          lifeComfortVisibility: nextLifeComfortVisibility,
          friendshipStylePreferences: nextFriendshipStylePreferences,
          datingStylePreferences: nextDatingStylePreferences,
          meetupRhythmPreferences: nextMeetupRhythmPreferences,
          availabilityTimingPreferences: nextAvailabilityTimingPreferences,
          socialDurationPreferences: nextSocialDurationPreferences,
          languageComfortPreferences: nextLanguageComfortPreferences,
          lifeContextLastUpdatedAt: nextLifeContextLastUpdatedAt,
          personalityPresenceHair: nextPersonalityPresenceHair,
          personalityPresenceHairCues: nextPersonalityPresenceHairCues,
          personalityPresenceEyes: nextPersonalityPresenceEyes,
          personalityPresenceFacialHair: nextPersonalityPresenceFacialHair,
          personalityPresenceStyle: nextPersonalityPresenceStyle,
          personalityPresencePresentation: nextPersonalityPresencePresentation,
          personalityPresencePersonalStyles: nextPersonalityPresencePersonalStyles,
          personalityPresenceAccessories: nextPersonalityPresenceAccessories,
          personalityPresenceGrooming: nextPersonalityPresenceGrooming,
          personalityPresenceVoicePresence: nextPersonalityPresenceVoicePresence,
          personalityPresenceSocialStyles: nextPersonalityPresenceSocialStyles,
          personalityPresenceConnectionPreferences: nextPersonalityPresenceConnectionPreferences,
          personalityPresenceComfortAround: nextPersonalityPresenceComfortAround,
          personalityPresencePromptResponses: nextPersonalityPresencePromptResponses,
          showPersonalityPresenceOnProfile: Boolean(snapshot.showPersonalityPresenceOnProfile),
          showPersonalityPresencePromptsOnProfile: Boolean(
            snapshot.showPersonalityPresencePromptsOnProfile,
          ),
          calendarMomentStates: nextCalendarMomentStates,
          calendarMomentVisibility: nextCalendarMomentVisibility,
          customCalendarMoments: nextCustomCalendarMoments,
          verifiedButPrivate: snapshot.verifiedButPrivate ?? true,
          transportationPreferences: nextTransportationPreferences,
          meetupContactPreferences: nextMeetupContactPreferences,
          locationComfortPreferences: nextLocationComfortPreferences,
          foodBeveragePreferenceIds: nextFoodBeveragePreferenceIds,
          interestPreferenceIds: nextInterestPreferenceIds,
          interestComfortTagsByInterest: nextInterestComfortTagsByInterest,
          emojiDisplayMode: normalizeEmojiDisplayMode(snapshot.emojiDisplayMode),
          showWeekday: snapshot.showWeekday ?? true,
          timeFormatPreference: normalizeTimeFormatPreference(snapshot.timeFormatPreference),
          clockDisplayStyle: normalizeClockDisplayStyle(snapshot.clockDisplayStyle),
          showDigitalTimeWithAnalog: Boolean(snapshot.showDigitalTimeWithAnalog),
          temperatureUnitPreference: normalizeTemperatureUnitPreference(
            snapshot.temperatureUnitPreference,
          ),
          distanceUnitPreference: normalizeDistanceUnitPreference(snapshot.distanceUnitPreference),
          currencyDisplayPreference: normalizeCurrencyDisplayPreference(
            snapshot.currencyDisplayPreference,
          ),
          dayNightModePreference: snapshot.dayNightModePreference
            ? normalizeDayNightModePreference(snapshot.dayNightModePreference)
            : "Follow selected suburb/local time",
          cardOutlineStyle: normalizeCardOutlineStyle(snapshot.cardOutlineStyle),
          hasCompletedOnboarding: true,
        } satisfies OnboardingSnapshot),
      );
    } catch (error) {
      console.warn("NSN onboarding could not save:", error);
    }
  };

  const saveSoftHelloMvpState = async (
    snapshot: Partial<Omit<OnboardingSnapshot, "hasCompletedOnboarding">> = {},
  ) => {
    const nextSnapshot: OnboardingSnapshot = {
      hasCompletedOnboarding,
      accountPaused,
      accountPauseTimeline,
      ageConfirmed,
      age,
      preferredAgeMin,
      preferredAgeMax,
      suburb,
      intent,
      displayName,
      middleName,
      lastName,
      gender,
      middleNameDisplay,
      lastNameDisplay,
      showMiddleName,
      showLastName,
      showAge,
      showPreferredAgeRange,
      showGender,
      profilePhotoUri,
      contactEmail,
      contactPhone,
      identitySelfieUri,
      hasIdentityDocument,
      visibilityPreference,
      comfortMode,
      privateProfile,
      blurProfilePhoto,
      blurLevel,
      softRevealSuggestions,
      softRevealPace,
      preferSoftRevealPeople,
      warmUpLowerBlur,
      showSuburbArea,
      showInterests,
      showComfortPreferences,
      minimalProfileView,
      comfortPreferences,
      verificationLevel,
      eventMemberships,
      blockedUserIds,
      safetyReports,
      postEventFeedback,
      savedPlaces,
      pinnedEventIds,
      hiddenEventIds,
      noiseLevelPreference,
      contactPreferences,
      socialEnergyPreference,
      communicationPreferences,
      groupSizePreference,
      photoRecordingComfortPreferences,
      physicalContactComfortPreferences,
      backgroundStudyStatuses,
      backgroundStudyAreas,
      backgroundStudyVisibility,
      backgroundWorkPreferences,
      backgroundWorkRhythms,
      backgroundWorkVisibility,
      backgroundCommunityPreferences,
      backgroundCommunityVisibility,
      lifeContextCurrentStates,
      lifeContextCurrentVisibility,
      lifeContextFields,
      lifeContextFieldVisibility,
      lifeContextLearningInterests,
      lifeContextLearningVisibility,
      lifeComfortPreferences,
      lifeComfortVisibility,
      lifeContextLastUpdatedAt,
      verifiedButPrivate,
      personalityPresenceHair,
      personalityPresenceHairCues,
      personalityPresenceEyes,
      personalityPresenceFacialHair,
      personalityPresenceStyle,
      personalityPresencePresentation,
      personalityPresencePersonalStyles,
      personalityPresenceAccessories,
      personalityPresenceGrooming,
      personalityPresenceVoicePresence,
      personalityPresenceSocialStyles,
      personalityPresenceConnectionPreferences,
      personalityPresenceComfortAround,
      personalityPresencePromptResponses,
      showPersonalityPresenceOnProfile,
      showPersonalityPresencePromptsOnProfile,
      calendarMomentStates,
      calendarMomentVisibility,
      customCalendarMoments,
      transportationMethod,
      friendshipStylePreferences,
      datingStylePreferences,
      meetupRhythmPreferences,
      availabilityTimingPreferences,
      socialDurationPreferences,
      languageComfortPreferences,
      transportationPreferences,
      meetupContactPreferences,
      locationComfortPreferences,
      dietaryPreferences,
      foodBeveragePreferenceIds,
      hobbiesInterests,
      interestPreferenceIds,
      interestComfortTagsByInterest,
      profileShortcutLayout,
      profileWidthPreference,
      settingsPrivacyMode,
      userPreferenceTextMode,
      emojiDisplayMode,
      showProfileControlsShortcut,
      showAlertsSettingsShortcut,
      externalLinks,
      batterySaver,
      lowLightMode,
      lowLightLevel,
      homeViewMode,
      homeNearbyOnly,
      homeSmallGroupsOnly,
      homeWeatherSafeOnly,
      homeEventLayout,
      homeLayoutDensity,
      homeFitToScreen,
      homeHeaderControlsDensity,
      homeCardLayout,
      homeEventVisualMode,
      homeVisibleSections,
      homeSectionOrder,
      suggestNightModeInEvenings,
      notificationSnoozed,
      notificationSnoozePreset,
      appLanguage,
      translationLanguage,
      brandThemeId,
      skyThemeId,
      timezone,
      timeContextMode,
      dateFormatPreference,
      showWeekday,
      timeFormatPreference,
      clockDisplayStyle,
      showDigitalTimeWithAnalog,
      temperatureUnitPreference,
      distanceUnitPreference,
      currencyDisplayPreference,
      dayNightModePreference,
      cardOutlineStyle,
      ...snapshot,
    };
    const lifeContextTouched =
      snapshot.lifeContextCurrentStates !== undefined ||
      snapshot.lifeContextCurrentVisibility !== undefined ||
      snapshot.lifeContextFields !== undefined ||
      snapshot.lifeContextFieldVisibility !== undefined ||
      snapshot.lifeContextLearningInterests !== undefined ||
      snapshot.lifeContextLearningVisibility !== undefined ||
      snapshot.lifeComfortPreferences !== undefined ||
      snapshot.lifeComfortVisibility !== undefined;

    nextSnapshot.appLanguage = normalizeNsnLanguage(nextSnapshot.appLanguage);
    nextSnapshot.translationLanguage = normalizeNsnLanguage(nextSnapshot.translationLanguage);
    nextSnapshot.brandThemeId = normalizeBrandThemeId(nextSnapshot.brandThemeId);
    nextSnapshot.skyThemeId = normalizeSkyThemeId(nextSnapshot.skyThemeId);
    nextSnapshot.timezone = normalizeTimezoneSetting(nextSnapshot.timezone);
    nextSnapshot.timeContextMode = normalizeTimeContextMode(nextSnapshot.timeContextMode);
    nextSnapshot.dateFormatPreference = normalizeDateFormatPreference(
      nextSnapshot.dateFormatPreference,
    );
    nextSnapshot.showWeekday = Boolean(nextSnapshot.showWeekday);
    nextSnapshot.timeFormatPreference = normalizeTimeFormatPreference(
      nextSnapshot.timeFormatPreference,
    );
    nextSnapshot.clockDisplayStyle = normalizeClockDisplayStyle(nextSnapshot.clockDisplayStyle);
    nextSnapshot.showDigitalTimeWithAnalog = Boolean(nextSnapshot.showDigitalTimeWithAnalog);
    nextSnapshot.temperatureUnitPreference = normalizeTemperatureUnitPreference(
      nextSnapshot.temperatureUnitPreference,
    );
    nextSnapshot.distanceUnitPreference = normalizeDistanceUnitPreference(
      nextSnapshot.distanceUnitPreference,
    );
    nextSnapshot.currencyDisplayPreference = normalizeCurrencyDisplayPreference(
      nextSnapshot.currencyDisplayPreference,
    );
    nextSnapshot.dayNightModePreference = normalizeDayNightModePreference(
      nextSnapshot.dayNightModePreference,
    );
    nextSnapshot.cardOutlineStyle = normalizeCardOutlineStyle(nextSnapshot.cardOutlineStyle);
    nextSnapshot.emojiDisplayMode = normalizeEmojiDisplayMode(nextSnapshot.emojiDisplayMode);
    nextSnapshot.homeFitToScreen = Boolean(nextSnapshot.homeFitToScreen);
    nextSnapshot.homeHeaderControlsDensity = normalizeHomeHeaderControlsDensity(
      nextSnapshot.homeHeaderControlsDensity,
    );
    nextSnapshot.socialEnergyPreference = normalizeSocialEnergyPreference(
      nextSnapshot.socialEnergyPreference,
    );
    nextSnapshot.communicationPreferences = normalizeCommunicationPreferences(
      nextSnapshot.communicationPreferences,
    );
    nextSnapshot.groupSizePreference = normalizeGroupSizePreference(
      nextSnapshot.groupSizePreference,
    );
    nextSnapshot.photoRecordingComfortPreferences = normalizePhotoRecordingComfortPreferences(
      nextSnapshot.photoRecordingComfortPreferences,
    );
    nextSnapshot.physicalContactComfortPreferences = normalizePhysicalContactComfortPreferences(
      nextSnapshot.physicalContactComfortPreferences,
    );
    nextSnapshot.backgroundStudyStatuses = normalizeBackgroundPreferenceList(
      nextSnapshot.backgroundStudyStatuses,
      backgroundStudyStatusOptions,
    );
    nextSnapshot.backgroundStudyAreas = normalizeBackgroundPreferenceList(
      nextSnapshot.backgroundStudyAreas,
      backgroundStudyAreaOptions,
    );
    nextSnapshot.backgroundStudyVisibility = normalizeBackgroundVisibilityPreference(
      nextSnapshot.backgroundStudyVisibility,
    );
    nextSnapshot.backgroundWorkPreferences = normalizeBackgroundPreferenceList(
      nextSnapshot.backgroundWorkPreferences,
      backgroundWorkOptions,
    );
    nextSnapshot.backgroundWorkRhythms = normalizeBackgroundPreferenceList(
      nextSnapshot.backgroundWorkRhythms,
      backgroundWorkRhythmOptions,
    );
    nextSnapshot.backgroundWorkVisibility = normalizeBackgroundVisibilityPreference(
      nextSnapshot.backgroundWorkVisibility,
    );
    nextSnapshot.backgroundCommunityPreferences = normalizeBackgroundPreferenceList(
      nextSnapshot.backgroundCommunityPreferences,
      backgroundCommunityOptions,
    );
    nextSnapshot.backgroundCommunityVisibility = normalizeBackgroundVisibilityPreference(
      nextSnapshot.backgroundCommunityVisibility,
    );
    nextSnapshot.lifeContextCurrentStates = normalizeBackgroundPreferenceList(
      nextSnapshot.lifeContextCurrentStates,
      lifeContextCurrentStateOptions,
    );
    nextSnapshot.lifeContextCurrentVisibility = normalizeBackgroundVisibilityPreference(
      nextSnapshot.lifeContextCurrentVisibility,
    );
    nextSnapshot.lifeContextFields = normalizeBackgroundPreferenceList(
      nextSnapshot.lifeContextFields,
      lifeContextFieldOptions,
    );
    nextSnapshot.lifeContextFieldVisibility = normalizeBackgroundVisibilityPreference(
      nextSnapshot.lifeContextFieldVisibility,
    );
    nextSnapshot.lifeContextLearningInterests = normalizeBackgroundPreferenceList(
      nextSnapshot.lifeContextLearningInterests,
      lifeContextLearningOptions,
    );
    nextSnapshot.lifeContextLearningVisibility = normalizeBackgroundVisibilityPreference(
      nextSnapshot.lifeContextLearningVisibility ?? "Shared preview visibility only",
    );
    nextSnapshot.lifeComfortPreferences = normalizeBackgroundPreferenceList(
      nextSnapshot.lifeComfortPreferences,
      lifeComfortOptions,
    );
    nextSnapshot.lifeComfortVisibility = normalizeBackgroundVisibilityPreference(
      nextSnapshot.lifeComfortVisibility,
    );
    nextSnapshot.friendshipStylePreferences = normalizeBackgroundPreferenceList(
      nextSnapshot.friendshipStylePreferences,
      friendshipStyleOptions,
    );
    nextSnapshot.datingStylePreferences = normalizeBackgroundPreferenceList(
      nextSnapshot.datingStylePreferences,
      datingStyleOptions,
    );
    nextSnapshot.meetupRhythmPreferences = normalizeBackgroundPreferenceList(
      nextSnapshot.meetupRhythmPreferences,
      meetupRhythmOptions,
    );
    nextSnapshot.availabilityTimingPreferences = normalizeBackgroundPreferenceList(
      nextSnapshot.availabilityTimingPreferences,
      availabilityTimingOptions,
    );
    nextSnapshot.socialDurationPreferences = normalizeBackgroundPreferenceList(
      nextSnapshot.socialDurationPreferences,
      socialDurationOptions,
    );
    nextSnapshot.languageComfortPreferences = normalizeLanguageComfortPreferences(
      nextSnapshot.languageComfortPreferences,
    );
    nextSnapshot.lifeContextLastUpdatedAt = normalizeLifeContextUpdatedAt(
      lifeContextTouched && snapshot.lifeContextLastUpdatedAt === undefined
        ? new Date().toISOString()
        : nextSnapshot.lifeContextLastUpdatedAt,
    );
    nextSnapshot.verifiedButPrivate = nextSnapshot.verifiedButPrivate ?? true;
    nextSnapshot.personalityPresenceHair = normalizePersonalityPresenceChoice(
      nextSnapshot.personalityPresenceHair,
      personalityPresenceHairOptions,
    );
    nextSnapshot.personalityPresenceHairCues = normalizePersonalityPresenceList(
      nextSnapshot.personalityPresenceHairCues,
      personalityPresenceHairCueOptions,
    );
    nextSnapshot.personalityPresenceEyes = normalizePersonalityPresenceChoice(
      nextSnapshot.personalityPresenceEyes,
      personalityPresenceEyeOptions,
    );
    nextSnapshot.personalityPresenceFacialHair = normalizePersonalityPresenceChoice(
      nextSnapshot.personalityPresenceFacialHair,
      personalityPresenceFacialHairOptions,
    );
    nextSnapshot.personalityPresenceStyle = normalizePersonalityPresenceChoice(
      nextSnapshot.personalityPresenceStyle,
      personalityPresenceStyleOptions,
    );
    nextSnapshot.personalityPresencePresentation = normalizePersonalityPresenceChoice(
      nextSnapshot.personalityPresencePresentation,
      personalityPresencePresentationOptions,
    );
    nextSnapshot.personalityPresencePersonalStyles = normalizePersonalityPresenceList(
      nextSnapshot.personalityPresencePersonalStyles,
      personalityPresencePersonalStyleOptions,
    );
    nextSnapshot.personalityPresenceAccessories = normalizePersonalityPresenceList(
      nextSnapshot.personalityPresenceAccessories,
      personalityPresenceAccessoriesOptions,
    );
    nextSnapshot.personalityPresenceGrooming = normalizePersonalityPresenceList(
      nextSnapshot.personalityPresenceGrooming,
      personalityPresenceGroomingOptions,
    );
    nextSnapshot.personalityPresenceVoicePresence = normalizePersonalityPresenceList(
      nextSnapshot.personalityPresenceVoicePresence,
      personalityPresenceVoicePresenceOptions,
    );
    nextSnapshot.personalityPresenceSocialStyles = normalizePersonalityPresenceList(
      nextSnapshot.personalityPresenceSocialStyles,
      personalityPresenceSocialStyleOptions,
    );
    nextSnapshot.personalityPresenceConnectionPreferences = normalizePersonalityPresenceList(
      nextSnapshot.personalityPresenceConnectionPreferences,
      personalityPresenceConnectionOptions,
    );
    nextSnapshot.personalityPresenceComfortAround = normalizePersonalityPresenceList(
      nextSnapshot.personalityPresenceComfortAround,
      personalityPresenceComfortAroundOptions,
    );
    nextSnapshot.personalityPresencePromptResponses = normalizePersonalityPresencePromptResponses(
      nextSnapshot.personalityPresencePromptResponses,
    );
    nextSnapshot.showPersonalityPresenceOnProfile = Boolean(
      nextSnapshot.showPersonalityPresenceOnProfile,
    );
    nextSnapshot.showPersonalityPresencePromptsOnProfile = Boolean(
      nextSnapshot.showPersonalityPresencePromptsOnProfile,
    );
    nextSnapshot.calendarMomentStates = normalizeCalendarMomentStates(
      nextSnapshot.calendarMomentStates,
    );
    nextSnapshot.calendarMomentVisibility = normalizeCalendarMomentVisibility(
      nextSnapshot.calendarMomentVisibility,
    );
    nextSnapshot.customCalendarMoments = normalizeCustomCalendarMoments(
      nextSnapshot.customCalendarMoments,
    );
    nextSnapshot.transportationPreferences = normalizeSelectablePreferenceList(
      nextSnapshot.transportationPreferences,
      transportationPreferenceOptions,
      defaultTransportationPreferences,
    );
    nextSnapshot.meetupContactPreferences = normalizeMeetupContactPreferences(
      nextSnapshot.meetupContactPreferences,
    );
    nextSnapshot.locationComfortPreferences = normalizeSelectablePreferenceList(
      nextSnapshot.locationComfortPreferences,
      locationComfortPreferenceOptions,
      defaultLocationComfortPreferences,
    );
    nextSnapshot.foodBeveragePreferenceIds = normalizeFoodBeveragePreferenceIds(
      nextSnapshot.foodBeveragePreferenceIds,
    );
    nextSnapshot.interestPreferenceIds = normalizeInterestPreferenceIds(
      nextSnapshot.interestPreferenceIds,
    );
    nextSnapshot.interestComfortTagsByInterest = normalizeInterestComfortTagsByInterest(
      nextSnapshot.interestComfortTagsByInterest,
      nextSnapshot.interestPreferenceIds,
    );

    if (snapshot.ageConfirmed !== undefined) setAgeConfirmed(snapshot.ageConfirmed);
    if (snapshot.accountPaused !== undefined) setAccountPaused(snapshot.accountPaused);
    if (snapshot.accountPauseTimeline !== undefined)
      setAccountPauseTimeline(snapshot.accountPauseTimeline);
    if (snapshot.age !== undefined) {
      const nextAge = normalizeAdultAge(snapshot.age);
      setAge(nextAge);
      nextSnapshot.age = nextAge;
    }
    if (snapshot.preferredAgeMin !== undefined || snapshot.preferredAgeMax !== undefined) {
      const nextAgeRange = normalizePreferredAgeRange(
        snapshot.preferredAgeMin ?? preferredAgeMin,
        snapshot.preferredAgeMax ?? preferredAgeMax,
      );
      setPreferredAgeMin(nextAgeRange.min);
      setPreferredAgeMax(nextAgeRange.max);
      nextSnapshot.preferredAgeMin = nextAgeRange.min;
      nextSnapshot.preferredAgeMax = nextAgeRange.max;
    }
    if (snapshot.suburb !== undefined) setSuburb(snapshot.suburb);
    if (snapshot.intent !== undefined) setIntent(snapshot.intent);
    if (snapshot.displayName !== undefined) setDisplayName(snapshot.displayName);
    if (snapshot.middleName !== undefined) setMiddleName(snapshot.middleName);
    if (snapshot.lastName !== undefined) setLastName(snapshot.lastName);
    if (snapshot.gender !== undefined) setGender(snapshot.gender);
    if (snapshot.middleNameDisplay !== undefined) {
      const nextMode = normalizeNameDisplayMode(snapshot.middleNameDisplay);
      setMiddleNameDisplay(nextMode);
      setShowMiddleName(nextMode !== "Hidden");
      nextSnapshot.showMiddleName = nextMode !== "Hidden";
    } else if (snapshot.showMiddleName !== undefined) {
      setShowMiddleName(snapshot.showMiddleName);
      const nextMode = snapshot.showMiddleName ? "Full" : "Hidden";
      setMiddleNameDisplay(nextMode);
      nextSnapshot.middleNameDisplay = nextMode;
    }
    if (snapshot.lastNameDisplay !== undefined) {
      const nextMode = normalizeNameDisplayMode(snapshot.lastNameDisplay);
      setLastNameDisplay(nextMode);
      setShowLastName(nextMode !== "Hidden");
      nextSnapshot.showLastName = nextMode !== "Hidden";
    } else if (snapshot.showLastName !== undefined) {
      setShowLastName(snapshot.showLastName);
      const nextMode = snapshot.showLastName ? "Full" : "Hidden";
      setLastNameDisplay(nextMode);
      nextSnapshot.lastNameDisplay = nextMode;
    }
    if (snapshot.showAge !== undefined) setShowAge(snapshot.showAge);
    if (snapshot.showPreferredAgeRange !== undefined)
      setShowPreferredAgeRange(snapshot.showPreferredAgeRange);
    if (snapshot.showGender !== undefined) setShowGender(snapshot.showGender);
    if (snapshot.profilePhotoUri !== undefined) setProfilePhotoUri(snapshot.profilePhotoUri);
    if (snapshot.contactEmail !== undefined) setContactEmail(snapshot.contactEmail);
    if (snapshot.contactPhone !== undefined) setContactPhone(snapshot.contactPhone);
    if (snapshot.identitySelfieUri !== undefined) setIdentitySelfieUri(snapshot.identitySelfieUri);
    if (snapshot.hasIdentityDocument !== undefined)
      setHasIdentityDocument(snapshot.hasIdentityDocument);
    if (snapshot.visibilityPreference !== undefined) {
      setVisibilityPreference(snapshot.visibilityPreference);
      if (snapshot.blurProfilePhoto === undefined) {
        setBlurProfilePhoto(snapshot.visibilityPreference === "Blurred");
      }
    }
    if (snapshot.comfortMode !== undefined) setComfortMode(snapshot.comfortMode);
    if (snapshot.privateProfile !== undefined) setPrivateProfile(snapshot.privateProfile);
    if (snapshot.blurProfilePhoto !== undefined) setBlurProfilePhoto(snapshot.blurProfilePhoto);
    if (snapshot.blurLevel !== undefined) setBlurLevel(snapshot.blurLevel);
    if (snapshot.softRevealSuggestions !== undefined)
      setSoftRevealSuggestions(snapshot.softRevealSuggestions);
    if (snapshot.softRevealPace !== undefined) setSoftRevealPace(snapshot.softRevealPace);
    if (snapshot.preferSoftRevealPeople !== undefined)
      setPreferSoftRevealPeople(snapshot.preferSoftRevealPeople);
    if (snapshot.warmUpLowerBlur !== undefined) setWarmUpLowerBlur(snapshot.warmUpLowerBlur);
    if (snapshot.showSuburbArea !== undefined) setShowSuburbArea(snapshot.showSuburbArea);
    if (snapshot.showInterests !== undefined) setShowInterests(snapshot.showInterests);
    if (snapshot.showComfortPreferences !== undefined)
      setShowComfortPreferences(snapshot.showComfortPreferences);
    if (snapshot.minimalProfileView !== undefined)
      setMinimalProfileView(snapshot.minimalProfileView);
    if (snapshot.comfortPreferences !== undefined)
      setComfortPreferences(snapshot.comfortPreferences);
    if (snapshot.verificationLevel !== undefined) setVerificationLevel(snapshot.verificationLevel);
    if (snapshot.eventMemberships !== undefined) setEventMemberships(snapshot.eventMemberships);
    if (snapshot.blockedUserIds !== undefined) setBlockedUserIds(snapshot.blockedUserIds);
    if (snapshot.safetyReports !== undefined) setSafetyReports(snapshot.safetyReports);
    if (snapshot.postEventFeedback !== undefined) setPostEventFeedback(snapshot.postEventFeedback);
    if (snapshot.savedPlaces !== undefined) setSavedPlaces(snapshot.savedPlaces);
    if (snapshot.pinnedEventIds !== undefined) setPinnedEventIds(snapshot.pinnedEventIds);
    if (snapshot.hiddenEventIds !== undefined) setHiddenEventIds(snapshot.hiddenEventIds);
    if (snapshot.noiseLevelPreference !== undefined)
      setNoiseLevelPreference(snapshot.noiseLevelPreference);
    if (snapshot.contactPreferences !== undefined)
      setContactPreferences(
        snapshot.contactPreferences.length ? snapshot.contactPreferences : ["Text"],
      );
    if (snapshot.friendshipStylePreferences !== undefined)
      setFriendshipStylePreferences(nextSnapshot.friendshipStylePreferences ?? []);
    if (snapshot.datingStylePreferences !== undefined)
      setDatingStylePreferences(nextSnapshot.datingStylePreferences ?? []);
    if (snapshot.meetupRhythmPreferences !== undefined)
      setMeetupRhythmPreferences(nextSnapshot.meetupRhythmPreferences ?? []);
    if (snapshot.availabilityTimingPreferences !== undefined)
      setAvailabilityTimingPreferences(nextSnapshot.availabilityTimingPreferences ?? []);
    if (snapshot.socialDurationPreferences !== undefined)
      setSocialDurationPreferences(nextSnapshot.socialDurationPreferences ?? []);
    if (snapshot.languageComfortPreferences !== undefined)
      setLanguageComfortPreferences(nextSnapshot.languageComfortPreferences ?? []);
    if (snapshot.socialEnergyPreference !== undefined)
      setSocialEnergyPreference(normalizeSocialEnergyPreference(snapshot.socialEnergyPreference));
    if (snapshot.communicationPreferences !== undefined)
      setCommunicationPreferences(
        normalizeCommunicationPreferences(snapshot.communicationPreferences),
      );
    if (snapshot.groupSizePreference !== undefined)
      setGroupSizePreference(normalizeGroupSizePreference(snapshot.groupSizePreference));
    if (snapshot.photoRecordingComfortPreferences !== undefined)
      setPhotoRecordingComfortPreferences(
        normalizePhotoRecordingComfortPreferences(snapshot.photoRecordingComfortPreferences),
      );
    if (snapshot.physicalContactComfortPreferences !== undefined)
      setPhysicalContactComfortPreferences(
        normalizePhysicalContactComfortPreferences(snapshot.physicalContactComfortPreferences),
      );
    if (snapshot.backgroundStudyStatuses !== undefined)
      setBackgroundStudyStatuses(
        normalizeBackgroundPreferenceList(
          snapshot.backgroundStudyStatuses,
          backgroundStudyStatusOptions,
        ),
      );
    if (snapshot.backgroundStudyAreas !== undefined)
      setBackgroundStudyAreas(
        normalizeBackgroundPreferenceList(
          snapshot.backgroundStudyAreas,
          backgroundStudyAreaOptions,
        ),
      );
    if (snapshot.backgroundStudyVisibility !== undefined)
      setBackgroundStudyVisibility(
        normalizeBackgroundVisibilityPreference(snapshot.backgroundStudyVisibility),
      );
    if (snapshot.backgroundWorkPreferences !== undefined)
      setBackgroundWorkPreferences(
        normalizeBackgroundPreferenceList(
          snapshot.backgroundWorkPreferences,
          backgroundWorkOptions,
        ),
      );
    if (snapshot.backgroundWorkRhythms !== undefined)
      setBackgroundWorkRhythms(
        normalizeBackgroundPreferenceList(
          snapshot.backgroundWorkRhythms,
          backgroundWorkRhythmOptions,
        ),
      );
    if (snapshot.backgroundWorkVisibility !== undefined)
      setBackgroundWorkVisibility(
        normalizeBackgroundVisibilityPreference(snapshot.backgroundWorkVisibility),
      );
    if (snapshot.backgroundCommunityPreferences !== undefined)
      setBackgroundCommunityPreferences(
        normalizeBackgroundPreferenceList(
          snapshot.backgroundCommunityPreferences,
          backgroundCommunityOptions,
        ),
      );
    if (snapshot.backgroundCommunityVisibility !== undefined)
      setBackgroundCommunityVisibility(
        normalizeBackgroundVisibilityPreference(snapshot.backgroundCommunityVisibility),
      );
    if (snapshot.lifeContextCurrentStates !== undefined)
      setLifeContextCurrentStates(
        normalizeBackgroundPreferenceList(
          snapshot.lifeContextCurrentStates,
          lifeContextCurrentStateOptions,
        ),
      );
    if (snapshot.lifeContextCurrentVisibility !== undefined)
      setLifeContextCurrentVisibility(
        normalizeBackgroundVisibilityPreference(snapshot.lifeContextCurrentVisibility),
      );
    if (snapshot.lifeContextFields !== undefined)
      setLifeContextFields(
        normalizeBackgroundPreferenceList(snapshot.lifeContextFields, lifeContextFieldOptions),
      );
    if (snapshot.lifeContextFieldVisibility !== undefined)
      setLifeContextFieldVisibility(
        normalizeBackgroundVisibilityPreference(snapshot.lifeContextFieldVisibility),
      );
    if (snapshot.lifeContextLearningInterests !== undefined)
      setLifeContextLearningInterests(
        normalizeBackgroundPreferenceList(
          snapshot.lifeContextLearningInterests,
          lifeContextLearningOptions,
        ),
      );
    if (snapshot.lifeContextLearningVisibility !== undefined)
      setLifeContextLearningVisibility(
        normalizeBackgroundVisibilityPreference(snapshot.lifeContextLearningVisibility),
      );
    if (snapshot.lifeComfortPreferences !== undefined)
      setLifeComfortPreferences(
        normalizeBackgroundPreferenceList(snapshot.lifeComfortPreferences, lifeComfortOptions),
      );
    if (snapshot.lifeComfortVisibility !== undefined)
      setLifeComfortVisibility(
        normalizeBackgroundVisibilityPreference(snapshot.lifeComfortVisibility),
      );
    if (snapshot.lifeContextLastUpdatedAt !== undefined || lifeContextTouched)
      setLifeContextLastUpdatedAt(nextSnapshot.lifeContextLastUpdatedAt ?? null);
    if (snapshot.verifiedButPrivate !== undefined)
      setVerifiedButPrivate(Boolean(snapshot.verifiedButPrivate));
    if (snapshot.personalityPresenceHair !== undefined)
      setPersonalityPresenceHair(nextSnapshot.personalityPresenceHair ?? null);
    if (snapshot.personalityPresenceHairCues !== undefined)
      setPersonalityPresenceHairCues(nextSnapshot.personalityPresenceHairCues ?? []);
    if (snapshot.personalityPresenceEyes !== undefined)
      setPersonalityPresenceEyes(nextSnapshot.personalityPresenceEyes ?? null);
    if (snapshot.personalityPresenceFacialHair !== undefined)
      setPersonalityPresenceFacialHair(nextSnapshot.personalityPresenceFacialHair ?? null);
    if (snapshot.personalityPresenceStyle !== undefined)
      setPersonalityPresenceStyle(nextSnapshot.personalityPresenceStyle ?? null);
    if (snapshot.personalityPresencePresentation !== undefined)
      setPersonalityPresencePresentation(nextSnapshot.personalityPresencePresentation ?? null);
    if (snapshot.personalityPresencePersonalStyles !== undefined)
      setPersonalityPresencePersonalStyles(nextSnapshot.personalityPresencePersonalStyles ?? []);
    if (snapshot.personalityPresenceAccessories !== undefined)
      setPersonalityPresenceAccessories(nextSnapshot.personalityPresenceAccessories ?? []);
    if (snapshot.personalityPresenceGrooming !== undefined)
      setPersonalityPresenceGrooming(nextSnapshot.personalityPresenceGrooming ?? []);
    if (snapshot.personalityPresenceVoicePresence !== undefined)
      setPersonalityPresenceVoicePresence(nextSnapshot.personalityPresenceVoicePresence ?? []);
    if (snapshot.personalityPresenceSocialStyles !== undefined)
      setPersonalityPresenceSocialStyles(nextSnapshot.personalityPresenceSocialStyles ?? []);
    if (snapshot.personalityPresenceConnectionPreferences !== undefined)
      setPersonalityPresenceConnectionPreferences(
        nextSnapshot.personalityPresenceConnectionPreferences ?? [],
      );
    if (snapshot.personalityPresenceComfortAround !== undefined)
      setPersonalityPresenceComfortAround(nextSnapshot.personalityPresenceComfortAround ?? []);
    if (snapshot.personalityPresencePromptResponses !== undefined)
      setPersonalityPresencePromptResponses(nextSnapshot.personalityPresencePromptResponses ?? []);
    if (snapshot.showPersonalityPresenceOnProfile !== undefined)
      setShowPersonalityPresenceOnProfile(Boolean(snapshot.showPersonalityPresenceOnProfile));
    if (snapshot.showPersonalityPresencePromptsOnProfile !== undefined)
      setShowPersonalityPresencePromptsOnProfile(
        Boolean(snapshot.showPersonalityPresencePromptsOnProfile),
      );
    if (snapshot.calendarMomentStates !== undefined)
      setCalendarMomentStates(normalizeCalendarMomentStates(snapshot.calendarMomentStates));
    if (snapshot.calendarMomentVisibility !== undefined)
      setCalendarMomentVisibility(
        normalizeCalendarMomentVisibility(snapshot.calendarMomentVisibility),
      );
    if (snapshot.customCalendarMoments !== undefined)
      setCustomCalendarMoments(normalizeCustomCalendarMoments(snapshot.customCalendarMoments));
    if (snapshot.transportationMethod !== undefined)
      setTransportationMethod(snapshot.transportationMethod);
    if (snapshot.transportationPreferences !== undefined)
      setTransportationPreferences(
        normalizeSelectablePreferenceList(
          snapshot.transportationPreferences,
          transportationPreferenceOptions,
          defaultTransportationPreferences,
        ),
      );
    if (snapshot.meetupContactPreferences !== undefined)
      setMeetupContactPreferences(
        normalizeMeetupContactPreferences(snapshot.meetupContactPreferences),
      );
    if (snapshot.locationComfortPreferences !== undefined)
      setLocationComfortPreferences(
        normalizeSelectablePreferenceList(
          snapshot.locationComfortPreferences,
          locationComfortPreferenceOptions,
          defaultLocationComfortPreferences,
        ),
      );
    if (snapshot.dietaryPreferences !== undefined)
      setDietaryPreferences(snapshot.dietaryPreferences);
    if (snapshot.foodBeveragePreferenceIds !== undefined)
      setFoodBeveragePreferenceIds(
        normalizeFoodBeveragePreferenceIds(snapshot.foodBeveragePreferenceIds),
      );
    if (snapshot.hobbiesInterests !== undefined) setHobbiesInterests(snapshot.hobbiesInterests);
    if (snapshot.interestPreferenceIds !== undefined) {
      const nextInterestIds = normalizeInterestPreferenceIds(snapshot.interestPreferenceIds);
      setInterestPreferenceIds(nextInterestIds);
      setInterestComfortTagsByInterest(
        normalizeInterestComfortTagsByInterest(
          nextSnapshot.interestComfortTagsByInterest,
          nextInterestIds,
        ),
      );
    } else if (snapshot.interestComfortTagsByInterest !== undefined) {
      setInterestComfortTagsByInterest(
        normalizeInterestComfortTagsByInterest(
          snapshot.interestComfortTagsByInterest,
          nextSnapshot.interestPreferenceIds,
        ),
      );
    }
    if (snapshot.profileShortcutLayout !== undefined)
      setProfileShortcutLayout(snapshot.profileShortcutLayout);
    if (snapshot.profileWidthPreference !== undefined)
      setProfileWidthPreference(snapshot.profileWidthPreference);
    if (snapshot.settingsPrivacyMode !== undefined)
      setSettingsPrivacyMode(snapshot.settingsPrivacyMode);
    if (snapshot.userPreferenceTextMode !== undefined)
      setUserPreferenceTextMode(snapshot.userPreferenceTextMode);
    if (snapshot.emojiDisplayMode !== undefined)
      setEmojiDisplayMode(normalizeEmojiDisplayMode(snapshot.emojiDisplayMode));
    if (snapshot.showProfileControlsShortcut !== undefined)
      setShowProfileControlsShortcut(snapshot.showProfileControlsShortcut);
    if (snapshot.showAlertsSettingsShortcut !== undefined)
      setShowAlertsSettingsShortcut(snapshot.showAlertsSettingsShortcut);
    if (snapshot.externalLinks !== undefined)
      setExternalLinks(normalizeExternalLinksPreference(snapshot.externalLinks));
    if (snapshot.batterySaver !== undefined) setBatterySaver(snapshot.batterySaver);
    if (snapshot.lowLightMode !== undefined) setLowLightMode(snapshot.lowLightMode);
    if (snapshot.lowLightLevel !== undefined) setLowLightLevel(snapshot.lowLightLevel);
    if (snapshot.homeViewMode !== undefined) setHomeViewMode(snapshot.homeViewMode);
    if (snapshot.homeNearbyOnly !== undefined) setHomeNearbyOnly(snapshot.homeNearbyOnly);
    if (snapshot.homeSmallGroupsOnly !== undefined)
      setHomeSmallGroupsOnly(snapshot.homeSmallGroupsOnly);
    if (snapshot.homeWeatherSafeOnly !== undefined)
      setHomeWeatherSafeOnly(snapshot.homeWeatherSafeOnly);
    if (snapshot.homeEventLayout !== undefined) setHomeEventLayout(snapshot.homeEventLayout);
    if (snapshot.homeLayoutDensity !== undefined) setHomeLayoutDensity(snapshot.homeLayoutDensity);
    if (snapshot.homeFitToScreen !== undefined)
      setHomeFitToScreen(Boolean(snapshot.homeFitToScreen));
    if (snapshot.homeHeaderControlsDensity !== undefined) {
      const nextDensity = normalizeHomeHeaderControlsDensity(snapshot.homeHeaderControlsDensity);
      setHomeHeaderControlsDensity(nextDensity);
      nextSnapshot.homeHeaderControlsDensity = nextDensity;
    }
    if (snapshot.homeCardLayout !== undefined) setHomeCardLayout(snapshot.homeCardLayout);
    if (snapshot.homeEventVisualMode !== undefined) {
      const nextVisualMode = normalizeHomeEventVisualMode(snapshot.homeEventVisualMode);
      setHomeEventVisualMode(nextVisualMode);
      nextSnapshot.homeEventVisualMode = nextVisualMode;
    }
    if (snapshot.homeVisibleSections !== undefined) {
      const nextSections = normalizeHomeVisibleSections(snapshot.homeVisibleSections);
      setHomeVisibleSections(nextSections);
      nextSnapshot.homeVisibleSections = nextSections;
    }
    if (snapshot.homeSectionOrder !== undefined) {
      const nextOrder = normalizeHomeSectionOrder(snapshot.homeSectionOrder);
      setHomeSectionOrder(nextOrder);
      nextSnapshot.homeSectionOrder = nextOrder;
    }
    if (snapshot.suggestNightModeInEvenings !== undefined)
      setSuggestNightModeInEvenings(snapshot.suggestNightModeInEvenings);
    if (snapshot.notificationSnoozed !== undefined)
      setNotificationSnoozed(snapshot.notificationSnoozed);
    if (snapshot.notificationSnoozePreset !== undefined)
      setNotificationSnoozePreset(snapshot.notificationSnoozePreset);
    if (snapshot.appLanguage !== undefined)
      setAppLanguageState(normalizeNsnLanguage(snapshot.appLanguage));
    if (snapshot.translationLanguage !== undefined)
      setTranslationLanguageState(normalizeNsnLanguage(snapshot.translationLanguage));
    if (snapshot.brandThemeId !== undefined)
      setBrandThemeIdState(normalizeBrandThemeId(snapshot.brandThemeId));
    if (snapshot.skyThemeId !== undefined)
      setSkyThemeIdState(normalizeSkyThemeId(snapshot.skyThemeId));
    if (snapshot.timezone !== undefined) setTimezone(normalizeTimezoneSetting(snapshot.timezone));
    if (snapshot.timeContextMode !== undefined)
      setTimeContextMode(normalizeTimeContextMode(snapshot.timeContextMode));
    if (snapshot.dateFormatPreference !== undefined)
      setDateFormatPreference(normalizeDateFormatPreference(snapshot.dateFormatPreference));
    if (snapshot.showWeekday !== undefined) setShowWeekday(Boolean(snapshot.showWeekday));
    if (snapshot.timeFormatPreference !== undefined)
      setTimeFormatPreference(normalizeTimeFormatPreference(snapshot.timeFormatPreference));
    if (snapshot.clockDisplayStyle !== undefined)
      setClockDisplayStyle(normalizeClockDisplayStyle(snapshot.clockDisplayStyle));
    if (snapshot.showDigitalTimeWithAnalog !== undefined)
      setShowDigitalTimeWithAnalog(Boolean(snapshot.showDigitalTimeWithAnalog));
    if (snapshot.temperatureUnitPreference !== undefined)
      setTemperatureUnitPreference(
        normalizeTemperatureUnitPreference(snapshot.temperatureUnitPreference),
      );
    if (snapshot.distanceUnitPreference !== undefined)
      setDistanceUnitPreference(normalizeDistanceUnitPreference(snapshot.distanceUnitPreference));
    if (snapshot.currencyDisplayPreference !== undefined)
      setCurrencyDisplayPreference(
        normalizeCurrencyDisplayPreference(snapshot.currencyDisplayPreference),
      );
    if (snapshot.dayNightModePreference !== undefined)
      setDayNightModePreference(normalizeDayNightModePreference(snapshot.dayNightModePreference));
    if (snapshot.cardOutlineStyle !== undefined)
      setCardOutlineStyle(normalizeCardOutlineStyle(snapshot.cardOutlineStyle));

    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(nextSnapshot));
    } catch (error) {
      console.warn("NSN state could not save:", error);
    }
  };

  const setAppLanguage = (value: string) => {
    const nextLanguage = normalizeNsnLanguage(value);
    setAppLanguageState(nextLanguage);
    saveSoftHelloMvpState({ appLanguage: nextLanguage });
  };

  const setTranslationLanguage = (value: string) => {
    const nextLanguage = normalizeNsnLanguage(value);
    setTranslationLanguageState(nextLanguage);
    saveSoftHelloMvpState({ translationLanguage: nextLanguage });
  };

  const setBrandThemeId = (value: BrandThemeId) => {
    const nextBrandThemeId = normalizeBrandThemeId(value);
    setBrandThemeIdState(nextBrandThemeId);
    saveSoftHelloMvpState({ brandThemeId: nextBrandThemeId });
  };

  const setSkyThemeId = (value: SkyThemeId) => {
    const nextSkyThemeId = normalizeSkyThemeId(value);
    setSkyThemeIdState(nextSkyThemeId);
    saveSoftHelloMvpState({ skyThemeId: nextSkyThemeId });
  };

  useEffect(() => {
    let cancelled = false;

    if (!weatherAlerts) {
      previousWeather.current = null;
      setLiveWeatherAlert({
        icon: "!",
        title: "Weather alerts are off",
        copy: "Turn them on in Settings to receive live updates when conditions change.",
        tone: "Settings",
        changed: false,
        action: "settings",
      });
      return undefined;
    }

    if (notificationSnoozed) {
      previousWeather.current = null;
      setLiveWeatherAlert({
        icon: "zZ",
        title: "Weather alerts are snoozed",
        copy: "Routine weather updates will stay quiet until notification snooze is turned off.",
        tone: "Snoozed",
        changed: false,
        action: "settings",
      });
      return undefined;
    }

    async function fetchLiveWeather() {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${timezone.latitude}&longitude=${timezone.longitude}&current=temperature_2m&hourly=precipitation_probability&timezone=${encodeURIComponent(timezone.timeZone)}&forecast_days=1`,
        );

        if (!response.ok) {
          throw new Error(`Weather request failed with ${response.status}`);
        }

        const data = await response.json();
        const currentHourIndex =
          data.hourly.time?.findIndex((time: string) => time === data.current.time) ?? 0;
        const rainChance =
          data.hourly.precipitation_probability?.[currentHourIndex >= 0 ? currentHourIndex : 0] ??
          null;
        const temperature =
          typeof data.current.temperature_2m === "number"
            ? Math.round(data.current.temperature_2m)
            : null;
        const nextWeather: WeatherSnapshot = {
          temperature,
          rainChance,
          category: getWeatherCategory(temperature, rainChance),
        };
        const changed = didWeatherChange(previousWeather.current, nextWeather);
        previousWeather.current = nextWeather;

        if (cancelled) return;

        setWeather(nextWeather);

        const temperatureCopy =
          nextWeather.temperature === null
            ? "temperature unavailable"
            : `${nextWeather.temperature}C`;
        const rainCopy =
          nextWeather.rainChance === null
            ? "rain chance unavailable"
            : `${nextWeather.rainChance}% rain chance`;
        const detail =
          nextWeather.category === "rain"
            ? "Rain is likely, so outdoor plans may need an indoor fallback."
            : nextWeather.category === "showers"
              ? "Showers are possible; keep an indoor backup nearby."
              : nextWeather.category === "warm"
                ? "It is warming up; shade and water-friendly meetups are best."
                : "No major weather shift for nearby plans right now.";

        setLiveWeatherAlert({
          icon: changed ? "!" : "~",
          title: changed ? "Weather changed just now" : "Live weather watch",
          copy: `${timezone.city}: ${temperatureCopy}, ${rainCopy}. ${detail}`,
          tone: "Live weather",
          changed,
          action: "home",
        });
      } catch (error) {
        console.warn("Live weather notification fetch failed:", error);
        if (!cancelled) {
          setLiveWeatherAlert({
            icon: "!",
            title: "Weather update delayed",
            copy: "We will keep checking and refresh this alert when weather data is available.",
            tone: "Weather",
            changed: false,
            action: "home",
          });
        }
      }
    }

    fetchLiveWeather();
    const timer = setInterval(fetchLiveWeather, batterySaver ? 5 * 60 * 1000 : 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [batterySaver, notificationSnoozed, timezone, weatherAlerts]);

  const resetLocalPrototypeState = () => {
    setHasCompletedOnboarding(false);
    setAccountPaused(false);
    setAccountPauseTimeline("Until I return");
    setAgeConfirmed(false);
    setAge(null);
    setPreferredAgeMin(25);
    setPreferredAgeMax(40);
    setSuburb("");
    setIntent("Exploring");
    setDisplayName("NSN Tester");
    setMiddleName("");
    setLastName("");
    setGender("Not specified");
    setMiddleNameDisplay("Hidden");
    setLastNameDisplay("Hidden");
    setShowMiddleName(false);
    setShowLastName(false);
    setShowAge(false);
    setShowPreferredAgeRange(false);
    setShowGender(false);
    setProfilePhotoUri(null);
    setContactEmail("");
    setContactPhone("");
    setIdentitySelfieUri(null);
    setHasIdentityDocument(false);
    setVisibilityPreference("Blurred");
    setComfortMode("Comfort Mode");
    setPrivateProfile(false);
    setBlurLevel("Medium blur");
    setSoftRevealSuggestions(true);
    setSoftRevealPace("Gradual reveal");
    setPreferSoftRevealPeople(false);
    setWarmUpLowerBlur(true);
    setShowSuburbArea(false);
    setShowInterests(false);
    setShowComfortPreferences(false);
    setMinimalProfileView(false);
    setComfortPreferences(defaultComfortPreferences);
    setVerificationLevel("Readiness not reviewed");
    setEventMemberships([]);
    setBlockedUserIds([]);
    setSafetyReports([]);
    setPostEventFeedback([]);
    setSavedPlaces([]);
    setPinnedEventIds([]);
    setHiddenEventIds([]);
    setNoiseLevelPreference("Any");
    setContactPreferences(["Text"]);
    setFriendshipStylePreferences([]);
    setDatingStylePreferences([]);
    setMeetupRhythmPreferences(["Occasional/random"]);
    setAvailabilityTimingPreferences([]);
    setSocialDurationPreferences([]);
    setLanguageComfortPreferences([]);
    setSocialEnergyPreference("Calm");
    setCommunicationPreferences([]);
    setGroupSizePreference("Small groups only");
    setPhotoRecordingComfortPreferences(defaultPhotoRecordingComfortPreferences);
    setPhysicalContactComfortPreferences(defaultPhysicalContactComfortPreferences);
    setBackgroundStudyStatuses([]);
    setBackgroundStudyAreas([]);
    setBackgroundStudyVisibility("Private");
    setBackgroundWorkPreferences([]);
    setBackgroundWorkRhythms([]);
    setBackgroundWorkVisibility("Private");
    setBackgroundCommunityPreferences([]);
    setBackgroundCommunityVisibility("Private");
    setLifeContextCurrentStates([]);
    setLifeContextCurrentVisibility("Private");
    setLifeContextFields([]);
    setLifeContextFieldVisibility("Private");
    setLifeContextLearningInterests([]);
    setLifeContextLearningVisibility("Shared preview visibility only");
    setLifeComfortPreferences([]);
    setLifeComfortVisibility("Private");
    setLifeContextLastUpdatedAt(null);
    setVerifiedButPrivate(true);
    setPersonalityPresenceHair("Prefer not to say");
    setPersonalityPresenceHairCues([]);
    setPersonalityPresenceEyes("Prefer not to say");
    setPersonalityPresenceFacialHair("Prefer not to say");
    setPersonalityPresenceStyle("Prefer not to say");
    setPersonalityPresencePresentation("Prefer not to say");
    setPersonalityPresencePersonalStyles([]);
    setPersonalityPresenceAccessories([]);
    setPersonalityPresenceGrooming([]);
    setPersonalityPresenceVoicePresence([]);
    setPersonalityPresenceSocialStyles([]);
    setPersonalityPresenceConnectionPreferences([]);
    setPersonalityPresenceComfortAround([]);
    setPersonalityPresencePromptResponses([]);
    setShowPersonalityPresenceOnProfile(false);
    setShowPersonalityPresencePromptsOnProfile(false);
    setCalendarMomentStates(defaultCalendarMomentStates);
    setCalendarMomentVisibility(defaultCalendarMomentVisibility);
    setCustomCalendarMoments(defaultCustomCalendarMoments);
    setTransportationMethod("Public transport");
    setDietaryPreferences(["No preference"]);
    setTransportationPreferences(defaultTransportationPreferences);
    setMeetupContactPreferences([]);
    setLocationComfortPreferences(defaultLocationComfortPreferences);
    setFoodBeveragePreferenceIds(defaultFoodBeveragePreferenceIds);
    setHobbiesInterests(["Coffee", "Movies", "Walks"]);
    setInterestPreferenceIds(defaultInterestPreferenceIds);
    setInterestComfortTagsByInterest(defaultInterestComfortTagsByInterest);
    setProfileShortcutLayout("Clean");
    setProfileWidthPreference("Contained");
    setSettingsPrivacyMode("Basic");
    setUserPreferenceTextMode("Simple");
    setEmojiDisplayMode("Full emoji display");
    setShowProfileControlsShortcut(true);
    setShowAlertsSettingsShortcut(true);
    setExternalLinks(defaultExternalLinksPreference);
    setNotificationSnoozed(false);
    setNotificationSnoozePreset("Tonight");
  };

  const resetOnboarding = async () => {
    setHasCompletedOnboarding(false);
    setAgeConfirmed(false);

    try {
      await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch (error) {
      console.warn("NSN onboarding could not reset:", error);
    }
  };

  const clearAllLocalPrototypeData = async () => {
    try {
      await clearStoredLocalPrototypeData();
      resetLocalPrototypeState();
    } catch (error) {
      console.warn("NSN local prototype data could not be cleared:", error);
      throw error;
    }
  };

  return (
    <AppSettingsContext.Provider
      value={{
        isOnboardingLoaded,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        accountPaused,
        setAccountPaused,
        accountPauseTimeline,
        setAccountPauseTimeline,
        ageConfirmed,
        setAgeConfirmed,
        age,
        setAge,
        preferredAgeMin,
        setPreferredAgeMin,
        preferredAgeMax,
        setPreferredAgeMax,
        suburb,
        setSuburb,
        intent,
        setIntent,
        displayName,
        setDisplayName,
        middleName,
        setMiddleName,
        lastName,
        setLastName,
        gender,
        setGender,
        middleNameDisplay,
        setMiddleNameDisplay,
        lastNameDisplay,
        setLastNameDisplay,
        showMiddleName,
        setShowMiddleName,
        showLastName,
        setShowLastName,
        showAge,
        setShowAge,
        showPreferredAgeRange,
        setShowPreferredAgeRange,
        showGender,
        setShowGender,
        profilePhotoUri,
        setProfilePhotoUri,
        contactEmail,
        setContactEmail,
        contactPhone,
        setContactPhone,
        identitySelfieUri,
        setIdentitySelfieUri,
        hasIdentityDocument,
        setHasIdentityDocument,
        visibilityPreference,
        setVisibilityPreference,
        comfortMode,
        setComfortMode,
        privateProfile,
        setPrivateProfile,
        blurLevel,
        setBlurLevel,
        softRevealSuggestions,
        setSoftRevealSuggestions,
        softRevealPace,
        setSoftRevealPace,
        preferSoftRevealPeople,
        setPreferSoftRevealPeople,
        warmUpLowerBlur,
        setWarmUpLowerBlur,
        showSuburbArea,
        setShowSuburbArea,
        showInterests,
        setShowInterests,
        showComfortPreferences,
        setShowComfortPreferences,
        minimalProfileView,
        setMinimalProfileView,
        comfortPreferences,
        setComfortPreferences,
        verificationLevel,
        setVerificationLevel,
        eventMemberships,
        setEventMemberships,
        blockedUserIds,
        setBlockedUserIds,
        safetyReports,
        setSafetyReports,
        postEventFeedback,
        setPostEventFeedback,
        savedPlaces,
        setSavedPlaces,
        pinnedEventIds,
        setPinnedEventIds,
        hiddenEventIds,
        setHiddenEventIds,
        noiseLevelPreference,
        setNoiseLevelPreference,
        contactPreferences,
        setContactPreferences,
        socialEnergyPreference,
        setSocialEnergyPreference,
        communicationPreferences,
        setCommunicationPreferences,
        groupSizePreference,
        setGroupSizePreference,
        photoRecordingComfortPreferences,
        setPhotoRecordingComfortPreferences,
        physicalContactComfortPreferences,
        setPhysicalContactComfortPreferences,
        backgroundStudyStatuses,
        setBackgroundStudyStatuses,
        backgroundStudyAreas,
        setBackgroundStudyAreas,
        backgroundStudyVisibility,
        setBackgroundStudyVisibility,
        backgroundWorkPreferences,
        setBackgroundWorkPreferences,
        backgroundWorkRhythms,
        setBackgroundWorkRhythms,
        backgroundWorkVisibility,
        setBackgroundWorkVisibility,
        backgroundCommunityPreferences,
        setBackgroundCommunityPreferences,
        backgroundCommunityVisibility,
        setBackgroundCommunityVisibility,
        lifeContextCurrentStates,
        setLifeContextCurrentStates,
        lifeContextCurrentVisibility,
        setLifeContextCurrentVisibility,
        lifeContextFields,
        setLifeContextFields,
        lifeContextFieldVisibility,
        setLifeContextFieldVisibility,
        lifeContextLearningInterests,
        setLifeContextLearningInterests,
        lifeContextLearningVisibility,
        setLifeContextLearningVisibility,
        lifeComfortPreferences,
        setLifeComfortPreferences,
        lifeComfortVisibility,
        setLifeComfortVisibility,
        lifeContextLastUpdatedAt,
        setLifeContextLastUpdatedAt,
        verifiedButPrivate,
        setVerifiedButPrivate,
        personalityPresenceHair,
        setPersonalityPresenceHair,
        personalityPresenceHairCues,
        setPersonalityPresenceHairCues,
        personalityPresenceEyes,
        setPersonalityPresenceEyes,
        personalityPresenceFacialHair,
        setPersonalityPresenceFacialHair,
        personalityPresenceStyle,
        setPersonalityPresenceStyle,
        personalityPresencePresentation,
        setPersonalityPresencePresentation,
        personalityPresencePersonalStyles,
        setPersonalityPresencePersonalStyles,
        personalityPresenceAccessories,
        setPersonalityPresenceAccessories,
        personalityPresenceGrooming,
        setPersonalityPresenceGrooming,
        personalityPresenceVoicePresence,
        setPersonalityPresenceVoicePresence,
        personalityPresenceSocialStyles,
        setPersonalityPresenceSocialStyles,
        personalityPresenceConnectionPreferences,
        setPersonalityPresenceConnectionPreferences,
        personalityPresenceComfortAround,
        setPersonalityPresenceComfortAround,
        personalityPresencePromptResponses,
        setPersonalityPresencePromptResponses,
        showPersonalityPresenceOnProfile,
        setShowPersonalityPresenceOnProfile,
        showPersonalityPresencePromptsOnProfile,
        setShowPersonalityPresencePromptsOnProfile,
        calendarMomentStates,
        setCalendarMomentStates,
        calendarMomentVisibility,
        setCalendarMomentVisibility,
        customCalendarMoments,
        setCustomCalendarMoments,
        transportationMethod,
        setTransportationMethod,
        friendshipStylePreferences,
        setFriendshipStylePreferences,
        datingStylePreferences,
        setDatingStylePreferences,
        meetupRhythmPreferences,
        setMeetupRhythmPreferences,
        availabilityTimingPreferences,
        setAvailabilityTimingPreferences,
        socialDurationPreferences,
        setSocialDurationPreferences,
        languageComfortPreferences,
        setLanguageComfortPreferences,
        transportationPreferences,
        setTransportationPreferences,
        meetupContactPreferences,
        setMeetupContactPreferences,
        locationComfortPreferences,
        setLocationComfortPreferences,
        dietaryPreferences,
        setDietaryPreferences,
        foodBeveragePreferenceIds,
        setFoodBeveragePreferenceIds,
        hobbiesInterests,
        setHobbiesInterests,
        interestPreferenceIds,
        setInterestPreferenceIds,
        interestComfortTagsByInterest,
        setInterestComfortTagsByInterest,
        profileShortcutLayout,
        setProfileShortcutLayout,
        profileWidthPreference,
        setProfileWidthPreference,
        settingsPrivacyMode,
        setSettingsPrivacyMode,
        userPreferenceTextMode,
        setUserPreferenceTextMode,
        emojiDisplayMode,
        setEmojiDisplayMode,
        showProfileControlsShortcut,
        setShowProfileControlsShortcut,
        showAlertsSettingsShortcut,
        setShowAlertsSettingsShortcut,
        externalLinks,
        setExternalLinks,
        batterySaver,
        setBatterySaver,
        lowLightMode,
        setLowLightMode,
        lowLightLevel,
        setLowLightLevel,
        homeViewMode,
        setHomeViewMode,
        homeNearbyOnly,
        setHomeNearbyOnly,
        homeSmallGroupsOnly,
        setHomeSmallGroupsOnly,
        homeWeatherSafeOnly,
        setHomeWeatherSafeOnly,
        homeEventLayout,
        setHomeEventLayout,
        homeLayoutDensity,
        setHomeLayoutDensity,
        homeFitToScreen,
        setHomeFitToScreen,
        homeHeaderControlsDensity,
        setHomeHeaderControlsDensity,
        homeCardLayout,
        setHomeCardLayout,
        homeEventVisualMode,
        setHomeEventVisualMode,
        homeVisibleSections,
        setHomeVisibleSections,
        homeSectionOrder,
        setHomeSectionOrder,
        completeOnboarding,
        saveSoftHelloMvpState,
        resetOnboarding,
        clearAllLocalPrototypeData,
        isNightMode,
        setIsNightMode,
        blurProfilePhoto,
        setBlurProfilePhoto,
        largerText,
        setLargerText,
        highContrast,
        setHighContrast,
        reduceMotion,
        setReduceMotion,
        screenReaderHints,
        setScreenReaderHints,
        largerTouchTargets,
        setLargerTouchTargets,
        reduceTransparency,
        setReduceTransparency,
        boldText,
        setBoldText,
        simplifiedInterface,
        setSimplifiedInterface,
        slowerTransitions,
        setSlowerTransitions,
        meetupReminders,
        setMeetupReminders,
        weatherAlerts,
        setWeatherAlerts,
        suggestNightModeInEvenings,
        setSuggestNightModeInEvenings,
        chatNotifications,
        setChatNotifications,
        quietNotifications,
        setQuietNotifications,
        notificationSnoozed,
        setNotificationSnoozed,
        notificationSnoozePreset,
        setNotificationSnoozePreset,
        useApproximateLocation,
        setUseApproximateLocation,
        showDistanceInMeetups,
        setShowDistanceInMeetups,
        allowMessageRequests,
        setAllowMessageRequests,
        safetyCheckIns,
        setSafetyCheckIns,
        appLanguage,
        setAppLanguage,
        translationLanguage,
        setTranslationLanguage,
        appPalette,
        setAppPalette,
        brandThemeId,
        setBrandThemeId,
        brandTheme: getBrandTheme(brandThemeId),
        skyThemeId,
        setSkyThemeId,
        skyTheme: getSkyTheme(skyThemeId),
        softSurfaces,
        setSoftSurfaces,
        clearBorders,
        setClearBorders,
        timezone,
        setTimezone,
        timeContextMode,
        setTimeContextMode,
        dateFormatPreference,
        setDateFormatPreference,
        showWeekday,
        setShowWeekday,
        timeFormatPreference,
        setTimeFormatPreference,
        clockDisplayStyle,
        setClockDisplayStyle,
        showDigitalTimeWithAnalog,
        setShowDigitalTimeWithAnalog,
        temperatureUnitPreference,
        setTemperatureUnitPreference,
        distanceUnitPreference,
        setDistanceUnitPreference,
        currencyDisplayPreference,
        setCurrencyDisplayPreference,
        dayNightModePreference,
        setDayNightModePreference,
        cardOutlineStyle,
        setCardOutlineStyle,
        weather,
        liveWeatherAlert,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error("useAppSettings must be used inside AppSettingsProvider");
  }

  return context;
}
