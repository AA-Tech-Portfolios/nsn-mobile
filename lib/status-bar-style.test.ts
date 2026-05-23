import { describe, expect, it } from "vitest";

import { getAppStatusBarStyle } from "./status-bar-style";

describe("app status bar style", () => {
  it("uses light icons in night mode and dark icons in day mode", () => {
    expect(getAppStatusBarStyle(true)).toBe("light");
    expect(getAppStatusBarStyle(false)).toBe("dark");
  });
});
