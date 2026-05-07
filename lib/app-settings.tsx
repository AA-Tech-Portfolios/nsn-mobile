import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

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
    description: "Deep navy with indigo and teal accents.",
    swatches: ["#020814", "#071426", "#3848FF", "#18C8D1", "#FFE5A3"],
  },
  {
    id: "ocean",
    label: "Ocean Calm",
    description: "Blue, aqua, and soft sky tones.",
    swatches: ["#052033", "#0E3A5B", "#2F80ED", "#22C8D8", "#DCEEFF"],
  },
  {
    id: "forest",
    label: "Forest Social",
    description: "Evergreen surfaces with warm friendly highlights.",
    swatches: ["#071B14", "#123326", "#2F8F5B", "#72D67E", "#FFE5A3"],
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

const ONBOARDING_STORAGE_KEY = "softhello.onboarding.v1";

export type SoftHelloIntent = "Friends" | "Dating" | "Both" | "Exploring";
export type SoftHelloVisibility = "Blurred" | "Visible";
export type ProfileShortcutLayout = "Clean" | "Expanded";
export type NoiseLevelPreference = "Any" | NoiseLevel;
export type TransportationMethod = "Driving" | "Public transport" | "Walking" | "Cycling" | "Rideshare" | "Getting dropped off" | "Not sure yet";
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
export type MealPaymentPreference = "Pay my own way" | "Split evenly" | "Discuss as a group";

type OnboardingSnapshot = {
  hasCompletedOnboarding: boolean;
  ageConfirmed: boolean;
  suburb: string;
  intent: SoftHelloIntent;
  displayName: string;
  profilePhotoUri: string | null;
  visibilityPreference: SoftHelloVisibility;
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
  transportationMethod: TransportationMethod;
  dietaryPreferences: DietaryPreference[];
  mealPaymentPreference: MealPaymentPreference;
  hobbiesInterests: string[];
  profileShortcutLayout?: ProfileShortcutLayout;
};

export type TimezoneSetting = {
  id: string;
  label: string;
  city: string;
  country: string;
  region: TimezoneRegion;
  timeZone: string;
  utcOffset: string;
  utcOffsetMinutes?: number;
  usesAutoTimezone?: boolean;
  latitude: number;
  longitude: number;
};

export type TimezoneRegion =
  | "UTC"
  | "Oceania"
  | "Asia"
  | "Middle East"
  | "Africa"
  | "Europe"
  | "North America"
  | "Central America"
  | "South America";

export const timezoneRegions: TimezoneRegion[] = [
  "UTC",
  "Oceania",
  "Asia",
  "Middle East",
  "Africa",
  "Europe",
  "North America",
  "Central America",
  "South America",
];

export const timezoneOptions: TimezoneSetting[] = [
  {
    id: "utc",
    label: "UTC",
    city: "UTC",
    country: "Coordinated Universal Time",
    region: "UTC",
    timeZone: "UTC",
    utcOffset: "UTC+00:00",
    latitude: 0,
    longitude: 0,
  },
  {
    id: "sydney",
    label: "Sydney",
    city: "Sydney",
    country: "Australia",
    region: "Oceania",
    timeZone: "Australia/Sydney",
    utcOffset: "UTC+10:00/+11:00",
    latitude: -33.75,
    longitude: 151.15,
  },
  {
    id: "perth",
    label: "Perth",
    city: "Perth",
    country: "Australia",
    region: "Oceania",
    timeZone: "Australia/Perth",
    utcOffset: "UTC+08:00",
    latitude: -31.95,
    longitude: 115.86,
  },
  {
    id: "melbourne",
    label: "Melbourne",
    city: "Melbourne",
    country: "Australia",
    region: "Oceania",
    timeZone: "Australia/Melbourne",
    utcOffset: "UTC+10:00/+11:00",
    latitude: -37.81,
    longitude: 144.96,
  },
  {
    id: "brisbane",
    label: "Brisbane",
    city: "Brisbane",
    country: "Australia",
    region: "Oceania",
    timeZone: "Australia/Brisbane",
    utcOffset: "UTC+10:00",
    latitude: -27.47,
    longitude: 153.03,
  },
  {
    id: "adelaide",
    label: "Adelaide",
    city: "Adelaide",
    country: "Australia",
    region: "Oceania",
    timeZone: "Australia/Adelaide",
    utcOffset: "UTC+09:30/+10:30",
    latitude: -34.93,
    longitude: 138.6,
  },
  {
    id: "darwin",
    label: "Darwin",
    city: "Darwin",
    country: "Australia",
    region: "Oceania",
    timeZone: "Australia/Darwin",
    utcOffset: "UTC+09:30",
    latitude: -12.46,
    longitude: 130.84,
  },
  {
    id: "hobart",
    label: "Hobart",
    city: "Hobart",
    country: "Australia",
    region: "Oceania",
    timeZone: "Australia/Hobart",
    utcOffset: "UTC+10:00/+11:00",
    latitude: -42.88,
    longitude: 147.33,
  },
  {
    id: "canberra",
    label: "Canberra",
    city: "Canberra",
    country: "Australia",
    region: "Oceania",
    timeZone: "Australia/Sydney",
    utcOffset: "UTC+10:00/+11:00",
    latitude: -35.28,
    longitude: 149.13,
  },
  {
    id: "auckland",
    label: "Auckland",
    city: "Auckland",
    country: "New Zealand",
    region: "Oceania",
    timeZone: "Pacific/Auckland",
    utcOffset: "UTC+12:00/+13:00",
    latitude: -36.85,
    longitude: 174.76,
  },
  {
    id: "wellington",
    label: "Wellington",
    city: "Wellington",
    country: "New Zealand",
    region: "Oceania",
    timeZone: "Pacific/Auckland",
    utcOffset: "UTC+12:00/+13:00",
    latitude: -41.29,
    longitude: 174.78,
  },
  {
    id: "christchurch",
    label: "Christchurch",
    city: "Christchurch",
    country: "New Zealand",
    region: "Oceania",
    timeZone: "Pacific/Auckland",
    utcOffset: "UTC+12:00/+13:00",
    latitude: -43.53,
    longitude: 172.63,
  },
  {
    id: "queenstown",
    label: "Queenstown",
    city: "Queenstown",
    country: "New Zealand",
    region: "Oceania",
    timeZone: "Pacific/Auckland",
    utcOffset: "UTC+12:00/+13:00",
    latitude: -45.03,
    longitude: 168.66,
  },
  {
    id: "tokyo",
    label: "Tokyo",
    city: "Tokyo",
    country: "Japan",
    region: "Asia",
    timeZone: "Asia/Tokyo",
    utcOffset: "UTC+09:00",
    latitude: 35.68,
    longitude: 139.76,
  },
  {
    id: "singapore",
    label: "Singapore",
    city: "Singapore",
    country: "Singapore",
    region: "Asia",
    timeZone: "Asia/Singapore",
    utcOffset: "UTC+08:00",
    latitude: 1.35,
    longitude: 103.82,
  },
  {
    id: "hong-kong",
    label: "Hong Kong",
    city: "Hong Kong",
    country: "Hong Kong",
    region: "Asia",
    timeZone: "Asia/Hong_Kong",
    utcOffset: "UTC+08:00",
    latitude: 22.32,
    longitude: 114.17,
  },
  {
    id: "seoul",
    label: "Seoul",
    city: "Seoul",
    country: "South Korea",
    region: "Asia",
    timeZone: "Asia/Seoul",
    utcOffset: "UTC+09:00",
    latitude: 37.57,
    longitude: 126.98,
  },
  {
    id: "delhi",
    label: "Delhi",
    city: "Delhi",
    country: "India",
    region: "Asia",
    timeZone: "Asia/Kolkata",
    utcOffset: "UTC+05:30",
    latitude: 28.61,
    longitude: 77.21,
  },
  {
    id: "dubai",
    label: "Dubai",
    city: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    timeZone: "Asia/Dubai",
    utcOffset: "UTC+04:00",
    latitude: 25.2,
    longitude: 55.27,
  },
  {
    id: "jerusalem",
    label: "Jerusalem",
    city: "Jerusalem",
    country: "Israel",
    region: "Middle East",
    timeZone: "Asia/Jerusalem",
    utcOffset: "UTC+02:00/+03:00",
    latitude: 31.77,
    longitude: 35.21,
  },
  {
    id: "tel-aviv",
    label: "Tel Aviv",
    city: "Tel Aviv",
    country: "Israel",
    region: "Middle East",
    timeZone: "Asia/Jerusalem",
    utcOffset: "UTC+02:00/+03:00",
    latitude: 32.08,
    longitude: 34.78,
  },
  {
    id: "riyadh",
    label: "Riyadh",
    city: "Riyadh",
    country: "Saudi Arabia",
    region: "Middle East",
    timeZone: "Asia/Riyadh",
    utcOffset: "UTC+03:00",
    latitude: 24.71,
    longitude: 46.68,
  },
  {
    id: "cairo",
    label: "Cairo",
    city: "Cairo",
    country: "Egypt",
    region: "Africa",
    timeZone: "Africa/Cairo",
    utcOffset: "UTC+02:00/+03:00",
    latitude: 30.04,
    longitude: 31.24,
  },
  {
    id: "johannesburg",
    label: "Johannesburg",
    city: "Johannesburg",
    country: "South Africa",
    region: "Africa",
    timeZone: "Africa/Johannesburg",
    utcOffset: "UTC+02:00",
    latitude: -26.2,
    longitude: 28.04,
  },
  {
    id: "nairobi",
    label: "Nairobi",
    city: "Nairobi",
    country: "Kenya",
    region: "Africa",
    timeZone: "Africa/Nairobi",
    utcOffset: "UTC+03:00",
    latitude: -1.29,
    longitude: 36.82,
  },
  {
    id: "london",
    label: "London",
    city: "London",
    country: "United Kingdom",
    region: "Europe",
    timeZone: "Europe/London",
    utcOffset: "UTC+00:00/+01:00",
    latitude: 51.51,
    longitude: -0.13,
  },
  {
    id: "paris",
    label: "Paris",
    city: "Paris",
    country: "France",
    region: "Europe",
    timeZone: "Europe/Paris",
    utcOffset: "UTC+01:00/+02:00",
    latitude: 48.86,
    longitude: 2.35,
  },
  {
    id: "berlin",
    label: "Berlin",
    city: "Berlin",
    country: "Germany",
    region: "Europe",
    timeZone: "Europe/Berlin",
    utcOffset: "UTC+01:00/+02:00",
    latitude: 52.52,
    longitude: 13.41,
  },
  {
    id: "moscow",
    label: "Moscow",
    city: "Moscow",
    country: "Russia",
    region: "Europe",
    timeZone: "Europe/Moscow",
    utcOffset: "UTC+03:00",
    latitude: 55.76,
    longitude: 37.62,
  },
  {
    id: "rome",
    label: "Rome",
    city: "Rome",
    country: "Italy",
    region: "Europe",
    timeZone: "Europe/Rome",
    utcOffset: "UTC+01:00/+02:00",
    latitude: 41.9,
    longitude: 12.5,
  },
  {
    id: "madrid",
    label: "Madrid",
    city: "Madrid",
    country: "Spain",
    region: "Europe",
    timeZone: "Europe/Madrid",
    utcOffset: "UTC+01:00/+02:00",
    latitude: 40.42,
    longitude: -3.7,
  },
  {
    id: "amsterdam",
    label: "Amsterdam",
    city: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    timeZone: "Europe/Amsterdam",
    utcOffset: "UTC+01:00/+02:00",
    latitude: 52.37,
    longitude: 4.9,
  },
  {
    id: "stockholm",
    label: "Stockholm",
    city: "Stockholm",
    country: "Sweden",
    region: "Europe",
    timeZone: "Europe/Stockholm",
    utcOffset: "UTC+01:00/+02:00",
    latitude: 59.33,
    longitude: 18.07,
  },
  {
    id: "dublin",
    label: "Dublin",
    city: "Dublin",
    country: "Ireland",
    region: "Europe",
    timeZone: "Europe/Dublin",
    utcOffset: "UTC+00:00/+01:00",
    latitude: 53.35,
    longitude: -6.26,
  },
  {
    id: "vienna",
    label: "Vienna",
    city: "Vienna",
    country: "Austria",
    region: "Europe",
    timeZone: "Europe/Vienna",
    utcOffset: "UTC+01:00/+02:00",
    latitude: 48.21,
    longitude: 16.37,
  },
  {
    id: "zurich",
    label: "Zurich",
    city: "Zurich",
    country: "Switzerland",
    region: "Europe",
    timeZone: "Europe/Zurich",
    utcOffset: "UTC+01:00/+02:00",
    latitude: 47.38,
    longitude: 8.54,
  },
  {
    id: "athens",
    label: "Athens",
    city: "Athens",
    country: "Greece",
    region: "Europe",
    timeZone: "Europe/Athens",
    utcOffset: "UTC+02:00/+03:00",
    latitude: 37.98,
    longitude: 23.73,
  },
  {
    id: "warsaw",
    label: "Warsaw",
    city: "Warsaw",
    country: "Poland",
    region: "Europe",
    timeZone: "Europe/Warsaw",
    utcOffset: "UTC+01:00/+02:00",
    latitude: 52.23,
    longitude: 21.01,
  },
  {
    id: "prague",
    label: "Prague",
    city: "Prague",
    country: "Czechia",
    region: "Europe",
    timeZone: "Europe/Prague",
    utcOffset: "UTC+01:00/+02:00",
    latitude: 50.08,
    longitude: 14.44,
  },
  {
    id: "new-york",
    label: "New York",
    city: "New York",
    country: "United States",
    region: "North America",
    timeZone: "America/New_York",
    utcOffset: "UTC-05:00/-04:00",
    latitude: 40.71,
    longitude: -74.01,
  },
  {
    id: "los-angeles",
    label: "Los Angeles",
    city: "Los Angeles",
    country: "United States",
    region: "North America",
    timeZone: "America/Los_Angeles",
    utcOffset: "UTC-08:00/-07:00",
    latitude: 34.05,
    longitude: -118.24,
  },
  {
    id: "toronto",
    label: "Toronto",
    city: "Toronto",
    country: "Canada",
    region: "North America",
    timeZone: "America/Toronto",
    utcOffset: "UTC-05:00/-04:00",
    latitude: 43.65,
    longitude: -79.38,
  },
  {
    id: "chicago",
    label: "Chicago",
    city: "Chicago",
    country: "United States",
    region: "North America",
    timeZone: "America/Chicago",
    utcOffset: "UTC-06:00/-05:00",
    latitude: 41.88,
    longitude: -87.63,
  },
  {
    id: "denver",
    label: "Denver",
    city: "Denver",
    country: "United States",
    region: "North America",
    timeZone: "America/Denver",
    utcOffset: "UTC-07:00/-06:00",
    latitude: 39.74,
    longitude: -104.99,
  },
  {
    id: "phoenix",
    label: "Phoenix",
    city: "Phoenix",
    country: "United States",
    region: "North America",
    timeZone: "America/Phoenix",
    utcOffset: "UTC-07:00",
    latitude: 33.45,
    longitude: -112.07,
  },
  {
    id: "seattle",
    label: "Seattle",
    city: "Seattle",
    country: "United States",
    region: "North America",
    timeZone: "America/Los_Angeles",
    utcOffset: "UTC-08:00/-07:00",
    latitude: 47.61,
    longitude: -122.33,
  },
  {
    id: "vancouver",
    label: "Vancouver",
    city: "Vancouver",
    country: "Canada",
    region: "North America",
    timeZone: "America/Vancouver",
    utcOffset: "UTC-08:00/-07:00",
    latitude: 49.28,
    longitude: -123.12,
  },
  {
    id: "montreal",
    label: "Montreal",
    city: "Montreal",
    country: "Canada",
    region: "North America",
    timeZone: "America/Toronto",
    utcOffset: "UTC-05:00/-04:00",
    latitude: 45.5,
    longitude: -73.57,
  },
  {
    id: "calgary",
    label: "Calgary",
    city: "Calgary",
    country: "Canada",
    region: "North America",
    timeZone: "America/Edmonton",
    utcOffset: "UTC-07:00/-06:00",
    latitude: 51.05,
    longitude: -114.07,
  },
  {
    id: "mexico-city",
    label: "Mexico City",
    city: "Mexico City",
    country: "Mexico",
    region: "Central America",
    timeZone: "America/Mexico_City",
    utcOffset: "UTC-06:00",
    latitude: 19.43,
    longitude: -99.13,
  },
  {
    id: "panama-city",
    label: "Panama City",
    city: "Panama City",
    country: "Panama",
    region: "Central America",
    timeZone: "America/Panama",
    utcOffset: "UTC-05:00",
    latitude: 8.98,
    longitude: -79.52,
  },
  {
    id: "sao-paulo",
    label: "São Paulo",
    city: "São Paulo",
    country: "Brazil",
    region: "South America",
    timeZone: "America/Sao_Paulo",
    utcOffset: "UTC-03:00",
    latitude: -23.55,
    longitude: -46.63,
  },
  {
    id: "buenos-aires",
    label: "Buenos Aires",
    city: "Buenos Aires",
    country: "Argentina",
    region: "South America",
    timeZone: "America/Argentina/Buenos_Aires",
    utcOffset: "UTC-03:00",
    latitude: -34.61,
    longitude: -58.38,
  },
  {
    id: "lima",
    label: "Lima",
    city: "Lima",
    country: "Peru",
    region: "South America",
    timeZone: "America/Lima",
    utcOffset: "UTC-05:00",
    latitude: -12.05,
    longitude: -77.04,
  },
];

type AppSettings = {
  isOnboardingLoaded: boolean;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (value: boolean) => void;
  ageConfirmed: boolean;
  setAgeConfirmed: (value: boolean) => void;
  suburb: string;
  setSuburb: (value: string) => void;
  intent: SoftHelloIntent;
  setIntent: (value: SoftHelloIntent) => void;
  displayName: string;
  setDisplayName: (value: string) => void;
  profilePhotoUri: string | null;
  setProfilePhotoUri: (value: string | null) => void;
  visibilityPreference: SoftHelloVisibility;
  setVisibilityPreference: (value: SoftHelloVisibility) => void;
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
  dietaryPreferences: DietaryPreference[];
  setDietaryPreferences: (value: DietaryPreference[]) => void;
  mealPaymentPreference: MealPaymentPreference;
  setMealPaymentPreference: (value: MealPaymentPreference) => void;
  hobbiesInterests: string[];
  setHobbiesInterests: (value: string[]) => void;
  profileShortcutLayout: ProfileShortcutLayout;
  setProfileShortcutLayout: (value: ProfileShortcutLayout) => void;
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
  meetupReminders: boolean;
  setMeetupReminders: (value: boolean) => void;
  weatherAlerts: boolean;
  setWeatherAlerts: (value: boolean) => void;
  chatNotifications: boolean;
  setChatNotifications: (value: boolean) => void;
  quietNotifications: boolean;
  setQuietNotifications: (value: boolean) => void;
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
  timezone: TimezoneSetting;
  setTimezone: (value: TimezoneSetting) => void;
};

const AppSettingsContext = createContext<AppSettings | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [isOnboardingLoaded, setIsOnboardingLoaded] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [suburb, setSuburb] = useState("");
  const [intent, setIntent] = useState<SoftHelloIntent>("Exploring");
  const [displayName, setDisplayName] = useState("Alon");
  const [profilePhotoUri, setProfilePhotoUri] = useState<string | null>(null);
  const [visibilityPreference, setVisibilityPreference] = useState<SoftHelloVisibility>("Blurred");
  const [comfortPreferences, setComfortPreferences] = useState<SoftHelloComfortPreference[]>(defaultComfortPreferences);
  const [verificationLevel, setVerificationLevel] = useState<SoftHelloVerificationLevel>("Contact Verified");
  const [eventMemberships, setEventMemberships] = useState<EventMembership[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [safetyReports, setSafetyReports] = useState<SafetyReport[]>([]);
  const [postEventFeedback, setPostEventFeedback] = useState<PostEventFeedback[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [pinnedEventIds, setPinnedEventIds] = useState<string[]>([]);
  const [hiddenEventIds, setHiddenEventIds] = useState<string[]>([]);
  const [noiseLevelPreference, setNoiseLevelPreference] = useState<NoiseLevelPreference>("Any");
  const [transportationMethod, setTransportationMethod] = useState<TransportationMethod>("Public transport");
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>(["No preference"]);
  const [mealPaymentPreference, setMealPaymentPreference] = useState<MealPaymentPreference>("Pay my own way");
  const [hobbiesInterests, setHobbiesInterests] = useState<string[]>(["Coffee", "Movies", "Walks"]);
  const [profileShortcutLayout, setProfileShortcutLayout] = useState<ProfileShortcutLayout>("Clean");
  const [isNightMode, setIsNightMode] = useState(false);
  const [blurProfilePhoto, setBlurProfilePhoto] = useState(true);
  const [largerText, setLargerText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReaderHints, setScreenReaderHints] = useState(true);
  const [meetupReminders, setMeetupReminders] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [chatNotifications, setChatNotifications] = useState(true);
  const [quietNotifications, setQuietNotifications] = useState(false);
  const [useApproximateLocation, setUseApproximateLocation] = useState(true);
  const [showDistanceInMeetups, setShowDistanceInMeetups] = useState(true);
  const [allowMessageRequests, setAllowMessageRequests] = useState(false);
  const [safetyCheckIns, setSafetyCheckIns] = useState(true);
  const [appLanguage, setAppLanguage] = useState("English");
  const [translationLanguage, setTranslationLanguage] = useState("English");
  const [appPalette, setAppPalette] = useState<AppPalette>(appPalettes[0]);
  const [timezone, setTimezone] = useState<TimezoneSetting>(timezoneOptions[0]);

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
        setAgeConfirmed(Boolean(snapshot.ageConfirmed));
        setSuburb(snapshot.suburb ?? "");
        setIntent(snapshot.intent ?? "Exploring");
        setDisplayName(snapshot.displayName || "Alon");
        setProfilePhotoUri(snapshot.profilePhotoUri ?? null);
        setVisibilityPreference(snapshot.visibilityPreference ?? "Blurred");
        setComfortPreferences(snapshot.comfortPreferences?.length ? snapshot.comfortPreferences : defaultComfortPreferences);
        setVerificationLevel(snapshot.verificationLevel ?? "Contact Verified");
        setEventMemberships(snapshot.eventMemberships ?? []);
        setBlockedUserIds(snapshot.blockedUserIds ?? []);
        setSafetyReports(snapshot.safetyReports ?? []);
        setPostEventFeedback(snapshot.postEventFeedback ?? []);
        setSavedPlaces(snapshot.savedPlaces ?? []);
        setPinnedEventIds(snapshot.pinnedEventIds ?? []);
        setHiddenEventIds(snapshot.hiddenEventIds ?? []);
        setNoiseLevelPreference(snapshot.noiseLevelPreference ?? "Any");
        setTransportationMethod(snapshot.transportationMethod ?? "Public transport");
        setDietaryPreferences(snapshot.dietaryPreferences?.length ? snapshot.dietaryPreferences : ["No preference"]);
        setMealPaymentPreference(snapshot.mealPaymentPreference ?? "Pay my own way");
        setHobbiesInterests(snapshot.hobbiesInterests?.length ? snapshot.hobbiesInterests : ["Coffee", "Movies", "Walks"]);
        setProfileShortcutLayout(snapshot.profileShortcutLayout ?? "Clean");
        setBlurProfilePhoto((snapshot.visibilityPreference ?? "Blurred") === "Blurred");
      } catch (error) {
        console.log("SoftHello onboarding could not load:", error);
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
    setSuburb(snapshot.suburb);
    setIntent(snapshot.intent);
    setDisplayName(snapshot.displayName);
    setProfilePhotoUri(snapshot.profilePhotoUri);
    setVisibilityPreference(snapshot.visibilityPreference);
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
    setTransportationMethod(snapshot.transportationMethod);
    setDietaryPreferences(snapshot.dietaryPreferences);
    setMealPaymentPreference(snapshot.mealPaymentPreference);
    setHobbiesInterests(snapshot.hobbiesInterests);
    setProfileShortcutLayout(snapshot.profileShortcutLayout ?? "Clean");
    setBlurProfilePhoto(snapshot.visibilityPreference === "Blurred");
    setHasCompletedOnboarding(true);

    try {
      await AsyncStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({
          ...snapshot,
          hasCompletedOnboarding: true,
        } satisfies OnboardingSnapshot)
      );
    } catch (error) {
      console.log("SoftHello onboarding could not save:", error);
    }
  };

  const saveSoftHelloMvpState = async (snapshot: Partial<Omit<OnboardingSnapshot, "hasCompletedOnboarding">> = {}) => {
    const nextSnapshot: OnboardingSnapshot = {
      hasCompletedOnboarding,
      ageConfirmed,
      suburb,
      intent,
      displayName,
      profilePhotoUri,
      visibilityPreference,
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
      transportationMethod,
      dietaryPreferences,
      mealPaymentPreference,
      hobbiesInterests,
      profileShortcutLayout,
      ...snapshot,
    };

    if (snapshot.ageConfirmed !== undefined) setAgeConfirmed(snapshot.ageConfirmed);
    if (snapshot.suburb !== undefined) setSuburb(snapshot.suburb);
    if (snapshot.intent !== undefined) setIntent(snapshot.intent);
    if (snapshot.displayName !== undefined) setDisplayName(snapshot.displayName);
    if (snapshot.profilePhotoUri !== undefined) setProfilePhotoUri(snapshot.profilePhotoUri);
    if (snapshot.visibilityPreference !== undefined) {
      setVisibilityPreference(snapshot.visibilityPreference);
      setBlurProfilePhoto(snapshot.visibilityPreference === "Blurred");
    }
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
    if (snapshot.transportationMethod !== undefined) setTransportationMethod(snapshot.transportationMethod);
    if (snapshot.dietaryPreferences !== undefined) setDietaryPreferences(snapshot.dietaryPreferences);
    if (snapshot.mealPaymentPreference !== undefined) setMealPaymentPreference(snapshot.mealPaymentPreference);
    if (snapshot.hobbiesInterests !== undefined) setHobbiesInterests(snapshot.hobbiesInterests);
    if (snapshot.profileShortcutLayout !== undefined) setProfileShortcutLayout(snapshot.profileShortcutLayout);

    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(nextSnapshot));
    } catch (error) {
      console.log("SoftHello MVP state could not save:", error);
    }
  };

  const resetOnboarding = async () => {
    setHasCompletedOnboarding(false);
    setAgeConfirmed(false);

    try {
      await AsyncStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch (error) {
      console.log("SoftHello onboarding could not reset:", error);
    }
  };

  return (
    <AppSettingsContext.Provider
      value={{
        isOnboardingLoaded,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        ageConfirmed,
        setAgeConfirmed,
        suburb,
        setSuburb,
        intent,
        setIntent,
        displayName,
        setDisplayName,
        profilePhotoUri,
        setProfilePhotoUri,
        visibilityPreference,
        setVisibilityPreference,
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
        transportationMethod,
        setTransportationMethod,
        dietaryPreferences,
        setDietaryPreferences,
        mealPaymentPreference,
        setMealPaymentPreference,
        hobbiesInterests,
        setHobbiesInterests,
        profileShortcutLayout,
        setProfileShortcutLayout,
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
        meetupReminders,
        setMeetupReminders,
        weatherAlerts,
        setWeatherAlerts,
        chatNotifications,
        setChatNotifications,
        quietNotifications,
        setQuietNotifications,
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
        timezone,
        setTimezone,
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
