export type GroupVisibility = "public" | "private";

export type GroupModerationStatus = "draft" | "pending_review" | "approved" | "needs_changes" | "rejected";

export type GroupSafetyCategory =
  | "sexual_nsfw"
  | "hate"
  | "harassment"
  | "scam"
  | "impersonation"
  | "hookup_dating";

export type GroupCreatorReadiness = {
  completedOnboarding: boolean;
  emailVerified?: boolean;
  prototypeVerified?: boolean;
  hasRecentSafetyFlags?: boolean;
  recentSafetyReportCount?: number;
  accountAgeDays?: number;
};

export type CreatorEligibilityReason =
  | "complete_onboarding"
  | "verify_contact"
  | "recent_safety_flags"
  | "new_account";

export type NsnGroup = {
  id: string;
  creatorId: string;
  description: string;
  name: string;
  visibility: GroupVisibility;
  moderationStatus: GroupModerationStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateGroupInput = {
  creatorId: string;
  description: string;
  name: string;
  visibility?: GroupVisibility;
};

export const groupVisibilityOptions: GroupVisibility[] = ["public", "private"];

export const groupModerationStatusOptions: GroupModerationStatus[] = [
  "draft",
  "pending_review",
  "approved",
  "needs_changes",
  "rejected",
];

export const groupSafetyCopy = {
  visibility:
    "Public groups can be discovered by people nearby. Private groups are invite-only, but still need to follow NSN’s safety rules.",
  reviewSaved:
    "Your group is saved for review. We’ll check that the name, purpose, and visibility settings fit NSN’s community guidelines before it appears.",
  needsChanges:
    "This group name doesn’t fit NSN’s community guidelines. Try something clearer, safer, and easier for others to understand.",
  readiness: "Finish the basic readiness steps before sending a group for review.",
} as const;

const minimumAccountAgeDaysForReview = 1;

const contentPatterns: Record<GroupSafetyCategory, RegExp[]> = {
  sexual_nsfw: [
    /\bnsfw\b/i,
    /\bexplicit\b/i,
    /\bonlyfans\b/i,
    /\bsex(?:ual)?\b/i,
    /\bporn\b/i,
    /\bnudes?\b/i,
  ],
  hate: [
    /\bhate\s+(?:group|club|meet(?:up)?)\b/i,
    /\bnazi(?:s)?\b/i,
    /\bwhite\s+power\b/i,
    /\brace\s+war\b/i,
    /\bkill\s+(?:all|the)\b/i,
  ],
  harassment: [
    /\bbully(?:ing)?\b/i,
    /\bharass(?:ment|ing)?\b/i,
    /\bhumiliat(?:e|ing|ion)\b/i,
    /\bdoxx?(?:ing)?\b/i,
    /\bstalk(?:ing|er)?\b/i,
  ],
  scam: [
    /\bcash\s+giveaway\b/i,
    /\bcrypto\b/i,
    /\bforex\b/i,
    /\bget\s+rich\b/i,
    /\bmake\s+\$?\d+/i,
    /\bmoney[-\s]?making\b/i,
    /\bpassive\s+income\b/i,
    /\binvestment\s+scheme\b/i,
  ],
  impersonation: [
    /\bofficial\s+nsn\b/i,
    /\bnsn\s+admin\b/i,
    /\bnsn\s+staff\b/i,
    /\bmoderator\s+team\b/i,
    /\bverified\s+admin\b/i,
  ],
  hookup_dating: [
    /\bhook\s*ups?\b/i,
    /\bhookup\b/i,
    /\bdating\b/i,
    /\bsingles?\b/i,
    /\bflirt(?:ing)?\b/i,
    /\bfriends?\s+with\s+benefits\b/i,
    /\bafter\s*dark\b/i,
  ],
};

function normalizeGroupText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function createGroupId(name: string, creatorId: string, now: string) {
  const namePart = normalizeGroupText(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const creatorPart = normalizeGroupText(creatorId).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const timePart = `${Date.parse(now) || now}`.replace(/[^a-z0-9]+/gi, "");

  return [namePart || "group", creatorPart || "creator", timePart].join("-");
}

export function getGroupVisibilityCopy() {
  return groupSafetyCopy.visibility;
}

export function getGroupReviewCopy(status: GroupModerationStatus = "pending_review") {
  if (status === "needs_changes" || status === "rejected") {
    return groupSafetyCopy.needsChanges;
  }

  return groupSafetyCopy.reviewSaved;
}

export function createGroupDraft(input: CreateGroupInput, now = new Date().toISOString()): NsnGroup {
  const name = normalizeGroupText(input.name);
  const description = normalizeGroupText(input.description);

  return {
    id: createGroupId(name, input.creatorId, now),
    creatorId: input.creatorId,
    description,
    name,
    visibility: input.visibility ?? "public",
    moderationStatus: "draft",
    createdAt: now,
    updatedAt: now,
  };
}

export function validateGroupContent({
  description,
  name,
}: {
  description: string;
  name: string;
}): { allowed: true; categories: GroupSafetyCategory[]; message?: undefined } | { allowed: false; categories: GroupSafetyCategory[]; message: string } {
  const haystack = `${name} ${description}`;
  const categories = Object.entries(contentPatterns).flatMap(([category, patterns]) =>
    patterns.some((pattern) => pattern.test(haystack)) ? [category as GroupSafetyCategory] : []
  );

  if (!normalizeGroupText(name) || normalizeGroupText(name).length < 3 || categories.length > 0) {
    return {
      allowed: false,
      categories,
      message: groupSafetyCopy.needsChanges,
    };
  }

  return { allowed: true, categories: [] };
}

export function canSubmitGroupForReview(readiness: GroupCreatorReadiness): {
  allowed: boolean;
  reasons: CreatorEligibilityReason[];
  message?: string;
} {
  const reasons: CreatorEligibilityReason[] = [];

  if (!readiness.completedOnboarding) {
    reasons.push("complete_onboarding");
  }

  // Alpha placeholder: replace emailVerified/prototypeVerified with backend trust, auth, and abuse signals.
  if (!readiness.emailVerified && !readiness.prototypeVerified) {
    reasons.push("verify_contact");
  }

  if (readiness.hasRecentSafetyFlags || (readiness.recentSafetyReportCount ?? 0) > 0) {
    reasons.push("recent_safety_flags");
  }

  // Only apply this when account age exists; older demo records may not have that backend field yet.
  if (readiness.accountAgeDays !== undefined && readiness.accountAgeDays < minimumAccountAgeDaysForReview) {
    reasons.push("new_account");
  }

  return reasons.length === 0
    ? { allowed: true, reasons }
    : { allowed: false, reasons, message: groupSafetyCopy.readiness };
}

export function submitGroupForReview(
  input: CreateGroupInput | NsnGroup,
  creatorReadiness: GroupCreatorReadiness,
  now = new Date().toISOString()
):
  | { ok: true; group: NsnGroup; message: string }
  | { ok: false; error: string; reasons?: CreatorEligibilityReason[]; categories?: GroupSafetyCategory[] } {
  const group = "moderationStatus" in input ? input : createGroupDraft(input, now);
  const content = validateGroupContent(group);

  if (!content.allowed) {
    return { ok: false, error: content.message, categories: content.categories };
  }

  const eligibility = canSubmitGroupForReview(creatorReadiness);

  if (!eligibility.allowed) {
    return { ok: false, error: eligibility.message ?? groupSafetyCopy.readiness, reasons: eligibility.reasons };
  }

  return {
    ok: true,
    group: {
      ...group,
      moderationStatus: "pending_review",
      updatedAt: now,
    },
    message: groupSafetyCopy.reviewSaved,
  };
}

export function isGroupDiscoverable(group: Pick<NsnGroup, "moderationStatus" | "visibility">) {
  return group.visibility === "public" && group.moderationStatus === "approved";
}

export function filterDiscoverableGroups(groups: NsnGroup[]) {
  return groups.filter(isGroupDiscoverable);
}
