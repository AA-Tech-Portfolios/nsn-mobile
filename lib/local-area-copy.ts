export type LocalAreaPickerSearchScope = "local" | "australia";

export type LocalAreaPickerCopy = {
  prompt: string;
  fallbackNote: string;
  example: string;
  emptyTitle: string;
  emptyCopy: string;
  resultGroupTitle: string;
};

export function getLocalAreaPickerCopy(searchScope: LocalAreaPickerSearchScope): LocalAreaPickerCopy {
  if (searchScope === "australia") {
    return {
      prompt: "Search for a suburb, city, region, or postcode to personalise NSN.",
      fallbackNote: "Prototype location lookup uses local fallback data while API-backed search is being prepared.",
      example: "Try 3000, Melbourne, Brisbane, Perth, Hobart, or Adelaide.",
      emptyTitle: "No suburb, city, or region found yet.",
      emptyCopy: "Try another postcode, suburb, city, or state abbreviation.",
      resultGroupTitle: "Suburbs, cities, and regions",
    };
  }

  return {
    prompt: "Search for a suburb, region, or locality to personalise NSN.",
    fallbackNote: "Prototype location lookup uses local fallback suburb data while API-backed search is being prepared.",
    example: "Try CBD, St. Ives, Parra, Northern Beaches, or West Pymble.",
    emptyTitle: "No suburb or region found yet.",
    emptyCopy: "Try another Sydney suburb, region, or common shorthand.",
    resultGroupTitle: "Suburbs and regions",
  };
}
