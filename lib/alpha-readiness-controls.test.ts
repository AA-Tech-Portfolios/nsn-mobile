import { describe, expect, it } from "vitest";
import {
  getAlphaActionLabel,
  getAlphaRecentStatusCopy,
  getDependentSettingAvailability,
  getOnboardingAboutRequirement,
  getProfilePreferenceDestination,
} from "./alpha-readiness-controls";

describe("alpha readiness controls", () => {
  it("standardizes prototype action labels to Demo, Coming soon, or Saved locally", () => {
    expect(getAlphaActionLabel("demo")).toBe("Demo");
    expect(getAlphaActionLabel("comingSoon")).toBe("Coming soon");
    expect(getAlphaActionLabel("local")).toBe("Saved locally");
    expect(getAlphaRecentStatusCopy("Demo")).toBe("Demo saved locally");
    expect(getAlphaRecentStatusCopy("Coming soon")).toBe("Coming soon");
    expect(getAlphaRecentStatusCopy("Saved locally")).toBe("Saved locally");
  });

  it("keeps profile preferences reachable inside the mobile drawer", () => {
    expect(
      getProfilePreferenceDestination({
        panel: "transportPreferences",
        platform: "ios",
        section: "transport",
        width: 390,
      })
    ).toEqual({
      closesDrawer: false,
      kind: "drawer-panel",
      panel: "transportPreferences",
    });
  });

  it("closes the drawer before using the wide web preference view", () => {
    expect(
      getProfilePreferenceDestination({
        panel: "contactPreferencePanel",
        platform: "web",
        section: "contact",
        width: 1024,
      })
    ).toEqual({
      closesDrawer: true,
      kind: "full-view",
      section: "contact",
    });
  });

  it("marks dependency-disabled settings with a reason", () => {
    expect(
      getDependentSettingAvailability({
        copy: "Keep numeric time beside the analog clock.",
        disabledCopy: "Choose Analog clock display to enable this option.",
        enabled: false,
      })
    ).toEqual({
      accessibilityHint: "Choose Analog clock display to enable this option.",
      copy: "Keep numeric time beside the analog clock. Choose Analog clock display to enable this option.",
      disabled: true,
    });
  });

  it("explains why onboarding cannot continue yet", () => {
    expect(
      getOnboardingAboutRequirement({
        hasAllowedName: false,
        hasInterests: true,
        hasLocalArea: true,
        hasPreferredAgeRange: true,
        isAdult: true,
      })
    ).toBe("Choose an allowed name or nickname to continue.");

    expect(
      getOnboardingAboutRequirement({
        hasAllowedName: true,
        hasInterests: true,
        hasLocalArea: true,
        hasPreferredAgeRange: true,
        isAdult: true,
      })
    ).toBeNull();
  });
});
