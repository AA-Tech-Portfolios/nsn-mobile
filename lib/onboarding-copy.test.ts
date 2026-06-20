import { describe, expect, it } from "vitest";

import { formatBirthYearAgePreview, onboardingCopy } from "./onboarding-copy";

describe("onboarding copy", () => {
  it("frames NSN as a local alpha prototype without production trust or matching claims", () => {
    const visibleCopy = [
      onboardingCopy.welcomeIntro.mobile,
      onboardingCopy.welcomeIntro.desktop,
      onboardingCopy.welcomePrivacy.mobile,
      onboardingCopy.welcomePrivacy.desktop,
      onboardingCopy.preferredAgeRangeHint,
      onboardingCopy.preferredAgeRangePreferenceHelper,
      onboardingCopy.showPreferredAgeRange,
      onboardingCopy.skipButton.copy,
      onboardingCopy.skipButton.accessibilityHint,
    ].join(" ");

    expect(visibleCopy).toMatch(/Sydney North Shore alpha/i);
    expect(visibleCopy).toMatch(/prototype/i);
    expect(visibleCopy).toMatch(/local/i);
    expect(visibleCopy).toMatch(/do not need to prove yourself/i);
    expect(visibleCopy).toMatch(/browse quietly/i);
    expect(visibleCopy).toMatch(/own pace/i);
    expect(visibleCopy).toMatch(/small meetups are enough/i);
    expect(visibleCopy).toMatch(/attend with someone you know/i);
    expect(visibleCopy).toMatch(/do not need to arrive alone/i);
    expect(visibleCopy).toMatch(/browse first/i);
    expect(visibleCopy).not.toMatch(/\b(safe|safety|matching|verified|verification|production)\b/i);
  });

  it("explains preferred age range as a soft preference", () => {
    expect(onboardingCopy.preferredAgeRangePreferenceHelper).toBe(
      "Preferred age range helps us suggest meetups and people you may feel comfortable connecting with. It is a preference, not a strict requirement.",
    );
  });

  it("formats a dynamic calculated age preview from birth year", () => {
    const referenceDate = new Date("2026-06-20T12:00:00.000Z");

    expect(formatBirthYearAgePreview(2000, referenceDate)).toBe("Age: 26");
    expect(formatBirthYearAgePreview(2000, new Date("2027-06-20T12:00:00.000Z"))).toBe(
      "Age: 27",
    );
    expect(formatBirthYearAgePreview(null, referenceDate)).toBe("");
  });
});
