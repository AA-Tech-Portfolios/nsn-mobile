export const alphaWalkthroughHierarchy = {
  flowLabel: "Walkthrough starts here",
  learnMoreTitle: "Learn more about the prototype",
  learnMoreCopy: "Why NSN exists, platform comparisons, and open research questions are available here when testers want more context.",
  defaultContextExpanded: false,
  initialSectionOrder: [
    "progress",
    "stepNavigation",
    "currentStep",
    "stepActions",
    "interactiveTutorials",
    "prototypeNote",
    "learnMore",
  ],
} as const;

export function shouldShowAlphaWalkthroughContext(isExpanded: boolean) {
  return isExpanded;
}
