import { describe, expect, it } from "vitest";

import { getMeetupEmptyStateCopy } from "./meetup-empty-state";

describe("meetup empty-state copy", () => {
  it("uses quiet-hours wording overnight", () => {
    expect(getMeetupEmptyStateCopy({ hour: 1, mode: "night", reason: "no-active-events" })).toEqual({
      title: "Quiet hours right now",
      copy: "NSN is taking the night softly. More local meetup ideas may appear later today.",
      suggestion: "This Sydney/North Shore alpha is still small and local.",
    });
  });

  it("uses early-morning calm wording before the day starts", () => {
    expect(getMeetupEmptyStateCopy({ hour: 6, mode: "day", reason: "no-active-events" }).title).toBe("Early morning calm");
  });

  it("uses evening winding-down wording late at night", () => {
    expect(getMeetupEmptyStateCopy({ hour: 22, mode: "night", reason: "no-active-events" }).title).toBe("Evening winding down");
  });

  it("suggests adjusting filters without harsh no-results wording", () => {
    expect(getMeetupEmptyStateCopy({ hour: 14, mode: "day", reason: "filtered" })).toEqual({
      title: "No meetup results for those filters yet",
      copy: "There may still be gentle options nearby. Try widening the filters or switching the layout density.",
      suggestion: "NSN is still a small Sydney/North Shore alpha community.",
    });
  });

  it("keeps search misses prototype-safe and non-urgent", () => {
    expect(getMeetupEmptyStateCopy({ hour: 19, mode: "night", reason: "search" })).toEqual({
      title: "No meetup result in the alpha yet",
      copy: "Try another suburb, activity, or a broader phrase. This local prototype has a small demo set.",
      suggestion: "Nothing has been hidden from you; there just may not be a demo meetup for that search yet.",
    });
  });

  it("avoids urgency, scarcity, growth, and matchmaking language", () => {
    const allCopy = [
      getMeetupEmptyStateCopy({ hour: 1, mode: "night", reason: "no-active-events" }),
      getMeetupEmptyStateCopy({ hour: 6, mode: "day", reason: "no-active-events" }),
      getMeetupEmptyStateCopy({ hour: 22, mode: "night", reason: "no-active-events" }),
      getMeetupEmptyStateCopy({ hour: 14, mode: "day", reason: "filtered" }),
      getMeetupEmptyStateCopy({ hour: 19, mode: "night", reason: "search" }),
    ]
      .flatMap((copy) => [copy.title, copy.copy, copy.suggestion])
      .join(" ");

    expect(allCopy).not.toMatch(/\bmatching|matchmaking|popular|limited|hurry|scarcity|growing\b/i);
  });
});
