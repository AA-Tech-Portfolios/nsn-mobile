import { describe, expect, it } from "vitest";

import {
  appreciationNoteGuidance,
  connectionFirstProfilePrinciples,
  getConnectionFirstProfileRefreshPrompts,
  meaningfulMemorySection,
  profilePressureWarnings,
} from "./connection-first-profile";

describe("connection-first profile philosophy", () => {
  it("frames profiles as optional conversation aids rather than self-marketing", () => {
    const visibleText = JSON.stringify(connectionFirstProfilePrinciples);

    expect(connectionFirstProfilePrinciples.primaryDiscovery).toEqual([
      "Meetups",
      "Shared interests",
      "Events",
      "Community participation",
    ]);
    expect(connectionFirstProfilePrinciples.successThought).toBe("I'd like to talk with this person.");
    expect(visibleText).toMatch(/conversation aid/i);
    expect(visibleText).not.toMatch(/personal advertisement|compete|market yourself/i);
  });

  it("keeps profile refresh prompts optional and permanently dismissible", () => {
    const prompts = getConnectionFirstProfileRefreshPrompts();

    expect(prompts).toEqual([
      {
        id: "interests",
        prompt: "Are these interests still relevant?",
        actionLabel: "Update if you'd like",
        dismissPermanentlyLabel: "Don't ask again",
      },
      {
        id: "localArea",
        prompt: "Would you like to update your local area?",
        actionLabel: "Update if you'd like",
        dismissPermanentlyLabel: "Don't ask again",
      },
      {
        id: "meetupPreferences",
        prompt: "Have your meetup preferences changed?",
        actionLabel: "Review if you'd like",
        dismissPermanentlyLabel: "Don't ask again",
      },
    ]);
  });

  it("defines meaningful memories as reflective profile context, not a feed", () => {
    expect(meaningfulMemorySection.titleOptions).toEqual([
      "Meaningful Memories",
      "Appreciated Moments",
      "Things I'm Glad Happened",
    ]);
    expect(meaningfulMemorySection.examples).toContain("Attended my first meetup and felt welcomed.");
    expect(meaningfulMemorySection.purpose).toMatch(/self-expression, reflection, and connection/i);
    expect(meaningfulMemorySection.notAFeed).toBe(true);
  });

  it("treats appreciation notes as human messages without ratings or reputation scoring", () => {
    const visibleText = [
      appreciationNoteGuidance.purpose,
      ...appreciationNoteGuidance.examples,
    ].join(" ");

    expect(appreciationNoteGuidance.examples).toContain(
      "Thank you for making me feel comfortable at my first meetup.",
    );
    expect(appreciationNoteGuidance.not).toEqual(["Ratings", "Reviews", "Endorsements", "Reputation scores"]);
    expect(visibleText).toMatch(/human and personal/i);
    expect(visibleText).not.toMatch(/rating|review|endorsement|score|reputation/i);
  });

  it("blocks profile completion pressure and popularity mechanics from profile copy", () => {
    expect(profilePressureWarnings.disallowedProfilePressure).toEqual([
      "Profile completion percentages",
      "Your profile is incomplete",
      "Mandatory social sharing",
      "Excessive prompts",
    ]);
    expect(profilePressureWarnings.disallowedPopularityMechanics).toEqual([
      "Follower counts",
      "Like counts",
      "Popularity rankings",
      "Public engagement metrics",
    ]);
  });
});
