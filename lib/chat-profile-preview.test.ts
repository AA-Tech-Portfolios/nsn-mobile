import { describe, expect, it } from "vitest";

import { getChatProfilePreview } from "./chat-profile-preview";

describe("chat profile previews", () => {
  it("shows Maya as a warmer partly visible profile", () => {
    const preview = getChatProfilePreview("maya-host");

    expect(preview?.displayName).toBe("Maya");
    expect(preview?.privacyMode).toBe("Warm Up Mode");
    expect(preview?.about).toBeTruthy();
    expect(preview?.sharedInterests.length).toBeGreaterThan(1);
    expect(preview?.connectionPromptSummary).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/starts conversations|smaller groups/i),
        expect.stringMatching(/Coffee|Japan/i),
        expect.stringMatching(/Appreciates/i),
      ]),
    );
    expect(preview?.photoBoundary).toContain("Ask before photos");
  });

  it("keeps Jordan more private and hides richer details", () => {
    const preview = getChatProfilePreview("jordan-member");

    expect(preview?.displayName).toBe("Jordan");
    expect(preview?.privacyMode).toBe("Comfort Mode");
    expect(preview?.avatarPrivate).toBe(true);
    expect(preview?.about).toBeUndefined();
    expect(preview?.sharedInterests.length).toBeLessThanOrEqual(2);
    expect(preview?.connectionPromptSummary.join(" ")).toContain("shy at first");
    expect(preview?.hiddenDetailNote).toMatch(/private/i);
  });

  it("does not expose exact addresses, schedules, routines, or hidden profile details", () => {
    const visibleText = ["nsn-tester", "maya-host", "jordan-member"]
      .map((personId) => JSON.stringify(getChatProfilePreview(personId)))
      .join(" ")
      .toLowerCase();

    expect(visibleText).not.toMatch(/address|exact|routine|schedule|workplace|apartment|street/);
    expect(visibleText).not.toMatch(/completion|score|rank|match percentage|degree|phd/);
  });
});
