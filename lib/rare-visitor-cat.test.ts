import AsyncStorage from "@react-native-async-storage/async-storage";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  chooseRareVisitorMessage,
  getRareVisitorDisplayPlan,
  getRareVisitorOverlayProps,
  isRareVisitorRouteEligible,
  readRareVisitorLastSeenAt,
  recordRareVisitorSeen,
  shouldShowRareVisitor,
} from "./rare-visitor-cat";

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(async () => null),
    setItem: vi.fn(async () => undefined),
  },
}));

describe("rare visitor cat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("appears only when the rare roll passes and the cooldown has elapsed", () => {
    const now = Date.parse("2026-06-18T10:00:00.000Z");
    const eightDaysAgo = new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString();

    expect(
      shouldShowRareVisitor({
        now,
        lastSeenAt: eightDaysAgo,
        randomValue: 0.019,
        probability: 0.02,
        cooldownDays: 7,
        routeSegments: ["(tabs)", "index"],
      }),
    ).toBe(true);

    expect(
      shouldShowRareVisitor({
        now,
        lastSeenAt: eightDaysAgo,
        randomValue: 0.2,
        probability: 0.02,
        cooldownDays: 7,
        routeSegments: ["(tabs)", "index"],
      }),
    ).toBe(false);

    expect(
      shouldShowRareVisitor({
        now,
        lastSeenAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
        randomValue: 0.001,
        probability: 0.02,
        cooldownDays: 7,
        routeSegments: ["(tabs)", "index"],
      }),
    ).toBe(false);
  });

  it("treats reduced motion as a brief static visit instead of a walk animation", () => {
    expect(getRareVisitorDisplayPlan({ reducedMotion: false })).toMatchObject({
      shouldAnimate: true,
      durationMs: 11000,
    });

    expect(getRareVisitorDisplayPlan({ reducedMotion: true })).toMatchObject({
      shouldAnimate: false,
      durationMs: 1500,
    });
  });

  it("does not appear on onboarding, login, safety, reporting, or RSVP-adjacent routes", () => {
    expect(isRareVisitorRouteEligible(["onboarding"])).toBe(false);
    expect(isRareVisitorRouteEligible(["oauth", "callback"])).toBe(false);
    expect(isRareVisitorRouteEligible(["support-guidance", "preparedness"])).toBe(false);
    expect(isRareVisitorRouteEligible(["(tabs)", "chats"])).toBe(false);
    expect(isRareVisitorRouteEligible(["event", "coffee-lane-cove"])).toBe(false);
    expect(isRareVisitorRouteEligible(["(tabs)", "index"])).toBe(true);
    expect(isRareVisitorRouteEligible(["(tabs)", "meetups"])).toBe(true);
  });

  it("keeps messages optional and subtle", () => {
    expect(chooseRareVisitorMessage(0.9)).toBeNull();
    expect(chooseRareVisitorMessage(0.01)).toBe("Cat inspection complete.");
    expect(chooseRareVisitorMessage(0.2)).toBe("Rio approves of this meetup.");
  });

  it("renders as a non-blocking overlay contract", () => {
    expect(getRareVisitorOverlayProps()).toEqual({
      pointerEvents: "none",
      accessibilityElementsHidden: true,
      importantForAccessibility: "no-hide-descendants",
    });
  });

  it("stores the last seen timestamp in lightweight AsyncStorage", async () => {
    vi.mocked(AsyncStorage.getItem).mockResolvedValueOnce("2026-06-10T10:00:00.000Z");

    await expect(readRareVisitorLastSeenAt()).resolves.toBe("2026-06-10T10:00:00.000Z");
    await recordRareVisitorSeen("2026-06-18T10:00:00.000Z");

    expect(AsyncStorage.getItem).toHaveBeenCalledWith("nsn.rare-visitor-cat.last-seen.v1");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "nsn.rare-visitor-cat.last-seen.v1",
      "2026-06-18T10:00:00.000Z",
    );
  });
});
