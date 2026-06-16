import { describe, expect, it } from "vitest";

import {
  getCreatedGroupReviewState,
  getDemoGroupCreatorReadiness,
  submitVisibleGroupCreation,
  type VisibleGroupCreationDraft,
} from "./group-creation-ui";
import type { NsnGroup } from "./group-safety";
import { getEffectivePrototypeVerificationLevel } from "./softhello-mvp";

const readyVerification = getEffectivePrototypeVerificationLevel(
  { contactEmail: "maya@example.com", identitySelfieUri: "file://selfie.jpg", hasIdentityDocument: true },
  "Readiness not reviewed"
);

const validDraft: VisibleGroupCreationDraft = {
  creatorId: "maya-host",
  description: "A quiet local table for simple games and coffee.",
  name: "Board Games Nearby",
  visibility: "public",
};

describe("group creation UI state", () => {
  it("submits valid visible group drafts into pending review", () => {
    const result = submitVisibleGroupCreation(
      validDraft,
      getDemoGroupCreatorReadiness(readyVerification),
      "2026-06-16T04:30:00.000Z"
    );

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error("Expected valid group creation to submit");
    expect(result.group).toMatchObject({
      moderationStatus: "pending_review",
      name: "Board Games Nearby",
      visibility: "public",
    });
    expect(result.notice).toContain("saved for review");
  });

  it("shows calm needs-changes messages before saving unsafe names", () => {
    const result = submitVisibleGroupCreation(
      {
        ...validDraft,
        description: "A private link for singles who want to hook up.",
        name: "Late Night Hookup Club",
        visibility: "private",
      },
      getDemoGroupCreatorReadiness(readyVerification)
    );

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected unsafe private group creation to be blocked");
    expect(result.notice).toBe(
      "This group name doesn’t fit NSN’s community guidelines. Try something clearer, safer, and easier for others to understand."
    );
    expect(result.group).toBeUndefined();
  });

  it("uses demo readiness signals to block unsafe creator submissions", () => {
    const result = submitVisibleGroupCreation(
      validDraft,
      getDemoGroupCreatorReadiness("Readiness not reviewed")
    );

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected not-ready creator to be blocked");
    expect(result.notice).toBe("Finish the basic readiness steps before sending a group for review.");
  });

  it("does not present public pending-review groups as discoverable", () => {
    const group: NsnGroup = {
      id: "board-games-maya-1",
      createdAt: "2026-06-16T04:30:00.000Z",
      creatorId: "maya-host",
      description: "A quiet local table for simple games and coffee.",
      moderationStatus: "pending_review",
      name: "Board Games Nearby",
      updatedAt: "2026-06-16T04:30:00.000Z",
      visibility: "public",
    };

    expect(getCreatedGroupReviewState(group)).toEqual({
      discoverable: false,
      label: "Pending review",
      message: "Saved for review before public discovery.",
    });
    expect(getCreatedGroupReviewState({ ...group, moderationStatus: "approved" })).toEqual({
      discoverable: true,
      label: "Public",
      message: "Approved for nearby discovery.",
    });
  });
});
