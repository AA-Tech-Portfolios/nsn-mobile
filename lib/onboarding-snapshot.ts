import type { OnboardingSnapshot } from "./app-settings";
import {
  defaultPhotoRecordingComfortPreferences,
  defaultPhysicalContactComfortPreferences,
} from "./app-settings";
import { defaultFoodBeveragePreferenceIds } from "./preferences/food-preferences";
import {
  defaultInterestComfortTagsByInterest,
  defaultInterestPreferenceIds,
} from "./preferences/interests";
import { defaultComfortPreferences } from "./softhello-mvp";

type OnboardingSnapshotOptions = {
  appLanguage: OnboardingSnapshot["appLanguage"];
  translationLanguage: OnboardingSnapshot["translationLanguage"];
  brandThemeId: OnboardingSnapshot["brandThemeId"];
};

export const ONBOARDING_RECOMMENDED_DEFAULTS = {
  preferredAgeMin: 18,
  preferredAgeMax: 35,
  intent: "Exploring",
  gender: "Not specified",
  visibilityPreference: "Blurred",
  comfortMode: "Comfort Mode",
  privateProfile: true,
  blurProfilePhoto: true,
  blurLevel: "Medium blur",
  warmUpLowerBlur: true,
  showMiddleName: false,
  showLastName: false,
  showAge: false,
  showPreferredAgeRange: false,
  showGender: false,
  showSuburbArea: true,
  showInterests: true,
  showComfortPreferences: false,
  minimalProfileView: true,
  comfortPreferences: ["Small groups", "Text-first", "Quiet"],
  photoRecordingComfortPreferences: defaultPhotoRecordingComfortPreferences,
  hobbiesInterests: ["Coffee", "Walks"],
} as const satisfies Partial<OnboardingSnapshot>;

export function createAlphaTesterOnboardingSnapshot(options: {
  appLanguage: OnboardingSnapshot["appLanguage"];
  translationLanguage: OnboardingSnapshot["translationLanguage"];
  brandThemeId: OnboardingSnapshot["brandThemeId"];
}): Omit<OnboardingSnapshot, "hasCompletedOnboarding"> {
  return {
    ageConfirmed: false,
    birthYear: null,
    preferredAgeMin: ONBOARDING_RECOMMENDED_DEFAULTS.preferredAgeMin,
    preferredAgeMax: ONBOARDING_RECOMMENDED_DEFAULTS.preferredAgeMax,
    suburb: "",
    intent: ONBOARDING_RECOMMENDED_DEFAULTS.intent,
    displayName: "NSN Tester",
    middleName: "",
    lastName: "",
    gender: ONBOARDING_RECOMMENDED_DEFAULTS.gender,
    showMiddleName: ONBOARDING_RECOMMENDED_DEFAULTS.showMiddleName,
    showLastName: ONBOARDING_RECOMMENDED_DEFAULTS.showLastName,
    showAge: ONBOARDING_RECOMMENDED_DEFAULTS.showAge,
    showPreferredAgeRange: ONBOARDING_RECOMMENDED_DEFAULTS.showPreferredAgeRange,
    showGender: ONBOARDING_RECOMMENDED_DEFAULTS.showGender,
    profilePhotoUri: null,
    visibilityPreference: ONBOARDING_RECOMMENDED_DEFAULTS.visibilityPreference,
    comfortMode: ONBOARDING_RECOMMENDED_DEFAULTS.comfortMode,
    privateProfile: ONBOARDING_RECOMMENDED_DEFAULTS.privateProfile,
    blurProfilePhoto: ONBOARDING_RECOMMENDED_DEFAULTS.blurProfilePhoto,
    blurLevel: ONBOARDING_RECOMMENDED_DEFAULTS.blurLevel,
    warmUpLowerBlur: ONBOARDING_RECOMMENDED_DEFAULTS.warmUpLowerBlur,
    showSuburbArea: ONBOARDING_RECOMMENDED_DEFAULTS.showSuburbArea,
    showInterests: ONBOARDING_RECOMMENDED_DEFAULTS.showInterests,
    showComfortPreferences: ONBOARDING_RECOMMENDED_DEFAULTS.showComfortPreferences,
    minimalProfileView: ONBOARDING_RECOMMENDED_DEFAULTS.minimalProfileView,
    comfortPreferences: [...ONBOARDING_RECOMMENDED_DEFAULTS.comfortPreferences],
    verificationLevel: "Readiness not reviewed",
    eventMemberships: [],
    blockedUserIds: [],
    safetyReports: [],
    postEventFeedback: [],
    savedPlaces: [],
    pinnedEventIds: [],
    hiddenEventIds: [],
    contactPreferences: ["Text"],
    socialEnergyPreference: "Calm",
    communicationPreferences: ["Low-message mode", "Details only"],
    groupSizePreference: "Small groups only",
    photoRecordingComfortPreferences: [
      ...ONBOARDING_RECOMMENDED_DEFAULTS.photoRecordingComfortPreferences,
    ],
    physicalContactComfortPreferences: defaultPhysicalContactComfortPreferences,
    verifiedButPrivate: true,
    transportationMethod: "Public transport",
    dietaryPreferences: ["No preference"],
    foodBeveragePreferenceIds: defaultFoodBeveragePreferenceIds,
    hobbiesInterests: [...ONBOARDING_RECOMMENDED_DEFAULTS.hobbiesInterests],
    interestPreferenceIds: defaultInterestPreferenceIds,
    interestComfortTagsByInterest: defaultInterestComfortTagsByInterest,
    appLanguage: options.appLanguage,
    translationLanguage: options.translationLanguage,
    brandThemeId: options.brandThemeId,
  };
}

export function createRecommendedPrivateOnboardingSnapshot(
  options: OnboardingSnapshotOptions & {
    birthYear: number;
    displayName: string;
    suburb: string;
  },
): OnboardingSnapshot {
  return {
    ...createAlphaTesterOnboardingSnapshot(options),
    hasCompletedOnboarding: true,
    ageConfirmed: true,
    birthYear: options.birthYear,
    displayName: options.displayName.trim() || "NSN member",
    suburb: options.suburb.trim(),
  };
}
