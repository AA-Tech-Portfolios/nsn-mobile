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
      birthYear: null,
      suburb: "",
      displayName: "NSN Tester",
      intent: "Exploring",
      verificationLevel: "Readiness not reviewed",
      privateProfile: true,
      blurProfilePhoto: true,
      showAge: false,
      showSuburbArea: false,
      showInterests: false,
      showComfortPreferences: false,
      minimalProfileView: true,
      brandThemeId: "nsn",
    });
    expect(snapshot).not.toHaveProperty("age");
    expect(snapshot.eventMemberships).toEqual([]);
    expect(snapshot.safetyReports).toEqual([]);
  });
});
