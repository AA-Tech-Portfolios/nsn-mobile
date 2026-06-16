import {
  canSubmitGroupForReview,
  groupSafetyCopy,
  isGroupDiscoverable,
  submitGroupForReview,
  validateGroupContent,
  type GroupCreatorReadiness,
  type GroupModerationStatus,
  type GroupSafetyCategory,
  type GroupVisibility,
  type NsnGroup,
} from "./group-safety";
import type { SoftHelloVerificationLevel } from "./softhello-mvp";

export type VisibleGroupCreationDraft = {
  creatorId: string;
  description: string;
  name: string;
  visibility: GroupVisibility;
};

export type VisibleGroupCreationResult =
  | { ok: true; group: NsnGroup; notice: string }
  | { ok: false; notice: string; group?: undefined };

export type GroupModerationAction = "approve" | "needs_changes" | "reject";

export type PendingGroupReviewItem = {
  id: string;
  creatorId: string;
  creatorReadinessSummary: string;
  description: string;
  name: string;
  prototypeLabel: "Prototype admin preview only";
  safetyCategories: GroupSafetyCategory[];
  safetyCheckSummary: string;
  visibility: GroupVisibility;
};

export function getDemoGroupCreatorReadiness(
  verificationLevel: SoftHelloVerificationLevel,
  overrides: Partial<GroupCreatorReadiness> = {}
): GroupCreatorReadiness {
  const hasPrototypeReadiness = verificationLevel === "Prototype readiness reviewed";

  return {
    accountAgeDays: 14,
    completedOnboarding: hasPrototypeReadiness,
    hasRecentSafetyFlags: false,
    prototypeVerified: hasPrototypeReadiness,
    // Alpha placeholder: later this should come from auth email state and backend trust signals.
    emailVerified: hasPrototypeReadiness,
    ...overrides,
  };
}

export function submitVisibleGroupCreation(
  draft: VisibleGroupCreationDraft,
  creatorReadiness: GroupCreatorReadiness,
  now = new Date().toISOString()
): VisibleGroupCreationResult {
  const result = submitGroupForReview(
    {
      creatorId: draft.creatorId,
      description: draft.description,
      name: draft.name,
      visibility: draft.visibility,
    },
    creatorReadiness,
    now
  );

  if (!result.ok) {
    return { ok: false, notice: result.error };
  }

  return { ok: true, group: result.group, notice: result.message };
}

export function getCreatedGroupReviewState(group: Pick<NsnGroup, "moderationStatus" | "visibility">) {
  if (isGroupDiscoverable(group)) {
    return {
      discoverable: true,
      label: "Public",
      message: "Approved for nearby discovery.",
    };
  }

  if (group.moderationStatus === "pending_review") {
    return {
      discoverable: false,
      label: "Pending review",
      message: group.visibility === "public" ? "Saved for review before public discovery." : "Private group saved for review.",
    };
  }

  if (group.moderationStatus === "needs_changes" || group.moderationStatus === "rejected") {
    return {
      discoverable: false,
      label: "Needs changes",
      message: groupSafetyCopy.needsChanges,
    };
  }

  return {
    discoverable: false,
    label: group.visibility === "private" ? "Private" : "Draft",
    message: group.visibility === "private" ? "Invite-only and not discoverable." : "Not visible publicly yet.",
  };
}

export function canUseVisibleGroupCreation(readiness: GroupCreatorReadiness) {
  return canSubmitGroupForReview(readiness).allowed;
}

export function getPrototypeCreatorReadinessSummary(readiness: GroupCreatorReadiness) {
  const eligibility = canSubmitGroupForReview(readiness);

  if (eligibility.allowed) {
    return "Prototype ready: onboarding complete, contact preview reviewed, no recent local flags.";
  }

  const reasonLabels: Record<string, string> = {
    complete_onboarding: "onboarding incomplete",
    verify_contact: "contact preview not reviewed",
    recent_safety_flags: "recent local safety flags",
    new_account: "new local account",
  };

  return `Needs review: ${eligibility.reasons.map((reason) => reasonLabels[reason]).join(", ")}.`;
}

function getSafetyCheckSummary(group: Pick<NsnGroup, "description" | "name">) {
  const result = validateGroupContent(group);

  return {
    categories: result.categories,
    summary: result.allowed
      ? "No local keyword flags found."
      : `Local keyword check flagged: ${result.categories.length ? result.categories.join(", ") : "name clarity"}.`,
  };
}

export function getPendingGroupReviewItems(
  groups: NsnGroup[],
  creatorReadinessById: Record<string, GroupCreatorReadiness>
): PendingGroupReviewItem[] {
  return groups
    .filter((group) => group.moderationStatus === "pending_review")
    .map((group) => {
      const safety = getSafetyCheckSummary(group);
      const readiness = creatorReadinessById[group.creatorId] ?? {
        completedOnboarding: false,
        hasRecentSafetyFlags: false,
        prototypeVerified: false,
      };

      return {
        id: group.id,
        creatorId: group.creatorId,
        creatorReadinessSummary: getPrototypeCreatorReadinessSummary(readiness),
        description: group.description,
        name: group.name,
        prototypeLabel: "Prototype admin preview only",
        safetyCategories: safety.categories,
        safetyCheckSummary: safety.summary,
        visibility: group.visibility,
      };
    });
}

function getModerationStatusForAction(action: GroupModerationAction): GroupModerationStatus {
  if (action === "approve") return "approved";
  if (action === "needs_changes") return "needs_changes";
  return "rejected";
}

export function applyGroupModerationAction(
  groups: NsnGroup[],
  groupId: string,
  action: GroupModerationAction,
  now = new Date().toISOString()
) {
  const moderationStatus = getModerationStatusForAction(action);

  return groups.map((group) =>
    group.id === groupId
      ? {
          ...group,
          moderationStatus,
          updatedAt: now,
        }
      : group
  );
}
