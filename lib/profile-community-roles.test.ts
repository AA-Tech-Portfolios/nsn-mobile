import { describe, expect, it } from "vitest";

import { communityRoleOptions, meetupAccessShortcutRows } from "./profile-community-roles";

describe("profile community roles planning metadata", () => {
  it("describes optional non-exclusive prototype roles without backend permissions", () => {
    expect(communityRoleOptions.map((role) => role.title)).toEqual([
      "Participant",
      "Host",
      "Co-host",
      "Volunteer/helper",
    ]);

    for (const role of communityRoleOptions) {
      expect(role.prototypeOnly).toBe(true);
      expect(role.copy).toMatch(/optional|local|prototype/i);
    }
  });

  it("adds meetup access shortcuts for creating and managing meetups", () => {
    expect(meetupAccessShortcutRows).toEqual([
      expect.objectContaining({ key: "createMeetup", title: "Create a Meetup", route: "/events", params: { action: "create" } }),
      expect.objectContaining({ key: "manageMeetups", title: "Manage My Meetups", route: "/events" }),
    ]);
  });
});
