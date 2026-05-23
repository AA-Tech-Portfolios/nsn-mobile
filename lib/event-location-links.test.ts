import { describe, expect, it } from "vitest";

import { buildEventLocationSearchUrl } from "./event-location-links";

describe("event location links", () => {
  it("builds a maps search URL for an event venue", () => {
    expect(buildEventLocationSearchUrl("Lane Cove Village")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Lane%20Cove%20Village"
    );
  });

  it("keeps the search useful when an area is available", () => {
    expect(buildEventLocationSearchUrl("Event Cinemas", "Macquarie Centre")).toBe(
      "https://www.google.com/maps/search/?api=1&query=Event%20Cinemas%20Macquarie%20Centre"
    );
  });
});
