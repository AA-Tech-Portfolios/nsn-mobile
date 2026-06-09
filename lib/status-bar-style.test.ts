import { describe, expect, it } from "vitest";

import { getAppStatusBarBackgroundColor, getAppStatusBarStyle } from "./status-bar-style";

describe("app status bar style", () => {
  it("uses light icons in night mode and dark icons in day mode", () => {
    expect(getAppStatusBarStyle(true)).toBe("light");
    expect(getAppStatusBarStyle(false)).toBe("dark");
  });

  it("keeps the initial status bar background aligned with the app theme", () => {
    expect(getAppStatusBarBackgroundColor(true)).toBe("#020814");
    expect(getAppStatusBarBackgroundColor(false)).toBe("#FAFBFC");
  });
});
