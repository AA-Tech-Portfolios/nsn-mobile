import { describe, expect, it } from "vitest";

import {
  getFoodBeverageOptionsByGroup,
  searchFoodBeveragePreferences,
} from "./food-preferences";

describe("food and beverage preferences", () => {
  it("includes confectionery and lollies under snacks", () => {
    const snackLabels = getFoodBeverageOptionsByGroup("snacks").map((option) => option.label);

    expect(snackLabels).toEqual(
      expect.arrayContaining([
        "Lollies",
        "Gummies",
        "Sour lollies",
        "Hard candy",
        "Jelly beans",
        "Liquorice",
        "Marshmallows",
        "Chocolate",
        "Chocolate bars",
        "Mints",
        "Sugar-free sweets",
      ])
    );
  });

  it("matches Australian and international confectionery search terms", () => {
    expect(searchFoodBeveragePreferences("lollies").map((option) => option.label)).toEqual(expect.arrayContaining(["Lollies", "Sour lollies"]));
    expect(searchFoodBeveragePreferences("candy").map((option) => option.label)).toEqual(expect.arrayContaining(["Lollies", "Hard candy"]));
    expect(searchFoodBeveragePreferences("sweets").map((option) => option.label)).toEqual(expect.arrayContaining(["Lollies", "Sugar-free sweets"]));
    expect(searchFoodBeveragePreferences("confectionery").map((option) => option.label)).toContain("Gummies");
    expect(searchFoodBeveragePreferences("sugar-free").map((option) => option.label)).toEqual(expect.arrayContaining(["Sugar-free", "Sugar-free sweets"]));
  });
});
