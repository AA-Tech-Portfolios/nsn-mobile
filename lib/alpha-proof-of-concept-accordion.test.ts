import { describe, expect, it } from "vitest";

import { alphaProofOfConceptComparisonCards } from "./alpha-walkthrough-copy";
import { getAlphaComparisonAccordionRows } from "./alpha-proof-of-concept-accordion";

describe("alpha proof-of-concept accordion rows", () => {
  it("keeps comparison rows collapsed by default so the walkthrough starts sooner", () => {
    const rows = getAlphaComparisonAccordionRows(alphaProofOfConceptComparisonCards, new Set());

    expect(rows).toHaveLength(alphaProofOfConceptComparisonCards.length);
    expect(rows.every((row) => !row.expanded)).toBe(true);
    expect(rows.map((row) => row.platformType)).toEqual(alphaProofOfConceptComparisonCards.map((card) => card.platformType));
    expect(rows.every((row) => row.details === undefined)).toBe(true);
  });

  it("preserves the comparison copy when a platform row is expanded", () => {
    const [firstCard] = alphaProofOfConceptComparisonCards;
    const rows = getAlphaComparisonAccordionRows(alphaProofOfConceptComparisonCards, new Set([firstCard.platformType]));
    const firstRow = rows[0];

    expect(firstRow.expanded).toBe(true);
    expect(firstRow.details).toEqual({
      goodAt: firstCard.goodAt,
      mayStruggleWith: firstCard.mayStruggleWith,
      nsnGap: firstCard.nsnGap,
    });
    expect(rows.slice(1).every((row) => row.details === undefined)).toBe(true);
  });
});
