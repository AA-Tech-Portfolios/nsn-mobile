import AsyncStorage from "@react-native-async-storage/async-storage";

import { rareVisitorCatConfig, rareVisitorCatMessages } from "../constants/rare-visitor-cat";

type RareVisitorRouteSegments = readonly string[];

type ShouldShowRareVisitorOptions = {
  now: number;
  lastSeenAt: string | null;
  randomValue: number;
  probability?: number;
  cooldownDays?: number;
  routeSegments: RareVisitorRouteSegments;
};

type RareVisitorDisplayPlanOptions = {
  reducedMotion: boolean;
};

export function normalizeRareVisitorRouteSegment(segment: string) {
  return segment.replace(/^\((.*)\)$/, "$1").toLowerCase();
}

export function isRareVisitorRouteEligible(routeSegments: RareVisitorRouteSegments) {
  const normalizedSegments = routeSegments.map(normalizeRareVisitorRouteSegment);
  const tabSegment = normalizedSegments[0] === "tabs" ? normalizedSegments[1] : undefined;

  if (tabSegment && !rareVisitorCatConfig.eligibleTabSegments.includes(tabSegment as never)) {
    return false;
  }

  return normalizedSegments.every((segment) => {
    if (rareVisitorCatConfig.excludedRouteSegments.includes(segment as never)) {
      return false;
    }

    return !rareVisitorCatConfig.excludedRouteTerms.some((term) => segment.includes(term));
  });
}

export function isRareVisitorCooldownElapsed(
  now: number,
  lastSeenAt: string | null,
  cooldownDays: number = rareVisitorCatConfig.cooldownDays,
) {
  if (!lastSeenAt) {
    return true;
  }

  const lastSeenMs = Date.parse(lastSeenAt);
  if (!Number.isFinite(lastSeenMs)) {
    return true;
  }

  return now - lastSeenMs >= cooldownDays * 24 * 60 * 60 * 1000;
}

export function shouldShowRareVisitor({
  now,
  lastSeenAt,
  randomValue,
  probability = rareVisitorCatConfig.probability,
  cooldownDays = rareVisitorCatConfig.cooldownDays,
  routeSegments,
}: ShouldShowRareVisitorOptions) {
  return (
    isRareVisitorRouteEligible(routeSegments) &&
    isRareVisitorCooldownElapsed(now, lastSeenAt, cooldownDays) &&
    randomValue < probability
  );
}

export function getRareVisitorDisplayPlan({ reducedMotion }: RareVisitorDisplayPlanOptions) {
  return {
    shouldAnimate: !reducedMotion,
    durationMs: reducedMotion
      ? rareVisitorCatConfig.reducedMotionDurationMs
      : rareVisitorCatConfig.animationDurationMs,
  };
}

export function chooseRareVisitorMessage(randomValue: number) {
  if (randomValue >= rareVisitorCatConfig.messageProbability) {
    return null;
  }

  const index = Math.min(Math.floor(randomValue / 0.15), rareVisitorCatMessages.length - 1);

  return rareVisitorCatMessages[index] ?? null;
}

export function getRareVisitorOverlayProps() {
  return {
    pointerEvents: "none" as const,
    accessibilityElementsHidden: true,
    importantForAccessibility: "no-hide-descendants" as const,
  };
}

export async function readRareVisitorLastSeenAt() {
  return AsyncStorage.getItem(rareVisitorCatConfig.storageKey);
}

export async function recordRareVisitorSeen(timestamp: string) {
  await AsyncStorage.setItem(rareVisitorCatConfig.storageKey, timestamp);
}
