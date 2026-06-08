import { describe, expect, it } from "vitest";

import { alphaWalkthroughCopy, alphaWalkthroughSteps } from "./alpha-walkthrough-copy";

describe("alpha walkthrough copy", () => {
  it("keeps the tester tour calm and prototype-appropriate", () => {
    const visibleCopy = [
      alphaWalkthroughCopy.title,
      alphaWalkthroughCopy.subtitle,
      alphaWalkthroughCopy.prototypeNoteTitle,
      alphaWalkthroughCopy.prototypeNoteCopy,
      ...alphaWalkthroughSteps.flatMap((step) => [step.title, step.eyebrow, step.copy, step.actionLabel]),
    ].join(" ");

    expect(alphaWalkthroughSteps.map((step) => step.eyebrow)).toEqual([
      "Prototype",
      "Demo meetups",
      "Saved locally",
      "Local visibility",
      "Readiness flow",
      "No pressure",
    ]);
    expect(visibleCopy).toContain("prototype");
    expect(visibleCopy).toContain("Saved locally");
    expect(visibleCopy).not.toMatch(/\bsafety system|verification|verified|matching|matchmaking|urgent|popular|limited|guarantee\b/i);
  });
});
