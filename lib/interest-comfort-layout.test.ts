import { describe, expect, it } from "vitest";

import { getInterestComfortLayout, interestComfortModifierTitle } from "./interest-comfort-layout";
import { interestComfortTags } from "./preferences/interests";

describe("interest comfort layout", () => {
  it("keeps the comfort modifiers card full-width and non-clipping", () => {
    expect(getInterestComfortLayout(1280)).toMatchObject({
      cardSpansFullWidth: true,
      selectedInterestTabsWrap: true,
      allowsOverflow: true,
    });
  });

  it("uses one modifier column on tablet and mobile widths", () => {
    expect(getInterestComfortLayout(390).modifierColumnCount).toBe(1);
    expect(getInterestComfortLayout(760).modifierColumnCount).toBe(1);
    expect(getInterestComfortLayout(899).modifierColumnCount).toBe(1);
  });

  it("uses two or three modifier columns on desktop widths", () => {
    expect(getInterestComfortLayout(900).modifierColumnCount).toBe(2);
    expect(getInterestComfortLayout(1120).modifierColumnCount).toBe(2);
    expect(getInterestComfortLayout(1280).modifierColumnCount).toBe(3);
  });

  it("keeps every comfort modifier represented", () => {
    expect(interestComfortTags.map((tag) => tag.label)).toEqual([
      "Love this",
      "Open to this",
      "Beginner-friendly only",
      "Small groups only",
      "Quiet setting preferred",
      "Daytime preferred",
      "Evening preferred",
      "Just observing is okay",
      "Not for me",
    ]);
  });

  it("uses the clearer interest-specific section title", () => {
    expect(interestComfortModifierTitle).toBe("Interest comfort modifiers");
  });
});
