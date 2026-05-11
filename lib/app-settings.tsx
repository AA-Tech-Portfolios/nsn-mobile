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

export const nsnLocalLanguageOptions = [
  { label: "English (Australia)", nativeName: "English · Australia", flag: "🇦🇺" },
  { label: "Hebrew", nativeName: "עברית", flag: "🇮🇱" },
  { label: "Chinese (Simplified)", nativeName: "简体中文", flag: "🇨🇳" },
  { label: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { label: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
] as const;

export type NsnLocalLanguage = (typeof nsnLocalLanguageOptions)[number]["label"];

const supportedLanguageLabels = new Set<string>(nsnLocalLanguageOptions.map((language) => language.label));

export function normalizeNsnLanguage(language?: string | null): NsnLocalLanguage {
  if (!language) return DEFAULT_NSN_LANGUAGE;

  if (supportedLanguageLabels.has(language)) {
    return language as NsnLocalLanguage;
  }

  const baseLanguage = getLanguageBase(language);

  if (language === "English (AU)" || baseLanguage === "English") return DEFAULT_NSN_LANGUAGE;
  if (baseLanguage === "Chinese") return "Chinese (Simplified)";
  if (baseLanguage === "Hebrew") return "Hebrew";
  if (baseLanguage === "Korean") return "Korean";
  if (baseLanguage === "Japanese") return "Japanese";

  return DEFAULT_NSN_LANGUAGE;
}

const ONBOARDING_STORAGE_KEY = "softhello.onboarding.v1";
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

const normalizeNameDisplayMode = (value: unknown, fallback: ProfileNameDisplayMode = "Hidden"): ProfileNameDisplayMode =>
  value === "Initial" || value === "Full" || value === "Hidden" ? value : fallback;

export type SoftHelloIntent = "Friends" | "Dating" | "Both" | "Exploring";
export type SoftHelloVisibility = "Blurred" | "Visible";
export type NsnComfortMode = "Comfort Mode" | "Warm Up Mode" | "Open Mode";
export type NsnBlurLevel = "Soft blur" | "Medium blur" | "Strong blur";
export type ProfileShortcutLayout = "Clean" | "Expanded";
export type ProfileWidthPreference = "Contained" | "Wide";
export type NoiseLevelPreference = "Any" | NoiseLevel;
export type TransportationMethod = "Driving" | "Public transport" | "Walking" | "Cycling" | "Rideshare" | "Getting dropped off" | "Not sure yet";
export type ContactPreference = "In person" | "Text" | "Email" | "Phone" | "Video";
export type ProfileGender = "Not specified" | "Male" | "Female" | "Other";
export type ProfileNameDisplayMode = "Hidden" | "Initial" | "Full";
export type SettingsPrivacyMode = "Basic" | "Advanced";
export type AccountPauseTimeline = "A few days" | "One week" | "One month" | "Until I return";
export type LowLightLevel = "Gentle" | "Medium" | "Deep";
export type NotificationSnoozePreset = "1 hour" | "Tonight" | "24 hours" | "Until I turn it back on";
export type HomeViewMode = "Essential" | "Comfortable";
export type HomeEventLayout = "List" | "Map";
export type HomeLayoutDensity = "Compact" | "Comfortable" | "Spacious";
export type HomeCardLayout = "Vertical list" | "Horizontal cards" | "Boxed grid" | "Layered cards" | "Magazine";
export type HomeEventVisualMode = "Emoji/Icon" | "Preview image";
export type HomeVisibleSections = {
  weather: boolean;
  noiseGuide: boolean;
  search: boolean;
  recommendedEvents: boolean;
  dayEvents: boolean;
  nightEvents: boolean;
};
export type HomeSectionOrderKey = keyof HomeVisibleSections;
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
  noiseGuide: false,
  search: true,
  recommendedEvents: true,
  dayEvents: true,
  nightEvents: true,
};

export const defaultHomeSectionOrder: HomeSectionOrderKey[] = ["search", "weather", "recommendedEvents", "dayEvents", "nightEvents", "noiseGuide"];

const normalizeHomeVisibleSections = (value?: Partial<HomeVisibleSections> | null): HomeVisibleSections => ({
  ...defaultHomeVisibleSections,
  ...(value ?? {}),
});

const normalizeHomeSectionOrder = (value?: HomeSectionOrderKey[] | null): HomeSectionOrderKey[] => {
  const sectionKeys = Object.keys(defaultHomeVisibleSections) as HomeSectionOrderKey[];
  const validKeys = new Set(sectionKeys);
  const ordered = (value ?? []).filter((key): key is HomeSectionOrderKey => validKeys.has(key));
  return [...ordered, ...sectionKeys.filter((key) => !ordered.includes(key))];
};

const normalizeHomeEventVisualMode = (value?: HomeEventVisualMode | null): HomeEventVisualMode =>
  value === "Preview image" ? "Preview image" : "Emoji/Icon";

type OnboardingSnapshot = {
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
  transportationMethod: TransportationMethod;
  dietaryPreferences: DietaryPreference[];
  hobbiesInterests: string[];
  profileShortcutLayout?: ProfileShortcutLayout;
  profileWidthPreference?: ProfileWidthPreference;
  settingsPrivacyMode?: SettingsPrivacyMode;
  batterySaver?: boolean;
  lowLightMode?: boolean;
  lowLightLevel?: LowLightLevel;
  homeViewMode?: HomeViewMode;
  homeNearbyOnly?: boolean;
  homeSmallGroupsOnly?: boolean;
  homeWeatherSafeOnly?: boolean;
  homeEventLayout?: HomeEventLayout;
  homeLayoutDensity?: HomeLayoutDensity;
  homeCardLayout?: HomeCardLayout;
  homeEventVisualMode?: HomeEventVisualMode;
  homeVisibleSections?: HomeVisibleSections;
  homeSectionOrder?: HomeSectionOrderKey[];
  suggestNightModeInEvenings?: boolean;
  notificationSnoozed?: boolean;
  notificationSnoozePreset?: NotificationSnoozePreset;
  timezone?: TimezoneSetting;
  timeContextMode?: TimeContextMode;
  appLanguage?: string;
  translationLanguage?: string;
  brandThemeId?: BrandThemeId;
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

export type TimeContextMode = "Automatic device time" | "Use selected suburb/local area" | "Manual city/suburb override";

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
  { id: "newcastle", label: "Newcastle", city: "Newcastle", country: "NSW, Australia", timeZone: "Australia/Sydney", latitude: -32.9283, longitude: 151.7817 },
  { id: "wollongong", label: "Wollongong", city: "Wollongong", country: "NSW, Australia", timeZone: "Australia/Sydney", latitude: -34.4278, longitude: 150.8931 },
  { id: "canberra", label: "Canberra", city: "Canberra", country: "ACT, Australia", timeZone: "Australia/Sydney", latitude: -35.2809, longitude: 149.13 },
  { id: "melbourne", label: "Melbourne", city: "Melbourne", country: "VIC, Australia", timeZone: "Australia/Melbourne", latitude: -37.8136, longitude: 144.9631 },
  { id: "adelaide", label: "Adelaide", city: "Adelaide", country: "SA, Australia", timeZone: "Australia/Adelaide", latitude: -34.9285, longitude: 138.6007 },
  { id: "brisbane", label: "Brisbane", city: "Brisbane", country: "QLD, Australia", timeZone: "Australia/Brisbane", latitude: -27.4698, longitude: 153.0251 },
  { id: "gold-coast", label: "Gold Coast", city: "Gold Coast", country: "QLD, Australia", timeZone: "Australia/Brisbane", latitude: -28.0167, longitude: 153.4 },
  { id: "cairns", label: "Cairns", city: "Cairns", country: "QLD, Australia", timeZone: "Australia/Brisbane", latitude: -16.9186, longitude: 145.7781 },
  { id: "darwin", label: "Darwin", city: "Darwin", country: "NT, Australia", timeZone: "Australia/Darwin", latitude: -12.4634, longitude: 130.8456 },
  { id: "hobart", label: "Hobart", city: "Hobart", country: "TAS, Australia", timeZone: "Australia/Hobart", latitude: -42.8821, longitude: 147.3272 },
  { id: "perth", label: "Perth", city: "Perth", country: "WA, Australia", timeZone: "Australia/Perth", latitude: -31.9523, longitude: 115.8613 },
];

const normalizeTimezoneSetting = (value?: TimezoneSetting | null) => {
  if (!value) return defaultNsnTimezone;
  return australianLocalAreas.find((area) => area.id === value.id) ?? value;
};

const normalizeTimeContextMode = (value?: TimeContextMode | null): TimeContextMode =>
  value === "Automatic device time" || value === "Manual city/suburb override" ? value : "Use selected suburb/local area";

const getWeatherCategory = (temperature: number | null, rainChance: number | null): WeatherSnapshot["category"] => {
  if (temperature === null || rainChance === null) return "unknown";
  if (rainChance >= 70) return "rain";
  if (rainChance >= 35) return "showers";
  if (temperature >= 28) return "warm";
  return "clear";
};

const didWeatherChange = (previous: WeatherSnapshot | null, next: WeatherSnapshot) => {
  if (!previous) return false;
  if (previous.category !== next.category) return true;
  if (previous.rainChance !== null && next.rainChance !== null && Math.abs(previous.rainChance - next.rainChance) >= 15) return true;
  return previous.temperature !== null && next.temperature !== null && Math.abs(previous.temperature - next.temperature) >= 3;
};

const getDistanceKm = (from: Pick<TimezoneSetting, "latitude" | "longitude">, to: Pick<TimezoneSetting, "latitude" | "longitude">) => {
  const radiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLatitude = toRadians(to.latitude - from.latitude);
  const deltaLongitude = toRadians(to.longitude - from.longitude);
  const startLatitude = toRadians(from.latitude);
  const endLatitude = toRadians(to.latitude);
  const a = Math.sin(deltaLatitude / 2) ** 2 + Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(deltaLongitude / 2) ** 2;

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
  dietaryPreferences: DietaryPreference[];
  setDietaryPreferences: (value: DietaryPreference[]) => void;
  hobbiesInterests: string[];
  setHobbiesInterests: (value: string[]) => void;
  profileShortcutLayout: ProfileShortcutLayout;
  setProfileShortcutLayout: (value: ProfileShortcutLayout) => void;
  profileWidthPreference: ProfileWidthPreference;
  setProfileWidthPreference: (value: ProfileWidthPreference) => void;
  settingsPrivacyMode: SettingsPrivacyMode;
  setSettingsPrivacyMode: (value: SettingsPrivacyMode) => void;
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
  homeCardLayout: HomeCardLayout;
  setHomeCardLayout: (value: HomeCardLayout) => void;
  homeEventVisualMode: HomeEventVisualMode;
  setHomeEventVisualMode: (value: HomeEventVisualMode) => void;
  homeVisibleSections: HomeVisibleSections;
  setHomeVisibleSections: (value: HomeVisibleSections) => void;
  homeSectionOrder: HomeSectionOrderKey[];
  setHomeSectionOrder: (value: HomeSectionOrderKey[]) => void;
  completeOnboarding: (snapshot: Omit<OnboardingSnapshot, "hasCompletedOnboarding">) => Promise<void>;
  saveSoftHelloMvpState: (snapshot?: Partial<Omit<OnboardingSnapshot, "hasCompletedOnboarding">>) => Promise<void>;
  resetOnboarding: () => Promise<void>;
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
  softSurfaces: boolean;
  setSoftSurfaces: (value: boolean) => void;
  clearBorders: boolean;
  setClearBorders: (value: boolean) => void;
  timezone: TimezoneSetting;
  setTimezone: (value: TimezoneSetting) => void;
  timeContextMode: TimeContextMode;
  setTimeContextMode: (value: TimeContextMode) => void;
  weather: WeatherSnapshot;
  liveWeatherAlert: LiveWeatherAlert | null;
};

const AppSettingsContext = createContext<AppSettings | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [isOnboardingLoaded, setIsOnboardingLoaded] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [accountPaused, setAccountPaused] = useState(false);
  const [accountPauseTimeline, setAccountPauseTimeline] = useState<AccountPauseTimeline>("Until I return");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  const [preferredAgeMin, setPreferredAgeMin] = useState(25);
  const [preferredAgeMax, setPreferredAgeMax] = useState(40);
  const [suburb, setSuburb] = useState("");
  const [intent, setIntent] = useState<SoftHelloIntent>("Exploring");
  const [displayName, setDisplayName] = useState("Alon");
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
  const [warmUpLowerBlur, setWarmUpLowerBlur] = useState(true);
  const [showSuburbArea, setShowSuburbArea] = useState(false);
  const [showInterests, setShowInterests] = useState(false);
  const [showComfortPreferences, setShowComfortPreferences] = useState(false);
  const [minimalProfileView, setMinimalProfileView] = useState(false);
  const [comfortPreferences, setComfortPreferences] = useState<SoftHelloComfortPreference[]>(defaultComfortPreferences);
  const [verificationLevel, setVerificationLevel] = useState<SoftHelloVerificationLevel>("Unverified");
  const [eventMemberships, setEventMemberships] = useState<EventMembership[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [safetyReports, setSafetyReports] = useState<SafetyReport[]>([]);
  const [postEventFeedback, setPostEventFeedback] = useState<PostEventFeedback[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [pinnedEventIds, setPinnedEventIds] = useState<string[]>([]);
  const [hiddenEventIds, setHiddenEventIds] = useState<string[]>([]);
  const [noiseLevelPreference, setNoiseLevelPreference] = useState<NoiseLevelPreference>("Any");
  const [contactPreferences, setContactPreferences] = useState<ContactPreference[]>(["Text"]);
  const [transportationMethod, setTransportationMethod] = useState<TransportationMethod>("Public transport");
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>(["No preference"]);
  const [hobbiesInterests, setHobbiesInterests] = useState<string[]>(["Coffee", "Movies", "Walks"]);
  const [profileShortcutLayout, setProfileShortcutLayout] = useState<ProfileShortcutLayout>("Clean");
  const [profileWidthPreference, setProfileWidthPreference] = useState<ProfileWidthPreference>("Contained");
  const [settingsPrivacyMode, setSettingsPrivacyMode] = useState<SettingsPrivacyMode>("Basic");
  const [batterySaver, setBatterySaver] = useState(false);
  const [lowLightMode, setLowLightMode] = useState(false);
  const [lowLightLevel, setLowLightLevel] = useState<LowLightLevel>("Medium");
  const [homeViewMode, setHomeViewMode] = useState<HomeViewMode>("Essential");
  const [homeNearbyOnly, setHomeNearbyOnly] = useState(false);
  const [homeSmallGroupsOnly, setHomeSmallGroupsOnly] = useState(false);
  const [homeWeatherSafeOnly, setHomeWeatherSafeOnly] = useState(false);
  const [homeEventLayout, setHomeEventLayout] = useState<HomeEventLayout>("List");
  const [homeLayoutDensity, setHomeLayoutDensity] = useState<HomeLayoutDensity>("Comfortable");
  const [homeCardLayout, setHomeCardLayout] = useState<HomeCardLayout>("Vertical list");
  const [homeEventVisualMode, setHomeEventVisualMode] = useState<HomeEventVisualMode>("Emoji/Icon");
  const [homeVisibleSections, setHomeVisibleSections] = useState<HomeVisibleSections>(defaultHomeVisibleSections);
  const [homeSectionOrder, setHomeSectionOrder] = useState<HomeSectionOrderKey[]>(defaultHomeSectionOrder);
  const [isNightMode, setIsNightMode] = useState(false);
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
  const [notificationSnoozePreset, setNotificationSnoozePreset] = useState<NotificationSnoozePreset>("Tonight");
  const [useApproximateLocation, setUseApproximateLocation] = useState(true);
  const [showDistanceInMeetups, setShowDistanceInMeetups] = useState(true);
  const [allowMessageRequests, setAllowMessageRequests] = useState(false);
  const [safetyCheckIns, setSafetyCheckIns] = useState(true);
  const [appLanguage, setAppLanguageState] = useState<NsnLocalLanguage>(DEFAULT_NSN_LANGUAGE);
  const [translationLanguage, setTranslationLanguageState] = useState<NsnLocalLanguage>(DEFAULT_NSN_LANGUAGE);
  const [appPalette, setAppPalette] = useState<AppPalette>(appPalettes[0]);
  const [brandThemeId, setBrandThemeIdState] = useState<BrandThemeId>("nsn");
  const [softSurfaces, setSoftSurfaces] = useState(false);
  const [clearBorders, setClearBorders] = useState(false);
  const [timezone, setTimezone] = useState<TimezoneSetting>(defaultNsnTimezone);
  const [timeContextMode, setTimeContextMode] = useState<TimeContextMode>("Use selected suburb/local area");
  const [weather, setWeather] = useState<WeatherSnapshot>({ temperature: null, rainChance: null, category: "unknown" });
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
        const storedAgeRange = normalizePreferredAgeRange(snapshot.preferredAgeMin, snapshot.preferredAgeMax);
        setAge(normalizeAdultAge(snapshot.age));
        setPreferredAgeMin(storedAgeRange.min);
        setPreferredAgeMax(storedAgeRange.max);
        setSuburb(snapshot.suburb ?? "");
        setIntent(snapshot.intent ?? "Exploring");
        setDisplayName(snapshot.displayName || "Alon");
        setMiddleName(snapshot.middleName ?? "");
        setLastName(snapshot.lastName ?? "");
        setGender(snapshot.gender ?? "Not specified");
        const storedMiddleNameDisplay = normalizeNameDisplayMode(snapshot.middleNameDisplay, snapshot.showMiddleName ? "Full" : "Hidden");
        const storedLastNameDisplay = normalizeNameDisplayMode(snapshot.lastNameDisplay, snapshot.showLastName ? "Full" : "Hidden");
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
        setWarmUpLowerBlur(snapshot.warmUpLowerBlur ?? true);
        setShowSuburbArea(snapshot.showSuburbArea ?? true);
        setShowInterests(snapshot.showInterests ?? true);
        setShowComfortPreferences(snapshot.showComfortPreferences ?? true);
        setMinimalProfileView(Boolean(snapshot.minimalProfileView));
        setComfortPreferences(snapshot.comfortPreferences?.length ? snapshot.comfortPreferences : defaultComfortPreferences);
        setVerificationLevel(snapshot.verificationLevel ?? "Unverified");
        setEventMemberships(snapshot.eventMemberships ?? []);
        setBlockedUserIds(snapshot.blockedUserIds ?? []);
        setSafetyReports(snapshot.safetyReports ?? []);
        setPostEventFeedback(snapshot.postEventFeedback ?? []);
        setSavedPlaces(snapshot.savedPlaces ?? []);
        setPinnedEventIds(snapshot.pinnedEventIds ?? []);
        setHiddenEventIds(snapshot.hiddenEventIds ?? []);
        setNoiseLevelPreference(snapshot.noiseLevelPreference ?? "Any");
        setContactPreferences(snapshot.contactPreferences?.length ? snapshot.contactPreferences : ["Text"]);
        setTransportationMethod(snapshot.transportationMethod ?? "Public transport");
        setDietaryPreferences(snapshot.dietaryPreferences?.length ? snapshot.dietaryPreferences : ["No preference"]);
        setHobbiesInterests(snapshot.hobbiesInterests?.length ? snapshot.hobbiesInterests : ["Coffee", "Movies", "Walks"]);
        setProfileShortcutLayout(snapshot.profileShortcutLayout ?? "Clean");
        setProfileWidthPreference(snapshot.profileWidthPreference ?? "Contained");
        setSettingsPrivacyMode(snapshot.settingsPrivacyMode ?? "Basic");
        setBatterySaver(Boolean(snapshot.batterySaver));
        setLowLightMode(Boolean(snapshot.lowLightMode));
        setLowLightLevel(snapshot.lowLightLevel ?? "Medium");
        setHomeViewMode(snapshot.homeViewMode ?? "Essential");
        setHomeNearbyOnly(Boolean(snapshot.homeNearbyOnly));
        setHomeSmallGroupsOnly(Boolean(snapshot.homeSmallGroupsOnly));
        setHomeWeatherSafeOnly(Boolean(snapshot.homeWeatherSafeOnly));
        setHomeEventLayout(snapshot.homeEventLayout ?? "List");
        setHomeLayoutDensity(snapshot.homeLayoutDensity ?? "Comfortable");
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
        setTimezone(normalizeTimezoneSetting(snapshot.timezone));
        setTimeContextMode(normalizeTimeContextMode(snapshot.timeContextMode));
        setBlurProfilePhoto(snapshot.blurProfilePhoto ?? (snapshot.visibilityPreference ?? "Blurred") === "Blurred");
      } catch (error) {
        console.log("NSN onboarding could not load:", error);
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

  const completeOnboarding = async (snapshot: Omit<OnboardingSnapshot, "hasCompletedOnboarding">) => {
    setAgeConfirmed(snapshot.ageConfirmed);
    const nextAgeRange = normalizePreferredAgeRange(snapshot.preferredAgeMin, snapshot.preferredAgeMax);
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
    const nextMiddleNameDisplay = normalizeNameDisplayMode(snapshot.middleNameDisplay, snapshot.showMiddleName ? "Full" : "Hidden");
    const nextLastNameDisplay = normalizeNameDisplayMode(snapshot.lastNameDisplay, snapshot.showLastName ? "Full" : "Hidden");
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
    setContactPreferences(snapshot.contactPreferences?.length ? snapshot.contactPreferences : ["Text"]);
    setTransportationMethod(snapshot.transportationMethod);
    setDietaryPreferences(snapshot.dietaryPreferences);
    setHobbiesInterests(snapshot.hobbiesInterests);
    setProfileShortcutLayout(snapshot.profileShortcutLayout ?? "Clean");
    setProfileWidthPreference(snapshot.profileWidthPreference ?? "Contained");
    setSettingsPrivacyMode(snapshot.settingsPrivacyMode ?? "Basic");
    setBatterySaver(Boolean(snapshot.batterySaver));
    setLowLightMode(Boolean(snapshot.lowLightMode));
    setLowLightLevel(snapshot.lowLightLevel ?? "Medium");
    setHomeViewMode(snapshot.homeViewMode ?? "Essential");
    setHomeNearbyOnly(Boolean(snapshot.homeNearbyOnly));
    setHomeSmallGroupsOnly(Boolean(snapshot.homeSmallGroupsOnly));
    setHomeWeatherSafeOnly(Boolean(snapshot.homeWeatherSafeOnly));
    setHomeEventLayout(snapshot.homeEventLayout ?? "List");
    setHomeLayoutDensity(snapshot.homeLayoutDensity ?? "Comfortable");
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
    setTimezone(normalizeTimezoneSetting(snapshot.timezone));
    setTimeContextMode(normalizeTimeContextMode(snapshot.timeContextMode));
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
          homeEventVisualMode: normalizeHomeEventVisualMode(snapshot.homeEventVisualMode),
          homeVisibleSections: normalizeHomeVisibleSections(snapshot.homeVisibleSections),
          homeSectionOrder: normalizeHomeSectionOrder(snapshot.homeSectionOrder),
          timezone: normalizeTimezoneSetting(snapshot.timezone),
          timeContextMode: normalizeTimeContextMode(snapshot.timeContextMode),
          hasCompletedOnboarding: true,
        } satisfies OnboardingSnapshot)
      );
    } catch (error) {
      console.log("NSN onboarding could not save:", error);
    }
  };

  const saveSoftHelloMvpState = async (snapshot: Partial<Omit<OnboardingSnapshot, "hasCompletedOnboarding">> = {}) => {
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
      transportationMethod,
      dietaryPreferences,
      hobbiesInterests,
      profileShortcutLayout,
      profileWidthPreference,
      settingsPrivacyMode,
      batterySaver,
      lowLightMode,
      lowLightLevel,
      homeViewMode,
      homeNearbyOnly,
      homeSmallGroupsOnly,
      homeWeatherSafeOnly,
      homeEventLayout,
      homeLayoutDensity,
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
      timezone,
      timeContextMode,
      ...snapshot,
    };
    nextSnapshot.appLanguage = normalizeNsnLanguage(nextSnapshot.appLanguage);
    nextSnapshot.translationLanguage = normalizeNsnLanguage(nextSnapshot.translationLanguage);
    nextSnapshot.brandThemeId = normalizeBrandThemeId(nextSnapshot.brandThemeId);
    nextSnapshot.timezone = normalizeTimezoneSetting(nextSnapshot.timezone);
    nextSnapshot.timeContextMode = normalizeTimeContextMode(nextSnapshot.timeContextMode);

    if (snapshot.ageConfirmed !== undefined) setAgeConfirmed(snapshot.ageConfirmed);
    if (snapshot.accountPaused !== undefined) setAccountPaused(snapshot.accountPaused);
    if (snapshot.accountPauseTimeline !== undefined) setAccountPauseTimeline(snapshot.accountPauseTimeline);
    if (snapshot.age !== undefined) {
      const nextAge = normalizeAdultAge(snapshot.age);
      setAge(nextAge);
      nextSnapshot.age = nextAge;
    }
    if (snapshot.preferredAgeMin !== undefined || snapshot.preferredAgeMax !== undefined) {
      const nextAgeRange = normalizePreferredAgeRange(snapshot.preferredAgeMin ?? preferredAgeMin, snapshot.preferredAgeMax ?? preferredAgeMax);
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
    if (snapshot.showPreferredAgeRange !== undefined) setShowPreferredAgeRange(snapshot.showPreferredAgeRange);
    if (snapshot.showGender !== undefined) setShowGender(snapshot.showGender);
    if (snapshot.profilePhotoUri !== undefined) setProfilePhotoUri(snapshot.profilePhotoUri);
    if (snapshot.contactEmail !== undefined) setContactEmail(snapshot.contactEmail);
    if (snapshot.contactPhone !== undefined) setContactPhone(snapshot.contactPhone);
    if (snapshot.identitySelfieUri !== undefined) setIdentitySelfieUri(snapshot.identitySelfieUri);
    if (snapshot.hasIdentityDocument !== undefined) setHasIdentityDocument(snapshot.hasIdentityDocument);
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
    if (snapshot.warmUpLowerBlur !== undefined) setWarmUpLowerBlur(snapshot.warmUpLowerBlur);
    if (snapshot.showSuburbArea !== undefined) setShowSuburbArea(snapshot.showSuburbArea);
    if (snapshot.showInterests !== undefined) setShowInterests(snapshot.showInterests);
    if (snapshot.showComfortPreferences !== undefined) setShowComfortPreferences(snapshot.showComfortPreferences);
    if (snapshot.minimalProfileView !== undefined) setMinimalProfileView(snapshot.minimalProfileView);
    if (snapshot.comfortPreferences !== undefined) setComfortPreferences(snapshot.comfortPreferences);
    if (snapshot.verificationLevel !== undefined) setVerificationLevel(snapshot.verificationLevel);
    if (snapshot.eventMemberships !== undefined) setEventMemberships(snapshot.eventMemberships);
    if (snapshot.blockedUserIds !== undefined) setBlockedUserIds(snapshot.blockedUserIds);
    if (snapshot.safetyReports !== undefined) setSafetyReports(snapshot.safetyReports);
    if (snapshot.postEventFeedback !== undefined) setPostEventFeedback(snapshot.postEventFeedback);
    if (snapshot.savedPlaces !== undefined) setSavedPlaces(snapshot.savedPlaces);
    if (snapshot.pinnedEventIds !== undefined) setPinnedEventIds(snapshot.pinnedEventIds);
    if (snapshot.hiddenEventIds !== undefined) setHiddenEventIds(snapshot.hiddenEventIds);
    if (snapshot.noiseLevelPreference !== undefined) setNoiseLevelPreference(snapshot.noiseLevelPreference);
    if (snapshot.contactPreferences !== undefined) setContactPreferences(snapshot.contactPreferences.length ? snapshot.contactPreferences : ["Text"]);
    if (snapshot.transportationMethod !== undefined) setTransportationMethod(snapshot.transportationMethod);
    if (snapshot.dietaryPreferences !== undefined) setDietaryPreferences(snapshot.dietaryPreferences);
    if (snapshot.hobbiesInterests !== undefined) setHobbiesInterests(snapshot.hobbiesInterests);
    if (snapshot.profileShortcutLayout !== undefined) setProfileShortcutLayout(snapshot.profileShortcutLayout);
    if (snapshot.profileWidthPreference !== undefined) setProfileWidthPreference(snapshot.profileWidthPreference);
    if (snapshot.settingsPrivacyMode !== undefined) setSettingsPrivacyMode(snapshot.settingsPrivacyMode);
    if (snapshot.batterySaver !== undefined) setBatterySaver(snapshot.batterySaver);
    if (snapshot.lowLightMode !== undefined) setLowLightMode(snapshot.lowLightMode);
    if (snapshot.lowLightLevel !== undefined) setLowLightLevel(snapshot.lowLightLevel);
    if (snapshot.homeViewMode !== undefined) setHomeViewMode(snapshot.homeViewMode);
    if (snapshot.homeNearbyOnly !== undefined) setHomeNearbyOnly(snapshot.homeNearbyOnly);
    if (snapshot.homeSmallGroupsOnly !== undefined) setHomeSmallGroupsOnly(snapshot.homeSmallGroupsOnly);
    if (snapshot.homeWeatherSafeOnly !== undefined) setHomeWeatherSafeOnly(snapshot.homeWeatherSafeOnly);
    if (snapshot.homeEventLayout !== undefined) setHomeEventLayout(snapshot.homeEventLayout);
    if (snapshot.homeLayoutDensity !== undefined) setHomeLayoutDensity(snapshot.homeLayoutDensity);
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
    if (snapshot.suggestNightModeInEvenings !== undefined) setSuggestNightModeInEvenings(snapshot.suggestNightModeInEvenings);
    if (snapshot.notificationSnoozed !== undefined) setNotificationSnoozed(snapshot.notificationSnoozed);
    if (snapshot.notificationSnoozePreset !== undefined) setNotificationSnoozePreset(snapshot.notificationSnoozePreset);
    if (snapshot.appLanguage !== undefined) setAppLanguageState(normalizeNsnLanguage(snapshot.appLanguage));
    if (snapshot.translationLanguage !== undefined) setTranslationLanguageState(normalizeNsnLanguage(snapshot.translationLanguage));
    if (snapshot.brandThemeId !== undefined) setBrandThemeIdState(normalizeBrandThemeId(snapshot.brandThemeId));
    if (snapshot.timezone !== undefined) setTimezone(normalizeTimezoneSetting(snapshot.timezone));
    if (snapshot.timeContextMode !== undefined) setTimeContextMode(normalizeTimeContextMode(snapshot.timeContextMode));

    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(nextSnapshot));
    } catch (error) {
      console.log("NSN state could not save:", error);
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
          `https://api.open-meteo.com/v1/forecast?latitude=${timezone.latitude}&longitude=${timezone.longitude}&current=temperature_2m&hourly=precipitation_probability&timezone=${encodeURIComponent(timezone.timeZone)}&forecast_days=1`
        );

        if (!response.ok) {
          throw new Error(`Weather request failed with ${response.status}`);
        }

        const data = await response.json();
        const currentHourIndex = data.hourly.time?.findIndex((time: string) => time === data.current.time) ?? 0;
        const rainChance = data.hourly.precipitation_probability?.[currentHourIndex >= 0 ? currentHourIndex : 0] ?? null;
        const temperature = typeof data.current.temperature_2m === "number" ? Math.round(data.current.temperature_2m) : null;
        const nextWeather: WeatherSnapshot = {
          temperature,
          rainChance,
          category: getWeatherCategory(temperature, rainChance),
        };
        const changed = didWeatherChange(previousWeather.current, nextWeather);
        previousWeather.current = nextWeather;

        if (cancelled) return;

        setWeather(nextWeather);

        const temperatureCopy = nextWeather.temperature === null ? "temperature unavailable" : `${nextWeather.temperature}C`;
        const rainCopy = nextWeather.rainChance === null ? "rain chance unavailable" : `${nextWeather.rainChance}% rain chance`;
        const detail = nextWeather.category === "rain"
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
        console.log("Live weather notification fetch failed:", error);
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

  const resetOnboarding = async () => {
    setHasCompletedOnboarding(false);
    setAgeConfirmed(false);

    try {
      await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch (error) {
      console.log("NSN onboarding could not reset:", error);
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
        transportationMethod,
        setTransportationMethod,
        dietaryPreferences,
        setDietaryPreferences,
        hobbiesInterests,
        setHobbiesInterests,
        profileShortcutLayout,
        setProfileShortcutLayout,
        profileWidthPreference,
        setProfileWidthPreference,
        settingsPrivacyMode,
        setSettingsPrivacyMode,
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
        softSurfaces,
        setSoftSurfaces,
        clearBorders,
        setClearBorders,
        timezone,
        setTimezone,
        timeContextMode,
        setTimeContextMode,
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
