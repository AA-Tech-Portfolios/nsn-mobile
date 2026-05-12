export type InterestComfortLayout = {
  cardSpansFullWidth: true;
  selectedInterestTabsWrap: true;
  allowsOverflow: true;
  modifierColumnCount: 1 | 2 | 3;
  modifierFlexBasis: "100%" | "48%" | "31%";
  modifierMinWidth: number;
};

export const interestComfortModifierTitle = "Interest comfort modifiers";

export const getInterestComfortLayout = (viewportWidth: number): InterestComfortLayout => {
  const modifierColumnCount = viewportWidth >= 1240 ? 3 : viewportWidth >= 900 ? 2 : 1;

  return {
    cardSpansFullWidth: true,
    selectedInterestTabsWrap: true,
    allowsOverflow: true,
    modifierColumnCount,
    modifierFlexBasis: modifierColumnCount === 3 ? "31%" : modifierColumnCount === 2 ? "48%" : "100%",
    modifierMinWidth: modifierColumnCount === 1 ? 0 : 230,
  };
};
