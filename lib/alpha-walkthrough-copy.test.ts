import { describe, expect, it } from "vitest";

import {
  alphaProofOfConceptComparisonCards,
  alphaProofOfConceptExplorationQuestions,
  alphaProofOfConceptIntro,
  alphaWalkthroughCopy,
  alphaWalkthroughSteps,
} from "./alpha-walkthrough-copy";

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

  it("frames NSN as a human-led social connection point without competing with other platforms", () => {
    const platformTypes = alphaProofOfConceptComparisonCards.map((card) => card.platformType);
    const visibleCopy = [
      alphaProofOfConceptIntro.title,
      alphaProofOfConceptIntro.statement,
      alphaProofOfConceptIntro.copy,
      ...alphaProofOfConceptComparisonCards.flatMap((card) => [
        card.platformType,
        card.goodAt,
        card.mayStruggleWith,
        card.nsnGap,
      ]),
      ...alphaProofOfConceptExplorationQuestions.map((question) => question.copy),
    ].join(" ");

    expect(alphaProofOfConceptIntro.title).toBe("Why NSN exists");
    expect(alphaProofOfConceptIntro.statement).toContain("social connection point");
    expect(alphaProofOfConceptIntro.statement).toContain("not a social network");
    expect(platformTypes).toEqual([
      "Social media",
      "Dating apps",
      "Messaging apps",
      "Professional networking platforms",
      "Large meetup/event platforms",
      "Support/community programs",
      "NSN",
    ]);
    expect(visibleCopy).toContain("Community Hosts");
    expect(visibleCopy).toContain("host should review and approve");
    expect(visibleCopy).toContain("People create the community");
    expect(visibleCopy).toContain("does not replace therapy");
    expect(visibleCopy).toMatch(/participation/i);
    expect(visibleCopy).not.toMatch(/\bbetter than|fix people|beat|disrupt|superior\b/i);
  });
});
