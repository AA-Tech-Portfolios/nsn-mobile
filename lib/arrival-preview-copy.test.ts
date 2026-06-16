import { describe, expect, it } from "vitest";

import { getArrivalPreviewDetailChips } from "./arrival-preview-copy";

describe("arrival preview copy", () => {
  it("keeps landmark, meeting point, and confidence notes as readable summary chips", () => {
    expect(
      getArrivalPreviewDetailChips(
        {
          nearbyLandmark: "Near the cinema entrance",
          meetingPointHint: "Meet near the entrance before snacks",
          confidenceNotes: ["Short walk from station", "Indoor venue", "Clear meeting point"],
        },
        ["Fallback route"],
      ),
    ).toEqual([
      "Near the cinema entrance",
      "Meet near the entrance before snacks",
      "Short walk from station",
      "Indoor venue",
    ]);
  });

  it("uses fallback route details when event arrival preview copy is missing", () => {
    expect(getArrivalPreviewDetailChips(undefined, ["Check transport", "Step-free route nearby"])).toEqual([
      "Check transport",
      "Step-free route nearby",
    ]);
  });
});
