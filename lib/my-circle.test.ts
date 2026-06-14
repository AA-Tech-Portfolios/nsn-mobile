import { describe, expect, it } from "vitest";

import {
  getMyCirclePrototypeSummary,
  myCircleRelationshipOptions,
  prototypeMyCircleMembers,
} from "./my-circle";

describe("My Circle prototype data", () => {
  it("keeps trusted people local-only and relationship-based without contact imports", () => {
    expect(myCircleRelationshipOptions).toEqual([
      "Friend",
      "Family member",
      "Partner",
      "Support person",
      "Other trusted person",
    ]);
    expect(prototypeMyCircleMembers.map((member) => member.relationship)).toEqual(
      expect.arrayContaining(myCircleRelationshipOptions),
    );

    const visibleCopy = [
      getMyCirclePrototypeSummary(),
      ...prototypeMyCircleMembers.flatMap((member) => [
        member.displayName,
        member.relationship,
        member.note,
      ]),
    ].join(" ");

    expect(visibleCopy).toContain("local prototype");
    expect(visibleCopy).toContain("share or plan attendance");
    expect(visibleCopy).not.toMatch(
      /\bcontacts|address book|sync|import|invite|notification|backend|matching|score|rank|race|ethnicity|gender|religion|disability\b/i,
    );
  });
});
