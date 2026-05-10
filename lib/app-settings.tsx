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

export type SoftHelloIntent = "Friends" | "Dating" | "Both" | "Exploring";
export type SoftHelloVisibility = "Blurred" | "Visible";
export type ProfileShortcutLayout = "Clean" | "Expanded";
export type ProfileWidthPreference = "Contained" | "Wide";
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

type OnboardingSnapshot = {
  hasCompletedOnboarding: boolean;
  ageConfirmed: boolean;
  suburb: string;
  intent: SoftHelloIntent;
  displayName: string;
  profilePhotoUri: string | null;
  contactEmail?: string;
  contactPhone?: string;
  identitySelfieUri?: string | null;
  hasIdentityDocument?: boolean;
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
  hobbiesInterests: string[];
  profileShortcutLayout?: ProfileShortcutLayout;
  profileWidthPreference?: ProfileWidthPreference;
  appLanguage?: string;
  translationLanguage?: string;
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

export const defaultNsnTimezone: TimezoneSetting = {
  id: "sydney-north-shore",
  label: "Sydney North Shore",
  city: "Sydney",
  country: "NSW, Australia",
  timeZone: "Australia/Sydney",
  latitude: -33.75,
  longitude: 151.15,
};

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
  hobbiesInterests: string[];
  setHobbiesInterests: (value: string[]) => void;
  profileShortcutLayout: ProfileShortcutLayout;
  setProfileShortcutLayout: (value: ProfileShortcutLayout) => void;
  profileWidthPreference: ProfileWidthPreference;
  setProfileWidthPreference: (value: ProfileWidthPreference) => void;
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
  softSurfaces: boolean;
  setSoftSurfaces: (value: boolean) => void;
  clearBorders: boolean;
  setClearBorders: (value: boolean) => void;
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
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [identitySelfieUri, setIdentitySelfieUri] = useState<string | null>(null);
  const [hasIdentityDocument, setHasIdentityDocument] = useState(false);
  const [visibilityPreference, setVisibilityPreference] = useState<SoftHelloVisibility>("Blurred");
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
  const [transportationMethod, setTransportationMethod] = useState<TransportationMethod>("Public transport");
  const [dietaryPreferences, setDietaryPreferences] = useState<DietaryPreference[]>(["No preference"]);
  const [hobbiesInterests, setHobbiesInterests] = useState<string[]>(["Coffee", "Movies", "Walks"]);
  const [profileShortcutLayout, setProfileShortcutLayout] = useState<ProfileShortcutLayout>("Clean");
  const [profileWidthPreference, setProfileWidthPreference] = useState<ProfileWidthPreference>("Contained");
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
  const [chatNotifications, setChatNotifications] = useState(true);
  const [quietNotifications, setQuietNotifications] = useState(false);
  const [useApproximateLocation, setUseApproximateLocation] = useState(true);
  const [showDistanceInMeetups, setShowDistanceInMeetups] = useState(true);
  const [allowMessageRequests, setAllowMessageRequests] = useState(false);
  const [safetyCheckIns, setSafetyCheckIns] = useState(true);
  const [appLanguage, setAppLanguageState] = useState<NsnLocalLanguage>(DEFAULT_NSN_LANGUAGE);
  const [translationLanguage, setTranslationLanguageState] = useState<NsnLocalLanguage>(DEFAULT_NSN_LANGUAGE);
  const [appPalette, setAppPalette] = useState<AppPalette>(appPalettes[0]);
  const [softSurfaces, setSoftSurfaces] = useState(false);
  const [clearBorders, setClearBorders] = useState(false);
  const [timezone, setTimezone] = useState<TimezoneSetting>(defaultNsnTimezone);

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
        setContactEmail(snapshot.contactEmail ?? "");
        setContactPhone(snapshot.contactPhone ?? "");
        setIdentitySelfieUri(snapshot.identitySelfieUri ?? null);
        setHasIdentityDocument(Boolean(snapshot.hasIdentityDocument));
        setVisibilityPreference(snapshot.visibilityPreference ?? "Blurred");
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
        setTransportationMethod(snapshot.transportationMethod ?? "Public transport");
        setDietaryPreferences(snapshot.dietaryPreferences?.length ? snapshot.dietaryPreferences : ["No preference"]);
        setHobbiesInterests(snapshot.hobbiesInterests?.length ? snapshot.hobbiesInterests : ["Coffee", "Movies", "Walks"]);
        setProfileShortcutLayout(snapshot.profileShortcutLayout ?? "Clean");
        setProfileWidthPreference(snapshot.profileWidthPreference ?? "Contained");
        setAppLanguageState(normalizeNsnLanguage(snapshot.appLanguage));
        setTranslationLanguageState(normalizeNsnLanguage(snapshot.translationLanguage));
        setBlurProfilePhoto((snapshot.visibilityPreference ?? "Blurred") === "Blurred");
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
    setSuburb(snapshot.suburb);
    setIntent(snapshot.intent);
    setDisplayName(snapshot.displayName);
    setProfilePhotoUri(snapshot.profilePhotoUri);
    setContactEmail(snapshot.contactEmail ?? "");
    setContactPhone(snapshot.contactPhone ?? "");
    setIdentitySelfieUri(snapshot.identitySelfieUri ?? null);
    setHasIdentityDocument(Boolean(snapshot.hasIdentityDocument));
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
    setHobbiesInterests(snapshot.hobbiesInterests);
    setProfileShortcutLayout(snapshot.profileShortcutLayout ?? "Clean");
    setProfileWidthPreference(snapshot.profileWidthPreference ?? "Contained");
    setAppLanguageState(normalizeNsnLanguage(snapshot.appLanguage));
    setTranslationLanguageState(normalizeNsnLanguage(snapshot.translationLanguage));
    setBlurProfilePhoto(snapshot.visibilityPreference === "Blurred");
    setHasCompletedOnboarding(true);

    try {
      await AsyncStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({
          ...snapshot,
          appLanguage: normalizeNsnLanguage(snapshot.appLanguage),
          translationLanguage: normalizeNsnLanguage(snapshot.translationLanguage),
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
      ageConfirmed,
      suburb,
      intent,
      displayName,
      profilePhotoUri,
      contactEmail,
      contactPhone,
      identitySelfieUri,
      hasIdentityDocument,
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
      hobbiesInterests,
      profileShortcutLayout,
      profileWidthPreference,
      appLanguage,
      translationLanguage,
      ...snapshot,
    };
    nextSnapshot.appLanguage = normalizeNsnLanguage(nextSnapshot.appLanguage);
    nextSnapshot.translationLanguage = normalizeNsnLanguage(nextSnapshot.translationLanguage);

    if (snapshot.ageConfirmed !== undefined) setAgeConfirmed(snapshot.ageConfirmed);
    if (snapshot.suburb !== undefined) setSuburb(snapshot.suburb);
    if (snapshot.intent !== undefined) setIntent(snapshot.intent);
    if (snapshot.displayName !== undefined) setDisplayName(snapshot.displayName);
    if (snapshot.profilePhotoUri !== undefined) setProfilePhotoUri(snapshot.profilePhotoUri);
    if (snapshot.contactEmail !== undefined) setContactEmail(snapshot.contactEmail);
    if (snapshot.contactPhone !== undefined) setContactPhone(snapshot.contactPhone);
    if (snapshot.identitySelfieUri !== undefined) setIdentitySelfieUri(snapshot.identitySelfieUri);
    if (snapshot.hasIdentityDocument !== undefined) setHasIdentityDocument(snapshot.hasIdentityDocument);
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
    if (snapshot.hobbiesInterests !== undefined) setHobbiesInterests(snapshot.hobbiesInterests);
    if (snapshot.profileShortcutLayout !== undefined) setProfileShortcutLayout(snapshot.profileShortcutLayout);
    if (snapshot.profileWidthPreference !== undefined) setProfileWidthPreference(snapshot.profileWidthPreference);
    if (snapshot.appLanguage !== undefined) setAppLanguageState(normalizeNsnLanguage(snapshot.appLanguage));
    if (snapshot.translationLanguage !== undefined) setTranslationLanguageState(normalizeNsnLanguage(snapshot.translationLanguage));

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
        hobbiesInterests,
        setHobbiesInterests,
        profileShortcutLayout,
        setProfileShortcutLayout,
        profileWidthPreference,
        setProfileWidthPreference,
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
        softSurfaces,
        setSoftSurfaces,
        clearBorders,
        setClearBorders,
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
