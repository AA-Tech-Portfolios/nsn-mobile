import { describe, expect, it } from "vitest";

import {
  meetupOptOutActions,
  meetupReadinessItems,
  meetupTutorialCards,
} from "./meetup-alpha-ux";

describe("meetup alpha UX copy", () => {
  it("covers readiness, opt-out, and tutorial surfaces without production claims", () => {
    const visibleCopy = [
      ...meetupReadinessItems.flatMap((item) => [item.title, item.copy]),
      ...meetupOptOutActions.flatMap((item) => [item.label, item.copy, item.result]),
      ...meetupTutorialCards.flatMap((item) => [item.title, item.copy, item.actionLabel]),
    ].join(" ");

    expect(meetupReadinessItems.map((item) => item.id)).toEqual([
      "expect",
      "meeting-point",
      "host-note",
      "plan",
      "comfort",
      "backup",
      "exit",
    ]);
    expect(meetupOptOutActions.map((item) => item.label)).toEqual([
      "Leave this meetup",
      "Not the right fit",
      "Change group",
      "Find a calmer option",
      "Hide this event",
      "Maybe another time",
    ]);
    expect(meetupTutorialCards.map((item) => item.id)).toEqual([
      "privacy",
      "visibility-preview",
      "comfort-modes",
      "meetup-readiness",
      "soft-exit",
    ]);
    expect(visibleCopy).toContain("prototype");
    expect(visibleCopy).toContain("local");
    expect(visibleCopy).toContain("no live safety");
    expect(visibleCopy).not.toMatch(/\bguarantee|verified|verification|moderation|analytics|payment|AI agent|matching quality\b/i);
    expect(visibleCopy).not.toMatch(/\blive host tracking|connected emergency support\b/i);
  });
});
