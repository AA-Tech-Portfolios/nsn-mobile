import { describe, expect, it } from "vitest";

import { englishSettingsPrivacyCopy } from "./settings-privacy-copy";

describe("Settings & Privacy copy", () => {
  it("keeps English settings wording prototype-realistic and low pressure", () => {
    const visibleCopy = Object.values(englishSettingsPrivacyCopy).join(" ");

    expect(englishSettingsPrivacyCopy.subtitle).toContain("prototype");
    expect(englishSettingsPrivacyCopy.revealAfterRsvpCopy).toContain("local RSVP state");
    expect(englishSettingsPrivacyCopy.friendsOfFriendsOnlyCopy).toContain("future idea");
    expect(englishSettingsPrivacyCopy.safetyCheckIns).toBe("Meetup check-in reminders");
    expect(visibleCopy).not.toMatch(/\bcommitted|trusted network|guarantee|guaranteed|verified|verification|matching|matchmaking\b/i);
  });
});
