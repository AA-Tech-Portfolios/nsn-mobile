import { describe, expect, it } from "vitest";

import { profileVisibilityPreviewCopy } from "./profile-visibility-copy";

describe("profile visibility preview copy", () => {
  it("describes preview visibility without safety or verification guarantees", () => {
    const visibleCopy = Object.values(profileVisibilityPreviewCopy).join(" ");

    expect(profileVisibilityPreviewCopy.privateProfileNote).toContain("local RSVP");
    expect(profileVisibilityPreviewCopy.prototypeDetailsNote).toMatch(/prototype/i);
    expect(visibleCopy).not.toMatch(/\bsafety|verified|verification|production trust|guarantee|guaranteed\b/i);
  });
});
