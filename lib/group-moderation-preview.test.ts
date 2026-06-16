import { describe, expect, it } from "vitest";

import {
  applyGroupModerationAction,
  getCreatedGroupReviewState,
  getPendingGroupReviewItems,
  getPrototypeCreatorReadinessSummary,
  type GroupModerationAction,
} from "./group-creation-ui";
import { isGroupDiscoverable, type GroupCreatorReadiness, type NsnGroup } from "./group-safety";

const pendingPublicGroup: NsnGroup = {
  id: "board-games-maya-1",
  createdAt: "2026-06-16T04:30:00.000Z",
  creatorId: "maya-host",
  description: "A quiet local table for simple games and coffee.",
  moderationStatus: "pending_review",
  name: "Board Games Nearby",
  updatedAt: "2026-06-16T04:30:00.000Z",
  visibility: "public",
};

const readyCreator: GroupCreatorReadiness = {
  accountAgeDays: 21,
  completedOnboarding: true,
  emailVerified: true,
  hasRecentSafetyFlags: false,
  prototypeVerified: true,
};

describe("group moderation preview", () => {
  it("builds prototype-only pending review rows with safety and creator readiness summaries", () => {
    const rows = getPendingGroupReviewItems(
      [
        pendingPublicGroup,
        { ...pendingPublicGroup, id: "already-approved", moderationStatus: "approved" },
      ],
      { "maya-host": readyCreator }
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      creatorReadinessSummary: "Prototype ready: onboarding complete, contact preview reviewed, no recent local flags.",
      description: "A quiet local table for simple games and coffee.",
      id: "board-games-maya-1",
      name: "Board Games Nearby",
      prototypeLabel: "Prototype admin preview only",
      safetyCheckSummary: "No local keyword flags found.",
      visibility: "public",
    });
  });

  it.each<GroupModerationAction>(["approve", "needs_changes", "reject"])(
    "applies %s moderation transitions without changing unrelated groups",
    (action) => {
      const nextGroups = applyGroupModerationAction(
        [
          pendingPublicGroup,
          { ...pendingPublicGroup, id: "other-pending", name: "Other Pending" },
        ],
        "board-games-maya-1",
        action,
        "2026-06-16T05:00:00.000Z"
      );

      const changed = nextGroups.find((group) => group.id === "board-games-maya-1");
      const unchanged = nextGroups.find((group) => group.id === "other-pending");

      expect(changed?.updatedAt).toBe("2026-06-16T05:00:00.000Z");
      expect(unchanged?.moderationStatus).toBe("pending_review");
      expect(changed?.moderationStatus).toBe(
        action === "approve" ? "approved" : action === "needs_changes" ? "needs_changes" : "rejected"
      );
    }
  );

  it("makes approved public groups discoverable while needs changes and rejected stay hidden with calm copy", () => {
    const approved = applyGroupModerationAction([pendingPublicGroup], pendingPublicGroup.id, "approve")[0];
    const needsChanges = applyGroupModerationAction([pendingPublicGroup], pendingPublicGroup.id, "needs_changes")[0];
    const rejected = applyGroupModerationAction([pendingPublicGroup], pendingPublicGroup.id, "reject")[0];

    expect(approved.moderationStatus).toBe("approved");
    expect(needsChanges.moderationStatus).toBe("needs_changes");
    expect(rejected.moderationStatus).toBe("rejected");

    expect(isGroupDiscoverable(approved)).toBe(true);
    expect(isGroupDiscoverable(needsChanges)).toBe(false);
    expect(isGroupDiscoverable(rejected)).toBe(false);
    expect(getCreatedGroupReviewState(needsChanges).message).toBe(
      "This group name doesn’t fit NSN’s community guidelines. Try something clearer, safer, and easier for others to understand."
    );
    expect(getCreatedGroupReviewState(rejected).message).toBe(
      "This group name doesn’t fit NSN’s community guidelines. Try something clearer, safer, and easier for others to understand."
    );
    expect(getPendingGroupReviewItems([approved], { "maya-host": readyCreator })).toEqual([]);
    expect(getPrototypeCreatorReadinessSummary(readyCreator)).toContain("Prototype ready");
  });
});
