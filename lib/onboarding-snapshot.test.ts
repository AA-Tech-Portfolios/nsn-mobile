import { describe, expect, it } from "vitest";

import {
  ONBOARDING_RECOMMENDED_DEFAULTS,
  createAlphaTesterOnboardingSnapshot,
  createRecommendedPrivateOnboardingSnapshot,
} from "./onboarding-snapshot";

describe("alpha tester onboarding snapshot", () => {
  it("finishes later with recommended private defaults", () => {
    const snapshot = createAlphaTesterOnboardingSnapshot({
      appLanguage: "English (Australia)",
      translationLanguage: "English (Australia)",
      brandThemeId: "nsn",
    });

    expect(snapshot).toMatchObject({
      ageConfirmed: false,
      birthYear: null,
      suburb: "",
      displayName: "NSN Tester",
      intent: "Exploring",
      verificationLevel: "Readiness not reviewed",
      privateProfile: true,
      blurProfilePhoto: true,
      blurLevel: "Medium blur",
      showAge: false,
      showSuburbArea: true,
      showInterests: true,
      showComfortPreferences: false,
      minimalProfileView: true,
      brandThemeId: "nsn",
    });
    expect(snapshot.hobbiesInterests).toEqual(["Coffee", "Walks"]);
    expect(snapshot.comfortPreferences).toEqual(["Small groups", "Text-first", "Quiet"]);
    expect(snapshot.photoRecordingComfortPreferences).toEqual([
      "Ask me first",
      "Ask before group photos",
      "Ask before video or audio recording",
      "Prefer no screenshots of chats/profile",
      "No public posting without permission",
    ]);
    expect(snapshot).not.toHaveProperty("age");
    expect(snapshot.eventMemberships).toEqual([]);
    expect(snapshot.safetyReports).toEqual([]);
  });

  it("exposes reusable recommended onboarding defaults", () => {
    expect(ONBOARDING_RECOMMENDED_DEFAULTS).toMatchObject({
      visibilityPreference: "Blurred",
      comfortMode: "Comfort Mode",
      privateProfile: true,
      blurProfilePhoto: true,
      blurLevel: "Medium blur",
      gender: "Not specified",
      intent: "Exploring",
      showAge: false,
      showPreferredAgeRange: false,
      showGender: false,
      showMiddleName: false,
      showLastName: false,
      showSuburbArea: true,
      showInterests: true,
      showComfortPreferences: false,
    });
  });

  it("can create a completed recommended private setup snapshot", () => {
    const snapshot = createRecommendedPrivateOnboardingSnapshot({
      appLanguage: "English (Australia)",
      translationLanguage: "English (Australia)",
      brandThemeId: "softhello",
      birthYear: 1998,
      displayName: "Maya",
      suburb: "Chatswood area",
    });

    expect(snapshot).toMatchObject({
      hasCompletedOnboarding: true,
      ageConfirmed: true,
      birthYear: 1998,
      displayName: "Maya",
      suburb: "Chatswood area",
      privateProfile: true,
      brandThemeId: "softhello",
    });
  });
});
