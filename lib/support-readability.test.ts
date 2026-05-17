import { describe, expect, it } from "vitest";

import { getContrastRatio, nsnSupportReadabilityColors } from "./support-readability";

describe("support and safety readability colors", () => {
  it("keeps secondary text readable on dark and light support surfaces", () => {
    expect(getContrastRatio(nsnSupportReadabilityColors.darkMutedText, nsnSupportReadabilityColors.darkSurface)).toBeGreaterThanOrEqual(7);
    expect(getContrastRatio(nsnSupportReadabilityColors.lightMutedText, nsnSupportReadabilityColors.lightSurface)).toBeGreaterThanOrEqual(6);
    expect(getContrastRatio(nsnSupportReadabilityColors.badgeText, nsnSupportReadabilityColors.darkSurface)).toBeGreaterThanOrEqual(7);
  });

  it("keeps small prototype badges readable in light and dark themes", () => {
    expect(getContrastRatio(nsnSupportReadabilityColors.badgeText, nsnSupportReadabilityColors.darkBadgeBackground)).toBeGreaterThanOrEqual(7);
    expect(getContrastRatio(nsnSupportReadabilityColors.badgeDisabledText, nsnSupportReadabilityColors.darkBadgeNeutralBackground)).toBeGreaterThanOrEqual(7);
    expect(getContrastRatio(nsnSupportReadabilityColors.lightBadgeText, nsnSupportReadabilityColors.lightBadgeBackground)).toBeGreaterThanOrEqual(7);
    expect(getContrastRatio(nsnSupportReadabilityColors.lightBadgeNeutralText, nsnSupportReadabilityColors.lightBadgeNeutralBackground)).toBeGreaterThanOrEqual(7);
  });

  it("keeps warning text readable without relying only on yellow/orange color", () => {
    expect(getContrastRatio(nsnSupportReadabilityColors.darkWarningText, nsnSupportReadabilityColors.darkWarningSurface)).toBeGreaterThanOrEqual(4.5);
    expect(getContrastRatio(nsnSupportReadabilityColors.lightWarningText, nsnSupportReadabilityColors.lightWarningSurface)).toBeGreaterThanOrEqual(7);
  });
});
