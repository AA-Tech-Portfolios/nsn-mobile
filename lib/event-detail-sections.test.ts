import { describe, expect, it } from "vitest";

import {
  eventDetailSectionPlan,
  eventDetailViewModes,
  getVisibleEventDetailSections,
  getInitialExpandedEventDetailSections,
  getEventDetailSupportBlockOrder,
  initialExpandedEventDetailSections,
} from "./event-detail-sections";

describe("event detail section plan", () => {
  it("merges the event detail page into five calmer sections", () => {
    expect(eventDetailSectionPlan.map((section) => section.title)).toEqual([
      "What to expect",
      "Optional conversation",
      "Finding the group",
      "Comfort & pacing",
      "Keeping things comfortable",
    ]);
  });

  it("keeps the legacy default export collapsed-safe", () => {
    expect(initialExpandedEventDetailSections).toEqual([]);
  });

  it("starts essential, detailed, and on-the-way modes collapsed by default", () => {
    expect(getInitialExpandedEventDetailSections("essential")).toEqual([]);
    expect(getInitialExpandedEventDetailSections("detailed")).toEqual([]);
    expect(getInitialExpandedEventDetailSections("onTheWay")).toEqual([]);
  });

  it("keeps social feel separate from arrival logistics", () => {
    const whatToExpect = eventDetailSectionPlan.find((section) => section.id === "whatToExpect");
    const arrival = eventDetailSectionPlan.find((section) => section.id === "arrival");

    expect(whatToExpect?.summary).toMatch(/social feel/i);
    expect(whatToExpect?.summary).not.toMatch(/weather|transport|accessibility/i);
    expect(arrival?.summary).toMatch(/where to go|landmark|join at your pace/i);
  });

  it("does not expose quick jump metadata for the event page", async () => {
    const sectionModule = await import("./event-detail-sections");

    expect("getEventDetailQuickJumpItems" in sectionModule).toBe(false);
  });

  it("defaults to an essential scan mode and keeps labels calm", () => {
    expect(eventDetailViewModes.map((mode) => mode.label)).toEqual([
      "Essential",
      "Detailed",
      "On the way",
    ]);
    expect(eventDetailViewModes.map((mode) => mode.helper)).toEqual([
      "Quick, warm overview",
      "Full event notes",
      "Find the group fast",
    ]);
    expect(eventDetailViewModes.find((mode) => mode.id === "essential")?.defaultMode).toBe(true);
  });

  it("shows only the shortest core sections in essential mode", () => {
    expect(getVisibleEventDetailSections("essential")).toEqual(["whatToExpect", "arrival"]);
  });

  it("keeps the full section set available in detailed mode", () => {
    expect(getVisibleEventDetailSections("detailed")).toEqual([
      "whatToExpect",
      "optionalConversation",
      "arrival",
      "comfortPacing",
      "safetyBoundaries",
    ]);
  });

  it("keeps on-the-way mode focused on arrival details", () => {
    expect(getVisibleEventDetailSections("onTheWay")).toEqual(["arrival"]);
  });

  it("keeps planning tools ahead of RSVP in the calmer support flow", () => {
    expect(getEventDetailSupportBlockOrder("essential")).toEqual(["planningTools", "rsvp"]);
    expect(getEventDetailSupportBlockOrder("detailed")).toEqual(["planningTools", "rsvp"]);
    expect(getEventDetailSupportBlockOrder("onTheWay")).toEqual(["rsvp"]);
  });
});
