import { describe, expect, it } from "vitest";

import { eventCommunityGuidelinesCopy } from "./community-guidelines-copy";

describe("community guidelines copy", () => {
  it("keeps event detail reminders practical, consent-first, and prototype-safe", () => {
    const visibleCopy = Object.values(eventCommunityGuidelinesCopy).join(" ");

    expect(eventCommunityGuidelinesCopy.mediaTitle).toBe("Photo & recording comfort");
    expect(eventCommunityGuidelinesCopy.sectionTitle).toBe("Community guidelines");
    expect(visibleCopy).toContain("ask first");
    expect(visibleCopy).toContain("saved locally");
    expect(visibleCopy).not.toMatch(/\bguarantee|fully prevent|safety system|verified|verification|matching|matchmaking|urgent|popular|limited\b/i);
  });
});
