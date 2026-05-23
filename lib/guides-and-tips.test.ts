import { describe, expect, it } from "vitest";

import { getGuideTipForSurface, guidancePreferenceModes } from "./guides-and-tips";

describe("guides and tips", () => {
  it("keeps contextual tips short and low-pressure", () => {
    expect(getGuideTipForSurface("meetups").copy).toBe("You do not need to RSVP immediately. Browsing quietly is okay too.");
    expect(getGuideTipForSurface("profile").copy).toBe("Comfort preferences help people understand your social style gently.");
    expect(getGuideTipForSurface("chats").copy).toBe("Quiet participation is welcome.");
  });

  it("documents future guidance preference modes without implementing preference storage", () => {
    expect(guidancePreferenceModes).toEqual(["Minimal", "Gentle guidance", "Detailed onboarding"]);
  });
});
