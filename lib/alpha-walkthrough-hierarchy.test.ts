import { describe, expect, it } from "vitest";

import { alphaWalkthroughHierarchy, shouldShowAlphaWalkthroughContext } from "./alpha-walkthrough-hierarchy";

describe("alpha walkthrough hierarchy", () => {
  it("prioritizes the task flow before optional proof-of-concept context", () => {
    expect(alphaWalkthroughHierarchy.initialSectionOrder.slice(0, 3)).toEqual([
      "progress",
      "stepNavigation",
      "currentStep",
    ]);
    expect(alphaWalkthroughHierarchy.initialSectionOrder.indexOf("learnMore")).toBeGreaterThan(
      alphaWalkthroughHierarchy.initialSectionOrder.indexOf("currentStep"),
    );
    expect(alphaWalkthroughHierarchy.defaultContextExpanded).toBe(false);
    expect(shouldShowAlphaWalkthroughContext(alphaWalkthroughHierarchy.defaultContextExpanded)).toBe(false);
    expect(shouldShowAlphaWalkthroughContext(true)).toBe(true);
  });
});
