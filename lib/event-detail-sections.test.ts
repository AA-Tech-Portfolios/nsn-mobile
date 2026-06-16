import { describe, expect, it } from "vitest";

import {
  eventDetailSectionPlan,
  initialExpandedEventDetailSections,
} from "./event-detail-sections";

describe("event detail section plan", () => {
  it("merges the event detail page into five calmer sections", () => {
    expect(eventDetailSectionPlan.map((section) => section.title)).toEqual([
      "What to expect",
      "Optional conversation",
      "Arrival",
      "Comfort & pacing",
      "Community guidelines",
    ]);
  });

  it("opens only the first event detail accordion initially", () => {
    expect(initialExpandedEventDetailSections).toEqual(["whatToExpect"]);
  });

  it("keeps social feel separate from arrival logistics", () => {
    const whatToExpect = eventDetailSectionPlan.find((section) => section.id === "whatToExpect");
    const arrival = eventDetailSectionPlan.find((section) => section.id === "arrival");

    expect(whatToExpect?.summary).toMatch(/social feel/i);
    expect(whatToExpect?.summary).not.toMatch(/weather|transport|accessibility/i);
    expect(arrival?.summary).toMatch(/weather|transport|accessibility/i);
  });

  it("does not expose quick jump metadata for the event page", async () => {
    const sectionModule = await import("./event-detail-sections");

    expect("getEventDetailQuickJumpItems" in sectionModule).toBe(false);
  });
});
