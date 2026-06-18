import type { alphaProofOfConceptComparisonCards } from "./alpha-walkthrough-copy";

type AlphaComparisonCard = (typeof alphaProofOfConceptComparisonCards)[number];

export type AlphaComparisonAccordionRow = {
  platformType: AlphaComparisonCard["platformType"];
  expanded: boolean;
  details?: {
    goodAt: AlphaComparisonCard["goodAt"];
    mayStruggleWith: AlphaComparisonCard["mayStruggleWith"];
    nsnGap: AlphaComparisonCard["nsnGap"];
  };
};

export function getAlphaComparisonAccordionRows(
  cards: readonly AlphaComparisonCard[],
  expandedPlatformTypes: ReadonlySet<AlphaComparisonCard["platformType"]>,
): AlphaComparisonAccordionRow[] {
  return cards.map((card) => {
    const expanded = expandedPlatformTypes.has(card.platformType);

    return {
      platformType: card.platformType,
      expanded,
      details: expanded
        ? {
            goodAt: card.goodAt,
            mayStruggleWith: card.mayStruggleWith,
            nsnGap: card.nsnGap,
          }
        : undefined,
    };
  });
}
