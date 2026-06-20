import { describe, expect, it } from "vitest";

import { getSettingsSearchResults } from "./settings-search";

const resultLabels = (query: string) =>
  getSettingsSearchResults(query).map((result) => result.label);
const resultIds = (query: string) => getSettingsSearchResults(query).map((result) => result.id);

describe("settings search results", () => {
  it("returns no selectable results until the user searches", () => {
    expect(getSettingsSearchResults("")).toEqual([]);
  });

  it("matches section names and tester vocabulary with selectable destinations", () => {
    expect(resultLabels("privacy")).toEqual(expect.arrayContaining(["Privacy", "Legal & Privacy"]));
    expect(resultIds("verification")).toContain("trustFoundations");
    expect(resultIds("onboarding")).toContain("generalSettings");
    expect(resultIds("photo")).toEqual(expect.arrayContaining(["photoBlur", "trustFoundations"]));
    expect(resultIds("recording")).toContain("trustFoundations");
    expect(resultIds("suburb")).toContain("locationDiscovery");
    expect(resultIds("age")).toContain("profileVisibility");
    expect(resultIds("readiness")).toContain("trustFoundations");
    expect(resultLabels("appearance")).toContain("Appearance");
  });

  it("limits duplicate destinations while keeping the best label first", () => {
    const results = getSettingsSearchResults("privacy");

    expect(new Set(results.map((result) => result.id)).size).toBe(results.length);
    expect(results[0]).toMatchObject({ id: "generalPrivacy", label: "Privacy" });
  });
});
