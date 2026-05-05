import { describe, expect, it } from "vitest";

import { isAllowedDisplayName } from "./profile-validation";

describe("profile validation", () => {
  it("accepts real-looking display names and nicknames", () => {
    expect(isAllowedDisplayName("Alon")).toBe(true);
    expect(isAllowedDisplayName("Sam Lee")).toBe(true);
    expect(isAllowedDisplayName("Maya-Rose")).toBe(true);
  });

  it("rejects blocked, gibberish, and unsafe names", () => {
    expect(isAllowedDisplayName("asdfasdf")).toBe(false);
    expect(isAllowedDisplayName("111222")).toBe(false);
    expect(isAllowedDisplayName("aaaaaa")).toBe(false);
    expect(isAllowedDisplayName("admin")).toBe(false);
    expect(isAllowedDisplayName("http://example.com")).toBe(false);
    expect(isAllowedDisplayName("Sam !!!")).toBe(false);
  });
});
