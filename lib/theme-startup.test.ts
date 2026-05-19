import { describe, expect, it } from "vitest";

import { getInitialAppColorScheme } from "./theme-startup";

describe("theme startup color scheme", () => {
  it("starts from the light root palette even when Expo Go follows system dark mode", () => {
    expect(getInitialAppColorScheme("dark")).toBe("light");
  });

  it("keeps the light root palette when the system scheme is unavailable", () => {
    expect(getInitialAppColorScheme(null)).toBe("light");
    expect(getInitialAppColorScheme(undefined)).toBe("light");
  });
});
