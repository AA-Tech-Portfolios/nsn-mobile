import { calculateAgeFromBirthYear, type PhotoRecordingComfortPreference } from "./app-settings";

export type OnboardingPhotoPreference = "Ask first" | "Usually okay" | "Prefer no photos";
export type OnboardingRecordingPreference = "Ask first" | "Prefer no recording";
export type OnboardingScreenshotPreference = "Prefer not to share" | "Ask first";

export type OnboardingMediaPreferences = {
  photosOfMe: OnboardingPhotoPreference;
  groupPhotos: OnboardingPhotoPreference;
  recording: OnboardingRecordingPreference;
  screenshots: OnboardingScreenshotPreference;
};

export const ONBOARDING_DEFAULT_MEDIA_PREFERENCES: OnboardingMediaPreferences = {
  photosOfMe: "Ask first",
  groupPhotos: "Ask first",
  recording: "Ask first",
  screenshots: "Prefer not to share",
};

export const onboardingMediaPreferenceGroups = [
  {
    id: "photosOfMe",
    title: "Photos of me",
    helper: "Choose one for now",
    options: ["Ask first", "Usually okay", "Prefer no photos"],
  },
  {
    id: "groupPhotos",
    title: "Group photos",
    helper: "Choose one for now",
    options: ["Ask first", "Usually okay", "Prefer no photos"],
  },
  {
    id: "recording",
    title: "Video or audio recording",
    helper: "Choose one for now",
    options: ["Ask first", "Prefer no recording"],
  },
  {
    id: "screenshots",
    title: "Screenshots of profile/chats/event details",
    helper: "Choose one for now",
    options: ["Prefer not to share", "Ask first"],
  },
] as const;

export const mediaPreferencesToPhotoRecordingComfortPreferences = (
  preferences: OnboardingMediaPreferences,
): PhotoRecordingComfortPreference[] => {
  const nextPreferences: PhotoRecordingComfortPreference[] = [];

  if (preferences.photosOfMe === "Prefer no photos") {
    nextPreferences.push("No photos of me");
  } else if (preferences.photosOfMe === "Usually okay") {
    nextPreferences.push("Photos of me are usually okay");
  } else {
    nextPreferences.push("Ask me first");
  }

  if (preferences.groupPhotos === "Prefer no photos") {
    nextPreferences.push("No group photos");
  } else if (preferences.groupPhotos === "Usually okay") {
    nextPreferences.push("Group photos are okay");
  } else {
    nextPreferences.push("Ask before group photos");
  }

  nextPreferences.push(
    preferences.recording === "Prefer no recording"
      ? "No videos please"
      : "Ask before video or audio recording",
  );

  nextPreferences.push(
    preferences.screenshots === "Ask first"
      ? "Ask before screenshots"
      : "Prefer no screenshots of chats/profile",
  );
  nextPreferences.push("No public posting without permission");

  return nextPreferences;
};

export const deriveOnboardingMediaPreferences = (
  preferences: readonly PhotoRecordingComfortPreference[],
): OnboardingMediaPreferences => ({
  photosOfMe: preferences.includes("No photos of me")
    ? "Prefer no photos"
    : preferences.includes("Photos of me are usually okay")
      ? "Usually okay"
      : "Ask first",
  groupPhotos: preferences.includes("No group photos")
    ? "Prefer no photos"
    : preferences.includes("Group photos are okay")
      ? "Usually okay"
      : "Ask first",
  recording: preferences.includes("No videos please") ? "Prefer no recording" : "Ask first",
  screenshots: preferences.includes("Ask before screenshots") ? "Ask first" : "Prefer not to share",
});

export const summarizeOnboardingMediaPreferences = (preferences: OnboardingMediaPreferences) =>
  [
    `Photos of me: ${preferences.photosOfMe}`,
    `Group photos: ${preferences.groupPhotos}`,
    `Video or audio recording: ${preferences.recording}`,
    `Screenshots: ${preferences.screenshots}`,
  ].join(" · ");

export const onboardingCopy = {
  welcomeIntro: {
    mobile:
      "NSN is a Sydney North Shore alpha for low-pressure local plans — coffee, walks, movies, dinner, games, and small group meetups.",
    desktop:
      "NSN is a Sydney North Shore alpha prototype for low-pressure local plans — coffee, walks, movies, dinner, games, and small group meetups.",
  },
  welcomePrivacy: {
    mobile:
      "You do not need to be outgoing, impressive, or socially 'ready' to belong here. You can browse quietly, warm up slowly, and join at your own pace.",
    desktop:
      "You do not need to be outgoing, impressive, or socially 'ready' to belong here. You can browse quietly, warm up slowly, and join at your own pace.",
  },
  welcomeGuidelines:
    "For shared groups and meetups, NSN still asks everyone to follow the Community Guidelines and complete basic readiness checks where available, so local spaces stay respectful and comfortable.",
  preferredAgeRangeLabel: "Age comfort range",
  preferredAgeRangeHint:
    "NSN starts at 18+ and keeps age ranges realistic for this adult local alpha.",
  preferredAgeRangePreferenceHelper:
    "Age comfort range helps describe who you may feel comfortable connecting with. It is a preference, not a strict requirement.",
  showPreferredAgeRange: "Show your age comfort range in your profile preview.",
  singleSelectHelper: "Choose one for now",
  multiSelectHelper: "Choose any that feel right",
  multiSelectLimitHelper: "Choose up to 3",
  recommendedDefaults: {
    title: "Use recommended private setup",
    selectedTitle: "Recommended private setup selected",
    copy: "Start with calm defaults. You can change everything later.",
    deselect: "Tap again to deselect and set things yourself.",
  },
  optionalProfileDetails: "Add optional profile details",
  privacyPresetsTitle: "Privacy preset",
  customizeVisibilityTitle: "Customize what others can see",
  photoRecordingTitle: "Photo & recording preferences",
  photoRecordingNotice:
    "NSN can show your preferences and set community expectations, but it cannot fully prevent screenshots or recording on someone else's device.",
  reviewLater: "You can change any of this later from Profile.",
  editAfterOnboarding: {
    photoRecording: "Profile -> Privacy & Comfort -> Photo & recording preferences",
    visibility: "Profile -> Privacy & Comfort -> Visibility settings",
    eventComfort: "Event details -> My comfort settings",
  },
  skipButton: {
    accessibilityHint: "Applies private minimal defaults so you can finish setup later.",
    title: "Finish later with private defaults",
    copy: "We'll keep your profile minimal until you update it.",
  },
} as const;

export function formatBirthYearAgePreview(
  birthYear: number | null | undefined,
  referenceDate = new Date(),
) {
  const age = calculateAgeFromBirthYear(birthYear, referenceDate);
  return age === null ? "" : `Age: ${age}`;
}
