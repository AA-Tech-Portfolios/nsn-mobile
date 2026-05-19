import { describe, expect, it } from "vitest";

import { createAlphaTesterOnboardingSnapshot } from "./onboarding-snapshot";

describe("alpha tester onboarding snapshot", () => {
  it("skips setup with a private unregistered tester profile", () => {
    const snapshot = createAlphaTesterOnboardingSnapshot({
      appLanguage: "English (Australia)",
      translationLanguage: "English (Australia)",
      brandThemeId: "nsn",
    });

    expect(snapshot).toMatchObject({
      ageConfirmed: false,
      age: null,
      displayName: "NSN tester",
      intent: "Exploring",
      verificationLevel: "Unverified",
      privateProfile: true,
      blurProfilePhoto: true,
      showAge: false,
      showSuburbArea: false,
      showInterests: false,
      showComfortPreferences: false,
      minimalProfileView: true,
      brandThemeId: "nsn",
    });
    expect(snapshot.eventMemberships).toEqual([]);
    expect(snapshot.safetyReports).toEqual([]);
  });
});
