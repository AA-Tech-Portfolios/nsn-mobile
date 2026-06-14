import { describe, expect, it } from "vitest";

import { onboardingCopy } from "./onboarding-copy";

describe("onboarding copy", () => {
  it("frames NSN as a local alpha prototype without production trust or matching claims", () => {
    const visibleCopy = [
      onboardingCopy.welcomeIntro.mobile,
      onboardingCopy.welcomeIntro.desktop,
      onboardingCopy.welcomePrivacy.mobile,
      onboardingCopy.welcomePrivacy.desktop,
      onboardingCopy.preferredAgeRangeHint,
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
});
