import { describe, expect, it } from "vitest";

import {
  canSubmitGroupForReview,
  createGroupDraft,
  getGroupReviewCopy,
  getGroupVisibilityCopy,
  isGroupDiscoverable,
  submitGroupForReview,
  validateGroupContent,
  type GroupCreatorReadiness,
  type NsnGroup,
} from "./group-safety";

const readyCreator: GroupCreatorReadiness = {
  accountAgeDays: 21,
  completedOnboarding: true,
  hasRecentSafetyFlags: false,
  prototypeVerified: true,
};

describe("group safety controls", () => {
  it("only makes public groups discoverable after moderation approval", () => {
    const pendingPublicGroup: NsnGroup = createGroupDraft({
      creatorId: "maya-host",
      description: "A small local table for easy board games and coffee.",
      name: "Board Games Nearby",
      visibility: "public",
    });

    expect(pendingPublicGroup.moderationStatus).toBe("draft");
    expect(isGroupDiscoverable(pendingPublicGroup)).toBe(false);
    expect(isGroupDiscoverable({ ...pendingPublicGroup, moderationStatus: "pending_review" })).toBe(false);
    expect(isGroupDiscoverable({ ...pendingPublicGroup, moderationStatus: "approved" })).toBe(true);
    expect(isGroupDiscoverable({ ...pendingPublicGroup, visibility: "private", moderationStatus: "approved" })).toBe(false);
  });

  it("checks private group names and descriptions for inappropriate content", () => {
    const result = submitGroupForReview(
      {
        creatorId: "jordan-member",
        description: "Private invite link for singles who want to hook up after meetups.",
        name: "Late Night Hookup Club",
        visibility: "private",
      },
      readyCreator
    );

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected private group submission to be blocked");
    expect(result.error).toBe(
      "This group name doesn’t fit NSN’s community guidelines. Try something clearer, safer, and easier for others to understand."
    );
  });

  it("returns calm guidance for flagged group names", () => {
    const result = validateGroupContent({
      description: "Pretending to be staff so people trust this group.",
      name: "Official NSN Admin Cash Giveaway",
    });

    expect(result.allowed).toBe(false);
    expect(result.message).toBe(
      "This group name doesn’t fit NSN’s community guidelines. Try something clearer, safer, and easier for others to understand."
    );
    expect(result.categories).toEqual(expect.arrayContaining(["impersonation", "scam"]));
  });

  it("allows valid drafts and submissions to move into review", () => {
    const draft = createGroupDraft({
      creatorId: "nsn-tester",
      description: "A quiet invite-only group for library study breaks and gentle hellos.",
      name: "Library Study Breaks",
      visibility: "private",
    });

    expect(draft.visibility).toBe("private");
    expect(draft.moderationStatus).toBe("draft");
    expect(validateGroupContent(draft).allowed).toBe(true);

    const submitted = submitGroupForReview(draft, readyCreator);

    expect(submitted).toMatchObject({
      ok: true,
      group: {
        moderationStatus: "pending_review",
        visibility: "private",
      },
      message:
        "Your group is saved for review. We’ll check that the name, purpose, and visibility settings fit NSN’s community guidelines before it appears.",
    });
  });

  it("blocks submissions when creator readiness signals are not enough", () => {
    const notReadyCreator: GroupCreatorReadiness = {
      accountAgeDays: 0,
      completedOnboarding: false,
      emailVerified: false,
      hasRecentSafetyFlags: true,
      prototypeVerified: false,
    };

    expect(canSubmitGroupForReview(notReadyCreator)).toMatchObject({
      allowed: false,
      reasons: expect.arrayContaining(["complete_onboarding", "verify_contact", "recent_safety_flags", "new_account"]),
    });

    const result = submitGroupForReview(
      {
        creatorId: "throwaway",
        description: "A calm walk for people nearby.",
        name: "Quiet Walk Nearby",
        visibility: "public",
      },
      notReadyCreator
    );

    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected unsafe creator submission to be blocked");
    expect(result.error).toBe("Finish the basic readiness steps before sending a group for review.");
  });

  it("keeps visibility copy clear that private groups still follow safety rules", () => {
    expect(getGroupVisibilityCopy()).toBe(
      "Public groups can be discovered by people nearby. Private groups are invite-only, but still need to follow NSN’s safety rules."
    );
    expect(getGroupReviewCopy("rejected")).toBe(
      "This group name doesn’t fit NSN’s community guidelines. Try something clearer, safer, and easier for others to understand."
    );
  });
});
