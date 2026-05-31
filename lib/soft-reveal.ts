export type SoftRevealPace = "Comfortable sooner" | "Gradual reveal" | "Manual only";

export type SoftRevealBlurLevel = "High blur" | "Softer blur" | "Low blur" | "Revealed";

export type SoftRevealResponse = "Accept" | "Not yet" | "Decide later";

export type SoftRevealParticipant = "me" | "them";

export type SoftRevealPreferences = {
  suggestionsEnabled: boolean;
  revealPace: SoftRevealPace;
  preferSoftRevealPeople: boolean;
};

export type SoftRevealRequest = {
  requestedBy: SoftRevealParticipant;
  targetLevel: SoftRevealBlurLevel;
  revealLevel: SoftRevealBlurLevel;
  chatStartedAt: string;
  requestedAt: string;
  responses: Record<SoftRevealParticipant, SoftRevealResponse | "Pending">;
  status: "pending" | "accepted" | "paused";
};

export type SoftRevealPrompt =
  | {
      kind: "suggestion";
      milestoneDays: 7 | 14;
      targetLevel: SoftRevealBlurLevel;
      copy: string;
    }
  | {
      kind: "helper";
      tone: "yellow";
      copy: string;
    }
  | { kind: "none" };

export const softRevealPreferenceMismatchCopy =
  "Soft Reveal suggestions need both people to have them enabled. They may prefer a different privacy pace.";

const revealSteps: SoftRevealBlurLevel[] = ["High blur", "Softer blur", "Low blur", "Revealed"];

export function getSoftRevealIndicator(preferences: SoftRevealPreferences) {
  if (preferences.revealPace === "Manual only") return "Manual reveal only";
  if (preferences.revealPace === "Gradual reveal") return "Prefers gradual reveal";
  return "Soft Reveal available";
}

export function getNextSoftRevealLevel(currentLevel: SoftRevealBlurLevel) {
  const currentIndex = revealSteps.indexOf(currentLevel);
  if (currentIndex < 0) return "High blur";
  return revealSteps[Math.min(currentIndex + 1, revealSteps.length - 1)]!;
}

export function createSoftRevealRequest({
  requestedBy,
  targetLevel,
  currentLevel,
  chatStartedAt,
  requestedAt,
}: {
  requestedBy: SoftRevealParticipant;
  targetLevel: SoftRevealBlurLevel;
  currentLevel: SoftRevealBlurLevel;
  chatStartedAt: string;
  requestedAt: string;
}): SoftRevealRequest {
  return {
    requestedBy,
    targetLevel,
    revealLevel: currentLevel,
    chatStartedAt,
    requestedAt,
    responses: {
      me: requestedBy === "me" ? "Accept" : "Pending",
      them: requestedBy === "them" ? "Accept" : "Pending",
    },
    status: "pending",
  };
}

export function respondToSoftRevealRequest(
  request: SoftRevealRequest,
  participant: SoftRevealParticipant,
  response: SoftRevealResponse,
) {
  const responses = { ...request.responses, [participant]: response };
  const bothAccepted = responses.me === "Accept" && responses.them === "Accept";
  const requestPaused = response === "Not yet" || response === "Decide later";

  return {
    changed: bothAccepted,
    revealLevel: bothAccepted ? request.targetLevel : request.revealLevel,
    request: {
      ...request,
      responses,
      revealLevel: bothAccepted ? request.targetLevel : request.revealLevel,
      status: bothAccepted ? "accepted" : requestPaused ? "paused" : "pending",
    } satisfies SoftRevealRequest,
  };
}

export function getSoftRevealMilestonePrompt({
  myPreferences,
  theirPreferences,
  chatStartedAt,
  now,
  currentLevel,
}: {
  myPreferences: SoftRevealPreferences;
  theirPreferences: SoftRevealPreferences;
  chatStartedAt: string;
  now: string;
  currentLevel: SoftRevealBlurLevel;
}): SoftRevealPrompt {
  if (myPreferences.suggestionsEnabled !== theirPreferences.suggestionsEnabled) {
    return { kind: "helper", tone: "yellow", copy: softRevealPreferenceMismatchCopy };
  }

  if (
    !myPreferences.suggestionsEnabled ||
    myPreferences.revealPace === "Manual only" ||
    theirPreferences.revealPace === "Manual only" ||
    currentLevel === "Revealed"
  ) {
    return { kind: "none" };
  }

  const elapsedDays = getElapsedDays(chatStartedAt, now);
  if (elapsedDays >= 14 && currentLevel === "Softer blur") {
    return {
      kind: "suggestion",
      milestoneDays: 14,
      targetLevel: "Low blur",
      copy: "You have been chatting for two weeks. You can ask to lower blur another step if that feels comfortable for both of you.",
    };
  }

  if (elapsedDays >= 7 && currentLevel === "High blur") {
    return {
      kind: "suggestion",
      milestoneDays: 7,
      targetLevel: "Softer blur",
      copy: "You have been chatting for a week. You can ask to soften blur together, and nothing changes unless you both agree.",
    };
  }

  return { kind: "none" };
}

function getElapsedDays(start: string, end: string) {
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime) || endTime < startTime) return 0;
  return Math.floor((endTime - startTime) / 86_400_000);
}
