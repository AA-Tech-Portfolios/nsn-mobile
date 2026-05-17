import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

import { ICON_SYMBOL_FALLBACK, ICON_SYMBOL_MAPPING, getMaterialIconName } from "./icon-symbol-map";
import { optionsHubSections } from "../../lib/options-hub";

const require = createRequire(import.meta.url);
const materialIconGlyphs = require("@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialIcons.json") as Record<string, number>;

describe("IconSymbol mapping", () => {
  it("maps every shared alias to a Material icon available in Expo Go", () => {
    expect(materialIconGlyphs[ICON_SYMBOL_FALLBACK]).toBeDefined();

    for (const materialIconName of Object.values(ICON_SYMBOL_MAPPING)) {
      expect(materialIconGlyphs[materialIconName]).toBeDefined();
    }
  });

  it("covers Home options hub category and row icons", () => {
    const optionsHubIconNames = optionsHubSections.flatMap((section) => [
      section.icon,
      ...section.rows.map((row) => row.icon),
    ]);

    for (const iconName of optionsHubIconNames) {
      expect(ICON_SYMBOL_MAPPING).toHaveProperty(iconName);
    }
  });

  it("falls back to a visible icon for unknown aliases", () => {
    expect(getMaterialIconName("future-icon")).toBe(ICON_SYMBOL_FALLBACK);
  });
});
