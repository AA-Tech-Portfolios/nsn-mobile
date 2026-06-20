import { describe, expect, it } from "vitest";

import { buildHref } from "./navigation-hrefs";

describe("navigation href helpers", () => {
  it("builds string hrefs with encoded query params", () => {
    expect(
      buildHref("/(tabs)/profile", {
        menu: "helpSupport",
        from: "alpha walkthrough",
      }),
    ).toBe("/(tabs)/profile?menu=helpSupport&from=alpha%20walkthrough");
  });

  it("skips absent query params while preserving false and empty values", () => {
    expect(
      buildHref("/settings", {
        from: undefined,
        section: null,
        paused: false,
        menu: "",
      }),
    ).toBe("/settings?paused=false&menu=");
  });
});
