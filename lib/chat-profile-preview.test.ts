import { describe, expect, it } from "vitest";

import { getChatProfilePreview } from "./chat-profile-preview";

describe("chat profile previews", () => {
  it("shows Maya as a warmer partly visible profile", () => {
    const preview = getChatProfilePreview("maya-host");

    expect(preview?.displayName).toBe("Maya");
    expect(preview?.privacyMode).toBe("Warm Up Mode");
    expect(preview?.about).toBeTruthy();
    expect(preview?.sharedInterests.length).toBeGreaterThan(1);
    expect(preview?.photoBoundary).toContain("Ask before photos");
  });

  it("keeps James more private and hides richer details", () => {
    const preview = getChatProfilePreview("james-member");

    expect(preview?.displayName).toBe("James");
    expect(preview?.privacyMode).toBe("Comfort Mode");
    expect(preview?.avatarPrivate).toBe(true);
    expect(preview?.about).toBeUndefined();
    expect(preview?.sharedInterests.length).toBeLessThanOrEqual(2);
    expect(preview?.hiddenDetailNote).toMatch(/private/i);
  });

  it("does not expose exact addresses, schedules, routines, or hidden profile details", () => {
    const visibleText = ["maya-host", "james-member"]
      .map((personId) => JSON.stringify(getChatProfilePreview(personId)))
      .join(" ")
      .toLowerCase();

    expect(visibleText).not.toMatch(/address|exact|routine|schedule|workplace|apartment|street/);
  });
});
