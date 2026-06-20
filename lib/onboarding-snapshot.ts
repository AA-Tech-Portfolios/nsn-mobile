import type { OnboardingSnapshot } from "./app-settings";
import {
  defaultPhotoRecordingComfortPreferences,
  defaultPhysicalContactComfortPreferences,
} from "./app-settings";
import { defaultFoodBeveragePreferenceIds } from "./preferences/food-preferences";
import { defaultInterestComfortTagsByInterest, defaultInterestPreferenceIds } from "./preferences/interests";
import { defaultComfortPreferences } from "./softhello-mvp";

export function createAlphaTesterOnboardingSnapshot(options: {
  appLanguage: OnboardingSnapshot["appLanguage"];
  translationLanguage: OnboardingSnapshot["translationLanguage"];
  brandThemeId: OnboardingSnapshot["brandThemeId"];
}): Omit<OnboardingSnapshot, "hasCompletedOnboarding"> {
  return {
    ageConfirmed: false,
    birthYear: null,
    preferredAgeMin: 18,
    preferredAgeMax: 35,
    suburb: "",
    intent: "Exploring",
    displayName: "NSN Tester",
    middleName: "",
    lastName: "",
    gender: "Not specified",
    showMiddleName: false,
    showLastName: false,
    showAge: false,
    showPreferredAgeRange: false,
    showGender: false,
    profilePhotoUri: null,
    visibilityPreference: "Blurred",
    comfortMode: "Comfort Mode",
    privateProfile: true,
    blurProfilePhoto: true,
    blurLevel: "Medium blur",
    warmUpLowerBlur: true,
    showSuburbArea: false,
    showInterests: false,
    showComfortPreferences: false,
    minimalProfileView: true,
    comfortPreferences: defaultComfortPreferences,
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
    photoRecordingComfortPreferences: defaultPhotoRecordingComfortPreferences,
    physicalContactComfortPreferences: defaultPhysicalContactComfortPreferences,
    verifiedButPrivate: true,
    transportationMethod: "Public transport",
    dietaryPreferences: ["No preference"],
    foodBeveragePreferenceIds: defaultFoodBeveragePreferenceIds,
    hobbiesInterests: ["Coffee", "Movies", "Walks"],
    interestPreferenceIds: defaultInterestPreferenceIds,
    interestComfortTagsByInterest: defaultInterestComfortTagsByInterest,
    appLanguage: options.appLanguage,
    translationLanguage: options.translationLanguage,
    brandThemeId: options.brandThemeId,
  };
}
