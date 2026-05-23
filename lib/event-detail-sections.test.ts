import { describe, expect, it } from "vitest";

import { eventDetailSectionPlan, getEventDetailQuickJumpItems, initialExpandedEventDetailSections } from "./event-detail-sections";

describe("event detail section plan", () => {
  it("merges the event detail page into five calmer sections", () => {
    expect(eventDetailSectionPlan.map((section) => section.title)).toEqual([
      "What to expect",
      "Optional conversation",
      "Arrival",
      "Comfort & pacing",
      "Safety & boundaries",
    ]);
  });

  it("keeps only the primary reading sections expanded initially", () => {
    expect(initialExpandedEventDetailSections).toEqual(["whatToExpect", "comfortPacing"]);
  });

  it("uses the same simplified labels for quick jump chips", () => {
    expect(getEventDetailQuickJumpItems()).toEqual([
      { section: "whatToExpect", label: "What to expect", iconName: "experience" },
      { section: "optionalConversation", label: "Optional conversation", iconName: "message" },
      { section: "arrival", label: "Arrival", iconName: "location" },
      { section: "comfortPacing", label: "Comfort & pacing", iconName: "low-pressure" },
      { section: "safetyBoundaries", label: "Safety & boundaries", iconName: "shield" },
    ]);
  });
});
