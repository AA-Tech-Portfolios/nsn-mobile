import { describe, expect, it } from "vitest";

import {
  createSoftRevealRequest,
  getSoftRevealIndicator,
  getSoftRevealMilestonePrompt,
  respondToSoftRevealRequest,
  softRevealPreferenceMismatchCopy,
  type SoftRevealPreferences,
} from "./soft-reveal";

const gradual: SoftRevealPreferences = {
  suggestionsEnabled: true,
  revealPace: "Gradual reveal",
  preferSoftRevealPeople: false,
};

const sooner: SoftRevealPreferences = {
  suggestionsEnabled: true,
  revealPace: "Comfortable sooner",
  preferSoftRevealPeople: true,
};

describe("soft reveal consent flow", () => {
  it("allows early mutual reveal before seven days when both people accept", () => {
    const request = createSoftRevealRequest({
      requestedBy: "me",
      targetLevel: "Softer blur",
      currentLevel: "High blur",
      chatStartedAt: "2026-05-28T10:00:00.000Z",
      requestedAt: "2026-05-31T10:00:00.000Z",
    });

    const result = respondToSoftRevealRequest(request, "them", "Accept");

    expect(result.revealLevel).toBe("Softer blur");
    expect(result.changed).toBe(true);
    expect(result.request.status).toBe("accepted");
  });

  it("keeps the current blur when only one person accepts", () => {
    const request = createSoftRevealRequest({
      requestedBy: "me",
      targetLevel: "Softer blur",
      currentLevel: "High blur",
      chatStartedAt: "2026-05-20T10:00:00.000Z",
      requestedAt: "2026-05-31T10:00:00.000Z",
    });

    expect(request.revealLevel).toBe("High blur");
    expect(request.status).toBe("pending");
  });

  it("shows yellow helper copy when only one person has suggestions enabled", () => {
    const prompt = getSoftRevealMilestonePrompt({
      myPreferences: gradual,
      theirPreferences: { ...gradual, suggestionsEnabled: false },
      chatStartedAt: "2026-05-20T10:00:00.000Z",
      now: "2026-05-31T10:00:00.000Z",
      currentLevel: "High blur",
    });

    expect(prompt).toEqual({
      kind: "helper",
      tone: "yellow",
      copy: softRevealPreferenceMismatchCopy,
    });
  });

  it("suggests gentle reveal steps at seven and fourteen days", () => {
    const sevenDayPrompt = getSoftRevealMilestonePrompt({
      myPreferences: gradual,
      theirPreferences: sooner,
      chatStartedAt: "2026-05-24T10:00:00.000Z",
      now: "2026-05-31T10:00:00.000Z",
      currentLevel: "High blur",
    });
    const fourteenDayPrompt = getSoftRevealMilestonePrompt({
      myPreferences: gradual,
      theirPreferences: sooner,
      chatStartedAt: "2026-05-17T10:00:00.000Z",
      now: "2026-05-31T10:00:00.000Z",
      currentLevel: "Softer blur",
    });

    expect(sevenDayPrompt).toMatchObject({
      kind: "suggestion",
      milestoneDays: 7,
      targetLevel: "Softer blur",
    });
    expect(fourteenDayPrompt).toMatchObject({
      kind: "suggestion",
      milestoneDays: 14,
      targetLevel: "Low blur",
    });
  });

  it("does not send milestone suggestions to manual-only users", () => {
    const prompt = getSoftRevealMilestonePrompt({
      myPreferences: { ...gradual, revealPace: "Manual only" },
      theirPreferences: sooner,
      chatStartedAt: "2026-05-17T10:00:00.000Z",
      now: "2026-05-31T10:00:00.000Z",
      currentLevel: "High blur",
    });

    expect(prompt).toEqual({ kind: "none" });
  });

  it("uses calm profile indicators without negative wording", () => {
    expect(getSoftRevealIndicator(sooner)).toBe("Soft Reveal available");
    expect(getSoftRevealIndicator(gradual)).toBe("Prefers gradual reveal");
    expect(getSoftRevealIndicator({ ...gradual, revealPace: "Manual only" })).toBe(
      "Manual reveal only",
    );
  });
});
