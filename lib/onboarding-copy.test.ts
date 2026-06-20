import { describe, expect, it } from "vitest";

import {
  ONBOARDING_DEFAULT_MEDIA_PREFERENCES,
  deriveOnboardingMediaPreferences,
  formatBirthYearAgePreview,
  mediaPreferencesToPhotoRecordingComfortPreferences,
  onboardingCopy,
  onboardingMediaPreferenceGroups,
} from "./onboarding-copy";

describe("onboarding copy", () => {
  it("frames NSN as a local alpha prototype without production trust or matching claims", () => {
    const visibleCopy = [
      onboardingCopy.welcomeIntro.mobile,
      onboardingCopy.welcomeIntro.desktop,
      onboardingCopy.welcomePrivacy.mobile,
      onboardingCopy.welcomePrivacy.desktop,
      onboardingCopy.welcomeGuidelines,
      onboardingCopy.preferredAgeRangeHint,
      onboardingCopy.preferredAgeRangePreferenceHelper,
      onboardingCopy.showPreferredAgeRange,
      onboardingCopy.skipButton.copy,
      onboardingCopy.skipButton.accessibilityHint,
    ].join(" ");

    expect(visibleCopy).toMatch(/Sydney North Shore alpha/i);
    expect(visibleCopy).toMatch(/prototype/i);
    expect(visibleCopy).toMatch(/local/i);
    expect(visibleCopy).toMatch(/do not need to be outgoing, impressive, or socially/i);
    expect(visibleCopy).toMatch(/Community Guidelines/i);
    expect(visibleCopy).toMatch(/basic readiness checks where available/i);
    expect(visibleCopy).toMatch(/browse quietly/i);
    expect(visibleCopy).toMatch(/own pace/i);
    expect(visibleCopy).toMatch(/small group meetups/i);
    expect(visibleCopy).toMatch(/warm up slowly/i);
    expect(visibleCopy).not.toMatch(
      /\b(verified people only|safe and secure|background checked|carefully matched|prove yourself)\b/i,
    );
  });

  it("uses calmer onboarding helper labels and consent-first media copy", () => {
    expect(onboardingCopy.preferredAgeRangeLabel).toBe("Age comfort range");
    expect(onboardingCopy.singleSelectHelper).toBe("Choose one for now");
    expect(onboardingCopy.multiSelectHelper).toBe("Choose any that feel right");
    expect(onboardingCopy.multiSelectLimitHelper).toBe("Choose up to 3");
    expect(onboardingCopy.recommendedDefaults.title).toBe("Use recommended private setup");
    expect(onboardingCopy.recommendedDefaults.selectedTitle).toBe("Recommended private setup selected");
    expect(onboardingCopy.recommendedDefaults.deselect).toBe("Tap again to deselect and set things yourself.");
    expect(onboardingCopy.skipButton.title).toBe("Finish later with private defaults");
    expect(onboardingCopy.skipButton.copy).toBe(
      "We'll keep your profile minimal until you update it.",
    );
    expect(onboardingCopy.photoRecordingNotice).toMatch(/cannot fully prevent screenshots/i);
    expect(onboardingCopy.photoRecordingNotice).not.toMatch(/prevents screenshots/i);
    expect(onboardingCopy.editAfterOnboarding.photoRecording).toBe(
      "Profile -> Privacy & Comfort -> Photo & recording preferences",
    );
    expect(onboardingCopy.editAfterOnboarding.visibility).toBe(
      "Profile -> Privacy & Comfort -> Visibility settings",
    );
    expect(onboardingCopy.editAfterOnboarding.eventComfort).toBe(
      "Event details -> My comfort settings",
    );
  });

  it("formats a dynamic calculated age preview from birth year", () => {
    const referenceDate = new Date("2026-06-20T12:00:00.000Z");

    expect(formatBirthYearAgePreview(2000, referenceDate)).toBe("Age: 25");
    expect(formatBirthYearAgePreview(2000, new Date("2027-06-20T12:00:00.000Z"))).toBe("Age: 26");
    expect(formatBirthYearAgePreview(null, referenceDate)).toBe("");
  });

  it("models photo, group photo, recording, and screenshot choices as clear single-select groups", () => {
    expect(onboardingMediaPreferenceGroups.map((group) => group.title)).toEqual([
      "Photos of me",
      "Group photos",
      "Video or audio recording",
      "Screenshots of profile/chats/event details",
    ]);
    expect(onboardingMediaPreferenceGroups.every((group) => group.helper === "Choose one for now")).toBe(true);
    expect(onboardingMediaPreferenceGroups[0].options).toEqual([
      "Ask first",
      "Usually okay",
      "Prefer no photos",
    ]);
    expect(onboardingMediaPreferenceGroups[2].options).toEqual([
      "Ask first",
      "Prefer no recording",
    ]);
  });

  it("maps recommended media defaults into the persisted comfort preference array", () => {
    expect(ONBOARDING_DEFAULT_MEDIA_PREFERENCES).toEqual({
      photosOfMe: "Ask first",
      groupPhotos: "Ask first",
      recording: "Ask first",
      screenshots: "Prefer not to share",
    });

    expect(
      mediaPreferencesToPhotoRecordingComfortPreferences(ONBOARDING_DEFAULT_MEDIA_PREFERENCES),
    ).toEqual([
      "Ask me first",
      "Ask before group photos",
      "Ask before video or audio recording",
      "Prefer no screenshots of chats/profile",
      "No public posting without permission",
    ]);
  });

  it("rehydrates explicit media edit choices from saved comfort preferences", () => {
    const saved = mediaPreferencesToPhotoRecordingComfortPreferences({
      photosOfMe: "Prefer no photos",
      groupPhotos: "Usually okay",
      recording: "Prefer no recording",
      screenshots: "Ask first",
    });

    expect(deriveOnboardingMediaPreferences(saved)).toEqual({
      photosOfMe: "Prefer no photos",
      groupPhotos: "Usually okay",
      recording: "Prefer no recording",
      screenshots: "Ask first",
    });
  });
});
