import { describe, expect, it } from "vitest";

import { englishEventCreationCopy } from "./event-creation-copy";

describe("event creation copy", () => {
  it("keeps hosting wording local, calm, and prototype-realistic", () => {
    const visibleCopy = Object.values(englishEventCreationCopy)
      .filter((value) => typeof value === "string")
      .join(" ");

    expect(englishEventCreationCopy.subtitle).toContain("local meetup ideas");
    expect(englishEventCreationCopy.sheetSubtitle).toContain("clear");
    expect(englishEventCreationCopy.verificationRequiredCopy).toContain("local prototype");
    expect(visibleCopy).not.toMatch(/\binvite others|trustworthy|identity review required|safety|guarantee|publish|scarcity|popular|matching\b/i);
  });
});
